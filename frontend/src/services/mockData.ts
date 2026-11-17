// In-browser mock data and state engine for BeverageTrack AI
// Enables full interactive demo capabilities on Vercel or offline environments

export const INITIAL_PRODUCTS = [
  {
    id: "prod-001",
    name: "Sierra Pure Water 500ml",
    sku: "SPW-500",
    category: "Bottled Water",
    package_type: "PET Bottle",
    volume_ml: 500,
    shelf_life_days: 365,
    min_stock_level: 5000,
    current_stock: 24500,
    target_ph: 7.0,
    ph_min: 6.5,
    ph_max: 7.5,
    target_volume: 500.0,
    volume_min: 495.0,
    volume_max: 510.0,
    target_brix: null,
    brix_min: null,
    brix_max: null,
    target_torque: 18.0,
    torque_min: 14.0,
    torque_max: 24.0,
  },
  {
    id: "prod-002",
    name: "Sierra Pure Water 1500ml",
    sku: "SPW-1500",
    category: "Bottled Water",
    package_type: "PET Bottle",
    volume_ml: 1500,
    shelf_life_days: 365,
    min_stock_level: 3000,
    current_stock: 11800,
    target_ph: 7.0,
    ph_min: 6.5,
    ph_max: 7.5,
    target_volume: 1500.0,
    volume_min: 1485.0,
    volume_max: 1520.0,
    target_brix: null,
    brix_min: null,
    brix_max: null,
    target_torque: 20.0,
    torque_min: 15.0,
    torque_max: 26.0,
  },
  {
    id: "prod-003",
    name: "Lion Ginger Malt 330ml",
    sku: "LGM-330",
    category: "Malt Beverage",
    package_type: "Glass Bottle",
    volume_ml: 330,
    shelf_life_days: 180,
    min_stock_level: 4000,
    current_stock: 17200,
    target_ph: 4.2,
    ph_min: 3.8,
    ph_max: 4.5,
    target_volume: 330.0,
    volume_min: 325.0,
    volume_max: 338.0,
    target_brix: 11.5,
    brix_min: 10.8,
    brix_max: 12.2,
    target_torque: 22.0,
    torque_min: 16.0,
    torque_max: 28.0,
  },
  {
    id: "prod-004",
    name: "Salone Cola 500ml",
    sku: "SCL-500",
    category: "Carbonated Soft Drink",
    package_type: "PET Bottle",
    volume_ml: 500,
    shelf_life_days: 270,
    min_stock_level: 6000,
    current_stock: 4200, // Trigger low stock warning
    target_ph: 3.1,
    ph_min: 2.8,
    ph_max: 3.4,
    target_volume: 500.0,
    volume_min: 495.0,
    volume_max: 510.0,
    target_brix: 10.5,
    brix_min: 9.8,
    brix_max: 11.2,
    target_torque: 18.0,
    torque_min: 14.0,
    torque_max: 24.0,
  },
  {
    id: "prod-005",
    name: "Freetown Orange Zest 330ml",
    sku: "FOZ-330",
    category: "Fruit Soda",
    package_type: "Aluminum Can",
    volume_ml: 330,
    shelf_life_days: 270,
    min_stock_level: 3500,
    current_stock: 8900,
    target_ph: 3.3,
    ph_min: 3.0,
    ph_max: 3.6,
    target_volume: 330.0,
    volume_min: 325.0,
    volume_max: 338.0,
    target_brix: 11.0,
    brix_min: 10.2,
    brix_max: 11.8,
    target_torque: null,
    torque_min: null,
    torque_max: null,
  }
];

export const INITIAL_LINES = [
  {
    id: "line-001",
    name: "Line 1 - High-Speed Bottling (PET)",
    capacity_per_hour: 12000,
    status: "running",
    maintenance_status: "operational"
  },
  {
    id: "line-002",
    name: "Line 2 - Glass & Canning Line",
    capacity_per_hour: 8000,
    status: "running",
    maintenance_status: "operational"
  }
];

export const INITIAL_BATCHES = [
  {
    id: "batch-001",
    batch_number: "BTL-2026-001",
    product_id: "prod-001",
    product_name: "Sierra Pure Water 500ml",
    product_sku: "SPW-500",
    production_line_id: "line-001",
    production_line_name: "Line 1 - High-Speed Bottling (PET)",
    planned_quantity: 25000,
    produced_quantity: 24850,
    status: "approved",
    manufacturing_date: "2026-11-15T08:00:00Z",
    expiry_date: "2027-11-15T08:00:00Z",
    qr_token: "track_btl_2026_001_sierra_springs",
    notes: "High efficiency run, standard mineral equilibrium maintained.",
    ai_risk_level: "low",
    ai_anomaly_score: 0.05
  },
  {
    id: "batch-002",
    batch_number: "BTL-2026-002",
    product_id: "prod-003",
    product_name: "Lion Ginger Malt 330ml",
    product_sku: "LGM-330",
    production_line_id: "line-002",
    production_line_name: "Line 2 - Glass & Canning Line",
    planned_quantity: 18000,
    produced_quantity: 17920,
    status: "approved",
    manufacturing_date: "2026-11-16T09:30:00Z",
    expiry_date: "2027-05-16T09:30:00Z",
    qr_token: "track_btl_2026_002_lion_malt",
    notes: "Glass bottling with crown seal torque calibration verified.",
    ai_risk_level: "low",
    ai_anomaly_score: 0.08
  },
  {
    id: "batch-003",
    batch_number: "BTL-2026-003",
    product_id: "prod-004",
    product_name: "Salone Cola 500ml",
    product_sku: "SCL-500",
    production_line_id: "line-001",
    production_line_name: "Line 1 - High-Speed Bottling (PET)",
    planned_quantity: 20000,
    produced_quantity: 19800,
    status: "quarantined",
    manufacturing_date: "2026-11-16T14:00:00Z",
    expiry_date: "2027-08-16T14:00:00Z",
    qr_token: "track_btl_2026_003_salone_cola",
    notes: "AI Anomaly detected: pH 8.42 alkaline drift vs standard 3.10. Quarantined in Kissy isolation bay.",
    ai_risk_level: "high",
    ai_anomaly_score: 0.88
  },
  {
    id: "batch-004",
    batch_number: "BTL-2026-004",
    product_id: "prod-002",
    product_name: "Sierra Pure Water 1500ml",
    product_sku: "SPW-1500",
    production_line_id: "line-001",
    production_line_name: "Line 1 - High-Speed Bottling (PET)",
    planned_quantity: 12000,
    produced_quantity: 11950,
    status: "in_production",
    manufacturing_date: "2026-11-17T07:30:00Z",
    expiry_date: "2027-11-17T07:30:00Z",
    qr_token: "track_btl_2026_004_water_1500",
    notes: "Mid-morning shift run currently in post-capping visual inspection.",
    ai_risk_level: "low",
    ai_anomaly_score: 0.12
  }
];

export const INITIAL_INSPECTIONS = [
  {
    id: "ins-001",
    batch_id: "batch-001",
    batch_number: "BTL-2026-001",
    product_name: "Sierra Pure Water 500ml",
    inspector_name: "Fatmata Bangura (QC Officer)",
    inspection_type: "Full Laboratory Release Protocol",
    status: "passed",
    sample_size: 24,
    created_at: "2026-11-15T11:45:00Z",
    measurements: [
      { parameter: "pH Level", value: 6.95, unit: "pH", status: "passed", min_spec: 6.5, max_spec: 7.5 },
      { parameter: "Filling Volume", value: 502.4, unit: "ml", status: "passed", min_spec: 495.0, max_spec: 510.0 },
      { parameter: "Cap Seal Torque", value: 18.2, unit: "in-lb", status: "passed", min_spec: 14.0, max_spec: 24.0 },
      { parameter: "Visual Clarity & Seal", value: 0, unit: "defects", status: "passed", min_spec: 0, max_spec: 0 }
    ],
    notes: "Complies fully with Sierra Leone Standards Bureau (SLSB) drinking water quality benchmark."
  },
  {
    id: "ins-002",
    batch_id: "batch-002",
    batch_number: "BTL-2026-002",
    product_name: "Lion Ginger Malt 330ml",
    inspector_name: "Fatmata Bangura (QC Officer)",
    inspection_type: "Fermentation & Carbonation Assay",
    status: "passed",
    sample_size: 24,
    created_at: "2026-11-16T12:30:00Z",
    measurements: [
      { parameter: "pH Level", value: 4.18, unit: "pH", status: "passed", min_spec: 3.8, max_spec: 4.5 },
      { parameter: "Brix Sugar Content", value: 11.4, unit: "°Bx", status: "passed", min_spec: 10.8, max_spec: 12.2 },
      { parameter: "Filling Volume", value: 331.0, unit: "ml", status: "passed", min_spec: 325.0, max_spec: 338.0 },
      { parameter: "Crown Cork Pressure", value: 21.5, unit: "in-lb", status: "passed", min_spec: 16.0, max_spec: 28.0 }
    ],
    notes: "Excellent carbonation retention and spice profile. Approved for Kissy central dispatch."
  },
  {
    id: "ins-003",
    batch_id: "batch-003",
    batch_number: "BTL-2026-003",
    product_name: "Salone Cola 500ml",
    inspector_name: "Fatmata Bangura (QC Officer)",
    inspection_type: "Syrup & Carbonation Verification",
    status: "failed",
    sample_size: 24,
    created_at: "2026-11-16T15:20:00Z",
    measurements: [
      { parameter: "pH Level", value: 8.42, unit: "pH", status: "failed", min_spec: 2.8, max_spec: 3.4 },
      { parameter: "Brix Sugar Content", value: 7.1, unit: "°Bx", status: "failed", min_spec: 9.8, max_spec: 11.2 },
      { parameter: "Filling Volume", value: 491.5, unit: "ml", status: "failed", min_spec: 495.0, max_spec: 510.0 },
      { parameter: "Cap Seal Torque", value: 12.1, unit: "in-lb", status: "failed", min_spec: 14.0, max_spec: 24.0 }
    ],
    notes: "CRITICAL ALERT: pH 8.42 detected. Highly alkaline reading for acidic cola formula. Machine CIP rinse water suspected in line. Automatic quarantine executed."
  }
];

export const INITIAL_PREDICTIONS = [
  {
    id: "pred-001",
    batch_id: "batch-003",
    batch_number: "BTL-2026-003",
    product_name: "Salone Cola 500ml",
    anomaly_detected: true,
    anomaly_score: 0.88,
    failure_probability: 0.94,
    predicted_risk_level: "HIGH",
    primary_risk_factors: [
      "Severe pH anomaly (8.42 vs 3.10 target)",
      "Underfilled containers (491.5ml average)",
      "Substandard torque tightness (12.1 in-lb)"
    ],
    recommendation: "Immediate batch recall/quarantine. Halt Line 1 CIP rinse line. Inspect valve seals and conduct microbiological assay.",
    model_version: "IsolationForest-v2.1 / RandomForest-v2.1",
    created_at: "2026-11-16T15:21:00Z"
  },
  {
    id: "pred-002",
    batch_id: "batch-001",
    batch_number: "BTL-2026-001",
    product_name: "Sierra Pure Water 500ml",
    anomaly_detected: false,
    anomaly_score: 0.05,
    failure_probability: 0.02,
    predicted_risk_level: "LOW",
    primary_risk_factors: ["Normal variation within 99.8% confidence interval"],
    recommendation: "Release batch to Kissy Central Warehouse for distribution.",
    model_version: "IsolationForest-v2.1 / RandomForest-v2.1",
    created_at: "2026-11-15T11:46:00Z"
  }
];

export const INITIAL_WAREHOUSES = [
  {
    id: "wh-001",
    name: "Kissy Central Distribution Warehouse",
    location: "14 Kissy Industrial Estate, Kissy, Freetown",
    code: "WH-KSY-01",
    total_capacity: 250000,
    current_occupancy: 42500,
    status: "active"
  },
  {
    id: "wh-002",
    name: "Lumley Depot & Retail Hub",
    location: "28 Lumley Beach Road, Lumley, Freetown",
    code: "WH-LMY-02",
    total_capacity: 100000,
    current_occupancy: 18200,
    status: "active"
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: "cust-001",
    name: "Choithram Supermarket",
    contact_person: "Dinesh Patel",
    phone: "+232 76 112233",
    email: "procurement@choithram.sl",
    address: "15 Rawdon Street, Central Freetown",
    zone: "Central Business District"
  },
  {
    id: "cust-002",
    name: "St. Michael Wholesale Mart",
    contact_person: "Amadu Conteh",
    phone: "+232 77 445566",
    email: "stmichael@slwholesalers.sl",
    address: "Kissy Road Terminal, Freetown",
    zone: "East End / Kissy"
  },
  {
    id: "cust-003",
    name: "Crown Bakery & Mini Mart",
    contact_person: "Zainab Turay",
    phone: "+232 30 889900",
    email: "crown@wilkinsonrd.sl",
    address: "88 Wilkinson Road, Freetown",
    zone: "West End"
  },
  {
    id: "cust-004",
    name: "Lumley Beach Resort & Lounge",
    contact_person: "Captain Abu Sesay",
    phone: "+232 79 332211",
    email: "resort@lumleybeach.sl",
    address: "Lumley Beach Boulevard, Freetown",
    zone: "West End / Tourism Hub"
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ord-001",
    order_number: "ORD-2026-101",
    customer_id: "cust-001",
    customer_name: "Choithram Supermarket",
    order_date: "2026-11-16T10:00:00Z",
    status: "dispatched",
    total_cases: 400,
    destination: "15 Rawdon Street, Central Freetown",
    items: [
      { product_name: "Sierra Pure Water 500ml", quantity: 300 },
      { product_name: "Lion Ginger Malt 330ml", quantity: 100 }
    ]
  },
  {
    id: "ord-002",
    order_number: "ORD-2026-102",
    customer_id: "cust-003",
    customer_name: "Crown Bakery & Mini Mart",
    order_date: "2026-11-17T08:30:00Z",
    status: "pending_dispatch",
    total_cases: 250,
    destination: "88 Wilkinson Road, Freetown",
    items: [
      { product_name: "Sierra Pure Water 500ml", quantity: 150 },
      { product_name: "Lion Ginger Malt 330ml", quantity: 100 }
    ]
  }
];

export const INITIAL_DELIVERIES = [
  {
    id: "del-001",
    delivery_number: "DEL-2026-001",
    order_id: "ord-001",
    order_number: "ORD-2026-101",
    customer_name: "Choithram Supermarket",
    destination: "15 Rawdon Street, Central Freetown",
    vehicle_reg: "SL-AA-402 (Toyota Dyna)",
    driver_name: "Samuel Koroma",
    driver_phone: "+232 76 998877",
    dispatch_time: "2026-11-16T14:30:00Z",
    status: "in_transit",
    estimated_arrival: "2026-11-16T16:15:00Z",
    notes: "Transit through Kissy By-Pass to Rawdon St CBD."
  },
  {
    id: "del-002",
    delivery_number: "DEL-2026-002",
    order_id: "ord-002",
    order_number: "ORD-2026-102",
    customer_name: "Crown Bakery & Mini Mart",
    destination: "88 Wilkinson Road, Freetown",
    vehicle_reg: "SL-BA-891 (Mitsubishi Fuso)",
    driver_name: "Ibrahim Mansaray",
    driver_phone: "+232 78 554433",
    dispatch_time: "2026-11-17T09:15:00Z",
    status: "assigned",
    estimated_arrival: "2026-11-17T11:00:00Z",
    notes: "Staged at Kissy Bay 3 loading dock."
  }
];

export const INITIAL_MOVEMENTS = [
  {
    id: "mov-001",
    batch_number: "BTL-2026-001",
    product_name: "Sierra Pure Water 500ml",
    movement_type: "Production Receipt",
    quantity: 24850,
    source: "Line 1 Bottling",
    destination: "Kissy Central Warehouse",
    timestamp: "2026-11-15T14:00:00Z",
    operator: "Mohamed Turay"
  },
  {
    id: "mov-002",
    batch_number: "BTL-2026-001",
    product_name: "Sierra Pure Water 500ml",
    movement_type: "Dispatch",
    quantity: 7200,
    source: "Kissy Central Warehouse",
    destination: "Choithram Supermarket (ORD-2026-101)",
    timestamp: "2026-11-16T14:30:00Z",
    operator: "Alhaji Conteh"
  },
  {
    id: "mov-003",
    batch_number: "BTL-2026-002",
    product_name: "Lion Ginger Malt 330ml",
    movement_type: "Production Receipt",
    quantity: 17920,
    source: "Line 2 Canning",
    destination: "Kissy Central Warehouse",
    timestamp: "2026-11-16T13:00:00Z",
    operator: "Mohamed Turay"
  }
];

export const DEMO_USERS: Record<string, any> = {
  "admin@sierrasprings.sl": {
    id: "user-001",
    email: "admin@sierrasprings.sl",
    full_name: "Mariama Sesay",
    role: "Company Administrator",
    company_id: "comp-001",
    company_name: "Sierra Springs & Beverages Ltd"
  },
  "production@sierrasprings.sl": {
    id: "user-002",
    email: "production@sierrasprings.sl",
    full_name: "Ibrahim Kamara",
    role: "Production Manager",
    company_id: "comp-001",
    company_name: "Sierra Springs & Beverages Ltd"
  },
  "quality@sierrasprings.sl": {
    id: "user-003",
    email: "quality@sierrasprings.sl",
    full_name: "Fatmata Bangura",
    role: "Quality Control Officer",
    company_id: "comp-001",
    company_name: "Sierra Springs & Beverages Ltd"
  },
  "warehouse@sierrasprings.sl": {
    id: "user-004",
    email: "warehouse@sierrasprings.sl",
    full_name: "Mohamed Turay",
    role: "Warehouse Manager",
    company_id: "comp-001",
    company_name: "Sierra Springs & Beverages Ltd"
  },
  "distribution@sierrasprings.sl": {
    id: "user-005",
    email: "distribution@sierrasprings.sl",
    full_name: "Alhaji Conteh",
    role: "Distribution Officer",
    company_id: "comp-001",
    company_name: "Sierra Springs & Beverages Ltd"
  },
  "superadmin@beveragetrack.sl": {
    id: "user-000",
    email: "superadmin@beveragetrack.sl",
    full_name: "Dr. Alpha Bah",
    role: "Super Administrator",
    company_id: null,
    company_name: "BeverageTrack AI Platform Authority"
  }
};
