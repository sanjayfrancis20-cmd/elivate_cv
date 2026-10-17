import React from 'react';
import { Bold, Italic, Underline, Sparkles, Edit3, Link as LinkIcon, Trash2 } from 'lucide-react';

export default function SectionContainer({
  id,
  label,
  activeSection,
  onSelectSection,
  onTriggerAi,
  onEditSection,
  children,
  className = ''
}) {
  const isActive = activeSection === id;

  const handleClick = (e) => {
    e.stopPropagation();
    if (onSelectSection) {
      onSelectSection(id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative transition-all duration-150 cursor-pointer ${
        isActive
          ? 'outline outline-2 outline-dashed outline-orange-500 rounded-sm bg-orange-500/[0.02]'
          : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-slate-300 rounded-sm'
      } ${className}`}
    >
      {/* Corner Handles when active */}
      {isActive && (
        <>
          <span className="no-print absolute -top-1 -left-1 w-2 h-2 bg-orange-500 border border-white rounded-xs z-30" />
          <span className="no-print absolute -top-1 -right-1 w-2 h-2 bg-orange-500 border border-white rounded-xs z-30" />
          <span className="no-print absolute -bottom-1 -left-1 w-2 h-2 bg-orange-500 border border-white rounded-xs z-30" />
          <span className="no-print absolute -bottom-1 -right-1 w-2 h-2 bg-orange-500 border border-white rounded-xs z-30" />
        </>
      )}

      {/* Orange Badge Tag at top-left */}
      {isActive && (
        <div className="no-print absolute -top-3.5 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-30 uppercase tracking-wider flex items-center gap-1 select-none pointer-events-none">
          <span>{label || id}</span>
        </div>
      )}

      {/* Floating Contextual Dark Toolbar */}
      {isActive && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="no-print absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2.5 py-1 rounded-full shadow-2xl flex items-center gap-1.5 z-40 text-xs border border-slate-700 animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            type="button"
            title="Bold"
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Italic"
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Underline"
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Link"
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-3.5 bg-slate-700 my-auto" />

          {onTriggerAi && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTriggerAi(id);
              }}
              className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded text-white text-[11px] font-medium shadow-sm transition"
            >
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>AI Polish</span>
            </button>
          )}

          {onEditSection && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditSection(id);
              }}
              className="flex items-center gap-1 px-2 py-0.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white text-[11px] transition"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
