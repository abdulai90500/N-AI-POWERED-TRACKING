import React from 'react';
import {
  LayoutDashboard,
  Factory,
  CheckCircle2,
  BrainCircuit,
  Boxes,
  Truck,
  QrCode,
  Smartphone,
  FileText,
  Building2,
  Sparkles,
  LogOut
} from 'lucide-react';
import { User } from '../services/api';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadAlertsCount?: number;
  currentUser?: User | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unreadAlertsCount = 1,
  currentUser,
  onLogout
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'production', label: 'Production', icon: Factory },
    { id: 'quality', label: 'Quality Control', icon: CheckCircle2, badge: unreadAlertsCount > 0 ? 'Alert' : undefined },
    { id: 'ai', label: 'AI Quality Hub', icon: BrainCircuit, highlight: true },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'distribution', label: 'Distribution', icon: Truck },
    { id: 'tracking', label: 'QR Batch Tracking', icon: QrCode },
    { id: 'public-track', label: 'Public Verification', icon: Smartphone },
    { id: 'reports', label: 'Reports & Logs', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-brand-600 flex items-center justify-center text-white shadow-lg shadow-sky-900/40">
          <Factory className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white text-base tracking-tight">BeverageTrack</span>
            <span className="text-[10px] font-bold uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 rounded">AI</span>
          </div>
          <p className="text-[11px] text-slate-400">Bottling Systems • Sierra Leone</p>
        </div>
      </div>

      {/* Tenant Indicator */}
      <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
        <Building2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
        <div className="truncate">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Tenant Workspace</p>
          <p className="text-xs font-bold text-white truncate">Sierra Springs & Bev.</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-900/50'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-rose-500/90 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
              {item.highlight && !item.badge && (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status & Sign Out Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-400 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">AI Engine</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active v2.1
          </span>
        </div>

        {currentUser && (
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{currentUser.full_name}</p>
                <p className="text-[10px] text-sky-400 truncate">{currentUser.role}</p>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full py-2 bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out & Back to Login</span>
              </button>
            )}
          </div>
        )}

        <div className="text-[10px] text-slate-500 pt-1 text-center">
          BeverageTrack AI • Freetown, SL
        </div>
      </div>
    </aside>
  );
};
