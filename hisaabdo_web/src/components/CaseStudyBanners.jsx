import React from 'react';
import { AlertOctagon, TrendingUp, Calendar, MapPin, Zap } from 'lucide-react';

export default function CaseStudyBanners({ onSelectCase }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 mb-6 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Verified High-Impact Frauds in Dataset
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Click to Investigate
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous detections generated from official MoSPI CSVs without manual curation
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Case 1: Babu Singh Kushwaha */}
        <div
          onClick={() => onSelectCase({ mp: 'BABU SINGH KUSHWAHA' })}
          className="group cursor-pointer bg-slate-950/80 hover:bg-slate-900 border border-red-500/30 hover:border-red-500/70 p-3.5 rounded-xl transition-all shadow-md hover:shadow-red-950/20"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              Audit Threshold Slicing
            </span>
            <span className="text-xs font-mono font-bold text-red-300">95.6% Flagged</span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
            BABU SINGH KUSHWAHA (UP)
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            499 works artificially priced between <span className="text-amber-300 font-mono">₹19,000–₹19,992</span> (just ₹8 below ₹20k mandatory audit threshold). 
          </p>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
            <span>Constituency: Jaunpur</span>
            <span className="text-red-400 font-semibold flex items-center gap-1">
              Investigate &rarr;
            </span>
          </div>
        </div>

        {/* Case 2: Mass Single-Day Batch Approvals */}
        <div
          onClick={() => onSelectCase({ filterHighBatch: true })}
          className="group cursor-pointer bg-slate-950/80 hover:bg-slate-900 border border-amber-500/30 hover:border-amber-500/70 p-3.5 rounded-xl transition-all shadow-md hover:shadow-amber-950/20"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Physical Impossibility
            </span>
            <span className="text-xs font-mono font-bold text-amber-300">&gt;50 Works/Day</span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
            Mass Single-Day Sign-offs
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            District authorities issuing up to 50–255 completion certificates on a single calendar day. Zero physical feasibility.
          </p>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
            <span>IDA Temporal Anomaly</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              Filter Batch Sign-offs &rarr;
            </span>
          </div>
        </div>

        {/* Case 3: Road Length & Meter Rate Inflation */}
        <div
          onClick={() => onSelectCase({ tab: 'roads' })}
          className="group cursor-pointer bg-slate-950/80 hover:bg-slate-900 border border-purple-500/30 hover:border-purple-500/70 p-3.5 rounded-xl transition-all shadow-md hover:shadow-purple-950/20"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              BOQ & Length Analytics
            </span>
            <span className="text-xs font-mono font-bold text-purple-300">&gt;4x SSR Rate</span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
            Road Cost Per Meter Inflation
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            NLP length extraction identifies roads charged at <span className="text-purple-300 font-mono">&gt;₹8,000/m</span> vs standard state SSR baseline of ₹2,200/m.
          </p>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
            <span>1,593 Road Works Audited</span>
            <span className="text-purple-400 font-semibold flex items-center gap-1">
              Open Road Lab &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
