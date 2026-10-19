import React from 'react';
import {
  User,
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
  onEditSection = null,
  textColor = '#0f172a',
  textAlign = 'left',
  pageMode = null
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

  // Determine page mode (defaults to '2-page' to fit all detailed projects & certifications comfortably)
  const activePageMode = pageMode || resume.pageMode || '2-page';

  // Section Heading Component with proper alignment
  const SectionHeader = ({ icon: Icon, title }) => (
    <div
      className={`flex items-center gap-2 border-b border-slate-300 pb-0.5 mb-1.5 ${
        textAlign === 'center'
          ? 'justify-center text-center'
          : textAlign === 'right'
          ? 'justify-end text-right'
          : 'justify-start text-left'
      }`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: themeColor }} />
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
        {title}
      </h2>
    </div>
  );

  // Common Header Section Component
  const HeaderSection = () => (
    <SectionContainer
      id="header"
      label="Header"
      activeSection={activeSection}
      onSelectSection={onSelectSection}
      onTriggerAi={onTriggerAi}
      onEditSection={onEditSection}
      className={`pb-2.5 border-b border-slate-200 ${
        textAlign === 'center'
          ? 'text-center'
          : textAlign === 'right'
          ? 'text-right'
          : 'text-left'
      }`}
    >
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-[25px] font-extrabold tracking-tight text-slate-900 uppercase">
          {personalInfo.fullName || 'SANJAY FRANCIS A'}
        </h1>
        <p className="text-xs sm:text-[12.5px] font-bold tracking-wide uppercase" style={{ color: themeColor }}>
          {personalInfo.jobTitle || 'FULL STACK WEB DEVELOPER | WEB DEVELOPER'}
        </p>

        {/* Contact details row 1 */}
        <div
          className={`flex flex-wrap items-center gap-x-2 text-[11px] text-slate-600 pt-0.5 ${
            textAlign === 'center'
              ? 'justify-center'
              : textAlign === 'right'
              ? 'justify-end'
              : 'justify-start'
          }`}
        >
          {personalInfo.email && (
            <span className="hover:text-slate-900 font-medium">{personalInfo.email}</span>
          )}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.location && <span>| {personalInfo.location}</span>}
          {personalInfo.github && (
            <span>| {personalInfo.github.replace(/^https?:\/\//, '')}</span>
          )}
        </div>

        {/* Contact details row 2 */}
        <div
          className={`flex flex-wrap items-center gap-x-2 text-[11px] text-slate-600 ${
            textAlign === 'center'
              ? 'justify-center'
              : textAlign === 'right'
              ? 'justify-end'
              : 'justify-start'
          }`}
        >
          {personalInfo.linkedin && (
            <span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
          )}
          {personalInfo.website && (
            <span>| {personalInfo.website.replace(/^https?:\/\//, '')}</span>
          )}
        </div>
      </header>
    </SectionContainer>
  );

  // Summary Section Component with aligned heading
  const SummarySection = () => (
    summary ? (
      <SectionContainer
        id="summary"
        label="Profile"
        activeSection={activeSection}
        onSelectSection={onSelectSection}
        onTriggerAi={onTriggerAi}
        onEditSection={onEditSection}
        className="p-1 -m-1"
      >
        <div>
          <SectionHeader icon={User} title="Professional Summary" />
          <p className={`text-[11px] leading-relaxed text-slate-700 ${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-justify'}`}>
            {summary}
          </p>
        </div>
      </SectionContainer>
    ) : null
  );

  // Skills Section Component
  const SkillsSection = () => (
    skills && skills.length > 0 ? (
      <SectionContainer
        id="skills"
        label="Skills"
        activeSection={activeSection}
        onSelectSection={onSelectSection}
        onTriggerAi={onTriggerAi}
        onEditSection={onEditSection}
        className="p-1 -m-1"
      >
        <div>
          <SectionHeader icon={Code2} title="Technical Skills" />
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
    ) : null
  );

  // Experience Section Component
  const ExperienceSection = () => (
    experiences && experiences.length > 0 ? (
      <SectionContainer
        id="experience"
        label="Experience"
        activeSection={activeSection}
        onSelectSection={onSelectSection}
        onTriggerAi={onTriggerAi}
        onEditSection={onEditSection}
        className="p-1 -m-1"
      >
        <div>
          <SectionHeader icon={Briefcase} title="Professional Experience" />
          <div className="space-y-1.5">
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
                  <span className="italic font-medium" style={{ color: themeColor }}>
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
        </div>
      </SectionContainer>
    ) : null
  );

  // Education Section Component
  const EducationSection = () => (
    education && education.length > 0 ? (
      <SectionContainer
        id="education"
        label="Education"
        activeSection={activeSection}
        onSelectSection={onSelectSection}
        onTriggerAi={onTriggerAi}
        onEditSection={onEditSection}
        className="p-1 -m-1"
      >
        <div>
          <SectionHeader icon={GraduationCap} title="Education" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-0.5">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="text-[11px] flex justify-between">
                <div>
                  <div className="font-bold text-slate-900">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
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
    ) : null
  );

  // Projects Section Component
  const ProjectsSection = ({ compactBullets = false }) => (
    projects && projects.length > 0 ? (
      <SectionContainer
        id="projects"
        label="Projects"
        activeSection={activeSection}
        onSelectSection={onSelectSection}
        onTriggerAi={onTriggerAi}
        onEditSection={onEditSection}
        className="p-1 -m-1"
      >
        <div>
          <SectionHeader icon={FolderGit2} title="Selected Projects" />
          <div className="space-y-2">
            {projects.map((proj, idx) => {
              const highlightsToShow = compactBullets && proj.highlights
                ? proj.highlights.slice(0, 3)
                : (proj.highlights || []);

              return (
                <div key={proj.id || idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      {proj.link && (
                        <span className="text-sky-600 font-medium">Live Demo</span>
                      )}
                      {proj.github && (
                        <span className="text-slate-600">GitHub</span>
                      )}
                    </div>
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[10px] italic" style={{ color: themeColor }}>
                      {proj.technologies.join(', ')}
                    </div>
                  )}
                  {highlightsToShow.length > 0 && (
                    <ul className="text-[10.5px] text-slate-700 space-y-0.5 pl-3">
                      {highlightsToShow.filter(Boolean).map((hl, hlIdx) => (
                        <li key={hlIdx} className="list-disc leading-tight">
                          {hl}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </SectionContainer>
    ) : null
  );

  // Custom Sections (Certifications & Additional Highlights)
  const CustomSectionsComponent = () => (
    customSections && customSections.length > 0 ? (
      <>
        {customSections.map((sec, idx) => (
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
            <div>
              <SectionHeader icon={Award} title={sec.title} />
              {sec.id === 'sec-cert' ? (
                /* 3-Column horizontal grid matching user specifications */
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
      </>
    ) : null
  );

  // =========================================================================
  // RENDER: TWO-PAGE MODE (Clean split, no awkward breaks, 100% A4 fitting)
  // =========================================================================
  if (activePageMode === '2-page') {
    return (
      <div className="flex flex-col items-center gap-6 w-full select-none">
        {/* ========================================== */}
        {/* PAGE 1: Profile, Skills, Experience, Education */}
        {/* ========================================== */}
        <div
          id="resume-page-1"
          style={{ width: '210mm', minHeight: '297mm', height: '297mm' }}
          className="resume-sheet shadow-resume rounded-sm overflow-hidden box-border px-8 py-7 font-sans text-slate-800 bg-white flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <HeaderSection />
            <SummarySection />
            <SkillsSection />
            <ExperienceSection />
            <EducationSection />
          </div>

          {/* Page 1 Footer */}
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
            <span>{personalInfo.fullName || 'Sanjay Francis A'} — Full Stack Developer</span>
            <span>Page 1 of 2</span>
          </div>
        </div>

        {/* ========================================== */}
        {/* VISUAL STUDIO PAGE BREAK DIVIDER          */}
        {/* ========================================== */}
        <div className="no-print w-full flex items-center justify-center gap-3 my-1">
          <div className="h-px bg-slate-300 flex-1 max-w-xs" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/90 text-slate-600 text-[11px] font-bold shadow-2xs">
            <span>Page 2 Below (A4 Page Break)</span>
          </div>
          <div className="h-px bg-slate-300 flex-1 max-w-xs" />
        </div>

        {/* HTML2PDF / Print Explicit Page Break */}
        <div className="html2pdf__page-break page-break" style={{ pageBreakBefore: 'always', breakBefore: 'page' }} />

        {/* ========================================== */}
        {/* PAGE 2: Projects, Certifications, Honors  */}
        {/* ========================================== */}
        <div
          id="resume-page-2"
          style={{ width: '210mm', minHeight: '297mm', height: '297mm' }}
          className="resume-sheet shadow-resume rounded-sm overflow-hidden box-border px-8 py-7 font-sans text-slate-800 bg-white flex flex-col justify-between"
        >
          <div className="space-y-4">
            {/* Page 2 Running Header */}
            <div className="pb-2 border-b border-slate-200 flex justify-between items-center text-xs text-slate-500">
              <span className="font-extrabold text-slate-800 tracking-wider uppercase text-[11px]">
                {personalInfo.fullName || 'SANJAY FRANCIS A'} — Selected Projects & Credentials
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Page 2 of 2
              </span>
            </div>

            <ProjectsSection compactBullets={false} />
            <CustomSectionsComponent />
          </div>

          {/* Page 2 Footer */}
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
            <span>{personalInfo.email || 'sanjayfrancis20@gmail.com'} | {personalInfo.phone || '+91 63804 27622'}</span>
            <span>Page 2 of 2</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: SINGLE-PAGE MODE (Compact ATS layout fitting exactly 1 A4 page)
  // =========================================================================
  return (
    <div
      id="resume-page-1"
      style={{ width: '210mm', minHeight: '297mm', height: '297mm' }}
      className="resume-sheet shadow-resume rounded-sm overflow-hidden box-border px-7 py-6 font-sans text-slate-800 bg-white flex flex-col justify-between select-none"
    >
      <div className="space-y-2.5">
        <HeaderSection />
        <SummarySection />
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
        <ProjectsSection compactBullets={true} />
        <CustomSectionsComponent />
      </div>

      {/* Single Page Footer */}
      <div className="pt-1.5 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
        <span>{personalInfo.fullName || 'Sanjay Francis A'} — Curriculum Vitae</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
}
