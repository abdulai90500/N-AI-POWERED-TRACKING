import React from 'react';
import {
  Boxes,
  CheckCircle,
  AlertTriangle,
  Truck,
  TrendingUp,
  BrainCircuit,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';

interface DashboardViewProps {
  overview: any;
  trends: any[];
  onNavigate: (tab: string) => void;
  onSelectBatchForTracking: (batchId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  overview,
  trends,
  onNavigate,
  onSelectBatchForTracking
}) => {
  const kpis = overview?.kpis || {
    bottles_produced: 27000,
    quality_pass_rate: 96.8,
    available_stock: 13090,
    deliveries_recorded: 2,
    ai_anomalies_flagged: 1,
    active_in_transit: 1
  };

  const recentBatches = overview?.recent_batches || [];
  const notifications = overview?.notifications || [];
  const categoryData = overview?.category_breakdown || [];

  return (
    <div className="space-y-6">
      {/* AI Alert Banner if anomaly detected */}
      {kpis.ai_anomalies_flagged > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 border-l-4 border-rose-500 p-4 rounded-xl shadow-sm flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-lg flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-900 text-sm">AI Quality Anomaly Detected</span>
                <span className="bg-rose-200 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Action Required</span>
              </div>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                Batch <strong>BTL-2026-003 (Pure Water 500ml)</strong> triggered an anomaly alert: pH drifted to 8.42 (above 8.0 limit) with -1.7% underfill.
                The batch has been held for inspection before inventory release.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('ai')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1 flex-shrink-0"
          >
            Inspect AI Hub
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Produced */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-sky-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Bottles Produced</span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">
              {kpis.bottles_produced.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <span className="text-emerald-600 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +12.4%
              </span>
              from last week
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500"></div>
        </div>

        {/* Quality Pass Rate */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quality Pass Rate</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">
              {kpis.quality_pass_rate}%
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Sierra Leone Food & Drug Standards
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
        </div>

        {/* Available Stock */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Bottles</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">
              {kpis.available_stock.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Across Kissy & Lumley Warehouses
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500"></div>
        </div>

        {/* Deliveries */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Deliveries</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">
              {kpis.deliveries_recorded} <span className="text-sm font-normal text-slate-500">({kpis.active_in_transit} in transit)</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Freetown & Provincial Routes
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>
        </div>
      </div>

      {/* AI Factory Intelligence & Root-Cause Matrix */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-sky-900/50">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sky-900/60 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-inner">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">AI Predictive Quality Intelligence Engine</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                  Model v2.1.0 Online
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automated Isolation Forest anomaly detection & Random Forest failure prediction across Freetown bottling lines
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('ai')}
            className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open AI Intelligence Hub</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* 3 AI Diagnostics Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Diagnostic 1 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/40 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Active Anomaly Alert
              </span>
              <span className="text-[10px] font-mono bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded font-bold">
                Batch BTL-2026-003
              </span>
            </div>
            <p className="text-xs font-bold text-white leading-snug">
              Alkaline pH Drift (8.42 pH vs 3.10 target)
            </p>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              <strong>Root Cause:</strong> Line 1 CIP caustic rinse valve seal erosion allowing cleaning chemical ingress.
            </p>
            <div className="mt-3 pt-2 border-t border-rose-900/40 text-[10px] font-bold text-rose-300 flex justify-between">
              <span>Failure Probability: 93.4%</span>
              <span className="text-amber-300">Quarantine Active</span>
            </div>
          </div>

          {/* Diagnostic 2 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/30 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                Line 1 Volumetric Health
              </span>
              <span className="text-[10px] font-mono bg-sky-950/80 text-sky-300 px-2 py-0.5 rounded font-bold">
                500ml Bottling
              </span>
            </div>
            <p className="text-xs font-bold text-white leading-snug">
              Average Fill: 500.4ml (Variance +0.08%)
            </p>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              <strong>Prediction:</strong> Filling manifold pressure stable. Projected 7-day volumetric conformity at 99.4%.
            </p>
            <div className="mt-3 pt-2 border-t border-sky-900/40 text-[10px] font-bold text-emerald-400 flex justify-between">
              <span>Hermeticity: Nominal</span>
              <span>SLSB Compliant</span>
            </div>
          </div>

          {/* Diagnostic 3 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Line 2 Canning & Glass
              </span>
              <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded font-bold">
                Ginger Malt
              </span>
            </div>
            <p className="text-xs font-bold text-white leading-snug">
              Crown Seal Torque: 21.5 in-lb (Target 22.0)
            </p>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              <strong>Maintenance AI:</strong> Capper chuck calibration optimal. Next preventative inspection scheduled in 12 days.
            </p>
            <div className="mt-3 pt-2 border-t border-emerald-900/40 text-[10px] font-bold text-sky-300 flex justify-between">
              <span>Brix Sugar: 11.4 °Bx</span>
              <span className="text-emerald-400">Zero Defect Run</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Production Trends & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Production & Quality Trend Bar Visualization */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Weekly Production & Quality Trend</h2>
              <p className="text-xs text-slate-500">Daily bottling volume and quality release performance in Freetown</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-3 h-3 bg-sky-500 rounded-sm"></span> Volume Produced
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Pass Rate %
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {(trends.length > 0 ? trends : [
              { date: 'Mon 10 Nov', produced: 3800, rejected: 80, pass_rate: 97.9 },
              { date: 'Tue 11 Nov', produced: 4200, rejected: 60, pass_rate: 98.6 },
              { date: 'Wed 12 Nov', produced: 4000, rejected: 95, pass_rate: 97.6 },
              { date: 'Thu 13 Nov', produced: 4500, rejected: 70, pass_rate: 98.4 },
              { date: 'Fri 14 Nov', produced: 5200, rejected: 110, pass_rate: 97.9 },
              { date: 'Sat 15 Nov', produced: 3600, rejected: 45, pass_rate: 98.8 },
              { date: 'Sun 16 Nov', produced: 2800, rejected: 40, pass_rate: 98.5 },
            ]).map((t, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <span className="w-20 font-semibold text-slate-600 truncate">{t.date}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(100, (t.produced / 6000) * 100)}%` }}
                    className="bg-sky-500 h-full rounded-full transition-all duration-500"
                  ></div>
                </div>
                <span className="w-16 font-bold text-slate-800 text-right">{t.produced.toLocaleString()} btl</span>
                <span className="w-14 font-extrabold text-emerald-600 text-right bg-emerald-50 px-1.5 py-0.5 rounded">
                  {t.pass_rate}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Category Volume Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">Production by Beverage Type</h2>
            <p className="text-xs text-slate-500 mb-4">Volume breakdown across registered product lines</p>
            
            <div className="space-y-3">
              {[
                { name: 'Bottled Spring Water', volume: 15000, pct: 55, color: 'bg-sky-500' },
                { name: 'Sparkling Kola & Soda', volume: 7500, pct: 28, color: 'bg-amber-500' },
                { name: 'Brewed Ginger Malt', volume: 4500, pct: 17, color: 'bg-emerald-500' },
              ].map((c, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-800">{c.name}</span>
                    <span className="font-extrabold text-slate-900">{c.volume.toLocaleString()} ({c.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 bg-sky-50/50 p-3 rounded-lg border border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-sky-600" />
              <span className="text-xs font-bold text-sky-900">AI Risk Assessment</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              98.2% Model Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Recent Production Batches Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Production Batches & Status</h2>
            <p className="text-xs text-slate-500">Live batches transitioning through inspection, inventory, and distribution</p>
          </div>
          <button
            onClick={() => onNavigate('production')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            View all batches <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Batch Number</th>
                <th className="px-5 py-3">Product Name</th>
                <th className="px-5 py-3">Quantity</th>
                <th className="px-5 py-3">Production Date</th>
                <th className="px-5 py-3">Inspection Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentBatches.map((b: any) => {
                let statusBadge = (
                  <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full text-[10px]">
                    {b.status}
                  </span>
                );

                if (b.status === 'in_inventory' || b.status === 'approved') {
                  statusBadge = (
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px] flex items-center gap-1 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Approved for Sale
                    </span>
                  );
                } else if (b.status === 'inspecting' || b.status === 'requires_review') {
                  statusBadge = (
                    <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[10px] flex items-center gap-1 w-max animate-pulse">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> AI Review Hold
                    </span>
                  );
                } else if (b.status === 'pending_quality') {
                  statusBadge = (
                    <span className="bg-sky-100 text-sky-800 font-bold px-2.5 py-1 rounded-full text-[10px] flex items-center gap-1 w-max">
                      <Clock className="w-3 h-3 text-sky-600" /> Pending QC
                    </span>
                  );
                }

                return (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 font-mono">{b.batch_number}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{b.product_name}</td>
                    <td className="px-5 py-3.5 font-medium">{b.quantity.toLocaleString()} bottles</td>
                    <td className="px-5 py-3.5 text-slate-500">{b.date}</td>
                    <td className="px-5 py-3.5">{statusBadge}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => onSelectBatchForTracking(b.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[11px] transition"
                      >
                        Track History
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
