import React from 'react';
import { User, api } from '../services/api';
import { Bell, ShieldCheck, Factory, LogOut, ChevronDown, Radio } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onRoleSwitch: (role: string) => void;
  onLogout: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onRoleSwitch, onLogout, activeTab }) => {
  const roles = [
    'Company Administrator',
    'Production Manager',
    'Quality Control Officer',
    'Warehouse Manager',
    'Distribution Officer',
    'Super Administrator'
  ];

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Management Dashboard';
      case 'production': return 'Production & Batch Management';
      case 'quality': return 'Quality Assurance & Inspection';
      case 'ai': return 'AI Quality & Anomaly Intelligence Hub';
      case 'inventory': return 'Warehouse & Inventory Control';
      case 'distribution': return 'Distribution, Fleet & Order Fulfillment';
      case 'tracking': return 'QR Code Batch Traceability System';
      case 'public-track': return 'Public Bottle Verification Portal';
      case 'reports': return 'Compliance, Audit Logs & Analytics';
      default: return 'Overview';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{getTitle()}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Freetown Operations • Sierra Springs & Beverages Ltd • Multi-Tenant
            </p>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              api.isLiveBackend
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-sky-50 text-sky-700 border-sky-200'
            }`}>
              <Radio className="w-2.5 h-2.5" />
              {api.isLiveBackend ? 'Live PostgreSQL Backend' : 'Interactive Cloud Demo'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Role Switcher for quick demo/examination */}
        <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
          <span className="text-xs text-slate-500 px-2 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            Switch Role:
          </span>
          <select
            value={currentUser?.role || 'Company Administrator'}
            onChange={(e) => onRoleSwitch(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs shadow">
            {currentUser?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser?.full_name || 'Staff'}</p>
            <p className="text-[10px] text-brand-600 font-semibold">{currentUser?.role || 'User'}</p>
          </div>
        </div>

        {/* Highly Visible Sign Out / Return to Login Button */}
        <button
          onClick={onLogout}
          className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          title="Sign out of current account and return to login screen"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
