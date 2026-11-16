from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.core.deps import get_current_user, require_roles
from app.models.entities import Product, ProductionLine, QualityParameter, User
from app.schemas.schemas import (
    ProductCreate, ProductResponse,
    ProductionLineCreate, ProductionLineResponse,
    QualityParameterResponse
)

router = APIRouter(tags=["Products & Production Lines"])

@router.get("/products", response_model=List[ProductResponse])
def list_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Product).filter(Product.company_id == current_user.company_id).all()

@router.post("/products", response_model=ProductResponse)
def create_product(
    data: ProductCreate,
    current_user: User = Depends(require_roles("Company Administrator", "Production Manager")),
    db: Session = Depends(get_db)
):
    product = Product(
        company_id=current_user.company_id,
        name=data.name,
        category=data.category,
        volume_ml=data.volume_ml,
        description=data.description
    )
    db.add(product)
    db.flush()

    # Automatically set up industry standard baseline quality parameters for this product
    params = []
    if "water" in data.category.lower() or "water" in data.name.lower():
        params = [
            ("pH Level", 6.5, 8.0, "pH"),
            ("Filling Volume", float(data.volume_ml - 5), float(data.volume_ml + 5), "ml"),
            ("Cap Torque", 1.2, 2.4, "Nm"),
            ("Turbidity", 0.0, 1.0, "NTU"),
            ("Visual Appearance", 1.0, 1.0, "Pass=1.0"),
        ]
    elif "soft" in data.category.lower() or "cola" in data.name.lower():
        params = [
            ("pH Level", 2.4, 3.6, "pH"),
            ("Filling Volume", float(data.volume_ml - 7), float(data.volume_ml + 7), "ml"),
            ("Carbonation Volume", 3.0, 4.2, "vol"),
            ("Cap Torque", 1.4, 2.6, "Nm"),
            ("Brix (Sugar Content)", 10.0, 12.5, "°Bx"),
        ]
    else:
        params = [
            ("pH Level", 3.2, 4.6, "pH"),
            ("Filling Volume", float(data.volume_ml - 6), float(data.volume_ml + 6), "ml"),
            ("Cap Torque", 1.3, 2.5, "Nm"),
            ("Brix (Sugar Content)", 8.0, 14.0, "°Bx"),
            ("Visual Appearance", 1.0, 1.0, "Pass=1.0"),
        ]

    for p_name, min_v, max_v, unit in params:
        qp = QualityParameter(
            company_id=current_user.company_id,
            product_id=product.id,
            parameter_name=p_name,
            min_value=min_v,
            max_value=max_v,
            unit=unit,
            is_critical=True
        )
        db.add(qp)

    db.commit()
    db.refresh(product)
    return product

@router.get("/production-lines", response_model=List[ProductionLineResponse])
def list_production_lines(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(ProductionLine).filter(ProductionLine.company_id == current_user.company_id).all()

@router.post("/production-lines", response_model=ProductionLineResponse)
def create_production_line(
    data: ProductionLineCreate,
    current_user: User = Depends(require_roles("Company Administrator", "Production Manager")),
    db: Session = Depends(get_db)
):
    line = ProductionLine(
        company_id=current_user.company_id,
        name=data.name,
        line_code=data.line_code or f"LINE-{len(db.query(ProductionLine).filter(ProductionLine.company_id == current_user.company_id).all()) + 1:02d}",
        status=data.status or "operational"
    )
    db.add(line)
    db.commit()
    db.refresh(line)
    return line
