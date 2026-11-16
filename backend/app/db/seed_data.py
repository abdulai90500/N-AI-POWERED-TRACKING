from datetime import datetime, date, timedelta, timezone
from sqlalchemy.orm import Session
import json
from app.core.security import get_password_hash
from app.models.entities import (
    Company,
    User,
    Product,
    ProductionLine,
    ProductionBatch,
    QualityParameter,
    QualityInspection,
    InspectionMeasurement,
    BatchQRCode,
    AIPrediction,
    Warehouse,
    InventoryMovement,
    Customer,
    DistributionOrder,
    Delivery,
    Notification,
    AuditLog
)
from app.services.qr_service import generate_qr_token, generate_qr_svg

def seed_database(db: Session):
    # Check if data already exists
    if db.query(Company).first():
        return

    print("Seeding initial beverage bottling company and multi-tenant test data...")

    # 1. Primary Company: Sierra Springs & Beverages Ltd
    company1 = Company(
        name="Sierra Springs & Beverages Ltd",
        email="info@sierrasprings.sl",
        phone="+232 76 543210",
        address="14 Kissy Industrial Estate, Kissy, Freetown, Sierra Leone",
        status="active"
    )
    db.add(company1)

    # 2. Secondary Company: Lion Soft Drinks Co. (for multi-tenant isolation testing)
    company2 = Company(
        name="Lion Soft Drinks Co.",
        email="contact@lionsoftdrinks.sl",
        phone="+232 78 987654",
        address="Plot 5 Wellington Industrial Zone, Freetown, Sierra Leone",
        status="active"
    )
    db.add(company2)
    db.flush()

    pwd_hash = get_password_hash("Password123!")

    # Super Admin
    super_admin = User(
        company_id=None,
        full_name="Dr. Alpha Bah",
        email="superadmin@beveragetrack.sl",
        password_hash=pwd_hash,
        role="Super Administrator",
        is_active=True
    )
    db.add(super_admin)

    # Company 1 Users across all 5 operational roles
    comp1_admin = User(
        company_id=company1.id,
        full_name="Mariama Sesay",
        email="admin@sierrasprings.sl",
        password_hash=pwd_hash,
        role="Company Administrator",
        is_active=True
    )
    prod_mgr = User(
        company_id=company1.id,
        full_name="Ibrahim Kamara",
        email="production@sierrasprings.sl",
        password_hash=pwd_hash,
        role="Production Manager",
        is_active=True
    )
    qc_officer = User(
        company_id=company1.id,
        full_name="Fatmata Bangura",
        email="quality@sierrasprings.sl",
        password_hash=pwd_hash,
        role="Quality Control Officer",
        is_active=True
    )
    wh_mgr = User(
        company_id=company1.id,
        full_name="Mohamed Turay",
        email="warehouse@sierrasprings.sl",
        password_hash=pwd_hash,
        role="Warehouse Manager",
        is_active=True
    )
    dist_officer = User(
        company_id=company1.id,
        full_name="Amadu Mansaray",
        email="distribution@sierrasprings.sl",
        password_hash=pwd_hash,
        role="Distribution Officer",
        is_active=True
    )

    # Company 2 Admin
    comp2_admin = User(
        company_id=company2.id,
        full_name="Samuel Conteh",
        email="admin@lionsoftdrinks.sl",
        password_hash=pwd_hash,
        role="Company Administrator",
        is_active=True
    )

    db.add_all([comp1_admin, prod_mgr, qc_officer, wh_mgr, dist_officer, comp2_admin])
    db.flush()

    # Production Lines
    line1 = ProductionLine(
        company_id=company1.id,
        name="High-Speed Water Line 01",
        line_code="LINE-01",
        status="operational"
    )
    line2 = ProductionLine(
        company_id=company1.id,
        name="Carbonated Bottling Line 02",
        line_code="LINE-02",
        status="operational"
    )
    line3 = ProductionLine(
        company_id=company1.id,
        name="Juice & Malt Packaging Line 03",
        line_code="LINE-03",
        status="operational"
    )
    db.add_all([line1, line2, line3])
    db.flush()

    # Products
    prod_water_500 = Product(
        company_id=company1.id,
        name="Sierra Pure Spring Water 500ml",
        category="Bottled Water",
        volume_ml=500,
        description="Natural pure spring water sourced from Regent Mountain Aquifers, Freetown."
    )
    prod_water_1500 = Product(
        company_id=company1.id,
        name="Sierra Pure Spring Water 1.5L",
        category="Bottled Water",
        volume_ml=1500,
        description="Family-size natural pure spring water in recyclable PET bottle."
    )
    prod_malt = Product(
        company_id=company1.id,
        name="Salone Tropical Ginger Malt 330ml",
        category="Malt",
        volume_ml=330,
        description="Rich non-alcoholic brewed malt with organic Sierra Leonean ginger extracts."
    )
    prod_kola = Product(
        company_id=company1.id,
        name="Freetown Sparkling Kola 500ml",
        category="Carbonated Soft Drink",
        volume_ml=500,
        description="Crisp carbonated kola beverage crafted with natural kola nut extracts."
    )
    prod_hibiscus = Product(
        company_id=company1.id,
        name="Sweet Salone Hibiscus (Bissap) 1L",
        category="Fruit Juice",
        volume_ml=1000,
        description="Traditional hibiscus infusion with pineapple and cloves, pasteurized."
    )
    db.add_all([prod_water_500, prod_water_1500, prod_malt, prod_kola, prod_hibiscus])
    db.flush()

    # Quality Parameters for Water 500ml
    qp_water_ph = QualityParameter(
        company_id=company1.id,
        product_id=prod_water_500.id,
        parameter_name="pH Level",
        min_value=6.5,
        max_value=8.0,
        unit="pH",
        is_critical=True
    )
    qp_water_vol = QualityParameter(
        company_id=company1.id,
        product_id=prod_water_500.id,
        parameter_name="Filling Volume",
        min_value=495.0,
        max_value=505.0,
        unit="ml",
        is_critical=True
    )
    qp_water_torque = QualityParameter(
        company_id=company1.id,
        product_id=prod_water_500.id,
        parameter_name="Cap Torque & Seal",
        min_value=1.4,
        max_value=2.4,
        unit="Nm",
        is_critical=True
    )
    qp_water_turb = QualityParameter(
        company_id=company1.id,
        product_id=prod_water_500.id,
        parameter_name="Turbidity",
        min_value=0.0,
        max_value=1.0,
        unit="NTU",
        is_critical=False
    )
    qp_water_visual = QualityParameter(
        company_id=company1.id,
        product_id=prod_water_500.id,
        parameter_name="Visual Appearance & Clarity",
        min_value=1.0,
        max_value=1.0,
        unit="Score (1=Pass)",
        is_critical=True
    )

    # Quality Parameters for Soft Drink Kola
    qp_kola_ph = QualityParameter(
        company_id=company1.id,
        product_id=prod_kola.id,
        parameter_name="pH Level",
        min_value=2.4,
        max_value=3.4,
        unit="pH",
        is_critical=True
    )
    qp_kola_vol = QualityParameter(
        company_id=company1.id,
        product_id=prod_kola.id,
        parameter_name="Filling Volume",
        min_value=493.0,
        max_value=507.0,
        unit="ml",
        is_critical=True
    )
    qp_kola_brix = QualityParameter(
        company_id=company1.id,
        product_id=prod_kola.id,
        parameter_name="Brix (Sugar Content)",
        min_value=10.2,
        max_value=11.8,
        unit="°Bx",
        is_critical=True
    )
    db.add_all([
        qp_water_ph, qp_water_vol, qp_water_torque, qp_water_turb, qp_water_visual,
        qp_kola_ph, qp_kola_vol, qp_kola_brix
    ])
    db.flush()

    # Warehouses
    wh1 = Warehouse(
        company_id=company1.id,
        name="Kissy Central Plant Warehouse",
        address="14 Kissy Industrial Estate, Freetown",
        capacity_units=80000
    )
    wh2 = Warehouse(
        company_id=company1.id,
        name="Lumley West Distribution Hub",
        address="Kroo Bay / Lumley Transit Terminal, Freetown",
        capacity_units=40000
    )
    db.add_all([wh1, wh2])
    db.flush()

    # Customers
    cust1 = Customer(
        company_id=company1.id,
        name="Freetown Supermarket & Groceries",
        contact_person="Alhaji Mohamed Sowe",
        phone="+232 77 112233",
        email="orders@freetownsupermarket.sl",
        address="32 Siaka Stevens Street, Central Freetown",
        district="Western Area Urban"
    )
    cust2 = Customer(
        company_id=company1.id,
        name="Lumley Beach Resort & Hotels Group",
        contact_person="Mrs. Aminata Sesay",
        phone="+232 76 445566",
        email="procurement@lumleybeachresort.sl",
        address="Beach Road, Lumley, Freetown",
        district="Western Area Urban"
    )
    cust3 = Customer(
        company_id=company1.id,
        name="Bo Central Wholesale Distributors",
        contact_person="Santigie Fornah",
        phone="+232 79 332211",
        email="sfornah@bowholesale.sl",
        address="12 Tikonko Road, Bo Town",
        district="Bo District (Southern Province)"
    )
    db.add_all([cust1, cust2, cust3])
    db.flush()

    # Production Batches
    today = datetime.now(timezone.utc).date()

    # Batch 1: Passed and Released (Pure Water 500ml)
    batch1 = ProductionBatch(
        company_id=company1.id,
        product_id=prod_water_500.id,
        production_line_id=line1.id,
        batch_number="BTL-2026-001",
        production_date=today - timedelta(days=5),
        expiry_date=today + timedelta(days=360),
        quantity_produced=10000,
        quantity_rejected=65,
        status="in_inventory"
    )
    db.add(batch1)
    db.flush()

    token1 = generate_qr_token()
    qr1 = BatchQRCode(company_id=company1.id, batch_id=batch1.id, token=token1, qr_svg=generate_qr_svg(token1))
    db.add(qr1)

    ins1 = QualityInspection(
        company_id=company1.id,
        batch_id=batch1.id,
        inspected_by=qc_officer.id,
        inspector_name=qc_officer.full_name,
        inspection_status="passed",
        remarks="All microbiological, pH, and physical seal measurements within CODEX guidelines.",
        inspected_at=datetime.now(timezone.utc) - timedelta(days=5)
    )
    db.add(ins1)
    db.flush()

    m1_1 = InspectionMeasurement(inspection_id=ins1.id, parameter_id=qp_water_ph.id, parameter_name="pH Level", measured_value=7.22, result="passed")
    m1_2 = InspectionMeasurement(inspection_id=ins1.id, parameter_id=qp_water_vol.id, parameter_name="Filling Volume", measured_value=500.8, result="passed")
    m1_3 = InspectionMeasurement(inspection_id=ins1.id, parameter_id=qp_water_torque.id, parameter_name="Cap Torque & Seal", measured_value=1.85, result="passed")
    m1_4 = InspectionMeasurement(inspection_id=ins1.id, parameter_id=qp_water_visual.id, parameter_name="Visual Appearance", measured_value=1.0, result="passed")
    db.add_all([m1_1, m1_2, m1_3, m1_4])

    ai_pred1_anom = AIPrediction(
        company_id=company1.id,
        batch_id=batch1.id,
        model_name="Isolation Forest Anomaly Detector",
        model_version="v2.1.0-freetown",
        prediction_type="anomaly_detection",
        risk_score=0.88,
        prediction_label="Normal",
        explanation_json=json.dumps({"detected": False, "reasons": ["Optimal pH 7.22", "Accurate 500.8ml fill"], "recommendation": "Standard release"})
    )
    ai_pred1_risk = AIPrediction(
        company_id=company1.id,
        batch_id=batch1.id,
        model_name="Random Forest Quality Risk Classifier",
        model_version="v2.1.0-freetown",
        prediction_type="failure_prediction",
        risk_score=0.03,
        prediction_label="Routine inspection",
        explanation_json=json.dumps({"probability": 0.03, "confidence": 0.98})
    )
    db.add_all([ai_pred1_anom, ai_pred1_risk])

    # Inventory movement: Stock received into Kissy Central
    im1 = InventoryMovement(
        company_id=company1.id,
        batch_id=batch1.id,
        warehouse_id=wh1.id,
        movement_type="STOCK_IN",
        quantity=9935,
        reference_id="REC-001",
        notes="Received approved production batch from Line 01"
    )
    db.add(im1)

    # Batch 2: Passed and Dispatched (Sparkling Kola)
    batch2 = ProductionBatch(
        company_id=company1.id,
        product_id=prod_kola.id,
        production_line_id=line2.id,
        batch_number="BTL-2026-002",
        production_date=today - timedelta(days=3),
        expiry_date=today + timedelta(days=270),
        quantity_produced=7500,
        quantity_rejected=45,
        status="in_inventory"
    )
    db.add(batch2)
    db.flush()

    token2 = generate_qr_token()
    qr2 = BatchQRCode(company_id=company1.id, batch_id=batch2.id, token=token2, qr_svg=generate_qr_svg(token2))
    db.add(qr2)

    ins2 = QualityInspection(
        company_id=company1.id,
        batch_id=batch2.id,
        inspected_by=qc_officer.id,
        inspector_name=qc_officer.full_name,
        inspection_status="passed",
        remarks="Carbonation level and sweetness index compliant.",
        inspected_at=datetime.now(timezone.utc) - timedelta(days=3)
    )
    db.add(ins2)
    db.flush()
    m2_1 = InspectionMeasurement(inspection_id=ins2.id, parameter_id=qp_kola_ph.id, parameter_name="pH Level", measured_value=2.85, result="passed")
    m2_2 = InspectionMeasurement(inspection_id=ins2.id, parameter_id=qp_kola_vol.id, parameter_name="Filling Volume", measured_value=498.2, result="passed")
    m2_3 = InspectionMeasurement(inspection_id=ins2.id, parameter_id=qp_kola_brix.id, parameter_name="Brix", measured_value=11.2, result="passed")
    db.add_all([m2_1, m2_2, m2_3])

    im2 = InventoryMovement(
        company_id=company1.id,
        batch_id=batch2.id,
        warehouse_id=wh1.id,
        movement_type="STOCK_IN",
        quantity=7455,
        reference_id="REC-002",
        notes="Stored in Kissy main warehouse bays"
    )
    db.add(im2)

    # Batch 3: AI Flagged Anomaly / Under Quality Review! (Pure Water 500ml)
    # High pH drift detected (pH 8.42 - exceeds standard max 8.0)
    batch3 = ProductionBatch(
        company_id=company1.id,
        product_id=prod_water_500.id,
        production_line_id=line1.id,
        batch_number="BTL-2026-003",
        production_date=today - timedelta(days=1),
        expiry_date=today + timedelta(days=360),
        quantity_produced=5000,
        quantity_rejected=180,
        status="inspecting"
    )
    db.add(batch3)
    db.flush()

    token3 = generate_qr_token()
    qr3 = BatchQRCode(company_id=company1.id, batch_id=batch3.id, token=token3, qr_svg=generate_qr_svg(token3))
    db.add(qr3)

    ins3 = QualityInspection(
        company_id=company1.id,
        batch_id=batch3.id,
        inspected_by=qc_officer.id,
        inspector_name=qc_officer.full_name,
        inspection_status="requires_review",
        remarks="Automated line sensors flagged alkaline pH spike. Hold batch for filtration system audit.",
        inspected_at=datetime.now(timezone.utc) - timedelta(hours=18)
    )
    db.add(ins3)
    db.flush()

    m3_1 = InspectionMeasurement(inspection_id=ins3.id, parameter_id=qp_water_ph.id, parameter_name="pH Level", measured_value=8.42, result="out_of_spec", notes="High pH out of spec (Max 8.0)")
    m3_2 = InspectionMeasurement(inspection_id=ins3.id, parameter_id=qp_water_vol.id, parameter_name="Filling Volume", measured_value=491.5, result="out_of_spec", notes="Underfill by 8.5ml")
    m3_3 = InspectionMeasurement(inspection_id=ins3.id, parameter_id=qp_water_torque.id, parameter_name="Cap Torque & Seal", measured_value=1.52, result="passed")
    m3_4 = InspectionMeasurement(inspection_id=ins3.id, parameter_id=qp_water_visual.id, parameter_name="Visual Appearance", measured_value=1.0, result="passed")
    db.add_all([m3_1, m3_2, m3_3, m3_4])

    # AI Prediction Flagging the Anomaly!
    ai_pred3_anom = AIPrediction(
        company_id=company1.id,
        batch_id=batch3.id,
        model_name="Isolation Forest Anomaly Detector",
        model_version="v2.1.0-freetown",
        prediction_type="anomaly_detection",
        risk_score=-0.412,
        prediction_label="Anomaly: HIGH",
        explanation_json=json.dumps({
            "detected": True,
            "reasons": [
                "pH level (8.42) is outside standard range [6.5 - 8.0]",
                "Filling volume deviation of -1.7% exceeds tolerance (±1.0%)"
            ],
            "recommendation": "Hold batch immediately. Quarantine bottles and notify Quality Control Lead for re-testing."
        })
    )
    ai_pred3_risk = AIPrediction(
        company_id=company1.id,
        batch_id=batch3.id,
        model_name="Random Forest Quality Risk Classifier",
        model_version="v2.1.0-freetown",
        prediction_type="failure_prediction",
        risk_score=0.785,
        prediction_label="Priority inspection",
        explanation_json=json.dumps({
            "probability": 0.785,
            "factors": [
                {"factor": "pH Drift", "importance": 0.40, "contribution": 0.81},
                {"factor": "Filling Deviation", "importance": 0.35, "contribution": 0.65}
            ],
            "confidence": 0.94
        })
    )
    db.add_all([ai_pred3_anom, ai_pred3_risk])

    # Quality Notification for Batch 3
    notif1 = Notification(
        company_id=company1.id,
        title="Quality Alert: Batch BTL-2026-003",
        message="AI Anomaly Engine detected abnormal alkaline pH (8.42) and underfill on Line 01. Batch placed on hold.",
        alert_type="quality_alert",
        is_read=False
    )
    db.add(notif1)

    # Batch 4: Fresh batch pending inspection
    batch4 = ProductionBatch(
        company_id=company1.id,
        product_id=prod_malt.id,
        production_line_id=line3.id,
        batch_number="BTL-2026-004",
        production_date=today,
        expiry_date=today + timedelta(days=180),
        quantity_produced=4500,
        quantity_rejected=20,
        status="pending_quality"
    )
    db.add(batch4)
    db.flush()
    token4 = generate_qr_token()
    qr4 = BatchQRCode(company_id=company1.id, batch_id=batch4.id, token=token4, qr_svg=generate_qr_svg(token4))
    db.add(qr4)

    # Distribution Orders & Deliveries
    order1 = DistributionOrder(
        company_id=company1.id,
        customer_id=cust1.id,
        batch_id=batch1.id,
        order_number="ORD-SL-0001",
        status="delivered",
        quantity_ordered=2500,
        quantity_delivered=2500,
        quantity_returned=0,
        destination_address="32 Siaka Stevens Street, Central Freetown",
        notes="Weekly restock for central retail supermarket chain."
    )
    db.add(order1)
    db.flush()

    deliv1 = Delivery(
        company_id=company1.id,
        order_id=order1.id,
        driver_name="Amadu Koroma",
        driver_phone="+232 76 998877",
        vehicle_number="SL-AA-4892",
        delivery_status="delivered",
        dispatched_at=datetime.now(timezone.utc) - timedelta(days=2),
        delivered_at=datetime.now(timezone.utc) - timedelta(days=2, hours=3),
        proof_notes="Delivered in full. Signed by Store Manager Sowe."
    )
    db.add(deliv1)

    # Record inventory movement for dispatch
    im_disp1 = InventoryMovement(
        company_id=company1.id,
        batch_id=batch1.id,
        warehouse_id=wh1.id,
        movement_type="DISPATCH",
        quantity=2500,
        reference_id="ORD-SL-0001",
        notes="Dispatched to Freetown Supermarket via truck SL-AA-4892"
    )
    db.add(im_disp1)

    # Order 2: In transit to Lumley Beach Resort
    order2 = DistributionOrder(
        company_id=company1.id,
        customer_id=cust2.id,
        batch_id=batch2.id,
        order_number="ORD-SL-0002",
        status="dispatched",
        quantity_ordered=1800,
        quantity_delivered=0,
        quantity_returned=0,
        destination_address="Beach Road, Lumley, Freetown",
        notes="Delivery for weekend hospitality events."
    )
    db.add(order2)
    db.flush()

    deliv2 = Delivery(
        company_id=company1.id,
        order_id=order2.id,
        driver_name="Brima Kamara",
        driver_phone="+232 88 554433",
        vehicle_number="SL-AB-7120",
        delivery_status="in_transit",
        dispatched_at=datetime.now(timezone.utc) - timedelta(hours=2),
        proof_notes="In transit along Wilkinson Road towards Lumley."
    )
    db.add(deliv2)

    im_disp2 = InventoryMovement(
        company_id=company1.id,
        batch_id=batch2.id,
        warehouse_id=wh1.id,
        movement_type="DISPATCH",
        quantity=1800,
        reference_id="ORD-SL-0002",
        notes="Dispatched to Lumley Beach Resort"
    )
    db.add(im_disp2)

    # Initial Audit Logs
    audit1 = AuditLog(
        company_id=company1.id,
        user_id=comp1_admin.id,
        action="INITIALIZE_ENTERPRISE",
        entity_type="company",
        entity_id=company1.id,
        details="Initialized Sierra Springs & Beverages operations in Freetown"
    )
    db.add(audit1)

    db.commit()
    print("Database seeding completed successfully!")
