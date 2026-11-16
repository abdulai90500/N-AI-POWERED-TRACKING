from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date, timedelta, timezone
from app.db.session import get_db
from app.core.deps import get_current_user, require_roles
from app.models.entities import ProductionBatch, Product, ProductionLine, BatchQRCode, AuditLog, User
from app.schemas.schemas import BatchCreate, BatchUpdate, BatchResponse
from app.services.qr_service import generate_qr_token, generate_qr_svg

router = APIRouter(prefix="/production", tags=["Production Management"])

@router.get("/batches", response_model=List[BatchResponse])
def list_batches(
    status: Optional[str] = None,
    product_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(ProductionBatch).filter(ProductionBatch.company_id == current_user.company_id)
    if status:
        query = query.filter(ProductionBatch.status == status)
    if product_id:
        query = query.filter(ProductionBatch.product_id == product_id)
    
    batches = query.order_by(ProductionBatch.created_at.desc()).all()
    results = []
    for b in batches:
        token = b.qr_code.token if b.qr_code else None
        results.append(BatchResponse(
            id=b.id,
            company_id=b.company_id,
            product_id=b.product_id,
            production_line_id=b.production_line_id,
            batch_number=b.batch_number,
            production_date=b.production_date,
            expiry_date=b.expiry_date,
            quantity_produced=b.quantity_produced,
            quantity_rejected=b.quantity_rejected,
            status=b.status,
            created_at=b.created_at,
            product_name=b.product.name if b.product else None,
            product_category=b.product.category if b.product else None,
            line_name=b.production_line.name if b.production_line else None,
            qr_token=token
        ))
    return results

@router.post("/batches", response_model=BatchResponse)
def create_batch(
    data: BatchCreate,
    current_user: User = Depends(require_roles("Company Administrator", "Production Manager")),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == data.product_id,
        Product.company_id == current_user.company_id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Generate sequential batch number if not provided
    if not data.batch_number:
        year = data.production_date.year
        count = db.query(ProductionBatch).filter(
            ProductionBatch.company_id == current_user.company_id
        ).count() + 1
        batch_number = f"BTL-{year}-{count:03d}"
    else:
        batch_number = data.batch_number

    # Calculate default expiry date (12 months for water/soda) if not provided
    expiry = data.expiry_date or (data.production_date + timedelta(days=365))

    batch = ProductionBatch(
        company_id=current_user.company_id,
        product_id=data.product_id,
        production_line_id=data.production_line_id,
        batch_number=batch_number,
        production_date=data.production_date,
        expiry_date=expiry,
        quantity_produced=data.quantity_produced,
        quantity_rejected=data.quantity_rejected,
        status="pending_quality"
    )
    db.add(batch)
    db.flush()

    # Generate QR Code record
    qr_token = generate_qr_token()
    qr_svg = generate_qr_svg(qr_token)
    qr_code = BatchQRCode(
        company_id=current_user.company_id,
        batch_id=batch.id,
        token=qr_token,
        qr_svg=qr_svg
    )
    db.add(qr_code)

    # Audit log
    audit = AuditLog(
        company_id=current_user.company_id,
        user_id=current_user.id,
        action="CREATE_BATCH",
        entity_type="production_batch",
        entity_id=batch.id,
        details=f"Created batch {batch.batch_number} ({batch.quantity_produced} units)"
    )
    db.add(audit)
    db.commit()
    db.refresh(batch)

    return BatchResponse(
        id=batch.id,
        company_id=batch.company_id,
        product_id=batch.product_id,
        production_line_id=batch.production_line_id,
        batch_number=batch.batch_number,
        production_date=batch.production_date,
        expiry_date=batch.expiry_date,
        quantity_produced=batch.quantity_produced,
        quantity_rejected=batch.quantity_rejected,
        status=batch.status,
        created_at=batch.created_at,
        product_name=product.name,
        product_category=product.category,
        line_name=batch.production_line.name if batch.production_line else None,
        qr_token=qr_token
    )

@router.get("/batches/{batch_id}", response_model=BatchResponse)
def get_batch(
    batch_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    batch = db.query(ProductionBatch).filter(
        ProductionBatch.id == batch_id,
        ProductionBatch.company_id == current_user.company_id
    ).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    return BatchResponse(
        id=batch.id,
        company_id=batch.company_id,
        product_id=batch.product_id,
        production_line_id=batch.production_line_id,
        batch_number=batch.batch_number,
        production_date=batch.production_date,
        expiry_date=batch.expiry_date,
        quantity_produced=batch.quantity_produced,
        quantity_rejected=batch.quantity_rejected,
        status=batch.status,
        created_at=batch.created_at,
        product_name=batch.product.name if batch.product else None,
        product_category=batch.product.category if batch.product else None,
        line_name=batch.production_line.name if batch.production_line else None,
        qr_token=batch.qr_code.token if batch.qr_code else None
    )

@router.patch("/batches/{batch_id}", response_model=BatchResponse)
def update_batch(
    batch_id: str,
    data: BatchUpdate,
    current_user: User = Depends(require_roles("Company Administrator", "Production Manager")),
    db: Session = Depends(get_db)
):
    batch = db.query(ProductionBatch).filter(
        ProductionBatch.id == batch_id,
        ProductionBatch.company_id == current_user.company_id
    ).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    if data.quantity_produced is not None:
        batch.quantity_produced = data.quantity_produced
    if data.quantity_rejected is not None:
        batch.quantity_rejected = data.quantity_rejected
    if data.status is not None:
        batch.status = data.status

    db.commit()
    db.refresh(batch)

    return BatchResponse(
        id=batch.id,
        company_id=batch.company_id,
        product_id=batch.product_id,
        production_line_id=batch.production_line_id,
        batch_number=batch.batch_number,
        production_date=batch.production_date,
        expiry_date=batch.expiry_date,
        quantity_produced=batch.quantity_produced,
        quantity_rejected=batch.quantity_rejected,
        status=batch.status,
        created_at=batch.created_at,
        product_name=batch.product.name if batch.product else None,
        product_category=batch.product.category if batch.product else None,
        line_name=batch.production_line.name if batch.production_line else None,
        qr_token=batch.qr_code.token if batch.qr_code else None
    )

@router.get("/summary")
def get_production_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    batches = db.query(ProductionBatch).filter(ProductionBatch.company_id == current_user.company_id).all()
    total_produced = sum(b.quantity_produced for b in batches)
    total_rejected = sum(b.quantity_rejected for b in batches)
    rejection_rate = (total_rejected / total_produced * 100) if total_produced > 0 else 0.0

    status_counts = {}
    for b in batches:
        status_counts[b.status] = status_counts.get(b.status, 0) + 1

    return {
        "total_batches": len(batches),
        "total_bottles_produced": total_produced,
        "total_bottles_rejected": total_rejected,
        "rejection_rate_percent": round(rejection_rate, 2),
        "status_breakdown": status_counts
    }
