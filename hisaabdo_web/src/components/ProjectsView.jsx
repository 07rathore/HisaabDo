import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Eye, FileText, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

export default function ProjectsView({ data, onSelectProject, onGenerateDossier }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState('ALL');
  const [selectedPattern, setSelectedPattern] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const projects = data?.projects || [];

  const states = useMemo(() => {
    const s = new Set(projects.map(p => p.state).filter(Boolean));
    return Array.from(s).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = !searchTerm ||
        p.mp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.constituency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.work_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ida?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchState = selectedState === 'ALL' || p.state === selectedState;
      const matchRisk = selectedRisk === 'ALL' || p.risk_level === selectedRisk;

      let matchCat = true;
      if (selectedCategory !== 'ALL') {
        const desc = (p.description + " " + p.category).toLowerCase();
        if (selectedCategory === 'ROADS') matchCat = p.is_road || desc.includes('road');
        else if (selectedCategory === 'LIGHTS') matchCat = desc.includes('light') || desc.includes('solar') || desc.includes('mast');
        else if (selectedCategory === 'HALLS') matchCat = desc.includes('hall') || desc.includes('bhavan') || desc.includes('cultural');
        else if (selectedCategory === 'WATER') matchCat = desc.includes('water') || desc.includes('tank') || desc.includes('pump');
        else if (selectedCategory === 'SCHOOLS') matchCat = desc.includes('school') || desc.includes('college') || desc.includes('room');
      }

      let matchPhoto = true;
      if (selectedPhoto === 'MISSING') matchPhoto = p.image_status === 'N/A';
      else if (selectedPhoto === 'PRESENT') matchPhoto = p.image_status !== 'N/A';

      let matchPattern = true;
      if (selectedPattern === 'THRESHOLD_20K') {
        matchPattern = p.disbursed_amount >= 18000 && p.disbursed_amount <= 19999;
      } else if (selectedPattern === 'THRESHOLD_2L') {
        matchPattern = p.disbursed_amount >= 190000 && p.disbursed_amount <= 199999;
      } else if (selectedPattern === 'BATCH') {
        matchPattern = p.same_day_ida_completions >= 15;
      } else if (selectedPattern === 'ML_OUTLIER') {
        matchPattern = p.ml_is_outlier === true;
      }

      return matchSearch && matchState && matchRisk && matchCat && matchPhoto && matchPattern;
    });
  }, [projects, searchTerm, selectedState, selectedRisk, selectedCategory, selectedPhoto, selectedPattern]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedState('ALL');
    setSelectedRisk('ALL');
    setSelectedCategory('ALL');
    setSelectedPhoto('ALL');
    setSelectedPattern('ALL');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || selectedState !== 'ALL' || selectedRisk !== 'ALL' || selectedCategory !== 'ALL' || selectedPhoto !== 'ALL' || selectedPattern !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Public Development Projects Explorer</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive audit database with granular filtering by jurisdiction, work category, evidence status, and fraud patterns.
        </p>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-sm space-y-3">
        {/* Top row: Search input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by MP name, constituency, work description, or Work ID..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Bottom row: Detailed Dropdowns (State, Risk, Category, Photo, Pattern) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {/* 1. State Filter (Fixed: Says "State: All States" instead of "ALL") */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">State / UT</label>
            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">State: All States</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* 2. Risk Tier */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Risk Classification</label>
            <select
              value={selectedRisk}
              onChange={(e) => { setSelectedRisk(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Risk: All Tiers</option>
              <option value="CRITICAL">Critical (Score &ge; 68)</option>
              <option value="HIGH">High (Score 45-67)</option>
              <option value="MEDIUM">Medium (Score 25-44)</option>
              <option value="LOW">Low (Compliant)</option>
            </select>
          </div>

          {/* 3. Category Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Work Type</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Category: All Works</option>
              <option value="ROADS">Roads & Pathways</option>
              <option value="LIGHTS">Lighting & High Masts</option>
              <option value="HALLS">Community Halls & Bhavans</option>
              <option value="WATER">Drinking Water & RO Plants</option>
              <option value="SCHOOLS">Schools & Educational</option>
            </select>
          </div>

          {/* 4. Photographic Proof Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Site Evidence</label>
            <select
              value={selectedPhoto}
              onChange={(e) => { setSelectedPhoto(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Photos: All Records</option>
              <option value="MISSING">Missing Photos (N/A)</option>
              <option value="PRESENT">Verified Photos Present</option>
            </select>
          </div>

          {/* 5. Specific Anomaly Pattern */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Special Anomaly Pattern</label>
            <select
              value={selectedPattern}
              onChange={(e) => { setSelectedPattern(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Pattern: All Patterns</option>
              <option value="THRESHOLD_20K">&lt;₹20k Audit Limit Slicing</option>
              <option value="THRESHOLD_2L">&lt;₹2L e-Tender Bypass</option>
              <option value="BATCH">&ge;15 Works in 1 Day</option>
              <option value="ML_OUTLIER">Isolation Forest Outliers</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-slate-900">{filtered.length.toLocaleString('en-IN')}</strong> matching projects</span>
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 ml-2"
              >
                <RotateCcw className="w-3 h-3" /> Reset All Filters
              </button>
            )}
          </div>
          <span className="font-mono text-[11px]">Page {currentPage} of {totalPages} (25 per page)</span>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80">
              <tr>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5">Project ID</th>
                <th className="p-3.5">Hon'ble MP & Constituency</th>
                <th className="p-3.5">Work Description</th>
                <th className="p-3.5">Expenditure</th>
                <th className="p-3.5">Audit Assessment</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((p, idx) => {
                const isCrit = p.risk_level === 'CRITICAL';
                const isHigh = p.risk_level === 'HIGH';
                const isMed = p.risk_level === 'MEDIUM';

                return (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                          isCrit ? 'bg-red-100 text-red-700' : isHigh ? 'bg-orange-100 text-orange-700' : isMed ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {p.risk_score}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{p.risk_level}</span>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-slate-500 font-bold text-[11px] whitespace-nowrap">
                      {p.work_id}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <p className="font-bold text-slate-900">{p.mp || 'Unspecified'}</p>
                      <p className="text-[10px] text-slate-400">{p.constituency}, {p.state}</p>
                    </td>

                    <td className="p-3.5 max-w-sm">
                      <p className="font-medium text-slate-800 line-clamp-2">{p.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.category}</p>
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-mono font-bold text-slate-900">
                      ₹{p.disbursed_amount?.toLocaleString('en-IN')}
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {p.risk_flags?.slice(0, 1).map((f, fIdx) => (
                          <span key={fIdx} className={`px-2 py-0.5 rounded text-[10px] font-medium border truncate max-w-xs ${
                            isCrit ? 'bg-red-50 text-red-700 border-red-200' : isHigh ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                      {/* Renamed from Inspect to "View Reasons" */}
                      <button
                        onClick={() => onSelectProject(p)}
                        className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-indigo-600" />
                        View Reasons
                      </button>
                      <button
                        onClick={() => onGenerateDossier(p)}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <FileText className="w-3 h-3" />
                        Inquiry Notice
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{Math.min(filtered.length, (currentPage - 1) * pageSize + 1)}</strong> to <strong className="text-slate-800">{Math.min(filtered.length, currentPage * pageSize)}</strong> of <strong className="text-slate-800">{filtered.length.toLocaleString('en-IN')}</strong> records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-semibold flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="px-3 py-1 font-mono font-bold text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-semibold flex items-center gap-1 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
