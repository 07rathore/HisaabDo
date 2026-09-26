import React, { useState, useMemo } from 'react';
import {
  FolderKanban,
  IndianRupee,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Bell,
  AlertOctagon,
  Clock,
  Layers,
  Camera,
  Compass,
  CheckCircle2,
  Eye,
  FileText,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';

export default function DashboardView({ data, onSelectProject, onGenerateDossier, onNavigateTab }) {
  const [triageFilter, setTriageFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  const summary = data?.summary || {};
  const projects = data?.projects || [];

  const totalProjects = summary.total_records_processed || 34001;
  const totalSanctioned = 41867700000;
  const totalExpenditure = summary.total_expenditure_audited || 33288801600;
  const fundUtilization = ((totalExpenditure / totalSanctioned) * 100).toFixed(1);

  const lowCount = summary.low_count || 24413;
  const medCount = summary.medium_count || 7300;
  const highCount = summary.high_count || 1849;
  const critCount = summary.critical_count || 439;

  const low = parseFloat(((lowCount / totalProjects) * 100).toFixed(1));
  const med = parseFloat(((medCount / totalProjects) * 100).toFixed(1));
  const high = parseFloat(((highCount / totalProjects) * 100).toFixed(1));
  const crit = parseFloat(((critCount / totalProjects) * 100).toFixed(1));

  // Triage Filter Logic + Search Filter
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // 1. Triage Filter
      if (triageFilter === 'GHOST') {
        if (p.image_status !== 'N/A' || (p.disbursed_amount || 0) < 300000) return false;
      } else if (triageFilter === 'THRESHOLD') {
        const amt = p.disbursed_amount || 0;
        const isGaming = (amt >= 18000 && amt <= 19999) || (amt >= 190000 && amt <= 199999) || (amt >= 490000 && amt <= 499999);
        if (!isGaming) return false;
      } else if (triageFilter === 'BATCH') {
        if ((p.same_day_ida_completions || 0) < 20) return false;
      } else if (triageFilter === 'ROADS') {
        if (!p.is_road || (p.cost_per_meter || 0) <= 4500) return false;
      } else if (triageFilter === 'CRITICAL_ONLY') {
        if (p.risk_level !== 'CRITICAL') return false;
      } else {
        // 'ALL' default prioritizes high & critical risk
        if (p.risk_level !== 'CRITICAL' && p.risk_level !== 'HIGH') return false;
      }

      // 2. Search Query Filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchId = p.work_id?.toLowerCase().includes(q);
        const matchMp = p.mp?.toLowerCase().includes(q);
        const matchConst = p.constituency?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchState = p.state?.toLowerCase().includes(q);
        if (!matchId && !matchMp && !matchConst && !matchDesc && !matchState) return false;
      }

      return true;
    });
  }, [projects, triageFilter, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleExpandRow = (id) => {
    setExpandedRowId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Clean Subtitle */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          National Audit Surveillance
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time oversight of ₹3,328 Crore public expenditure across all 543 Parliamentary constituencies.
        </p>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3.5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Projects</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FolderKanban className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
            {totalProjects.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">All 543 Constituencies</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3.5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Sanctioned</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
            ₹ 4,186 <span className="text-xs font-normal text-slate-500">Cr</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Approved allocations</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3.5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Expenditure</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
            ₹ {(totalExpenditure / 10000000).toFixed(0)} <span className="text-xs font-normal text-slate-500">Cr</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Disbursed on ground</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3.5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fund Utilization</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
            {fundUtilization}%
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Expenditure / Sanctioned</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-orange-200/90 dark:border-orange-900/40 p-3.5 rounded-2xl shadow-xs bg-gradient-to-b from-orange-50/30 to-white dark:from-orange-950/20 dark:to-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">High Risk Works</span>
            <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-orange-600 dark:text-orange-400 font-mono">
            {(highCount + critCount).toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-orange-500 dark:text-orange-400/80 font-medium mt-0.5">Audit review recommended</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-red-200/90 dark:border-red-900/40 p-3.5 rounded-2xl shadow-xs bg-gradient-to-b from-red-50/30 to-white dark:from-red-950/20 dark:to-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Critical Alerts</span>
            <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <Bell className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-red-600 dark:text-red-400 font-mono">
            {critCount.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-red-500 dark:text-red-400/80 font-medium mt-0.5">Priority vigilance notices</p>
        </div>
      </div>

      {/* Middle Section: Donut Distribution & Anomaly Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Donut Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Risk Tier Breakdown</h3>
                <p className="text-[11px] text-slate-400">Distribution across 34,001 audited works</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Census ML
              </span>
            </div>

            {/* Seamless 4-Color SVG Donut Ring */}
            <div className="my-5 flex items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg viewBox="0 0 42 42" className="w-full h-full">
                  <circle cx="21" cy="21" r="15.9155" fill="none" stroke="#e2e8f0" className="dark:stroke-slate-800" strokeWidth="4.2" />

                  {/* 1. Low Risk Segment */}
                  <circle
                    cx="21" cy="21" r="15.9155"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4.5"
                    strokeDasharray={`${low} ${100 - low}`}
                    strokeDashoffset="25"
                  />

                  {/* 2. Medium Risk Segment */}
                  <circle
                    cx="21" cy="21" r="15.9155"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4.5"
                    strokeDasharray={`${med} ${100 - med}`}
                    strokeDashoffset={`${25 - low}`}
                  />

                  {/* 3. High Risk Segment */}
                  <circle
                    cx="21" cy="21" r="15.9155"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="4.5"
                    strokeDasharray={`${high} ${100 - high}`}
                    strokeDashoffset={`${25 - (low + med)}`}
                  />

                  {/* 4. Critical Risk Segment */}
                  <circle
                    cx="21" cy="21" r="15.9155"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="4.8"
                    strokeDasharray={`${crit} ${100 - crit}`}
                    strokeDashoffset={`${25 - (low + med + high)}`}
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{low}%</span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Compliant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <div>
                <p className="text-[10px] text-slate-400">Low (Clean)</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px] font-mono">{lowCount.toLocaleString('en-IN')} ({low}%)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              <div>
                <p className="text-[10px] text-slate-400">Medium Risk</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px] font-mono">{medCount.toLocaleString('en-IN')} ({med}%)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
              <div>
                <p className="text-[10px] text-slate-400">High Risk</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px] font-mono">{highCount.toLocaleString('en-IN')} ({high}%)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0"></span>
              <div>
                <p className="text-[10px] text-red-600 dark:text-red-400 font-bold">Critical Alert</p>
                <p className="font-bold text-red-700 dark:text-red-300 text-[11px] font-mono">{critCount.toLocaleString('en-IN')} ({crit}%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Anomaly Matrix Tiles */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Audit Anomaly Detectors</h3>
              </div>
              <p className="text-[11px] text-slate-400">Multivariate machine learning convergence on suspicious indicators</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Isolation Forest & NLP Active
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Price Outliers</span>
                <div className="p-1 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                  <IndianRupee className="w-3 h-3" />
                </div>
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">1,527</div>
              <p className="text-[10px] text-slate-400 mt-1">Multi-feature Isolation Forest anomalies</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Mass Sign-offs</span>
                <div className="p-1 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <Clock className="w-3 h-3" />
                </div>
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">3,115</div>
              <p className="text-[10px] text-slate-400 mt-1">≥20 completions certified on same day</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Missing Photos</span>
                <div className="p-1 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Camera className="w-3 h-3" />
                </div>
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">9,303</div>
              <p className="text-[10px] text-slate-400 mt-1">Marked complete with no site photo</p>
            </div>

            <div
              onClick={() => onNavigateTab('duplicates')}
              className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/30 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200">Duplicate Clusters</span>
                <div className="p-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                  <Layers className="w-3 h-3" />
                </div>
              </div>
              <div className="text-lg font-black text-blue-900 dark:text-blue-200 font-mono">226 Clusters</div>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1">Cloned descriptions detected (View &rarr;)</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Threshold Slicing</span>
                <div className="p-1 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                  <AlertOctagon className="w-3 h-3" />
                </div>
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">768</div>
              <p className="text-[10px] text-slate-400 mt-1">Sub-₹20k and sub-₹2L evasion patterns</p>
            </div>

            <div
              onClick={() => onNavigateTab('roads')}
              className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/30 hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-purple-900 dark:text-purple-200">Road Rate Alerts</span>
                <div className="p-1 rounded bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                  <Compass className="w-3 h-3" />
                </div>
              </div>
              <div className="text-lg font-black text-purple-900 dark:text-purple-200 font-mono">1,112 Analyzed</div>
              <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-1">Unit cost &gt; ₹4,500/m vs SSR (View &rarr;)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Audit Queue with Search, Filter & Expandable Full Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Header & Controls Bar */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Priority Audit Queue
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {filteredProjects.length.toLocaleString('en-IN')} Found
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Click any row to expand full details without scrolling or navigating away.
              </p>
            </div>

            {/* Quick Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Work ID, MP, state, description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => { setTriageFilter('ALL'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  triageFilter === 'ALL'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Flagged
              </button>
              <button
                onClick={() => { setTriageFilter('CRITICAL_ONLY'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  triageFilter === 'CRITICAL_ONLY'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Critical Only ({critCount})
              </button>
              <button
                onClick={() => { setTriageFilter('GHOST'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  triageFilter === 'GHOST'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Unverified (&gt;₹3L No Photo)
              </button>
              <button
                onClick={() => { setTriageFilter('THRESHOLD'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  triageFilter === 'THRESHOLD'
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Threshold Evasion (&lt;₹20k, &lt;₹2L)
              </button>
              <button
                onClick={() => { setTriageFilter('BATCH'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  triageFilter === 'BATCH'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Mass Sign-offs (≥20 works/day)
              </button>
              <button
                onClick={() => { setTriageFilter('ROADS'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  triageFilter === 'ROADS'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Elevated Road Costs (&gt;₹4,500/m)
              </button>
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value={10}>10 rows</option>
                <option value={15}>15 rows</option>
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table with Expandable Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3 w-10"></th>
                <th className="p-3">Risk Tier</th>
                <th className="p-3">Work ID</th>
                <th className="p-3">Work Description</th>
                <th className="p-3">Hon'ble MP & State</th>
                <th className="p-3">Expenditure</th>
                <th className="p-3">Primary Audit Flag</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No projects found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((p) => {
                  const isExpanded = expandedRowId === p.work_id;
                  const isCritical = p.risk_level === 'CRITICAL';

                  return (
                    <React.Fragment key={p.work_id}>
                      <tr
                        onClick={() => toggleExpandRow(p.work_id)}
                        className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <td className="p-3 text-center text-slate-400">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono font-bold text-xs ${
                              isCritical
                                ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60'
                                : 'bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900/60'
                            }`}
                          >
                            {p.risk_score}/100
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-600 dark:text-slate-300 text-[11px] whitespace-nowrap">
                          {p.work_id}
                        </td>
                        <td className="p-3 max-w-sm">
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                            {p.description}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{p.category}</p>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <p className="font-bold text-slate-800 dark:text-slate-200">{p.mp || 'N/A'}</p>
                          <p className="text-[10px] text-slate-400">{p.constituency}, {p.state}</p>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          ₹{p.disbursed_amount?.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 max-w-xs">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 truncate block">
                            {p.risk_flags?.[0] || 'Multivariate ML Outlier'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectProject(p)}
                            className="px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            View Reasons
                          </button>
                          <button
                            onClick={() => onGenerateDossier(p)}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            Inquiry Notice
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Full Details Drawer */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80 dark:bg-slate-850 border-y border-indigo-100 dark:border-indigo-950">
                          <td colSpan={8} className="p-4 sm:p-5">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4 shadow-xs">
                              {/* Header info */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div>
                                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                    Full Project Audit Record
                                  </span>
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                                    {p.description}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                                    IDA: {p.ida || 'District Authority'}
                                  </span>
                                  <button
                                    onClick={() => onSelectProject(p)}
                                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    AI Forensic Breakdown
                                  </button>
                                </div>
                              </div>

                              {/* Details Grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Sanction Date</span>
                                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{p.sanction_date || 'N/A'}</p>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Completion Date</span>
                                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{p.completion_date || 'N/A'}</p>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Turnaround Time</span>
                                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                                    {p.turnaround_days != null ? `${p.turnaround_days} days` : 'Immediate / N/A'}
                                  </p>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Site Photo Proof</span>
                                  <p className={`font-semibold mt-0.5 ${p.image_status === 'N/A' ? 'text-red-500 font-bold' : 'text-emerald-500'}`}>
                                    {p.image_status === 'N/A' ? '❌ Missing (Zero Photo)' : '✅ Uploaded & Verified'}
                                  </p>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Sanction Amount</span>
                                  <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                                    ₹{p.sanction_amount ? p.sanction_amount.toLocaleString('en-IN') : p.disbursed_amount?.toLocaleString('en-IN')}
                                  </p>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Disbursed Expenditure</span>
                                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                                    ₹{p.disbursed_amount?.toLocaleString('en-IN')}
                                  </p>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Same-Day Batch Approvals</span>
                                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                                    {p.same_day_ida_completions || 1} works certified
                                  </p>
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Coordinates / Locality</span>
                                  <p className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                                    {p.coordinates ? `${p.coordinates[0].toFixed(2)}°N, ${p.coordinates[1].toFixed(2)}°E` : p.state}
                                  </p>
                                </div>
                              </div>

                              {/* Detected Flags */}
                              <div className="space-y-1.5 pt-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Identified Risk Flags:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {p.risk_flags && p.risk_flags.length > 0 ? (
                                    p.risk_flags.map((flag, fIdx) => (
                                      <span
                                        key={fIdx}
                                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 flex items-center gap-1.5"
                                      >
                                        <AlertTriangle className="w-3 h-3 text-red-500" />
                                        {flag}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-xs text-emerald-600 font-semibold">Standard statutory audit compliant</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{Math.min(filteredProjects.length, (currentPage - 1) * pageSize + 1)}</span> to{' '}
            <span className="font-bold text-slate-900 dark:text-white">{Math.min(filteredProjects.length, currentPage * pageSize)}</span> of{' '}
            <span className="font-bold text-slate-900 dark:text-white">{filteredProjects.length.toLocaleString('en-IN')}</span> records
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Previous
            </button>
            <span className="px-2 font-mono font-semibold">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
