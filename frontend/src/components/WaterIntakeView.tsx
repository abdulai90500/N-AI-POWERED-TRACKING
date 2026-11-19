import React, { useState } from 'react';
import { WaterLot } from '../services/mockData';
import {
  Droplets,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Waves,
  FlaskConical,
  Gauge,
  Factory,
  Search,
  Check,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface WaterIntakeViewProps {
  waterLots: WaterLot[];
  productionLines: any[];
  onCreateWaterLot: (lotData: any) => Promise<void>;
  onSendToProduction: (lotId: string, data: any) => Promise<any>;
  onNavigateToProduction: () => void;
}

export const WaterIntakeView: React.FC<WaterIntakeViewProps> = ({
  waterLots,
  productionLines,
  onCreateWaterLot,
  onSendToProduction,
  onNavigateToProduction,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLotForTransfer, setSelectedLotForTransfer] = useState<WaterLot | null>(null);
  const [targetLine, setTargetLine] = useState(productionLines[0]?.name || 'Line 1 - High-Speed Bottling (PET)');
  const [plannedBottleQty, setPlannedBottleQty] = useState<number>(25000);
  const [submitting, setSubmitting] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State for New Water Lot
  const [sourceType, setSourceType] = useState<'borehole_1' | 'borehole_2' | 'guma_reservoir'>('borehole_1');
  const [volumeLiters, setVolumeLiters] = useState<number>(50000);
  const [tdsPpm, setTdsPpm] = useState<number>(115);
  const [phLevel, setPhLevel] = useState<number>(7.15);
  const [turbidityNtu, setTurbidityNtu] = useState<number>(0.12);
  const [conductivityUs, setConductivityUs] = useState<number>(180);
  const [engineerName, setEngineerName] = useState('Samuel Kamara (Lead Water Treatment Engineer)');
  const [notes, setNotes] = useState('Aquifer extraction normal. Pre-filtration sand bed backwashed and RO membranes sterilized.');

  const getSourceName = (type: string) => {
    switch (type) {
      case 'borehole_1': return 'Borehole Aquifer 1 (Kissy Deep Artesian Well)';
      case 'borehole_2': return 'Borehole Aquifer 2 (Wellington Industrial Zone)';
      case 'guma_reservoir': return 'Guma Valley Municipal Intake (Kongo Dam Feed)';
      default: return 'Deep Well Aquifer';
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreateWaterLot({
        source_name: getSourceName(sourceType),
        source_type: sourceType,
        volume_liters: volumeLiters,
        tds_ppm: tdsPpm,
        ph_level: phLevel,
        turbidity_ntu: turbidityNtu,
        conductivity_us: conductivityUs,
        treatment_status: 'lab_approved',
        ro_stage: 'RO Membrane 3-Pass + UV Sanitized',
        engineer_name: engineerName,
        notes: notes
      });
      setIsModalOpen(false);
    } catch (err: any) {
      alert(`Error registering water lot: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmTransfer = async () => {
    if (!selectedLotForTransfer) return;
    setTransferring(true);
    try {
      const res = await onSendToProduction(selectedLotForTransfer.id, {
        production_line_name: targetLine,
        planned_quantity: plannedBottleQty,
      });
      setTransferSuccess(res?.message || `Water Lot ${selectedLotForTransfer.lot_number} transferred to production!`);
      setSelectedLotForTransfer(null);
    } catch (err: any) {
      alert(`Transfer failed: ${err.message}`);
    } finally {
      setTransferring(false);
    }
  };

  const totalWaterIntake = waterLots.reduce((acc, w) => acc + (Number(w.volume_liters) || 0), 0);
  const readyLotsCount = waterLots.filter(w => w.treatment_status === 'lab_approved').length;
  const inProductionCount = waterLots.filter(w => w.treatment_status === 'transferred_to_production').length;

  const filteredLots = waterLots.filter(w =>
    String(w.lot_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(w.source_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(w.engineer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-sky-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Droplets className="w-64 h-64 text-sky-400" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold mb-3">
            <Waves className="w-3.5 h-3.5" />
            Stage 1: Raw Water Sourcing, Reverse Osmosis (RO) & Bottling Line Handover
          </div>
          <h2 className="text-2xl font-black tracking-tight">Water Intake & Purification Plant</h2>
          <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
            Every production batch starts with pure aquifer water. Register borehole water intake lots, monitor 
            multi-stage Reverse Osmosis (RO) filtration, verify Sierra Leone Standards Bureau (SLSB CS-022) purity, 
            and transfer cleared water directly to High-Speed Bottling Lines.
          </p>
        </div>
      </div>

      {/* Transfer Success Notification Alert */}
      {transferSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-900 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-extrabold">{transferSuccess}</p>
              <p className="text-[11px] text-emerald-700">The bottling line has received this batch. You can track filling and capping live.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToProduction}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <span>View Production Floor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTransferSuccess(null)}
              className="text-slate-400 hover:text-slate-600 font-bold text-sm px-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Water Intake</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalWaterIntake.toLocaleString()} <span className="text-xs font-normal text-slate-500">Liters</span></p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Deep Artesian & Municipal Flow</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Ready for Bottling</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{readyLotsCount} <span className="text-xs font-normal text-slate-500">Lots Cleared</span></p>
          <p className="text-[11px] text-slate-500 mt-1">Lab tested & ready to dispatch</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">In Bottling Lines</span>
            <Factory className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-indigo-600">{inProductionCount} <span className="text-xs font-normal text-slate-500">Lots Active</span></p>
          <p className="text-[11px] text-slate-500 mt-1">Supplying High-Speed Line 1 & 2</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Purification Benchmark</span>
            <ShieldCheck className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">110 <span className="text-xs font-normal text-slate-500">ppm TDS</span></p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">SLSB CS-022 Standard (&lt;150 ppm)</p>
        </div>
      </div>

      {/* Silo & Storage Reservoir Gauge Cards */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-sky-600" />
          Active Water Storage Silos & RO Reservoir Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-xs text-slate-800">Silo A: Raw Well Intake</span>
              <span className="text-[11px] font-mono font-bold text-sky-700">78,000 / 100,000 L</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: '78%' }}></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500 font-medium">
              <span>Source: Kissy Deep Aquifer</span>
              <span>Raw TDS: 240 ppm</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-xs text-slate-800">Reservoir B: Sterile RO Permeate</span>
              <span className="text-[11px] font-mono font-bold text-emerald-700">73,600 / 80,000 L</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500 font-medium">
              <span>RO 3-Pass + UV Disinfection</span>
              <span>Pure TDS: 110 ppm</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-xs text-slate-800">Balance Tank C: Mineralized Water</span>
              <span className="text-[11px] font-mono font-bold text-indigo-700">34,000 / 40,000 L</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500 font-medium">
              <span>Food-Grade Ca &amp; Mg Infused</span>
              <span>pH Level: 7.15</span>
            </div>
          </div>
        </div>
      </div>

      {/* Water Lots Control Panel & Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Water Intake Batches & Filtration Cycles</h3>
            <p className="text-xs text-slate-500 mt-0.5">Track origin, Reverse Osmosis metrics, and send cleared water lots directly to production lines.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search lot, source, engineer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-56"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Intake New Water Lot</span>
            </button>
          </div>
        </div>

        {/* Table of Water Lots */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Water Lot ID</th>
                <th className="px-5 py-3.5">Source &amp; Extraction</th>
                <th className="px-5 py-3.5">Volume (L)</th>
                <th className="px-5 py-3.5">Purification Stage</th>
                <th className="px-5 py-3.5">Lab Metrics (SLSB)</th>
                <th className="px-5 py-3.5">Treatment Status</th>
                <th className="px-5 py-3.5 text-right">Action / Handover</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLots.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No water intake lots found. Click "Intake New Water Lot" above to start the factory cycle.
                  </td>
                </tr>
              ) : (
                filteredLots.map((lot) => {
                  const isTransferred = lot.treatment_status === 'transferred_to_production';
                  const isReady = lot.treatment_status === 'lab_approved';

                  return (
                    <tr key={lot.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3.5">
                        <span className="font-bold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {lot.lot_number}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {lot.intake_timestamp ? new Date(lot.intake_timestamp).toLocaleDateString() : '2026-11-18'}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-800">{lot.source_name}</p>
                        <p className="text-[10px] text-slate-400">Operator: {lot.engineer_name}</p>
                      </td>
                      <td className="px-5 py-3.5 font-bold font-mono text-slate-900">
                        {Number(lot.volume_liters).toLocaleString()} L
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <FlaskConical className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                          <span>{lot.ro_stage}</span>
                        </div>
                        {lot.notes && (
                          <p className="text-[10px] text-slate-400 truncate max-w-xs">{lot.notes}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-100 text-[10px] font-bold">
                            pH: {lot.ph_level}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold">
                            TDS: {lot.tds_ppm} ppm
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                            {lot.turbidity_ntu} NTU
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {isTransferred ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                            <Factory className="w-3 h-3 text-indigo-600" />
                            In Bottling Line
                          </span>
                        ) : isReady ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Cleared for Production
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 text-amber-600" />
                            RO Purifying
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isTransferred ? (
                          <div className="inline-flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                            <span className="text-[11px] text-slate-400">{lot.assigned_production_line || 'Line 1'}</span>
                            <button
                              onClick={onNavigateToProduction}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[11px] transition"
                            >
                              View Batch
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedLotForTransfer(lot);
                              setPlannedBottleQty(Math.floor((Number(lot.volume_liters) || 50000) * 1.95));
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition inline-flex items-center gap-1.5"
                          >
                            <Factory className="w-3.5 h-3.5" />
                            <span>Send to Production</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Intake New Raw Water Batch */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-sky-600" />
                  Intake New Raw Water Batch
                </h3>
                <p className="text-xs text-slate-500">Step 1: Raw Aquifer Water Extraction &amp; Reverse Osmosis Setup</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Water Sourcing Origin</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as any)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-semibold focus:ring-2 focus:ring-sky-500"
                >
                  <option value="borehole_1">Borehole Aquifer 1 (Kissy Deep Artesian Well)</option>
                  <option value="borehole_2">Borehole Aquifer 2 (Wellington Industrial Zone)</option>
                  <option value="guma_reservoir">Guma Valley Municipal Intake (Kongo Dam Feed)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Volume Intake (Liters)</label>
                  <input
                    type="number"
                    value={volumeLiters}
                    onChange={(e) => setVolumeLiters(Number(e.target.value))}
                    min={1000}
                    max={250000}
                    step={1000}
                    required
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Responsible Engineer</label>
                  <input
                    type="text"
                    value={engineerName}
                    onChange={(e) => setEngineerName(e.target.value)}
                    required
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Lab Benchmarks */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[11px] font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-sky-600" />
                  Pre-Treatment Sensor &amp; Laboratory Metrics (SLSB CS-022)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">pH Level</label>
                    <input
                      type="number"
                      step="0.05"
                      value={phLevel}
                      onChange={(e) => setPhLevel(Number(e.target.value))}
                      className="w-full text-xs border border-slate-300 rounded p-1.5 font-bold font-mono"
                    />
                    <span className="text-[9px] text-slate-400">Target: 6.5 - 8.0</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">TDS (ppm)</label>
                    <input
                      type="number"
                      value={tdsPpm}
                      onChange={(e) => setTdsPpm(Number(e.target.value))}
                      className="w-full text-xs border border-slate-300 rounded p-1.5 font-bold font-mono"
                    />
                    <span className="text-[9px] text-slate-400">Target: &lt;150 ppm</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500">Turbidity (NTU)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={turbidityNtu}
                      onChange={(e) => setTurbidityNtu(Number(e.target.value))}
                      className="w-full text-xs border border-slate-300 rounded p-1.5 font-bold font-mono"
                    />
                    <span className="text-[9px] text-slate-400">Target: &lt;0.5 NTU</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Filtration &amp; Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500"
                />
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
                  {submitting ? 'Registering...' : 'Register Water Intake Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Send Water Lot to Production Line */}
      {selectedLotForTransfer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Factory className="w-5 h-5 text-indigo-600" />
                  Release Water to Bottling Line
                </h3>
                <p className="text-xs text-slate-500">Handover water lot to active bottling line</p>
              </div>
              <button
                onClick={() => setSelectedLotForTransfer(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900 space-y-1">
                <p className="font-bold">Water Lot: <span className="font-mono text-sky-700">{selectedLotForTransfer.lot_number}</span></p>
                <p className="text-[11px]">Source: {selectedLotForTransfer.source_name}</p>
                <p className="text-[11px]">Volume: {Number(selectedLotForTransfer.volume_liters).toLocaleString()} L (RO Filtered)</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Production Bottling Line</label>
                <select
                  value={targetLine}
                  onChange={(e) => setTargetLine(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 font-semibold focus:ring-2 focus:ring-indigo-500"
                >
                  {productionLines.map((l: any) => (
                    <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Planned Bottle Output (Quantity)</label>
                <input
                  type="number"
                  value={plannedBottleQty}
                  onChange={(e) => setPlannedBottleQty(Number(e.target.value))}
                  min={1000}
                  step={500}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono font-bold focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Calculated based on 500ml volumetric fill and 1.95 ratio.</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  This action will release the sterile water supply and automatically initiate a new production batch linked directly to this water lot's chemical fingerprint.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedLotForTransfer(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmTransfer}
                  disabled={transferring}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {transferring ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Releasing to Line...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Authorize &amp; Send to Production</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
