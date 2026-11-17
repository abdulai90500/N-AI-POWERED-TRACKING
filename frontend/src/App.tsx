import React, { useState, useEffect } from 'react';
import { api, User } from './services/api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ProductionView } from './components/ProductionView';
import { QualityControlView } from './components/QualityControlView';
import { AIQualityHubView } from './components/AIQualityHubView';
import { InventoryView } from './components/InventoryView';
import { DistributionView } from './components/DistributionView';
import { QRTraceabilityView } from './components/QRTraceabilityView';
import { PublicTrackView } from './components/PublicTrackView';
import { ReportsView } from './components/ReportsView';
import {
  Factory,
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  QrCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);

  // App data state
  const [overview, setOverview] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  const [parameters, setParameters] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [inventorySummary, setInventorySummary] = useState<any>(null);
  const [movements, setMovements] = useState<any[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [selectedBatchHistory, setSelectedBatchHistory] = useState<any>(null);

  // QR Modal State
  const [activeQRBatch, setActiveQRBatch] = useState<any | null>(null);
  const [publicToken, setPublicToken] = useState<string>('');

  // Login form state
  const [email, setEmail] = useState('admin@sierrasprings.sl');
  const [password, setPassword] = useState('Password123!');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Initial Auth Check
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await api.getMe();
        setCurrentUser(user);
        await loadAllData();
      } catch (err) {
        // Not authenticated or token expired - login screen will show
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const loadAllData = async () => {
    try {
      const [
        ov,
        tr,
        bt,
        pr,
        ln,
        ins,
        pm,
        wh,
        inv,
        mov,
        low,
        cu,
        ord,
        del,
        pred
      ] = await Promise.all([
        api.getDashboardOverview().catch(() => null),
        api.getProductionTrends().then(res => res.trends).catch(() => []),
        api.getBatches().catch(() => []),
        api.getProducts().catch(() => []),
        api.getProductionLines().catch(() => []),
        api.getInspections().catch(() => []),
        api.getQualityParameters().catch(() => []),
        api.getWarehouses().catch(() => []),
        api.getInventorySummary().catch(() => null),
        api.getInventoryMovements().catch(() => []),
        api.getLowStockAlerts().then(res => res.low_stock_items).catch(() => []),
        api.getCustomers().catch(() => []),
        api.getOrders().catch(() => []),
        api.getDeliveries().catch(() => []),
        api.getAIPredictions().catch(() => []),
      ]);

      setOverview(ov);
      setTrends(tr || []);
      setBatches(bt || []);
      setProducts(pr || []);
      setLines(ln || []);
      setInspections(ins || []);
      setParameters(pm || []);
      setWarehouses(wh || []);
      setInventorySummary(inv);
      setMovements(mov || []);
      setLowStockAlerts(low || []);
      setCustomers(cu || []);
      setOrders(ord || []);
      setDeliveries(del || []);
      setPredictions(pred || []);
    } catch (err) {
      console.error('Error loading application data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const auth = await api.login(email, password);
      setCurrentUser(auth.user);
      await loadAllData();
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setLoginError(null);
    try {
      const auth = await api.login(demoEmail, 'Password123!');
      setCurrentUser(auth.user);
      await loadAllData();
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    }
  };

  const handleLogout = () => {
    api.setToken(null);
    setCurrentUser(null);
  };

  const handleRoleSwitch = async (newRole: string) => {
    if (!currentUser) return;
    // Map role to sample demo email
    const roleEmailMap: Record<string, string> = {
      'Company Administrator': 'admin@sierrasprings.sl',
      'Production Manager': 'production@sierrasprings.sl',
      'Quality Control Officer': 'quality@sierrasprings.sl',
      'Warehouse Manager': 'warehouse@sierrasprings.sl',
      'Distribution Officer': 'distribution@sierrasprings.sl',
      'Super Administrator': 'superadmin@beveragetrack.sl',
    };
    const targetEmail = roleEmailMap[newRole] || 'admin@sierrasprings.sl';
    await handleQuickLogin(targetEmail);
  };

  // Actions passed to child components
  const handleCreateBatch = async (batchData: any) => {
    await api.createBatch(batchData);
    await loadAllData();
  };

  const handleSubmitInspection = async (data: any) => {
    await api.submitInspection(data);
    await loadAllData();
  };

  const handleReleaseBatch = async (batchId: string) => {
    await api.releaseBatch(batchId);
    await loadAllData();
  };

  const handleRejectBatch = async (batchId: string, reason?: string) => {
    await api.rejectBatch(batchId, reason);
    await loadAllData();
  };

  const handleReceiveStock = async (data: any) => {
    await api.receiveStock(data);
    await loadAllData();
  };

  const handleCreateOrder = async (data: any) => {
    await api.createOrder(data);
    await loadAllData();
  };

  const handleDispatchDelivery = async (data: any) => {
    await api.dispatchDelivery(data);
    await loadAllData();
  };

  const handleUpdateDeliveryStatus = async (deliveryId: string, data: any) => {
    await api.updateDelivery(deliveryId, data);
    await loadAllData();
  };

  const handleSelectBatchForTracking = async (batchId: string) => {
    try {
      const history = await api.getInternalTracking(batchId);
      setSelectedBatchHistory(history);
      setActiveTab('tracking');
    } catch (err: any) {
      alert(`Could not fetch batch history: ${err.message}`);
    }
  };

  const handleOpenQR = async (batchId: string) => {
    try {
      const qrData = await api.getBatchQR(batchId);
      setActiveQRBatch(qrData);
    } catch (err: any) {
      alert(`Could not load QR code: ${err.message}`);
    }
  };

  const handleOpenPublicTrack = (token: string) => {
    setPublicToken(token);
    setActiveTab('public-track');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-xl bg-sky-500 animate-spin flex items-center justify-center mb-4">
          <Factory className="w-6 h-6 text-white" />
        </div>
        <p className="font-extrabold text-base tracking-tight">BeverageTrack AI</p>
        <p className="text-xs text-slate-400 mt-1">Connecting to Freetown Bottling Core...</p>
      </div>
    );
  }

  // If Not Authenticated -> Login / Demo Portal
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-tr from-sky-500 to-brand-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-sky-600/30 mb-3">
              <Factory className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">BeverageTrack AI</h1>
            <p className="text-xs text-slate-500 mt-1">
              Quality Assurance & Distribution Information System • Freetown, Sierra Leone
            </p>
          </div>

          <div className="mb-4 p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-sky-600 flex-shrink-0" /> Interactive Cloud Demo Active
            </span>
            <span className="text-[10px] text-sky-700 font-semibold bg-white/80 px-2 py-0.5 rounded border border-sky-200">
              Zero Setup Needed
            </span>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Staff Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              Authenticate & Enter System
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Role Switcher Demo Cards */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              1-Click Demo Accounts (All 6 Roles)
            </p>
            <div className="grid grid-cols-2 gap-2 text-left">
              {[
                { role: 'Company Admin', email: 'admin@sierrasprings.sl', badge: 'Admin' },
                { role: 'Quality Control', email: 'quality@sierrasprings.sl', badge: 'QC Lead' },
                { role: 'Production Mgr', email: 'production@sierrasprings.sl', badge: 'Factory' },
                { role: 'Warehouse Mgr', email: 'warehouse@sierrasprings.sl', badge: 'Stock' },
                { role: 'Distribution Off', email: 'distribution@sierrasprings.sl', badge: 'Fleet' },
                { role: 'Super Admin', email: 'superadmin@beveragetrack.sl', badge: 'Global' },
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email)}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-left transition group"
                >
                  <p className="text-[11px] font-bold text-slate-800 group-hover:text-sky-700 truncate">{acc.role}</p>
                  <p className="text-[9px] text-slate-400 font-mono truncate">{acc.email}</p>
                </button>
              ))}
            </div>

            {/* Multi-tenant Isolation Test */}
            <div className="mt-3 p-2 rounded-lg bg-amber-50 border border-amber-200 text-left">
              <div className="flex justify-between items-center text-[10px] font-bold text-amber-900 mb-1">
                <span>Multi-Tenancy Isolation Test:</span>
                <span className="bg-amber-200 text-amber-800 px-1 rounded text-[9px]">Tenant 2</span>
              </div>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@lionsoftdrinks.sl')}
                className="w-full text-left text-[11px] font-bold text-amber-800 hover:underline"
              >
                Sign in as Lion Soft Drinks Co. (Independent Tenant) →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Authenticated Application Layout
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadAlertsCount={overview?.kpis?.ai_anomalies_flagged || 0}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentUser={currentUser}
          onRoleSwitch={handleRoleSwitch}
          onLogout={handleLogout}
          activeTab={activeTab}
        />

        <main className="p-6 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              overview={overview}
              trends={trends}
              onNavigate={setActiveTab}
              onSelectBatchForTracking={handleSelectBatchForTracking}
            />
          )}

          {activeTab === 'production' && (
            <ProductionView
              batches={batches}
              products={products}
              lines={lines}
              onCreateBatch={handleCreateBatch}
              onSelectBatchForTracking={handleSelectBatchForTracking}
              onOpenQR={handleOpenQR}
            />
          )}

          {activeTab === 'quality' && (
            <QualityControlView
              inspections={inspections}
              batches={batches}
              products={products}
              parameters={parameters}
              onSubmitInspection={handleSubmitInspection}
              onReleaseBatch={handleReleaseBatch}
              onRejectBatch={handleRejectBatch}
            />
          )}

          {activeTab === 'ai' && (
            <AIQualityHubView
              predictions={predictions}
              onRunAnomalyDetection={api.runAnomalyDetection.bind(api)}
              onRunFailurePrediction={api.runFailurePrediction.bind(api)}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              warehouses={warehouses}
              inventorySummary={inventorySummary}
              movements={movements}
              lowStockAlerts={lowStockAlerts}
              batches={batches}
              onReceiveStock={handleReceiveStock}
            />
          )}

          {activeTab === 'distribution' && (
            <DistributionView
              orders={orders}
              deliveries={deliveries}
              customers={customers}
              batches={batches}
              onCreateOrder={handleCreateOrder}
              onDispatchDelivery={handleDispatchDelivery}
              onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
            />
          )}

          {activeTab === 'tracking' && (
            <QRTraceabilityView
              batches={batches}
              selectedBatchHistory={selectedBatchHistory}
              onFetchHistory={async (id) => {
                const hist = await api.getInternalTracking(id);
                setSelectedBatchHistory(hist);
              }}
              onOpenPublicTrack={handleOpenPublicTrack}
            />
          )}

          {activeTab === 'public-track' && (
            <PublicTrackView
              initialToken={publicToken || batches[0]?.qr_token || 'beveragetrack-token'}
              onBackToDashboard={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              overview={overview}
              batches={batches}
              inspections={inspections}
              deliveries={deliveries}
            />
          )}
        </main>
      </div>

      {/* Global QR Code Modal */}
      {activeQRBatch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-base">{activeQRBatch.batch_number}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Secure Batch QR Code & Passport</p>

            <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
              {/* Fallback visual QR rendering */}
              <div className="w-44 h-44 bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-between text-white shadow-md">
                <div className="w-full flex justify-between text-[8px] font-mono text-sky-400">
                  <span>QC-CERT</span>
                  <span>SLSB-VERIFIED</span>
                </div>
                <div className="w-28 h-28 bg-white rounded-lg p-2 flex items-center justify-center">
                  <div className="text-slate-950 font-mono text-center text-xs font-black">
                    QR TOKEN<br />
                    <span className="text-[9px] text-sky-700">{activeQRBatch.token?.slice(0, 8)}</span>
                  </div>
                </div>
                <p className="text-[9px] font-mono text-slate-400">SIERRA SPRINGS & BEV.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-left text-xs mb-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Public Verification Token</p>
              <p className="font-mono font-bold text-slate-800 break-all">{activeQRBatch.token}</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  handleOpenPublicTrack(activeQRBatch.token);
                  setActiveQRBatch(null);
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition"
              >
                View Public Consumer Certification
              </button>
              <button
                onClick={() => setActiveQRBatch(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
