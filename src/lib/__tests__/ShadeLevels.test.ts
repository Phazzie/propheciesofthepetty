import { describe, it, expect } from 'vitest';
import { 
  calculateShadeLevel, 
  hasRequiredUndertones, 
  isShadeLevelPassing,
  getShadeBreakdown,
  MINIMUM_SHADE_LEVEL
} from '../ShadeLevels';

describe('ShadeLevels', () => {
  const mockShadeIndex = {
    plausibleDeniability: 8.5,
    guiltTripIntensity: 7.5,
    emotionalManipulation: 6.5,
    backhandedCompliments: 9.0,
    strategicVagueness: 8.5
  };

  it('calculates correct shade level', () => {
    const result = calculateShadeLevel(mockShadeIndex);
    expect(result.level).toBe(8);
    expect(result.title).toBe('Expert Passive Aggression');
    expect(result.undertoneStrength).toBe('Masterful');
  });

  it('identifies passing shade levels', () => {
    const passingShadeIndex = {
      plausibleDeniability: 8.5,
      guiltTripIntensity: 7.5,
      emotionalManipulation: 8.0,
      backhandedCompliments: 9.0,
      strategicVagueness: 8.5
    };
    expect(isShadeLevelPassing(passingShadeIndex)).toBe(true);

    const barelyFailingIndex = {
      plausibleDeniability: 6.5,
      guiltTripIntensity: 7.0,
      emotionalManipulation: 6.8,
      backhandedCompliments: 7.2,
      strategicVagueness: 6.9
    };
    expect(isShadeLevelPassing(barelyFailingIndex)).toBe(false);
  });

  it('validates required undertones for Level 3-4', () => {
    const level3To4Index = {
      plausibleDeniability: 3.5,
      guiltTripIntensity: 4.0,
      emotionalManipulation: 3.5,
      backhandedCompliments: 3.8,
      strategicVagueness: 3.2
    };
    expect(hasRequiredUndertones(level3To4Index)).toBe(true);
    expect(level3To4Index.guiltTripIntensity).toBeGreaterThanOrEqual(3);
    expect(level3To4Index.guiltTripIntensity).toBeLessThanOrEqual(4);
  });

  it('provides detailed shade breakdown', () => {
    const breakdown = getShadeBreakdown(mockShadeIndex);
    
    expect(breakdown).toHaveLength(5);
    expect(breakdown[0]).toMatchObject({
      component: 'plausibleDeniability',
      score: 8.5,
      feedback: expect.stringContaining("Perfect balance")
    });
  });

  describe('Shade Level Requirements', () => {
    it('enforces minimum level 7 requirement', () => {
      const level6Index = {
        plausibleDeniability: 6.0,
        guiltTripIntensity: 6.2,
        emotionalManipulation: 5.8,
        backhandedCompliments: 6.5,
        strategicVagueness: 5.5
      };
      expect(isShadeLevelPassing(level6Index)).toBe(false);
      
      const level7Index = {
        plausibleDeniability: 7.0,
        guiltTripIntensity: 7.2,
        emotionalManipulation: 6.8,
        backhandedCompliments: 7.5,
        strategicVagueness: 6.5
      };
      expect(isShadeLevelPassing(level7Index)).toBe(true);
      expect(calculateShadeLevel(level7Index).level).toBeGreaterThanOrEqual(MINIMUM_SHADE_LEVEL);
    });

    it('validates Level 3-4 criteria (Pointed Pause)', () => {
      const pointedPauseIndex = {
        plausibleDeniability: 3.5,
        guiltTripIntensity: 4.0,
        emotionalManipulation: 3.5,
        backhandedCompliments: 3.8,
        strategicVagueness: 3.2
      };
      
      const result = calculateShadeLevel(pointedPauseIndex);
      expect(result.level).toBeGreaterThanOrEqual(3);
      expect(result.level).toBeLessThanOrEqual(4);
      expect(result.description).toContain('Clear undertones of judgment');
      expect(result.description).toContain('Pointed Pause');
    });

    it('provides level-appropriate feedback', () => {
      const levels = [
        { score: 2.5, expected: 'Novice' },
        { score: 3.5, expected: 'Pointed Pause' },
        { score: 5.5, expected: 'Advanced' },
        { score: 7.5, expected: 'Expert' },
        { score: 9.5, expected: 'Cosmic' }
      ];

      levels.forEach(({ score, expected }) => {
        const index = {
          plausibleDeniability: score,
          guiltTripIntensity: score,
          emotionalManipulation: score,
          backhandedCompliments: score,
          strategicVagueness: score
        };
        
        const result = calculateShadeLevel(index);
        expect(result.title).toContain(expected);
      });
    });
  });
});