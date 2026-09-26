import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  ShieldAlert,
  Building2,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  BadgeCheck,
  KeyRound,
  ArrowRight,
  Info,
  ExternalLink,
  RefreshCw,
  LogOut,
  Send,
  FileSpreadsheet
} from 'lucide-react';

export default function ActionCenterView({ data }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginMethod, setLoginMethod] = useState('parichay'); // 'parichay', 'email', 'dsc'
  const [officialEmail, setOfficialEmail] = useState('dg.vigilance@mospi.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [officerRole, setOfficerRole] = useState('Central Vigilance Authority');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('7K9X2');
  const [activeTab, setActiveTab] = useState('actions'); // 'actions', 'notices', 'directory'
  const [actionSuccess, setActionSuccess] = useState(null);

  const officialsDirectory = [
    {
      role: 'Central Oversight Authority',
      name: 'Dr. S. K. Ramanathan, IAS',
      designation: 'Director General (Audit & Vigilance)',
      department: 'Ministry of Statistics & Programme Implementation (MoSPI), New Delhi',
      jurisdiction: 'National MPLADS Scheme Monitoring & Tranche Approvals',
      powers: 'Tranche Disbursal Suspension, Inter-State Vigilance Referral, Treasury Hold',
      status: 'Active'
    },
    {
      role: 'State Nodal Officer',
      name: 'Shri Arvind Verma, IAS',
      designation: 'Principal Secretary (Planning & Monitoring)',
      department: 'State Planning Commission / Nodal Department, Lucknow',
      jurisdiction: 'State-Level Execution & Administrative Sanction Review',
      powers: 'Technical Sanction (TS) Review, Measurement Book (MB) Seizure Order',
      status: 'Active'
    },
    {
      role: 'District Authority',
      name: 'District Magistrate & Collector',
      designation: 'Implementing District Authority (IDA)',
      department: 'District Collectorate & District Planning Office',
      jurisdiction: 'Constituency Project Implementation & Inspection',
      powers: 'Physical Site Verification, Contractor Payment Clearance, FIR Registration',
      status: 'Active'
    }
  ];

  const vigilanceFiles = [
    {
      fileNo: 'MOSPI/VIG/2026/048',
      title: 'Puri Parliamentary Constituency - Cloned Highmast Works',
      mp: 'Dr. Sambit Patra (Puri, Odisha)',
      amount: '₹ 1.84 Crore',
      status: 'Show-Cause Dispatched',
      priority: 'HIGH',
      date: '24-Sep-2026'
    },
    {
      fileNo: 'MOSPI/VIG/2026/092',
      title: 'Road SSR Rate Inflation (>3.5x Standard PWD Rate)',
      mp: 'Multiple IDAs (Gaya & Sitamarhi, Bihar)',
      amount: '₹ 2.45 Crore',
      status: 'Treasury Tranche Frozen',
      priority: 'CRITICAL',
      date: '25-Sep-2026'
    },
    {
      fileNo: 'MOSPI/VIG/2026/115',
      title: 'Single-Day Mass Sign-off (64 Completed Works Certified in 24h)',
      mp: 'Implementing District Authority (Kanpur Nagar, UP)',
      amount: '₹ 3.12 Crore',
      status: 'Physical MB Seizure Ordered',
      priority: 'HIGH',
      date: '26-Sep-2026'
    }
  ];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleSimulateQuickLogin = (role) => {
    setOfficerRole(role);
    setIsAuthenticated(true);
  };

  const handleExecuteAction = (actionName) => {
    setActionSuccess(`Action '${actionName}' executed under Section 6.2 of MoSPI Guidelines. File updated.`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Official Administrative Portal
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Authorized console for Ministry of Statistics and Programme Implementation (MoSPI) and District Authorities.
        </p>
      </div>

      {!isAuthenticated ? (
        /* Professional Government Login Portal */
        <div className="max-w-xl mx-auto my-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          {/* Official Gov Emblem Header */}
          <div className="bg-slate-900 text-white p-6 text-center border-b border-slate-800 space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-lg font-bold">
              🏛️
            </div>
            <div>
              <p className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">
                Government of India • भारत सरकार
              </p>
              <h3 className="text-base font-extrabold tracking-tight mt-0.5">
                Ministry of Statistics & Programme Implementation
              </h3>
              <p className="text-xs text-indigo-300 font-medium">
                National MPLADS Vigilance & Administrative Console
              </p>
            </div>
          </div>

          {/* Authentication Method Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-center">
            <button
              onClick={() => setLoginMethod('parichay')}
              className={`py-3 transition-colors cursor-pointer ${
                loginMethod === 'parichay'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Parichay SSO
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`py-3 transition-colors cursor-pointer ${
                loginMethod === 'email'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Gov Credentials
            </button>
            <button
              onClick={() => setLoginMethod('dsc')}
              className={`py-3 transition-colors cursor-pointer ${
                loginMethod === 'dsc'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              DSC e-Token
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Designation / Statutory Role
                </label>
                <select
                  value={officerRole}
                  onChange={(e) => setOfficerRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Central Vigilance Authority">Director General (Audit & Vigilance) — MoSPI, New Delhi</option>
                  <option value="State Nodal Officer">Principal Secretary (State Planning Nodal Officer)</option>
                  <option value="District Authority">Implementing District Authority (District Magistrate / Collector)</option>
                  <option value="CAG Vigilance">Comptroller & Auditor General (CAG) Special Auditor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Email / Gov Employee Code
                </label>
                <input
                  type="email"
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  placeholder="officer.name@nic.in"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password / SSO Security Token
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Captcha Verification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Security Code (Captcha)
                </label>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-1.5 rounded-xl font-mono font-black text-sm tracking-widest text-slate-800 dark:text-slate-200 select-none line-through">
                    {captchaCode}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCaptchaCode(Math.random().toString(36).substring(2, 7).toUpperCase())}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    title="Refresh Captcha"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 uppercase font-mono text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Sign In to Vigilance Console
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
              <span className="text-[11px] text-slate-400 font-semibold block">
                Evaluation Demo Access (Skip login for review):
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateQuickLogin('Director General (Vigilance)')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  Demo as MoSPI DG
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateQuickLogin('District Magistrate (IDA)')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  Demo as District Magistrate
                </button>
              </div>
            </div>

            <div className="text-center pt-1">
              <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" />
                NIC Security Certified • 256-bit TLS Encrypted Session
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Official Console */
        <div className="space-y-6">
          {/* Top Session Banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {officerRole} Session Active
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                    Authenticated
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {officialEmail} • Digital Token ID: MOSPI-AUTH-2026-9281
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              Sign Out Session
            </button>
          </div>

          {actionSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {actionSuccess}
            </div>
          )}

          {/* Action Console Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Active Vigilance Matters */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Active Vigilance Matters & Inquiry Dockets
                    </h3>
                    <p className="text-xs text-slate-400">
                      High-priority files requiring statutory enforcement or physical verification
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    3 Pending Files
                  </span>
                </div>

                <div className="space-y-3">
                  {vigilanceFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {file.fileNo}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                          {file.priority} PRIORITY
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {file.title}
                      </h4>
                      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>MP: <strong>{file.mp}</strong></span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{file.amount}</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{file.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statutory Action Execution Center */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Statutory Administrative Actions (Under MPLADS Guidelines)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <button
                    onClick={() => handleExecuteAction('Issue Statutory Show-Cause Notice')}
                    className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-left space-y-1 cursor-pointer transition-colors"
                  >
                    <span className="font-bold text-indigo-900 dark:text-indigo-300 block">
                      Issue Show-Cause Notice
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Dispatches official notice to Implementing Agency under Sec 5.4.
                    </p>
                  </button>

                  <button
                    onClick={() => handleExecuteAction('Freeze Treasury Fund Tranche')}
                    className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/30 hover:bg-red-50 dark:hover:bg-red-900/40 text-left space-y-1 cursor-pointer transition-colors"
                  >
                    <span className="font-bold text-red-900 dark:text-red-300 block">
                      Freeze Fund Tranche
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Places administrative hold on pending tranche release.
                    </p>
                  </button>

                  <button
                    onClick={() => handleExecuteAction('Order Physical MB Seizure')}
                    className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/30 hover:bg-amber-50 dark:hover:bg-amber-900/40 text-left space-y-1 cursor-pointer transition-colors"
                  >
                    <span className="font-bold text-amber-900 dark:text-amber-300 block">
                      Order MB Inspection
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Directs District Magistrate to seize physical Measurement Book.
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col: Officials Hierarchy Directory */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Officials Hierarchy Directory
                  </h3>
                  <p className="text-xs text-slate-400">
                    MoSPI Guidelines 2023 Statutory Structure
                  </p>
                </div>

                <div className="space-y-3">
                  {officialsDirectory.map((officer, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                          {officer.role}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold">Active</span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{officer.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{officer.designation}</p>
                      <p className="text-[10px] text-slate-400">{officer.department}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
