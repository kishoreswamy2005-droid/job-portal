const fs = require('fs');
const path = require('path');

/**
 * Basic resume keyword extractor
 * Extracts skills, experience mentions, education keywords from PDF text
 */
const parseResume = async (filePath) => {
  try {
    const pdf = require('pdf-parse');
    const absolutePath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(absolutePath)) {
      return { text: '', keywords: [], skills: [] };
    }

    const dataBuffer = fs.readFileSync(absolutePath);
    const data = await pdf(dataBuffer);
    const text = data.text.toLowerCase();

    // Common tech skills to look for
    const techSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'express', 'mongodb',
      'sql', 'html', 'css', 'typescript', 'vue', 'angular', 'aws', 'docker',
      'kubernetes', 'git', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin',
      'machine learning', 'deep learning', 'data science', 'tensorflow', 'pytorch',
      'figma', 'photoshop', 'illustrator', 'ux', 'ui design',
      'project management', 'agile', 'scrum', 'jira', 'excel', 'powerpoint',
    ];

    const foundSkills = techSkills.filter((skill) => text.includes(skill));
    const wordFrequency = {};
    const words = text.match(/\b[a-z]{4,}\b/g) || [];
    words.forEach((word) => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    const keywords = Object.entries(wordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);

    return { text: data.text.slice(0, 500), keywords, skills: foundSkills };
  } catch (error) {
    console.error('Resume parsing error:', error.message);
    return { text: '', keywords: [], skills: [] };
  }
};

module.exports = { parseResume };
