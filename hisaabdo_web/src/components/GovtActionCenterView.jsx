import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Unlock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Ban,
  Clock,
  Send,
  Building2,
  BadgeCheck,
  Download,
  Eye,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function GovtActionCenterView({ data, onSelectProject, onGenerateDossier }) {
  const projects = data?.projects || [];
  
  // Officer Login state simulation
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [officerName, setOfficerName] = useState('Dr. S. K. Ramanathan, IAS');
  const [designation, setDesignation] = useState('Director General (Audit & Vigilance)');
  const [department, setDepartment] = useState('Ministry of Statistics & Programme Implementation (MoSPI)');
  const [badgeId, setBadgeId] = useState('MOSPI-AUDIT-2026-094');

  // Audit Action Trail state
  const [auditLog, setAuditLog] = useState([
    {
      id: 'ACT-901',
      workId: 'BR/2024-2025/104',
      mp: 'BABU SINGH KUSHWAHA',
      action: 'Emergency Freeze Ordered',
      timestamp: '2026-09-26 14:32 IST',
      status: 'DISBURSAL_FROZEN',
      notes: '₹19,992 statutory evasion detected. S.D.O. directed to withhold contractor payment.'
    },
    {
      id: 'ACT-900',
      workId: 'UP/2024-2025/892',
      mp: 'SAMBIT PATRA',
      action: 'Show-Cause Inquiry Dispatched',
      timestamp: '2026-09-25 11:15 IST',
      status: 'NOTICE_ISSUED',
      notes: 'Cloned CC Road description repeated across 24 separate sanction sanctions.'
    }
  ]);

  const [selectedCase, setSelectedCase] = useState(null);
  const [actionType, setActionType] = useState('FREEZE');
  const [actionNotes, setActionNotes] = useState('');
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Critical projects requiring government intervention
  const pendingCriticalWorks = projects.filter(p => p.risk_level === 'CRITICAL').slice(0, 15);

  const handleOpenActionModal = (proj, defaultType = 'FREEZE') => {
    setSelectedCase(proj);
    setActionType(defaultType);
    setActionNotes('');
    setDispatchSuccess(false);
    setShowDispatchModal(true);
  };

  const handleExecuteAction = (e) => {
    e.preventDefault();
    if (!selectedCase) return;

    const newEntry = {
      id: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
      workId: selectedCase.work_id,
      mp: selectedCase.mp,
      action: actionType === 'FREEZE' ? 'Emergency Freeze Ordered' :
              actionType === 'INQUIRY' ? 'Show-Cause Inquiry Dispatched' :
              actionType === 'GROUND_INSPECT' ? 'District Collector Ground Inspection Ordered' : 'Certified Compliant',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      status: actionType === 'FREEZE' ? 'DISBURSAL_FROZEN' :
              actionType === 'INQUIRY' ? 'NOTICE_ISSUED' : 'INSPECTION_PENDING',
      notes: actionNotes || `Action executed by ${officerName} (${badgeId}) following AI anomaly triage.`
    };

    setAuditLog([newEntry, ...auditLog]);
    setDispatchSuccess(true);
    setTimeout(() => {
      setShowDispatchModal(false);
      setDispatchSuccess(false);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Officer Credential Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Government Officer Action Center & Vigilance Console
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isAuthenticated ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {isAuthenticated ? <BadgeCheck className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {isAuthenticated ? 'Authenticated Session' : 'Officer Login Required'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Official tribunal for issuing show-cause notices, freezing unauthorized disbursements, and ordering collectorate inspections.
            </p>
          </div>
        </div>

        {/* Login / Auth Button */}
        <div>
          {!isAuthenticated ? (
            <button
              onClick={() => setIsAuthenticated(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Officer Sign-In (Simulate)
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-200 block">{officerName}</span>
                <span className="text-[10px] font-mono text-slate-400 block">{badgeId}</span>
              </div>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Pending Critical Works Queue + Action History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Critical Triage Queue (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">High-Priority Cases</span>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Active Cases Pending Vigilance Determination
              </h3>
            </div>
            <span className="text-xs font-mono font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200">
              {pendingCriticalWorks.length} Critical Works
            </span>
          </div>

          {/* Queue Items */}
          <div className="space-y-3">
            {pendingCriticalWorks.map((proj) => (
              <div
                key={proj.work_id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-red-100 text-red-800">
                      Score {proj.risk_score}/100 • CRITICAL
                    </span>
                    <span className="font-mono text-xs text-slate-500 font-semibold">{proj.work_id}</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900">
                    Disbursed: ₹{proj.disbursed_amount?.toLocaleString('en-IN')}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-xs leading-snug">{proj.description}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    MP: <strong className="text-slate-800">{proj.mp}</strong> • {proj.constituency}, {proj.state} • IDA: {proj.ida}
                  </p>
                </div>

                {/* Primary Anomaly Reason */}
                {proj.risk_flags && proj.risk_flags.length > 0 && (
                  <div className="p-2 rounded-lg bg-red-50/70 border border-red-200/80 text-[11px] text-red-800 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                    <span>{proj.risk_flags[0]}</span>
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/70">
                  <button
                    onClick={() => onSelectProject(proj)}
                    className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect Evidence
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenActionModal(proj, 'INQUIRY')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" /> Show-Cause Notice
                    </button>
                    <button
                      onClick={() => handleOpenActionModal(proj, 'FREEZE')}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <Ban className="w-3.5 h-3.5" /> Order Fund Freeze
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Audit Action Trail & Official Dispatch Log (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 space-y-4 flex flex-col h-[650px]">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Audit Compliance Trail</span>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-600" />
              Dispatched Action Log
            </h3>
          </div>

          {/* Action Log Entries */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {auditLog.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{log.id}</span>
                  <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    log.status === 'DISBURSAL_FROZEN' ? 'bg-red-600' : 'bg-amber-500'
                  }`}></span>
                  <strong className="text-slate-900 font-bold text-xs">{log.action}</strong>
                </div>
                <p className="text-[11px] text-slate-600">
                  Target: <strong className="text-slate-800">{log.workId}</strong> • MP {log.mp}
                </p>
                <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-200/60">
                  "{log.notes}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Action Dispatch Modal */}
      {showDispatchModal && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-100 text-red-700">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Issue Statutory Government Action</h3>
                  <p className="text-xs text-slate-500">{selectedCase.work_id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            {dispatchSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Statutory Notice Dispatched!</h4>
                <p className="text-xs text-slate-500">
                  Action entered into the national vigilance audit ledger with digital signature timestamp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecuteAction} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Order Type</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="FREEZE">🚨 Emergency Disbursal Freeze Order (Direct Treasury Instruction)</option>
                    <option value="INQUIRY">📋 Statutory Show-Cause Inquiry Notice under MPLADS Guidelines</option>
                    <option value="GROUND_INSPECT">🔍 Order Collectorate Ground Physical Audit & Measurement</option>
                    <option value="CLEAN">✅ Certify Compliant (After Documentation Review)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Authorizing Official Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Specific Vigilance Notes / Directives</label>
                  <textarea
                    rows={3}
                    placeholder="Enter formal justification for treasury notice (e.g., Road unit rate ₹8,400/m exceeds SSR 3.8x without technical sanction)..."
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowDispatchModal(false)}
                    className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-md shadow-red-600/20 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Sign & Dispatch Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
