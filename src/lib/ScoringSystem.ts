import type { ReadingScore, SpreadModifiers, ThematicCategory } from '../types';
import { calculateSeasonalBonus } from '../components/reading/SeasonalModifiers';

interface ScoringDetails {
  score: number;
  breakdown: string[];
  bonuses: { [key: string]: number };
}

export const CORE_METRICS = ['subtlety', 'relatability', 'wisdom', 'creative', 'humor'] as const;
export const MINIMUM_SCORE = 8; // Changed from percentage to 10-point scale
export const MINIMUM_SHADE_LEVEL = 7;

// Helper to convert between scales
const convertTo10PointScale = (score: number): number => Math.round((score / 100) * 10);
const convertToPercentage = (score: number): number => (score / 10) * 100;

export const calculateReadingScore = (
  baseScores: Partial<ReadingScore>,
  spreadModifiers: SpreadModifiers,
  thematicCategories: ThematicCategory[]
): ScoringDetails => {
  let totalScore = 0;
  const breakdown: string[] = [];
  const bonuses: { [key: string]: number } = {};

  // Apply base multiplier to core metrics
  CORE_METRICS.forEach(metric => {
    const baseScore = baseScores[metric] || 0;
    const score10Point = convertTo10PointScale(baseScore);
    const modifiedScore = score10Point * spreadModifiers.baseMultiplier;
    totalScore += modifiedScore;
    breakdown.push(`${metric}: ${score10Point}/10 → ${modifiedScore.toFixed(1)} (×${spreadModifiers.baseMultiplier})`);
  });

  // Apply seasonal modifiers
  const { modifiedScore, activeEvents, bonusPoints } = calculateSeasonalBonus(
    totalScore,
    thematicCategories
  );

  if (bonusPoints > 0) {
    totalScore = modifiedScore;
    activeEvents.forEach(event => {
      breakdown.push(`${event.name} bonus: +${bonusPoints} (×${event.scoreMultiplier})`);
      bonuses[event.name] = bonusPoints;
    });
  }

  // Apply category-specific multipliers after seasonal bonuses
  thematicCategories.forEach(category => {
    const multiplier = spreadModifiers.categoryMultipliers[category] || 1;
    const bonus = totalScore * (multiplier - 1);
    totalScore += bonus;
    bonuses[category] = bonus;
    breakdown.push(`${category} bonus: +${bonus.toFixed(1)}`);
  });

  // Special condition bonuses
  Object.entries(spreadModifiers.specialConditionThresholds).forEach(([condition, threshold]) => {
    if (totalScore >= threshold) {
      const bonus = spreadModifiers.thematicBonus || 0;
      totalScore += bonus;
      bonuses[condition] = bonus;
      breakdown.push(`${condition} bonus achieved: +${bonus}`);
    }
  });

  return {
    score: Math.round(totalScore),
    breakdown,
    bonuses,
    activeEvents
  };
};

export const evaluateReadingQuality = (score: ReadingScore): {
  isPassing: boolean;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let failingMetrics = 0;

  // Check core metrics using 10-point scale
  CORE_METRICS.forEach(metric => {
    const score10Point = convertTo10PointScale(score[metric]);
    if (score10Point < MINIMUM_SCORE) {
      failingMetrics++;
      feedback.push(`${metric} needs work (${score10Point}/10)`);
    }
  });

  // Check shade level components
  const shadeScores = Object.entries(score.shadeIndex);
  const averageShade = shadeScores.reduce((sum, [_, value]) => sum + value, 0) / shadeScores.length;
  const shadeLevel = Math.floor(averageShade / 10);

  if (shadeLevel < MINIMUM_SHADE_LEVEL) {
    feedback.push(`Shade Level™ too low (Level ${shadeLevel})`);
  }

  // Special achievements feedback
  score.specialConditions?.forEach(condition => {
    if (condition.unlocked) {
      feedback.push(`Achievement: ${condition.name} (×${condition.multiplier})`);
    }
  });

  const isPassing = failingMetrics === 0 && shadeLevel >= MINIMUM_SHADE_LEVEL;

  return {
    isPassing,
    feedback
  };
};

export const getScoreClassification = (score: number): string => {
  const score10Point = convertTo10PointScale(score);
  if (score10Point >= 9) return "Cosmic Level Shade";
  if (score10Point >= 8) return "Expert Passive Aggression";
  if (score10Point >= 7) return "Advanced Sass Master";
  if (score10Point >= 6) return "Promising Shade Apprentice";
  return "Needs More Side-Eye";
};