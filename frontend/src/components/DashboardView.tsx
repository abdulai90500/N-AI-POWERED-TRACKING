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
  ArrowRight
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
