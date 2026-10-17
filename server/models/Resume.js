import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  company: { type: String, default: '' },
  position: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  highlights: [{ type: String }],
  description: { type: String, default: '' }
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  fieldOfStudy: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  gpa: { type: String, default: '' },
  honors: { type: String, default: '' }
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  link: { type: String, default: '' },
  github: { type: String, default: '' },
  highlights: [{ type: String }]
}, { _id: false });

const SkillCategorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, default: 'Technical Skills' },
  skills: [{ type: String }]
}, { _id: false });

const CustomSectionItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  date: { type: String, default: '' },
  description: { type: String, default: '' }
}, { _id: false });

const CustomSectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, default: 'Certifications & Awards' },
  items: [CustomSectionItemSchema]
}, { _id: false });

const ResumeSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Resume' },
  targetJobTitle: { type: String, default: '' },
  template: { type: String, default: 'modern-slate' },
  themeColor: { type: String, default: '#4f46e5' },
  fontFamily: { type: String, default: 'inter' },
  spacing: { type: String, default: 'normal' },
  personalInfo: {
    fullName: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    photoUrl: { type: String, default: '' }
  },
  summary: { type: String, default: '' },
  experiences: [ExperienceSchema],
  education: [EducationSchema],
  skills: [SkillCategorySchema],
  projects: [ProjectSchema],
  customSections: [CustomSectionSchema]
}, {
  timestamps: true
});

export const Resume = mongoose.model('Resume', ResumeSchema);
