/**
 * Skill-based job recommendation engine
 * Scores each job by the number of matching skills with the user's skill set.
 */
const recommendJobs = (userSkills = [], jobs = []) => {
  if (!userSkills || userSkills.length === 0) return jobs;

  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());

  const scored = jobs.map((job) => {
    const jobSkills = (job.skillsRequired || []).map((s) => s.toLowerCase().trim());
    const matches = jobSkills.filter((skill) =>
      normalizedUserSkills.some(
        (us) => us.includes(skill) || skill.includes(us)
      )
    ).length;

    const score = jobSkills.length > 0 ? (matches / jobSkills.length) * 100 : 0;
    return { ...job.toObject(), matchScore: Math.round(score), matchCount: matches };
  });

  return scored
    .filter((j) => j.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
};

module.exports = { recommendJobs };
