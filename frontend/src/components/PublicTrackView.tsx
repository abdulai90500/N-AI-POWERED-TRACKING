import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Building,
  Calendar,
  Sparkles,
  ArrowLeft,
  Smartphone
} from 'lucide-react';
import { api } from '../services/api';

interface PublicTrackViewProps {
  initialToken?: string;
  onBackToDashboard: () => void;
}

export const PublicTrackView: React.FC<PublicTrackViewProps> = ({ initialToken, onBackToDashboard }) => {
  const [token, setToken] = useState(initialToken || '');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicData = async (tok: string) => {
    if (!tok) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPublicTracking(tok);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Product batch verification could not be resolved.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialToken) {
      fetchPublicData(initialToken);
    }
  }, [initialToken]);

  return (
    <div className="max-w-md mx-auto my-4 space-y-4">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Internal App
        </button>
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
          <Smartphone className="w-3.5 h-3.5 text-sky-600" /> Consumer Mobile Scan
        </div>
      </div>

      {/* Verification Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-sky-600 to-brand-800 text-white p-6 text-center relative">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center border border-white/20 mb-3 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-black tracking-tight">Beverage Product Authenticity</h2>
          <p className="text-xs text-sky-200 mt-0.5">Republic of Sierra Leone National Food Safety Registry</p>
        </div>

        {/* Input Bar for Testing */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex gap-2">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter or scan QR token..."
            className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 font-mono font-bold focus:ring-2 focus:ring-sky-500"
          />
          <button
            onClick={() => fetchPublicData(token)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition"
          >
            Verify
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {loading && (
            <div className="py-8 text-center text-xs text-slate-500 font-bold">
              Verifying cryptographic bottle batch token...
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Verification Unsuccessful
              </div>
              <p>{error}</p>
            </div>
          )}

          {data && (
            <div className="space-y-4">
              {/* Authenticity Certificate Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-900">Certified Authentic Product</h4>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    {data.verification_message}
                  </p>
                </div>
              </div>

              {/* Product Specifications */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Product Name</span>
                  <span className="font-extrabold text-slate-900 text-right">{data.product_name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Beverage Type</span>
                  <span className="font-bold text-slate-800">{data.product_category} ({data.volume_ml}ml)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Batch Number</span>
                  <span className="font-mono font-extrabold text-sky-700">{data.batch_number}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Licensed Bottler</span>
                  <span className="font-bold text-slate-800">{data.company_name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Production Date</span>
                  <span className="font-semibold text-slate-800">{data.production_date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Best Before</span>
                  <span className="font-semibold text-slate-800">{data.expiry_date || 'Standard +1yr'}</span>
                </div>
              </div>

              {/* Public Safety Assurance */}
              <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-[11px] text-sky-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>
                  Quality status: <strong>{data.quality_status}</strong>. Inspected in accordance with Sierra Leone Standards Bureau specifications.
                </span>
              </div>
            </div>
          )}

          {!loading && !data && !error && (
            <div className="py-6 text-center text-xs text-slate-400">
              Scan or enter a product batch token to verify its authenticity.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 text-center text-[10px] text-slate-500">
          Powered by BeverageTrack AI • Kissy Industrial Zone, Freetown, Sierra Leone
        </div>
      </div>
    </div>
  );
};
