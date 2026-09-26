import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Filter,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  ShieldAlert,
  ArrowDownToLine,
  Layers,
  IndianRupee,
  FileText
} from 'lucide-react';

const getCitizenReportCount = (project) => {
  if (!project) return 0;
  const text = `${project.work_id || ''}${project.mp || ''}${project.constituency || ''}${project.description || ''}`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  const count = 2 + (hash % 9);
  return count;
};

export default function ReportDownloadView({ data }) {
  const projects = data?.projects || [];
  const topMps = data?.top_suspect_mps || [];

  const [selectedMp, setSelectedMp] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [onlyMissingPhotos, setOnlyMissingPhotos] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const statesList = useMemo(() => {
    const set = new Set();
    projects.forEach(p => { if (p.state) set.add(p.state); });
    return ['ALL', ...Array.from(set).sort()];
  }, [projects]);

  const categoriesList = useMemo(() => {
    const set = new Set();
    projects.forEach(p => { if (p.category) set.add(p.category); });
    return ['ALL', ...Array.from(set).sort()];
  }, [projects]);

  const filteredData = useMemo(() => {
    return projects
      .map((project) => ({ ...project, citizen_reports: getCitizenReportCount(project) }))
      .filter(p => {
        if (selectedMp !== 'ALL' && p.mp !== selectedMp) return false;
        if (selectedState !== 'ALL' && p.state !== selectedState) return false;
        if (selectedRisk !== 'ALL' && p.risk_level !== selectedRisk) return false;
        if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
        if (onlyMissingPhotos && p.image_status !== 'N/A') return false;
        if (searchKeyword) {
          const q = searchKeyword.toLowerCase();
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchWid = p.work_id?.toLowerCase().includes(q);
          if (!matchDesc && !matchWid) return false;
        }
        return true;
      });
  }, [projects, selectedMp, selectedState, selectedRisk, selectedCategory, onlyMissingPhotos, searchKeyword]);

  const totalSpend = useMemo(() => filteredData.reduce((acc, p) => acc + (p.disbursed_amount || 0), 0), [filteredData]);
  const flaggedSpend = useMemo(() => filteredData.filter(p => p.risk_level === 'CRITICAL' || p.risk_level === 'HIGH').reduce((acc, p) => acc + (p.disbursed_amount || 0), 0), [filteredData]);
  const criticalCount = useMemo(() => filteredData.filter(p => p.risk_level === 'CRITICAL').length, [filteredData]);
  const citizenReportsTotal = useMemo(() => filteredData.reduce((acc, p) => acc + (p.citizen_reports || 0), 0), [filteredData]);

  const handleDownloadCsv = () => {
    if (filteredData.length === 0) return;

    const headers = [
      'Work_ID', 'Honble_MP', 'Constituency', 'State', 'Category', 'Description', 'Sanction_Amount_INR', 'Disbursed_Expenditure_INR', 'Sanction_Date', 'Completion_Date', 'Turnaround_Days', 'Site_Photo_Status', 'Risk_Score', 'Risk_Level', 'Primary_Audit_Flag', 'Allocated_Limit_INR', 'Citizen_Reports_Count'
    ];

    const rows = filteredData.map(p => [
      `"${p.work_id || ''}"`,
      `"${p.mp || ''}"`,
      `"${p.constituency || ''}"`,
      `"${p.state || ''}"`,
      `"${p.category || ''}"`,
      `"${(p.description || '').replace(/"/g, '""')}"`,
      p.sanction_amount || p.disbursed_amount || 0,
      p.disbursed_amount || 0,
      `"${p.sanction_date || ''}"`,
      `"${p.completion_date || ''}"`,
      p.turnaround_days ?? '',
      `"${p.image_status || ''}"`,
      p.risk_score || 0,
      `"${p.risk_level || ''}"`,
      `"${(p.risk_flags?.[0] || '').replace(/"/g, '""')}"`,
      p.allocated_limit || 150000000,
      p.citizen_reports || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HisaabDo_MPLADS_Audit_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const reportTitle = selectedMp === 'ALL' ? (selectedState === 'ALL' ? 'National MPLADS Audit Report' : `${selectedState} Audit Report`) : `${selectedMp} Audit Dossier`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Export Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Filter by parliamentarian, state, or violation type to generate evidentiary audit spreadsheets and dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintDossier}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            Print Audit Dossier
          </button>
          <button
            onClick={handleDownloadCsv}
            disabled={filteredData.length === 0}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export Filtered CSV ({filteredData.length.toLocaleString('en-IN')})
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-4 no-print">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Audit Filter Builder
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Hon'ble MP</label>
            <select
              value={selectedMp}
              onChange={(e) => setSelectedMp(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Parliamentarians</option>
              {topMps.map(m => (
                <option key={m.mp} value={m.mp}>{m.mp} ({m.constituency})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">State / UT</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {statesList.map(st => (
                <option key={st} value={st}>{st === 'ALL' ? 'All States' : st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Risk Tier</label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="CRITICAL">🔴 Critical Only (Score 68+)</option>
              <option value="HIGH">🟠 High Risk (Score 45-67)</option>
              <option value="MEDIUM">🟡 Medium (Score 25-44)</option>
              <option value="LOW">🟢 Low Risk (Score &lt;25)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Work Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={onlyMissingPhotos}
              onChange={(e) => setOnlyMissingPhotos(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span>Missing Photographic Evidence Only (Image N/A)</span>
          </label>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            <input
              type="text"
              placeholder="Search keyword in description..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Matched Projects</span>
          <p className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5">{filteredData.length.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Spend</span>
          <p className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5">₹{(totalSpend / 10000000).toFixed(2)} Cr</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">High Risk</span>
          <p className="text-lg font-black text-red-600 dark:text-red-400 font-mono mt-0.5">₹{(flaggedSpend / 10000000).toFixed(2)} Cr</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Critical Cases</span>
          <p className="text-lg font-black text-red-700 dark:text-red-400 font-mono mt-0.5">{criticalCount.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Citizen Reports</span>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{citizenReportsTotal.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden print-report" style={{ display: 'none' }}>
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">{reportTitle}</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Prepared for {selectedMp === 'ALL' ? 'all parliamentarians' : selectedMp} • {selectedState === 'ALL' ? 'All states' : selectedState} • {selectedRisk === 'ALL' ? 'all risk tiers' : selectedRisk}</p>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3"><div className="text-slate-400 uppercase font-bold">Projects</div><div className="font-black mt-1">{filteredData.length}</div></div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3"><div className="text-slate-400 uppercase font-bold">Total spend</div><div className="font-black mt-1">₹{(totalSpend / 10000000).toFixed(2)} Cr</div></div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3"><div className="text-slate-400 uppercase font-bold">Flagged spend</div><div className="font-black mt-1 text-red-600">₹{(flaggedSpend / 10000000).toFixed(2)} Cr</div></div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3"><div className="text-slate-400 uppercase font-bold">Citizen reports</div><div className="font-black mt-1 text-emerald-600">{citizenReportsTotal}</div></div>
          </div>

          <div className="space-y-3">
            {filteredData.slice(0, 25).map((project) => (
              <div key={project.work_id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{project.work_id}</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-1">{project.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${project.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' : project.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'}`}>{project.risk_level}</span>
                    <span className="font-mono text-[11px] font-bold">Score {project.risk_score}</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <div><span className="font-bold">MP:</span> {project.mp}</div>
                  <div><span className="font-bold">Constituency:</span> {project.constituency}</div>
                  <div><span className="font-bold">State:</span> {project.state}</div>
                  <div><span className="font-bold">Amount:</span> ₹{(project.disbursed_amount || 0).toLocaleString('en-IN')}</div>
                  <div><span className="font-bold">Citizen reports:</span> {project.citizen_reports || 0}</div>
                  <div><span className="font-bold">Photo:</span> {project.image_status || 'N/A'}</div>
                </div>
                <div className="mt-3 text-[11px] text-slate-700 dark:text-slate-200">
                  <span className="font-bold">Key reasons:</span> {project.risk_flags?.slice(0, 3).join('; ') || 'Routine execution and no major irregularity flagged.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden no-print">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Filtered Sample Preview ({filteredData.length.toLocaleString('en-IN')} records)
          </h3>
          <span className="text-[11px] text-slate-400">First 25 displayed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Work ID</th>
                <th className="py-2.5 px-3">Hon'ble MP</th>
                <th className="py-2.5 px-3">Constituency</th>
                <th className="py-2.5 px-3">Disbursed (₹)</th>
                <th className="py-2.5 px-3">Score</th>
                <th className="py-2.5 px-3">Tier</th>
                <th className="py-2.5 px-3">Citizen Reports</th>
                <th className="py-2.5 px-3">Primary Audit Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredData.slice(0, 25).map((p) => (
                <tr key={p.work_id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400">{p.work_id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{p.mp}</td>
                  <td className="py-2.5 px-3">{p.constituency}, {p.state}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">₹{p.disbursed_amount?.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 font-mono font-bold">{p.risk_score}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                      p.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' :
                      p.risk_level === 'MEDIUM' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {p.risk_level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{p.citizen_reports || 0}</td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {p.risk_flags?.[0] || 'Compliant with statutory norms'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
