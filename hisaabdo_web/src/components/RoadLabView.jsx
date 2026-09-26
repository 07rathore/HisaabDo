import React, { useState, useMemo } from 'react';
import { Compass, AlertTriangle, Scale, Search, ShieldAlert, ArrowUpDown, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function RoadLabView({ data, onSelectProject, onGenerateDossier }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [rateFilter, setRateFilter] = useState('ALL');

  const projects = data?.projects || [];

  // Strictly validated road works
  const roadProjects = useMemo(() => {
    return projects.filter(p => p.road_length_m && p.cost_per_meter && p.is_road !== false);
  }, [projects]);

  const filteredRoads = useMemo(() => {
    return roadProjects.filter(p => {
      const matchSearch = !searchTerm ||
        p.mp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.constituency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const rate = p.cost_per_meter;
      let matchRate = true;
      if (rateFilter === 'EXTREME') matchRate = rate >= 8000;
      else if (rateFilter === 'ELEVATED') matchRate = rate >= 4500 && rate < 8000;
      else if (rateFilter === 'NORMAL') matchRate = rate < 4500;

      return matchSearch && matchRate;
    }).sort((a, b) => b.cost_per_meter - a.cost_per_meter);
  }, [roadProjects, searchTerm, rateFilter]);

  const avgCostPerMeter = useMemo(() => {
    if (roadProjects.length === 0) return 0;
    const total = roadProjects.reduce((sum, p) => sum + p.cost_per_meter, 0);
    return Math.round(total / roadProjects.length);
  }, [roadProjects]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Road Works & Rate Analysis
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Compares linear road construction costs per meter against State PWD Standard Schedule of Rates (SSR benchmark: ~₹2,200/meter).
        </p>
      </div>

      {/* Summary KPI Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Linear Civil Road Verification
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Evaluates genuine concrete (CC/PCC) and paver block roads by extracted running length. Flags rates exceeding standard PWD schedule thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 p-3 rounded-xl text-center min-w-[120px]">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Validated Roads</span>
            <p className="text-xl font-black text-slate-900 dark:text-white font-mono">{roadProjects.length}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 p-3 rounded-xl text-center min-w-[120px]">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Avg Rate / Meter</span>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
              ₹{avgCostPerMeter.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/m</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search road descriptions, MP, or constituency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={rateFilter}
            onChange={(e) => setRateFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Rates</option>
            <option value="EXTREME">🚨 Severe Inflation (≥ ₹8,000/m)</option>
            <option value="ELEVATED">⚠️ Elevated (≥ ₹4,500/m)</option>
            <option value="NORMAL">✅ Within Benchmark (&lt; ₹4,500/m)</option>
          </select>
        </div>
      </div>

      {/* Road Works Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Road Work & Location</th>
                <th className="p-3.5">Extracted Length</th>
                <th className="p-3.5">Disbursed Capital</th>
                <th className="p-3.5">Calculated Rate / Meter</th>
                <th className="p-3.5">SSR Benchmark Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRoads.slice(0, 50).map((proj, idx) => {
                const isExtreme = proj.cost_per_meter >= 8000;
                const isElevated = proj.cost_per_meter >= 4500 && proj.cost_per_meter < 8000;
                const multiplier = (proj.cost_per_meter / 2200).toFixed(1);

                return (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 max-w-sm">
                      <p className="font-bold text-slate-900 dark:text-white line-clamp-2">{proj.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {proj.mp} • {proj.constituency}, {proj.state}
                      </p>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-slate-200 text-xs">
                        {proj.road_length_m} meters
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-mono font-bold text-slate-900 dark:text-white">
                      ₹{proj.disbursed_amount?.toLocaleString('en-IN')}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className={`font-mono font-black text-sm ${
                        isExtreme ? 'text-red-600 dark:text-red-400' : isElevated ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        ₹{proj.cost_per_meter?.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/m</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        SSR baseline: ₹2,200/m
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      {isExtreme ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
                          {multiplier}x SSR Rate (Severe)
                        </span>
                      ) : isElevated ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 inline-flex items-center gap-1">
                          {multiplier}x SSR Rate (Elevated)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          Within Benchmark
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => onSelectProject(proj)}
                        className="px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        View Reasons
                      </button>
                      <button
                        onClick={() => onGenerateDossier(proj)}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs cursor-pointer"
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
      </div>
    </div>
  );
}
