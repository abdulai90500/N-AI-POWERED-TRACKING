import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  ShieldCheck,
  BrainCircuit,
  Sliders,
  FileCheck,
  Search,
  Filter
} from 'lucide-react';

interface QualityControlViewProps {
  inspections: any[];
  batches: any[];
  products: any[];
  parameters: any[];
  onSubmitInspection: (data: any) => Promise<void>;
  onReleaseBatch: (batchId: string) => Promise<void>;
  onRejectBatch: (batchId: string, reason?: string) => Promise<void>;
}

export const QualityControlView: React.FC<QualityControlViewProps> = ({
  inspections,
  batches,
  products,
  parameters,
  onSubmitInspection,
  onReleaseBatch,
  onRejectBatch
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const pendingBatches = batches.filter(b => b.status === 'pending_quality' || b.status === 'inspecting' || b.status === 'requires_review');
  const [selectedBatchId, setSelectedBatchId] = useState(pendingBatches[0]?.id || batches[0]?.id || '');
  const [phValue, setPhValue] = useState('7.20');
  const [volumeValue, setVolumeValue] = useState('500.0');
  const [torqueValue, setTorqueValue] = useState('1.80');
  const [visualDefects, setVisualDefects] = useState('0');
  const [remarks, setRemarks] = useState('Routine regulatory compliance inspection test.');

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  // Live validation calculations
  const numPh = parseFloat(phValue) || 7.0;
  const numVol = parseFloat(volumeValue) || 500.0;
  const numTorque = parseFloat(torqueValue) || 1.8;
  const numDefects = parseInt(visualDefects, 10) || 0;

  const isPhAnomaly = numPh < 6.5 || numPh > 8.0;
  const isVolAnomaly = Math.abs(numVol - 500.0) > 5.0;
  const isDefectFlag = numDefects > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Find or build parameter entries
      const measurements = [
        {
          parameter_id: parameters.find(p => p.parameter_name.toLowerCase().includes('ph'))?.id || 'param-ph',
          parameter_name: 'pH Level',
          measured_value: numPh,
          notes: isPhAnomaly ? 'Out of specification' : 'Within normal limits'
        },
        {
          parameter_id: parameters.find(p => p.parameter_name.toLowerCase().includes('volume'))?.id || 'param-vol',
          parameter_name: 'Filling Volume',
          measured_value: numVol,
          notes: isVolAnomaly ? 'Filling volume deviation detected' : 'Optimal volumetric fill'
        },
        {
          parameter_id: parameters.find(p => p.parameter_name.toLowerCase().includes('torque') || p.parameter_name.toLowerCase().includes('seal'))?.id || 'param-torque',
          parameter_name: 'Cap Torque & Seal',
          measured_value: numTorque,
          notes: 'Standard seal compression'
        },
        {
          parameter_id: parameters.find(p => p.parameter_name.toLowerCase().includes('visual'))?.id || 'param-visual',
          parameter_name: 'Visual Defects',
          measured_value: numDefects,
          notes: numDefects > 0 ? `${numDefects} defective bottles flagged` : 'Zero visual defects'
        }
      ];

      await onSubmitInspection({
        batch_id: selectedBatchId,
        remarks: remarks,
        measurements: measurements
      });

      setIsModalOpen(false);
    } catch (err: any) {
      alert(`Error submitting inspection: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRelease = async (batchId: string) => {
    if (confirm('Authorize release of this batch into saleable inventory?')) {
      try {
        await onReleaseBatch(batchId);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleReject = async (batchId: string) => {
    const reason = prompt('Specify official reason for rejecting this batch:');
    if (reason) {
      try {
        await onRejectBatch(batchId, reason);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Total Inspections Performed</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{inspections.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Logged with parameter records</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Batches Awaiting Release</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            {batches.filter(b => b.status === 'approved').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Inspection passed; pending inventory transfer</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Batches on Quality Hold</p>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">
            {batches.filter(b => b.status === 'inspecting' || b.status === 'requires_review').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Quarantined pending secondary review</p>
        </div>
      </div>

      {/* Release Authorization Section */}
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl p-5 border border-sky-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Batch Release Authorization Queue</h3>
              <p className="text-xs text-slate-600">
                Official quality clearance required before products can be moved to warehouse inventory.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            Conduct New Inspection
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {batches.filter(b => b.status === 'approved' || b.status === 'inspecting' || b.status === 'pending_quality').map((b) => (
            <div key={b.id} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-slate-900 text-xs">{b.batch_number}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                    b.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    b.status === 'inspecting' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {b.status === 'approved' ? 'QC Approved' : b.status === 'inspecting' ? 'Under Review' : 'Pending QC'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-1">{b.product_name}</p>
                <p className="text-[11px] text-slate-500">{b.quantity_produced.toLocaleString()} bottles • {b.production_date}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                {b.status === 'approved' && (
                  <button
                    onClick={() => handleRelease(b.id)}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-sm transition"
                  >
                    Release to Inventory
                  </button>
                )}
                {b.status !== 'approved' && (
                  <button
                    onClick={() => {
                      setSelectedBatchId(b.id);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded shadow-sm transition"
                  >
                    Inspect Now
                  </button>
                )}
                <button
                  onClick={() => handleReject(b.id)}
                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspections History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Laboratory & Sensor Quality Inspection Records</h2>
            <p className="text-xs text-slate-500">Documented measurements and compliance verdicts</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Batch</th>
                <th className="px-5 py-3">Inspector</th>
                <th className="px-5 py-3">Inspection Status</th>
                <th className="px-5 py-3">Measurements Monitored</th>
                <th className="px-5 py-3">Remarks</th>
                <th className="px-5 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inspections.map((ins) => {
                let badge = (
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Passed
                  </span>
                );
                if (ins.inspection_status === 'requires_review') {
                  badge = (
                    <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> Requires Review
                    </span>
                  );
                } else if (ins.inspection_status === 'failed') {
                  badge = (
                    <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-rose-600" /> Failed
                    </span>
                  );
                }

                return (
                  <tr key={ins.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold font-mono text-slate-900">{ins.batch_number}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{ins.inspector_name || 'QC Officer'}</td>
                    <td className="px-5 py-3.5">{badge}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {ins.measurements?.map((m: any, idx: number) => (
                          <span
                            key={idx}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              m.result === 'out_of_spec'
                                ? 'bg-rose-100 text-rose-800 font-bold'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {m.parameter_name}: {m.measured_value}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{ins.remarks}</td>
                    <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                      {new Date(ins.inspected_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Inspection Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Record Quality Inspection</h3>
                <p className="text-xs text-slate-500">Triggers real-time AI anomaly detection and failure probability</p>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Production Batch</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-bold focus:ring-2 focus:ring-sky-500"
                  required
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batch_number} - {b.product_name} ({b.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Parameters input grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">pH Level</label>
                    <span className="text-[10px] text-slate-400">Spec: 6.5 - 8.0</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={phValue}
                    onChange={(e) => setPhValue(e.target.value)}
                    className={`w-full text-xs border rounded-lg p-2 font-mono font-bold ${
                      isPhAnomaly ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-300'
                    }`}
                    required
                  />
                  {isPhAnomaly && (
                    <p className="text-[10px] text-rose-600 font-bold mt-0.5">Out of specification!</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Volume (ml)</label>
                    <span className="text-[10px] text-slate-400">Spec: 495 - 505</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={volumeValue}
                    onChange={(e) => setVolumeValue(e.target.value)}
                    className={`w-full text-xs border rounded-lg p-2 font-mono font-bold ${
                      isVolAnomaly ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-300'
                    }`}
                    required
                  />
                  {isVolAnomaly && (
                    <p className="text-[10px] text-rose-600 font-bold mt-0.5">Under/overfill error!</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Cap Torque (Nm)</label>
                    <span className="text-[10px] text-slate-400">Spec: 1.4 - 2.4</span>
                  </div>
                  <input
                    type="number"
                    step="0.05"
                    value={torqueValue}
                    onChange={(e) => setTorqueValue(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Visual Defects</label>
                    <span className="text-[10px] text-slate-400">Target: 0</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={visualDefects}
                    onChange={(e) => setVisualDefects(e.target.value)}
                    className={`w-full text-xs border rounded-lg p-2 font-mono font-bold ${
                      isDefectFlag ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inspector Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500"
                  placeholder="Record observations, calibration details, and line findings..."
                ></textarea>
              </div>

              <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 text-xs text-sky-800 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>
                  The <strong>Isolation Forest</strong> and <strong>Random Forest</strong> AI engines will evaluate these measurements upon submit.
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
                  {submitting ? 'Submitting & Evaluating AI...' : 'Submit Quality Inspection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
