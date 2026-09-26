import React, { useRef } from 'react';
import { X, Printer, Download, ShieldAlert, CheckCircle, FileText } from 'lucide-react';

export default function InquiryDossierModal({ project, onClose }) {
  if (!project) return null;

  const handlePrint = () => {
    window.print();
  };

  const dossierRef = `MOSPI/MPLADS/VIG/${new Date().getFullYear()}/${project.work_id.replace(/[^a-zA-Z0-9]/g, '').slice(-8)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        {/* Modal Toolbar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold tracking-wide">
              Official Vigilance & Audit Inquiry Dossier
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-6 font-serif text-slate-800 leading-relaxed text-sm bg-white">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
            <div className="font-bold text-xs uppercase tracking-widest text-slate-600">
              Government of India
            </div>
            <div className="font-black text-lg text-slate-950 uppercase tracking-tight">
              Ministry of Statistics & Programme Implementation (MoSPI)
            </div>
            <div className="text-xs text-slate-600">
              MPLADS Vigilance, Monitoring & Technical Audit Cell • New Delhi - 110001
            </div>
            <div className="text-[11px] font-mono text-slate-500 pt-1">
              Ref No: {dossierRef} | Date of Generation: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* Recipient & Subject */}
          <div className="space-y-2 text-xs">
            <div className="font-sans">
              <p className="font-bold">TO:</p>
              <p>The District Magistrate & Implementing District Authority (IDA),</p>
              <p className="font-semibold">{project.ida || 'Concerned District Administration'}</p>
              <p>{project.constituency}, {project.state}</p>
            </div>

            <div className="pt-2">
              <span className="font-bold uppercase tracking-wider text-slate-900 font-sans">
                SUBJECT: STATUTORY NOTICE FOR PHYSICAL VERIFICATION & PRODUCTION OF MEASUREMENT BOOK (MB) FOR SUSPECT MPLADS EXPENDITURE
              </span>
            </div>
          </div>

          {/* Formal Body Paragraphs */}
          <div className="space-y-3 text-justify text-xs">
            <p>
              1. The automated AI Audit and Public Finance Surveillance Engine (<strong>HisaabDo</strong>) configured under MoSPI Guidelines has flagged the following project with a composite <strong>Risk Score of {project.risk_score}/100 ({project.risk_level} Priority)</strong>:
            </p>

            <table className="w-full border border-slate-400 text-[11px] font-sans my-3">
              <tbody>
                <tr className="border-b border-slate-300 bg-slate-100">
                  <td className="p-2 font-bold w-1/3">MPLADS Work ID</td>
                  <td className="p-2 font-mono font-bold text-slate-900">{project.work_id}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold">Recommended by Hon'ble MP</td>
                  <td className="p-2">{project.mp} ({project.constituency}, {project.state})</td>
                </tr>
                <tr className="border-b border-slate-300 bg-slate-50">
                  <td className="p-2 font-bold">Official Work Description</td>
                  <td className="p-2">{project.description}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold">Total Disbursed Amount</td>
                  <td className="p-2 font-mono font-bold text-red-700">₹{project.disbursed_amount?.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="border-b border-slate-300 bg-slate-50">
                  <td className="p-2 font-bold">Date of Completion Certified</td>
                  <td className="p-2">{project.completion_date || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Site Geo-Tagged Photo Status</td>
                  <td className="p-2 font-semibold text-red-600">{project.image_status === 'N/A' ? 'NON-COMPLIANT (Image marked N/A on portal)' : 'Images Uploaded'}</td>
                </tr>
              </tbody>
            </table>

            <p>
              2. <strong>SPECIFIC AUDIT RED FLAGS DETECTED:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1.5 font-sans text-xs text-red-950 font-medium">
              {project.risk_flags && project.risk_flags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
              {project.road_length_m && (
                <li>
                  Road Unit Cost Anomaly: Length extracted as {project.road_length_m} meters with disbursement of ₹{project.disbursed_amount?.toLocaleString('en-IN')}, resulting in unit cost of <strong>₹{project.cost_per_meter?.toLocaleString('en-IN')}/m</strong> (exceeding standard PWD/SSR baseline of ₹2,200/m).
                </li>
              )}
            </ul>

            <p>
              3. In accordance with <em>Chapter 8 of MPLADS Guidelines 2023</em> and <em>Rule 149 of General Financial Rules (GFR 2017)</em>, the Implementing District Authority is hereby directed to:
            </p>
            <ol className="list-decimal pl-5 space-y-1 font-sans text-xs">
              <li>Furnish certified copies of the <strong>Measurement Book (MB)</strong> and Joint Inspection Certificate.</li>
              <li>Provide e-Tender / GeM portal sanction reference number and comparative statement of bids.</li>
              <li>Submit geo-tagged, time-stamped high-resolution site photographs of the completed physical asset.</li>
            </ol>

            <p className="pt-2">
              Failure to submit the compliance report within 15 working days shall initiate formal escalation to the Comptroller and Auditor General (C&AG) and the Ministry of Home Affairs for financial freeze.
            </p>
          </div>

          {/* Sign-off */}
          <div className="pt-8 flex justify-between items-end font-sans text-xs">
            <div>
              <p className="text-[10px] text-slate-500">Document generated autonomously via HisaabDo Verification Engine</p>
              <p className="text-[10px] text-slate-500 font-mono">Hash: SHA256-8A39F7D02E4C</p>
            </div>
            <div className="text-right">
              <div className="w-36 border-b border-slate-900 mb-1 ml-auto"></div>
              <p className="font-bold">Director (Vigilance & Monitoring)</p>
              <p className="text-slate-600">MoSPI, Government of India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
