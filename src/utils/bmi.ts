export const calculateBMI = (weight: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(2));
};

export const calculateRiskScore = (bmi: number, sleepHours: number, activityLevel: string): number => {
  let score = 0;

  // BMI risk
  if (bmi < 18.5 || bmi > 30) score += 30;
  else if (bmi > 25) score += 15;

  // Sleep risk
  if (sleepHours < 6) score += 25;
  else if (sleepHours < 7) score += 10;

  // Activity risk
  if (activityLevel === 'Low') score += 25;
  else if (activityLevel === 'Moderate') score += 10;

  return Math.min(score, 100);
};
