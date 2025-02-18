import { describe, it, expect } from 'vitest';
import { ReadingScore, SpreadModifiers } from '../../types';
import { 
  calculateReadingScore, 
  evaluateReadingQuality, 
  getScoreClassification,
  MINIMUM_SCORE,
  MINIMUM_SHADE_LEVEL
} from '../ScoringSystem';

describe('ScoringSystem', () => {
  const mockShadeIndex = {
    plausibleDeniability: 8.5,
    guiltTripIntensity: 7.5,
    emotionalManipulation: 8.0,
    backhandedCompliments: 9.0,
    strategicVagueness: 8.5
  };

  const mockBaseScores: Partial<ReadingScore> = {
    subtlety: 8.5,
    relatability: 9.0,
    wisdom: 8.5,
    creative: 8.8,
    humor: 9.2,
    snark: 8.5,
    culturalResonance: 7.5,
    metaphorMastery: 8.0,
    shadeIndex: mockShadeIndex
  };

  const mockSpreadModifiers: SpreadModifiers = {
    baseMultiplier: 1.2,
    categoryMultipliers: {
      humor: 1.4,
      snark: 1.0,
      culturalResonance: 0.6,
      metaphorMastery: 0.6
    },
    specialConditionThresholds: {
      'brilliantInsight': 8,
      'cosmicShade': 9
    },
    thematicBonus: 2
  };

  it('calculates reading scores with modifiers correctly', () => {
    const result = calculateReadingScore(
      mockBaseScores as ReadingScore,
      mockSpreadModifiers,
      ['humor', 'culturalResonance']
    );

    expect(result.score).toBeGreaterThan(0);
    expect(result.breakdown).toHaveLength(7); // 5 core metrics + 2 category bonuses
    expect(Object.keys(result.bonuses)).toHaveLength(2);
  });

  it('evaluates reading quality correctly', () => {
    const passingScore: ReadingScore = {
      ...mockBaseScores as ReadingScore,
      subtlety: 8.5,    // Above minimum 8/10
      wisdom: 8.0,      // Meets minimum 8/10
      shadeIndex: {     // Level 7+ required
        ...mockShadeIndex,
        plausibleDeniability: 7.5,
        guiltTripIntensity: 7.0
      }
    };

    const failingScore: ReadingScore = {
      ...passingScore,
      subtlety: 7.5,  // Below required 8/10
      wisdom: 7.8,    // Below required 8/10
      shadeIndex: {   // Below Level 7
        ...mockShadeIndex,
        plausibleDeniability: 6.5,
        guiltTripIntensity: 6.0
      }
    };

    const passingEvaluation = evaluateReadingQuality(passingScore);
    expect(passingEvaluation.isPassing).toBe(true);
    expect(passingEvaluation.feedback).toContain('Achievement');

    const failingEvaluation = evaluateReadingQuality(failingScore);
    expect(failingEvaluation.isPassing).toBe(false);
    expect(failingEvaluation.feedback).toContain('needs improvement');
  });

  it('validates minimum core metric requirements', () => {
    const scores: Partial<ReadingScore> = {
      subtlety: MINIMUM_SCORE,
      relatability: MINIMUM_SCORE,
      wisdom: MINIMUM_SCORE,
      creative: MINIMUM_SCORE,
      humor: MINIMUM_SCORE,
      shadeIndex: {
        plausibleDeniability: MINIMUM_SHADE_LEVEL,
        guiltTripIntensity: MINIMUM_SHADE_LEVEL,
        emotionalManipulation: MINIMUM_SHADE_LEVEL,
        backhandedCompliments: MINIMUM_SHADE_LEVEL,
        strategicVagueness: MINIMUM_SHADE_LEVEL
      }
    };

    // Test each core metric
    Object.keys(scores).forEach(metric => {
      if (metric === 'shadeIndex') return;
      const testScores = { 
        ...scores, 
        [metric]: MINIMUM_SCORE - 0.1 // Just below passing threshold
      };
      const result = evaluateReadingQuality(testScores as ReadingScore);
      expect(result.isPassing).toBe(false);
      expect(result.feedback).toContain(`${metric} needs improvement`);
    });
  });

  it('classifies scores appropriately', () => {
    expect(getScoreClassification(9.5)).toBe("Cosmic Level Shade");
    expect(getScoreClassification(8.5)).toBe("Expert Passive Aggression");
    expect(getScoreClassification(7.5)).toBe("Advanced Sass Master");
    expect(getScoreClassification(6.5)).toBe("Promising Shade Apprentice");
    expect(getScoreClassification(5.5)).toBe("Needs More Side-Eye");
  });

  it('validates special condition thresholds', () => {
    const brilliantScore: ReadingScore = {
      ...mockBaseScores as ReadingScore,
      subtlety: 9.0,
      relatability: 9.5,
      wisdom: 8.8,
      creative: 9.2,
      humor: 9.5,
      shadeIndex: {
        plausibleDeniability: 9.0,
        guiltTripIntensity: 8.5,
        emotionalManipulation: 9.0,
        backhandedCompliments: 9.5,
        strategicVagueness: 9.0
      }
    };

    const result = calculateReadingScore(
      brilliantScore,
      {
        ...mockSpreadModifiers,
        specialConditionThresholds: {
          'brilliantInsight': 8.5,  // Should trigger
          'cosmicShade': 9.5       // Should not trigger
        }
      },
      ['humor', 'snark']
    );

    expect(result.bonuses['brilliantInsight']).toBeDefined();
    expect(result.bonuses['cosmicShade']).toBeUndefined();
  });
});