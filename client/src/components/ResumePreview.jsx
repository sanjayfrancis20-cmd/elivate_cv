import React, { forwardRef } from 'react';
import ModernSlate from './templates/ModernSlate';
import NordicMinimal from './templates/NordicMinimal';
import ExecutiveNavy from './templates/ExecutiveNavy';
import TechEmerald from './templates/TechEmerald';
import SinglePagePro from './templates/SinglePagePro';

const ResumePreview = forwardRef(({
  resume,
  zoom = 100,
  activeSection = null,
  onSelectSection = null,
  onTriggerAi = null,
  onEditSection = null,
  fillColor = '#ffffff',
  textColor = '#0f172a',
  textAlign = 'left'
}, ref) => {
  const templateProps = {
    resume,
    activeSection,
    onSelectSection,
    onTriggerAi,
    onEditSection,
    textColor
  };

  const getTemplateComponent = () => {
    switch (resume.template) {
      case 'single-page-pro':
        return <SinglePagePro {...templateProps} />;
      case 'nordic-minimal':
        return <NordicMinimal {...templateProps} />;
      case 'executive-navy':
        return <ExecutiveNavy {...templateProps} />;
      case 'tech-emerald':
        return <TechEmerald {...templateProps} />;
      case 'modern-slate':
      default:
        return <SinglePagePro {...templateProps} />;
    }
  };

  const getFontClass = () => {
    switch (resume.fontFamily) {
      case 'jakarta':
        return 'font-jakarta';
      case 'outfit':
        return 'font-display';
      case 'merriweather':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'inter':
      default:
        return 'font-sans';
    }
  };

  const getSpacingClass = () => {
    switch (resume.spacing) {
      case 'compact':
        return 'resume-spacing-compact';
      case 'relaxed':
        return 'resume-spacing-relaxed';
      case 'normal':
      default:
        return 'resume-spacing-normal';
    }
  };

  const scaleRatio = zoom / 100;

  return (
    <div className="flex justify-center items-start min-h-full p-4 sm:p-8 overflow-auto">
      <div
        style={{
          transform: `scale(${scaleRatio})`,
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out'
        }}
        className="transition-all"
      >
        <div
          ref={ref}
          id="printable-resume"
          style={{ backgroundColor: fillColor || '#ffffff' }}
          className={`print-area resume-sheet shadow-resume rounded-sm overflow-hidden ${getFontClass()} ${getSpacingClass()}`}
        >
          {getTemplateComponent()}
        </div>
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
