import React from 'react';
import {
  Code2,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink
} from 'lucide-react';
import { Linkedin, Github } from '../SocialIcons';
import SectionContainer from '../SectionContainer';

export default function SinglePagePro({
  resume,
  activeSection = null,
  onSelectSection = null,
  onTriggerAi = null,
  onEditSection = null
}) {
  const {
    personalInfo = {},
    summary = '',
    experiences = [],
    education = [],
    skills = [],
    projects = [],
    customSections = [],
    themeColor = '#0284c7'
  } = resume;

  return (
    <div className="w-full min-h-[297mm] px-8 py-8 font-sans text-slate-800 bg-white leading-snug flex flex-col justify-between box-border select-none">
      <div className="space-y-4">
        {/* ======================================================== */}
        {/* HEADER SECTION                                          */}
        {/* ======================================================== */}
        <SectionContainer
          id="header"
          label="Header"
          activeSection={activeSection}
          onSelectSection={onSelectSection}
          onTriggerAi={onTriggerAi}
          onEditSection={onEditSection}
          className="text-center pb-2.5 border-b border-slate-200"
        >
          <header className="space-y-1">
            <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-slate-900 uppercase">
              {personalInfo.fullName || 'SANJAY FRANCIS A'}
            </h1>
            <p className="text-xs sm:text-[13px] font-bold tracking-wide uppercase" style={{ color: themeColor }}>
              {personalInfo.jobTitle || 'FULL STACK WEB DEVELOPER | WEB DEVELOPER'}
            </p>

            {/* Contact row 1 */}
            <div className="flex flex-wrap justify-center items-center gap-x-2 text-[11px] text-slate-600 pt-0.5">
              {personalInfo.email && (
                <span className="hover:text-slate-900">{personalInfo.email}</span>
              )}
              {personalInfo.phone && <span>| {personalInfo.phone}</span>}
              {personalInfo.location && <span>| {personalInfo.location}</span>}
              {personalInfo.github && (
                <span>| {personalInfo.github.replace(/^https?:\/\//, '')}</span>
              )}
            </div>

            {/* Contact row 2 */}
            <div className="flex flex-wrap justify-center items-center gap-x-2 text-[11px] text-slate-600">
              {personalInfo.linkedin && (
                <span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
              )}
              {personalInfo.website && (
                <span>| {personalInfo.website.replace(/^https?:\/\//, '')}</span>
              )}
            </div>
          </header>
        </SectionContainer>

        {/* ======================================================== */}
        {/* SUMMARY SECTION                                         */}
        {/* ======================================================== */}
        {summary && (
          <SectionContainer
            id="summary"
            label="Profile"
            activeSection={activeSection}
            onSelectSection={onSelectSection}
            onTriggerAi={onTriggerAi}
            onEditSection={onEditSection}
            className="p-1 -m-1"
          >
            <p className="text-[11px] leading-relaxed text-slate-700 text-justify">
              {summary}
            </p>
          </SectionContainer>
        )}

        {/* ======================================================== */}
        {/* TECHNICAL SKILLS                                         */}
        {/* ======================================================== */}
        {skills && skills.length > 0 && (
          <SectionContainer
            id="skills"
            label="Skills"
            activeSection={activeSection}
            onSelectSection={onSelectSection}
            onTriggerAi={onTriggerAi}
            onEditSection={onEditSection}
            className="p-1 -m-1"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-0.5">
                <Code2 className="w-3.5 h-3.5" style={{ color: themeColor }} />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Technical Skills
                </h2>
              </div>
              <div className="text-[11px] leading-snug space-y-0.5 pt-0.5">
                {skills.map((cat, idx) => (
                  <div key={cat.id || idx} className="text-slate-700">
                    <span className="font-bold text-slate-900">{cat.name} — </span>
                    <span>{(cat.skills || []).join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionContainer>
        )}

        {/* ======================================================== */}
        {/* PROFESSIONAL EXPERIENCE                                  */}
        {/* ======================================================== */}
        {experiences && experiences.length > 0 && (
          <SectionContainer
            id="experience"
            label="Experience"
            activeSection={activeSection}
            onSelectSection={onSelectSection}
            onTriggerAi={onTriggerAi}
            onEditSection={onEditSection}
            className="p-1 -m-1"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-0.5">
                <Briefcase className="w-3.5 h-3.5" style={{ color: themeColor }} />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Professional Experience
                </h2>
              </div>

              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-slate-900">{exp.company || 'Company'}</span>
                    <span className="text-[11px] text-slate-600 font-medium">
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.current) && '–'}{' '}
                      {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[11px]">
                    <span className="italic text-slate-700 font-medium" style={{ color: themeColor }}>
                      {exp.position || 'Position'}
                    </span>
                    <span className="text-slate-500">{exp.location || 'Remote'}</span>
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="text-[11px] text-slate-700 space-y-0.5 pl-3 mt-0.5">
                      {exp.highlights.filter(Boolean).map((hl, hlIdx) => (
                        <li key={hlIdx} className="list-disc leading-tight">
                          {hl}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </SectionContainer>
        )}

        {/* ======================================================== */}
        {/* EDUCATION SECTION                                        */}
        {/* ======================================================== */}
        {education && education.length > 0 && (
          <SectionContainer
            id="education"
            label="Education"
            activeSection={activeSection}
            onSelectSection={onSelectSection}
            onTriggerAi={onTriggerAi}
            onEditSection={onEditSection}
            className="p-1 -m-1"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-0.5">
                <GraduationCap className="w-3.5 h-3.5" style={{ color: themeColor }} />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Education
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-0.5">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="text-[11px] flex justify-between">
                    <div>
                      <div className="font-bold text-slate-900">
                        {edu.degree} {edu.fieldOfStudy && `${edu.fieldOfStudy}`}
                      </div>
                      <div className="text-slate-600">{edu.institution}</div>
                      {edu.gpa && <div className="text-slate-700 font-semibold">CGPA: {edu.gpa}</div>}
                    </div>
                    <div className="text-right text-slate-500 whitespace-nowrap">
                      <div>{edu.endDate || edu.startDate}</div>
                      <div>{edu.location || 'Trichy'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionContainer>
        )}

        {/* ======================================================== */}
        {/* SELECTED PROJECTS                                        */}
        {/* ======================================================== */}
        {projects && projects.length > 0 && (
          <SectionContainer
            id="projects"
            label="Projects"
            activeSection={activeSection}
            onSelectSection={onSelectSection}
            onTriggerAi={onTriggerAi}
            onEditSection={onEditSection}
            className="p-1 -m-1"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-0.5">
                <FolderGit2 className="w-3.5 h-3.5" style={{ color: themeColor }} />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Selected Projects
                </h2>
              </div>

              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[10px] italic text-slate-600" style={{ color: themeColor }}>
                      {proj.technologies.join(', ')}
                    </div>
                  )}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="text-[10.5px] text-slate-700 space-y-0.5 pl-3">
                      {proj.highlights.filter(Boolean).map((hl, hlIdx) => (
                        <li key={hlIdx} className="list-disc leading-tight">
                          {hl}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </SectionContainer>
        )}

        {/* ======================================================== */}
        {/* CERTIFICATIONS & TRAINING & ADDITIONAL                   */}
        {/* ======================================================== */}
        {customSections && customSections.length > 0 && customSections.map((sec, idx) => (
          <SectionContainer
            key={sec.id || idx}
            id="custom"
            label={sec.title || "Section"}
            activeSection={activeSection}
            onSelectSection={onSelectSection}
            onTriggerAi={onTriggerAi}
            onEditSection={onEditSection}
            className="p-1 -m-1"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-0.5">
                <Award className="w-3.5 h-3.5" style={{ color: themeColor }} />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {sec.title}
                </h2>
              </div>

              {sec.id === 'sec-cert' ? (
                /* 3-Column horizontal grid matching user PDF */
                <div className="grid grid-cols-3 gap-2 text-[10.5px] pt-0.5">
                  {(sec.items || []).map((item, itemIdx) => (
                    <div key={item.id || itemIdx}>
                      <div className="font-bold text-slate-900 leading-tight">{item.title}</div>
                      {item.subtitle && <div className="text-slate-600 text-[10px]">{item.subtitle}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                /* Additional Highlights bulleted list */
                <ul className="text-[10.5px] text-slate-700 space-y-0.5 pl-3 pt-0.5">
                  {(sec.items || []).map((item, itemIdx) => (
                    <li key={item.id || itemIdx} className="list-disc leading-tight">
                      <span className="font-semibold text-slate-900">{item.title}: </span>
                      <span>{item.description || item.subtitle}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </SectionContainer>
        ))}
      </div>
    </div>
  );
}
