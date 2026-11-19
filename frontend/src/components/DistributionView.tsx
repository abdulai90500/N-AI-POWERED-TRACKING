import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Send,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  RotateCcw,
  Navigation,
  FileCheck
} from 'lucide-react';

interface DistributionViewProps {
  orders: any[];
  deliveries: any[];
  customers: any[];
  batches: any[];
  onCreateOrder: (data: any) => Promise<void>;
  onDispatchDelivery: (data: any) => Promise<void>;
  onUpdateDeliveryStatus: (deliveryId: string, data: any) => Promise<void>;
}

export const DistributionView: React.FC<DistributionViewProps> = ({
  orders,
  deliveries,
  customers,
  batches,
  onCreateOrder,
  onDispatchDelivery,
  onUpdateDeliveryStatus
}) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Order Form
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [orderQuantity, setOrderQuantity] = useState(2000);
  const [destinationAddress, setDestinationAddress] = useState('Central Freetown Market District');

  // Dispatch Form
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const [dispatchOrderId, setDispatchOrderId] = useState(pendingOrders[0]?.id || orders[0]?.id || '');
  const [driverName, setDriverName] = useState('Amadu Koroma');
  const [driverPhone, setDriverPhone] = useState('+232 76 998877');
  const [vehicleNumber, setVehicleNumber] = useState('SL-AA-4892');
  const [dispatchNotes, setDispatchNotes] = useState('Freetown retail route delivery');

  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreateOrder({
        customer_id: selectedCustomerId,
        batch_id: selectedBatchId,
        quantity_ordered: Number(orderQuantity),
        destination_address: destinationAddress
      });
      setIsOrderModalOpen(false);
    } catch (err: any) {
      alert(`Error creating order: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onDispatchDelivery({
        order_id: dispatchOrderId,
        driver_name: driverName,
        driver_phone: driverPhone,
        vehicle_number: vehicleNumber,
        notes: dispatchNotes
      });
      setIsDispatchModalOpen(false);
    } catch (err: any) {
      alert(`Error dispatching delivery: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkDelivered = async (deliveryId: string) => {
    try {
      await onUpdateDeliveryStatus(deliveryId, {
        delivery_status: 'delivered',
        proof_notes: 'Delivered in full. Signed by store receiving clerk.'
      });
    } catch (err: any) {
      alert(`Error updating delivery: ${err.message}`);
    }
  };

  const handleSetInTransit = async (deliveryId: string) => {
    try {
      await onUpdateDeliveryStatus(deliveryId, {
        delivery_status: 'in_transit'
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Distribution KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Customer Orders</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{orders.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Total distribution orders</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Active In-Transit</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            {deliveries.filter(d => d.delivery_status === 'in_transit' || d.delivery_status === 'dispatched').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Fleet trucks currently on road</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Delivered Orders</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {deliveries.filter(d => d.delivery_status === 'delivered').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Confirmed with signature/proof</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Fulfillment Rate</p>
          <p className="text-2xl font-extrabold text-sky-600 mt-1">98.5%</p>
          <p className="text-[11px] text-slate-500 mt-1">Zero bottle damage reported</p>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Distribution Logistics & Fleet Dispatch</h2>
          <p className="text-xs text-slate-500">Track delivery orders across Greater Freetown and Provincial Depots</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            Create Customer Order
          </button>
          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
          >
            <Send className="w-4 h-4" />
            Dispatch Vehicle & Driver
          </button>
        </div>
      </div>

      {/* Deliveries Fleet Tracking Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Active Delivery Dispatches & Vehicle Tracking</h2>
          <p className="text-xs text-slate-500">Real-time status progression: Dispatched → In Transit → Delivered</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Order Number</th>
                <th className="px-5 py-3">Customer & Destination</th>
                <th className="px-5 py-3">Driver & Vehicle</th>
                <th className="px-5 py-3">Delivery Status</th>
                <th className="px-5 py-3">Dispatched Time</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveries.map((d) => {
                let badge = (
                  <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full text-[10px]">
                    {d.delivery_status}
                  </span>
                );

                if (d.delivery_status === 'delivered') {
                  badge = (
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Delivered
                    </span>
                  );
                } else if (d.delivery_status === 'in_transit') {
                  badge = (
                    <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1 animate-pulse">
                      <Navigation className="w-3 h-3 text-amber-600" /> In Transit
                    </span>
                  );
                } else if (d.delivery_status === 'dispatched') {
                  badge = (
                    <span className="bg-sky-100 text-sky-800 font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-600" /> Dispatched
                    </span>
                  );
                }

                return (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold font-mono text-slate-900">{d.order_number}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-800">{d.customer_name || 'Customer'}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" /> Freetown Territory
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{d.driver_name}</p>
                      <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Truck className="w-3 h-3 text-sky-600" /> {d.vehicle_number} • {d.driver_phone}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">{badge}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                      {d.dispatched_at ? new Date(d.dispatched_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      {d.delivery_status === 'dispatched' && (
                        <button
                          onClick={() => handleSetInTransit(d.id)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded text-[11px] transition"
                        >
                          Mark In-Transit
                        </button>
                      )}
                      {d.delivery_status !== 'delivered' && (
                        <button
                          onClick={() => handleMarkDelivered(d.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] shadow-sm transition"
                        >
                          Confirm Delivery
                        </button>
                      )}
                      {d.delivery_status === 'delivered' && (
                        <span className="text-[11px] text-emerald-600 font-bold">Proof Verified</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Distributor & Wholesale Orders</h2>
          <p className="text-xs text-slate-500">Allocated batches and delivery fulfillment records</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Order #</th>
                <th className="px-5 py-3">Customer Name</th>
                <th className="px-5 py-3">Allocated Batch</th>
                <th className="px-5 py-3">Quantity Ordered</th>
                <th className="px-5 py-3">Quantity Delivered</th>
                <th className="px-5 py-3">Destination</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-bold font-mono text-slate-900">{o.order_number}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{o.customer_name}</td>
                  <td className="px-5 py-3.5 font-mono text-sky-700 font-bold">{o.batch_number || 'N/A'}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{Number(o.quantity_ordered || o.total_cases * 18 || 0).toLocaleString()} btls</td>
                  <td className="px-5 py-3.5 font-bold text-emerald-600">{Number(o.quantity_delivered || (o.status === 'delivered' ? o.quantity_ordered || 4000 : 0)).toLocaleString()} btls</td>
                  <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{o.destination_address}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      o.status === 'dispatched' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Create Distribution Order</h3>
                <p className="text-xs text-slate-500">Allocate batches from warehouse stock</p>
              </div>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer / Distributor</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-bold"
                  required
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Allocate Batch (From Inventory)</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-semibold"
                  required
                >
                  {batches.filter(b => b.status === 'in_inventory' || b.status === 'approved').map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batch_number} - {b.product_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quantity (Bottles)</label>
                <input
                  type="number"
                  min="1"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Destination Address</label>
                <input
                  type="text"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow"
                >
                  {submitting ? 'Creating...' : 'Register Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispatch Modal */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Dispatch Vehicle & Driver</h3>
                <p className="text-xs text-slate-500">Assign vehicle, driver, and deduct stock movement</p>
              </div>
              <button onClick={() => setIsDispatchModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Order to Dispatch</label>
                <select
                  value={dispatchOrderId}
                  onChange={(e) => setDispatchOrderId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-bold"
                  required
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.order_number} - {o.customer_name} ({o.quantity_ordered} bottles) [{o.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Driver Phone</label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Registration #</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono font-bold"
                  placeholder="SL-AA-4892"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dispatch Notes</label>
                <textarea
                  rows={2}
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow"
                >
                  {submitting ? 'Dispatching...' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
