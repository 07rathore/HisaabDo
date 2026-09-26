import React from 'react';
import {
  Sun,
  Moon,
  ShieldCheck,
  Database,
  Building,
  ChevronRight
} from 'lucide-react';

export default function Header({ activeTab, darkMode, onToggleTheme }) {
  const sectionMeta = {
    dashboard: { title: 'Overview', desc: 'National audit summary & priority vigilance queue' },
    project_details: { title: 'Project Details', desc: 'Primary project intelligence hub with locality map' },
    duplicates: { title: 'Duplicate Detection', desc: 'Cloned project descriptions & repetitive fund requests' },
    citizen: { title: 'Citizen Verification', desc: 'Public feedback, ground proof upload & RTI drafts' },
    roads: { title: 'Road SSR Analysis', desc: 'Civil road unit costs vs State PWD Schedule of Rates' },
    risk_analysis: { title: 'MP Risk Profiles', desc: 'Constituency allocations, expenditure & risk distribution' },
    geometric: { title: 'Trends & Patterns', desc: 'Turnaround duration, cost clustering & threshold charts' },
    action_center: { title: 'Official Portal', desc: 'Administrative login & vigilance inquiry console' },
    reports: { title: 'Export Reports', desc: 'Download filtered audit spreadsheets and dossiers' },
    settings: { title: 'Settings', desc: 'Risk weights, theme preferences, and AI key setup' }
  };

  const current = sectionMeta[activeTab] || { title: 'Audit Console', desc: 'National audit surveillance' };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between z-20 transition-colors duration-200 select-none shadow-xs">
      {/* Left: Clean Breadcrumb & Page Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 hidden sm:inline">
          HisaabDo
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hidden sm:inline" />
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
          {current.title}
        </h2>
      </div>

      {/* Center: Professional Centered Audit Status Pill */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 text-xs font-medium shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">National MPLADS Audit</span>
        <span className="text-slate-400 dark:text-slate-500">•</span>
        <span className="font-mono text-xs">34,001 Works Monitored</span>
        <span className="text-slate-400 dark:text-slate-500">•</span>
        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">MoSPI Surveillance</span>
      </div>

      {/* Right: Security Status & Modern Animated Theme Toggle */}
      <div className="flex items-center gap-3">
        {/* System Active Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Active Audit</span>
        </div>

        {/* Animated Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle Dark/Light Mode"
          className="relative inline-flex items-center gap-2 p-1.5 px-3 rounded-full border transition-all duration-300 shadow-xs cursor-pointer group bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500"
        >
          {/* Animated Icon Container */}
          <div className="relative w-4 h-4 flex items-center justify-center">
            <Sun
              className={`w-4 h-4 text-amber-500 transition-all duration-300 transform ${
                darkMode ? 'scale-0 rotate-90 opacity-0 absolute' : 'scale-100 rotate-0 opacity-100'
              }`}
            />
            <Moon
              className={`w-4 h-4 text-indigo-400 transition-all duration-300 transform ${
                darkMode ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0 absolute'
              }`}
            />
          </div>

          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 tracking-wide">
            {darkMode ? 'Dark' : 'Light'}
          </span>

          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              darkMode ? 'bg-indigo-400 shadow-[0_0_8px_#818cf8]' : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
            }`}
          />
        </button>
      </div>
    </header>
  );
}
