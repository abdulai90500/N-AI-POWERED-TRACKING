from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date

class BaseSchema(BaseModel):
    class Config:
        orm_mode = True
        from_attributes = True

# Auth & User schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterCompanyRequest(BaseModel):
    company_name: str
    admin_name: str
    email: str
    password: str
    phone: Optional[str] = None
    address: Optional[str] = "Freetown, Sierra Leone"

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    role: str = "Quality Control Officer"

class UserResponse(BaseSchema):
    id: str
    company_id: Optional[str] = None
    full_name: str
    email: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

# Product schemas
class ProductCreate(BaseModel):
    name: str
    category: str
    volume_ml: int
    description: Optional[str] = None

class ProductResponse(BaseSchema):
    id: str
    company_id: str
    name: str
    category: str
    volume_ml: int
    description: Optional[str] = None
    created_at: Optional[datetime] = None

# Production Line
class ProductionLineCreate(BaseModel):
    name: str
    line_code: Optional[str] = None
    status: Optional[str] = "operational"

class ProductionLineResponse(BaseSchema):
    id: str
    company_id: str
    name: str
    line_code: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

# Production Batch schemas
class BatchCreate(BaseModel):
    product_id: str
    production_line_id: Optional[str] = None
    batch_number: Optional[str] = None
    production_date: date
    expiry_date: Optional[date] = None
    quantity_produced: int
    quantity_rejected: int = 0

class BatchUpdate(BaseModel):
    quantity_produced: Optional[int] = None
    quantity_rejected: Optional[int] = None
    status: Optional[str] = None

class BatchResponse(BaseSchema):
    id: str
    company_id: str
    product_id: str
    production_line_id: Optional[str] = None
    batch_number: str
    production_date: date
    expiry_date: Optional[date] = None
    quantity_produced: int
    quantity_rejected: int
    status: str
    created_at: Optional[datetime] = None
    product_name: Optional[str] = None
    product_category: Optional[str] = None
    line_name: Optional[str] = None
    qr_token: Optional[str] = None

# Quality parameters
class QualityParameterCreate(BaseModel):
    product_id: str
    parameter_name: str
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    unit: Optional[str] = None
    is_critical: bool = True

class QualityParameterResponse(BaseSchema):
    id: str
    product_id: str
    parameter_name: str
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    unit: Optional[str] = None
    is_critical: bool

# Inspection measurement
class MeasurementInput(BaseModel):
    parameter_id: str
    parameter_name: Optional[str] = None
    measured_value: float
    notes: Optional[str] = None

class MeasurementResponse(BaseSchema):
    id: str
    parameter_id: str
    parameter_name: Optional[str] = None
    measured_value: float
    result: str
    notes: Optional[str] = None

class QualityInspectionCreate(BaseModel):
    batch_id: str
    remarks: Optional[str] = None
    measurements: List[MeasurementInput]

class QualityInspectionResponse(BaseSchema):
    id: str
    batch_id: str
    batch_number: Optional[str] = None
    inspected_by: str
    inspector_name: Optional[str] = None
    inspection_status: str
    remarks: Optional[str] = None
    inspected_at: Optional[datetime] = None
    measurements: List[MeasurementResponse] = []

# AI Schemas
class AnomalyDetectionRequest(BaseModel):
    batch_id: Optional[str] = None
    product_type: str = "Bottled Water 500ml"
    ph: float
    filling_volume: float
    cap_torque: Optional[float] = 1.8
    temperature_c: Optional[float] = 22.5
    turbidity_ntu: Optional[float] = 0.4
    visual_defects: int = 0

class AnomalyDetectionResponse(BaseModel):
    anomaly_detected: bool
    risk_level: str
    anomaly_score: float
    reasons: List[str]
    recommendation: str
    model_version: str

class FailurePredictionRequest(BaseModel):
    batch_id: Optional[str] = None
    product_type: str
    ph: float
    filling_volume: float
    production_line: Optional[str] = "Line 01"
    ambient_temp: Optional[float] = 28.0
    line_speed_bpm: Optional[int] = 180

class FailurePredictionResponse(BaseModel):
    failure_probability: float
    risk_classification: str
    contributing_factors: List[Dict[str, Any]]
    confidence_score: float
    model_version: str

class AIPredictionRecord(BaseModel):
    id: str
    batch_id: str
    batch_number: Optional[str] = None
    model_name: str
    model_version: str
    prediction_type: str
    risk_score: float
    prediction_label: str
    explanation: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None

# Inventory
class WarehouseCreate(BaseModel):
    name: str
    address: Optional[str] = None
    capacity_units: int = 50000

class WarehouseResponse(BaseSchema):
    id: str
    name: str
    address: Optional[str] = None
    capacity_units: int
    current_stock: Optional[int] = 0

class InventoryMovementCreate(BaseModel):
    batch_id: str
    warehouse_id: str
    movement_type: str
    quantity: int
    reference_id: Optional[str] = None
    notes: Optional[str] = None

class InventoryMovementResponse(BaseSchema):
    id: str
    batch_id: str
    batch_number: Optional[str] = None
    warehouse_id: str
    warehouse_name: Optional[str] = None
    movement_type: str
    quantity: int
    reference_id: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

# Customer & Distribution
class CustomerCreate(BaseModel):
    name: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    district: Optional[str] = "Western Area Urban (Freetown)"

class CustomerResponse(BaseSchema):
    id: str
    name: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    district: Optional[str] = None

class DistributionOrderCreate(BaseModel):
    customer_id: str
    batch_id: Optional[str] = None
    quantity_ordered: int
    destination_address: Optional[str] = None
    notes: Optional[str] = None

class DistributionOrderResponse(BaseSchema):
    id: str
    customer_id: str
    customer_name: Optional[str] = None
    batch_id: Optional[str] = None
    batch_number: Optional[str] = None
    order_number: str
    status: str
    quantity_ordered: int
    quantity_delivered: int
    quantity_returned: int
    destination_address: Optional[str] = None
    created_at: Optional[datetime] = None

class DeliveryCreate(BaseModel):
    order_id: str
    driver_name: str
    driver_phone: Optional[str] = None
    vehicle_number: Optional[str] = None
    notes: Optional[str] = None

class DeliveryUpdate(BaseModel):
    delivery_status: str
    quantity_delivered: Optional[int] = None
    quantity_returned: Optional[int] = None
    proof_notes: Optional[str] = None

class DeliveryResponse(BaseSchema):
    id: str
    order_id: str
    order_number: Optional[str] = None
    customer_name: Optional[str] = None
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None
    vehicle_number: Optional[str] = None
    delivery_status: str
    dispatched_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    proof_notes: Optional[str] = None

# Tracking Responses
class PublicBatchTrackingResponse(BaseModel):
    is_authentic: bool
    batch_number: str
    product_name: str
    product_category: str
    volume_ml: int
    company_name: str
    production_date: date
    expiry_date: Optional[date] = None
    quality_status: str
    verification_message: str

class InternalBatchTrackingResponse(BaseModel):
    batch: BatchResponse
    company_name: str
    inspections: List[Dict[str, Any]]
    ai_predictions: List[Dict[str, Any]]
    inventory_records: List[Dict[str, Any]]
    distribution_orders: List[Dict[str, Any]]
    qr_token: str
