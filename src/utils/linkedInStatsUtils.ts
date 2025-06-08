
interface Experience {
  title: string;
  companyName: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export const calculateExperienceStats = (experiences: Experience[]) => {
  const totalYearsExperience = experiences.reduce((total, exp) => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.isCurrent ? new Date() : new Date(exp.endDate);
    const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return total + years;
  }, 0);

  const currentRoles = experiences.filter(exp => exp.isCurrent).length;
  const companies = [...new Set(experiences.map(exp => exp.companyName))].length;

  return {
    totalYears: Math.round(totalYearsExperience * 10) / 10,
    currentRoles,
    companies,
  };
};
