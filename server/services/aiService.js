import OpenAI from 'openai';

// Built-in intelligent fallback suggestion templates and rules
const ACTION_VERBS = [
  'Spearheaded', 'Architected', 'Orchestrated', 'Engineered', 'Accelerated',
  'Streamlined', 'Pioneered', 'Optimized', 'Transformed', 'Instituted',
  'Automated', 'Devised', 'Delivered', 'Expanded', 'Cultivated'
];

function fallbackImproveSummary(currentText, targetRole) {
  const role = targetRole || 'Software Professional';
  if (!currentText || currentText.trim().length < 10) {
    return [
      `Results-driven ${role} with a demonstrated track record of designing scalable solutions, driving architectural improvements, and delivering business value in high-velocity agile environments.`,
      `Innovative ${role} specializing in modern full-stack development, cloud-native systems, and cross-functional leadership, with a strong focus on code quality, performance optimization, and developer productivity.`,
      `Passionate and analytical ${role} with hands-on expertise across modern engineering paradigms. Adept at translating complex product requirements into robust, high-availability production applications.`
    ];
  }

  return [
    `Impact-focused ${role} with proven expertise in end-to-end development. ${currentText.trim().replace(/\.$/, '')}, consistently driving measurable improvements in system performance, user engagement, and project delivery timelines.`,
    `Results-oriented ${role} known for technical rigor and strategic problem-solving. ${currentText.trim().replace(/\.$/, '')}, leveraging modern best practices to optimize workflows and scale business-critical applications.`,
    `Dynamic ${role} blending technical leadership with execution excellence. ${currentText.trim().replace(/\.$/, '')}, collaborating across teams to ship high-impact features ahead of deadlines.`
  ];
}

function fallbackImproveBullet(currentBullet, role) {
  const clean = (currentBullet || '').trim();
  const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
  
  if (!clean || clean.length < 5) {
    return [
      `${verb} core features and cloud microservices, cutting response latency by 35% and improving platform scalability for 100k+ active users.`,
      `Engineered automated CI/CD deployment pipelines, reducing release turnaround times by 40% and eliminating manual deployment errors.`,
      `Collaborated with cross-functional product and design teams to launch key user-facing workflows, increasing customer retention by 22%.`
    ];
  }

  // Turn passive phrases into XYZ formula
  return [
    `${verb} ${clean.replace(/^(responsible for|worked on|helped with|did|handled|managed)\s+/i, '')}, improving operational efficiency by 28% and driving end-to-end reliability across critical workflows.`,
    `Architected and deployed scalable solutions for ${clean.replace(/^(responsible for|worked on|helped with|did|handled|managed)\s+/i, '')}, reducing processing bottlenecks by 40% while upholding rigorous test coverage.`,
    `Spearheaded the redesign and optimization of ${clean.replace(/^(responsible for|worked on|helped with|did|handled|managed)\s+/i, '')}, delivering a 30% reduction in downtime and boosting team velocity.`
  ];
}

function fallbackSuggestSkills(targetRole, existingSkills = []) {
  const roleLower = (targetRole || '').toLowerCase();
  
  const skillSets = {
    frontend: ['React 18', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux Toolkit', 'GraphQL', 'Web Vitals', 'Jest/Vitest', 'Webpack/Vite', 'Storybook'],
    backend: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'RESTful APIs', 'gRPC', 'Microservices Architecture'],
    fullstack: ['React.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS (S3, EC2, Lambda)', 'Tailwind CSS', 'CI/CD Pipelines', 'System Design', 'Git/GitHub'],
    ai: ['Python', 'PyTorch', 'LangChain', 'OpenAI API', 'Hugging Face', 'Vector Databases (Pinecone/Chroma)', 'Prompt Engineering', 'RAG Architecture', 'FastAPI'],
    default: ['Agile / Scrum', 'System Architecture', 'Cross-functional Collaboration', 'Performance Tuning', 'Code Review & Mentorship', 'CI/CD Automation', 'API Design', 'Test-Driven Development']
  };

  let pool = skillSets.fullstack;
  if (roleLower.includes('front')) pool = skillSets.frontend;
  else if (roleLower.includes('back')) pool = skillSets.backend;
  else if (roleLower.includes('ai') || roleLower.includes('ml') || roleLower.includes('data')) pool = skillSets.ai;

  const existingSet = new Set(existingSkills.map(s => s.toLowerCase()));
  const suggestions = pool.filter(s => !existingSet.has(s.toLowerCase()));
  return suggestions.length > 0 ? suggestions : skillSets.default;
}

function fallbackAtsReview(resumeData) {
  let score = 75;
  const strengths = [];
  const improvements = [];
  const missingKeywords = [];

  const hasSummary = resumeData.summary && resumeData.summary.length > 40;
  if (hasSummary) {
    score += 5;
    strengths.push('Strong professional summary present with career positioning.');
  } else {
    score -= 10;
    improvements.push('Add an impactful professional summary with 2-3 sentences emphasizing your core value proposition.');
  }

  const expCount = (resumeData.experiences || []).length;
  if (expCount >= 2) {
    score += 5;
    strengths.push(`Solid work experience history with ${expCount} documented roles.`);
  } else {
    score -= 5;
    improvements.push('Expand your experience section with at least 2 detailed positions or relevant internship/freelance work.');
  }

  let totalBullets = 0;
  let quantifiedBullets = 0;
  (resumeData.experiences || []).forEach(exp => {
    (exp.highlights || []).forEach(b => {
      totalBullets++;
      if (/\d+%|\$\d+|\d+\+|\b(reduced|increased|improved|scaled|cut|grew)\b/i.test(b)) {
        quantifiedBullets++;
      }
    });
  });

  if (quantifiedBullets >= 3) {
    score += 10;
    strengths.push(`Great use of quantifiable metrics in ${quantifiedBullets} bullet points (percentages, dollar amounts, scale).`);
  } else {
    score -= 8;
    improvements.push('Quantify your achievements! Follow Google’s formula: "Accomplished [X], measured by [Y], by doing [Z]" with concrete % or numbers.');
  }

  const skillsCount = (resumeData.skills || []).reduce((acc, cat) => acc + (cat.skills || []).length, 0);
  if (skillsCount >= 8) {
    score += 5;
    strengths.push(`Comprehensive skill inventory with ${skillsCount} targeted competencies.`);
  } else {
    improvements.push('Add more relevant keywords and technical tools to your skills section to pass automated ATS filters.');
  }

  // Job title keywords
  const title = (resumeData.targetJobTitle || resumeData.personalInfo?.jobTitle || '').toLowerCase();
  if (title.includes('developer') || title.includes('engineer')) {
    missingKeywords.push('CI/CD', 'Automated Testing', 'Cloud Infrastructure (AWS/GCP)', 'Scalability');
  } else if (title.includes('manager') || title.includes('lead')) {
    missingKeywords.push('OKRs', 'Team Leadership', 'Stakeholder Management', 'Roadmap Strategy');
  } else {
    missingKeywords.push('Agile Methodology', 'Cross-Functional Collaboration', 'Data-driven Optimization');
  }

  const finalScore = Math.max(30, Math.min(98, score));

  return {
    score: finalScore,
    grade: finalScore >= 85 ? 'Excellent' : finalScore >= 70 ? 'Good' : 'Needs Optimization',
    strengths,
    improvements,
    recommendedKeywords: missingKeywords,
    summary: `Your resume currently scores ${finalScore}/100 for ATS compatibility. Focusing on quantifying bullet points and aligning keywords with your target role will maximize interview callbacks.`
  };
}

export const aiService = {
  getOpenAIClient(customApiKey) {
    const key = customApiKey || process.env.OPENAI_API_KEY;
    if (!key) return null;
    return new OpenAI({ apiKey: key });
  },

  async suggest({ type, currentText, targetRole, existingSkills, jobDescription, resumeData, customApiKey }) {
    const openai = this.getOpenAIClient(customApiKey);

    // If no OpenAI key configured, return high quality fallback
    if (!openai) {
      return this.generateFallback({ type, currentText, targetRole, existingSkills, jobDescription, resumeData, reason: 'No OpenAI API key provided. Using built-in Smart AI engine.' });
    }

    try {
      if (type === 'improve_summary') {
        const prompt = `You are an elite executive resume writer. 
Improve the following professional summary for a "${targetRole || 'Software Professional'}".
Current Summary: "${currentText || 'Seeking a software role'}"

Provide 3 distinct, high-impact variations:
1. Impact & Leadership focused
2. Technical & Performance focused
3. Modern & Concise (under 50 words)

Return ONLY valid JSON in this exact format:
{
  "suggestions": ["Option 1 text", "Option 2 text", "Option 3 text"]
}`;

        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        return {
          type,
          suggestions: parsed.suggestions || [],
          source: 'openai-gpt3.5'
        };
      }

      if (type === 'improve_bullet') {
        const prompt = `You are a FAANG recruiter and career coach.
Enhance this work experience bullet point for a "${targetRole || 'Software Professional'}":
"${currentBullet || currentText}"

Rules:
- Apply Google's XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]"
- Start with a compelling action verb (e.g. Architected, Spearheaded, Accelerated)
- Include realistic quantified impact (e.g. % improvement, latency reduction, cost savings)

Return ONLY valid JSON in this exact format:
{
  "suggestions": ["Option 1 text", "Option 2 text", "Option 3 text"]
}`;

        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        return {
          type,
          suggestions: parsed.suggestions || [],
          source: 'openai-gpt3.5'
        };
      }

      if (type === 'suggest_skills') {
        const prompt = `You are a technical recruiter. Suggest 8-12 high-priority skills, tools, and technologies for a "${targetRole || 'Full Stack Developer'}".
Already included: ${(existingSkills || []).join(', ')}.
Exclude already included skills.

Return ONLY valid JSON in this exact format:
{
  "skills": ["Skill 1", "Skill 2", "Skill 3"]
}`;

        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.6,
          response_format: { type: 'json_object' }
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        return {
          type,
          skills: parsed.skills || [],
          source: 'openai-gpt3.5'
        };
      }

      if (type === 'ats_review') {
        const prompt = `You are an expert ATS (Applicant Tracking System) parser and senior recruiter.
Analyze this resume data:
Target Job: ${resumeData?.targetJobTitle || 'Software Engineer'}
Summary: ${resumeData?.summary || 'None'}
Experiences: ${JSON.stringify(resumeData?.experiences || [])}
Skills: ${JSON.stringify(resumeData?.skills || [])}

Provide:
1. ATS score between 0 and 100
2. Overall grade (Needs Work, Good, Excellent)
3. 3 specific strengths
4. 3 actionable improvements
5. 4-6 recommended keywords to add
6. Executive summary critique (1-2 sentences)

Return ONLY valid JSON in this format:
{
  "score": 85,
  "grade": "Good",
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "recommendedKeywords": ["...", "..."],
  "summary": "..."
}`;

        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.5,
          response_format: { type: 'json_object' }
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        return {
          type,
          review: parsed,
          source: 'openai-gpt3.5'
        };
      }

      if (type === 'tailor_to_job') {
        const prompt = `You are an expert hiring manager.
Compare this candidate's resume with the target Job Description:
Job Description:
${(jobDescription || '').slice(0, 1500)}

Candidate Summary: ${resumeData?.summary || ''}
Candidate Skills: ${JSON.stringify(resumeData?.skills || [])}

Identify:
1. Matching keywords found
2. Critical missing keywords
3. Tailored summary suggestion designed to match this specific job posting
4. 2 tailored bullet points to incorporate

Return ONLY valid JSON in this format:
{
  "matchScore": 78,
  "matchingKeywords": ["..."],
  "missingKeywords": ["..."],
  "tailoredSummary": "...",
  "recommendedBullets": ["...", "..."]
}`;

        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.6,
          response_format: { type: 'json_object' }
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        return {
          type,
          analysis: parsed,
          source: 'openai-gpt3.5'
        };
      }

      // Default fallback
      return this.generateFallback({ type, currentText, targetRole, existingSkills, jobDescription, resumeData });
    } catch (error) {
      console.warn('OpenAI API call failed or quota exceeded. Falling back to Smart Engine:', error.message);
      return this.generateFallback({
        type,
        currentText,
        targetRole,
        existingSkills,
        jobDescription,
        resumeData,
        reason: `OpenAI note: ${error.message}. Generated using Smart Suggestion Engine.`
      });
    }
  },

  generateFallback({ type, currentText, targetRole, existingSkills, jobDescription, resumeData, reason }) {
    if (type === 'improve_summary') {
      return {
        type,
        suggestions: fallbackImproveSummary(currentText, targetRole),
        source: 'smart-fallback',
        note: reason
      };
    }
    if (type === 'improve_bullet') {
      return {
        type,
        suggestions: fallbackImproveBullet(currentText, targetRole),
        source: 'smart-fallback',
        note: reason
      };
    }
    if (type === 'suggest_skills') {
      return {
        type,
        skills: fallbackSuggestSkills(targetRole, existingSkills),
        source: 'smart-fallback',
        note: reason
      };
    }
    if (type === 'ats_review') {
      return {
        type,
        review: fallbackAtsReview(resumeData || {}),
        source: 'smart-fallback',
        note: reason
      };
    }
    if (type === 'tailor_to_job') {
      const skills = fallbackSuggestSkills(targetRole, existingSkills);
      return {
        type,
        analysis: {
          matchScore: 82,
          matchingKeywords: ['TypeScript', 'React.js', 'REST APIs', 'Agile'],
          missingKeywords: skills.slice(0, 4),
          tailoredSummary: `Accomplished ${targetRole || 'Software Professional'} with proven ability to deliver high-performance applications aligned directly with cross-functional business requirements. Experienced in full development lifecycle from initial architecture to automated deployment.`,
          recommendedBullets: [
            `Spearheaded key architectural enhancements aligned with business goals, accelerating system performance by 30%.`,
            `Engineered resilient microservices and integrated automated testing, ensuring 99.9% uptime.`
          ]
        },
        source: 'smart-fallback',
        note: reason
      };
    }

    return {
      type,
      suggestions: ['Provide clearer metrics and outcomes for each accomplishment.'],
      source: 'smart-fallback'
    };
  }
};
