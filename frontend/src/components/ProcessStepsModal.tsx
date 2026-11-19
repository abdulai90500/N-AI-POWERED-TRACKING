import React, { useState } from 'react';
import {
  X,
  Factory,
  Droplet,
  Flame,
  Gauge,
  BrainCircuit,
  QrCode,
  Boxes,
  Truck,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Play
} from 'lucide-react';

interface ProcessStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const ProcessStepsModal: React.FC<ProcessStepsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [selectedStep, setSelectedStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: "Raw Water Treatment & Reverse Osmosis",
      subtitle: "WHERE THE PROCESS STARTS: Kissy Plant Intake",
      krioSummary: "We di wata de komot: Raw spring wata filtration en Reverse Osmosis purification na Kissy intake.",
      icon: Droplet,
      color: "from-blue-600 to-cyan-500",
      tag: "Intake & Purification",
      location: "Kissy Facility Borehole & RO Manifold",
      officer: "Water Treatment Technicians",
      targetTab: "water",
      keyMetrics: [
        { label: "Filtration Stages", value: "4-Stage Quartz + GAC + RO" },
        { label: "Baseline pH", value: "6.95 - 7.15 pH" },
        { label: "Sterilization", value: "UV + Micron Polishing" },
        { label: "SLSB Standard", value: "SLSB-CS-022 Water Spec" }
      ],
      description: "Every bottle begins at the source: raw spring water extracted from deep boreholes in Kissy. Water passes through quartz sand media filters, granular activated carbon (GAC) beds for organic adsorption, 5-micron pre-filters, and dual-pass Reverse Osmosis (RO) membranes to strip dissolved heavy metals. Finished purified water is sanitized with inline ultraviolet (UV) germicidal lamps before entering stainless-steel storage silos."
    },
    {
      step: 2,
      title: "PET Preform Conditioning & Blow Molding",
      subtitle: "Line 1 & Line 2 High-Speed Bottle Shaping",
      krioSummary: "Wi de blow di plastic preform dem inside high-heat infrared oven tey e form 500ml bottle.",
      icon: Flame,
      color: "from-amber-500 to-orange-600",
      tag: "Preform Blowing",
      location: "Line 1 High-Speed Carousel",
      officer: "Production Manager (Ibrahim Kamara)",
      targetTab: "production",
      keyMetrics: [
        { label: "Oven Temperature", value: "115°C - 128°C Radiant" },
        { label: "Blowing Pressure", value: "35 Bar Compressed Air" },
        { label: "Output Speed", value: "8,500 Bottles / Hour" },
        { label: "Defect Rejection", value: "Automated Pre-Optical" }
      ],
      description: "Virgin polyethylene terephthalate (PET) preforms are loaded into high-speed rotary hoppers, conditioned through multi-zone infrared radiant heating ovens, and transferred into aluminum bottle molds. High-pressure filtered dry air (35 bar) expands the softened preform into a clear, rigid 500ml or 330ml bottle. Optical sensors immediately reject any preforms with neck deformations."
    },
    {
      step: 3,
      title: "Isobaric Sterile Bottling & Torque Capping",
      subtitle: "High-Precision Volumetric Filling Carousel",
      krioSummary: "Wi de fill exact 500ml wata inside di bottle, en di machine tight di crown cap with 1.8 Nm torque.",
      icon: Gauge,
      color: "from-sky-600 to-indigo-600",
      tag: "Filling & Capping",
      location: "Sanitary Monoblock Filling Enclosure",
      officer: "Line Operators & Automated PLC",
      targetTab: "production",
      keyMetrics: [
        { label: "Target Fill Volume", value: "500.0 ml (±5.0ml Spec)" },
        { label: "Crown Seal Torque", value: "1.8 Nm (21.5 in-lb)" },
        { label: "Sanitary Zone", value: "HEPA Positive Air Pressure" },
        { label: "Capping Chuck", value: "Magnetic Hysteresis Head" }
      ],
      description: "Rinsed sterile bottles enter the counter-pressure filling carousel. Magnetic flowmeters dispense exactly 500ml of treated beverage under positive-pressure HEPA filtration. Immediately upon discharge, a rotary capper applies tamper-evident screw caps with precisely calibrated torque (1.8 Nm / 21.5 in-lb) to guarantee a hermetic seal that prevents micro-leaks or bacterial ingress."
    },
    {
      step: 4,
      title: "AI Computer Vision & Real-Time Sensor QC",
      subtitle: "Isolation Forest Anomaly & Failure Detection",
      krioSummary: "Di AI Computer Vision en Fatmata Bangura de check pH, volume, en cap hermeticity in 5ms.",
      icon: BrainCircuit,
      color: "from-purple-600 to-pink-600",
      tag: "AI Inspection & Lab",
      location: "Automated Vision Station & Lab",
      officer: "QC Lead (Fatmata Bangura) & AI Copilot",
      targetTab: "ai",
      keyMetrics: [
        { label: "Inference Latency", value: "< 5ms Real-Time" },
        { label: "Anomaly Detection", value: "Isolation Forest v2.1" },
        { label: "Failure Prediction", value: "Random Forest Supervised" },
        { label: "False Alarm Rate", value: "3.2% Low Stoppage" }
      ],
      description: "As bottles exit the capper, dual industrial vision cameras inspect fill level height, cap alignment, and tamper ring integrity. Inline probes simultaneously transmit pH, dissolved solids, and filling temperatures to the BeverageTrack AI Engine. Machine learning algorithms compare multivariate sensor metrics against historical baselines; any batch exhibiting chemical drift (such as CIP caustic rinse leak) is flagged for quarantine."
    },
    {
      step: 5,
      title: "Cryptographic QR Code & Batch Passport",
      subtitle: "SLSB National Compliance Serialization",
      krioSummary: "Di laser de print unique cryptographic QR code passport pan each bottle for SLSB authentication.",
      icon: QrCode,
      color: "from-emerald-600 to-teal-600",
      tag: "Traceability Serialization",
      location: "Domino Laser Marking Terminal",
      officer: "Traceability Information Engine",
      targetTab: "tracking",
      keyMetrics: [
        { label: "Security Hash", value: "SHA-256 SLSB Token" },
        { label: "Batch ID Scheme", value: "BTL-YYYY-XXX Serialization" },
        { label: "Verification Link", value: "n-ai-powered-tracking.vercel.app" },
        { label: "Anti-Counterfeit", value: "SLSB National Registry Verified" }
      ],
      description: "Once approved by QC, the system generates an immutable cryptographic batch passport. High-speed industrial laser markers print a high-resolution QR code onto the bottle shoulder along with batch identifier (e.g., BTL-2026-001), exact bottling date, expiration, and factory line ID. The QR links directly to national compliance records without exposing sensitive internal margins."
    },
    {
      step: 6,
      title: "Case Packaging & Warehouse Depot Intake",
      subtitle: "Palletizing & Automated Inventory Allocation",
      krioSummary: "Mohamed Turay de pack di bottle dem 18 per carton, en store dem inside Kissy or Lumley depot.",
      icon: Boxes,
      color: "from-blue-600 to-indigo-700",
      tag: "Warehouse Intake",
      location: "Kissy Central Depot & Lumley Hub",
      officer: "Warehouse Manager (Mohamed Turay)",
      targetTab: "inventory",
      keyMetrics: [
        { label: "Case Configuration", value: "18 or 24 Bottles / Carton" },
        { label: "Central Capacity", value: "250,000 Bottle Capacity" },
        { label: "FIFO Control", value: "First-In First-Out Rotation" },
        { label: "Storage Temp", value: "Ambient 23°C Controlled" }
      ],
      description: "Bottles pass through shrink-wrapping case packers (18 or 24 bottles per case). Palletizers stack cases onto wooden pallets, wrapping them in moisture-resistant film. Warehouse operators scan master pallet barcodes into BeverageTrack AI, instantly crediting Kissy Central Warehouse or Lumley Depot with verified, saleable inventory ready for wholesale booking."
    },
    {
      step: 7,
      title: "Wholesale Fulfillment & Fleet Logistics",
      subtitle: "GPS Dispatch Across Freetown & Provinces",
      krioSummary: "Alhaji Conteh de dispatch di delivery truck dem go Kenema, Bo, en Freetown supermarket dem.",
      icon: Truck,
      color: "from-amber-600 to-yellow-600",
      tag: "Fleet Distribution",
      location: "Loading Bay & Fleet Logistics Routes",
      officer: "Distribution Officer (Alhaji Conteh)",
      targetTab: "distribution",
      keyMetrics: [
        { label: "Active Fleet", value: "Mercedes Benz & Isuzu Trucks" },
        { label: "Provincial Routes", value: "Freetown, Bo, Kenema, Makeni" },
        { label: "Delivery Tracking", value: "Waybill & Digital Signoff" },
        { label: "Dispatch Velocity", value: "Same-Day Order Delivery" }
      ],
      description: "Commercial sales orders generate digital dispatch waybills. Warehouse staff pick and load pallets onto distribution trucks assigned to urban Freetown routes (Lumley, Wilberforce, East End, Waterloo) and provincial highways to Bo and Kenema. Delivery officers record electronic proof-of-delivery (e-POD) when retail stores receive and inspect cartons."
    },
    {
      step: 8,
      title: "Retail & Consumer Smartphone Verification",
      subtitle: "THE FINAL DESTINATION: Authentic Salone Water",
      krioSummary: "Anybody wey buy bottle fit point e phone camera for scan di QR code en check if na pure wata.",
      icon: Smartphone,
      color: "from-emerald-500 to-green-600",
      tag: "Consumer Verification",
      location: "Retail Shelves & Supermarkets",
      officer: "Everyday Consumers & SLSB Inspectors",
      targetTab: "public-track",
      keyMetrics: [
        { label: "App Download Required", value: "Zero (Native Camera Scan)" },
        { label: "SLSB Seal", value: "Official Standards Verification" },
        { label: "Lab Data Visible", value: "pH, Volume, Expiry, Factory" },
        { label: "Recall Protection", value: "Instant Quarantine Warnings" }
      ],
      description: "At corner shops, supermarkets, or street kiosks, consumers and food safety inspectors simply point their smartphone camera at the bottle's QR code. The mobile verification portal immediately confirms product authenticity, SLSB certification badge, laboratory pH test results, and facility origin — empowering every Sierra Leonean to avoid counterfeit water."
    }
  ];

  const current = steps.find(s => s.step === selectedStep) || steps[0];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-inner">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">Factory Process Flow & Tracking Steps</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Step 1 to Step 8
                </span>
              </div>
              <p className="text-xs text-sky-300">Complete journey from Kissy water intake to consumer smartphone scan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8-Step Progress Bar Navigator */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 overflow-x-auto flex-shrink-0">
          <div className="flex items-center min-w-max gap-2 px-2">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isSelected = s.step === selectedStep;
              return (
                <React.Fragment key={s.step}>
                  <button
                    onClick={() => setSelectedStep(s.step)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-2 ring-sky-400/30'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                      isSelected ? 'bg-white text-sky-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {s.step}
                    </span>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[110px]">{s.tag}</span>
                  </button>

                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Step Detail Canvas */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Step Hero Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950 text-white shadow-lg border border-sky-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-inner flex-shrink-0">
                <StepIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/30 text-sky-200 border border-sky-400/30">
                    Step {current.step} of 8
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {current.location}
                  </span>
                </div>
                <h2 className="text-xl font-black mt-1 tracking-tight">{current.title}</h2>
                <p className="text-xs text-sky-300 mt-0.5 font-medium">{current.subtitle}</p>
              </div>
            </div>

            {onNavigateTab && (
              <button
                onClick={() => {
                  onNavigateTab(current.targetTab);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs transition flex items-center gap-1.5 shadow flex-shrink-0"
              >
                <span>Open {current.targetTab.toUpperCase()} Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sierra Leone Krio Audio & Text Explainer Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
              🇸🇱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  Salone Krio Step Explanation:
                </h4>
                <span className="text-[9px] font-bold px-2 py-0.2 rounded bg-emerald-200/80 text-emerald-900">
                  Sierra Leone Local Dialect
                </span>
              </div>
              <p className="text-xs text-emerald-900 mt-1 leading-relaxed font-semibold">
                "{current.krioSummary}"
              </p>
            </div>
          </div>

          {/* Description Prose */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
              Technical & Operational Description:
            </h4>
            <p>{current.description}</p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-medium text-slate-500">
              <span className="font-bold text-slate-700">Accountable Officer:</span>
              <span>{current.officer}</span>
            </div>
          </div>

          {/* 4 Metric Telemetry Tiles */}
          <div>
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-2.5">
              Quality Assurance Benchmarks & Machine Parameters:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {current.keyMetrics.map((m, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{m.label}</p>
                  <p className="text-xs font-black text-slate-900 mt-1">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSelectedStep(Math.max(1, selectedStep - 1))}
            disabled={selectedStep === 1}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition disabled:opacity-40"
          >
            ← Previous Step
          </button>

          <span className="text-xs font-bold text-slate-500">
            Step {selectedStep} of {steps.length}
          </span>

          <button
            onClick={() => setSelectedStep(Math.min(steps.length, selectedStep + 1))}
            disabled={selectedStep === steps.length}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition disabled:opacity-40"
          >
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
};
