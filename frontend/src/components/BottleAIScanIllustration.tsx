import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  ShieldCheck,
  Cpu,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Zap
} from 'lucide-react';

export const BottleAIScanIllustration: React.FC = () => {
  const [laserPos, setLaserPos] = useState(25);
  const [direction, setDirection] = useState<'down' | 'up'>('down');
  const [activeTelemetry, setActiveTelemetry] = useState(0);

  // Animated laser scan sweep
  useEffect(() => {
    const interval = setInterval(() => {
      setLaserPos((prev) => {
        if (prev >= 80) {
          setDirection('up');
          return 79;
        }
        if (prev <= 20) {
          setDirection('down');
          return 21;
        }
        return direction === 'down' ? prev + 1.2 : prev - 1.2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [direction]);

  // Rotate telemetry highlight
  useEffect(() => {
    const telemInterval = setInterval(() => {
      setActiveTelemetry((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(telemInterval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[520px] bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 rounded-3xl overflow-hidden border border-sky-900/50 flex flex-col justify-between p-6 sm:p-8 shadow-2xl">
      {/* Background Tech Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0284c7 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Banner & Header Tags */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold backdrop-blur-md">
          <Cpu className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>AI Computer Vision Optical Sorter • Kissy Facility</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Online: 12,000 bph</span>
        </div>
      </div>

      {/* Central Visual: Animated Bottle + AI Bounding Box + Laser Beam */}
      <div className="relative z-10 my-4 flex items-center justify-center">
        <div className="relative w-72 h-80 flex items-center justify-center">
          
          {/* Circular Holographic Radar Glow */}
          <div className="absolute inset-0 rounded-full bg-sky-500/5 blur-3xl animate-pulse"></div>

          {/* SVG Illustrated Beverage Bottle with AI Inspection Overlays */}
          <svg
            viewBox="0 0 240 320"
            className="w-56 h-72 drop-shadow-[0_15px_30px_rgba(2,132,199,0.35)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Defs: Gradients & Glows */}
            <defs>
              <linearGradient id="bottleGlass" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="35%" stopColor="#e0f2fe" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#0284c7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.6" />
              </linearGradient>

              <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>

              <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Conveyor Track at Base */}
            <rect x="20" y="295" width="200" height="12" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <line x1="40" y1="301" x2="60" y2="301" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="100" y1="301" x2="140" y2="301" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="180" y1="301" x2="200" y2="301" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" />

            {/* Bottle Silhouette Body */}
            {/* Cap */}
            <rect x="104" y="24" width="32" height="20" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <line x1="104" y1="31" x2="136" y2="31" stroke="#7dd3fc" strokeWidth="1.5" />
            <line x1="104" y1="37" x2="136" y2="37" stroke="#7dd3fc" strokeWidth="1.5" />

            {/* Neck Ring */}
            <rect x="100" y="44" width="40" height="6" rx="2" fill="#0369a1" />

            {/* Bottle Neck */}
            <path
              d="M106 50 L106 82 C106 102 76 124 76 148 L76 278 C76 288 84 294 96 294 L144 294 C156 294 164 288 164 278 L164 148 C164 124 134 102 134 82 L134 50 Z"
              fill="url(#bottleGlass)"
              stroke="#7dd3fc"
              strokeWidth="2.5"
            />

            {/* Pure Beverage Liquid (Filled to 500ml calibration level) */}
            <path
              d="M78 120 C78 120 100 116 120 116 C140 116 162 120 162 120 L162 276 C162 284 154 290 144 290 L96 290 C86 290 78 284 78 276 Z"
              fill="url(#liquidGrad)"
            />

            {/* Liquid Meniscus & Wave Highlight */}
            <ellipse cx="120" cy="119" rx="42" ry="5" fill="#38bdf8" fillOpacity="0.6" />

            {/* Bottle Label Area */}
            <rect x="79" y="160" width="82" height="74" rx="4" fill="#ffffff" fillOpacity="0.9" stroke="#0284c7" strokeWidth="1.5" />
            <text x="120" y="180" textAnchor="middle" fill="#0284c7" fontSize="9" fontWeight="900" fontFamily="sans-serif">
              SIERRA SPRINGS
            </text>
            <text x="120" y="193" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="700" fontFamily="sans-serif">
              PURE WATER • 500ml
            </text>
            {/* Small Barcode on Label */}
            <g transform="translate(94, 202)">
              <rect x="0" y="0" width="2" height="14" fill="#0f172a" />
              <rect x="4" y="0" width="1.5" height="14" fill="#0f172a" />
              <rect x="8" y="0" width="3" height="14" fill="#0f172a" />
              <rect x="13" y="0" width="1" height="14" fill="#0f172a" />
              <rect x="16" y="0" width="2.5" height="14" fill="#0f172a" />
              <rect x="21" y="0" width="1.5" height="14" fill="#0f172a" />
              <rect x="25" y="0" width="3" height="14" fill="#0f172a" />
              <rect x="30" y="0" width="2" height="14" fill="#0f172a" />
              <rect x="34" y="0" width="4" height="14" fill="#0f172a" />
              <rect x="42" y="0" width="2" height="14" fill="#0f172a" />
              <rect x="46" y="0" width="3" height="14" fill="#0f172a" />
              <text x="25" y="21" textAnchor="middle" fill="#0f172a" fontSize="5" fontFamily="monospace">BTL-2026-001</text>
            </g>

            {/* Glass Highlights */}
            <path d="M84 140 L84 270" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.6" />
            <path d="M156 140 L156 270" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />

            {/* AI Computer Vision Bounding Box */}
            <rect
              x="62"
              y="18"
              width="116"
              height="282"
              rx="6"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.85"
            />
            {/* Corner Bracket Reticles */}
            {/* Top-Left */}
            <path d="M58 28 L58 14 L72 14" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Top-Right */}
            <path d="M168 14 L182 14 L182 28" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Bottom-Left */}
            <path d="M58 290 L58 304 L72 304" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Bottom-Right */}
            <path d="M168 304 L182 304 L182 290" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Horizontal Laser Sweep Line */}
            <g filter="url(#laserGlow)">
              <line
                x1="40"
                y1={`${laserPos}%`}
                x2="200"
                y2={`${laserPos}%`}
                stroke="url(#laserGrad)"
                strokeWidth="3.5"
              />
              <circle cx="120" cy={`${laserPos}%`} r="3" fill="#ffffff" />
            </g>

            {/* Inspection Targets / AI Hotspots */}
            {/* 1. Cap Torque Target */}
            <circle cx="120" cy="34" r="5" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="120" cy="34" r="1.5" fill="#ffffff" />

            {/* 2. Liquid Fill Level Target */}
            <circle cx="120" cy="119" r="5" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="120" cy="119" r="1.5" fill="#ffffff" />

            {/* 3. Label OCR Verification Target */}
            <circle cx="120" cy="190" r="5" fill="#6366f1" fillOpacity="0.3" stroke="#6366f1" strokeWidth="1.5" />
            <circle cx="120" cy="190" r="1.5" fill="#ffffff" />
          </svg>

          {/* Floating AI Diagnostic Chips Around Bottle */}
          {/* Top Right: Hermetic Seal */}
          <div className={`absolute -right-6 top-8 transition-all duration-300 transform ${activeTelemetry === 0 ? 'scale-105 ring-2 ring-sky-400' : 'opacity-85'} bg-slate-900/90 border border-sky-500/40 rounded-xl p-2.5 backdrop-blur-md shadow-xl text-left max-w-[140px]`}>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-sky-400 uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Cap Hermeticity</span>
            </div>
            <p className="text-xs font-mono font-extrabold text-white mt-0.5">18.2 in-lb</p>
            <p className="text-[9px] text-emerald-400 font-semibold">Torque Spec: OK</p>
          </div>

          {/* Left Middle: Volumetric Sensor */}
          <div className={`absolute -left-6 top-28 transition-all duration-300 transform ${activeTelemetry === 1 ? 'scale-105 ring-2 ring-emerald-400' : 'opacity-85'} bg-slate-900/90 border border-emerald-500/40 rounded-xl p-2.5 backdrop-blur-md shadow-xl text-left max-w-[140px]`}>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Volumetric Fill</span>
            </div>
            <p className="text-xs font-mono font-extrabold text-white mt-0.5">500.4 ml</p>
            <p className="text-[9px] text-emerald-400 font-semibold">Variance: +0.08%</p>
          </div>

          {/* Right Bottom: pH Sensor */}
          <div className={`absolute -right-6 bottom-16 transition-all duration-300 transform ${activeTelemetry === 2 ? 'scale-105 ring-2 ring-indigo-400' : 'opacity-85'} bg-slate-900/90 border border-indigo-500/40 rounded-xl p-2.5 backdrop-blur-md shadow-xl text-left max-w-[140px]`}>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-400 uppercase tracking-wider">
              <Zap className="w-3 h-3 text-indigo-400" />
              <span>pH Equilibrium</span>
            </div>
            <p className="text-xs font-mono font-extrabold text-white mt-0.5">7.02 pH</p>
            <p className="text-[9px] text-indigo-300 font-semibold">SLSB Benchmark</p>
          </div>

          {/* Left Bottom: Anomaly Model Score */}
          <div className={`absolute -left-6 bottom-6 transition-all duration-300 transform ${activeTelemetry === 3 ? 'scale-105 ring-2 ring-amber-400' : 'opacity-85'} bg-slate-900/90 border border-sky-500/40 rounded-xl p-2.5 backdrop-blur-md shadow-xl text-left max-w-[140px]`}>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-sky-400 uppercase tracking-wider">
              <BrainCircuit className="w-3 h-3 text-sky-400" />
              <span>Isolation Forest</span>
            </div>
            <p className="text-xs font-mono font-extrabold text-emerald-400 mt-0.5">Score: 0.05</p>
            <p className="text-[9px] text-slate-400 font-semibold">Zero Anomaly Risk</p>
          </div>
        </div>
      </div>

      {/* Bottom Live Metrics Bar */}
      <div className="relative z-10 grid grid-cols-3 gap-2 pt-4 border-t border-sky-900/40 text-left">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-sky-900/60">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Freetown Line</p>
          <p className="text-xs font-black text-white mt-0.5 truncate">Line 1 High-Speed</p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-sky-900/60">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">QC Accuracy</p>
          <p className="text-xs font-black text-emerald-400 mt-0.5">99.4% Verified</p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-sky-900/60">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Certification</p>
          <p className="text-xs font-black text-sky-400 mt-0.5">SLSB Standard</p>
        </div>
      </div>
    </div>
  );
};
