import React, { useState } from 'react';
import { Sparkles, X, Check, Loader2, ArrowRight, ShieldCheck, Target, Zap, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function AiModal({ isOpen, onClose, resume, onApplySuggestion, initialTab = 'bullets', initialText = '', targetRole = '' }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Bullet / Text Enhancer State
  const [inputText, setInputText] = useState(initialText || '');
  const [enhancementType, setEnhancementType] = useState('improve_bullet');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionSource, setSuggestionSource] = useState('');

  // Job Tailoring State
  const [jobDescription, setJobDescription] = useState('');
  const [jobAnalysis, setJobAnalysis] = useState(null);

  // ATS Review State
  const [atsReview, setAtsReview] = useState(null);

  const handleEnhanceText = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to enhance.');
      return;
    }
    setLoading(true);
    setError('');
    setSuggestions([]);

    try {
      const res = await api.requestAiSuggestion({
        type: enhancementType,
        currentText: inputText,
        targetRole: targetRole || resume.targetJobTitle || resume.personalInfo.jobTitle,
        resumeData: resume
      });

      if (res.suggestions) {
        setSuggestions(res.suggestions);
        setSuggestionSource(res.source);
        if (res.note) {
          setError(res.note);
        }
      } else {
        setError('No suggestions returned.');
      }
    } catch (err) {
      setError('Failed to reach AI service. Please verify your connection or settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAtsReview = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.requestAiSuggestion({
        type: 'ats_review',
        resumeData: resume,
        targetRole: resume.targetJobTitle || resume.personalInfo.jobTitle
      });

      if (res.review) {
        setAtsReview(res.review);
      }
    } catch (err) {
      setError('Failed to run ATS Review.');
    } finally {
      setLoading(false);
    }
  };

  const handleTailorToJob = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.requestAiSuggestion({
        type: 'tailor_to_job',
        jobDescription,
        resumeData: resume,
        targetRole: resume.targetJobTitle || resume.personalInfo.jobTitle
      });

      if (res.analysis) {
        setJobAnalysis(res.analysis);
      }
    } catch (err) {
      setError('Failed to tailor resume to job description.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (text, fieldName) => {
    onApplySuggestion(text, fieldName);
    setSuccessMsg('Applied to resume successfully!');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Career Copilot & ATS Optimizer</h2>
              <p className="text-xs text-indigo-100">OpenAI GPT-3.5 + Smart Career Optimization Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-2 gap-2 text-xs sm:text-sm font-medium">
          <button
            onClick={() => { setActiveTab('bullets'); setError(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all ${
              activeTab === 'bullets'
                ? 'border-indigo-600 text-indigo-600 font-semibold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            Impact & Bullet Enhancer
          </button>
          <button
            onClick={() => {
              setActiveTab('ats');
              setError('');
              if (!atsReview) handleRunAtsReview();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all ${
              activeTab === 'ats'
                ? 'border-indigo-600 text-indigo-600 font-semibold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            ATS Score & Review
          </button>
          <button
            onClick={() => { setActiveTab('tailor'); setError(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all ${
              activeTab === 'tailor'
                ? 'border-indigo-600 text-indigo-600 font-semibold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            Job Tailor (Match JD)
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {successMsg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg animate-in slide-in-from-top-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: Bullet / Text Enhancer */}
          {activeTab === 'bullets' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setEnhancementType('improve_bullet')}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    enhancementType === 'improve_bullet'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Work Bullet Point (Google XYZ)
                </button>
                <button
                  onClick={() => setEnhancementType('improve_summary')}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    enhancementType === 'improve_summary'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Executive Summary
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {enhancementType === 'improve_bullet' ? 'Original Bullet Point / Achievement' : 'Current Summary'}
                </label>
                <textarea
                  rows={3}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    enhancementType === 'improve_bullet'
                      ? 'e.g. Worked on the API and reduced latency'
                      : 'e.g. Software engineer looking for a high-impact development role...'
                  }
                  className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="text-[11px] text-slate-500">
                  Target Role: <strong className="text-slate-800">{targetRole || resume.targetJobTitle || 'Software Professional'}</strong>
                </div>
                <button
                  onClick={handleEnhanceText}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50 shadow-sm"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Generate AI Improvements
                </button>
              </div>

              {/* Suggestions List */}
              {suggestions.length > 0 && (
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Recommended Variations
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Engine: {suggestionSource || 'AI Model'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {suggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3 group"
                      >
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                          {suggestion}
                        </p>
                        <button
                          onClick={() => handleApply(suggestion, enhancementType === 'improve_summary' ? 'summary' : 'bullet')}
                          className="shrink-0 flex items-center gap-1 text-xs px-3 py-1.5 bg-white border border-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 text-slate-700 rounded-md font-semibold transition-all shadow-2xs"
                        >
                          <span>Apply</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ATS Review */}
          {activeTab === 'ats' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">ATS Resume Quality Audit</h3>
                  <p className="text-xs text-slate-500">Checks for quantification, ATS keywords, structure, and action verbs</p>
                </div>
                <button
                  onClick={handleRunAtsReview}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Re-scan Resume'}
                </button>
              </div>

              {atsReview && (
                <div className="space-y-4">
                  {/* Score Card */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border-4 border-indigo-400">
                        <span className="text-2xl font-black">{atsReview.score}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">Overall Score</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            atsReview.score >= 80 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-900'
                          }`}>
                            {atsReview.grade}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 max-w-md">{atsReview.summary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                      <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Identified Strengths
                      </h4>
                      <ul className="space-y-1.5 text-xs text-emerald-900">
                        {atsReview.strengths?.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                      <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Recommended Improvements
                      </h4>
                      <ul className="space-y-1.5 text-xs text-amber-900">
                        {atsReview.improvements?.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommended Keywords */}
                  {atsReview.recommendedKeywords && atsReview.recommendedKeywords.length > 0 && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <h4 className="text-xs font-bold text-slate-700 mb-2">
                        Missing Keywords to Consider Adding:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {atsReview.recommendedKeywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-white border border-slate-300 text-slate-800 px-2.5 py-1 rounded-full font-medium"
                          >
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Tailor to Job */}
          {activeTab === 'tailor' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Paste Target Job Posting / Description
                </label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements, responsibilities, or entire job description here to check keyword matches and generate customized copy..."
                  className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleTailorToJob}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Target className="w-3.5 h-3.5" />}
                Analyze & Tailor for This Role
              </button>

              {jobAnalysis && (
                <div className="space-y-4 mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <span className="text-xs font-semibold text-indigo-900">Job Match Score:</span>
                    <span className="text-lg font-black text-indigo-700">{jobAnalysis.matchScore || 85}%</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <span className="font-bold text-emerald-900 block mb-1">Matching Keywords:</span>
                      <div className="flex flex-wrap gap-1">
                        {jobAnalysis.matchingKeywords?.map((kw, i) => (
                          <span key={i} className="bg-white px-2 py-0.5 rounded text-[11px] font-medium text-emerald-800 border border-emerald-200">
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <span className="font-bold text-amber-900 block mb-1">Missing Keywords to Add:</span>
                      <div className="flex flex-wrap gap-1">
                        {jobAnalysis.missingKeywords?.map((kw, i) => (
                          <span key={i} className="bg-white px-2 py-0.5 rounded text-[11px] font-medium text-amber-800 border border-amber-200">
                            ! {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {jobAnalysis.tailoredSummary && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800">Tailored Summary Proposal</span>
                        <button
                          onClick={() => handleApply(jobAnalysis.tailoredSummary, 'summary')}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          Apply to Resume
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{jobAnalysis.tailoredSummary}</p>
                    </div>
                  )}

                  {jobAnalysis.recommendedBullets && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-800">Recommended Bullet Points to Insert</span>
                      {jobAnalysis.recommendedBullets.map((bullet, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center gap-2 text-xs">
                          <p className="text-slate-700">{bullet}</p>
                          <button
                            onClick={() => handleApply(bullet, 'bullet')}
                            className="shrink-0 text-indigo-600 font-semibold text-[11px] hover:underline"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
