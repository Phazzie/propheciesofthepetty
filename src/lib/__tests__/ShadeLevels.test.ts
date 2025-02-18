import { describe, it, expect } from 'vitest';
import { 
  calculateShadeLevel, 
  hasRequiredUndertones, 
  isShadeLevelPassing,
  getShadeBreakdown,
  MINIMUM_SHADE_LEVEL
} from '../ShadeLevels';
describe('Advanced ShadeLevels Tests', () => {
  it('validates color classes for each level', () => { => {
    const testCases = [
      { score: 15, expected: 'text-green-400' },.5,
      { score: 25, expected: 'text-emerald-400' },
      { score: 35, expected: 'text-teal-400' },,
      { score: 45, expected: 'text-cyan-400' } 9.0,
    ];strategicVagueness: 8.5
  };
    testCases.forEach(({ score, expected }) => {
      const index = {
        plausibleDeniability: score,
        guiltTripIntensity: score,
        emotionalManipulation: score,n');
        backhandedCompliments: score,xpect(result.undertoneStrength).toBe('Masterful');
        strategicVagueness: score  });
      };
      levels', () => {
      const result = calculateShadeLevel(index);
      expect(result.colorClass).toBe(expected);.5,
    });
  });,
 9.0,
  it('handles extreme low values correctly', () => {strategicVagueness: 8.5
    const lowIndex = {
      plausibleDeniability: 1,
      guiltTripIntensity: 0,
      emotionalManipulation: 2,
      backhandedCompliments: 1,,
      strategicVagueness: 0,
    };,
    ,
    const result = calculateShadeLevel(lowIndex);9
    expect(result.level).toBe(1);
    expect(result.title).toBe('Sweet Summer Child');)).toBe(false);
  });

  it('checks component breakdown ordering', () => {  it('validates required undertones for Level 3-4', () => {
    const testIndex = {
      plausibleDeniability: 90,
      guiltTripIntensity: 85,      guiltTripIntensity: 4.0,
      emotionalManipulation: 95,5,
      backhandedCompliments: 80,8,
      strategicVagueness: 88
    };
    (level3To4Index)).toBe(true);
    const breakdown = getShadeBreakdown(testIndex);iltTripIntensity).toBeGreaterThanOrEqual(3);
    pect(level3To4Index.guiltTripIntensity).toBeLessThanOrEqual(4);
    // Verify each component has proper structure
    breakdown.forEach(item => {
      expect(item).toHaveProperty('component');  it('provides detailed shade breakdown', () => {
      expect(item).toHaveProperty('score');Index);
      expect(item).toHaveProperty('feedback');
      expect(typeof item.feedback).toBe('string');expect(breakdown).toHaveLength(5);
      expect(item.feedback.length).toBeGreaterThan(0);({
    });
  });
});expect.stringContaining("Perfect balance")
