import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import {
  Sparkles,
  Download,
  Share2,
  Undo2,
  Redo2,
  ChevronDown,
  Layers,
  FileText,
  Sliders,
  Settings,
  FolderOpen,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Plus,
  Send,
  Mic,
  Wand2,
  Printer,
  Save,
  HelpCircle,
  Folder,
  LayoutTemplate,
  CheckCircle2,
  RotateCcw,
  Move,
  Smartphone,
  ArrowLeft
} from 'lucide-react';

import ResumePreview from './components/ResumePreview';
import AiModal from './components/AiModal';
import SavedResumesModal from './components/SavedResumesModal';
import SettingsModal from './components/SettingsModal';
import SectionEditModal from './components/SectionEditModal';
import DeviceConnectModal from './components/DeviceConnectModal';
import {
  SANJAY_RESUME,
  SAMPLE_RESUME,
  BLANK_RESUME,
  TEMPLATES,
  THEME_COLORS,
  FONT_OPTIONS
} from './constants/initialData';
import { api } from './services/api';

export default function App() {
  // Initialize resume state with Sanjay Francis A
  const [resume, setResume] = useState(() => {
    try {
      const saved = localStorage.getItem('elevate_active_resume');
      return saved ? JSON.parse(saved) : SANJAY_RESUME;
    } catch {
      return SANJAY_RESUME;
    }
  });

  // Undo / Redo history stacks
  const [history, setHistory] = useState([SANJAY_RESUME]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Studio UI Navigation State
  const [activeRailTab, setActiveRailTab] = useState('layers'); // 'layers', 'ai', 'templates', 'saved', 'settings'
  const [leftTab, setLeftTab] = useState('layer'); // 'layer' | 'assets'
  const [activeSection, setActiveSection] = useState('header'); // selected section on canvas
  const [mobileTab, setMobileTab] = useState('canvas'); // 'canvas' | 'layers' | 'inspector'
  const [zoom, setZoom] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 42; // Perfect fit for smartphone screens (360px-430px)
      if (window.innerWidth < 1024) return 55; // Perfect fit for tablet screens
    }
    return 70; // Desktop default
  });
  const [isPanMode, setIsPanMode] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

  // Inspector & Typography State
  const [fontSize, setFontSize] = useState(12);
  const [fontWeight, setFontWeight] = useState('Regular');
  const [lineHeight, setLineHeight] = useState('Auto');
  const [letterSpacing, setLetterSpacing] = useState('-1.5%');
  const [textAlign, setTextAlign] = useState('left');
  const [fillColor, setFillColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#0e0d0d');
  const [secondaryTextColor, setSecondaryTextColor] = useState('#636363');

  // AI Generator Panel State (matching screenshot card)
  const [aiPrompt, setAiPrompt] = useState('Full Stack Developer specializing in React.js, Node.js, Express.js, MySQL, and REST APIs');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiBannerVisible, setAiBannerVisible] = useState(true);

  // Modals State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalConfig, setAiModalConfig] = useState({ initialTab: 'bullets', initialText: '', targetRole: '' });
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSectionEditOpen, setIsSectionEditOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState('header');

  // Status & Notifications
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved to Cloud');
  const [isExporting, setIsExporting] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  const previewRef = useRef(null);

  // Helper to commit state with history tracking
  const updateResumeWithHistory = (newResume) => {
    setResume(newResume);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newResume);
    if (newHistory.length > 30) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Save to local storage
    try {
      localStorage.setItem('elevate_active_resume', JSON.stringify(newResume));
      setSaveStatus('Saving...');
      setTimeout(() => setSaveStatus('Saved to Cloud'), 600);
    } catch (e) {
      console.warn('Failed to save to local storage', e);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setResume(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setResume(next);
    }
  };

  // Keyboard shortcut for Undo / Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Trigger AI Generator from prompt card
  const handleGenerateFromPrompt = async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    try {
      const res = await api.requestAiSuggestion({
        type: 'improve_summary',
        currentText: aiPrompt,
        targetRole: resume.targetJobTitle || resume.personalInfo.jobTitle,
        resumeData: resume
      });

      if (res && res.suggestions && res.suggestions.length > 0) {
        updateResumeWithHistory({
          ...resume,
          summary: res.suggestions[0]
        });
      }
    } catch (err) {
      console.warn('AI prompt error, using smart fallback generator:', err);
      // Smart offline fallback
      updateResumeWithHistory({
        ...resume,
        summary: `Strategic ${resume.targetJobTitle || 'Design Professional'} dedicated to crafting cohesive brand ecosystems, intuitive user journeys, and high-impact digital experiences. Recognized for elevating customer engagement and design quality across cross-functional teams.`
      });
    } finally {
      setAiGenerating(false);
    }
  };

  // Trigger AI for specific section
  const handleTriggerAiForSection = (sectionId, customText = '') => {
    let initialText = customText;
    let initialTab = 'bullets';

    if (sectionId === 'summary') {
      initialText = resume.summary || '';
      initialTab = 'summary';
    } else if (sectionId === 'experience' && !initialText) {
      initialText = resume.experiences?.[0]?.highlights?.[0] || '';
      initialTab = 'bullets';
    } else if (sectionId === 'skills') {
      initialTab = 'skills';
    }

    setAiModalConfig({
      initialTab,
      initialText,
      targetRole: resume.targetJobTitle || resume.personalInfo.jobTitle || ''
    });
    setIsAiModalOpen(true);
  };

  // Open Section Editor Modal
  const handleOpenSectionEdit = (sectionId) => {
    setEditingSectionId(sectionId);
    setActiveSection(sectionId);
    setIsSectionEditOpen(true);
  };

  // Export to PDF using html2pdf.js with fallback to window.print
  // Export to PDF using html2pdf.js with fallback to window.print
  const handleExportPdf = () => {
    const element = document.getElementById('printable-resume');
    if (!element) {
      window.print();
      return;
    }

    setIsExporting(true);

    // Save previous zoom transform to avoid distorted/blurry capture
    const zoomContainer = element.closest('.transition-all');
    const originalTransform = zoomContainer ? zoomContainer.style.transform : '';
    if (zoomContainer) {
      zoomContainer.style.transform = 'none';
    }

    const opt = {
      margin: 0, // Zero margin so exact 210mm x 297mm pages map 1:1 without clipping
      filename: `${(resume.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
        scrollX: 0,
        windowWidth: 794 // Standard 96 DPI A4 width in px
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], before: ['.html2pdf__page-break', '.page-break'] }
    };

    setTimeout(() => {
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          if (zoomContainer) zoomContainer.style.transform = originalTransform;
          setIsExporting(false);
        })
        .catch((err) => {
          console.warn('html2pdf fallback to print:', err);
          if (zoomContainer) zoomContainer.style.transform = originalTransform;
          setIsExporting(false);
          window.print();
        });
    }, 120);
  };

  // Share action
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  // Save to DB / Local Storage
  const handleSaveToServer = async () => {
    setIsSaving(true);
    try {
      await api.saveResume(resume);
      setSaveStatus('Saved to Cloud');
    } catch (err) {
      setSaveStatus('Saved Locally');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 font-sans select-none">
      {/* ======================================================== */}
      {/* 1. TOP APP BAR                                          */}
      {/* ======================================================== */}
      <header className="no-print h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-20 shadow-xs">
        {/* Left: Logo & History controls */}
        <div className="flex items-center gap-3">
          {/* Monogram Logo icon */}
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
            <span className="text-orange-500 font-extrabold mr-0.5">e</span>CV
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Document Title Selector */}
          <div className="relative flex items-center">
            {isTitleEditing ? (
              <input
                type="text"
                autoFocus
                value={resume.title || ''}
                onBlur={() => setIsTitleEditing(false)}
                onChange={(e) => updateResumeWithHistory({ ...resume, title: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && setIsTitleEditing(false)}
                className="text-xs sm:text-sm font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-orange-400 focus:outline-none"
              />
            ) : (
              <button
                onClick={() => setIsTitleEditing(true)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-100 text-xs sm:text-sm font-semibold text-slate-800 transition"
              >
                <span>{resume.title || 'Untitled Resume'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}

            {/* Quick Presets switch */}
            <div className="hidden lg:flex items-center ml-2 gap-1.5 text-[11px] text-slate-400">
              <span className="text-slate-300">•</span>
              <button
                onClick={() => updateResumeWithHistory(SANJAY_RESUME)}
                className="text-sky-600 font-bold transition hover:underline"
              >
                Sanjay Francis A
              </button>
              <span>/</span>
              <button
                onClick={() => updateResumeWithHistory(BLANK_RESUME)}
                className="hover:text-slate-700 transition hover:underline"
              >
                Blank Template
              </button>
            </div>
          </div>
        </div>

        {/* Center: Page Mode Switcher & Save status */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          {/* Page Mode Switcher: 1 Page vs 2 Pages */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => updateResumeWithHistory({ ...resume, pageMode: '1-page' })}
              title="Fit entire resume onto single A4 sheet"
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                (resume.pageMode || '2-page') === '1-page'
                  ? 'bg-white text-orange-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              1 Page
            </button>
            <button
              type="button"
              onClick={() => updateResumeWithHistory({ ...resume, pageMode: '2-page' })}
              title="Comprehensive 2-page detailed layout"
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                (resume.pageMode || '2-page') === '2-page'
                  ? 'bg-white text-orange-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              2 Pages
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{saveStatus}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Analyze Button */}
          <button
            onClick={() => {
              setAiModalConfig({
                initialTab: 'ats',
                initialText: '',
                targetRole: resume.targetJobTitle || resume.personalInfo.jobTitle
              });
              setIsAiModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="hidden xs:inline sm:inline">Analyze</span>
          </button>

          {/* Connect Other Devices / QR Button */}
          <button
            onClick={() => setIsDeviceModalOpen(true)}
            title="Open on Phones, Tablets, and other devices"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-xs font-semibold text-indigo-700 shadow-2xs transition"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Other Devices</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span>{isExporting ? 'Generating...' : 'Export PDF'}</span>
          </button>

          {/* User Profile Avatar */}
          <div
            title={resume.personalInfo.fullName || 'Sanjay Francis A'}
            className="w-8 h-8 rounded-full bg-sky-100 border border-sky-300 text-sky-700 flex items-center justify-center font-bold text-xs cursor-pointer ml-1"
          >
            {resume.personalInfo.fullName ? resume.personalInfo.fullName[0].toUpperCase() : 'S'}
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN STUDIO BODY: 3 COLUMNS                          */}
      {/* ======================================================== */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* ---------------------------------------------------- */}
        {/* LEFT TOOL RAIL (MINI ICON BAR)                       */}
        {/* ---------------------------------------------------- */}
        <aside className="no-print hidden sm:flex w-14 bg-white border-r border-slate-200 flex-col items-center py-4 justify-between shrink-0 z-10">
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setActiveRailTab('layers')}
              title="Layers & Sections"
              className={`p-2.5 rounded-xl transition ${
                activeRailTab === 'layers'
                  ? 'bg-orange-50 text-orange-600 shadow-2xs'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <Layers className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setActiveRailTab('ai');
                setIsAiModalOpen(true);
              }}
              title="AI Assistant"
              className={`p-2.5 rounded-xl transition ${
                activeRailTab === 'ai'
                  ? 'bg-orange-50 text-orange-600 shadow-2xs'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsSavedModalOpen(true)}
              title="Saved Resumes"
              className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
            >
              <FolderOpen className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleExportPdf()}
              title="Print Resume"
              className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              title="Settings & API Key"
              className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* ---------------------------------------------------- */}
        {/* LEFT DRAWER PANEL (AI GENERATOR & LAYERS)            */}
        {/* ---------------------------------------------------- */}
        <section className={`no-print bg-white border-r border-slate-200 flex-col shrink-0 overflow-y-auto ${
          mobileTab === 'layers'
            ? 'flex w-full absolute inset-0 z-20 lg:relative lg:w-72 lg:z-auto'
            : 'hidden lg:flex lg:w-72 lg:w-80'
        }`}>
          {/* Mobile Back Header */}
          <div className="lg:hidden flex items-center justify-between p-3 bg-slate-900 text-white border-b border-slate-800">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              Layers & AI Tools
            </span>
            <button
              onClick={() => setMobileTab('canvas')}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Resume</span>
            </button>
          </div>

          {/* AI Generator Card (matching screenshot top-left) */}
          <div className="p-3.5 border-b border-slate-200">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  AI Generator
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">
                  GPT-3.5
                </span>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Create a product designer resume highlighting skills..."
                  className="w-full text-xs text-slate-700 bg-white p-2.5 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-orange-500 leading-relaxed shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 text-slate-400">
                  <button
                    type="button"
                    title="Voice input"
                    className="p-1 rounded hover:bg-slate-200/60 hover:text-slate-600 transition"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt('Senior Full Stack Engineer with expertise in scalable cloud architectures')}
                    title="Magic Suggest"
                    className="p-1 rounded hover:bg-slate-200/60 hover:text-slate-600 transition"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={handleGenerateFromPrompt}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition disabled:opacity-50"
                >
                  <Send className="w-3 h-3 text-orange-400" />
                  <span>{aiGenerating ? 'Generating...' : 'Generate'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sub-Tabs: Layer | Assets (matching screenshot) */}
          <div className="px-4 pt-3 pb-2 border-b border-slate-100 flex items-center justify-between">
            <div className="flex bg-slate-100 p-0.5 rounded-lg w-full">
              <button
                type="button"
                onClick={() => setLeftTab('layer')}
                className={`flex-1 py-1 rounded-md text-xs font-semibold transition ${
                  leftTab === 'layer' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Layer
              </button>
              <button
                type="button"
                onClick={() => setLeftTab('assets')}
                className={`flex-1 py-1 rounded-md text-xs font-semibold transition ${
                  leftTab === 'assets' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Assets
              </button>
            </div>
          </div>

          {/* Tab 1: Layer List (matching screenshot pages + layer list) */}
          {leftTab === 'layer' && (
            <div className="p-3 space-y-4">
              {/* Pages section */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  <span>Pages</span>
                  <span className="text-[10px] text-slate-500 lowercase">
                    {(resume.pageMode || '2-page') === '2-page' ? '2 / 2' : '1 / 1'}
                  </span>
                </div>
                
                {/* Page 1 selector */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('resume-page-1');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-orange-50/60 border border-orange-200/80 text-xs font-medium text-slate-800 hover:bg-orange-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-7 rounded border border-orange-300 bg-white shadow-2xs" />
                    <div className="text-left">
                      <div className="font-bold text-slate-900">Page 1</div>
                      <div className="text-[10px] text-slate-500">Profile, Skills & Experience</div>
                    </div>
                  </div>
                  <Eye className="w-3.5 h-3.5 text-orange-600" />
                </button>

                {/* Page 2 selector (when in 2-page mode) */}
                {(resume.pageMode || '2-page') === '2-page' && (
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('resume-page-2');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:bg-orange-50/70 hover:border-orange-200 transition mt-1"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-7 rounded border border-slate-300 bg-white shadow-2xs" />
                      <div className="text-left">
                        <div className="font-bold text-slate-800">Page 2</div>
                        <div className="text-[10px] text-slate-500">Projects & Credentials</div>
                      </div>
                    </div>
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
              </div>

              {/* Layer / Section List */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  <span>Layer</span>
                  <button
                    onClick={() => handleOpenSectionEdit(activeSection)}
                    className="text-orange-600 hover:text-orange-700 text-[11px] font-semibold flex items-center gap-0.5"
                  >
                    Edit Active
                  </button>
                </div>

                <div className="space-y-1">
                  {[
                    { id: 'header', label: 'Header', subtitle: resume.personalInfo.fullName || 'Contact' },
                    { id: 'summary', label: 'Profile', subtitle: 'Summary' },
                    { id: 'experience', label: 'Experience', subtitle: `${resume.experiences?.length || 0} entries` },
                    { id: 'education', label: 'Education', subtitle: `${resume.education?.length || 0} entries` },
                    { id: 'projects', label: 'Project Highlight', subtitle: `${resume.projects?.length || 0} projects` },
                    { id: 'skills', label: 'Personal Strength', subtitle: 'Skills' },
                    { id: 'custom', label: 'Custom Section', subtitle: resume.customSections?.[0]?.title || 'Certifications' }
                  ].map((layer) => {
                    const isSelected = activeSection === layer.id;
                    return (
                      <div
                        key={layer.id}
                        onClick={() => setActiveSection(layer.id)}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition ${
                          isSelected
                            ? 'bg-orange-50 border border-orange-300 text-slate-900 font-semibold shadow-2xs'
                            : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSelected ? 'bg-orange-500' : 'bg-slate-300'
                            }`}
                          />
                          <span>{layer.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400">{layer.subtitle}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSectionEdit(layer.id);
                            }}
                            title="Edit Section"
                            className="p-1 hover:bg-slate-200/60 rounded text-slate-400 hover:text-slate-700"
                          >
                            ✎
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Assets / Templates / Photos */}
          {leftTab === 'assets' && (
            <div className="p-3 space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-700 text-xs uppercase tracking-wider block mb-2">
                  Resume Templates
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => updateResumeWithHistory({ ...resume, template: tpl.id })}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition ${
                        resume.template === tpl.id
                          ? 'border-orange-500 bg-orange-50/50 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="h-10 rounded bg-slate-100 border border-slate-200/60 mb-2 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {tpl.id}
                      </div>
                      <span className="font-semibold text-slate-800 text-[11px] truncate">{tpl.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 text-xs uppercase tracking-wider block mb-2">
                  Headshot / Photo URL
                </span>
                <input
                  type="text"
                  value={resume.personalInfo.photoUrl || ''}
                  onChange={(e) =>
                    updateResumeWithHistory({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, photoUrl: e.target.value }
                    })
                  }
                  placeholder="Paste direct image URL"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}
        </section>

        {/* ---------------------------------------------------- */}
        {/* CENTER CANVAS (RESUME SHEET WITH A4 PREVIEW)         */}
        {/* ---------------------------------------------------- */}
        <main
          onClick={() => setActiveSection(null)}
          className={`flex-1 bg-slate-100 overflow-auto relative flex flex-col items-center justify-start p-2 sm:p-6 select-none ${
            mobileTab === 'canvas' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Resume Sheet Preview Container */}
          <div className="w-full flex justify-center py-4">
            <ResumePreview
              ref={previewRef}
              resume={resume}
              zoom={zoom}
              activeSection={activeSection}
              onSelectSection={(id) => setActiveSection(id)}
              onTriggerAi={(id) => handleTriggerAiForSection(id)}
              onEditSection={(id) => handleOpenSectionEdit(id)}
              fillColor={fillColor}
              textColor={textColor}
              textAlign={textAlign}
              pageMode={resume.pageMode || '2-page'}
            />
          </div>

          {/* Floating Bottom Canvas Dock (matching screenshot bottom toolbar) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="no-print fixed bottom-14 lg:bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-2xl border border-slate-700/80 flex items-center gap-2 sm:gap-3 z-20 max-w-[94vw] overflow-x-auto"
          >
            {/* Pointer / Pan toggle */}
            <button
              onClick={() => setIsPanMode(!isPanMode)}
              title="Pan Tool"
              className={`p-1 rounded-full transition ${
                isPanMode ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Move className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleOpenSectionEdit(activeSection || 'header')}
              title="Edit Active Section"
              className="p-1 rounded-full text-slate-400 hover:text-white transition"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-3.5 bg-slate-700" />

            {/* Quick Page Jump Buttons */}
            <div className="flex items-center gap-1 text-xs text-slate-300">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('resume-page-1');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                title="Scroll to Page 1"
                className="px-2 py-0.5 rounded hover:bg-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition"
              >
                P1
              </button>
              {(resume.pageMode || '2-page') === '2-page' && (
                <>
                  <span className="text-slate-600">/</span>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('resume-page-2');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    title="Scroll to Page 2"
                    className="px-2 py-0.5 rounded hover:bg-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition"
                  >
                    P2
                  </button>
                </>
              )}
            </div>

            <div className="w-px h-3.5 bg-slate-700" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom((z) => Math.max(40, z - 10))}
                title="Zoom Out"
                className="p-1 text-slate-400 hover:text-white transition"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <input
                type="range"
                min={40}
                max={150}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-20 accent-orange-500 cursor-pointer"
              />

              <button
                onClick={() => setZoom((z) => Math.min(150, z + 10))}
                title="Zoom In"
                className="p-1 text-slate-400 hover:text-white transition"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <span className="text-xs font-semibold text-slate-300 w-10 text-right">{zoom}%</span>
            </div>

            <div className="w-px h-3.5 bg-slate-700" />

            {/* Fit to screen */}
            <button
              onClick={() => setZoom(70)}
              title="Reset Zoom (Fit)"
              className="p-1 text-slate-400 hover:text-white transition"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>

        {/* ---------------------------------------------------- */}
        {/* RIGHT INSPECTOR & STYLING PANEL                      */}
        {/* ---------------------------------------------------- */}
        <aside className={`no-print bg-white border-l border-slate-200 flex-col shrink-0 overflow-y-auto ${
          mobileTab === 'inspector'
            ? 'flex w-full absolute inset-0 z-20 lg:relative lg:w-72 lg:z-auto'
            : 'hidden lg:flex lg:w-72 lg:w-80'
        }`}>
          {/* Mobile Back Header */}
          <div className="lg:hidden flex items-center justify-between p-3 bg-slate-900 text-white border-b border-slate-800">
            <span className="font-bold text-xs flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-orange-400" />
              Design & Typography
            </span>
            <button
              onClick={() => setMobileTab('canvas')}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Resume</span>
            </button>
          </div>

          <div className="p-4 space-y-5 text-xs">
            {/* Page Format Section */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Page Format
              </span>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => updateResumeWithHistory({ ...resume, pageMode: '1-page' })}
                  className={`py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    (resume.pageMode || '2-page') === '1-page'
                      ? 'bg-white shadow-2xs text-orange-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>1 Page (Fit)</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateResumeWithHistory({ ...resume, pageMode: '2-page' })}
                  className={`py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    (resume.pageMode || '2-page') === '2-page'
                      ? 'bg-white shadow-2xs text-orange-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>2 Pages (Full)</span>
                </button>
              </div>
            </div>

            {/* Alignment Section (matching screenshot) */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Alignment
              </span>
              <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                <button
                  type="button"
                  onClick={() => setTextAlign('left')}
                  className={`flex-1 p-1.5 rounded flex items-center justify-center transition ${
                    textAlign === 'left' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('center')}
                  className={`flex-1 p-1.5 rounded flex items-center justify-center transition ${
                    textAlign === 'center' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('right')}
                  className={`flex-1 p-1.5 rounded flex items-center justify-center transition ${
                    textAlign === 'right' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlign('justify')}
                  className={`flex-1 p-1.5 rounded flex items-center justify-center transition ${
                    textAlign === 'justify' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Size Section (matching screenshot W 134, H 354) */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Size & Spacing
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50">
                  <span className="text-[11px] font-semibold text-slate-400 mr-2">W</span>
                  <input
                    type="text"
                    readOnly
                    value="210 mm"
                    className="w-full text-xs font-semibold text-slate-700 bg-transparent focus:outline-none"
                  />
                </div>
                <div className="flex items-center border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50">
                  <span className="text-[11px] font-semibold text-slate-400 mr-2">H</span>
                  <input
                    type="text"
                    readOnly
                    value="297 mm"
                    className="w-full text-xs font-semibold text-slate-700 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Spacing selector */}
              <div className="flex bg-slate-100 p-1 rounded-lg gap-1 text-[11px]">
                {['compact', 'normal', 'relaxed'].map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => updateResumeWithHistory({ ...resume, spacing: sp })}
                    className={`flex-1 py-1 rounded capitalize font-medium transition ${
                      resume.spacing === sp ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </div>

            {/* Text & Typography Section (matching screenshot) */}
            <div className="space-y-2.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Typography
              </span>

              {/* Font Family Dropdown */}
              <div>
                <select
                  value={resume.fontFamily || 'jakarta'}
                  onChange={(e) => updateResumeWithHistory({ ...resume, fontFamily: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font weight and size grid */}
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={fontWeight}
                  onChange={(e) => setFontWeight(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white"
                >
                  <option value="Regular">Regular</option>
                  <option value="Medium">Medium</option>
                  <option value="SemiBold">SemiBold</option>
                  <option value="Bold">Bold</option>
                </select>

                <div className="flex items-center border border-slate-200 rounded-lg px-2 py-1 bg-white">
                  <input
                    type="number"
                    min={9}
                    max={18}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full text-xs text-slate-800 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">px</span>
                </div>
              </div>

              {/* Line height and Letter Spacing */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center border border-slate-200 rounded-lg px-2.5 py-1 bg-slate-50 text-[11px]">
                  <span className="text-slate-400 mr-2">↕</span>
                  <span className="text-slate-700">{lineHeight}</span>
                </div>
                <div className="flex items-center border border-slate-200 rounded-lg px-2.5 py-1 bg-slate-50 text-[11px]">
                  <span className="text-slate-400 mr-2">↔</span>
                  <span className="text-slate-700">{letterSpacing}</span>
                </div>
              </div>

              {/* Format buttons: B, I, U, S */}
              <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                <button
                  type="button"
                  className="flex-1 p-1 hover:bg-white rounded text-slate-700 font-bold text-xs"
                >
                  B
                </button>
                <button
                  type="button"
                  className="flex-1 p-1 hover:bg-white rounded text-slate-700 italic text-xs"
                >
                  I
                </button>
                <button
                  type="button"
                  className="flex-1 p-1 hover:bg-white rounded text-slate-700 underline text-xs"
                >
                  U
                </button>
                <button
                  type="button"
                  className="flex-1 p-1 hover:bg-white rounded text-slate-700 line-through text-xs"
                >
                  S
                </button>
              </div>
            </div>

            {/* Colors Section (matching screenshot) */}
            <div className="space-y-3">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Colors
              </span>

              {/* Fill color */}
              <div className="flex items-center justify-between border border-slate-200 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border-0"
                  />
                  <span className="text-[11px] font-semibold text-slate-600">Fill</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 uppercase">{fillColor} 100%</span>
              </div>

              {/* Text Accent Color */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-600 block">Theme Palette</label>
                <div className="flex flex-wrap gap-1.5">
                  {THEME_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => updateResumeWithHistory({ ...resume, themeColor: c.id })}
                      style={{ backgroundColor: c.id }}
                      title={c.name}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        resume.themeColor === c.id ? 'border-slate-900 scale-110 shadow-xs' : 'border-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* AI Suggestions Card (matching bottom right of screenshot) */}
            {aiBannerVisible && (
              <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-white">AI Suggestions</span>
                  </div>
                  <button
                    onClick={() => setAiBannerVisible(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Use AI suggestions for personalized resume and skills improvements.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setAiModalConfig({
                      initialTab: 'bullets',
                      initialText: resume.summary || '',
                      targetRole: resume.targetJobTitle || resume.personalInfo.jobTitle
                    });
                    setIsAiModalOpen(true);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Try AI Suggestions</span>
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on tablets & phones) */}
      <div className="lg:hidden no-print flex items-center justify-around bg-white border-t border-slate-200 py-1.5 px-2 shrink-0 shadow-lg z-30">
        <button
          onClick={() => setMobileTab('layers')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[11px] font-semibold transition ${
            mobileTab === 'layers' ? 'text-orange-600 bg-orange-50' : 'text-slate-500'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Layers & AI</span>
        </button>
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-lg text-[11px] font-semibold transition ${
            mobileTab === 'canvas' ? 'text-orange-600 bg-orange-50' : 'text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume Sheet</span>
        </button>
        <button
          onClick={() => setMobileTab('inspector')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[11px] font-semibold transition ${
            mobileTab === 'inspector' ? 'text-orange-600 bg-orange-50' : 'text-slate-500'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Design Style</span>
        </button>
        <button
          onClick={() => setIsDeviceModalOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 transition"
        >
          <Smartphone className="w-4 h-4 text-indigo-600" />
          <span>QR / Connect</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 3. MODALS & OVERLAYS                                     */}
      {/* ======================================================== */}

      {/* Device Connect Modal (QR Code & multi-device LAN access) */}
      <DeviceConnectModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
      />

      {/* AI Assistant Modal (Bullet Enhancer, Job Tailoring, ATS Score) */}
      <AiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        resume={resume}
        initialTab={aiModalConfig.initialTab}
        initialText={aiModalConfig.initialText}
        targetRole={aiModalConfig.targetRole}
        onApplySuggestion={(suggestion) => {
          if (aiModalConfig.initialTab === 'summary') {
            updateResumeWithHistory({ ...resume, summary: suggestion });
          } else if (aiModalConfig.initialTab === 'bullets') {
            const exp = [...(resume.experiences || [])];
            if (exp.length > 0) {
              const highlights = [...(exp[0].highlights || [])];
              highlights[0] = suggestion;
              exp[0] = { ...exp[0], highlights };
              updateResumeWithHistory({ ...resume, experiences: exp });
            }
          }
          setIsAiModalOpen(false);
        }}
      />

      {/* Saved Resumes Modal */}
      <SavedResumesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        activeResumeId={resume._id || resume.id}
        onSelectResume={(selected) => updateResumeWithHistory(selected)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSettingsUpdated={() => setSaveStatus('Settings Updated')}
      />

      {/* Rich Section Edit Modal */}
      <SectionEditModal
        isOpen={isSectionEditOpen}
        sectionId={editingSectionId}
        resume={resume}
        onClose={() => setIsSectionEditOpen(false)}
        onUpdateResume={(updated) => updateResumeWithHistory(updated)}
        onTriggerAi={(secId, txt) => handleTriggerAiForSection(secId, txt)}
      />

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-20 right-8 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Resume link copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}
