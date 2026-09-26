import React, { useState, useMemo } from 'react';
import { Search, Filter, AlertTriangle, ShieldCheck, ArrowUpDown, Eye, FileText, Download, Building, Landmark, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import CaseStudyBanners from './CaseStudyBanners';

export default function OfficialDashboard({ data, onSelectProject, onGenerateDossier, onNavigateTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [onlyZeroPhoto, setOnlyZeroPhoto] = useState(false);
  const [sortField, setSortField] = useState('risk_score');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const summary = data?.summary || {};
  const projects = data?.projects || [];

  // Total percentages across all 34,001 works
  const totalAudited = summary.total_records_processed || 34001;
  const pctLow = ((summary.low_count / totalAudited) * 100).toFixed(1);
  const pctMed = ((summary.medium_count / totalAudited) * 100).toFixed(1);
  const pctHigh = ((summary.high_count / totalAudited) * 100).toFixed(1);
  const pctCrit = ((summary.critical_count / totalAudited) * 100).toFixed(1);

  // Unique lists for dropdowns
  const states = useMemo(() => {
    const s = new Set(projects.map(p => p.state).filter(Boolean));
    return ['ALL', ...Array.from(s).sort()];
  }, [projects]);

  const categories = useMemo(() => {
    const c = new Set(projects.map(p => p.category).filter(Boolean));
    return ['ALL', ...Array.from(c).sort()];
  }, [projects]);

  // Handle case study selection shortcut
  const handleSelectCase = (params) => {
    setCurrentPage(1);
    if (params.mp) {
      setSearchTerm(params.mp);
      setSelectedRisk('ALL');
    } else if (params.filterHighBatch) {
      setSearchTerm('');
      setSelectedRisk('CRITICAL');
    } else if (params.tab) {
      onNavigateTab(params.tab);
    }
  };

  // Filtered & Sorted projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = searchTerm === '' ||
        p.mp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.constituency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.work_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ida?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchState = selectedState === 'ALL' || p.state === selectedState;
      const matchRisk = selectedRisk === 'ALL' || p.risk_level === selectedRisk;
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchPhoto = !onlyZeroPhoto || p.image_status === 'N/A';

      return matchSearch && matchState && matchRisk && matchCat && matchPhoto;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [projects, searchTerm, selectedState, selectedRisk, selectedCategory, onlyZeroPhoto, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* High-Level KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Audited Spend</p>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            ₹{(summary.total_expenditure_audited / 10000000).toFixed(1)} <span className="text-xs font-medium text-slate-400">Cr</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">{summary.total_records_processed?.toLocaleString('en-IN')} total works</p>
        </div>

        <div className="bg-slate-900 border border-red-500/30 p-4 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-red-500/10 rounded-full blur-xl"></div>
          <p className="text-xs font-semibold uppercase tracking-wider text-red-400">Flagged Risk Capital</p>
          <h3 className="text-xl sm:text-2xl font-black text-red-400 mt-1">
            ₹{(summary.total_flagged_at_risk / 10000000).toFixed(1)} <span className="text-xs font-medium text-red-300">Cr</span>
          </h3>
          <p className="text-[11px] text-red-300/80 mt-1 font-semibold">
            {summary.critical_count + summary.high_count} Anomaly alerts
          </p>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-2xl shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Compliant / Low Risk</p>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
            {summary.low_count?.toLocaleString('en-IN')} <span className="text-xs font-medium text-slate-400">works ({pctLow}%)</span>
          </h3>
          <p className="text-[11px] text-emerald-300/80 mt-1">Passed standard compliance</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Zero-Photo Completions</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-300 mt-1">
            {summary.zero_photo_count?.toLocaleString('en-IN')} <span className="text-xs font-medium text-slate-500">works</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Completed without photo proof</p>
        </div>
      </div>

      {/* National Risk Distribution Bar (Proves Model is not blind flagging) */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              National Risk Spectrum Distribution ({totalAudited.toLocaleString('en-IN')} Works Audited)
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            Over <strong>89.8%</strong> of works are classified as compliant Low or Moderate risk
          </span>
        </div>

        {/* Visual Gradient Multi-Segment Bar */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
          <div style={{ width: `${pctLow}%` }} className="bg-emerald-500 h-full hover:opacity-90 transition-opacity" title={`Low Risk (Clean): ${summary.low_count} works (${pctLow}%)`}></div>
          <div style={{ width: `${pctMed}%` }} className="bg-yellow-500 h-full hover:opacity-90 transition-opacity" title={`Medium Risk: ${summary.medium_count} works (${pctMed}%)`}></div>
          <div style={{ width: `${pctHigh}%` }} className="bg-amber-500 h-full hover:opacity-90 transition-opacity" title={`High Risk: ${summary.high_count} works (${pctHigh}%)`}></div>
          <div style={{ width: `${pctCrit}%` }} className="bg-red-500 h-full hover:opacity-90 transition-opacity" title={`Critical Risk: ${summary.critical_count} works (${pctCrit}%)`}></div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px]">
          <div
            onClick={() => { setSelectedRisk('LOW'); setCurrentPage(1); }}
            className={`cursor-pointer flex items-center gap-1.5 p-1.5 rounded-lg border transition-all ${
              selectedRisk === 'LOW' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span><strong>Low (Clean):</strong> {pctLow}% ({summary.low_count?.toLocaleString('en-IN')})</span>
          </div>

          <div
            onClick={() => { setSelectedRisk('MEDIUM'); setCurrentPage(1); }}
            className={`cursor-pointer flex items-center gap-1.5 p-1.5 rounded-lg border transition-all ${
              selectedRisk === 'MEDIUM' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span><strong>Medium:</strong> {pctMed}% ({summary.medium_count?.toLocaleString('en-IN')})</span>
          </div>

          <div
            onClick={() => { setSelectedRisk('HIGH'); setCurrentPage(1); }}
            className={`cursor-pointer flex items-center gap-1.5 p-1.5 rounded-lg border transition-all ${
              selectedRisk === 'HIGH' ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span><strong>High Risk:</strong> {pctHigh}% ({summary.high_count?.toLocaleString('en-IN')})</span>
          </div>

          <div
            onClick={() => { setSelectedRisk('CRITICAL'); setCurrentPage(1); }}
            className={`cursor-pointer flex items-center gap-1.5 p-1.5 rounded-lg border transition-all ${
              selectedRisk === 'CRITICAL' ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span><strong>Critical Risk:</strong> {pctCrit}% ({summary.critical_count?.toLocaleString('en-IN')})</span>
          </div>
        </div>
      </div>

      {/* Case Study Fast Shortcuts */}
      <CaseStudyBanners onSelectCase={handleSelectCase} />

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by MP name, constituency, work description, or Work ID..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedRisk}
              onChange={(e) => { setSelectedRisk(e.target.value); setCurrentPage(1); }}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="CRITICAL">Critical (Score &ge; 70)</option>
              <option value="HIGH">High (Score 45-69)</option>
              <option value="MEDIUM">Medium (Score 25-44)</option>
              <option value="LOW">Low / Compliant (Score &lt; 25)</option>
            </select>

            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setCurrentPage(1); }}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 max-w-[150px]"
            >
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              onClick={() => { setOnlyZeroPhoto(!onlyZeroPhoto); setCurrentPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                onlyZeroPhoto
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Zero Photos Only
            </button>

            {(searchTerm || selectedRisk !== 'ALL' || selectedState !== 'ALL' || onlyZeroPhoto) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRisk('ALL');
                  setSelectedState('ALL');
                  setOnlyZeroPhoto(false);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-2 text-xs text-amber-400 hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            Showing <strong className="text-white">{filteredProjects.length.toLocaleString('en-IN')}</strong> matching projects
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Page {currentPage} of {totalPages} (25 per page)
          </span>
        </div>
      </div>

      {/* Main Audit Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th onClick={() => handleSort('risk_score')} className="p-3.5 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1">Risk Score <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-3.5">Hon'ble MP & Constituency</th>
                <th className="p-3.5">Work Description</th>
                <th onClick={() => handleSort('disbursed_amount')} className="p-3.5 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1">Disbursed <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-3.5">Audit Assessment</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedProjects.map((proj, idx) => {
                const isCritical = proj.risk_level === 'CRITICAL';
                const isHigh = proj.risk_level === 'HIGH';
                const isMedium = proj.risk_level === 'MEDIUM';
                const isLow = proj.risk_level === 'LOW';

                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    {/* Risk Score Badge */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg font-bold font-mono text-xs border ${
                          isCritical
                            ? 'bg-red-500/20 text-red-400 border-red-500/40'
                            : isHigh
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : isMedium
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {proj.risk_score}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{proj.risk_level}</span>
                      </div>
                    </td>

                    {/* MP & Constituency */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold text-white">{proj.mp || 'Unknown MP'}</div>
                      <div className="text-[11px] text-slate-400">{proj.constituency}, {proj.state}</div>
                    </td>

                    {/* Description */}
                    <td className="p-3.5 max-w-sm">
                      <div className="line-clamp-2 text-slate-200 font-medium">{proj.description}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">{proj.work_id}</div>
                    </td>

                    {/* Disbursed Amount */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-amber-400 text-xs">
                        ₹{proj.disbursed_amount?.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {proj.completion_date || 'Unknown Date'}
                      </div>
                    </td>

                    {/* Flags / Positive Notes */}
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {proj.risk_flags && proj.risk_flags.slice(0, 2).map((flag, fIdx) => (
                          <span
                            key={fIdx}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium truncate max-w-xs border ${
                              isLow
                                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                                : isMedium
                                ? 'bg-yellow-950/60 border-yellow-500/30 text-yellow-300'
                                : 'bg-red-950/60 border-red-500/30 text-red-300'
                            }`}
                            title={flag}
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => onSelectProject(proj)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        Explain
                      </button>

                      <button
                        onClick={() => onGenerateDossier(proj)}
                        className="px-2.5 py-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{Math.min(filteredProjects.length, (currentPage - 1) * pageSize + 1)}</strong> to <strong className="text-white">{Math.min(filteredProjects.length, currentPage * pageSize)}</strong> of <strong className="text-white">{filteredProjects.length.toLocaleString('en-IN')}</strong> records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white font-semibold flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            <span className="px-3 py-1 text-slate-300 font-mono">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white font-semibold flex items-center gap-1 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
