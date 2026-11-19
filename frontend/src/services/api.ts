import {
  INITIAL_PRODUCTS,
  INITIAL_LINES,
  INITIAL_BATCHES,
  INITIAL_INSPECTIONS,
  INITIAL_PREDICTIONS,
  INITIAL_WAREHOUSES,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_DELIVERIES,
  INITIAL_MOVEMENTS,
  INITIAL_WATER_LOTS,
  WaterLot,
  DEMO_USERS
} from './mockData';

// Dynamic API Base URL
export const getApiBase = (): string => {
  if (typeof window !== 'undefined') {
    // Check localStorage override
    const custom = localStorage.getItem('bt_custom_api_url');
    if (custom) return custom;

    // Check Vite environment variable
    const metaEnv = (import.meta as any)?.env;
    if (metaEnv?.VITE_API_URL) {
      return `${metaEnv.VITE_API_URL}/api/v1`;
    }

    // In local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8000/api/v1';
    }
  }
  // Return empty string for standalone cloud demo so calls resolve instantly in-browser
  return '';
};

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  company_id?: string;
  company_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

class ApiService {
  private token: string | null = null;
  public isLiveBackend: boolean = false;
  private memoryStore: {
    batches: any[];
    inspections: any[];
    predictions: any[];
    movements: any[];
    orders: any[];
    deliveries: any[];
    products: any[];
    waterLots: any[];
  };

  constructor() {
    this.token = typeof window !== 'undefined' ? localStorage.getItem('bt_token') : null;
    this.memoryStore = {
      batches: [...INITIAL_BATCHES],
      inspections: [...INITIAL_INSPECTIONS],
      predictions: [...INITIAL_PREDICTIONS],
      movements: [...INITIAL_MOVEMENTS],
      orders: [...INITIAL_ORDERS],
      deliveries: [...INITIAL_DELIVERIES],
      products: [...INITIAL_PRODUCTS],
      waterLots: [...INITIAL_WATER_LOTS],
    };
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('bt_token', token);
    } else {
      localStorage.removeItem('bt_token');
    }
  }

  getToken(): string | null {
    return this.token || (typeof window !== 'undefined' ? localStorage.getItem('bt_token') : null);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const apiBase = getApiBase();
    
    // If no live backend is configured (e.g. standalone Vercel preview), resolve immediately via in-browser engine
    if (!apiBase) {
      this.isLiveBackend = false;
      return this.handleFallback<T>(endpoint, options);
    }

    const url = `${apiBase}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      // 1.5s timeout for local API connection check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const res = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error(`Invalid response (${res.status})`);
      }
      this.isLiveBackend = true;
      return await res.json();
    } catch (_) {
      this.isLiveBackend = false;
      return this.handleFallback<T>(endpoint, options);
    }
  }

  // --- Fallback & Cloud Demo Mock Handler ---
  private handleFallback<T>(endpoint: string, options: RequestInit): T {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : {};

    // Auth Login
    if (endpoint === '/auth/login' && method === 'POST') {
      const email = body.email || 'admin@sierrasprings.sl';
      const user = DEMO_USERS[email] || {
        id: 'user-guest',
        email: email,
        full_name: 'Factory Supervisor',
        role: 'Company Administrator',
        company_id: 'comp-001',
        company_name: 'Sierra Springs & Beverages Ltd'
      };
      const token = `mock_jwt_token_${user.id}`;
      this.setToken(token);
      return {
        access_token: token,
        token_type: 'bearer',
        user
      } as unknown as T;
    }

    // Auth Me
    if (endpoint === '/auth/me') {
      const token = this.getToken();
      if (!token) {
        throw new Error('Not authenticated. Please sign in.');
      }
      // If token exists, find matching demo user or default to admin
      const email = token.replace('mock_jwt_token_', '');
      const user = Object.values(DEMO_USERS).find(u => u.id === email || u.email === email) || DEMO_USERS['admin@sierrasprings.sl'];
      return user as unknown as T;
    }

    // Demo Accounts
    if (endpoint === '/auth/demo-accounts') {
      return {
        demo_accounts: Object.values(DEMO_USERS)
      } as unknown as T;
    }

    // Dashboard Overview
    if (endpoint === '/dashboard/overview') {
      const totalBatches = this.memoryStore.batches.length;
      const approvedBatches = this.memoryStore.batches.filter(b => b.status === 'approved').length;
      const passRate = totalBatches > 0 ? (approvedBatches / totalBatches) * 100 : 96.4;
      const totalProduced = this.memoryStore.batches.reduce((sum, b) => sum + (Number(b.quantity_produced || b.produced_quantity || 10000)), 0);
      const totalStock = this.memoryStore.batches.reduce((sum, b) => sum + (Number(b.available_stock || 12000)), 0);
      const anomalies = this.memoryStore.predictions.filter(p => p.anomaly_detected).length || 1;

      return {
        today_production: 74620,
        target_production: 75000,
        production_efficiency: 99.4,
        quality_pass_rate: Number(passRate.toFixed(1)),
        quarantined_batches: this.memoryStore.batches.filter(b => b.status === 'quarantined').length,
        total_inventory_cases: totalStock,
        active_deliveries: this.memoryStore.deliveries.filter(d => d.status === 'in_transit').length,
        ai_risk_alerts: anomalies,
        kpis: {
          bottles_produced: totalProduced || 74620,
          quality_pass_rate: Number(passRate.toFixed(1)),
          available_stock: totalStock || 60700,
          deliveries_recorded: this.memoryStore.deliveries.length,
          ai_anomalies_flagged: anomalies,
          active_in_transit: this.memoryStore.deliveries.filter(d => d.status === 'in_transit').length || 1,
        },
        recent_batches: this.memoryStore.batches.slice(0, 5).map(b => ({
          id: b.id,
          batch_number: b.batch_number,
          product_name: b.product_name,
          quantity: Number(b.quantity_produced || b.produced_quantity || 10000),
          date: b.production_date || '2026-11-17',
          status: b.status || 'approved'
        }))
      } as unknown as T;
    }

    // Production Trends
    if (endpoint === '/dashboard/production-trends') {
      return {
        trends: [
          { date: '2026-11-11', produced: 22000, target: 20000, pass_rate: 98.2 },
          { date: '2026-11-12', produced: 24500, target: 25000, pass_rate: 97.5 },
          { date: '2026-11-13', produced: 21800, target: 22000, pass_rate: 96.0 },
          { date: '2026-11-14', produced: 26000, target: 25000, pass_rate: 99.1 },
          { date: '2026-11-15', produced: 24850, target: 25000, pass_rate: 98.8 },
          { date: '2026-11-16', produced: 37720, target: 38000, pass_rate: 66.7 },
          { date: '2026-11-17', produced: 11950, target: 12000, pass_rate: 99.5 },
        ]
      } as unknown as T;
    }

    // Water Sourcing & Intake (Step 1 of Bottling)
    if (endpoint.startsWith('/water/lots') && method === 'GET') {
      return this.memoryStore.waterLots as unknown as T;
    }

    if (endpoint === '/water/lots' && method === 'POST') {
      const newLot: WaterLot = {
        id: `wlot-${Date.now()}`,
        lot_number: body.lot_number || `RW-2026-00${this.memoryStore.waterLots.length + 1}`,
        source_name: body.source_name || 'Borehole Aquifer 1 (Kissy Deep Artesian Well)',
        source_type: body.source_type || 'borehole_1',
        volume_liters: Number(body.volume_liters) || 50000,
        tds_ppm: Number(body.tds_ppm) || 115,
        ph_level: Number(body.ph_level) || 7.15,
        turbidity_ntu: Number(body.turbidity_ntu) || 0.14,
        conductivity_us: Number(body.conductivity_us) || 185,
        treatment_status: body.treatment_status || 'lab_approved',
        ro_stage: body.ro_stage || 'RO Membrane 3-Pass + UV Sanitized',
        coliform_count: 0,
        chlorine_residual_ppm: Number(body.chlorine_residual_ppm) || 0.02,
        intake_timestamp: new Date().toISOString(),
        engineer_name: body.engineer_name || 'Samuel Kamara (Lead Water Treatment Engineer)',
        notes: body.notes || 'Intake logged and passed reverse osmosis pre-testing.'
      };
      this.memoryStore.waterLots.unshift(newLot);
      return newLot as unknown as T;
    }

    if (endpoint.includes('/transfer-to-production') && method === 'POST') {
      const parts = endpoint.split('/');
      const lotId = parts[parts.indexOf('lots') + 1];
      const lot = this.memoryStore.waterLots.find(w => w.id === lotId);
      
      const targetLine = body.production_line_name || INITIAL_LINES[0].name;
      const plannedQty = Number(body.planned_quantity) || (lot ? Math.floor(lot.volume_liters * 1.95) : 25000);
      const product = this.memoryStore.products[0];

      // Auto-create connected production batch
      const newBatchNumber = `BTL-2026-00${this.memoryStore.batches.length + 1}`;
      const newBatch = {
        id: `batch-${Date.now()}`,
        batch_number: newBatchNumber,
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        production_line_id: body.production_line_id || INITIAL_LINES[0].id,
        production_line_name: targetLine,
        line_name: targetLine,
        planned_quantity: plannedQty,
        produced_quantity: plannedQty,
        quantity_produced: plannedQty,
        available_stock: plannedQty,
        status: 'in_production',
        production_date: new Date().toISOString().split('T')[0],
        manufacturing_date: new Date().toISOString(),
        expiry_date: new Date(Date.now() + 365*24*60*60*1000).toISOString(),
        qr_token: `track_btl_${newBatchNumber.toLowerCase().replace(/-/g, '_')}`,
        notes: `Batch initiated from Water Lot ${lot ? lot.lot_number : 'RW-INTAKE'} (${lot ? lot.source_name : 'Borehole'})`,
        source_water_lot: lot ? lot.lot_number : 'RW-INTAKE',
        ai_risk_level: 'low',
        ai_anomaly_score: 0.04
      };

      if (lot) {
        lot.treatment_status = 'transferred_to_production';
        lot.assigned_production_line = targetLine;
        lot.target_batch_id = newBatch.id;
      }

      this.memoryStore.batches.unshift(newBatch);
      return {
        message: `Water Lot ${lot?.lot_number} successfully released and transferred to ${targetLine}! Production batch ${newBatchNumber} is now live.`,
        water_lot: lot,
        batch: newBatch
      } as unknown as T;
    }

    // Batches
    if (endpoint.startsWith('/production/batches') && method === 'GET') {
      return this.memoryStore.batches as unknown as T;
    }

    if (endpoint === '/production/batches' && method === 'POST') {
      const product = this.memoryStore.products.find(p => p.id === body.product_id) || this.memoryStore.products[0];
      const newBatch = {
        id: `batch-${Date.now()}`,
        batch_number: body.batch_number || `BTL-2026-00${this.memoryStore.batches.length + 1}`,
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        production_line_id: body.production_line_id || INITIAL_LINES[0].id,
        production_line_name: INITIAL_LINES[0].name,
        planned_quantity: body.planned_quantity || 10000,
        produced_quantity: body.planned_quantity || 10000,
        status: 'in_production',
        manufacturing_date: new Date().toISOString(),
        expiry_date: new Date(Date.now() + 365*24*60*60*1000).toISOString(),
        qr_token: `track_btl_${Date.now()}`,
        notes: body.notes || 'Registered through production console',
        ai_risk_level: 'low',
        ai_anomaly_score: 0.05
      };
      this.memoryStore.batches.unshift(newBatch);
      return newBatch as unknown as T;
    }

    // Products & Lines
    if (endpoint === '/products') return this.memoryStore.products as unknown as T;
    if (endpoint === '/production-lines') return INITIAL_LINES as unknown as T;

    // Quality Inspections
    if (endpoint.startsWith('/quality/inspections') && method === 'GET') {
      return this.memoryStore.inspections as unknown as T;
    }

    if (endpoint === '/quality/inspections' && method === 'POST') {
      const batch = this.memoryStore.batches.find(b => b.id === body.batch_id);
      const isFailed = (body.measurements || []).some((m: any) => m.status === 'failed');
      const newInspection = {
        id: `ins-${Date.now()}`,
        batch_id: body.batch_id,
        batch_number: batch ? batch.batch_number : 'BTL-UNKNOWN',
        product_name: batch ? batch.product_name : 'Beverage Item',
        inspector_name: 'Fatmata Bangura (QC Officer)',
        inspection_type: body.inspection_type || 'Routine Quality Audit',
        status: isFailed ? 'failed' : 'passed',
        sample_size: body.sample_size || 24,
        created_at: new Date().toISOString(),
        measurements: body.measurements || [],
        notes: body.notes || (isFailed ? 'Quality deviations logged by inspector.' : 'Meets all SLSB specifications.')
      };
      this.memoryStore.inspections.unshift(newInspection);

      if (batch) {
        batch.status = isFailed ? 'quarantined' : 'approved';
      }
      return newInspection as unknown as T;
    }

    // Release / Reject
    if (endpoint.includes('/release') && method === 'POST') {
      const parts = endpoint.split('/');
      const batchId = parts[parts.indexOf('batches') + 1];
      const batch = this.memoryStore.batches.find(b => b.id === batchId);
      if (batch) batch.status = 'approved';
      return { message: 'Batch successfully approved and released for inventory dispatch.' } as unknown as T;
    }

    if (endpoint.includes('/reject') && method === 'POST') {
      const parts = endpoint.split('/');
      const batchId = parts[parts.indexOf('batches') + 1];
      const batch = this.memoryStore.batches.find(b => b.id === batchId);
      if (batch) batch.status = 'quarantined';
      return { message: 'Batch marked quarantined / rejected.' } as unknown as T;
    }

    if (endpoint.startsWith('/quality/parameters')) {
      return [
        { id: 'param-ph', parameter_name: 'pH Level', name: 'pH Level', min_value: 6.5, max_value: 7.5, unit: 'pH' },
        { id: 'param-vol', parameter_name: 'Filling Volume', name: 'Filling Volume', min_value: 495.0, max_value: 510.0, unit: 'ml' },
        { id: 'param-torque', parameter_name: 'Cap Seal Torque', name: 'Cap Seal Torque', min_value: 14.0, max_value: 24.0, unit: 'in-lb' },
        { id: 'param-visual', parameter_name: 'Visual Clarity & Seal', name: 'Visual Clarity & Seal', min_value: 0, max_value: 0, unit: 'defects' }
      ] as unknown as T;
    }

    // AI Predictions & Quality
    if (endpoint === '/ai/anomaly/detect' && method === 'POST') {
      const ph = Number(body.ph ?? body.ph_level ?? 7.0);
      const isAnomaly = ph > 7.6 || ph < 6.4 || (body.visual_defects && Number(body.visual_defects) > 0);
      const riskLevel = isAnomaly ? (ph > 8.0 ? 'critical' : 'high') : 'low';
      return {
        anomaly_detected: isAnomaly,
        anomaly_score: isAnomaly ? 0.88 : 0.05,
        risk_level: riskLevel,
        isolation_forest_decision: isAnomaly ? -1 : 1,
        reasons: isAnomaly
          ? [
              `Multivariate outlier: pH level ${ph.toFixed(2)} drifts outside allowable standard.`,
              'Torque tension / volumetric fill ratio shows micro-leak risk.',
              'Potential chemical CIP caustic rinse residual contamination.'
            ]
          : [
              'All chemical and physical parameters within 99.4% confidence envelope.',
              'Seal torque and volumetric variance conform to SLSB drinking water benchmarks.'
            ],
        recommendation: isAnomaly
          ? 'Immediately flag batch for QA quarantine. Halt Line 1 filling manifold and conduct titration sweep.'
          : 'Measurements are consistent with normal operating production run. Approve for warehouse receipt.'
      } as unknown as T;
    }

    if (endpoint === '/ai/quality/predict' && method === 'POST') {
      const ph = Number(body.ph ?? body.ph_level ?? 7.0);
      const isHighRisk = ph > 7.6 || ph < 6.4;
      return {
        failure_probability: isHighRisk ? 0.93 : 0.04,
        risk_classification: isHighRisk ? 'Critical Defect / High Failure Risk' : 'Standard Quality / Low Failure Risk',
        contributing_factors: isHighRisk
          ? [
              { factor: 'pH Alkaline Drift', contribution: 0.62 },
              { factor: 'Fill Volume Fluctuation', contribution: 0.21 },
              { factor: 'Cap Torque Variance', contribution: 0.12 },
              { factor: 'Line Temp Deviation', contribution: 0.05 }
            ]
          : [
              { factor: 'pH Stability', contribution: 0.45 },
              { factor: 'Volumetric Accuracy', contribution: 0.35 },
              { factor: 'Seal Hermeticity', contribution: 0.20 }
            ],
        recommendation: isHighRisk
          ? 'Quarantine batch immediately. Halt line and perform chemical titration audit.'
          : 'Proceed with standard inventory transfer to Kissy Central Depot.'
      } as unknown as T;
    }

    if (endpoint.startsWith('/ai/predictions')) {
      return this.memoryStore.predictions as unknown as T;
    }

    if (endpoint === '/ai/model/performance') {
      return {
        accuracy: 0.984,
        f1_score: 0.976,
        samples_trained: 14500,
        model_type: 'Ensemble Isolation Forest + Random Forest Classifier (Sierra Leone Bottling Dataset)'
      } as unknown as T;
    }

    // Warehouses & Inventory
    if (endpoint === '/inventory/warehouses') return INITIAL_WAREHOUSES as unknown as T;
    if (endpoint === '/inventory/summary') {
      return {
        total_bottles_in_stock: 60700,
        total_units: 60700,
        warehouses: INITIAL_WAREHOUSES,
        inventory: this.memoryStore.batches.map(b => ({
          batch_id: b.id,
          batch_number: b.batch_number,
          product_name: b.product_name,
          product_category: b.product_category || 'Bottled Beverage',
          available_stock: b.available_stock || 15000,
          quantity_produced: b.quantity_produced || b.produced_quantity || 20000,
          production_date: b.production_date || '2026-11-15',
          expiry_date: b.expiry_date || '2027-11-15'
        })),
        category_breakdown: [
          { category: 'Bottled Water', units: 36300 },
          { category: 'Malt Beverage', units: 17200 },
          { category: 'Carbonated Soft Drink', units: 4200 },
          { category: 'Fruit Soda', units: 3000 }
        ]
      } as unknown as T;
    }

    if (endpoint === '/inventory/movements') return this.memoryStore.movements as unknown as T;
    if (endpoint === '/inventory/low-stock') {
      return {
        low_stock_items: [
          { product_name: 'Salone Cola 500ml', current_stock: 4200, min_threshold: 6000, deficit: 1800 }
        ]
      } as unknown as T;
    }

    // Distribution
    if (endpoint === '/distribution/customers') return INITIAL_CUSTOMERS as unknown as T;
    if (endpoint === '/distribution/orders') return this.memoryStore.orders as unknown as T;
    if (endpoint === '/distribution/deliveries') return this.memoryStore.deliveries as unknown as T;

    // Tracking
    if (endpoint.includes('/public/track/')) {
      return {
        batch_number: 'BTL-2026-001',
        product_name: 'Sierra Pure Water 500ml',
        manufacturer: 'Sierra Springs & Beverages Ltd',
        factory_location: '14 Kissy Industrial Estate, Freetown, Sierra Leone',
        production_date: '2026-11-15',
        expiry_date: '2027-11-15',
        quality_status: 'SLSB Certified - Passed',
        inspection_date: '2026-11-15',
        authenticity_verified: true,
        verification_message: 'Genuine Sierra Leone Manufactured Beverage. Safe for Consumption.'
      } as unknown as T;
    }

    if (endpoint.includes('/history')) {
      return {
        batch: this.memoryStore.batches[0],
        timeline: [
          { stage: 'Production Registered', date: '2026-11-15 08:00', operator: 'Ibrahim Kamara', status: 'completed' },
          { stage: 'QC Chemical & Physical Analysis', date: '2026-11-15 11:45', operator: 'Fatmata Bangura', status: 'completed' },
          { stage: 'AI Anomaly & Risk Evaluation', date: '2026-11-15 11:46', operator: 'BeverageTrack AI Engine', status: 'passed' },
          { stage: 'Warehouse Receipt (Kissy)', date: '2026-11-15 14:00', operator: 'Mohamed Turay', status: 'completed' },
          { stage: 'Fleet Dispatch (Choithram Supermarket)', date: '2026-11-16 14:30', operator: 'Alhaji Conteh', status: 'in_transit' }
        ]
      } as unknown as T;
    }

    if (endpoint.includes('/qr')) {
      return {
        qr_token: 'track_btl_2026_001_sierra_springs',
        qr_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="160" height="160"><rect width="100" height="100" fill="#ffffff"/><path d="M10 10h30v30h-30zM50 10h10v10h-10zM70 10h20v20h-20zM20 20h10v10h-10zM10 50h10v30h-10zM30 50h20v10h-20zM30 70h10v20h-10zM60 50h30v40h-30zM70 60h10v20h-10z" fill="#0284c7"/></svg>`
      } as unknown as T;
    }

    return {} as T;
  }

  // --- Real-Time Connection Diagnostic ---
  async checkBackendConnection(): Promise<boolean> {
    const apiBase = getApiBase();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${apiBase}/dashboard/overview`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      this.isLiveBackend = res.ok;
      return res.ok;
    } catch (_) {
      this.isLiveBackend = false;
      return false;
    }
  }

  // Auth Methods
  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async getMe(): Promise<any> {
    return this.request('/auth/me');
  }

  async getDemoAccounts(): Promise<{ demo_accounts: any[] }> {
    return this.request('/auth/demo-accounts');
  }

  // Dashboard
  async getDashboardOverview(): Promise<any> {
    return this.request('/dashboard/overview');
  }

  async getProductionTrends(): Promise<any> {
    return this.request('/dashboard/production-trends');
  }

  // Water Sourcing & Intake (Step 1)
  async getWaterLots(): Promise<WaterLot[]> {
    return this.request('/water/lots');
  }

  async createWaterLot(lotData: any): Promise<WaterLot> {
    return this.request('/water/lots', {
      method: 'POST',
      body: JSON.stringify(lotData),
    });
  }

  async sendWaterToProduction(waterLotId: string, data: any = {}): Promise<any> {
    return this.request(`/water/lots/${waterLotId}/transfer-to-production`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Production
  async getBatches(status?: string, productId?: string): Promise<any[]> {
    let q = '';
    if (status) q += `?status=${status}`;
    return this.request(`/production/batches${q}`);
  }

  async createBatch(batchData: any): Promise<any> {
    return this.request('/production/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
  }

  async getProducts(): Promise<any[]> {
    return this.request('/products');
  }

  async getProductionLines(): Promise<any[]> {
    return this.request('/production-lines');
  }

  // Quality Control
  async getInspections(batchId?: string): Promise<any[]> {
    const q = batchId ? `?batch_id=${batchId}` : '';
    return this.request(`/quality/inspections${q}`);
  }

  async submitInspection(data: any): Promise<any> {
    return this.request('/quality/inspections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async releaseBatch(batchId: string): Promise<any> {
    return this.request(`/quality/batches/${batchId}/release`, {
      method: 'POST',
    });
  }

  async rejectBatch(batchId: string, reason?: string): Promise<any> {
    return this.request(`/quality/batches/${batchId}/reject?reason=${encodeURIComponent(reason || 'Quality failure')}`, {
      method: 'POST',
    });
  }

  async getQualityParameters(productId?: string): Promise<any[]> {
    const q = productId ? `?product_id=${productId}` : '';
    return this.request(`/quality/parameters${q}`);
  }

  // AI Quality
  async runAnomalyDetection(data: any): Promise<any> {
    return this.request('/ai/anomaly/detect', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async runFailurePrediction(data: any): Promise<any> {
    return this.request('/ai/quality/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAIPredictions(batchId?: string): Promise<any[]> {
    const q = batchId ? `?batch_id=${batchId}` : '';
    return this.request(`/ai/predictions${q}`);
  }

  async getAIModelPerformance(): Promise<any> {
    return this.request('/ai/model/performance');
  }

  // Inventory
  async getWarehouses(): Promise<any[]> {
    return this.request('/inventory/warehouses');
  }

  async getInventorySummary(): Promise<any> {
    return this.request('/inventory/summary');
  }

  async receiveStock(data: any): Promise<any> {
    return this.request('/inventory/receive', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInventoryMovements(): Promise<any[]> {
    return this.request('/inventory/movements');
  }

  async getLowStockAlerts(): Promise<any> {
    return this.request('/inventory/low-stock');
  }

  // Distribution
  async getCustomers(): Promise<any[]> {
    return this.request('/distribution/customers');
  }

  async getOrders(): Promise<any[]> {
    return this.request('/distribution/orders');
  }

  async createOrder(data: any): Promise<any> {
    return this.request('/distribution/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDeliveries(): Promise<any[]> {
    return this.request('/distribution/deliveries');
  }

  async dispatchDelivery(data: any): Promise<any> {
    return this.request('/distribution/deliveries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDelivery(deliveryId: string, data: any): Promise<any> {
    return this.request(`/distribution/deliveries/${deliveryId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Tracking
  async getPublicTracking(token: string): Promise<any> {
    return this.request(`/public/track/${token}`);
  }

  async getInternalTracking(batchId: string): Promise<any> {
    return this.request(`/tracking/batches/${batchId}/history`);
  }

  async getBatchQR(batchId: string): Promise<any> {
    return this.request(`/tracking/batches/${batchId}/qr`);
  }
}

export const api = new ApiService();
