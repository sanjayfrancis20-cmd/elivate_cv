import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Linkedin, Github } from '../SocialIcons';
import SectionContainer from '../SectionContainer';

export default function ModernSlate({
  resume,
  activeSection = null,
  onSelectSection = null,
  onTriggerAi = null,
  onEditSection = null
}) {
  const { personalInfo, summary, experiences, education, skills, projects, customSections, themeColor } = resume;

  return (
    <div className="p-8 sm:p-10 font-sans leading-relaxed text-slate-800 bg-white">
      {/* Top Header */}
      <SectionContainer
        id="header"
        label="Header"
        activeSection={activeSection}
        onSelectSection={onSelectSection}
        onTriggerAi={onTriggerAi}
        onEditSection={onEditSection}
        className="border-b-2 pb-6 mb-6"
      >
        <header style={{ borderColor: themeColor || '#4f46e5' }}>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {personalInfo.fullName || 'Your Full Name'}
            </h1>
            <p className="text-lg font-semibold mt-1" style={{ color: themeColor || '#4f46e5' }}>
              {personalInfo.jobTitle || 'Target Role / Professional Title'}
            </p>
          </div>
          {personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-20 h-20 rounded-full object-cover border-2 shadow-sm"
              style={{ borderColor: themeColor }}
            />
          )}
        </div>

        {/* Contact info grid */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-xs sm:text-sm text-slate-600">
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <Mail className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <span>{personalInfo.email}</span>
            </a>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <span>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <span>{personalInfo.location}</span>
            </span>
          )}
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-slate-900">
              <Globe className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
          {personalInfo.linkedin && (
            <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-slate-900">
              <Linkedin className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
            </a>
          )}
          {personalInfo.github && (
            <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-slate-900">
              <Github className="w-3.5 h-3.5" style={{ color: themeColor }} />
              <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
            </a>
          )}
        </div>
      </header>
      </SectionContainer>

      {/* Summary / Profile */}
      {summary && (
        <SectionContainer
          id="summary"
          label="Profile"
          activeSection={activeSection}
          onSelectSection={onSelectSection}
          onTriggerAi={onTriggerAi}
          onEditSection={onEditSection}
          className="section-gap break-inside-avoid p-1.5 -m-1.5"
        >
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
              Profile
            </h2>
            <p className="text-sm text-slate-700 leading-normal text-justify">
              {summary}
            </p>
          </section>
        </SectionContainer>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <SectionContainer
          id="experience"
          label="Experience"
          activeSection={activeSection}
          onSelectSection={onSelectSection}
          onTriggerAi={onTriggerAi}
          onEditSection={onEditSection}
          className="section-gap p-1.5 -m-1.5"
        >
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
              Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="item-gap break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {exp.position || 'Position Title'}
                      <span className="font-normal text-slate-600"> — {exp.company || 'Company'}</span>
                    </h3>
                    <div className="text-xs font-medium text-slate-500 whitespace-nowrap">
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.current) && '–'} {exp.current ? 'Present' : exp.endDate}
                      {exp.location && ` • ${exp.location}`}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-600 italic mt-0.5">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="bullet-gap list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                      {exp.highlights.filter(Boolean).map((h, hIdx) => (
                        <li key={hIdx} className="leading-relaxed">
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        </SectionContainer>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <SectionContainer
          id="education"
          label="Education"
          activeSection={activeSection}
          onSelectSection={onSelectSection}
          onTriggerAi={onTriggerAi}
          onEditSection={onEditSection}
          className="section-gap break-inside-avoid p-1.5 -m-1.5"
        >
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{edu.degree}</span>
                    {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                    <div className="text-slate-600">{edu.institution} {edu.location && `• ${edu.location}`}</div>
                    {edu.honors && <div className="text-slate-500 italic mt-0.5">{edu.honors}</div>}
                  </div>
                  <div className="text-slate-500 font-medium whitespace-nowrap mt-1 sm:mt-0">
                    {edu.startDate} {edu.startDate && edu.endDate && '–'} {edu.endDate}
                    {edu.gpa && <span className="block text-right">GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </SectionContainer>
      )}

      {/* Project Highlight */}
      {projects && projects.length > 0 && (
        <SectionContainer
          id="projects"
          label="Project Highlight"
          activeSection={activeSection}
          onSelectSection={onSelectSection}
          onTriggerAi={onTriggerAi}
          onEditSection={onEditSection}
          className="section-gap break-inside-avoid p-1.5 -m-1.5"
        >
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
              Project Highlights
            </h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{proj.name}</h3>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs hover:underline" style={{ color: themeColor }}>
                          Live Demo
                        </a>
                      )}
                      {proj.github && (
                        <a href={proj.github} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:underline">
                          Source
                        </a>
                      )}
                    </div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="text-[11px] font-medium text-slate-500">
                        {proj.technologies.join(', ')}
                      </div>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>
                  )}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="bullet-gap list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-700">
                      {proj.highlights.filter(Boolean).map((h, hIdx) => (
                        <li key={hIdx}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        </SectionContainer>
      )}

      {/* Personal Strengths / Skills */}
      {skills && skills.length > 0 && skills.some(cat => cat.skills && cat.skills.length > 0) && (
        <SectionContainer
          id="skills"
          label="Personal Strength"
          activeSection={activeSection}
          onSelectSection={onSelectSection}
          onTriggerAi={onTriggerAi}
          onEditSection={onEditSection}
          className="section-gap break-inside-avoid p-1.5 -m-1.5"
        >
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
              Skills & Strengths
            </h2>
            <div className="space-y-2">
              {skills.map((cat, idx) => (
                cat.skills && cat.skills.length > 0 && (
                  <div key={cat.id || idx} className="text-xs flex flex-col sm:flex-row sm:items-start gap-1">
                    <span className="font-semibold text-slate-800 min-w-[140px] shrink-0">
                      {cat.name}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </section>
        </SectionContainer>
      )}

      {/* Custom Sections / Certifications */}
      {customSections && customSections.length > 0 && customSections.map((sec, idx) => (
        <SectionContainer
          key={sec.id || idx}
          id="custom"
          label={sec.title || "Custom Section"}
          activeSection={activeSection}
          onSelectSection={onSelectSection}
          onTriggerAi={onTriggerAi}
          onEditSection={onEditSection}
          className="section-gap break-inside-avoid p-1.5 -m-1.5"
        >
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
              {sec.title}
            </h2>
            <div className="space-y-2">
              {sec.items && sec.items.map((item, itemIdx) => (
                <div key={item.id || itemIdx} className="text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">{item.title}</span>
                    {item.date && <span className="text-slate-500">{item.date}</span>}
                  </div>
                  {item.subtitle && <div className="text-slate-600 font-medium">{item.subtitle}</div>}
                  {item.description && <div className="text-slate-600 mt-0.5">{item.description}</div>}
                </div>
              ))}
            </div>
          </section>
        </SectionContainer>
      ))}
    </div>
  );
}
