import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  CheckCircle2,
  Users,
  Send,
  Camera,
  ThumbsUp,
  FileCheck,
  ShieldAlert,
  Search,
  Filter,
  MessageSquare,
  Scale,
  Award,
  ArrowRight
} from 'lucide-react';

export default function CitizenActionCenterView({ data, onSelectProject, onGenerateDossier }) {
  const projects = data?.projects || [];

  const [communityReports, setCommunityReports] = useState([
    {
      id: 'REP-2026-081',
      workId: 'UP/2024-2025/1102',
      mp: 'BABU SINGH KUSHWAHA',
      constituency: 'JAUNPUR',
      issue: 'Claimed 400m PCC Road physically measures only 130m. Remaining stretch is dirt track.',
      amount: 199920,
      reportedBy: 'Vikas Dubey (Local Resident, Ward 12)',
      upvotes: 42,
      status: 'UNDER_INQUIRY',
      date: '24 Sep 2026',
      evidencePhotos: 2
    },
    {
      id: 'REP-2026-079',
      workId: 'OD/2024-2025/443',
      mp: 'SAMBIT PATRA',
      constituency: 'PURI',
      issue: 'Solar High-Mast light sanctioned ₹2,50,000 does not exist at temple junction.',
      amount: 250000,
      reportedBy: 'Priyabrata Mohanty (Civic Watch Puri)',
      upvotes: 68,
      status: 'VIGILANCE_DISPATCHED',
      date: '22 Sep 2026',
      evidencePhotos: 3
    },
    {
      id: 'REP-2026-074',
      workId: 'BR/2024-2025/903',
      mp: 'PRADEEP KUMAR SINGH',
      constituency: 'ARARIA',
      issue: 'Community Hall marked complete 100%, but roof slabs and plastering incomplete.',
      amount: 495000,
      reportedBy: 'Md. Tariq Anwar (Youth Forum)',
      upvotes: 31,
      status: 'PENDING_COLLECTOR_VISIT',
      date: '19 Sep 2026',
      evidencePhotos: 4
    }
  ]);

  const [newIssueText, setNewIssueText] = useState('');
  const [selectedWorkId, setSelectedWorkId] = useState(projects[0]?.work_id || '');
  const [reporterName, setReporterName] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const handleUpvote = (id) => {
    setCommunityReports(prev =>
      prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r)
    );
  };

  const handleCreateReport = (e) => {
    e.preventDefault();
    if (!newIssueText || !selectedWorkId) return;

    const matchedProject = projects.find(p => p.work_id === selectedWorkId) || {};

    const newReport = {
      id: `REP-2026-0${Math.floor(100 + Math.random() * 900)}`,
      workId: selectedWorkId,
      mp: matchedProject.mp || 'Local MP',
      constituency: matchedProject.constituency || 'General',
      issue: newIssueText,
      amount: matchedProject.disbursed_amount || 200000,
      reportedBy: reporterName || 'Verified Citizen',
      upvotes: 1,
      status: 'PENDING_VERIFICATION',
      date: 'Just Now',
      evidencePhotos: 1
    };

    setCommunityReports([newReport, ...communityReports]);
    setSubmittedSuccess(true);
    setNewIssueText('');
    setTimeout(() => setSubmittedSuccess(false), 2500);
  };

  const filteredReports = communityReports.filter(r => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Section 7: Citizen Action Center & Community Tribunal
          </h2>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Public Civic Power
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Decentralized social audit tribunal. Public crowdsourced ground checks, whistleblower escalation to CVC, and community petitions.
        </p>
      </div>

      {/* 3 Action Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Community Audits</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-black text-slate-900 font-mono">
            {communityReports.length} Active Dossiers
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            141 Local Citizens Corroborated
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Public Funds Challenged</span>
            <Scale className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg font-black text-slate-900 font-mono">
            ₹{((communityReports.reduce((a, b) => a + b.amount, 0)) / 100000).toFixed(1)} Lakhs
          </p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Subject to ground physical survey
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Inquiries Dispatched</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-lg font-black text-red-600 font-mono">
            2 Formal Show-Causes
          </p>
          <span className="text-[11px] text-red-500 font-medium mt-1 block">
            Transmitted to District Collectors
          </span>
        </div>
      </div>

      {/* Main Grid: Live Community Cases (8 cols) + File New Discrepancy (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Community Cases Feed (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Public Vigilance Feed</span>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                Crowdsourced Discrepancies & Ground Verification
              </h3>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Reports</option>
                <option value="UNDER_INQUIRY">Under Inquiry</option>
                <option value="VIGILANCE_DISPATCHED">Vigilance Dispatched</option>
                <option value="PENDING_COLLECTOR_VISIT">Pending Collector Visit</option>
              </select>
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-3.5">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {report.id}
                    </span>
                    <span className="font-mono text-xs text-slate-500 font-semibold">{report.workId}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                    report.status === 'UNDER_INQUIRY' ? 'bg-orange-100 text-orange-800' :
                    report.status === 'VIGILANCE_DISPATCHED' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {report.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Issue Description */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs leading-relaxed">
                    "{report.issue}"
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    MP: <strong className="text-slate-800">{report.mp}</strong> • Constituency: <strong>{report.constituency}</strong> • Value: ₹{report.amount?.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Footer and Upvoting */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[11px]">
                  <span className="text-slate-500">
                    Reported by <strong className="text-slate-700">{report.reportedBy}</strong> ({report.date})
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpvote(report.id)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      title="Corroborate as local resident"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{report.upvotes}</span> Corroborate
                    </button>

                    <button
                      onClick={() => {
                        const p = projects.find(item => item.work_id === report.workId);
                        if (p) onSelectProject(p);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      Audit Details <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Whistleblower Reporting Console (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Civic Action</span>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              File Citizen Ground Check
            </h3>
          </div>

          {submittedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Discrepancy registered! Added to public action feed.</span>
            </div>
          )}

          <form onSubmit={handleCreateReport} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Project Work ID</label>
              <select
                value={selectedWorkId}
                onChange={(e) => setSelectedWorkId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {projects.slice(0, 40).map(p => (
                  <option key={p.work_id} value={p.work_id}>
                    {p.work_id} — {p.description.slice(0, 40)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Your Name / Civic Organization</label>
              <input
                type="text"
                placeholder="e.g. Sunil Yadav (Ward 8)"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Observed Discrepancy / Ground Reality</label>
              <textarea
                rows={3}
                required
                placeholder="Describe ground reality (e.g., Road is 150m instead of 400m, no sign board, sub-standard materials used, work abandoned)..."
                value={newIssueText}
                onChange={(e) => setNewIssueText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="p-3 rounded-xl border border-dashed border-slate-300 text-center cursor-pointer hover:border-emerald-500 bg-slate-50">
              <Camera className="w-5 h-5 text-slate-400 mx-auto mb-1" />
              <span className="text-[11px] text-slate-500 block font-medium">Attach Geo-Tagged Evidence Photo</span>
              <span className="text-[10px] text-slate-400">Auto-embeds GPS EXIF coordinates</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Post Ground Check to Action Registry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
