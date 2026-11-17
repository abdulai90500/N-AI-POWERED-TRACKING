import React, { useState } from 'react';
import {
  X,
  KeyRound,
  ShieldCheck,
  Copy,
  Check,
  UserCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DEMO_USERS } from '../services/mockData';

interface CredentialsDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser?: (email: string) => void;
}

export const CredentialsDirectoryModal: React.FC<CredentialsDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
}) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  if (!isOpen) return null;

  const usersList = [
    {
      name: 'Mariama Sesay',
      role: 'Company Administrator',
      email: 'admin@sierrasprings.sl',
      password: 'Password123!',
      badge: 'STAFF-ADMIN-001',
      desc: 'Full factory governance, staff roster, batch release/abort, SLSB compliance',
      tag: 'Admin & Operations'
    },
    {
      name: 'Fatmata Bangura',
      role: 'Quality Control Officer',
      email: 'quality@sierrasprings.sl',
      password: 'Password123!',
      badge: 'STAFF-QC-002',
      desc: 'Conducts laboratory tests, records pH/torque/volume, triggers AI copilot',
      tag: 'Laboratory & QC'
    },
    {
      name: 'Ibrahim Kamara',
      role: 'Production Manager',
      email: 'production@sierrasprings.sl',
      password: 'Password123!',
      badge: 'STAFF-PROD-003',
      desc: 'Oversees Line 1 & Line 2 bottling, preform blow molding, registers batches',
      tag: 'Factory Floor'
    },
    {
      name: 'Mohamed Turay',
      role: 'Warehouse Manager',
      email: 'warehouse@sierrasprings.sl',
      password: 'Password123!',
      badge: 'STAFF-WH-004',
      desc: 'Controls Kissy Central Depot and Lumley hub inventory receipts & dispatch',
      tag: 'Depot & Storage'
    },
    {
      name: 'Alhaji Conteh',
      role: 'Distribution Officer',
      email: 'distribution@sierrasprings.sl',
      password: 'Password123!',
      badge: 'STAFF-DIST-005',
      desc: 'Fleet driver logistics, wholesale delivery verification across Freetown & provinces',
      tag: 'Fleet & Logistics'
    },
    {
      name: 'Dr. Alpha Bah',
      role: 'Super Administrator',
      email: 'superadmin@beveragetrack.sl',
      password: 'Password123!',
      badge: 'STAFF-GLOBAL-000',
      desc: 'Multi-tenant authority, database audits, national SLSB oversight',
      tag: 'Global Authority'
    }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">System Staff Credentials Directory</h3>
              <p className="text-xs text-sky-300">All registered test accounts for BeverageTrack AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Password Notice Banner */}
        <div className="bg-sky-50 border-b border-sky-100 px-5 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-sky-900">
            <span className="font-bold">Universal Demo Password:</span>
            <code className="font-mono bg-white px-2 py-0.5 rounded border border-sky-200 font-extrabold text-sky-700">
              Password123!
            </code>
          </div>
          <button
            onClick={() => handleCopy('Password123!')}
            className="text-[11px] font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
          >
            {copiedEmail === 'Password123!' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEmail === 'Password123!' ? 'Copied' : 'Copy Password'}</span>
          </button>
        </div>

        {/* Staff Roster Cards */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {usersList.map((user) => (
            <div
              key={user.email}
              className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 bg-slate-50/60 hover:bg-white transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-sky-700">
                      {user.name}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                      {user.role}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                      {user.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{user.desc}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs font-mono font-semibold text-slate-700">
                    <span className="text-slate-400">Email:</span>
                    <span>{user.email}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(user.email)}
                      className="text-slate-400 hover:text-sky-600 transition"
                      title="Copy email"
                    >
                      {copiedEmail === user.email ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {onSelectUser && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectUser(user.email);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm flex-shrink-0"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Login As</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 font-medium">
            Kissy Bottling Operations • Freetown, Sierra Leone
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
