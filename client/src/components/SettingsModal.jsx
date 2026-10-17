import React, { useState, useEffect } from 'react';
import { X, Key, Server, Database, CheckCircle2, AlertTriangle, Save, Sparkles } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, getCustomApiKey, setCustomApiKey, api } from '../services/api';

export default function SettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  if (!isOpen) return null;

  const [apiKey, setApiKey] = useState(getCustomApiKey());
  const [apiBase, setApiBase] = useState(getApiBaseUrl());
  const [status, setStatus] = useState(null);
  const [checking, setChecking] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      setChecking(true);
      const res = await api.checkStatus();
      if (mounted) {
        setStatus(res);
        setChecking(false);
      }
    };
    check();
    return () => { mounted = false; };
  }, [apiBase]);

  const handleSave = () => {
    setCustomApiKey(apiKey.trim());
    setApiBaseUrl(apiBase.trim());
    setSavedSuccess(true);
    if (onSettingsUpdated) onSettingsUpdated();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">API & Service Settings</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs sm:text-sm">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings saved successfully!</span>
            </div>
          )}

          {/* System Status Indicators */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Live System Status
            </span>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-500" />
                <span>Backend Server:</span>
              </div>
              <span className={`font-semibold flex items-center gap-1 ${status?.status === 'online' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {status?.status === 'online' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {status?.status === 'online' ? 'Online (Connected)' : 'Offline / Standalone Mode'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-500" />
                <span>Database Engine:</span>
              </div>
              <span className="font-semibold text-slate-700">
                {status?.database?.mode || 'Hybrid Local Persistence'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-500" />
                <span>OpenAI / AI Engine:</span>
              </div>
              <span className="font-semibold text-indigo-600">
                {apiKey || status?.openai?.serverKeyConfigured ? 'OpenAI GPT Active' : 'Smart AI Engine (Ready)'}
              </span>
            </div>
          </div>

          {/* OpenAI API Key */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              OpenAI API Key (Optional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500">
              Free tier or custom key. If left blank, the app runs smoothly using the built-in Smart Career Engine with zero configuration needed.
            </p>
          </div>

          {/* Backend API URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Backend API Base URL
            </label>
            <input
              type="text"
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
