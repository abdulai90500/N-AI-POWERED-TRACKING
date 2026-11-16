import React, { useState } from 'react';
import {
  QrCode,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Factory,
  Boxes,
  Truck,
  BrainCircuit,
  Copy,
  Check
} from 'lucide-react';

interface QRTraceabilityViewProps {
  batches: any[];
  selectedBatchHistory: any;
  onFetchHistory: (batchId: string) => Promise<void>;
  onOpenPublicTrack: (token: string) => void;
}

export const QRTraceabilityView: React.FC<QRTraceabilityViewProps> = ({
  batches,
  selectedBatchHistory,
  onFetchHistory,
  onOpenPublicTrack
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const batch = selectedBatchHistory?.batch || batches[0];
  const qrToken = selectedBatchHistory?.qr_token || batch?.qr_token || 'beveragetrack-token';
  const publicUrl = `http://localhost:3000/track/${qrToken}`;

  const handleSelectBatch = async (id: string) => {
    setSelectedBatchId(id);
    await onFetchHistory(id);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Selector Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <QrCode className="w-5 h-5 text-sky-600" />
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Select Batch for Traceability
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => handleSelectBatch(e.target.value)}
              className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2 bg-slate-50 focus:ring-2 focus:ring-sky-500"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.batch_number} - {b.product_name} ({b.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => onOpenPublicTrack(qrToken)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
        >
          <ExternalLink className="w-4 h-4" />
          Preview Consumer Public View
        </button>
      </div>

      {/* Two Column: QR Code Artifact + Lifecycle Traceability Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Code Presentation Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-between text-center">
          <div className="w-full">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              Digital Product Passport
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-2">{batch?.batch_number}</h3>
            <p className="text-xs text-slate-500 font-semibold">{batch?.product_name}</p>

            {/* QR Visual */}
            <div className="my-5 p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-inner inline-block">
              {/* Scalable SVG representation */}
              <div className="w-44 h-44 bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-between text-white shadow-md">
                <div className="w-full flex justify-between items-center text-[9px] text-sky-400 font-mono">
                  <span>SL-STANDARD</span>
                  <span>QC-CERT</span>
                </div>
                <div className="w-28 h-28 bg-white rounded-lg p-1.5 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center text-white font-mono font-bold text-xs p-1 text-center">
                    QR CODE<br />
                    <span className="text-[9px] text-sky-400">{qrToken?.slice(0, 8)}</span>
                  </div>
                </div>
                <p className="text-[9px] font-mono text-slate-400 tracking-widest">SIERRA SPRINGS</p>
              </div>
            </div>

            <div className="text-left bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Security Token:</span>
                <span className="font-mono font-bold text-slate-800">{qrToken?.slice(0, 12)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Manufactured:</span>
                <span className="font-semibold text-slate-800">{batch?.production_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expiry Date:</span>
                <span className="font-semibold text-slate-800">{batch?.expiry_date || 'Standard +1yr'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-extrabold text-emerald-700 capitalize">{batch?.status}</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded flex items-center justify-center gap-1 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied' : 'Copy Verification URL'}
            </button>
          </div>
        </div>

        {/* Chronological 5-Stage Traceability Timeline */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Full Operational Traceability Trail</h3>
              <p className="text-xs text-slate-500">From raw spring bottling in Kissy to distributor delivery</p>
            </div>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded">
              Verified Audit Trail
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {/* Stage 1: Production */}
            <div className="relative">
              <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-sky-500 border-2 border-white shadow text-white flex items-center justify-center text-[10px] font-bold">
                1
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Factory className="w-3.5 h-3.5 text-sky-600" /> Production & Bottling Registered
                  </span>
                  <span className="text-[11px] text-slate-400">{batch?.production_date}</span>
                </div>
                <p className="text-xs text-slate-600">
                  Manufactured <strong>{batch?.quantity_produced?.toLocaleString()} bottles</strong> on{' '}
                  <strong>{batch?.line_name || 'High-Speed Line 01'}</strong>. Rejected {batch?.quantity_rejected} defective preforms during blowing.
                </p>
              </div>
            </div>

            {/* Stage 2: Quality Inspection */}
            <div className="relative">
              <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow text-white flex items-center justify-center text-[10px] font-bold">
                2
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Laboratory Quality Inspection
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Passed & Certified
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  pH Level tested at 7.22 (within 6.5 - 8.0 standard). Volumetric fill certified at 500.8ml. Cap torque seal hermeticity passed.
                </p>
              </div>
            </div>

            {/* Stage 3: AI Quality Monitoring */}
            <div className="relative">
              <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-indigo-500 border-2 border-white shadow text-white flex items-center justify-center text-[10px] font-bold">
                3
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" /> AI Anomaly & Failure Risk Evaluation
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Model v2.1.0</span>
                </div>
                <p className="text-xs text-slate-600">
                  Isolation Forest: <strong>NORMAL (Score: 0.880)</strong>. Random Forest failure probability: <strong>3.0%</strong>. Batch recommended for unrestricted inventory release.
                </p>
              </div>
            </div>

            {/* Stage 4: Warehouse Storage */}
            <div className="relative">
              <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow text-white flex items-center justify-center text-[10px] font-bold">
                4
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-amber-600" /> Warehouse Inventory Ingestion
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Kissy Central Bay
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Stock movement transaction <strong>STOCK_IN</strong> logged. Available pallet quantities allocated for distribution orders.
                </p>
              </div>
            </div>

            {/* Stage 5: Distribution & Delivery */}
            <div className="relative">
              <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-slate-800 border-2 border-white shadow text-white flex items-center justify-center text-[10px] font-bold">
                5
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-700" /> Fleet Dispatch & Distributor Delivery
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Delivered
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Order <strong>ORD-SL-0001</strong> delivered to <strong>Freetown Supermarket & Groceries</strong> (Siaka Stevens St). Driver Amadu Koroma (SL-AA-4892).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
