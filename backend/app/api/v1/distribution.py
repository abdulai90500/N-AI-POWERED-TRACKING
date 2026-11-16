from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timezone
from app.db.session import get_db
from app.core.deps import get_current_user, require_roles
from app.models.entities import (
    Customer,
    DistributionOrder,
    Delivery,
    ProductionBatch,
    InventoryMovement,
    Warehouse,
    AuditLog,
    User
)
from app.schemas.schemas import (
    CustomerCreate, CustomerResponse,
    DistributionOrderCreate, DistributionOrderResponse,
    DeliveryCreate, DeliveryUpdate, DeliveryResponse
)

router = APIRouter(prefix="/distribution", tags=["Distribution & Logistics"])

# Customers
@router.get("/customers", response_model=List[CustomerResponse])
def list_customers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Customer).filter(Customer.company_id == current_user.company_id).all()

@router.post("/customers", response_model=CustomerResponse)
def create_customer(
    data: CustomerCreate,
    current_user: User = Depends(require_roles("Company Administrator", "Distribution Officer")),
    db: Session = Depends(get_db)
):
    customer = Customer(
        company_id=current_user.company_id,
        name=data.name,
        contact_person=data.contact_person,
        phone=data.phone,
        email=data.email,
        address=data.address,
        district=data.district or "Western Area Urban (Freetown)"
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

# Orders
@router.get("/orders", response_model=List[DistributionOrderResponse])
def list_orders(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(DistributionOrder).filter(DistributionOrder.company_id == current_user.company_id)
    if status:
        query = query.filter(DistributionOrder.status == status)
    
    orders = query.order_by(DistributionOrder.created_at.desc()).all()
    results = []
    for o in orders:
        results.append(DistributionOrderResponse(
            id=o.id,
            customer_id=o.customer_id,
            customer_name=o.customer.name if o.customer else "Unknown",
            batch_id=o.batch_id,
            batch_number=o.batch.batch_number if o.batch else None,
            order_number=o.order_number,
            status=o.status,
            quantity_ordered=o.quantity_ordered,
            quantity_delivered=o.quantity_delivered,
            quantity_returned=o.quantity_returned,
            destination_address=o.destination_address,
            created_at=o.created_at
        ))
    return results

@router.post("/orders", response_model=DistributionOrderResponse)
def create_order(
    data: DistributionOrderCreate,
    current_user: User = Depends(require_roles("Company Administrator", "Distribution Officer")),
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(
        Customer.id == data.customer_id,
        Customer.company_id == current_user.company_id
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    order_count = db.query(DistributionOrder).filter(DistributionOrder.company_id == current_user.company_id).count() + 1
    order_number = f"ORD-SL-{order_count:04d}"

    order = DistributionOrder(
        company_id=current_user.company_id,
        customer_id=data.customer_id,
        batch_id=data.batch_id,
        order_number=order_number,
        status="pending",
        quantity_ordered=data.quantity_ordered,
        quantity_delivered=0,
        quantity_returned=0,
        destination_address=data.destination_address or customer.address,
        notes=data.notes
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    return DistributionOrderResponse(
        id=order.id,
        customer_id=order.customer_id,
        customer_name=customer.name,
        batch_id=order.batch_id,
        batch_number=order.batch.batch_number if order.batch else None,
        order_number=order.order_number,
        status=order.status,
        quantity_ordered=order.quantity_ordered,
        quantity_delivered=order.quantity_delivered,
        quantity_returned=order.quantity_returned,
        destination_address=order.destination_address,
        created_at=order.created_at
    )

# Deliveries
@router.get("/deliveries", response_model=List[DeliveryResponse])
def list_deliveries(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Delivery).filter(Delivery.company_id == current_user.company_id)
    if status:
        query = query.filter(Delivery.delivery_status == status)

    deliveries = query.order_by(Delivery.dispatched_at.desc()).all()
    results = []
    for d in deliveries:
        results.append(DeliveryResponse(
            id=d.id,
            order_id=d.order_id,
            order_number=d.order.order_number if d.order else None,
            customer_name=d.order.customer.name if (d.order and d.order.customer) else None,
            driver_name=d.driver_name,
            driver_phone=d.driver_phone,
            vehicle_number=d.vehicle_number,
            delivery_status=d.delivery_status,
            dispatched_at=d.dispatched_at,
            delivered_at=d.delivered_at,
            proof_notes=d.proof_notes
        ))
    return results

@router.post("/deliveries", response_model=DeliveryResponse)
def dispatch_delivery(
    data: DeliveryCreate,
    current_user: User = Depends(require_roles("Company Administrator", "Distribution Officer")),
    db: Session = Depends(get_db)
):
    order = db.query(DistributionOrder).filter(
        DistributionOrder.id == data.order_id,
        DistributionOrder.company_id == current_user.company_id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    delivery = Delivery(
        company_id=current_user.company_id,
        order_id=order.id,
        driver_name=data.driver_name,
        driver_phone=data.driver_phone,
        vehicle_number=data.vehicle_number,
        delivery_status="dispatched",
        dispatched_at=datetime.now(timezone.utc),
        proof_notes=data.notes
    )
    order.status = "dispatched"
    db.add(delivery)

    # If order has a batch assigned, record inventory dispatch movement
    if order.batch_id:
        wh = db.query(Warehouse).filter(Warehouse.company_id == current_user.company_id).first()
        if wh:
            inv_dispatch = InventoryMovement(
                company_id=current_user.company_id,
                batch_id=order.batch_id,
                warehouse_id=wh.id,
                movement_type="DISPATCH",
                quantity=order.quantity_ordered,
                reference_id=order.order_number,
                notes=f"Dispatched via vehicle {data.vehicle_number} (Driver: {data.driver_name})"
            )
            db.add(inv_dispatch)

    audit = AuditLog(
        company_id=current_user.company_id,
        user_id=current_user.id,
        action="DISPATCH_ORDER",
        entity_type="delivery",
        entity_id=delivery.id,
        details=f"Order {order.order_number} dispatched to {order.customer.name if order.customer else 'Customer'} by driver {data.driver_name}"
    )
    db.add(audit)
    db.commit()
    db.refresh(delivery)

    return DeliveryResponse(
        id=delivery.id,
        order_id=delivery.order_id,
        order_number=order.order_number,
        customer_name=order.customer.name if order.customer else None,
        driver_name=delivery.driver_name,
        driver_phone=delivery.driver_phone,
        vehicle_number=delivery.vehicle_number,
        delivery_status=delivery.delivery_status,
        dispatched_at=delivery.dispatched_at,
        delivered_at=delivery.delivered_at,
        proof_notes=delivery.proof_notes
    )

@router.patch("/deliveries/{delivery_id}", response_model=DeliveryResponse)
def update_delivery_status(
    delivery_id: str,
    data: DeliveryUpdate,
    current_user: User = Depends(require_roles("Company Administrator", "Distribution Officer")),
    db: Session = Depends(get_db)
):
    delivery = db.query(Delivery).filter(
        Delivery.id == delivery_id,
        Delivery.company_id == current_user.company_id
    ).first()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery record not found")

    delivery.delivery_status = data.delivery_status
    if data.delivery_status == "delivered":
        delivery.delivered_at = datetime.now(timezone.utc)
        if delivery.order:
            delivery.order.status = "delivered"
            if data.quantity_delivered is not None:
                delivery.order.quantity_delivered = data.quantity_delivered
            else:
                delivery.order.quantity_delivered = delivery.order.quantity_ordered
            if data.quantity_returned is not None:
                delivery.order.quantity_returned = data.quantity_returned
    elif data.delivery_status in ["in_transit", "partially_delivered", "failed"]:
        if delivery.order:
            delivery.order.status = data.delivery_status

    if data.proof_notes:
        delivery.proof_notes = data.proof_notes

    db.commit()
    db.refresh(delivery)

    return DeliveryResponse(
        id=delivery.id,
        order_id=delivery.order_id,
        order_number=delivery.order.order_number if delivery.order else None,
        customer_name=delivery.order.customer.name if (delivery.order and delivery.order.customer) else None,
        driver_name=delivery.driver_name,
        driver_phone=delivery.driver_phone,
        vehicle_number=delivery.vehicle_number,
        delivery_status=delivery.delivery_status,
        dispatched_at=delivery.dispatched_at,
        delivered_at=delivery.delivered_at,
        proof_notes=delivery.proof_notes
    )

@router.get("/reports")
def get_distribution_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orders = db.query(DistributionOrder).filter(DistributionOrder.company_id == current_user.company_id).all()
    deliveries = db.query(Delivery).filter(Delivery.company_id == current_user.company_id).all()

    total_ordered = sum(o.quantity_ordered for o in orders)
    total_delivered = sum(o.quantity_delivered for o in orders)
    total_returned = sum(o.quantity_returned for o in orders)
    delivery_rate = (total_delivered / total_ordered * 100) if total_ordered > 0 else 0.0

    return {
        "total_orders": len(orders),
        "total_deliveries": len(deliveries),
        "total_bottles_ordered": total_ordered,
        "total_bottles_delivered": total_delivered,
        "total_bottles_returned": total_returned,
        "delivery_fulfillment_rate_percent": round(delivery_rate, 2),
        "active_in_transit": len([d for d in deliveries if d.delivery_status in ["dispatched", "in_transit"]])
    }
