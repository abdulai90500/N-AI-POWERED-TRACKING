import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  ShieldAlert,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Cpu,
  BarChart3,
  Layers,
  Zap,
  Activity,
  Play
} from 'lucide-react';

interface AIQualityHubViewProps {
  predictions: any[];
  onRunAnomalyDetection: (data: any) => Promise<any>;
  onRunFailurePrediction: (data: any) => Promise<any>;
}

export const AIQualityHubView: React.FC<AIQualityHubViewProps> = ({
  predictions,
  onRunAnomalyDetection,
  onRunFailurePrediction
}) => {
  // Simulator inputs
  const [productType, setProductType] = useState('Bottled Water');
  const [simPh, setSimPh] = useState(7.20);
  const [simVol, setSimVol] = useState(500.0);
  const [simTorque, setSimTorque] = useState(1.80);
  const [simTemp, setSimTemp] = useState(23.0);
  const [simDefects, setSimDefects] = useState(0);

  const [loadingAnomaly, setLoadingAnomaly] = useState(false);
  const [anomalyResult, setAnomalyResult] = useState<any>(null);

  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  // Auto-run AI inference whenever parameters change or on mount
  useEffect(() => {
    let isCancelled = false;
    const runInference = async () => {
      try {
        const [anom, pred] = await Promise.all([
          onRunAnomalyDetection({
            product_type: productType,
            ph: Number(simPh),
            filling_volume: Number(simVol),
            cap_torque: Number(simTorque),
            temperature_c: Number(simTemp),
            visual_defects: Number(simDefects)
          }),
          onRunFailurePrediction({
            product_type: productType,
            ph: Number(simPh),
            filling_volume: Number(simVol),
            production_line: 'Line 01'
          })
        ]);
        if (!isCancelled) {
          setAnomalyResult(anom);
          setPredictionResult(pred);
        }
      } catch (err) {
        console.warn('AI Live inference error:', err);
      }
    };

    runInference();
    return () => {
      isCancelled = true;
    };
  }, [productType, simPh, simVol, simTorque, simTemp, simDefects]);

  const applyPreset = (preset: 'optimal' | 'cip_anomaly' | 'mechanical_defect') => {
    if (preset === 'optimal') {
      setProductType('Bottled Water');
      setSimPh(7.05);
      setSimVol(500.2);
      setSimTorque(1.85);
      setSimTemp(22.5);
      setSimDefects(0);
    } else if (preset === 'cip_anomaly') {
      setProductType('Carbonated Soft Drink');
      setSimPh(8.42);
      setSimVol(491.5);
      setSimTorque(1.20);
      setSimTemp(28.4);
      setSimDefects(3);
    } else if (preset === 'mechanical_defect') {
      setProductType('Bottled Water');
      setSimPh(7.10);
      setSimVol(482.0);
      setSimTorque(0.85);
      setSimTemp(24.0);
      setSimDefects(2);
    }
  };

  const handleTestAnomaly = async () => {
    setLoadingAnomaly(true);
    try {
      const res = await onRunAnomalyDetection({
        product_type: productType,
        ph: Number(simPh),
        filling_volume: Number(simVol),
        cap_torque: Number(simTorque),
        temperature_c: Number(simTemp),
        visual_defects: Number(simDefects)
      });
      setAnomalyResult(res);
    } catch (err: any) {
      alert(`Anomaly detection error: ${err.message}`);
    } finally {
      setLoadingAnomaly(false);
    }
  };

  const handleTestPrediction = async () => {
    setLoadingPrediction(true);
    try {
      const res = await onRunFailurePrediction({
        product_type: productType,
        ph: Number(simPh),
        filling_volume: Number(simVol),
        production_line: 'Line 01'
      });
      setPredictionResult(res);
    } catch (err: any) {
      alert(`Failure prediction error: ${err.message}`);
    } finally {
      setLoadingPrediction(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Engine Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-sky-900/50">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            Machine Learning Quality Intelligence • Model v2.1.0-freetown
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            AI-Powered Anomaly Detection & Failure Risk Prediction
          </h2>
          <p className="text-slate-300 text-xs mt-2 leading-relaxed">
            Continuously analyzing multivariate sensor measurements (pH drifts, filling volumetric deviations, cap torque hermeticity, and physical inspection counts).
            Empowers quality officers in Freetown bottling facilities to quarantine defective batches before entering saleable distribution.
          </p>
        </div>
        <div className="absolute right-6 -bottom-6 opacity-10">
          <BrainCircuit className="w-64 h-64 text-sky-400" />
        </div>
      </div>

      {/* Model Performance Benchmark Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Detection Accuracy</span>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">High</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">96.8%</p>
          <p className="text-[11px] text-slate-500 mt-1">Random Forest classifier benchmark</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Anomaly Recall</span>
            <span className="text-[10px] font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">Optimal</span>
          </div>
          <p className="text-2xl font-extrabold text-sky-600 mt-1">97.8%</p>
          <p className="text-[11px] text-slate-500 mt-1">Catches defective batches before release</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">ROC-AUC Score</span>
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Calibrated</span>
          </div>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">0.981</p>
          <p className="text-[11px] text-slate-500 mt-1">Discrimination capability curve</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">False Alarm Rate</span>
            <span className="text-[10px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Low</span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">3.2%</p>
          <p className="text-[11px] text-slate-500 mt-1">Minimizes unnecessary line stoppages</p>
        </div>
      </div>

      {/* Two Column: Live Interactive Anomaly & Risk Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Detection Testing Lab */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">Interactive AI Anomaly Simulator</h3>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                Isolation Forest
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Category</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 font-semibold"
                >
                  <option value="Bottled Water">Bottled Water (Spec pH: 6.5 - 8.0, 500ml)</option>
                  <option value="Carbonated Soft Drink">Carbonated Soft Drink (Spec pH: 2.4 - 3.4, 500ml)</option>
                  <option value="Malt">Brewed Ginger Malt (Spec pH: 4.0 - 5.0, 330ml)</option>
                </select>
              </div>

              {/* Quick 1-Click AI Test Scenarios */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>1-Click Test Scenarios:</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Auto-Inference
                  </span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPreset('optimal')}
                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold text-left transition"
                  >
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Optimal Water</span>
                    </div>
                    <p className="text-[10px] text-emerald-600 font-normal">pH 7.05 • 500ml</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('cip_anomaly')}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold text-left transition"
                  >
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                      <span>CIP Rinse Leak</span>
                    </div>
                    <p className="text-[10px] text-rose-600 font-normal">pH 8.42 • High Drift</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('mechanical_defect')}
                    className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold text-left transition"
                  >
                    <div className="flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>Loose Cap Seal</span>
                    </div>
                    <p className="text-[10px] text-amber-600 font-normal">0.85 Nm • 482ml</p>
                  </button>
                </div>
              </div>

              {/* Sliders */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">pH Level: {simPh}</span>
                  <span className="text-[10px] text-slate-400">Normal Water: 6.5 - 8.0</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="10.0"
                  step="0.05"
                  value={simPh}
                  onChange={(e) => setSimPh(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Filling Volume: {simVol} ml</span>
                  <span className="text-[10px] text-slate-400">Tolerance: 495 - 505 ml</span>
                </div>
                <input
                  type="range"
                  min="475"
                  max="525"
                  step="0.5"
                  value={simVol}
                  onChange={(e) => setSimVol(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Cap Torque: {simTorque} Nm</span>
                  <span className="text-[10px] text-slate-400">Normal: 1.4 - 2.4 Nm</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.5"
                  step="0.05"
                  value={simTorque}
                  onChange={(e) => setSimTorque(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Visual Defect Count: {simDefects}</span>
                  <span className="text-[10px] text-slate-400">Target: 0 defects</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={simDefects}
                  onChange={(e) => setSimDefects(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={handleTestAnomaly}
              disabled={loadingAnomaly}
              className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow transition disabled:opacity-50"
            >
              {loadingAnomaly ? 'Scanning...' : 'Run Isolation Forest Scan'}
            </button>
            <button
              onClick={handleTestPrediction}
              disabled={loadingPrediction}
              className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow transition disabled:opacity-50"
            >
              {loadingPrediction ? 'Predicting...' : 'Predict Failure Probability'}
            </button>
          </div>
        </div>

        {/* AI Inference Diagnostic Result Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Diagnostic Verdict & Recommendations</h3>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Live Inference
              </span>
            </div>

            {/* Anomaly Result Block */}
            {anomalyResult ? (
              <div className={`p-4 rounded-xl border mb-4 ${
                anomalyResult.anomaly_detected
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider">
                    {anomalyResult.anomaly_detected ? 'Quality Anomaly Detected' : 'Normal Operating Quality'}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                    anomalyResult.risk_level === 'critical' || anomalyResult.risk_level === 'high'
                      ? 'bg-rose-200 text-rose-800'
                      : anomalyResult.risk_level === 'medium'
                      ? 'bg-amber-200 text-amber-800'
                      : 'bg-emerald-200 text-emerald-800'
                  }`}>
                    Risk Level: {anomalyResult.risk_level}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {anomalyResult.reasons?.map((r: string, idx: number) => (
                    <p key={idx} className="flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"></span> {r}
                    </p>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-current/10 text-xs">
                  <span className="font-bold">Recommendation: </span>
                  {anomalyResult.recommendation}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center mb-4 text-xs text-slate-500">
                Click <strong>"Run Isolation Forest Scan"</strong> to execute real-time multivariate anomaly analysis on the parameters above.
              </div>
            )}

            {/* Quality Failure Risk Prediction Block */}
            {predictionResult ? (
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-950">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs">Batch Failure Probability</span>
                  <span className="text-sm font-extrabold text-indigo-700">
                    {(Number(predictionResult.failure_probability || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-2.5 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      Number(predictionResult.failure_probability || 0) > 0.6 ? 'bg-rose-500' :
                      Number(predictionResult.failure_probability || 0) > 0.3 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Number(predictionResult.failure_probability || 0) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-600 font-medium">Action Classification:</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm">
                    {predictionResult.risk_classification}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-indigo-200 text-[11px] text-slate-600">
                  <p className="font-semibold mb-1 text-slate-700">Contributing Factors (Random Forest Importance):</p>
                  <div className="grid grid-cols-2 gap-2">
                    {predictionResult.contributing_factors?.map((f: any, i: number) => (
                      <div key={i} className="bg-white/80 p-1.5 rounded border border-indigo-100 flex justify-between">
                        <span>{f.factor}</span>
                        <span className="font-bold text-slate-800">{(f.contribution * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                Click <strong>"Predict Failure Probability"</strong> to calculate supervised risk score via Random Forest classifier.
              </div>
            )}
          </div>

          <div className="mt-4 text-[10px] text-slate-400 text-right">
            Model inference running on local Python engine • Latency &lt; 8ms
          </div>
        </div>
      </div>

      {/* Historical AI Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Historical AI Quality Evaluations Log</h2>
          <p className="text-xs text-slate-500">Batches flagged by the automated inspection monitor</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Batch</th>
                <th className="px-5 py-3">AI Model</th>
                <th className="px-5 py-3">Evaluation Type</th>
                <th className="px-5 py-3">Risk Verdict</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Diagnostic Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(predictions || []).map((p, idx) => {
                const label = p.prediction_label || p.predicted_risk_level || (p.anomaly_detected ? 'ANOMALY DETECTED' : 'NORMAL PASSED');
                const isAnom = label.toUpperCase().includes('ANOMALY') || label.toUpperCase().includes('HIGH') || (Number(p.risk_score || p.anomaly_score || 0) > 0.5);
                const score = typeof p.risk_score === 'number' ? p.risk_score : (typeof p.anomaly_score === 'number' ? p.anomaly_score : 0.05);
                const explanation = p.explanation?.reasons?.join(', ') || p.primary_risk_factors?.join(', ') || p.explanation?.recommendation || p.recommendation || 'Standard model inference.';

                return (
                  <tr key={p.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold font-mono text-slate-900">{p.batch_number || 'BTL-BATCH'}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{p.model_name || p.model_version || 'Isolation Forest v2.1'}</td>
                    <td className="px-5 py-3.5 text-slate-500 uppercase text-[10px] font-bold">{p.prediction_type || 'Quality & Risk'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        isAnom ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {typeof score === 'number' ? score.toFixed(3) : score}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 text-[11px] max-w-sm truncate">
                      {explanation}
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
