import React, { useMemo, useState } from 'react';
import { ShieldAlert, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export default function RiskAnalysisView({ data, onSelectProject, onGenerateDossier }) {
  const summary = data?.summary || {};
  const suspectMps = data?.top_suspect_mps || [];
  const projects = data?.projects || [];
  const [selectedMp, setSelectedMp] = useState(suspectMps[0]?.mp || null);
  const [mpDetailOpen, setMpDetailOpen] = useState(false);

  const mlOutliers = summary.ml_outliers_count || 1527;

  const selectedMpDetails = useMemo(() => {
    const mpData = suspectMps.find((m) => m.mp === selectedMp) || suspectMps[0];
    return mpData || null;
  }, [selectedMp, suspectMps]);

  const flaggedProjectsForMp = useMemo(() => {
    if (!selectedMpDetails) return [];
    return projects
      .filter((project) => project.mp === selectedMpDetails.mp)
      .filter((project) => project.risk_level === 'CRITICAL' || project.risk_level === 'HIGH' || project.risk_level === 'MEDIUM')
      .sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))
      .slice(0, 8);
  }, [selectedMpDetails, projects]);

  const openMpPopup = (mpName) => {
    setSelectedMp(mpName);
    setMpDetailOpen(true);
  };

  const closeMpPopup = () => {
    setMpDetailOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          MP Risk Profiles & Expenditure Assessment
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Constituency-wise audit breakdown, comparing allocated limits against actual project execution and outlier rates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
              Isolation Forest (Multivariate Model)
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              5 Dimensions
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Measures project anomaly scores across 5 independent operational metrics:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">1. Disbursed Capital Log-Value</span>
              <span className="text-[10px] font-mono text-slate-400">log(₹ expenditure)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">2. Completion Turnaround Days</span>
              <span className="text-[10px] font-mono text-slate-400">Sanction to Completion</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">3. Same-Day Sign-off Concentration</span>
              <span className="text-[10px] font-mono text-slate-400">Batch sign-offs / day</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">4. Category Price Z-Score</span>
              <span className="text-[10px] font-mono text-slate-400">Deviation from median</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">5. Agency Concentration Ratio</span>
              <span className="text-[10px] font-mono text-slate-400">Single IDA monopoly</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Statutory Procurement Rules
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              GFR 2017 & MoSPI
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Deterministic rules based on public procurement regulations:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-300">
              <div className="flex justify-between font-bold text-[11px]">
                <span>Threshold Gaming (&lt;₹20,000)</span>
                <span>₹18,000–₹19,999</span>
              </div>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">
                Splitting works below ₹20,000 to circumvent mandatory administrative audit.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 text-orange-900 dark:text-orange-300">
              <div className="flex justify-between font-bold text-[11px]">
                <span>e-Tendering Bypass (&lt;₹2 Lakhs)</span>
                <span>₹1,90,000–₹1,99,999</span>
              </div>
              <p className="text-[10px] text-orange-700 dark:text-orange-400 mt-0.5">
                Splitting works just below ₹2,00,000 to avoid mandatory GeM e-procurement tenders.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 text-purple-900 dark:text-purple-300">
              <div className="flex justify-between font-bold text-[11px]">
                <span>Road Cost Benchmark</span>
                <span>&gt; ₹4,500 / meter</span>
              </div>
              <p className="text-[10px] text-purple-700 dark:text-purple-400 mt-0.5">
                Civil linear roads exceeding standard PWD schedule rates (~₹2,200/m).
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Risk Assessment by Hon'ble Member of Parliament
          </h3>
          <p className="text-[11px] text-slate-400">
            Ranked by percentage of flagged works across total sanctioned projects
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Hon'ble MP Name</th>
                <th className="p-3.5">Constituency & State</th>
                <th className="p-3.5">Allocated Limit (₹)</th>
                <th className="p-3.5">Utilization %</th>
                <th className="p-3.5">Total Works</th>
                <th className="p-3.5">Flagged Works</th>
                <th className="p-3.5">Risk Flag %</th>
                <th className="p-3.5">Calamity Grants</th>
                <th className="p-3.5">Flagged Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {suspectMps.slice(0, 15).map((m, idx) => (
                <tr key={idx} onClick={() => openMpPopup(m.mp)} className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${selectedMp === m.mp ? 'bg-indigo-50/80 dark:bg-indigo-950/30' : ''}`}>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {m.mp}
                  </td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {m.constituency}, {m.state}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-indigo-700 dark:text-indigo-400">
                    ₹{((m.allocated_limit || 150000000) / 10000000).toFixed(2)} Cr
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {m.utilization_pct || ((m.total_spend / 150000000) * 100).toFixed(1)}%
                  </td>
                  <td className="p-3.5 font-mono font-bold">{m.total_works}</td>
                  <td className="p-3.5 font-mono font-bold text-red-600 dark:text-red-400">{m.flagged_works}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                      m.flag_pct >= 70
                        ? 'bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300'
                        : 'bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300'
                    }`}>
                      {m.flag_pct}%
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    {m.calamity_total > 0 ? `₹${(m.calamity_total / 100000).toFixed(1)}L` : '—'}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-red-700 dark:text-red-400">
                    ₹{m.flagged_spend?.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {mpDetailOpen && selectedMpDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">Selected MP Profile</div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{selectedMpDetails.mp}</h3>
              </div>
              <button
                onClick={closeMpPopup}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5">
                  <div className="text-slate-400 uppercase font-bold">Allocated</div>
                  <div className="font-black text-slate-900 dark:text-white mt-1 font-mono">₹{(selectedMpDetails.allocated_limit || 0).toLocaleString('en-IN')}</div>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5">
                  <div className="text-slate-400 uppercase font-bold">Utilization</div>
                  <div className="font-black text-slate-900 dark:text-white mt-1 font-mono">{selectedMpDetails.utilization_pct || 0}%</div>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5">
                  <div className="text-slate-400 uppercase font-bold">Flagged Works</div>
                  <div className="font-black text-red-600 dark:text-red-400 mt-1 font-mono">{selectedMpDetails.flagged_works || 0}</div>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-2.5">
                  <div className="text-slate-400 uppercase font-bold">Risk Flag</div>
                  <div className="font-black text-orange-600 dark:text-orange-400 mt-1 font-mono">{selectedMpDetails.flag_pct || 0}%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Most red-flagged projects</div>
                  {flaggedProjectsForMp.map((project) => (
                    <div key={project.work_id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{project.work_id}</div>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${project.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'}`}>
                          {project.risk_level}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-slate-900 dark:text-white">{project.description}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                        <span>₹{(project.disbursed_amount || 0).toLocaleString('en-IN')}</span>
                        <span>Score {project.risk_score}</span>
                      </div>
                      <button
                        onClick={() => {
                          onSelectProject(project);
                          closeMpPopup();
                        }}
                        className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Open details <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">MP summary</div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 text-xs space-y-2">
                    <div className="flex justify-between"><span>Constituency</span><span className="font-bold text-slate-900 dark:text-white">{selectedMpDetails.constituency}</span></div>
                    <div className="flex justify-between"><span>State</span><span className="font-bold text-slate-900 dark:text-white">{selectedMpDetails.state}</span></div>
                    <div className="flex justify-between"><span>Flagged spend</span><span className="font-mono font-bold text-red-600 dark:text-red-400">₹{(selectedMpDetails.flagged_spend || 0).toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span>Calamity grants</span><span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">₹{(selectedMpDetails.calamity_total || 0).toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span>High-risk share</span><span className="font-mono font-bold text-orange-600 dark:text-orange-400">{selectedMpDetails.flag_pct || 0}%</span></div>
                    <div className="flex justify-between"><span>Total works</span><span className="font-mono font-bold text-slate-900 dark:text-white">{selectedMpDetails.total_works || 0}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
