import { describe, it, expect } from 'vitest';
import type { SpreadType, CoreMetrics, ShadeIndex } from '../../../types';
import { applySpreadModifiers } from '../SpreadModifiers';

describe('Spread Modifier System', () => {
  it('applies correct base multipliers for each spread type', () => {
    const testScores = {
      subtlety: 85,
      relatability: 85,
      wisdom: 85,
      creative: 85,
      humor: 85,
      shadeIndex: {
        plausibleDeniability: 85,
        guiltTripIntensity: 80,
        emotionalManipulation: 75,
        backhandedCompliments: 90,
        strategicVagueness: 85
      }
    };

    const spreads: SpreadType[] = ['celtic-cross', 'three-card', 'classic'];
    
    spreads.forEach(spreadType => {
      const modifiedScores = applySpreadModifiers(testScores, spreadType);
      expect(modifiedScores.humor).toBeGreaterThan(testScores.humor);
      expect(Object.values(modifiedScores.shadeIndex)).toEqual(
        expect.arrayContaining([expect.any(Number)])
      );
    });
  });

  it('handles thematic bonuses correctly', () => {
    const scores = {
      subtlety: 90,
      relatability: 90,
      wisdom: 90,
      creative: 90,
      humor: 90,
      shadeIndex: {
        plausibleDeniability: 90,
        guiltTripIntensity: 90,
        emotionalManipulation: 90,
        backhandedCompliments: 90,
        strategicVagueness: 90
      }
    };

    const modifiedScores = applySpreadModifiers(scores, 'celtic-cross');
    expect(modifiedScores.humor).toBeGreaterThan(scores.humor);
  });

  it('properly caps scores at maximum values', () => {
    const highScores = {
      subtlety: 95,
      relatability: 95,
      wisdom: 95,
      creative: 95,
      humor: 95,
      shadeIndex: {
        plausibleDeniability: 95,
        guiltTripIntensity: 95,
        emotionalManipulation: 95,
        backhandedCompliments: 95,
        strategicVagueness: 95
      }
    };

    const modifiedScores = applySpreadModifiers(highScores, 'celtic-cross');
    Object.values(modifiedScores).forEach(score => {
      if (typeof score === 'number') {
        expect(score).toBeLessThanOrEqual(100);
      }
    });
    Object.values(modifiedScores.shadeIndex).forEach(score => {
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  it('maintains minimum score thresholds', () => {
    const lowScores = {
      subtlety: 20,
      relatability: 20,
      wisdom: 20,
      creative: 20,
      humor: 20,
      shadeIndex: {
        plausibleDeniability: 20,
        guiltTripIntensity: 20,
        emotionalManipulation: 20,
        backhandedCompliments: 20,
        strategicVagueness: 20
      }
    };

    const modifiedScores = applySpreadModifiers(lowScores, 'classic');
    Object.values(modifiedScores).forEach(score => {
      if (typeof score === 'number') {
        expect(score).toBeGreaterThanOrEqual(0);
      }
    });
    Object.values(modifiedScores.shadeIndex).forEach(score => {
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });
});