import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Check, ArrowRight } from 'lucide-react';

export default function SectionEditModal({
  isOpen,
  onClose,
  sectionId,
  resume,
  onUpdateResume,
  onTriggerAi
}) {
  if (!isOpen || !sectionId) return null;

  const getSectionTitle = () => {
    switch (sectionId) {
      case 'header':
        return 'Edit Header & Contact Info';
      case 'summary':
        return 'Edit Profile Summary';
      case 'experience':
        return 'Edit Work Experience';
      case 'education':
        return 'Edit Education';
      case 'projects':
        return 'Edit Key Projects';
      case 'skills':
        return 'Edit Skills & Strengths';
      case 'custom':
        return 'Edit Custom Section';
      default:
        return 'Edit Section';
    }
  };

  // Header update
  const handleHeaderChange = (field, value) => {
    onUpdateResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value
      }
    });
  };

  // Summary update
  const handleSummaryChange = (value) => {
    onUpdateResume({
      ...resume,
      summary: value
    });
  };

  // Experience updates
  const handleExpChange = (index, field, value) => {
    const updated = [...(resume.experiences || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateResume({ ...resume, experiences: updated });
  };

  const handleAddExp = () => {
    const newExp = {
      id: 'exp_' + Date.now(),
      company: 'New Company',
      position: 'Role / Job Title',
      location: 'City, Country',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      description: '',
      highlights: ['Accomplished X by performing Y resulting in Z.']
    };
    onUpdateResume({
      ...resume,
      experiences: [newExp, ...(resume.experiences || [])]
    });
  };

  const handleDeleteExp = (index) => {
    const updated = (resume.experiences || []).filter((_, i) => i !== index);
    onUpdateResume({ ...resume, experiences: updated });
  };

  const handleHighlightChange = (expIdx, hlIdx, value) => {
    const updated = [...(resume.experiences || [])];
    const highlights = [...(updated[expIdx].highlights || [])];
    highlights[hlIdx] = value;
    updated[expIdx] = { ...updated[expIdx], highlights };
    onUpdateResume({ ...resume, experiences: updated });
  };

  const handleAddHighlight = (expIdx) => {
    const updated = [...(resume.experiences || [])];
    const highlights = [...(updated[expIdx].highlights || []), ''];
    updated[expIdx] = { ...updated[expIdx], highlights };
    onUpdateResume({ ...resume, experiences: updated });
  };

  const handleDeleteHighlight = (expIdx, hlIdx) => {
    const updated = [...(resume.experiences || [])];
    const highlights = (updated[expIdx].highlights || []).filter((_, i) => i !== hlIdx);
    updated[expIdx] = { ...updated[expIdx], highlights };
    onUpdateResume({ ...resume, experiences: updated });
  };

  // Education updates
  const handleEduChange = (index, field, value) => {
    const updated = [...(resume.education || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateResume({ ...resume, education: updated });
  };

  const handleAddEdu = () => {
    const newEdu = {
      id: 'edu_' + Date.now(),
      institution: 'University / College',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Field of Study',
      location: 'Location',
      startDate: '2019',
      endDate: '2023',
      gpa: '',
      honors: ''
    };
    onUpdateResume({
      ...resume,
      education: [...(resume.education || []), newEdu]
    });
  };

  const handleDeleteEdu = (index) => {
    const updated = (resume.education || []).filter((_, i) => i !== index);
    onUpdateResume({ ...resume, education: updated });
  };

  // Project updates
  const handleProjChange = (index, field, value) => {
    const updated = [...(resume.projects || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateResume({ ...resume, projects: updated });
  };

  const handleAddProj = () => {
    const newProj = {
      id: 'proj_' + Date.now(),
      name: 'New Project Title',
      description: 'Brief description of what was built and why.',
      technologies: ['React', 'Node.js'],
      link: '',
      github: '',
      highlights: ['Engineered key features improving performance by 30%.']
    };
    onUpdateResume({
      ...resume,
      projects: [...(resume.projects || []), newProj]
    });
  };

  const handleDeleteProj = (index) => {
    const updated = (resume.projects || []).filter((_, i) => i !== index);
    onUpdateResume({ ...resume, projects: updated });
  };

  // Skills updates
  const handleSkillCatNameChange = (catIdx, name) => {
    const updated = [...(resume.skills || [])];
    updated[catIdx] = { ...updated[catIdx], name };
    onUpdateResume({ ...resume, skills: updated });
  };

  const handleSkillPillsChange = (catIdx, textValue) => {
    const updated = [...(resume.skills || [])];
    const skills = textValue.split(',').map(s => s.trim()).filter(Boolean);
    updated[catIdx] = { ...updated[catIdx], skills };
    onUpdateResume({ ...resume, skills: updated });
  };

  const handleAddSkillCat = () => {
    const newCat = {
      id: 'cat_' + Date.now(),
      name: 'New Category',
      skills: ['Skill 1', 'Skill 2']
    };
    onUpdateResume({
      ...resume,
      skills: [...(resume.skills || []), newCat]
    });
  };

  const handleDeleteSkillCat = (catIdx) => {
    const updated = (resume.skills || []).filter((_, i) => i !== catIdx);
    onUpdateResume({ ...resume, skills: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h2 className="text-base font-bold text-slate-900">{getSectionTitle()}</h2>
          </div>
          <div className="flex items-center gap-2">
            {onTriggerAi && (
              <button
                type="button"
                onClick={() => onTriggerAi(sectionId)}
                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-xs font-semibold shadow hover:opacity-90 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Assistant
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* HEADER FORM */}
          {sectionId === 'header' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resume.personalInfo.fullName || ''}
                  onChange={(e) => handleHeaderChange('fullName', e.target.value)}
                  placeholder="e.g. SANJAY FRANCIS A"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Professional Title</label>
                <input
                  type="text"
                  value={resume.personalInfo.jobTitle || ''}
                  onChange={(e) => handleHeaderChange('jobTitle', e.target.value)}
                  placeholder="e.g. FULL STACK WEB DEVELOPER"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={resume.personalInfo.email || ''}
                  onChange={(e) => handleHeaderChange('email', e.target.value)}
                  placeholder="sanjayfrancis20@gmail.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={resume.personalInfo.phone || ''}
                  onChange={(e) => handleHeaderChange('phone', e.target.value)}
                  placeholder="+91 63804 27622"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
                <input
                  type="text"
                  value={resume.personalInfo.location || ''}
                  onChange={(e) => handleHeaderChange('location', e.target.value)}
                  placeholder="Tamil Nadu, India"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Website / Portfolio</label>
                <input
                  type="text"
                  value={resume.personalInfo.website || ''}
                  onChange={(e) => handleHeaderChange('website', e.target.value)}
                  placeholder="https://portfoliosanjayfrancis-mu.vercel.app"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={resume.personalInfo.linkedin || ''}
                  onChange={(e) => handleHeaderChange('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/sanjay-francis-0374141aa"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">GitHub Profile</label>
                <input
                  type="text"
                  value={resume.personalInfo.github || ''}
                  onChange={(e) => handleHeaderChange('github', e.target.value)}
                  placeholder="github.com/sanjayfrancis20-cmd"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {/* SUMMARY FORM */}
          {sectionId === 'summary' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-600">
                Professional Bio & Value Proposition
              </label>
              <textarea
                rows={6}
                value={resume.summary || ''}
                onChange={(e) => handleSummaryChange(e.target.value)}
                placeholder="A results-oriented graphic designer with a strong focus on visual clarity, brand consistency, and impactful design execution..."
                className="w-full p-3 border border-slate-300 rounded-xl text-sm leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>{(resume.summary || '').length} characters</span>
                {onTriggerAi && (
                  <button
                    type="button"
                    onClick={() => onTriggerAi('summary')}
                    className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Enhance Summary with AI
                  </button>
                )}
              </div>
            </div>
          )}

          {/* EXPERIENCE FORM */}
          {sectionId === 'experience' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase">Work Experience History</span>
                <button
                  type="button"
                  onClick={handleAddExp}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Position
                </button>
              </div>

              {(resume.experiences || []).map((exp, expIdx) => (
                <div key={exp.id || expIdx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Role #{expIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteExp(expIdx)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Position Title</label>
                      <input
                        type="text"
                        value={exp.position || ''}
                        onChange={(e) => handleExpChange(expIdx, 'position', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Company Name</label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => handleExpChange(expIdx, 'company', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate || ''}
                        onChange={(e) => handleExpChange(expIdx, 'startDate', e.target.value)}
                        placeholder="2022"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-0.5">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate || ''}
                        disabled={exp.current}
                        onChange={(e) => handleExpChange(expIdx, 'endDate', e.target.value)}
                        placeholder={exp.current ? 'Present' : '2024'}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800 disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  {/* Highlights / Bullets */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-semibold text-slate-600">Bullet Points / Achievements</label>
                      <button
                        type="button"
                        onClick={() => handleAddHighlight(expIdx)}
                        className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    {(exp.highlights || []).map((hl, hlIdx) => (
                      <div key={hlIdx} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={hl}
                          onChange={(e) => handleHighlightChange(expIdx, hlIdx, e.target.value)}
                          placeholder="Accomplished [X], measured by [Y], by doing [Z]"
                          className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800"
                        />
                        {onTriggerAi && (
                          <button
                            type="button"
                            title="Improve bullet with AI"
                            onClick={() => onTriggerAi('experience', hl)}
                            className="p-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded text-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteHighlight(expIdx, hlIdx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION FORM */}
          {sectionId === 'education' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase">Degrees & Certifications</span>
                <button
                  type="button"
                  onClick={handleAddEdu}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Education
                </button>
              </div>

              {(resume.education || []).map((edu, eduIdx) => (
                <div key={edu.id || eduIdx} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Education #{eduIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteEdu(eduIdx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500">Degree / Diploma</label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => handleEduChange(eduIdx, 'degree', e.target.value)}
                        placeholder="Bachelor of Fine Arts"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500">Field of Study</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => handleEduChange(eduIdx, 'fieldOfStudy', e.target.value)}
                        placeholder="Visual Communication Design"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500">Institution / University</label>
                      <input
                        type="text"
                        value={edu.institution || ''}
                        onChange={(e) => handleEduChange(eduIdx, 'institution', e.target.value)}
                        placeholder="Rhode Island School of Design"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500">Dates</label>
                      <input
                        type="text"
                        value={edu.endDate || ''}
                        onChange={(e) => handleEduChange(eduIdx, 'endDate', e.target.value)}
                        placeholder="2016 – 2020"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SKILLS FORM */}
          {sectionId === 'skills' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase">Skill Categories</span>
                <button
                  type="button"
                  onClick={handleAddSkillCat}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Category
                </button>
              </div>

              {(resume.skills || []).map((cat, catIdx) => (
                <div key={cat.id || catIdx} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={cat.name || ''}
                      onChange={(e) => handleSkillCatNameChange(catIdx, e.target.value)}
                      placeholder="Category Name (e.g. Design & Visual Identity)"
                      className="font-bold text-xs text-slate-800 border-b border-slate-300 bg-transparent px-1 py-0.5 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteSkillCat(catIdx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Skills (comma-separated):
                    </label>
                    <input
                      type="text"
                      value={(cat.skills || []).join(', ')}
                      onChange={(e) => handleSkillPillsChange(catIdx, e.target.value)}
                      placeholder="Brand Identity, Figma, Typography, Adobe Suite..."
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>

                  {/* Pills preview */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(cat.skills || []).map((s, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS FORM */}
          {sectionId === 'projects' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase">Projects & Highlights</span>
                <button
                  type="button"
                  onClick={handleAddProj}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </button>
              </div>

              {(resume.projects || []).map((proj, pIdx) => (
                <div key={proj.id || pIdx} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Project #{pIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteProj(pIdx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={proj.name || ''}
                      onChange={(e) => handleProjChange(pIdx, 'name', e.target.value)}
                      placeholder="Project Name"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold"
                    />
                    <textarea
                      rows={2}
                      value={proj.description || ''}
                      onChange={(e) => handleProjChange(pIdx, 'description', e.target.value)}
                      placeholder="Project description and key impact..."
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow transition"
          >
            Done Editing
          </button>
        </div>
      </div>
    </div>
  );
}
