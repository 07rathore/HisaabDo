import React, { useState, useMemo } from 'react';
import { Users, Search, Camera, AlertCircle, FileCheck, Printer, CheckCircle2, ShieldCheck, MapPin, Send, AlertTriangle } from 'lucide-react';

export default function CitizenPortal({ data }) {
  const [searchArea, setSearchArea] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showRtiModal, setShowRtiModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [citizenStatus, setCitizenStatus] = useState('NOT_BUILT');
  const [citizenNotes, setCitizenNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const projects = data?.projects || [];

  // Filter projects by area / constituency / MP
  const localProjects = useMemo(() => {
    return projects.filter(p => {
      if (!searchArea) return true;
      const q = searchArea.toLowerCase();
      return p.constituency?.toLowerCase().includes(q) ||
        p.state?.toLowerCase().includes(q) ||
        p.mp?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
    });
  }, [projects, searchArea]);

  const totalPages = Math.max(1, Math.ceil(localProjects.length / pageSize));
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return localProjects.slice(start, start + pageSize);
  }, [localProjects, currentPage]);
  const paginationItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [1];
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    if (start > 2) pages.push('ellipsis-left');
    for (let page = start; page <= end; page += 1) {
      if (page !== 1 && page !== totalPages) {
        pages.push(page);
      }
    }
    if (end < totalPages - 1) pages.push('ellipsis-right');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchArea]);

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleOpenRti = (proj) => {
    setSelectedProject(proj);
    setShowRtiModal(true);
  };

  const handleOpenReport = (proj) => {
    setSelectedProject(proj);
    setReportSubmitted(false);
    setShowReportModal(true);
  };

  const handleSubmitGroundReport = (e) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
    }, 2000);
  };

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [alertConstituency, setAlertConstituency] = useState('Jaunpur');

  const handleSubscribeEmail = (e) => {
    e.preventDefault();
    if (!citizenEmail) return;
    setEmailSubscribed(true);
    setTimeout(() => {
      setShowEmailModal(false);
      setEmailSubscribed(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes pageReveal {
          0% { opacity: 0; transform: translateY(8px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pageButtonGlow {
          0% { box-shadow: 0 0 0 rgba(16, 185, 129, 0.0); }
          50% { box-shadow: 0 0 18px rgba(16, 185, 129, 0.18); }
          100% { box-shadow: 0 0 0 rgba(16, 185, 129, 0.0); }
        }
      `}</style>
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Citizen Verification Portal
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Empowering citizens to verify public works, inspect photo proof, submit ground reports, and file formal RTI applications.
        </p>
      </div>

      {/* Citizen Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Public Ground-Truth & Community Audit
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Verify whether claimed works exist in your locality. Submit geo-tagged observations or download pre-formatted <strong>RTI Act 2005 applications</strong> for district offices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmailModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Subscribe to Locality Email Alerts
          </button>
        </div>
      </div>

      {/* Search Input for Citizen's Constituency */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search your district or constituency (e.g. Araria, Jaunpur, Varanasi)..."
            value={searchArea}
            onChange={(e) => setSearchArea(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing <strong className="text-emerald-600 dark:text-emerald-400">{localProjects.length.toLocaleString('en-IN')}</strong> public works
        </div>
      </div>

      {/* Projects List for Citizens */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        style={{ animation: 'pageReveal 0.22s ease-out' }}
      >
        {paginatedProjects.map((proj, idx) => {
          const isNoPhoto = proj.image_status === 'N/A';

          return (
            <div
              key={`${proj.work_id}-${idx}`}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-4 rounded-2xl shadow-xs flex flex-col justify-between space-y-3 transition-all duration-200 ease-out transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                    {proj.work_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isNoPhoto
                      ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900/50'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                  }`}>
                    {isNoPhoto ? '⚠️ Unverified (No Photo)' : '✅ Photo On Portal'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {proj.description}
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Hon'ble MP</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{proj.mp || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Constituency</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{proj.constituency} ({proj.state})</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Completion Claimed</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{proj.completion_date || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Disbursed Cost</span>
                    <p className="font-bold text-slate-900 dark:text-white font-mono">₹{proj.disbursed_amount?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

              {/* Citizen Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleOpenReport(proj)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Submit Ground Check
                </button>

                <button
                  onClick={() => handleOpenRti(proj)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  1-Click RTI Draft
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-[10px] font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-all duration-200 hover:border-emerald-300 hover:text-emerald-700 active:scale-[0.98]"
            >
              Prev
            </button>

            {paginationItems.map((pageNo, index) => {
              if (pageNo === 'ellipsis-left' || pageNo === 'ellipsis-right') {
                return (
                  <span
                    key={`${pageNo}-${index}`}
                    className="px-1 text-[11px] font-bold text-slate-400"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={pageNo}
                  onClick={() => setCurrentPage(pageNo)}
                  className={`min-w-[2rem] px-2 py-1.5 rounded-md border text-[10px] font-bold transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.96] ${
                    currentPage === pageNo
                      ? 'border-emerald-500 bg-gradient-to-b from-emerald-600 to-emerald-500 text-white shadow-md animate-[pageButtonGlow_0.5s_ease-out]'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  {pageNo}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-[10px] font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-all duration-200 hover:border-emerald-300 hover:text-emerald-700 active:scale-[0.98]"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Ground Report Modal */}
      {showReportModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-800 dark:text-slate-200">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Citizen Ground Truth Verification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verify if <strong>{selectedProject.description}</strong> actually exists at the site.
            </p>

            {reportSubmitted ? (
              <div className="my-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ground Report Uploaded!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your observation has been registered and tagged to the vigilance audit record.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitGroundReport} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Observed On-Ground Status</label>
                  <select
                    value={citizenStatus}
                    onChange={(e) => setCitizenStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="NOT_BUILT">🚨 Work Does NOT Exist (Ghost Work)</option>
                    <option value="PARTIAL">⚠️ Incomplete / Substandard Construction</option>
                    <option value="BROKEN">❌ Built but Already Damaged / Broken</option>
                    <option value="VERIFIED">✅ Fully Built as Claimed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Attach Site Photograph (Simulated)</label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500/50 transition-colors bg-slate-50 dark:bg-slate-950">
                    <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-slate-500 dark:text-slate-400">Click to upload geo-tagged site photo proof</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Citizen Observation Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Describe actual condition on site (e.g., road is unpaved, structure was never constructed)..."
                    value={citizenNotes}
                    onChange={(e) => setCitizenNotes(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-white font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs"
                  >
                    Submit Ground Observation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* RTI Modal */}
      {showRtiModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-800 dark:text-slate-200 max-h-[90vh] flex flex-col justify-between">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                RTI Application Draft (Under Section 6(1), RTI Act 2005)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Automated legal draft for filing with the Public Information Officer (PIO) at the District Collectorate.
              </p>
            </div>

            <div className="my-4 overflow-y-auto font-mono text-xs p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-slate-700 dark:text-slate-300">
              <p>To,</p>
              <p>The Public Information Officer (PIO)<br/>
              Office of the District Magistrate & Implementing District Authority (IDA),<br/>
              District: {selectedProject.constituency}, State: {selectedProject.state}</p>

              <p><strong>SUBJECT: APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005 REGARDING MPLADS EXPENDITURE</strong></p>

              <p>Respected Sir/Madam,</p>
              <p>Please provide certified copies and official inspection reports for the following MPLADS public work:</p>

              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Work Description:</strong> {selectedProject.description}</li>
                <li><strong>Official Work ID:</strong> {selectedProject.work_id}</li>
                <li><strong>Disbursed Capital:</strong> ₹{selectedProject.disbursed_amount?.toLocaleString('en-IN')}</li>
                <li><strong>Hon'ble Member of Parliament:</strong> {selectedProject.mp}</li>
                <li><strong>Certified Completion Date:</strong> {selectedProject.completion_date || 'N/A'}</li>
              </ul>

              <p><strong>SPECIFIC INFORMATION SOUGHT:</strong></p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Certified copy of the <strong>Measurement Book (MB)</strong> containing running itemized civil measurements.</li>
                <li>Certified copy of the <strong>Completion Certificate & Joint Inspection Report</strong> signed by the Junior Engineer (JE).</li>
                <li>Original high-resolution <strong>geo-tagged photographs</strong> captured at the time of final bill payment.</li>
                <li>Certified details of the selected contractor and copy of the work order.</li>
              </ol>

              <p>I state that the information sought does not fall under the exemptions contained in Section 8 & 9 of the Act.</p>
              <p>Applicant: Citizen of India</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowRtiModal(false)}
                className="px-3 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-white text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF RTI Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Alert Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 text-slate-800 dark:text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Subscribe to Constituency Alerts
              </h3>
              <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {emailSubscribed ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Alerts Subscribed!</h4>
                <p className="text-xs text-slate-500">You will receive notifications whenever a high-risk or ghost work is flagged in your constituency.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribeEmail} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Constituency</label>
                  <input
                    type="text"
                    required
                    value={alertConstituency}
                    onChange={(e) => setAlertConstituency(e.target.value)}
                    placeholder="e.g. Jaunpur, Varanasi, Puri"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setShowEmailModal(false)} className="px-3 py-1.5 text-slate-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs">
                    Confirm Subscription
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
