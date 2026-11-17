import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Zap,
  Building,
  Calendar,
  Layers,
  Thermometer,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';

interface MobileQRScannerProps {
  onClose: () => void;
  onAdminLogin: () => void;
  onStaffLogin?: (email: string) => void;
}

export const MobileQRScanner: React.FC<MobileQRScannerProps> = ({ onClose, onAdminLogin, onStaffLogin }) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<'bottle' | 'badge'>('bottle');
  const [authenticatingStaff, setAuthenticatingStaff] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<any | null>(null);
  const [loadingVerify, setLoadingVerify] = useState<boolean>(false);
  const [manualToken, setManualToken] = useState<string>('track_btl_2026_001_sierra_springs');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const staffBadges = [
    { name: 'Mariama Sesay', role: 'Company Administrator', email: 'admin@sierrasprings.sl', badge: 'STAFF-ADMIN-001' },
    { name: 'Fatmata Bangura', role: 'Quality Control Officer', email: 'quality@sierrasprings.sl', badge: 'STAFF-QC-002' },
    { name: 'Ibrahim Kamara', role: 'Production Manager', email: 'production@sierrasprings.sl', badge: 'STAFF-PROD-003' },
    { name: 'Mohamed Turay', role: 'Warehouse Manager', email: 'warehouse@sierrasprings.sl', badge: 'STAFF-WH-004' },
    { name: 'Alhaji Conteh', role: 'Fleet Distribution Officer', email: 'distribution@sierrasprings.sl', badge: 'STAFF-DIST-005' },
  ];

  // Quick preset tokens for testing
  const sampleTokens = [
    {
      token: 'track_btl_2026_001_sierra_springs',
      label: 'BTL-2026-001 (Sierra Pure Water - Passed)',
      status: 'approved',
      risk: 'low'
    },
    {
      token: 'track_btl_2026_002_lion_malt',
      label: 'BTL-2026-002 (Lion Ginger Malt - Passed)',
      status: 'approved',
      risk: 'low'
    },
    {
      token: 'track_btl_2026_003_salone_cola',
      label: 'BTL-2026-003 (Salone Cola - Quarantined)',
      status: 'quarantined',
      risk: 'high'
    }
  ];

  // Camera initialization
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } else {
        setCameraError('Camera access not supported on this device/browser context.');
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError('Camera unavailable or permission denied. Use sample token selector below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    // Attempt camera startup if available
    startCamera();
    // Default fetch for initial token
    handleVerifyToken('track_btl_2026_001_sierra_springs');

    return () => {
      stopCamera();
    };
  }, []);

  const handleVerifyToken = async (tok: string) => {
    if (!tok) return;
    setLoadingVerify(true);
    setManualToken(tok);
    try {
      const res = await api.getPublicTracking(tok);
      // Enrich with specific batch details for demo
      if (tok.includes('003')) {
        setScannedResult({
          ...res,
          batch_number: 'BTL-2026-003',
          product_name: 'Salone Cola 500ml',
          quality_status: 'QUARANTINED - QC Hold',
          authenticity_verified: true,
          verification_message: 'Genuine Sierra Leone Manufactured Beverage - Under Quality Review Hold.',
          is_anomaly: true,
          ai_risk: 'HIGH',
          anomaly_score: 0.88,
          ph_recorded: 8.42,
          filling_volume: 491.5
        });
      } else if (tok.includes('002')) {
        setScannedResult({
          ...res,
          batch_number: 'BTL-2026-002',
          product_name: 'Lion Ginger Malt 330ml',
          quality_status: 'SLSB Certified - Passed',
          authenticity_verified: true,
          verification_message: 'Certified Authentic Sierra Leone Beverage. Safe for Consumption.',
          is_anomaly: false,
          ai_risk: 'LOW',
          anomaly_score: 0.08,
          ph_recorded: 4.18,
          filling_volume: 331.0
        });
      } else {
        setScannedResult({
          ...res,
          batch_number: 'BTL-2026-001',
          product_name: 'Sierra Pure Water 500ml',
          quality_status: 'SLSB Certified - Passed',
          authenticity_verified: true,
          verification_message: 'Certified Authentic Sierra Leone Beverage. Safe for Consumption.',
          is_anomaly: false,
          ai_risk: 'LOW',
          anomaly_score: 0.05,
          ph_recorded: 6.95,
          filling_volume: 502.4
        });
      }
    } catch (err: any) {
      console.error('Scan verification error:', err);
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-2">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            title="Back to login"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-sky-400" />
              Mobile Bottle Scanner
            </h2>
            <p className="text-[11px] text-sky-300">
              SLSB National Food Safety Verification Portal • Sierra Leone
            </p>
          </div>
        </div>

        <button
          onClick={() => setScanMode(scanMode === 'badge' ? 'bottle' : 'badge')}
          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center gap-1 transition shadow"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>{scanMode === 'badge' ? 'Scan Bottle' : 'Scan Staff Badge'}</span>
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="bg-slate-900 px-5 pb-3 pt-0 flex gap-2">
        <button
          onClick={() => setScanMode('bottle')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            scanMode === 'bottle'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Verify Bottle SLSB</span>
        </button>
        <button
          onClick={() => setScanMode('badge')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            scanMode === 'badge'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Scan Staff Badge to Login</span>
        </button>
      </div>

      {/* Camera Viewfinder Area */}
      <div className="relative bg-slate-950 aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-6 text-slate-400 max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-sky-950/80 border border-sky-500/30 flex items-center justify-center mx-auto mb-3 text-sky-400">
              <QrCode className="w-8 h-8 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-slate-200">Camera Scanner Emulation Ready</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Point your smartphone camera at any bottle QR code, or tap a sample test token below.
            </p>
          </div>
        )}

        {/* Viewfinder Reticle Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
          <div className="relative w-56 h-56 border-2 border-sky-400/70 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(2,132,199,0.4)]">
            {/* Animated Laser Scanning Line */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-bounce shadow-[0_0_15px_#38bdf8]"></div>
            
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-sky-400 rounded-tl"></div>
            <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-sky-400 rounded-tr"></div>
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-sky-400 rounded-bl"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-sky-400 rounded-br"></div>

            <div className="absolute bottom-2 inset-x-0 text-center">
              <span className="text-[10px] font-mono text-sky-300 font-bold bg-slate-950/70 px-2 py-0.5 rounded">
                {scanMode === 'badge' ? 'ALIGN STAFF ID / BARCODE IN FRAME' : 'ALIGN QR CODE IN FRAME'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Camera Status Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            AI Optical Reader Active
          </span>
        </div>
      </div>

      {scanMode === 'badge' ? (
        /* Badge Scan Mode: Tap or Scan to Login */
        <div className="p-5 bg-slate-50 flex-1 overflow-y-auto">
          <div className="mb-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              {authenticatingStaff ? (
                <span className="text-sky-600 flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Authenticating {authenticatingStaff}...
                </span>
              ) : (
                'Tap Staff ID Badge to Scan & Enter Console:'
              )}
            </p>
          </div>
          <div className="space-y-2">
            {staffBadges.map((staff) => (
              <button
                key={staff.email}
                type="button"
                onClick={() => {
                  setAuthenticatingStaff(staff.name);
                  setTimeout(() => {
                    if (onStaffLogin) {
                      onStaffLogin(staff.email);
                    } else {
                      onAdminLogin();
                    }
                  }, 350);
                }}
                className="w-full p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-left transition flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
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
      ) : (
        /* Bottle Verification Mode */
        <>
          {/* Preset Token Selector for Fast Mobile/Desktop Testing */}
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Test Bottle Scans (Tap to Simulate Live Scan):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {sampleTokens.map((t) => (
                <button
                  key={t.token}
                  onClick={() => handleVerifyToken(t.token)}
                  className={`p-2 rounded-xl text-left border text-xs transition ${
                    manualToken === t.token
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-extrabold text-[11px] truncate">
                      {t.token.includes('001') ? 'Pure Water' : t.token.includes('002') ? 'Ginger Malt' : 'Salone Cola'}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      t.risk === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {t.risk === 'high' ? 'Hold' : 'Safe'}
                    </span>
                  </div>
                  <p className={`text-[10px] font-mono truncate ${manualToken === t.token ? 'text-sky-100' : 'text-slate-400'}`}>
                    {t.token.split('_')[2]?.toUpperCase()}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Verification Result Dossier */}
          <div className="p-6 overflow-y-auto max-h-[380px] space-y-4">
            {loadingVerify ? (
              <div className="py-8 text-center text-xs font-bold text-slate-500 flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 text-sky-600 animate-spin" />
                <span>Cryptographic SLSB Verification in Progress...</span>
              </div>
            ) : scannedResult ? (
              <>
                {/* Status Ribbon */}
                <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  scannedResult.is_anomaly
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}>
                  {scannedResult.is_anomaly ? (
                    <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm">
                        {scannedResult.is_anomaly ? 'Quality Quarantine Alert' : 'SLSB Certified Product'}
                      </h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                        scannedResult.is_anomaly ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                      }`}>
                        {scannedResult.quality_status}
                      </span>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed opacity-90">
                      {scannedResult.verification_message}
                    </p>
                  </div>
                </div>

                {/* Core Verification Specs */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Product Name</span>
                    <span className="font-extrabold text-slate-900">{scannedResult.product_name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Batch Number</span>
                    <span className="font-mono font-extrabold text-sky-700">{scannedResult.batch_number}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Bottling Company</span>
                    <span className="font-bold text-slate-800">{scannedResult.manufacturer || 'Sierra Springs & Beverages Ltd'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Factory Facility</span>
                    <span className="font-bold text-slate-800">14 Kissy Industrial Estate, Freetown</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Production Date</span>
                    <span className="font-bold text-slate-800">{scannedResult.production_date || '2026-11-15'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Expiry Date</span>
                    <span className="font-bold text-slate-800">{scannedResult.expiry_date || '2027-11-15'}</span>
                  </div>
                </div>

                {/* AI Quality Telemetry Box */}
                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      AI Quality Engine Telemetry
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                      scannedResult.ai_risk === 'HIGH' ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
                    }`}>
                      Risk: {scannedResult.ai_risk || 'LOW'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-white p-2 rounded-xl border border-sky-100">
                      <p className="text-[10px] text-slate-400 font-medium">Laboratory pH</p>
                      <p className="text-sm font-black text-slate-900">{scannedResult.ph_recorded || 7.0} pH</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-sky-100">
                      <p className="text-[10px] text-slate-400 font-medium">Fill Volume</p>
                      <p className="text-sm font-black text-slate-900">{scannedResult.filling_volume || 500} ml</p>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </>
      )}

      {/* Footer Switcher */}
      <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>

        <button
          onClick={onAdminLogin}
          className="text-xs font-extrabold text-sky-700 hover:text-sky-900 flex items-center gap-1"
        >
          <span>Enter Factory Console</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
