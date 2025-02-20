import { describe, it, expect } from 'vitest';
import type { ShadeIndex } from '../../types';
import { 
  calculateShadeLevel, 
  hasRequiredUndertones, 
  isShadeLevelPassing,
  getShadeBreakdown,
  MINIMUM_SHADE_LEVEL
} from '../ShadeLevels';

describe('ShadeLevels', () => {
  describe('calculateShadeLevel', () => {
    it('validates color classes for each level', () => {
      const testCases = [
        { level: 1, expected: 'text-green-400' },
        { level: 3, expected: 'text-teal-400' },
        { level: 5, expected: 'text-blue-400' },
        { level: 7, expected: 'text-violet-400' },
        { level: 9, expected: 'text-pink-400' }
      ];

      testCases.forEach(({ level, expected }) => {
        const index = {
          plausibleDeniability: level * 10,
          guiltTripIntensity: level * 10,
          emotionalManipulation: level * 10,
          backhandedCompliments: level * 10,
          strategicVagueness: level * 10
        };
        const result = calculateShadeLevel(index);
        expect(result.colorClass).toBe(expected);
      });
    });

    it('handles extreme low values correctly', () => {
      const lowIndex = {
        plausibleDeniability: 1,
        guiltTripIntensity: 0,
        emotionalManipulation: 2,
        backhandedCompliments: 1,
        strategicVagueness: 0
      };
      
      const result = calculateShadeLevel(lowIndex);
      expect(result.level).toBe(1);
      expect(result.title).toBe('Sweet Summer Child');
    });

    it('validates Level 3-4 requirements', () => {
      const level3To4Index = {
        plausibleDeniability: 35,
        guiltTripIntensity: 40,
        emotionalManipulation: 35,
        backhandedCompliments: 38,
        strategicVagueness: 32
      };

      expect(hasRequiredUndertones(level3To4Index)).toBe(true);
      const result = calculateShadeLevel(level3To4Index);
      expect(result.level).toBeGreaterThanOrEqual(3);
      expect(result.level).toBeLessThanOrEqual(4);
    });

    it('provides detailed shade breakdown', () => {
      const testIndex = {
        plausibleDeniability: 90,
        guiltTripIntensity: 85,
        emotionalManipulation: 95,
        backhandedCompliments: 80,
        strategicVagueness: 88
      };

      const breakdown = getShadeBreakdown(testIndex);
      expect(breakdown).toHaveLength(5);
      
      breakdown.forEach(item => {
        expect(item).toHaveProperty('component');
        expect(item).toHaveProperty('score');
        expect(item).toHaveProperty('feedback');
        expect(typeof item.feedback).toBe('string');
        expect(item.feedback.length).toBeGreaterThan(0);
      });
    });
  });

  describe('isShadeLevelPassing', () => {
    it('validates minimum shade level requirement', () => {
      const passingIndex = {
        plausibleDeniability: 70,
        guiltTripIntensity: 72,
        emotionalManipulation: 68,
        backhandedCompliments: 75,
        strategicVagueness: 70
      };

      const failingIndex = {
        plausibleDeniability: 60,
        guiltTripIntensity: 62,
        emotionalManipulation: 58,
        backhandedCompliments: 65,
        strategicVagueness: 55
      };

      expect(isShadeLevelPassing(passingIndex)).toBe(true);
      expect(isShadeLevelPassing(failingIndex)).toBe(false);
    });
  });
});

describe('Advanced ShadeLevels Tests', () => {
  it('validates color classes for each level', () => {
    const testCases = [
      { score: 15, expected: 'text-green-400' },
      { score: 25, expected: 'text-emerald-400' },
      { score: 35, expected: 'text-teal-400' },
      { score: 45, expected: 'text-cyan-400' }
    ];

    testCases.forEach(({ score, expected }) => {
      const index = {
        plausibleDeniability: score,
        guiltTripIntensity: score,
        emotionalManipulation: score,
        backhandedCompliments: score,
        strategicVagueness: score
      };
      const result = calculateShadeLevel(index);
      expect(result.colorClass).toBe(expected);
    });
  });

  it('handles extreme low values correctly', () => {
    const lowIndex = {
      plausibleDeniability: 1,
      guiltTripIntensity: 0,
      emotionalManipulation: 2,
      backhandedCompliments: 1,
      strategicVagueness: 0
    };
    
    const result = calculateShadeLevel(lowIndex);
    expect(result.level).toBe(1);
    expect(result.title).toBe('Sweet Summer Child');
  });

  it('validates required undertones for Level 3-4', () => {
    const level3Index = {
      plausibleDeniability: 35,
      guiltTripIntensity: 40,
      emotionalManipulation: 35,
      backhandedCompliments: 38,
      strategicVagueness: 32
    };
    
    expect(hasRequiredUndertones(level3Index)).toBe(true);
    expect(calculateShadeLevel(level3Index).title).toBe('The Pointed Pause');
  });

  it('checks passing criteria for minimum shade level', () => {
    const barelyPassingIndex = {
      plausibleDeniability: 70,
      guiltTripIntensity: 72,
      emotionalManipulation: 68,
      backhandedCompliments: 75,
      strategicVagueness: 65
    };
    
    expect(isShadeLevelPassing(barelyPassingIndex)).toBe(true);
    expect(calculateShadeLevel(barelyPassingIndex).level).toBeGreaterThanOrEqual(MINIMUM_SHADE_LEVEL);
  });

  it('provides detailed component breakdowns', () => {
    const testIndex = {
      plausibleDeniability: 90,
      guiltTripIntensity: 85,
      emotionalManipulation: 95,
      backhandedCompliments: 80,
      strategicVagueness: 88
    };
    
    const breakdown = getShadeBreakdown(testIndex);
    expect(breakdown).toHaveLength(5);
    breakdown.forEach(item => {
      expect(item).toHaveProperty('component');
      expect(item).toHaveProperty('score');
      expect(item).toHaveProperty('feedback');
      expect(typeof item.feedback).toBe('string');
      expect(item.feedback.length).toBeGreaterThan(0);
    });
  });
});