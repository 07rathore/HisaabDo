import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Key,
  Shield,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Palette,
  Eye,
  Cpu,
  Save,
  Sun,
  Moon,
  Type
} from 'lucide-react';

export default function SettingsView({
  riskWeights,
  onUpdateRiskWeights,
  onRecalculateScores,
  geminiApiKey,
  onSaveGeminiApiKey,
  selectedModel,
  onSelectModel,
  darkMode,
  onToggleTheme,
  fontFamily,
  onSelectFontFamily,
  accentColor,
  onSelectAccentColor
}) {
  const [localWeights, setLocalWeights] = useState({ ...riskWeights });
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || '');
  const [modelInput, setModelInput] = useState(selectedModel || 'gemini-1.5-flash');
  const [testStatus, setTestStatus] = useState(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fontOptions = [
    { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Default Clean Modern)' },
    { id: 'Inter', label: 'Inter (Professional Developer Standard)' },
    { id: 'Roboto', label: 'Roboto (Google Material Clean)' },
    { id: 'JetBrains Mono', label: 'JetBrains Mono (Technical / Monospace)' },
    { id: 'system-ui', label: 'System UI (-apple-system, Segoe UI)' },
  ];

  const accentOptions = [
    { id: 'indigo', label: 'Government Indigo', color: '#4f46e5' },
    { id: 'emerald', label: 'Civic Emerald', color: '#10b981' },
    { id: 'violet', label: 'Analytics Violet', color: '#8b5cf6' },
    { id: 'cyan', label: 'Tech Cyan', color: '#06b6d4' },
    { id: 'amber', label: 'Vigilance Amber', color: '#f59e0b' },
  ];

  const handleSliderChange = (key, val) => {
    setLocalWeights(prev => ({ ...prev, [key]: Number(val) }));
  };

  const handleApplyRecalculation = () => {
    setIsRecalculating(true);
    onUpdateRiskWeights(localWeights);
    onRecalculateScores(localWeights);
    setTimeout(() => {
      setIsRecalculating(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }, 500);
  };

  const handleResetDefaults = () => {
    const defaults = {
      statutoryThreshold: 40,
      tenderBypass: 30,
      missingPhoto: 25,
      roadSsrInflation: 35,
      massBatchSignoff: 40,
      mlWeight: 55
    };
    setLocalWeights(defaults);
    onUpdateRiskWeights(defaults);
    onRecalculateScores(defaults);
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    onSaveGeminiApiKey(apiKeyInput);
    onSelectModel(modelInput);
    setTestStatus('KEY_SAVED');
    setTimeout(() => setTestStatus(null), 3000);
  };

  const handleTestApiKey = async () => {
    if (!apiKeyInput) {
      setTestStatus('NO_KEY');
      return;
    }
    setTestStatus('TESTING');
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelInput}?key=${apiKeyInput}`);
      if (res.ok) {
        setTestStatus('SUCCESS');
        return;
      }

      if (res.status === 400 || res.status === 403) {
        setTestStatus('INVALID_KEY');
        return;
      }

      if (res.status === 404) {
        setTestStatus('API_DISABLED');
        return;
      }

      setTestStatus('ERROR');
    } catch (err) {
      setTestStatus('ERROR');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Risk Rules
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Adjust risk scoring weights, toggle light/dark theme, choose typography, and configure AI keys.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Statutory rules updated! All 34,001 records dynamically re-scored across the platform.</span>
        </div>
      )}

      {/* Grid: 1) Risk Rules Calibration | 2) UI Customization & Gemini AI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Risk Factor Weight Sliders (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Risk Criteria & Statutory Penalties</h3>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[11px] font-semibold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset Defaults
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Slider 1: Statutory Threshold Evasion */}
            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>Statutory Threshold Gaming Penalty (₹18k-₹20k)</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black">{localWeights.statutoryThreshold} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={localWeights.statutoryThreshold}
                onChange={(e) => handleSliderChange('statutoryThreshold', e.target.value)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Penalizes projects pegged ₹8 under mandatory statutory audit limit.</span>
            </div>

            {/* Slider 2: e-Tender Bypass */}
            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>e-Tendering Bypass Penalty (&lt;₹2 Lakh)</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black">{localWeights.tenderBypass} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={localWeights.tenderBypass}
                onChange={(e) => handleSliderChange('tenderBypass', e.target.value)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Penalizes artificial budgeting to avoid public e-procurement portals.</span>
            </div>

            {/* Slider 3: Missing Site Photo */}
            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>Missing Photographic Proof Penalty</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black">{localWeights.missingPhoto} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={localWeights.missingPhoto}
                onChange={(e) => handleSliderChange('missingPhoto', e.target.value)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Penalizes works marked complete without geo-tagged site images.</span>
            </div>

            {/* Slider 4: Road SSR Inflation */}
            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>Road Unit Cost SSR Deviation Penalty</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black">{localWeights.roadSsrInflation} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={localWeights.roadSsrInflation}
                onChange={(e) => handleSliderChange('roadSsrInflation', e.target.value)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Applied when linear CC road exceeds standard PWD ₹2,200/m benchmark.</span>
            </div>

            {/* Slider 5: Mass Single-Day Batch Sign-offs */}
            <div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>Single-Day Mass Sign-off Penalty (≥20 works)</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black">{localWeights.massBatchSignoff} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={localWeights.massBatchSignoff}
                onChange={(e) => handleSliderChange('massBatchSignoff', e.target.value)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Flags physical impossibility of inspecting dozens of sites in 24 hours.</span>
            </div>

            {/* Slider 6: ML vs Rule Blend Ratio */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span>Ensemble Ratio: ML Isolation Forest vs Domain Rules</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black">
                  {localWeights.mlWeight}% ML / {100 - localWeights.mlWeight}% Rules
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={localWeights.mlWeight}
                onChange={(e) => handleSliderChange('mlWeight', e.target.value)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">
                Formula: Composite = ({100 - localWeights.mlWeight}% × Rules) + ({localWeights.mlWeight}% × Isolation Forest ML)
              </span>
            </div>

            {/* Save & Recalculate Button */}
            <div className="pt-3">
              <button
                onClick={handleApplyRecalculation}
                disabled={isRecalculating}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin' : ''}`} />
                {isRecalculating ? 'Recalculating 34,001 Records...' : 'Recalculate All Scores Dynamically'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: UI Appearance & Gemini AI Credentials (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* UI Customization Card (Theme & Typography) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">UI Appearance & Theme</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Live Preview</span>
            </div>

            {/* Dark & Light Theme Switcher */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">Color Theme</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => { if (darkMode) onToggleTheme(); }}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                    !darkMode
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" /> Light Mode
                </button>

                <button
                  type="button"
                  onClick={() => { if (!darkMode) onToggleTheme(); }}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                    darkMode
                      ? 'bg-indigo-950/80 border-indigo-600 text-indigo-300 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" /> Dark Mode
                </button>
              </div>
            </div>

            {/* Font Family Selection */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" /> Font Typography Style
              </label>
              <select
                value={fontFamily}
                onChange={(e) => onSelectFontFamily(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {fontOptions.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Accent Color Palette */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5 text-xs">Primary Accent Color</label>
              <div className="flex items-center gap-3">
                {accentOptions.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => onSelectAccentColor(acc.id)}
                    title={acc.label}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      accentColor === acc.id ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: acc.color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Gemini AI Config Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Gemini AI Audit Credentials</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                geminiApiKey ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {geminiApiKey ? 'Live API Active' : 'Offline Intelligence'}
              </span>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              Free alternative active by default: no Google key is required. The app uses the built-in forensic engine when no API key is provided. You can also set VITE_GEMINI_API_KEY in a .env file or paste the key here.
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gemini API Key</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Model Selection</label>
                <select
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-fast, recommended)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep forensic reasoning)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                </select>
              </div>

              {testStatus === 'KEY_SAVED' && (
                <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Key saved to session!
                </div>
              )}
              {testStatus === 'SUCCESS' && (
                <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connection Verified! Live Gemini AI is active.
                </div>
              )}
              {testStatus === 'INVALID_KEY' && (
                <div className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Google key rejected or invalid. Create a fresh key in Google AI Studio and enable the Generative Language API.
                </div>
              )}
              {testStatus === 'API_DISABLED' && (
                <div className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Gemini API is not enabled for this project. Enable it in Google Cloud / AI Studio, then retry.
                </div>
              )}
              {testStatus === 'ERROR' && (
                <div className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Connection failed. Falling back to built-in offline intelligence.
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Save Credentials
                </button>
                <button
                  type="button"
                  onClick={handleTestApiKey}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                >
                  Test Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
