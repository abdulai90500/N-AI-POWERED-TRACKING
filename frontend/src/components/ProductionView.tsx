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
  Sparkles
} from 'lucide-react';

interface ProductionViewProps {
  batches: any[];
  products: any[];
  lines: any[];
  onCreateBatch: (batchData: any) => Promise<void>;
  onSelectBatchForTracking: (batchId: string) => void;
  onOpenQR: (batchId: string) => void;
}

export const ProductionView: React.FC<ProductionViewProps> = ({
  batches,
  products,
  lines,
  onCreateBatch,
  onSelectBatchForTracking,
  onOpenQR
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
  const [selectedLine, setSelectedLine] = useState(lines[0]?.id || '');
  const [quantity, setQuantity] = useState(5000);
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
        production_date: prodDate
      });
      setIsModalOpen(false);
    } catch (err: any) {
      alert(`Error creating batch: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      String(b?.batch_number || '').toLowerCase().includes(String(searchTerm || '').toLowerCase()) ||
      String(b?.product_name || '').toLowerCase().includes(String(searchTerm || '').toLowerCase());
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
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{Number(totalBottles || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">bottles</span></p>
          <p className="text-[11px] text-slate-500 mt-1">Recorded in current production cycle</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Batches Manufactured</p>
          <p className="text-2xl font-extrabold text-sky-600 mt-1">{batches.length} <span className="text-xs font-normal text-slate-500">batches</span></p>
          <p className="text-[11px] text-slate-500 mt-1">Tracked with unique QR identifiers</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Factory Rejection Rate</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{rejectionRate}%</p>
          <p className="text-[11px] text-slate-500 mt-1">Within standard 2.5% manufacturing target</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search batch number (e.g. BTL-2026-001) or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold border border-slate-200 rounded-lg px-2.5 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="pending_quality">Pending QC</option>
              <option value="inspecting">Under Review</option>
              <option value="approved">Approved</option>
              <option value="in_inventory">In Inventory</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          Register New Batch
        </button>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Batch Number</th>
                <th className="px-5 py-3">Product Name</th>
                <th className="px-5 py-3">Production Line</th>
                <th className="px-5 py-3">Produced / Rejected</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
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
                } else if (b.status === 'pending_quality') {
                  badge = (
                    <span className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-600" /> Pending Inspection
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
                      <p className="text-[10px] text-slate-400">{b.product_category}</p>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">{b.line_name || 'Line 01'}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-slate-900">{Number(b.quantity_produced || b.produced_quantity || 0).toLocaleString()}</span>
                      <span className="text-slate-400"> / </span>
                      <span className="text-rose-600 font-semibold">{b.quantity_rejected ?? 0} rej</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{b.production_date}</td>
                    <td className="px-5 py-3.5">{badge}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => onOpenQR(b.id)}
                        title="View Batch QR Code"
                        className="p-1.5 bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded transition inline-flex items-center"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onSelectBatchForTracking(b.id)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[11px] transition"
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

      {/* New Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Register New Production Batch</h3>
                <p className="text-xs text-slate-500">Generates unique batch identifier and cryptographic QR code</p>
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
                      {l.name} ({l.line_code || 'ACTIVE'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantity Produced</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rejections on Line</label>
                  <input
                    type="number"
                    min="0"
                    value={rejectedQty}
                    onChange={(e) => setRejectedQty(Number(e.target.value))}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-bold text-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Production Date</label>
                <input
                  type="date"
                  value={prodDate}
                  onChange={(e) => setProdDate(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  required
                />
              </div>

              <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 text-xs text-sky-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>
                  The system will automatically assign a sequential identifier (e.g. <strong>BTL-2026-005</strong>) and generate a secure traceability token.
                </span>
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
                  {submitting ? 'Registering...' : 'Confirm & Generate Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
