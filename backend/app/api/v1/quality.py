from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import json
from app.db.session import get_db
from app.core.deps import get_current_user, require_roles
from app.models.entities import (
    QualityInspection,
    InspectionMeasurement,
    QualityParameter,
    ProductionBatch,
    Product,
    AIPrediction,
    Notification,
    AuditLog,
    User
)
from app.schemas.schemas import (
    QualityParameterCreate,
    QualityParameterResponse,
    QualityInspectionCreate,
    QualityInspectionResponse,
    MeasurementResponse
)
from app.ai.model_engine import ai_engine

router = APIRouter(prefix="/quality", tags=["Quality Control"])

@router.get("/parameters", response_model=List[QualityParameterResponse])
def list_parameters(
    product_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(QualityParameter).filter(QualityParameter.company_id == current_user.company_id)
    if product_id:
        query = query.filter(QualityParameter.product_id == product_id)
    return query.all()

@router.post("/parameters", response_model=QualityParameterResponse)
def create_parameter(
    data: QualityParameterCreate,
    current_user: User = Depends(require_roles("Company Administrator", "Quality Control Officer")),
    db: Session = Depends(get_db)
):
    param = QualityParameter(
        company_id=current_user.company_id,
        product_id=data.product_id,
        parameter_name=data.parameter_name,
        min_value=data.min_value,
        max_value=data.max_value,
        unit=data.unit,
        is_critical=data.is_critical
    )
    db.add(param)
    db.commit()
    db.refresh(param)
    return param

@router.get("/inspections", response_model=List[QualityInspectionResponse])
def list_inspections(
    batch_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(QualityInspection).filter(QualityInspection.company_id == current_user.company_id)
    if batch_id:
        query = query.filter(QualityInspection.batch_id == batch_id)
    inspections = query.order_by(QualityInspection.inspected_at.desc()).all()

    results = []
    for ins in inspections:
        meas_list = [
            MeasurementResponse(
                id=m.id,
                parameter_id=m.parameter_id,
                parameter_name=m.parameter.parameter_name if m.parameter else m.parameter_name,
                measured_value=m.measured_value,
                result=m.result,
                notes=m.notes
            )
            for m in ins.measurements
        ]
        results.append(QualityInspectionResponse(
            id=ins.id,
            batch_id=ins.batch_id,
            batch_number=ins.batch.batch_number if ins.batch else None,
            inspected_by=ins.inspected_by,
            inspector_name=ins.inspector_name,
            inspection_status=ins.inspection_status,
            remarks=ins.remarks,
            inspected_at=ins.inspected_at,
            measurements=meas_list
        ))
    return results

@router.post("/inspections", response_model=QualityInspectionResponse)
def submit_inspection(
    data: QualityInspectionCreate,
    current_user: User = Depends(require_roles("Company Administrator", "Quality Control Officer")),
    db: Session = Depends(get_db)
):
    batch = db.query(ProductionBatch).filter(
        ProductionBatch.id == data.batch_id,
        ProductionBatch.company_id == current_user.company_id
    ).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    overall_status = "passed"
    ph_val = 7.0
    volume_val = float(batch.product.volume_ml if batch.product else 500.0)
    torque_val = 1.8
    visual_defects = 0

    inspection = QualityInspection(
        company_id=current_user.company_id,
        batch_id=batch.id,
        inspected_by=current_user.id,
        inspector_name=current_user.full_name,
        inspection_status="pending",
        remarks=data.remarks
    )
    db.add(inspection)
    db.flush()

    for m_in in data.measurements:
        param = db.query(QualityParameter).filter(QualityParameter.id == m_in.parameter_id).first()
        res = "passed"
        if param:
            param_name_lower = param.parameter_name.lower()
            if "ph" in param_name_lower:
                ph_val = m_in.measured_value
            elif "volume" in param_name_lower:
                volume_val = m_in.measured_value
            elif "torque" in param_name_lower or "cap" in param_name_lower:
                torque_val = m_in.measured_value
            elif "visual" in param_name_lower or "defect" in param_name_lower:
                visual_defects = int(m_in.measured_value)

            if param.min_value is not None and m_in.measured_value < param.min_value:
                res = "out_of_spec"
                overall_status = "failed"
            elif param.max_value is not None and m_in.measured_value > param.max_value:
                res = "out_of_spec"
                overall_status = "failed"

        meas = InspectionMeasurement(
            inspection_id=inspection.id,
            parameter_id=m_in.parameter_id,
            parameter_name=param.parameter_name if param else m_in.parameter_name,
            measured_value=m_in.measured_value,
            result=res,
            notes=m_in.notes
        )
        db.add(meas)

    # Invoke AI Anomaly Detection & Failure Risk Prediction
    product_category = batch.product.category if batch.product else "Bottled Water"
    nominal_volume = float(batch.product.volume_ml if batch.product else 500.0)

    ai_anomaly = ai_engine.detect_anomaly(
        product_category=product_category,
        ph=ph_val,
        filling_volume=volume_val,
        nominal_volume=nominal_volume,
        cap_torque=torque_val,
        visual_defects=visual_defects
    )

    ai_risk = ai_engine.predict_failure_risk(
        product_category=product_category,
        ph=ph_val,
        filling_volume=volume_val,
        nominal_volume=nominal_volume,
        production_line=batch.production_line.name if batch.production_line else "Line 01"
    )

    # Store AI Predictions in database
    pred_anomaly = AIPrediction(
        company_id=current_user.company_id,
        batch_id=batch.id,
        model_name="Isolation Forest Anomaly Detector",
        model_version=ai_anomaly["model_version"],
        prediction_type="anomaly_detection",
        risk_score=ai_anomaly["anomaly_score"],
        prediction_label=f"Anomaly: {ai_anomaly['risk_level'].upper()}" if ai_anomaly["anomaly_detected"] else "Normal",
        explanation_json=json.dumps({
            "detected": ai_anomaly["anomaly_detected"],
            "reasons": ai_anomaly["reasons"],
            "recommendation": ai_anomaly["recommendation"]
        })
    )
    db.add(pred_anomaly)

    pred_risk = AIPrediction(
        company_id=current_user.company_id,
        batch_id=batch.id,
        model_name="Random Forest Quality Risk Classifier",
        model_version=ai_risk["model_version"],
        prediction_type="failure_prediction",
        risk_score=ai_risk["failure_probability"],
        prediction_label=ai_risk["risk_classification"],
        explanation_json=json.dumps({
            "probability": ai_risk["failure_probability"],
            "factors": ai_risk["contributing_factors"],
            "confidence": ai_risk["confidence_score"]
        })
    )
    db.add(pred_risk)

    # Set overall inspection status
    if overall_status == "failed" or ai_anomaly["risk_level"] in ["high", "critical"]:
        inspection.inspection_status = "failed" if overall_status == "failed" else "requires_review"
        batch.status = "rejected" if overall_status == "failed" else "inspecting"

        # Create alert notification
        notif = Notification(
            company_id=current_user.company_id,
            title=f"Quality Alert: Batch {batch.batch_number}",
            message=f"Batch {batch.batch_number} flagged: {', '.join(ai_anomaly['reasons']) if ai_anomaly['reasons'] else 'Out of spec measurement'}",
            alert_type="quality_alert"
        )
        db.add(notif)
    else:
        inspection.inspection_status = "passed"
        batch.status = "approved"

    db.commit()
    db.refresh(inspection)

    return QualityInspectionResponse(
        id=inspection.id,
        batch_id=inspection.batch_id,
        batch_number=batch.batch_number,
        inspected_by=inspection.inspected_by,
        inspector_name=inspection.inspector_name,
        inspection_status=inspection.inspection_status,
        remarks=inspection.remarks,
        inspected_at=inspection.inspected_at,
        measurements=[]
    )

@router.post("/batches/{batch_id}/release")
def release_batch(
    batch_id: str,
    current_user: User = Depends(require_roles("Company Administrator", "Quality Control Officer")),
    db: Session = Depends(get_db)
):
    """Authorizes quality release of inspected batch to inventory."""
    batch = db.query(ProductionBatch).filter(
        ProductionBatch.id == batch_id,
        ProductionBatch.company_id == current_user.company_id
    ).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    # Check that batch has passed inspection
    passed_inspection = db.query(QualityInspection).filter(
        QualityInspection.batch_id == batch.id,
        QualityInspection.inspection_status == "passed"
    ).first()

    if not passed_inspection and batch.status != "approved":
        raise HTTPException(
            status_code=400,
            detail="Batch cannot be released: Required quality inspection has not passed"
        )

    batch.status = "in_inventory"
    audit = AuditLog(
        company_id=current_user.company_id,
        user_id=current_user.id,
        action="RELEASE_BATCH",
        entity_type="production_batch",
        entity_id=batch.id,
        details=f"Batch {batch.batch_number} certified and released to inventory by {current_user.full_name}"
    )
    db.add(audit)
    db.commit()
    return {"message": f"Batch {batch.batch_number} successfully released to inventory", "status": batch.status}

@router.post("/batches/{batch_id}/reject")
def reject_batch(
    batch_id: str,
    reason: Optional[str] = "Quality criteria not met",
    current_user: User = Depends(require_roles("Company Administrator", "Quality Control Officer")),
    db: Session = Depends(get_db)
):
    batch = db.query(ProductionBatch).filter(
        ProductionBatch.id == batch_id,
        ProductionBatch.company_id == current_user.company_id
    ).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    batch.status = "rejected"
    audit = AuditLog(
        company_id=current_user.company_id,
        user_id=current_user.id,
        action="REJECT_BATCH",
        entity_type="production_batch",
        entity_id=batch.id,
        details=f"Batch {batch.batch_number} rejected. Reason: {reason}"
    )
    db.add(audit)
    db.commit()
    return {"message": f"Batch {batch.batch_number} marked as rejected", "status": batch.status}
