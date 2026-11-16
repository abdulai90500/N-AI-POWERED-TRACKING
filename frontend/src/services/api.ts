const API_BASE = 'http://localhost:8000/api/v1';

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

  constructor() {
    this.token = localStorage.getItem('bt_token');
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
    return this.token || localStorage.getItem('bt_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
        let errMessage = `Error ${res.status}: ${res.statusText}`;
        try {
          const errData = await res.json();
          if (errData.detail) {
            errMessage = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
          }
        } catch (_) {}
        throw new Error(errMessage);
      }
      return await res.json();
    } catch (err: any) {
      console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
      throw err;
    }
  }

  // Auth
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
