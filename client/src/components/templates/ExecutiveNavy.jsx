import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Linkedin, Github } from '../SocialIcons';

export default function ExecutiveNavy({ resume }) {
  const { personalInfo, summary, experiences, education, skills, projects, customSections, themeColor } = resume;

  return (
    <div className="flex flex-col sm:flex-row min-h-full font-sans text-slate-800 bg-white">
      {/* Sidebar (Left Column) */}
      <aside className="w-full sm:w-[32%] bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-5 break-inside-avoid">
        {/* Photo and Name */}
        <div className="text-center sm:text-left">
          {personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-24 h-24 rounded-xl mx-auto sm:mx-0 object-cover border-2 shadow-sm mb-3"
              style={{ borderColor: themeColor }}
            />
          )}
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-xs font-semibold mt-0.5" style={{ color: themeColor || '#0284c7' }}>
            {personalInfo.jobTitle || 'Target Role'}
          </p>
        </div>

        {/* Contact info */}
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b pb-1">
            Contact Info
          </h2>
          <div className="space-y-1.5 text-xs text-slate-600">
            {personalInfo.email && (
              <div className="flex items-center gap-1.5 break-all">
                <Mail className="w-3 h-3 shrink-0" style={{ color: themeColor }} />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 shrink-0" style={{ color: themeColor }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 shrink-0" style={{ color: themeColor }} />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-1.5 break-all">
                <Globe className="w-3 h-3 shrink-0" style={{ color: themeColor }} />
                <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-1.5 break-all">
                <Linkedin className="w-3 h-3 shrink-0" style={{ color: themeColor }} />
                <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-1.5 break-all">
                <Github className="w-3 h-3 shrink-0" style={{ color: themeColor }} />
                <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b pb-1">
              Skills & Tools
            </h2>
            <div className="space-y-3">
              {skills.map((cat, idx) => (
                <div key={cat.id || idx}>
                  <div className="text-[11px] font-bold text-slate-700 mb-1">{cat.name}</div>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills?.map((s, sIdx) => (
                      <span key={sIdx} className="bg-white border border-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education in sidebar */}
        {education && education.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b pb-1">
              Education
            </h2>
            <div className="space-y-2.5 text-xs">
              {education.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600 text-[11px]">{edu.fieldOfStudy}</div>
                  <div className="text-slate-500 text-[11px]">{edu.institution}</div>
                  <div className="text-slate-400 text-[10px]">{edu.startDate} – {edu.endDate}</div>
                  {edu.gpa && <div className="text-slate-500 text-[10px] font-medium">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom sections / certifications in sidebar */}
        {customSections && customSections.length > 0 && (
          <div>
            {customSections.map((sec, idx) => (
              <div key={sec.id || idx} className="mb-3">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 border-b pb-1">
                  {sec.title}
                </h2>
                <div className="space-y-2 text-xs">
                  {sec.items?.map((item, itemIdx) => (
                    <div key={item.id || itemIdx}>
                      <div className="font-semibold text-slate-800 text-[11px]">{item.title}</div>
                      {item.subtitle && <div className="text-slate-500 text-[10px]">{item.subtitle}</div>}
                      {item.date && <div className="text-slate-400 text-[10px]">{item.date}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Body (Right Column) */}
      <main className="w-full sm:w-[68%] p-6 sm:p-8 flex flex-col gap-5">
        {/* Summary */}
        {summary && (
          <section className="section-gap break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-2 border-b-2" style={{ borderColor: themeColor }}>
              Executive Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-normal text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <section className="section-gap">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2" style={{ borderColor: themeColor }}>
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="item-gap break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-sm">{exp.position}</span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.current) && '–'} {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-medium" style={{ color: themeColor }}>
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.description && <p className="text-xs text-slate-600 mt-1 italic">{exp.description}</p>}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="bullet-gap list-disc ml-4 space-y-1 text-xs text-slate-700 mt-1.5">
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 mb-3 border-b-2" style={{ borderColor: themeColor }}>
              Key Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="text-xs break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-[11px] hover:underline" style={{ color: themeColor }}>
                        View Project
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <div className="text-[11px] text-slate-500 font-medium">{proj.technologies.join(' • ')}</div>
                  )}
                  {proj.description && <p className="text-slate-600 mt-0.5">{proj.description}</p>}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc ml-4 space-y-0.5 text-slate-700 mt-1">
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
      </main>
    </div>
  );
}
