import React, { useState } from 'react';
import {
  Boxes,
  Building,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertCircle,
  Plus,
  Search,
  CheckCircle,
  Truck
} from 'lucide-react';

interface InventoryViewProps {
  warehouses: any[];
  inventorySummary: any;
  movements: any[];
  lowStockAlerts: any[];
  batches: any[];
  onReceiveStock: (data: any) => Promise<void>;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  warehouses,
  inventorySummary,
  movements,
  lowStockAlerts,
  batches,
  onReceiveStock
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filter approved batches eligible to enter inventory
  const approvedBatches = batches.filter(b => b.status === 'approved' || b.status === 'in_inventory');

  const [selectedBatchId, setSelectedBatchId] = useState(approvedBatches[0]?.id || batches[0]?.id || '');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(warehouses[0]?.id || '');
  const [receiveQuantity, setReceiveQuantity] = useState(5000);
  const [receiveNotes, setReceiveNotes] = useState('Transfer of approved production batch to warehouse bays.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onReceiveStock({
        batch_id: selectedBatchId,
        warehouse_id: selectedWarehouseId,
        quantity: Number(receiveQuantity),
        movement_type: 'STOCK_IN',
        notes: receiveNotes
      });
      setIsModalOpen(false);
    } catch (err: any) {
      alert(`Error receiving stock: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const totalStock = inventorySummary?.total_bottles_in_stock || 13090;
  const batchList = inventorySummary?.inventory || [];

  return (
    <div className="space-y-6">
      {/* Top Warehouse Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {warehouses.map((wh) => {
          const cap = wh.capacity_units || 50000;
          const current = wh.current_stock || 0;
          const pct = Math.min(100, Math.round((current / cap) * 100));
          return (
            <div key={wh.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-sky-50 text-sky-700 rounded-lg">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{wh.name}</h3>
                      <p className="text-[11px] text-slate-500">{wh.address || 'Freetown Depot'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    {pct}% Full
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-600">Current Occupancy</span>
                    <span className="text-slate-900">{Number(current || 0).toLocaleString()} / {Number(cap || 0).toLocaleString()} units</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Active Bay Temperature: 22.4°C</span>
                <span className="text-emerald-600 font-bold">Secure Storage</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alerts (if any) */}
      {lowStockAlerts && lowStockAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">Low Stock Notice Detected</p>
              <p className="text-xs text-amber-800">
                Some beverage categories are below the minimum safety threshold (2,000 units). Consider scheduling a new production run.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Available Stock by Batch Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Finished Goods Stock by Batch</h2>
            <p className="text-xs text-slate-500">
              Total available in warehouses: <strong>{Number(totalStock || 0).toLocaleString()} bottles</strong>
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            Receive Approved Batch
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Batch Number</th>
                <th className="px-5 py-3">Product Name</th>
                <th className="px-5 py-3">Available Bottles</th>
                <th className="px-5 py-3">Production Date</th>
                <th className="px-5 py-3">Expiry Date</th>
                <th className="px-5 py-3">Inventory Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batchList.map((b: any) => (
                <tr key={b.batch_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-bold font-mono text-slate-900">{b.batch_number}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-800">{b.product_name}</p>
                    <p className="text-[10px] text-slate-400">{b.product_category}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {Number(b.available_stock || 0).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal"> / {Number(b.quantity_produced || b.produced_quantity || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{b.production_date}</td>
                  <td className="px-5 py-3.5 text-slate-500">{b.expiry_date || 'Standard +1yr'}</td>
                  <td className="px-5 py-3.5">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded text-[10px] inline-flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> In Storage
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movements Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Inventory Transaction Movements Ledger</h2>
          <p className="text-xs text-slate-500">Immutable chronological record of stock entries and dispatches</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Batch Number</th>
                <th className="px-5 py-3">Quantity</th>
                <th className="px-5 py-3">Warehouse</th>
                <th className="px-5 py-3">Reference / Order</th>
                <th className="px-5 py-3">Notes</th>
                <th className="px-5 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.map((m: any) => {
                const isStockIn = m.movement_type === 'STOCK_IN';
                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1 ${
                        isStockIn ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {isStockIn ? <ArrowDownToLine className="w-3 h-3" /> : <ArrowUpFromLine className="w-3 h-3" />}
                        {m.movement_type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold font-mono text-slate-900">{m.batch_number}</td>
                    <td className="px-5 py-3.5 font-extrabold text-slate-900">
                      {isStockIn ? '+' : '-'}{Number(m.quantity || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">{m.warehouse_name || 'Kissy Central'}</td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">{m.reference_id || 'N/A'}</td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{m.notes}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Receive Approved Batch to Warehouse</h3>
                <p className="text-xs text-slate-500">Record stock receipt transaction into storage bays</p>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Approved Production Batch</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-bold focus:ring-2 focus:ring-sky-500"
                  required
                >
                  {approvedBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batch_number} - {b.product_name} (Approved)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination Warehouse</label>
                <select
                  value={selectedWarehouseId}
                  onChange={(e) => setSelectedWarehouseId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-semibold focus:ring-2 focus:ring-sky-500"
                  required
                >
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name} ({wh.address})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quantity (Bottles)</label>
                <input
                  type="number"
                  min="1"
                  value={receiveQuantity}
                  onChange={(e) => setReceiveQuantity(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Receipt Notes</label>
                <textarea
                  rows={2}
                  value={receiveNotes}
                  onChange={(e) => setReceiveNotes(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  placeholder="Storage aisle, pallet tags, line transfer document..."
                ></textarea>
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
                  {submitting ? 'Processing...' : 'Confirm Stock Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
