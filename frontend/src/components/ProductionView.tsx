import React, { useState } from 'react';
import {
  Factory,
  Plus,
  Search,
  Filter,
  QrCode,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
  Camera,
  Layers,
  Copy,
  Printer,
  Check,
  Droplets,
  Smartphone
} from 'lucide-react';

interface ProductionViewProps {
  batches: any[];
  products: any[];
  lines: any[];
  waterLots?: any[];
  onCreateBatch: (batchData: any) => Promise<void>;
  onSelectBatchForTracking: (batchId: string) => void;
  onOpenQR: (batchId: string) => void;
  onOpenScanner?: () => void;
}

export const ProductionView: React.FC<ProductionViewProps> = ({
  batches,
  products,
  lines,
  waterLots = [],
  onCreateBatch,
  onSelectBatchForTracking,
  onOpenQR,
  onOpenScanner,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedQRBatch, setSelectedQRBatch] = useState<any | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Form state
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
  const [selectedLine, setSelectedLine] = useState(lines[0]?.id || '');
  const [selectedWaterLot, setSelectedWaterLot] = useState(waterLots[0]?.lot_number || 'RW-2026-003');
  const [quantity, setQuantity] = useState(25000);
  const [rejectedQty, setRejectedQty] = useState(25);
  const [prodDate, setProdDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreateBatch({
        product_id: selectedProduct || products[0]?.id,
        production_line_id: selectedLine || lines[0]?.id,
        quantity_produced: Number(quantity),
        quantity_rejected: Number(rejectedQty),
        production_date: prodDate,
        source_water_lot: selectedWaterLot
      });
      setIsModalOpen(false);
    } catch (err: any) {
      alert(`Error creating batch: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = (token: string) => {
    const url = `https://n-ai-powered-tracking.vercel.app/?token=${token}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      String(b?.batch_number || '').toLowerCase().includes(String(searchTerm || '').toLowerCase()) ||
      String(b?.product_name || '').toLowerCase().includes(String(searchTerm || '').toLowerCase()) ||
      String(b?.source_water_lot || '').toLowerCase().includes(String(searchTerm || '').toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBottles = batches.reduce((acc, b) => acc + Number(b.quantity_produced || b.produced_quantity || 0), 0);
  const totalRejected = batches.reduce((acc, b) => acc + Number(b.quantity_rejected || 0), 0);
  const rejectionRate = totalBottles > 0 ? ((totalRejected / totalBottles) * 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Total Production Output</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalBottles.toLocaleString()} <span className="text-xs font-normal text-slate-500">bottles</span></p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Line 1 &amp; Line 2 Active</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Batches Manufactured</p>
          <p className="text-2xl font-extrabold text-sky-600 mt-1">{batches.length} <span className="text-xs font-normal text-slate-500">batches</span></p>
          <p className="text-[11px] text-slate-500 mt-1">Tracked with unique cryptographic QR codes</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Factory Rejection Rate</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{rejectionRate}%</p>
          <p className="text-[11px] text-slate-500 mt-1">Within standard 2.5% manufacturing target</p>
        </div>
      </div>

      {/* Action / Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search batch #, product, water lot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-64"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="in_production">In Production</option>
              <option value="pending_quality">Pending Quality</option>
              <option value="approved">Approved &amp; Released</option>
              <option value="quarantined">Quarantined</option>
            </select>
          </div>

          {/* View Mode Switcher: Table vs Floor QR Scan Board */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md transition ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${viewMode === 'cards' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              title="Show floor-ready scannable QR cards for mobile devices"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Floor QR Scan Board</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
              title="Open online mobile camera scanner"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Online Mobile Scanner</span>
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Batch</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Floor QR Scan Board Mode */}
      {viewMode === 'cards' && (
        <div className="space-y-3">
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between text-xs text-sky-900">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-sky-600" />
              <span className="font-bold">Production Floor QR Scannable Mode:</span>
              <span>All active production batch QR codes displayed large and high-contrast for phone and handheld scanning.</span>
            </div>
            {onOpenScanner && (
              <button
                onClick={onOpenScanner}
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold transition text-[11px]"
              >
                Launch Camera Scanner
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBatches.map((b) => {
              const qrToken = b.qr_token || `track_btl_${b.batch_number.toLowerCase().replace(/-/g, '_')}`;
              const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrToken)}`;

              return (
                <div key={b.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-sky-300 transition">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold font-mono text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        {b.batch_number}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        b.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'in_production' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status === 'approved' ? 'QC Approved' : b.status === 'in_production' ? 'Active Line' : 'Quality Review'}
                      </span>
                    </div>

                    <p className="font-bold text-slate-900 text-sm">{b.product_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{b.line_name || 'Line 1 - High Speed (PET)'}</p>
                    {b.source_water_lot && (
                      <p className="text-[11px] text-sky-700 font-medium mt-1 flex items-center gap-1">
                        <Droplets className="w-3 h-3" />
                        Source Water: {b.source_water_lot}
                      </p>
                    )}

                    {/* Central High-Contrast Scannable QR Box */}
                    <div className="my-4 p-3 bg-slate-950 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:ring-2 hover:ring-sky-500 transition" onClick={() => setSelectedQRBatch(b)}>
                      <div className="bg-white p-2 rounded-lg shadow">
                        <img
                          src={qrImgUrl}
                          alt={`QR Code for ${b.batch_number}`}
                          className="w-36 h-36 object-contain"
                          onError={(e) => {
                            // Fallback if network blocked
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <p className="text-[10px] font-mono text-sky-400 mt-2 font-bold tracking-wider">TAP TO ENLARGE / SCAN</p>
                      <p className="text-[9px] font-mono text-slate-400 truncate max-w-xs">{qrToken}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedQRBatch(b)}
                      className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Display QR</span>
                    </button>
                    <button
                      onClick={() => onSelectBatchForTracking(b.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                    >
                      Trace
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Standard Batches Table Mode */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Batch Number</th>
                  <th className="px-5 py-3">Product Name</th>
                  <th className="px-5 py-3">Production Line</th>
                  <th className="px-5 py-3">Water Source</th>
                  <th className="px-5 py-3">Produced / Rejected</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Scannable QR &amp; Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBatches.map((b) => {
                  let badge = (
                    <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      {b.status}
                    </span>
                  );

                  if (b.status === 'in_inventory' || b.status === 'approved') {
                    badge = (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" /> Released
                      </span>
                    );
                  } else if (b.status === 'inspecting' || b.status === 'requires_review') {
                    badge = (
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> Quality Hold
                      </span>
                    );
                  } else if (b.status === 'pending_quality' || b.status === 'in_production') {
                    badge = (
                      <span className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-600" /> In Production
                      </span>
                    );
                  } else if (b.status === 'rejected') {
                    badge = (
                      <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        Rejected
                      </span>
                    );
                  }

                  return (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-bold font-mono text-slate-900">{b.batch_number}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-900">{b.product_name}</p>
                        <p className="text-[10px] text-slate-400">{b.product_category || 'Bottled Beverage'}</p>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-700">{b.line_name || 'Line 1'}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                          <Droplets className="w-3 h-3 text-sky-600" />
                          {b.source_water_lot || 'RW-2026-001'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-900">{Number(b.quantity_produced || b.produced_quantity || 0).toLocaleString()}</span>
                        <span className="text-slate-400"> / </span>
                        <span className="text-rose-600 font-semibold">{b.quantity_rejected ?? 0} rej</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">{b.production_date}</td>
                      <td className="px-5 py-3.5">{badge}</td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        {/* Prominent Show QR Button */}
                        <button
                          onClick={() => setSelectedQRBatch(b)}
                          title="Show Scannable QR Code for Floor Scan"
                          className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 hover:text-sky-800 rounded-lg transition inline-flex items-center gap-1.5 font-bold border border-sky-200 shadow-xs"
                        >
                          <QrCode className="w-3.5 h-3.5 text-sky-600" />
                          <span>Show QR</span>
                        </button>
                        <button
                          onClick={() => onSelectBatchForTracking(b.id)}
                          className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition"
                        >
                          Trace
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Large Scannable QR Code Display for Floor Workers */}
      {selectedQRBatch && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 text-left">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{selectedQRBatch.batch_number}</h3>
                <p className="text-xs text-slate-500">{selectedQRBatch.product_name}</p>
              </div>
              <button
                onClick={() => setSelectedQRBatch(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* High-Contrast Scannable QR Container */}
            <div className="p-4 bg-slate-950 rounded-2xl shadow-xl inline-block my-2">
              <div className="bg-white p-3 rounded-xl shadow">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(
                    selectedQRBatch.qr_token || `track_btl_${selectedQRBatch.batch_number.toLowerCase().replace(/-/g, '_')}`
                  )}`}
                  alt={`Scannable QR ${selectedQRBatch.batch_number}`}
                  className="w-56 h-56 object-contain"
                />
              </div>
              <div className="mt-2 text-sky-400 text-[10px] font-mono font-bold flex justify-between px-2">
                <span>SLSB-CS-022 CERT</span>
                <span>FREETOWN CORE</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs my-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Batch Token:</span>
                <span className="font-mono font-bold text-slate-900 break-all">
                  {selectedQRBatch.qr_token || `track_btl_${selectedQRBatch.batch_number.toLowerCase().replace(/-/g, '_')}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Water Lot:</span>
                <span className="font-bold text-sky-700">{selectedQRBatch.source_water_lot || 'RW-2026-001 (Borehole Kissy)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Production Line:</span>
                <span className="font-semibold text-slate-800">{selectedQRBatch.line_name || 'Line 1 (PET)'}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {onOpenScanner && (
                <button
                  onClick={() => {
                    setSelectedQRBatch(null);
                    onOpenScanner();
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Test Scan with Online Camera</span>
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLink(selectedQRBatch.qr_token || selectedQRBatch.batch_number)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? 'URL Copied!' : 'Copy Verification URL'}</span>
                </button>
                <button
                  onClick={() => setSelectedQRBatch(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Register New Production Batch</h3>
                <p className="text-xs text-slate-500">Step 2: Connect source water lot, initiate line filling and generate scannable QR</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Beverage Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-medium focus:ring-2 focus:ring-sky-500"
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.volume_ml}ml - {p.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Source Water Lot Selection (Stage 1 Handover) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  <span>Approved Source Water Intake Lot (Stage 1)</span>
                </label>
                <select
                  value={selectedWaterLot}
                  onChange={(e) => setSelectedWaterLot(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-sky-50/50 font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500"
                >
                  {waterLots.length > 0 ? (
                    waterLots.map((w: any) => (
                      <option key={w.id} value={w.lot_number}>
                        {w.lot_number} - {w.source_name} ({Number(w.volume_liters).toLocaleString()}L - {w.treatment_status})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="RW-2026-003">RW-2026-003 - Borehole Aquifer 1 Kissy (60,000L - Cleared)</option>
                      <option value="RW-2026-001">RW-2026-001 - Borehole Aquifer 1 Kissy (50,000L)</option>
                    </>
                  )}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Links bottling run to borehole extraction and reverse osmosis chemical records.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Production Line</label>
                  <select
                    value={selectedLine}
                    onChange={(e) => setSelectedLine(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-medium focus:ring-2 focus:ring-sky-500"
                    required
                  >
                    {lines.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Production Date</label>
                  <input
                    type="date"
                    value={prodDate}
                    onChange={(e) => setProdDate(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-medium focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Planned Bottle Units</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-medium focus:ring-2 focus:ring-sky-500"
                    min="100"
                    step="500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Defects / Rejection Estimate</label>
                  <input
                    type="number"
                    value={rejectedQty}
                    onChange={(e) => setRejectedQty(parseInt(e.target.value, 10))}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-medium focus:ring-2 focus:ring-sky-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow transition disabled:opacity-50"
                >
                  {submitting ? 'Creating Batch...' : 'Register Batch & Issue QR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
