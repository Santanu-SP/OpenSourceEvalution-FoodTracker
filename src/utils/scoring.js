// src/utils/scoring.js
// Health grade derived from Nutri-Score and select nutrients; Eco-Score to CO2 estimate; Eco-points gamification.

const gradeMap = { a: 5, b: 4, c: 3, d: 2, e: 1 };

export const nutriGradeScore = (nutri) => gradeMap[(nutri || '').toLowerCase()] ?? 0;
export const ecoGradeScore = (eco) => gradeMap[(eco || '').toLowerCase()] ?? 0;

export const deriveHealthGrade = (nutri, nutrients = {}) => {
  const base = nutriGradeScore(nutri);
  if (!base) return { label: 'Unknown', value: 0, color: '#6b7280' };

  let mod = 0;
  const sugars = nutrients.sugars_100g ?? null;
  const satFat = nutrients.saturated_fat_100g ?? null;
  const fiber = nutrients.fiber_100g ?? null;
  // Penalize high sugars/sat fat, boost fiber
  if (sugars != null) mod += sugars > 15 ? -1 : sugars < 5 ? +1 : 0;
  if (satFat != null) mod += satFat > 5 ? -1 : satFat < 2 ? +1 : 0;
  if (fiber != null) mod += fiber > 5 ? +1 : fiber < 2 ? -1 : 0;

  const value = Math.max(1, Math.min(5, base + mod));
  const labels = ['Very poor', 'Poor', 'Average', 'Good', 'Excellent'];
  const colors = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#16a34a'];
  return { label: labels[value - 1], value, color: colors[value - 1] };
};

// CO2 estimate: use carbonFootprint if present; else map eco score to a heuristic kg CO2e per 100g.
export const estimateCO2ePer100g = (ecoGrade, carbonFootprint) => {
  if (typeof carbonFootprint === 'number') return carbonFootprint;
  const map = {
    a: 0.3, // best practices, low footprint
    b: 0.6,
    c: 1.2,
    d: 2.0,
    e: 3.0
  };
  return map[(ecoGrade || '').toLowerCase()] ?? 1.5;
};

// Eco-points: reward better eco and health grades, penalize additives, bonus for choosing alternatives
export const calculateEcoPoints = ({ ecoGrade, healthValue, additivesCount = 0, isAlternative = false }) => {
  const eco = ecoGradeScore(ecoGrade) * 10;
  const health = (healthValue || 0) * 8;
  const additivesPenalty = Math.min(additivesCount * 2, 20);
  const altBonus = isAlternative ? 15 : 0;
  return Math.max(0, eco + health + altBonus - additivesPenalty);
};

export const gradeBadgeColor = (grade) => {
  const g = (grade || '').toLowerCase();
  return { a: '#16a34a', b: '#22c55e', c: '#f59e0b', d: '#f97316', e: '#ef4444' }[g] || '#6b7280';
};