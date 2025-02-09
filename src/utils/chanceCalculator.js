// Point values for academic stats
const getAcademicPoints = (stats, collegeStats) => {
  let points = 0;
  
  // GPA evaluation (weighted more heavily)
  const avgGPA = 3.5 // Default average GPA if not available
  if (stats.uwGpa >= avgGPA) points += 40
  else if (stats.uwGpa >= avgGPA - 0.2) points += 30
  else if (stats.uwGpa >= avgGPA - 0.4) points += 20
  else points += 10

  // SAT evaluation - handle missing data
  const avgSAT = collegeStats['latest.admissions.sat_scores.average.overall'] || 1200 // Default if not available
  if (stats.sat >= avgSAT + 100) points += 30
  else if (stats.sat >= avgSAT) points += 25
  else if (stats.sat >= avgSAT - 100) points += 15
  else points += 5

  return points;
}

// Point values for extracurriculars
const getExtracurricularPoints = (activities) => {
  return activities.reduce((points, activity) => {
    const level = parseInt(activity.level) || 0;
    // Weight points based on activity level (1-10)
    switch (true) {
      case level >= 9: return points + 15; // National level
      case level >= 7: return points + 10; // State/Regional level
      case level >= 5: return points + 7;  // Significant school level
      case level >= 3: return points + 5;  // Active participation
      default: return points + 2;          // Basic participation
    }
  }, 0);
}

// Point values for awards
const getAwardPoints = (awards) => {
  return awards.reduce((points, award) => {
    switch (award.level) {
      case 'international': return points + 20;
      case 'national': return points + 15;
      case 'state': return points + 10;
      case 'regional': return points + 7;
      case 'district': return points + 5;
      case 'school': return points + 3;
      default: return points;
    }
  }, 0);
}

export const calculateChances = (collegeStats, studentData) => {
  // Ensure we have a valid admission rate, default to reasonable value if not available
  const baseRate = (collegeStats['latest.admissions.admission_rate.overall'] || 0.20) * 100;
  
  // Calculate points from different categories
  const academicPoints = getAcademicPoints(studentData, collegeStats);
  const extracurricularPoints = getExtracurricularPoints(studentData.extracurriculars);
  const awardPoints = getAwardPoints(studentData.awards);
  
  // Total possible points
  const maxPoints = 100;
  
  // Calculate total points earned
  const totalPoints = Math.min(academicPoints + extracurricularPoints + awardPoints, maxPoints);
  
  // Calculate adjustment factor (-50% to +50% of base rate)
  const adjustmentFactor = ((totalPoints / maxPoints) * 2 - 1) * 0.5;
  
  // Calculate personalized rate with minimum threshold
  let personalizedRate = Math.max(baseRate * (1 + adjustmentFactor), 1);
  
  // Ensure rate stays within reasonable bounds
  personalizedRate = Math.min(personalizedRate, 95);
  
  return {
    baseRate: baseRate.toFixed(1),
    personalizedRate: personalizedRate.toFixed(1),
    details: {
      academicPoints,
      extracurricularPoints,
      awardPoints,
      totalPoints
    }
  };
} 