import React, { useState, useMemo } from 'react';
import { Compass, AlertTriangle, Scale, Search, ShieldAlert, ArrowUpDown, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function RoadIntelligence({ data, onSelectProject, onGenerateDossier }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [minInflation, setMinInflation] = useState('ALL');

  const projects = data?.projects || [];

  // Filter only projects where road length was extracted
  const roadProjects = useMemo(() => {
    return projects.filter(p => p.road_length_m && p.cost_per_meter);
  }, [projects]);

  const filteredRoads = useMemo(() => {
    return roadProjects.filter(p => {
      const matchSearch = searchTerm === '' ||
        p.mp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.constituency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const rate = p.cost_per_meter;
      let matchInflation = true;
      if (minInflation === 'EXTREME') matchInflation = rate >= 8000;
      else if (minInflation === 'ELEVATED') matchInflation = rate >= 4500 && rate < 8000;
      else if (minInflation === 'NORMAL') matchInflation = rate < 4500;

      return matchSearch && matchInflation;
    }).sort((a, b) => b.cost_per_meter - a.cost_per_meter);
  }, [roadProjects, searchTerm, minInflation]);

  const avgCostPerMeter = useMemo(() => {
    if (roadProjects.length === 0) return 0;
    const total = roadProjects.reduce((sum, p) => sum + p.cost_per_meter, 0);
    return Math.round(total / roadProjects.length);
  }, [roadProjects]);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/30 p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Compass className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-black text-white tracking-wide">
                Road Infrastructure & BOQ Unit-Rate Intelligence
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Autonomous NLP algorithms extract physical road lengths (<span className="font-mono text-amber-300">m, km, ft</span>) from unstructured sanction descriptions, computing unit expenditure (<span className="font-mono text-purple-300">₹ / meter</span>) against State PWD Standard Schedule of Rates (SSR baseline ~₹2,200/m).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-purple-500/30 p-3 rounded-xl text-center min-w-[120px]">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Audited Roads</span>
              <p className="text-xl font-black text-purple-300 font-mono">{roadProjects.length}</p>
            </div>
            <div className="bg-slate-950/80 border border-purple-500/30 p-3 rounded-xl text-center min-w-[120px]">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Avg Unit Cost</span>
              <p className="text-xl font-black text-amber-300 font-mono">₹{avgCostPerMeter.toLocaleString('en-IN')}<span className="text-xs text-slate-400">/m</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search road descriptions or MP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={minInflation}
            onChange={(e) => setMinInflation(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Rates</option>
            <option value="EXTREME">🚨 Extreme Inflation (&ge; ₹8,000/m)</option>
            <option value="ELEVATED">⚠️ Elevated (&ge; ₹4,500/m)</option>
            <option value="NORMAL">✅ Normal / Benchmark (&lt; ₹4,500/m)</option>
          </select>
        </div>
      </div>

      {/* Road Works Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Road Work & Location</th>
                <th className="p-3.5">Extracted Length</th>
                <th className="p-3.5">Disbursed Capital</th>
                <th className="p-3.5">Computed Rate / Meter</th>
                <th className="p-3.5">Benchmark Comparison</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRoads.map((proj, idx) => {
                const isExtreme = proj.cost_per_meter >= 8000;
                const isElevated = proj.cost_per_meter >= 4500 && proj.cost_per_meter < 8000;
                const multiplier = (proj.cost_per_meter / 2200).toFixed(1);

                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    {/* Description & MP */}
                    <td className="p-3.5 max-w-sm">
                      <div className="font-semibold text-white line-clamp-2">{proj.description}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {proj.mp} • <span className="text-slate-500">{proj.constituency}, {proj.state}</span>
                      </div>
                    </td>

                    {/* Extracted Length */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono font-bold text-white text-xs">
                        {proj.road_length_m} meters
                      </span>
                    </td>

                    {/* Disbursed Amount */}
                    <td className="p-3.5 whitespace-nowrap font-mono font-bold text-slate-200">
                      ₹{proj.disbursed_amount?.toLocaleString('en-IN')}
                    </td>

                    {/* Cost per meter */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className={`font-mono font-black text-sm ${
                        isExtreme ? 'text-red-400' : isElevated ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        ₹{proj.cost_per_meter?.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/m</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        SSR baseline: ₹2,200/m
                      </div>
                    </td>

                    {/* Multiplier Badge */}
                    <td className="p-3.5 whitespace-nowrap">
                      {isExtreme ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                          {multiplier}x SSR Rate (Severe)
                        </span>
                      ) : isElevated ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1">
                          {multiplier}x SSR Rate (High)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Within Benchmark
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => onSelectProject(proj)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        Inspect
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
      </div>
    </div>
  );
}
