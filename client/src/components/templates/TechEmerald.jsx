import React from 'react';
import { Terminal, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';
import { Github } from '../SocialIcons';

export default function TechEmerald({ resume }) {
  const { personalInfo, summary, experiences, education, skills, projects, customSections, themeColor } = resume;

  return (
    <div className="p-8 sm:p-10 font-sans text-slate-800 bg-white leading-relaxed">
      {/* Tech Top Header */}
      <header className="border-l-4 pl-4 py-1 mb-6" style={{ borderColor: themeColor || '#059669' }}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold" style={{ color: themeColor }}>
              <Terminal className="w-3.5 h-3.5" />
              <span>{personalInfo.jobTitle || 'DEVELOPER / ENGINEER'}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {personalInfo.fullName || 'Full Name'}
            </h1>
          </div>
          {personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-16 h-16 rounded object-cover border"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-600 font-mono">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{personalInfo.location}</span>}
          {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3 text-slate-400" />{personalInfo.github.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="section-gap break-inside-avoid">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <span className="font-semibold" style={{ color: themeColor }}>#</span> overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-normal bg-slate-50/70 p-3 rounded border border-slate-100">
            {summary}
          </p>
        </section>
      )}

      {/* Skills Matrix */}
      {skills && skills.length > 0 && (
        <section className="section-gap break-inside-avoid">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <span className="font-semibold" style={{ color: themeColor }}>#</span> tech-stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {skills.map((cat, idx) => (
              <div key={cat.id || idx} className="border border-slate-200 rounded p-2 bg-white">
                <span className="font-mono font-semibold text-[11px] text-slate-700 block mb-1">
                  // {cat.name}
                </span>
                <div className="flex flex-wrap gap-1">
                  {cat.skills?.map((s, sIdx) => (
                    <span key={sIdx} className="bg-slate-100 text-slate-800 text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <section className="section-gap">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
            <span className="font-semibold" style={{ color: themeColor }}>#</span> engineering-experience
          </h2>
          <div className="space-y-3.5">
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx} className="item-gap break-inside-avoid border-l-2 pl-3" style={{ borderColor: themeColor }}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{exp.position}</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {exp.startDate} {exp.startDate && (exp.endDate || exp.current) && '–'} {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-600">
                  {exp.company} {exp.location && `// ${exp.location}`}
                </div>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="bullet-gap list-disc ml-4 space-y-1 text-xs text-slate-700 mt-1">
                    {exp.highlights.filter(Boolean).map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="section-gap break-inside-avoid">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
            <span className="font-semibold" style={{ color: themeColor }}>#</span> open-source-and-projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="border border-slate-200 rounded p-2.5 bg-slate-50/50 break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="flex items-center gap-0.5 text-[10px] text-indigo-600 hover:underline">
                        demo <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noreferrer" className="flex items-center gap-0.5 text-[10px] text-slate-500 hover:underline">
                        code <Github className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <span className="font-mono text-[10px] text-slate-500">[{proj.technologies.join(', ')}]</span>
                  )}
                </div>
                {proj.description && <p className="text-xs text-slate-600 mt-1">{proj.description}</p>}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc ml-4 space-y-0.5 text-xs text-slate-700 mt-1">
                    {proj.highlights.filter(Boolean).map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="section-gap break-inside-avoid">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <span className="font-semibold" style={{ color: themeColor }}>#</span> education
          </h2>
          <div className="space-y-2 text-xs">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <span> in {edu.fieldOfStudy}</span>
                  <div className="text-slate-500 text-[11px]">{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
                </div>
                <span className="font-mono text-[11px] text-slate-400">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom sections */}
      {customSections && customSections.length > 0 && customSections.map((sec, idx) => (
        <section key={sec.id || idx} className="section-gap break-inside-avoid">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <span className="font-semibold" style={{ color: themeColor }}>#</span> {sec.title.toLowerCase().replace(/\s+/g, '-')}
          </h2>
          <div className="space-y-1.5 text-xs">
            {sec.items?.map((item, itemIdx) => (
              <div key={item.id || itemIdx} className="flex justify-between">
                <div>
                  <span className="font-bold text-slate-900">{item.title}</span>
                  {item.subtitle && <span className="text-slate-500"> — {item.subtitle}</span>}
                  {item.description && <div className="text-slate-600 text-[11px] mt-0.5">{item.description}</div>}
                </div>
                {item.date && <span className="font-mono text-[11px] text-slate-400">{item.date}</span>}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
