import React, { useMemo, useState } from 'react';
import { Layers, AlertTriangle, Search, FileText, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export default function DuplicateDetectionView({ data, onGenerateDossier }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClusterId, setSelectedClusterId] = useState(null);
  const [clusterDetailOpen, setClusterDetailOpen] = useState(false);
  const clusters = data?.duplicate_clusters || [];
  const projects = data?.projects || [];

  const filteredClusters = useMemo(() => {
    return clusters.filter(c => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return c.mp?.toLowerCase().includes(q) ||
             c.constituency?.toLowerCase().includes(q) ||
             c.repeated_description?.toLowerCase().includes(q);
    });
  }, [clusters, searchTerm]);

  const selectedCluster = filteredClusters.find(c => c.cluster_id === selectedClusterId) || filteredClusters[0] || null;

  const clusterProjects = useMemo(() => {
    if (!selectedCluster) return [];
    return selectedCluster.work_ids
      .map(workId => projects.find(p => p.work_id === workId))
      .filter(Boolean)
      .sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0));
  }, [selectedCluster, projects]);

  const openClusterPopup = (cluster) => {
    setSelectedClusterId(cluster.cluster_id);
    setClusterDetailOpen(true);
  };

  const closeClusterPopup = () => {
    setClusterDetailOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Duplicate Project Detection
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Identifies cloned project descriptions and repetitive public fund claims across the same constituency.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Repetitive Work Descriptions & Cloned Claims
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Flags identical text entries sanctioned repeatedly under the same MP or district authority where separate funds were drawn for the same nominal work.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 p-3 rounded-xl text-center min-w-[120px]">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Detected Clusters</span>
            <p className="text-xl font-black text-slate-900 dark:text-white font-mono">{clusters.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by MP, constituency, or description text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing <span className="font-bold text-slate-900 dark:text-white">{filteredClusters.length}</span> duplicate clusters
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Cluster ID</th>
                <th className="p-3.5">Hon'ble MP & Constituency</th>
                <th className="p-3.5">Repeated Description</th>
                <th className="p-3.5">Identical Works Count</th>
                <th className="p-3.5">Total Claimed Funds</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredClusters.map((c, idx) => (
                <tr
                  key={idx}
                  onClick={() => openClusterPopup(c)}
                  className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${selectedCluster?.cluster_id === c.cluster_id ? 'bg-indigo-50/70 dark:bg-indigo-950/40' : ''}`}
                >
                  <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                    {c.cluster_id}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <p className="font-bold text-slate-900 dark:text-white">{c.mp}</p>
                    <p className="text-[10px] text-slate-400">{c.constituency}</p>
                  </td>
                  <td className="p-3.5 max-w-sm">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 italic">
                      "{c.repeated_description}"
                    </p>
                    <div className="flex gap-1 mt-1 text-[10px] text-slate-400 font-mono">
                      <span>Sample IDs: {c.work_ids?.slice(0, 2).join(', ')}</span>
                    </div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black font-mono bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60 inline-flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
                      {c.count} identical works
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap font-mono font-bold text-slate-900 dark:text-white">
                    ₹{c.total_funds?.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        const sampleProj = projects.find(p => p.work_id === c.work_ids[0]) || {
                          work_id: c.work_ids[0],
                          mp: c.mp,
                          constituency: c.constituency,
                          description: c.repeated_description,
                          disbursed_amount: c.total_funds / c.count,
                          risk_score: 85,
                          risk_level: 'CRITICAL',
                          risk_flags: [`Description Cloning: Repeated ${c.count} times for identical work claim`]
                        };
                        onGenerateDossier(sampleProj);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      Inquiry Notice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {clusterDetailOpen && selectedCluster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">Selected Duplicate Cluster</div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{selectedCluster.cluster_id}</h3>
              </div>
              <button
                onClick={closeClusterPopup}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Description</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white italic">"{selectedCluster.repeated_description}"</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                  <span>{selectedCluster.mp}</span>
                  <span>{selectedCluster.constituency}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900">
                  <div className="text-slate-400 uppercase font-bold">Total Amount</div>
                  <div className="mt-1 font-black text-slate-900 dark:text-white font-mono">₹{selectedCluster.total_funds?.toLocaleString('en-IN')}</div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-900">
                  <div className="text-slate-400 uppercase font-bold">Average Per Work</div>
                  <div className="mt-1 font-black text-slate-900 dark:text-white font-mono">₹{((selectedCluster.total_funds || 0) / (selectedCluster.count || 1)).toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                  Related project list
                </div>
                <div className="space-y-2 max-h-[430px] overflow-y-auto pr-1">
                  {clusterProjects.length ? clusterProjects.map((project) => (
                    <div key={project.work_id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{project.work_id}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${project.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'}`}>
                          {project.risk_level}
                        </span>
                      </div>
                      <div className="mt-2 text-xs font-semibold text-slate-900 dark:text-white leading-snug">{project.description || selectedCluster.repeated_description}</div>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                        <span>₹{(project.disbursed_amount || 0).toLocaleString('en-IN')}</span>
                        <span>{project.image_status || 'Images'}</span>
                      </div>
                      <button
                        onClick={() => {
                          onGenerateDossier(project);
                          closeClusterPopup();
                        }}
                        className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Open details <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )) : (
                    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-3 text-xs text-slate-500 dark:text-slate-400">
                      No matching project records were found for this cluster.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
