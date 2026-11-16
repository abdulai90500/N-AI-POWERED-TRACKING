import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, Date, DateTime, Text, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Company(Base):
    __tablename__ = "companies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    status = Column(String(30), default="active")  # pending, active, suspended
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    users = relationship("User", back_populates="company", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="company", cascade="all, delete-orphan")
    production_lines = relationship("ProductionLine", back_populates="company", cascade="all, delete-orphan")
    batches = relationship("ProductionBatch", back_populates="company", cascade="all, delete-orphan")
    warehouses = relationship("Warehouse", back_populates="company", cascade="all, delete-orphan")
    customers = relationship("Customer", back_populates="company", cascade="all, delete-orphan")
    orders = relationship("DistributionOrder", back_populates="company", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=True)  # nullable for Super Administrator
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(String(50), nullable=False, default="Company Administrator")
    # Roles: Super Administrator, Company Administrator, Production Manager, Quality Control Officer, Warehouse Manager, Distribution Officer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    company = relationship("Company", back_populates="users")

class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    name = Column(String(150), nullable=False)
    category = Column(String(80), nullable=False)  # Bottled Water, Carbonated Soft Drink, Malt, Fruit Juice
    volume_ml = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    company = relationship("Company", back_populates="products")
    batches = relationship("ProductionBatch", back_populates="product", cascade="all, delete-orphan")
    quality_parameters = relationship("QualityParameter", back_populates="product", cascade="all, delete-orphan")

class ProductionLine(Base):
    __tablename__ = "production_lines"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    name = Column(String(100), nullable=False)
    line_code = Column(String(50), nullable=True)
    status = Column(String(30), default="operational")  # operational, maintenance, inactive
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    company = relationship("Company", back_populates="production_lines")
    batches = relationship("ProductionBatch", back_populates="production_line")

class ProductionBatch(Base):
    __tablename__ = "production_batches"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    production_line_id = Column(String(36), ForeignKey("production_lines.id"), nullable=True)
    batch_number = Column(String(100), nullable=False)
    production_date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=True)
    quantity_produced = Column(Integer, default=0)
    quantity_rejected = Column(Integer, default=0)
    status = Column(String(40), default="pending_quality")
    # Statuses: pending_quality, inspecting, approved, rejected, in_inventory, dispatched, recalled
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    company = relationship("Company", back_populates="batches")
    product = relationship("Product", back_populates="batches")
    production_line = relationship("ProductionLine", back_populates="batches")
    inspections = relationship("QualityInspection", back_populates="batch", cascade="all, delete-orphan")
    qr_code = relationship("BatchQRCode", back_populates="batch", uselist=False, cascade="all, delete-orphan")
    predictions = relationship("AIPrediction", back_populates="batch", cascade="all, delete-orphan")
    inventory_movements = relationship("InventoryMovement", back_populates="batch")

class QualityParameter(Base):
    __tablename__ = "quality_parameters"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    parameter_name = Column(String(100), nullable=False)  # pH level, Filling Volume, Cap Torque, Seal Condition, Clarity, Brix
    min_value = Column(Float, nullable=True)
    max_value = Column(Float, nullable=True)
    unit = Column(String(30), nullable=True)  # pH, ml, Nm, %, score
    is_critical = Column(Boolean, default=True)

    product = relationship("Product", back_populates="quality_parameters")
    measurements = relationship("InspectionMeasurement", back_populates="parameter")

class QualityInspection(Base):
    __tablename__ = "quality_inspections"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    batch_id = Column(String(36), ForeignKey("production_batches.id"), nullable=False)
    inspected_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    inspector_name = Column(String(150), nullable=True)
    inspection_status = Column(String(30), default="passed")  # passed, failed, requires_review, pending
    remarks = Column(Text, nullable=True)
    inspected_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    batch = relationship("ProductionBatch", back_populates="inspections")
    measurements = relationship("InspectionMeasurement", back_populates="inspection", cascade="all, delete-orphan")

class InspectionMeasurement(Base):
    __tablename__ = "inspection_measurements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    inspection_id = Column(String(36), ForeignKey("quality_inspections.id"), nullable=False)
    parameter_id = Column(String(36), ForeignKey("quality_parameters.id"), nullable=False)
    parameter_name = Column(String(100), nullable=True)
    measured_value = Column(Float, nullable=False)
    result = Column(String(30), nullable=False)  # passed, out_of_spec, marginal
    notes = Column(Text, nullable=True)

    inspection = relationship("QualityInspection", back_populates="measurements")
    parameter = relationship("QualityParameter", back_populates="measurements")

class BatchQRCode(Base):
    __tablename__ = "batch_qr_codes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    batch_id = Column(String(36), ForeignKey("production_batches.id"), nullable=False)
    token = Column(String(64), unique=True, nullable=False, default=generate_uuid)
    qr_svg = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    batch = relationship("ProductionBatch", back_populates="qr_code")

class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    batch_id = Column(String(36), ForeignKey("production_batches.id"), nullable=False)
    model_name = Column(String(100), nullable=False)  # Isolation Forest, Random Forest Classifier
    model_version = Column(String(50), default="v1.2-sierra")
    prediction_type = Column(String(50), nullable=False)  # anomaly_detection, failure_prediction, trend_risk
    risk_score = Column(Float, nullable=False)  # 0.0 to 1.0 (or anomaly score)
    prediction_label = Column(String(50), nullable=False)  # Normal, High Risk, Anomaly Detected, Priority Inspection
    explanation_json = Column(Text, nullable=True)  # JSON string with factors/deviations
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    batch = relationship("ProductionBatch", back_populates="predictions")

class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    name = Column(String(150), nullable=False)
    address = Column(Text, nullable=True)
    capacity_units = Column(Integer, default=50000)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    company = relationship("Company", back_populates="warehouses")
    movements = relationship("InventoryMovement", back_populates="warehouse")

class InventoryMovement(Base):
    __tablename__ = "inventory_movements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    batch_id = Column(String(36), ForeignKey("production_batches.id"), nullable=False)
    warehouse_id = Column(String(36), ForeignKey("warehouses.id"), nullable=False)
    movement_type = Column(String(40), nullable=False)
    # STOCK_IN, DISPATCH, TRANSFER, DAMAGED_RETURN, REJECTED, ADJUSTMENT
    quantity = Column(Integer, nullable=False)
    reference_id = Column(String(100), nullable=True)  # Order ID, Transfer Doc #, etc.
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    batch = relationship("ProductionBatch", back_populates="inventory_movements")
    warehouse = relationship("Warehouse", back_populates="movements")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    name = Column(String(150), nullable=False)
    contact_person = Column(String(100), nullable=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    district = Column(String(100), default="Western Area Urban (Freetown)")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    company = relationship("Company", back_populates="customers")
    orders = relationship("DistributionOrder", back_populates="customer")

class DistributionOrder(Base):
    __tablename__ = "distribution_orders"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    customer_id = Column(String(36), ForeignKey("customers.id"), nullable=False)
    order_number = Column(String(100), nullable=False)
    batch_id = Column(String(36), ForeignKey("production_batches.id"), nullable=True)
    status = Column(String(40), default="pending")
    # pending, approved, dispatched, in_transit, delivered, returned, cancelled
    quantity_ordered = Column(Integer, nullable=False, default=0)
    quantity_delivered = Column(Integer, nullable=False, default=0)
    quantity_returned = Column(Integer, nullable=False, default=0)
    destination_address = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    company = relationship("Company", back_populates="orders")
    customer = relationship("Customer", back_populates="orders")
    batch = relationship("ProductionBatch")
    delivery = relationship("Delivery", back_populates="order", uselist=False, cascade="all, delete-orphan")

class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    order_id = Column(String(36), ForeignKey("distribution_orders.id"), nullable=False)
    driver_name = Column(String(150), nullable=True)
    driver_phone = Column(String(50), nullable=True)
    vehicle_number = Column(String(50), nullable=True)
    delivery_status = Column(String(40), default="pending")
    # pending, loaded, dispatched, in_transit, delivered, partially_delivered, failed
    dispatched_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    proof_notes = Column(Text, nullable=True)

    order = relationship("DistributionOrder", back_populates="delivery")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(80), nullable=True)
    entity_id = Column(String(36), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    alert_type = Column(String(50), default="info")  # quality_alert, low_stock, anomaly, delivery_update
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
