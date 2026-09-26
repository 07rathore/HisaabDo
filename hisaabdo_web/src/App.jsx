import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ProjectMapView from './components/ProjectMapView';
import DuplicateDetectionView from './components/DuplicateDetectionView';
import CitizenPortal from './components/CitizenPortal';
import RoadLabView from './components/RoadLabView';
import RiskAnalysisView from './components/RiskAnalysisView';
import GeometricAnalysisView from './components/GeometricAnalysisView';
import ActionCenterView from './components/ActionCenterView';
import ReportDownloadView from './components/ReportDownloadView';
import SettingsView from './components/SettingsView';
import ExplainabilityModal from './components/ExplainabilityModal';
import InquiryDossierModal from './components/InquiryDossierModal';
import rawAuditData from './data/audited_projects.json';

const accentPalette = {
  indigo: '#4f46e5',
  emerald: '#10b981',
  violet: '#8b5cf6',
  cyan: '#06b6d4',
  amber: '#f59e0b'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedProjectForExplain, setSelectedProjectForExplain] = useState(null);
  const [selectedProjectForDossier, setSelectedProjectForDossier] = useState(null);

  // Dynamic Audit Data State allowing in-memory risk recalculation
  const [dynamicData, setDynamicData] = useState(rawAuditData);

  // Dark / Light Theme State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('hisaabdo_dark_mode') === 'true';
  });

  // UI Customization State
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem('hisaabdo_font_family') || 'Plus Jakarta Sans';
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('hisaabdo_accent_color') || 'indigo';
  });

  // Gemini API Key & Model Configuration
  // Use the built-in forensic engine as the free default. External Gemini keys are optional.
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    const envKey = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_GEMINI_API_KEY : '';
    const savedKey = localStorage.getItem('hisaabdo_gemini_key');
    const resolvedKey = (savedKey && savedKey.trim()) || (envKey && envKey.trim()) || '';

    if (resolvedKey) {
      localStorage.setItem('hisaabdo_gemini_key', resolvedKey);
    }

    return resolvedKey;
  });
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem('hisaabdo_gemini_model') || 'gemini-1.5-flash';
  });

  // Dynamic Risk Formula Weights
  const [riskWeights, setRiskWeights] = useState({
    statutoryThreshold: 40,
    tenderBypass: 30,
    missingPhoto: 25,
    roadSsrInflation: 35,
    massBatchSignoff: 40,
    mlWeight: 55 // 55% ML, 45% Rules
  });

  // Handle Theme Toggle
  const handleToggleTheme = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('hisaabdo_dark_mode', String(next));
      return next;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.style.setProperty('--app-accent', accentPalette[accentColor] || accentPalette.indigo);
    document.documentElement.style.setProperty('--app-accent-soft', `${accentPalette[accentColor] || accentPalette.indigo}1a`);
  }, [darkMode, accentColor]);

  const handleSelectFontFamily = (font) => {
    setFontFamily(font);
    localStorage.setItem('hisaabdo_font_family', font);
  };

  const handleSelectAccentColor = (acc) => {
    setAccentColor(acc);
    localStorage.setItem('hisaabdo_accent_color', acc);
  };

  const handleSaveGeminiApiKey = (key) => {
    const trimmedKey = (key || '').trim();
    if (!trimmedKey) {
      setGeminiApiKey('');
      localStorage.removeItem('hisaabdo_gemini_key');
      return;
    }

    setGeminiApiKey(trimmedKey);
    localStorage.setItem('hisaabdo_gemini_key', trimmedKey);
  };

  const handleSelectModel = (model) => {
    setSelectedModel(model);
    localStorage.setItem('hisaabdo_gemini_model', model);
  };

  const handleRecalculateScores = (weights) => {
    const mlFraction = (weights.mlWeight || 55) / 100.0;
    const ruleFraction = 1.0 - mlFraction;

    const updatedProjects = (dynamicData?.projects || []).map(p => {
      let rScore = 0;
      const amt = p.disbursed_amount || 0;

      if (amt >= 18000 && amt <= 19999) rScore += weights.statutoryThreshold;
      else if (amt >= 190000 && amt <= 199999) rScore += weights.tenderBypass;

      if (p.image_status === 'N/A' && amt >= 150000) rScore += weights.missingPhoto;
      if (p.is_road && p.cost_per_meter && p.cost_per_meter > 4500) rScore += weights.roadSsrInflation;
      if (p.same_day_ida_completions >= 20) rScore += weights.massBatchSignoff;

      rScore = Math.min(100, rScore);
      const composite = Math.min(100, Math.max(0, Math.round(ruleFraction * rScore + mlFraction * (p.ml_score || 45))));

      let tier = 'LOW';
      if (composite >= 68) tier = 'CRITICAL';
      else if (composite >= 45) tier = 'HIGH';
      else if (composite >= 25) tier = 'MEDIUM';

      return {
        ...p,
        rule_score: rScore,
        risk_score: composite,
        risk_level: tier
      };
    });

    const crit = updatedProjects.filter(p => p.risk_level === 'CRITICAL').length;
    const high = updatedProjects.filter(p => p.risk_level === 'HIGH').length;
    const med = updatedProjects.filter(p => p.risk_level === 'MEDIUM').length;
    const low = updatedProjects.filter(p => p.risk_level === 'LOW').length;

    setDynamicData(prev => ({
      ...prev,
      summary: {
        ...prev.summary,
        critical_count: crit,
        high_count: high,
        medium_count: med,
        low_count: low
      },
      projects: updatedProjects
    }));
  };

  const handleSelectProject = (proj) => {
    setSelectedProjectForExplain(proj);
  };

  const handleGenerateDossier = (proj) => {
    setSelectedProjectForDossier(proj);
  };

  const handleNavigateTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div
      className={`flex h-screen overflow-hidden font-sans transition-colors duration-200 ${
        darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
      style={{ fontFamily: `${fontFamily}, sans-serif` }}
    >
      {/* Left Sidebar (Exact 10 Numbered Sections) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        summary={dynamicData?.summary}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header with Modern Animated Theme Toggle */}
        <Header
          activeTab={activeTab}
          darkMode={darkMode}
          onToggleTheme={handleToggleTheme}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Section 1: Dashboard Section */}
            {activeTab === 'dashboard' && (
              <DashboardView
                data={dynamicData}
                onSelectProject={handleSelectProject}
                onGenerateDossier={handleGenerateDossier}
                onNavigateTab={handleNavigateTab}
              />
            )}

            {/* Section 2: Project Details & Locality Map */}
            {activeTab === 'project_details' && (
              <ProjectMapView
                data={dynamicData}
                onSelectProject={handleSelectProject}
                onGenerateDossier={handleGenerateDossier}
                onNavigateTab={handleNavigateTab}
              />
            )}

            {/* Section 3: Duplicate Detection */}
            {activeTab === 'duplicates' && (
              <DuplicateDetectionView
                data={dynamicData}
                onGenerateDossier={handleGenerateDossier}
              />
            )}

            {/* Section 4: Citizen Verification Layer */}
            {activeTab === 'citizen' && (
              <CitizenPortal
                data={dynamicData}
              />
            )}

            {/* Section 5: Roads Analysis (based on SSR) */}
            {activeTab === 'roads' && (
              <RoadLabView
                data={dynamicData}
                onSelectProject={handleSelectProject}
                onGenerateDossier={handleGenerateDossier}
              />
            )}

            {/* Section 6: Risk Analysis (MP-Wise) */}
            {activeTab === 'risk_analysis' && (
              <RiskAnalysisView
                data={dynamicData}
                onSelectProject={handleSelectProject}
                onGenerateDossier={handleGenerateDossier}
              />
            )}

            {/* Section 7: Geometric Analysis (Graphs & Comparisons) */}
            {activeTab === 'geometric' && (
              <GeometricAnalysisView
                data={dynamicData}
                onSelectProject={handleSelectProject}
              />
            )}

            {/* Section 8: Action Center (Big login button & officials details) */}
            {activeTab === 'action_center' && (
              <ActionCenterView
                data={dynamicData}
              />
            )}

            {/* Section 9: Download Report */}
            {activeTab === 'reports' && (
              <ReportDownloadView
                data={dynamicData}
              />
            )}

            {/* Section 10: Setting (Modify risk rules, font styles, dark/light theme) */}
            {activeTab === 'settings' && (
              <SettingsView
                riskWeights={riskWeights}
                onUpdateRiskWeights={setRiskWeights}
                onRecalculateScores={handleRecalculateScores}
                geminiApiKey={geminiApiKey}
                onSaveGeminiApiKey={handleSaveGeminiApiKey}
                selectedModel={selectedModel}
                onSelectModel={handleSelectModel}
                darkMode={darkMode}
                onToggleTheme={handleToggleTheme}
                fontFamily={fontFamily}
                onSelectFontFamily={handleSelectFontFamily}
                accentColor={accentColor}
                onSelectAccentColor={handleSelectAccentColor}
              />
            )}
          </div>
        </main>
      </div>

      {/* Deep-Dive Modals */}
      {selectedProjectForExplain && (
        <ExplainabilityModal
          project={selectedProjectForExplain}
          onClose={() => setSelectedProjectForExplain(null)}
          onGenerateDossier={handleGenerateDossier}
          geminiApiKey={geminiApiKey}
          selectedModel={selectedModel}
        />
      )}

      {selectedProjectForDossier && (
        <InquiryDossierModal
          project={selectedProjectForDossier}
          onClose={() => setSelectedProjectForDossier(null)}
        />
      )}
    </div>
  );
}
