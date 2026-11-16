from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.db.session import get_db
from app.core.deps import get_current_user, require_roles
from app.models.entities import (
    Warehouse,
    InventoryMovement,
    ProductionBatch,
    Product,
    Notification,
    AuditLog,
    User
)
from app.schemas.schemas import (
    WarehouseCreate,
    WarehouseResponse,
    InventoryMovementCreate,
    InventoryMovementResponse
)

router = APIRouter(prefix="/inventory", tags=["Inventory Management"])

@router.get("/warehouses", response_model=List[WarehouseResponse])
def list_warehouses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    warehouses = db.query(Warehouse).filter(Warehouse.company_id == current_user.company_id).all()
    results = []
    for wh in warehouses:
        # Calculate current stock in this warehouse
        stock_in = db.query(func.sum(InventoryMovement.quantity)).filter(
            InventoryMovement.warehouse_id == wh.id,
            InventoryMovement.movement_type.in_(["STOCK_IN", "TRANSFER_IN", "RETURN"])
        ).scalar() or 0
        stock_out = db.query(func.sum(InventoryMovement.quantity)).filter(
            InventoryMovement.warehouse_id == wh.id,
            InventoryMovement.movement_type.in_(["DISPATCH", "TRANSFER_OUT", "DAMAGED", "REJECTED"])
        ).scalar() or 0
        current_stock = max(0, stock_in - stock_out)

        results.append(WarehouseResponse(
            id=wh.id,
            name=wh.name,
            address=wh.address,
            capacity_units=wh.capacity_units,
            current_stock=current_stock
        ))
    return results

@router.post("/warehouses", response_model=WarehouseResponse)
def create_warehouse(
    data: WarehouseCreate,
    current_user: User = Depends(require_roles("Company Administrator", "Warehouse Manager")),
    db: Session = Depends(get_db)
):
    wh = Warehouse(
        company_id=current_user.company_id,
        name=data.name,
        address=data.address,
        capacity_units=data.capacity_units
    )
    db.add(wh)
    db.commit()
    db.refresh(wh)
    return WarehouseResponse(
        id=wh.id,
        name=wh.name,
        address=wh.address,
        capacity_units=wh.capacity_units,
        current_stock=0
    )

@router.get("/summary")
def get_stock_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Summarizes available stock per product and batch."""
    batches = db.query(ProductionBatch).filter(
        ProductionBatch.company_id == current_user.company_id,
        ProductionBatch.status.in_(["approved", "in_inventory", "dispatched"])
    ).all()

    stock_by_batch = []
    total_inventory = 0
    for b in batches:
        stock_in = db.query(func.sum(InventoryMovement.quantity)).filter(
            InventoryMovement.batch_id == b.id,
            InventoryMovement.movement_type.in_(["STOCK_IN", "TRANSFER_IN", "RETURN"])
        ).scalar() or 0
        stock_out = db.query(func.sum(InventoryMovement.quantity)).filter(
            InventoryMovement.batch_id == b.id,
            InventoryMovement.movement_type.in_(["DISPATCH", "TRANSFER_OUT", "DAMAGED", "REJECTED"])
        ).scalar() or 0
        available = max(0, stock_in - stock_out)
        total_inventory += available

        stock_by_batch.append({
            "batch_id": b.id,
            "batch_number": b.batch_number,
            "product_id": b.product_id,
            "product_name": b.product.name if b.product else "Unknown",
            "product_category": b.product.category if b.product else "Beverage",
            "production_date": b.production_date,
            "expiry_date": b.expiry_date,
            "quantity_produced": b.quantity_produced,
            "available_stock": available,
            "status": b.status
        })

    return {
        "total_bottles_in_stock": total_inventory,
        "batch_count": len(batches),
        "inventory": stock_by_batch
    }

@router.post("/receive", response_model=InventoryMovementResponse)
def receive_stock(
    data: InventoryMovementCreate,
    current_user: User = Depends(require_roles("Company Administrator", "Warehouse Manager")),
    db: Session = Depends(get_db)
):
    """Receives approved batches into the warehouse inventory."""
    batch = db.query(ProductionBatch).filter(
        ProductionBatch.id == data.batch_id,
        ProductionBatch.company_id == current_user.company_id
    ).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    if batch.status not in ["approved", "in_inventory"]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot receive batch in status '{batch.status}'. Only quality-approved batches can enter inventory."
        )

    movement = InventoryMovement(
        company_id=current_user.company_id,
        batch_id=batch.id,
        warehouse_id=data.warehouse_id,
        movement_type=data.movement_type or "STOCK_IN",
        quantity=data.quantity,
        reference_id=data.reference_id,
        notes=data.notes
    )
    db.add(movement)
    batch.status = "in_inventory"

    audit = AuditLog(
        company_id=current_user.company_id,
        user_id=current_user.id,
        action="INVENTORY_STOCK_IN",
        entity_type="inventory",
        entity_id=movement.id,
        details=f"Received {data.quantity} bottles of {batch.batch_number} into warehouse"
    )
    db.add(audit)
    db.commit()
    db.refresh(movement)

    warehouse = db.query(Warehouse).filter(Warehouse.id == data.warehouse_id).first()
    return InventoryMovementResponse(
        id=movement.id,
        batch_id=batch.id,
        batch_number=batch.batch_number,
        warehouse_id=movement.warehouse_id,
        warehouse_name=warehouse.name if warehouse else None,
        movement_type=movement.movement_type,
        quantity=movement.quantity,
        reference_id=movement.reference_id,
        notes=movement.notes,
        created_at=movement.created_at
    )

@router.get("/movements", response_model=List[InventoryMovementResponse])
def list_movements(
    batch_id: Optional[str] = None,
    warehouse_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(InventoryMovement).filter(InventoryMovement.company_id == current_user.company_id)
    if batch_id:
        query = query.filter(InventoryMovement.batch_id == batch_id)
    if warehouse_id:
        query = query.filter(InventoryMovement.warehouse_id == warehouse_id)

    movements = query.order_by(InventoryMovement.created_at.desc()).all()
    results = []
    for m in movements:
        results.append(InventoryMovementResponse(
            id=m.id,
            batch_id=m.batch_id,
            batch_number=m.batch.batch_number if m.batch else None,
            warehouse_id=m.warehouse_id,
            warehouse_name=m.warehouse.name if m.warehouse else None,
            movement_type=m.movement_type,
            quantity=m.quantity,
            reference_id=m.reference_id,
            notes=m.notes,
            created_at=m.created_at
        ))
    return results

@router.get("/low-stock")
def get_low_stock_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    products = db.query(Product).filter(Product.company_id == current_user.company_id).all()
    alerts = []
    threshold = 2000  # low stock threshold in bottles
    for p in products:
        batches = db.query(ProductionBatch).filter(
            ProductionBatch.product_id == p.id,
            ProductionBatch.company_id == current_user.company_id
        ).all()
        batch_ids = [b.id for b in batches]

        stock_in = db.query(func.sum(InventoryMovement.quantity)).filter(
            InventoryMovement.batch_id.in_(batch_ids),
            InventoryMovement.movement_type.in_(["STOCK_IN", "TRANSFER_IN", "RETURN"])
        ).scalar() or 0
        stock_out = db.query(func.sum(InventoryMovement.quantity)).filter(
            InventoryMovement.batch_id.in_(batch_ids),
            InventoryMovement.movement_type.in_(["DISPATCH", "TRANSFER_OUT", "DAMAGED", "REJECTED"])
        ).scalar() or 0
        current_qty = max(0, stock_in - stock_out)

        if current_qty < threshold:
            alerts.append({
                "product_id": p.id,
                "product_name": p.name,
                "category": p.category,
                "current_stock": current_qty,
                "threshold": threshold,
                "deficit": threshold - current_qty
            })
    return {"low_stock_items": alerts}
