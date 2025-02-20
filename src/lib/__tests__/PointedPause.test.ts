import { describe, it, expect } from 'vitest';
import { calculateShadeLevel, hasRequiredUndertones } from '../ShadeLevels';
import type { ShadeIndex } from '../../types';

describe('Pointed Pause (Level 3-4) Tests', () => {
  const createShadeIndex = (overrides: Partial<ShadeIndex> = {}): ShadeIndex => ({
    plausibleDeniability: 35,
    guiltTripIntensity: 40,
    emotionalManipulation: 35,
    backhandedCompliments: 35,
    strategicVagueness: 35,
    ...overrides
  });

  it('identifies base Level 3 criteria', () => {
    const level3Index = createShadeIndex({
      guiltTripIntensity: 45,
      emotionalManipulation: 40
    });

    const result = calculateShadeLevel(level3Index);
    expect(result.level).toBe(3);
    expect(result.title).toBe('The Pointed Pause');
    expect(hasRequiredUndertones(level3Index)).toBe(true);
  });

  it('boosts to Level 4 with high guilt trip intensity', () => {
    const level4Index = createShadeIndex({
      guiltTripIntensity: 65, // Above threshold for Level 4 boost
      emotionalManipulation: 40
    });

    const result = calculateShadeLevel(level4Index);
    expect(result.level).toBe(4);
    expect(result.title).toBe('The Raised Eyebrow');
  });

  it('requires minimum guilt trip intensity for Level 3', () => {
    const belowLevel3Index = createShadeIndex({
      guiltTripIntensity: 25, // Too low for Level 3
      emotionalManipulation: 40
    });

    const result = calculateShadeLevel(belowLevel3Index);
    expect(result.level).toBe(2);
    expect(hasRequiredUndertones(belowLevel3Index)).toBe(false);
  });

  it('applies weighted scoring for Level 3-4 range', () => {
    const weightedIndex = createShadeIndex({
      guiltTripIntensity: 55,
      emotionalManipulation: 45,
      backhandedCompliments: 40
    });

    const result = calculateShadeLevel(weightedIndex);
    expect(result.level).toBe(3);
    expect(result.undertoneStrength).toBe('Clear');
  });
});