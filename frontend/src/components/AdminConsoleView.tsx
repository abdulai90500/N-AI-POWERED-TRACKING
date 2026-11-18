import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  UserPlus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  StopCircle,
  Edit,
  Search,
  KeyRound,
  FileCheck,
  Lock,
  Mail,
  UserCheck,
  Building,
  RefreshCw,
  Plus
} from 'lucide-react';
import { User, api } from '../services/api';

interface AdminConsoleViewProps {
  currentUser: User | null;
  batches: any[];
  onAbortBatch: (batchId: string, reason: string) => void;
  onReleaseBatch: (batchId: string) => void;
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  currentUser,
  batches,
  onAbortBatch,
  onReleaseBatch,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'cases' | 'audit'>('users');

  // Staff User Management State
  const [usersList, setUsersList] = useState<any[]>([
    {
      id: 'user-001',
      badge_id: 'STAFF-ADMIN-001',
      full_name: 'Mariama Sesay',
      email: 'admin@sierrasprings.sl',
      role: 'Company Administrator',
      department: 'Executive Management',
      status: 'active',
      created_at: '2026-01-10'
    },
    {
      id: 'user-002',
      badge_id: 'STAFF-QC-002',
      full_name: 'Fatmata Bangura',
      email: 'quality@sierrasprings.sl',
      role: 'Quality Control Officer',
      department: 'Laboratory & QC',
      status: 'active',
      created_at: '2026-01-15'
    },
    {
      id: 'user-003',
      badge_id: 'STAFF-PROD-003',
      full_name: 'Ibrahim Kamara',
      email: 'production@sierrasprings.sl',
      role: 'Production Manager',
      department: 'Plant Operations',
      status: 'active',
      created_at: '2026-02-01'
    },
    {
      id: 'user-004',
      badge_id: 'STAFF-WH-004',
      full_name: 'Mohamed Turay',
      email: 'warehouse@sierrasprings.sl',
      role: 'Warehouse Manager',
      department: 'Logistics & Storage',
      status: 'active',
      created_at: '2026-02-12'
    },
    {
      id: 'user-005',
      badge_id: 'STAFF-DIST-005',
      full_name: 'Alhaji Conteh',
      email: 'distribution@sierrasprings.sl',
      role: 'Distribution Officer',
      department: 'Fleet & Dispatch',
      status: 'active',
      created_at: '2026-02-20'
    },
  ]);

  // Add User Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('Password123!');
  const [newUserRole, setNewUserRole] = useState('Quality Control Officer');
  const [newUserDepartment, setNewUserDepartment] = useState('Laboratory & QC');
  const [userSuccessMessage, setUserSuccessMessage] = useState<string | null>(null);

  // Quality Cases & Incident Monitor State
  const [casesList, setCasesList] = useState<any[]>([
    {
      id: 'CASE-2026-003',
      batch_id: 'batch-003',
      batch_number: 'BTL-2026-003',
      product_name: 'Salone Cola 500ml',
      issue_title: 'CIP Alkaline Rinse Chemical Drift',
      reported_by: 'AI Isolation Forest & Fatmata Bangura',
      severity: 'CRITICAL',
      status: 'QUARANTINED',
      details: 'pH shifted to 8.42 (spec limit max 3.40). Line 1 manifold held for titration.',
      timestamp: '2026-11-16 15:20'
    },
    {
      id: 'CASE-2026-007',
      batch_id: 'batch-004',
      batch_number: 'BTL-2026-004',
      product_name: 'Sierra Pure Water 500ml',
      issue_title: 'Volumetric Underfill Variance',
      reported_by: 'High-Speed Inspection Line 1',
      severity: 'MEDIUM',
      status: 'UNDER_REVIEW',
      details: '28 bottles recorded at 484ml during high-speed manifold pressure dip.',
      timestamp: '2026-11-17 09:45'
    },
    {
      id: 'CASE-2026-008',
      batch_id: 'batch-002',
      batch_number: 'BTL-2026-002',
      product_name: 'Lion Ginger Malt 330ml',
      issue_title: 'Crown Cork Capper Tension Calibration',
      reported_by: 'Preventative Maintenance AI',
      severity: 'LOW',
      status: 'RESOLVED',
      details: 'Torque calibrated to 21.5 in-lb. Zero hermeticity defects detected.',
      timestamp: '2026-11-15 11:30'
    }
  ]);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState<any[]>([
    {
      id: 'AUDIT-101',
      action: 'BATCH_QUARANTINED',
      target: 'Batch BTL-2026-003',
      performed_by: 'Mariama Sesay (Administrator)',
      details: 'Quarantine confirmed following AI high-risk anomaly alert.',
      timestamp: '2026-11-16 15:25'
    },
    {
      id: 'AUDIT-100',
      action: 'SYSTEM_LOGIN_VERIFIED',
      target: 'Staff Credentials STAFF-ADMIN-001',
      performed_by: 'System Auth Provider',
      details: 'Single sign-on session token generated for Kissy facility workspace.',
      timestamp: '2026-11-17 08:00'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Handle Add New User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: `user-${Date.now()}`,
      badge_id: `STAFF-${newUserRole.includes('Admin') ? 'ADMIN' : newUserRole.includes('Quality') ? 'QC' : newUserRole.includes('Prod') ? 'PROD' : 'WH'}-${Math.floor(100 + Math.random() * 900)}`,
      full_name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDepartment,
      status: 'active',
      created_at: new Date().toISOString().split('T')[0]
    };

    setUsersList([newUser, ...usersList]);
    setAuditLogs([
      {
        id: `AUDIT-${Date.now().toString().slice(-4)}`,
        action: 'USER_CREATED',
        target: `${newUserName} (${newUserRole})`,
        performed_by: currentUser?.full_name || 'Admin',
        details: `Created new staff login credentials with email ${newUserEmail}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
      },
      ...auditLogs
    ]);

    setUserSuccessMessage(`Staff account for ${newUserName} created successfully!`);
    setTimeout(() => {
      setUserSuccessMessage(null);
      setIsAddUserOpen(false);
      setNewUserName('');
      setNewUserEmail('');
    }, 2000);
  };

  // Handle Delete User
  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to remove staff member "${userName}" from the active system?`)) {
      setUsersList(usersList.filter(u => u.id !== userId));
      setAuditLogs([
        {
          id: `AUDIT-${Date.now().toString().slice(-4)}`,
          action: 'USER_DELETED',
          target: userName,
          performed_by: currentUser?.full_name || 'Admin',
          details: `Removed user account from system access.`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
        },
        ...auditLogs
      ]);
    }
  };

  // Handle Emergency Abort Batch
  const handleEmergencyAbort = (caseItem: any) => {
    const reason = prompt(`Enter reason for emergency aborting batch ${caseItem.batch_number}:`, `Quality failure: ${caseItem.issue_title}`);
    if (reason) {
      onAbortBatch(caseItem.batch_id, reason);
      // Update case status
      setCasesList(casesList.map(c => c.id === caseItem.id ? { ...c, status: 'ABORTED' } : c));
      setAuditLogs([
        {
          id: `AUDIT-${Date.now().toString().slice(-4)}`,
          action: 'EMERGENCY_BATCH_ABORTED',
          target: caseItem.batch_number,
          performed_by: currentUser?.full_name || 'Admin',
          details: `Emergency abort executed. Reason: ${reason}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
        },
        ...auditLogs
      ]);
      alert(`Batch ${caseItem.batch_number} has been ABORTED and RECALLED. Production lines notified.`);
    }
  };

  // Handle Delete / Dismiss Case
  const handleDeleteCase = (caseId: string, caseTitle: string) => {
    if (confirm(`Are you sure you want to delete/dismiss case ${caseId} (${caseTitle})?`)) {
      setCasesList(casesList.filter(c => c.id !== caseId));
      setAuditLogs([
        {
          id: `AUDIT-${Date.now().toString().slice(-4)}`,
          action: 'CASE_DELETED',
          target: caseId,
          performed_by: currentUser?.full_name || 'Admin',
          details: `Case ${caseTitle} dismissed and deleted by administrator.`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
        },
        ...auditLogs
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Admin Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-sky-900/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
              Administrative Governance Center
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
              SLSB Multi-Tenant Active
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Factory Admin & System Controls</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Manage staff credentials, authorize emergency batch aborts, quarantine non-compliant runs, and monitor live quality incidents across Sierra Leone bottling facilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Staff User</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Staff Accounts</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{usersList.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Assigned roles across Kissy facility</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Open Quality Cases</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{casesList.filter(c => c.status !== 'RESOLVED').length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Require inspection or abort review</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Batches Held in Quarantine</span>
          <p className="text-2xl font-black text-amber-600 mt-1">1 Batch</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Batch BTL-2026-003 held</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">SLSB Compliance Lock</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">100% SECURE</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Cryptographic QR audit enabled</p>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 pt-3 shadow-xs gap-6">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeSubTab === 'users'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Users & Credentials ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cases')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeSubTab === 'cases'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Case Monitor & Batch Abort ({casesList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
            activeSubTab === 'audit'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4 text-emerald-500" />
          <span>Security Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: Staff Users & Credentials Management */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Staff Directory & Credentials Roster</h3>
              <p className="text-xs text-slate-500">Add, edit, or revoke user access credentials for factory personnel</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Staff Name & Badge</th>
                  <th className="px-5 py-3.5">Work Email</th>
                  <th className="px-5 py-3.5">Assigned Role</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList
                  .filter(u => String(u?.full_name || '').toLowerCase().includes(String(searchTerm || '').toLowerCase()) || String(u?.email || '').toLowerCase().includes(String(searchTerm || '').toLowerCase()))
                  .map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 font-extrabold text-xs flex items-center justify-center">
                            {user.full_name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{user.full_name}</p>
                            <p className="font-mono text-[10px] font-bold text-sky-600">{user.badge_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-medium text-slate-700">{user.email}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px]">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-medium">{user.department}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.full_name)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Case Monitor & Batch Abort/Delete */}
      {activeSubTab === 'cases' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Quality Incident Monitor & Emergency Actions</h3>
                <p className="text-xs text-slate-500">Review flagged cases, abort compromised batches, or release held inventory</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {casesList.map((item) => (
                <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {item.id}
                      </span>
                      <span className="font-mono text-xs font-bold text-sky-700">
                        {item.batch_number}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        ({item.product_name})
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        item.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                        item.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.severity} SEVERITY
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                        item.status === 'ABORTED' ? 'bg-rose-600 text-white' :
                        item.status === 'QUARANTINED' ? 'bg-rose-100 text-rose-900' :
                        item.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Status: {item.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900">
                      {item.issue_title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.details}
                    </p>

                    <p className="text-[11px] text-slate-400 font-medium">
                      Reported by {item.reported_by} • {item.timestamp}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.status !== 'ABORTED' && (
                      <button
                        onClick={() => handleEmergencyAbort(item)}
                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                        title="Emergency abort batch immediately"
                      >
                        <StopCircle className="w-3.5 h-3.5" />
                        <span>Abort Batch</span>
                      </button>
                    )}

                    {item.status === 'QUARANTINED' && (
                      <button
                        onClick={() => {
                          onReleaseBatch(item.batch_id);
                          setCasesList(casesList.map(c => c.id === item.id ? { ...c, status: 'RESOLVED' } : c));
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Release</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteCase(item.id, item.issue_title)}
                      className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs rounded-xl transition flex items-center gap-1"
                      title="Delete / dismiss case"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Case</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Security & Governance Audit Log */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-sm">System Security & Governance Audit Trail</h3>
            <p className="text-xs text-slate-500">Immutable chronological record of administrator actions and batch lifecycle decisions</p>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">
                      {log.action}
                    </span>
                    <span className="font-extrabold text-xs text-slate-900">
                      {log.target}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{log.details}</p>
                  <p className="text-[10px] text-slate-400">By {log.performed_by}</p>
                </div>
                <span className="text-[11px] font-mono text-slate-500 flex-shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-sky-400" />
                <h3 className="font-extrabold text-base">Add New Staff User</h3>
              </div>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {userSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{userSuccessMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Staff Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Koroma"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Staff Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. samuel@sierrasprings.sl"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-semibold bg-slate-50"
                  >
                    <option value="Company Administrator">Administrator</option>
                    <option value="Quality Control Officer">QC Officer</option>
                    <option value="Production Manager">Production Mgr</option>
                    <option value="Warehouse Manager">Warehouse Mgr</option>
                    <option value="Distribution Officer">Distribution Off</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newUserDepartment}
                    onChange={(e) => setNewUserDepartment(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl font-semibold bg-slate-50"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md transition"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
