from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.entities import (
    BatchQRCode,
    ProductionBatch,
    QualityInspection,
    AIPrediction,
    InventoryMovement,
    DistributionOrder,
    Company,
    User
)
from app.schemas.schemas import (
    PublicBatchTrackingResponse,
    InternalBatchTrackingResponse,
    BatchResponse
)
from app.services.qr_service import generate_qr_svg, generate_qr_data_url

router = APIRouter(tags=["QR Batch Traceability"])

@router.get("/public/track/{token}", response_model=PublicBatchTrackingResponse)
def public_verify_batch(token: str, db: Session = Depends(get_db)):
    """
    Public QR verification endpoint for consumers, retailers, and health inspectors.
    Verifies authenticity, production & expiry dates, and regulatory quality release.
    """
    qr_record = db.query(BatchQRCode).filter(BatchQRCode.token == token).first()
    if not qr_record or not qr_record.batch:
        raise HTTPException(
            status_code=404,
            detail="Invalid QR Code: Product batch not found in national beverage registry."
        )

    batch = qr_record.batch
    company = batch.company

    # Determine public quality message
    if batch.status in ["approved", "in_inventory", "dispatched"]:
        quality_msg = "Passed Standard Quality & Food Safety Inspection"
        verif_msg = "Authentic Product Certified by Bottler Quality Assurance."
    elif batch.status == "rejected":
        quality_msg = "Failed Quality Compliance - Batch Not For Sale"
        verif_msg = "WARNING: This batch was rejected during quality inspection."
    else:
        quality_msg = "Under Quality Hold / In-Process"
        verif_msg = "This batch is currently undergoing quality certification."

    return PublicBatchTrackingResponse(
        is_authentic=True,
        batch_number=batch.batch_number,
        product_name=batch.product.name if batch.product else "Unknown Product",
        product_category=batch.product.category if batch.product else "Beverage",
        volume_ml=batch.product.volume_ml if batch.product else 500,
        company_name=company.name if company else "Licensed Sierra Leone Bottler",
        production_date=batch.production_date,
        expiry_date=batch.expiry_date,
        quality_status=quality_msg,
        verification_message=verif_msg
    )

@router.get("/tracking/batches/{batch_id}/history")
def get_internal_batch_history(
    batch_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Internal comprehensive traceability trail for authorized bottling company personnel.
    """
    batch = db.query(ProductionBatch).filter(
        ProductionBatch.id == batch_id,
        ProductionBatch.company_id == current_user.company_id
    ).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    # Inspections
    inspections = []
    for ins in batch.inspections:
        inspections.append({
            "id": ins.id,
            "status": ins.inspection_status,
            "inspector": ins.inspector_name,
            "date": ins.inspected_at,
            "remarks": ins.remarks,
            "measurements": [
                {
                    "parameter": m.parameter.parameter_name if m.parameter else m.parameter_name,
                    "measured": m.measured_value,
                    "result": m.result
                }
                for m in ins.measurements
            ]
        })

    # AI Predictions
    ai_history = []
    for p in batch.predictions:
        ai_history.append({
            "model": p.model_name,
            "type": p.prediction_type,
            "label": p.prediction_label,
            "risk_score": p.risk_score,
            "date": p.created_at
        })

    # Inventory movements
    movements = []
    for m in batch.inventory_movements:
        movements.append({
            "type": m.movement_type,
            "quantity": m.quantity,
            "warehouse": m.warehouse.name if m.warehouse else None,
            "reference": m.reference_id,
            "date": m.created_at
        })

    # Distribution orders
    orders = []
    linked_orders = db.query(DistributionOrder).filter(
        DistributionOrder.batch_id == batch.id,
        DistributionOrder.company_id == current_user.company_id
    ).all()
    for o in linked_orders:
        orders.append({
            "order_number": o.order_number,
            "customer": o.customer.name if o.customer else "Customer",
            "quantity": o.quantity_ordered,
            "status": o.status,
            "date": o.created_at
        })

    token = batch.qr_code.token if batch.qr_code else ""

    return {
        "batch": {
            "id": batch.id,
            "batch_number": batch.batch_number,
            "product_name": batch.product.name if batch.product else None,
            "category": batch.product.category if batch.product else None,
            "volume_ml": batch.product.volume_ml if batch.product else 500,
            "line_name": batch.production_line.name if batch.production_line else None,
            "production_date": batch.production_date,
            "expiry_date": batch.expiry_date,
            "quantity_produced": batch.quantity_produced,
            "quantity_rejected": batch.quantity_rejected,
            "status": batch.status
        },
        "company_name": batch.company.name if batch.company else None,
        "qr_token": token,
        "public_url": f"http://localhost:3000/track/{token}",
        "inspections": inspections,
        "ai_predictions": ai_history,
        "inventory_movements": movements,
        "distribution_orders": orders
    }

@router.get("/tracking/batches/{batch_id}/qr")
def get_batch_qr(
    batch_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    batch = db.query(ProductionBatch).filter(
        ProductionBatch.id == batch_id,
        ProductionBatch.company_id == current_user.company_id
    ).first()
    if not batch or not batch.qr_code:
        raise HTTPException(status_code=404, detail="QR Code not found for this batch")

    token = batch.qr_code.token
    data_url = generate_qr_data_url(token)
    svg = batch.qr_code.qr_svg or generate_qr_svg(token)

    return {
        "batch_id": batch.id,
        "batch_number": batch.batch_number,
        "token": token,
        "public_url": f"http://localhost:3000/track/{token}",
        "svg": svg,
        "data_url": data_url
    }
