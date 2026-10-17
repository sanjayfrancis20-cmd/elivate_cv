import React from 'react';

export default function NordicMinimal({ resume }) {
  const { personalInfo, summary, experiences, education, skills, projects, customSections, themeColor } = resume;

  return (
    <div className="p-8 sm:p-12 font-sans leading-relaxed text-slate-800 bg-white">
      {/* Centered Minimal Header */}
      <header className="text-center pb-8 border-b border-slate-200">
        <h1 className="text-3xl sm:text-4xl font-light tracking-wide text-slate-900 uppercase">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-sm font-medium tracking-widest uppercase mt-2" style={{ color: themeColor || '#059669' }}>
          {personalInfo.jobTitle || 'Target Role'}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && <span>• {personalInfo.website.replace(/^https?:\/\//, '')}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>}
          {personalInfo.github && <span>• {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="section-gap mt-6 break-inside-avoid">
          <p className="text-xs sm:text-sm text-slate-600 text-center max-w-2xl mx-auto italic leading-normal">
            "{summary}"
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <section className="section-gap mt-6">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 border-b border-slate-100 pb-1 mb-4">
            Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx} className="item-gap break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-slate-900 text-sm">{exp.position}</span>
                    <span className="text-slate-500 text-xs ml-2">/ {exp.company}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {exp.startDate} {exp.startDate && (exp.endDate || exp.current) && '–'} {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="bullet-gap space-y-1 text-xs text-slate-600 mt-1 pl-3 border-l" style={{ borderColor: themeColor }}>
                    {exp.highlights.filter(Boolean).map((h, hIdx) => (
                      <li key={hIdx} className="leading-relaxed">{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="section-gap mt-6 break-inside-avoid">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 border-b border-slate-100 pb-1 mb-3">
            Expertise & Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {skills.map((cat, idx) => (
              <div key={cat.id || idx}>
                <div className="font-medium text-slate-700 mb-1">{cat.name}</div>
                <div className="text-slate-500 text-[11px] leading-relaxed">
                  {cat.skills?.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="section-gap mt-6 break-inside-avoid">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 border-b border-slate-100 pb-1 mb-3">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="text-xs break-inside-avoid">
                <div className="flex justify-between items-baseline font-medium text-slate-900">
                  <span>{proj.name}</span>
                  {proj.technologies && (
                    <span className="text-[11px] text-slate-400">{proj.technologies.join(', ')}</span>
                  )}
                </div>
                {proj.description && <p className="text-slate-600 mt-0.5">{proj.description}</p>}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc ml-4 space-y-0.5 text-slate-600 mt-1">
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
        <section className="section-gap mt-6 break-inside-avoid">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 border-b border-slate-100 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-2 text-xs">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-medium text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                  <div className="text-slate-500">{edu.institution} {edu.gpa && `(GPA: ${edu.gpa})`}</div>
                </div>
                <span className="text-[11px] text-slate-400">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && customSections.map((sec, idx) => (
        <section key={sec.id || idx} className="section-gap mt-6 break-inside-avoid">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400 border-b border-slate-100 pb-1 mb-3">
            {sec.title}
          </h2>
          <div className="space-y-2 text-xs">
            {sec.items?.map((item, itemIdx) => (
              <div key={item.id || itemIdx}>
                <div className="flex justify-between font-medium text-slate-900">
                  <span>{item.title}</span>
                  {item.date && <span className="text-[11px] text-slate-400">{item.date}</span>}
                </div>
                {item.subtitle && <div className="text-slate-500">{item.subtitle}</div>}
                {item.description && <div className="text-slate-600 mt-0.5">{item.description}</div>}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
