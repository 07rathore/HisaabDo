import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Layers,
  Users,
  Compass,
  ShieldAlert,
  BarChart3,
  Building2,
  FileSpreadsheet,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, summary, collapsed, setCollapsed }) {
  // Navigation categories without arbitrary numbers - clean SaaS structure
  const navSections = [
    {
      group: 'AUDIT SURVEILLANCE',
      items: [
        {
          id: 'dashboard',
          label: 'Overview',
          icon: LayoutDashboard,
          hint: 'Key metrics & priority queue'
        },
        {
          id: 'project_details',
          label: 'Project Details',
          icon: MapPin,
          hint: 'Primary project intelligence hub',
          badge: summary?.total_records_processed ? `${(summary.total_records_processed / 1000).toFixed(0)}k` : '34k'
        },
        {
          id: 'duplicates',
          label: 'Duplicate Detection',
          icon: Layers,
          hint: 'NLP text cloning clusters',
          badge: summary?.duplicate_clusters_count || 226
        }
      ]
    },
    {
      group: 'DEEP FORENSICS',
      items: [
        {
          id: 'roads',
          label: 'Road SSR Analysis',
          icon: Compass,
          hint: 'Rate analysis vs PWD SSR',
          badge: summary?.road_works_analyzed || 1112
        },
        {
          id: 'risk_analysis',
          label: 'MP Risk Profiles',
          icon: ShieldAlert,
          hint: 'Allocation vs spend & outliers',
          alert: summary?.critical_count || 439
        },
        {
          id: 'geometric',
          label: 'Trends & Patterns',
          icon: BarChart3,
          hint: 'Turnaround, thresholds, charts'
        }
      ]
    },
    {
      group: 'PUBLIC & GOVERNANCE',
      items: [
        {
          id: 'citizen',
          label: 'Citizen Verification',
          icon: Users,
          hint: 'Public feedback & RTI drafts',
          badge: 'Public'
        },
        {
          id: 'action_center',
          label: 'Official Portal',
          icon: Building2,
          hint: 'MoSPI & administrative login',
          badge: 'Gov'
        }
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        {
          id: 'reports',
          label: 'Export Reports',
          icon: FileSpreadsheet,
          hint: 'CSV & printable dossiers'
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Sliders,
          hint: 'Weights, theme & AI setup'
        }
      ]
    }
  ];

  return (
    <aside
      className={`bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 z-30 select-none shadow-sm ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Identity */}
      <div>
        <div className="h-16 flex items-center px-4 border-b border-slate-200/80 dark:border-slate-800 gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-700 flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-500/25 shrink-0 tracking-tight">
            HD
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                  HisaabDo
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                  Audit AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                Public Fund Transparency
              </p>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pt-1 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  {section.group}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500'
                      }`}
                    />

                    {!collapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}

                    {!collapsed && item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium ${
                          isActive
                            ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {!collapsed && item.alert && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400 font-mono font-bold">
                        {item.alert}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Status Card */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>National Audit Active</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
              34,001 completed works & 543 MP limits monitored.
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /> <span>Collapse Menu</span></>}
        </button>
      </div>
    </aside>
  );
}
