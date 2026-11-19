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
import { BottleAIScanIllustration } from './components/BottleAIScanIllustration';
import { MobileQRScanner } from './components/MobileQRScanner';
import { SettingsModal } from './components/SettingsModal';
import { CredentialsDirectoryModal } from './components/CredentialsDirectoryModal';
import { AdminConsoleView } from './components/AdminConsoleView';
import { ProcessStepsModal } from './components/ProcessStepsModal';
import { WaterIntakeView } from './components/WaterIntakeView';
import { AIVoiceCommander } from './components/AIVoiceCommander';
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
  AlertCircle,
  Camera,
  Smartphone,
  ChevronDown,
  UserCheck,
  Zap,
  Globe,
  Eye,
  EyeOff,
  KeyRound,
  ScanLine
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [showMobileScanner, setShowMobileScanner] = useState<boolean>(false);
  const [showUniversalScanner, setShowUniversalScanner] = useState<boolean>(false);

  // App data state
  const [overview, setOverview] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [waterLots, setWaterLots] = useState<any[]>([]);
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

  // Settings & Credentials Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState<boolean>(false);
  const [isProcessStepsOpen, setIsProcessStepsOpen] = useState<boolean>(false);

  // Login form state - preloaded with Admin as primary assigned role
  const [email, setEmail] = useState('admin@sierrasprings.sl');
  const [password, setPassword] = useState('UmuShawTeam2026!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [roleSelection, setRoleSelection] = useState<string>('admin@sierrasprings.sl');
  const [loginTab, setLoginTab] = useState<'credentials' | 'badge_scan'>('credentials');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [scannedBadgeStaff, setScannedBadgeStaff] = useState<string | null>(null);

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
        wl,
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
        api.getWaterLots().catch(() => []),
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
      setWaterLots(wl || []);
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
    setPassword('UmuShawTeam2026!');
    setLoginError(null);
    try {
      const auth = await api.login(demoEmail, 'UmuShawTeam2026!');
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
  const handleCreateWaterLot = async (lotData: any) => {
    await api.createWaterLot(lotData);
    await loadAllData();
  };

  const handleSendWaterToProduction = async (lotId: string, data: any) => {
    const res = await api.sendWaterToProduction(lotId, data);
    await loadAllData();
    return res;
  };

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

  const handleUpdateProfile = (updated: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updated };
      setCurrentUser(updatedUser);
      localStorage.setItem('bt_current_user', JSON.stringify(updatedUser));
    }
  };

  const handleAbortBatch = async (batchId: string, reason: string) => {
    try {
      await api.rejectBatch(batchId, reason);
      await loadAllData();
    } catch (err: any) {
      console.warn('Batch abort error:', err);
    }
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

  // If Not Authenticated -> Side-by-Side Login & AI Bottle Scanner Portal
  if (!currentUser) {
    if (showMobileScanner) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 flex flex-col justify-center items-center p-4">
          <MobileQRScanner
            onClose={() => setShowMobileScanner(false)}
            onAdminLogin={() => handleQuickLogin('admin@sierrasprings.sl')}
            onStaffLogin={(email) => handleQuickLogin(email)}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Dual-Mode SaaS Login (Enter Credentials or Scan Badge) */}
          <div className="lg:col-span-5 bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between">
            <div>
              {/* Header Badge: Sierra Leone National Colors */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700">
                  <span className="flex gap-0.5">
                    <span className="w-1.5 h-3 bg-emerald-600 rounded-sm"></span>
                    <span className="w-1.5 h-3 bg-slate-100 border border-slate-300 rounded-sm"></span>
                    <span className="w-1.5 h-3 bg-sky-600 rounded-sm"></span>
                  </span>
                  <span>Republic of Sierra Leone</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsCredentialsOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold hover:bg-slate-200 transition shadow-xs"
                    title="View all test staff credentials"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                    <span>Credentials</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMobileScanner(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 transition shadow-sm"
                    title="Open bottle traceability camera"
                  >
                    <Camera className="w-3.5 h-3.5 text-sky-600" />
                    <span>Consumer Scan</span>
                  </button>
                </div>
              </div>

              {/* Title & Brand */}
              <div className="text-left mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[10px] font-extrabold text-indigo-700 mb-2.5">
                  🎓 Academic Dissertation Research Project by Umu Shaw &amp; Team
                </div>
                <div className="w-12 h-12 bg-gradient-to-tr from-sky-500 to-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-600/30 mb-2.5">
                  <Factory className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">BeverageTrack AI</h1>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Quality Assurance & Distribution Information System • Kissy Bottling Facility
                </p>
              </div>

              {/* Login Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 mb-4">
                <button
                  type="button"
                  onClick={() => setLoginTab('credentials')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    loginTab === 'credentials'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                  <span>Enter Credentials</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginTab('badge_scan')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    loginTab === 'badge_scan'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <ScanLine className="w-3.5 h-3.5 text-sky-600" />
                  <span>Scan Badge to Login</span>
                </button>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {loginError}
                </div>
              )}

              {/* MODE 1: Standard Editable Credentials with Quick Autofill */}
              {loginTab === 'credentials' && (
                <div>
                  {/* Quick Autofill Buttons for Testing */}
                  <div className="mb-3 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      1-Click Autofill Credentials:
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { label: '👑 Admin', email: 'admin@sierrasprings.sl' },
                        { label: '🔬 QC Lead', email: 'quality@sierrasprings.sl' },
                        { label: '🏭 Production', email: 'production@sierrasprings.sl' },
                        { label: '📦 Warehouse', email: 'warehouse@sierrasprings.sl' },
                        { label: '🚚 Fleet Driver', email: 'distribution@sierrasprings.sl' },
                        { label: '🌐 Super Admin', email: 'superadmin@beveragetrack.sl' },
                      ].map((item) => (
                        <button
                          key={item.email}
                          type="button"
                          onClick={() => {
                            setEmail(item.email);
                            setPassword('Password123!');
                          }}
                          className={`p-1.5 text-[11px] font-bold rounded-lg border text-left truncate transition ${
                            email === item.email
                              ? 'bg-sky-50 border-sky-300 text-sky-800 ring-1 ring-sky-300'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Credentials Form */}
                  <form onSubmit={handleLogin} className="space-y-3">
                    <div className="text-left">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Staff Work Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@sierrasprings.sl"
                          className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-semibold"
                          required
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700">Security Password</label>
                        <span className="text-[10px] text-sky-700 font-bold">Dissertation Password: UmuShawTeam2026! (or Password123!)</span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full text-xs pl-9 pr-10 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-mono font-bold"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-sky-600/30 transition flex items-center justify-center gap-2 mt-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Authenticate & Enter System</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* MODE 2: Scan Badge / QR Code Login */}
              {loginTab === 'badge_scan' && (
                <div className="space-y-3 text-left">
                  {/* Badge Scanner Viewfinder */}
                  <div className="relative bg-slate-950 rounded-2xl p-4 text-center overflow-hidden aspect-[16/9] flex flex-col items-center justify-center border border-slate-800">
                    <div className="relative w-28 h-28 border-2 border-dashed border-sky-400/80 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(2,132,199,0.3)]">
                      <QrCode className="w-12 h-12 text-sky-400 animate-pulse" />
                      <div className="absolute inset-x-0 h-0.5 bg-sky-400 shadow-[0_0_10px_#38bdf8] animate-bounce"></div>
                    </div>

                    <p className="text-[11px] font-mono font-bold text-sky-300 mt-2">
                      {scannedBadgeStaff ? `Authenticating: ${scannedBadgeStaff}` : 'HOLD STAFF BADGE UP TO SCANNER'}
                    </p>
                  </div>

                  {/* 1-Click Tap to Scan Staff Badge */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Tap Any Staff ID Card to Scan & Login:
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { name: 'Umu Shaw & Team', role: 'Company Administrator / Dissertation Lead', email: 'admin@sierrasprings.sl', badge: 'STAFF-ADMIN-001' },
                        { name: 'Fatmata Bangura', role: 'Quality Control Officer', email: 'quality@sierrasprings.sl', badge: 'STAFF-QC-002' },
                        { name: 'Ibrahim Kamara', role: 'Production Manager', email: 'production@sierrasprings.sl', badge: 'STAFF-PROD-003' },
                        { name: 'Mohamed Turay', role: 'Warehouse Manager', email: 'warehouse@sierrasprings.sl', badge: 'STAFF-WH-004' },
                        { name: 'Alhaji Conteh', role: 'Fleet Distribution Officer', email: 'distribution@sierrasprings.sl', badge: 'STAFF-DIST-005' },
                      ].map((staff) => (
                        <button
                          key={staff.email}
                          type="button"
                          onClick={() => {
                            setScannedBadgeStaff(staff.name);
                            setTimeout(() => {
                              handleQuickLogin(staff.email);
                            }, 300);
                          }}
                          className="w-full p-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-left transition flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                              {staff.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 group-hover:text-sky-700 leading-tight">
                                {staff.name}
                              </p>
                              <p className="text-[10px] text-slate-500">{staff.role}</p>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] font-bold text-sky-600 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                            {staff.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Note */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>SLSB Certified System</span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Kissy Facility Active
              </span>
            </div>
          </div>

          {/* Right Column: AI Bottle Inspection Computer Vision Illustration */}
          <div className="lg:col-span-7 flex">
            <BottleAIScanIllustration />
          </div>

        </div>

        {/* Credentials Directory Modal on Login */}
        <CredentialsDirectoryModal
          isOpen={isCredentialsOpen}
          onClose={() => setIsCredentialsOpen(false)}
          onSelectUser={(email) => handleQuickLogin(email)}
        />
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
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProcessSteps={() => setIsProcessStepsOpen(true)}
        onOpenScanner={() => setShowUniversalScanner(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentUser={currentUser}
          onRoleSwitch={handleRoleSwitch}
          onLogout={handleLogout}
          activeTab={activeTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCredentials={() => setIsCredentialsOpen(true)}
          onOpenProcessSteps={() => setIsProcessStepsOpen(true)}
          onOpenScanner={() => setShowUniversalScanner(true)}
          kpis={overview?.kpis}
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

          {activeTab === 'water' && (
            <WaterIntakeView
              waterLots={waterLots}
              productionLines={lines}
              onCreateWaterLot={handleCreateWaterLot}
              onSendToProduction={handleSendWaterToProduction}
              onNavigateToProduction={() => setActiveTab('production')}
            />
          )}

          {activeTab === 'production' && (
            <ProductionView
              batches={batches}
              products={products}
              lines={lines}
              waterLots={waterLots}
              onCreateBatch={handleCreateBatch}
              onSelectBatchForTracking={handleSelectBatchForTracking}
              onOpenQR={handleOpenQR}
              onOpenScanner={() => setShowUniversalScanner(true)}
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

          {activeTab === 'admin' && (
            <AdminConsoleView
              currentUser={currentUser}
              batches={batches}
              onAbortBatch={handleAbortBatch}
              onReleaseBatch={handleReleaseBatch}
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

      {/* User Profile & Password Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Staff Login Credentials Directory Modal */}
      <CredentialsDirectoryModal
        isOpen={isCredentialsOpen}
        onClose={() => setIsCredentialsOpen(false)}
        onSelectUser={(email) => handleQuickLogin(email)}
      />

      {/* Factory Process Steps (1-8) Lifecycle Modal */}
      <ProcessStepsModal
        isOpen={isProcessStepsOpen}
        onClose={() => setIsProcessStepsOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Universal Mobile Camera QR Scanner Online Modal */}
      {showUniversalScanner && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative max-w-xl w-full my-auto">
            <MobileQRScanner
              onClose={() => setShowUniversalScanner(false)}
              onAdminLogin={() => {
                setShowUniversalScanner(false);
                handleQuickLogin('admin@sierrasprings.sl');
              }}
              onStaffLogin={(email) => {
                setShowUniversalScanner(false);
                handleQuickLogin(email);
              }}
            />
          </div>
        </div>
      )}

      {/* AI Voice Command Overlay HUD (Voice Controlled Navigation & Logout) */}
      <AIVoiceCommander
        onNavigate={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
        onOpenScanner={() => setShowUniversalScanner(true)}
        activeTab={activeTab}
      />
    </div>
  );
};
