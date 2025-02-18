import { describe, it, expect, vi } from 'vitest';
import { getActiveSeasonalModifiers, calculateSeasonalBonus } from '../SeasonalModifiers';

describe('SeasonalModifiers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('identifies active seasonal events', () => {
    // Test Mercury Retrograde period
    vi.setSystemTime(new Date('2024-01-10'));
    let activeEvents = getActiveSeasonalModifiers();
    expect(activeEvents).toHaveLength(2); // Mercury Retrograde and Awards Season
    expect(activeEvents[0].name).toBe('Mercury Retrograde');

    // Test normal period
    vi.setSystemTime(new Date('2024-02-15'));
    activeEvents = getActiveSeasonalModifiers();
    expect(activeEvents).toHaveLength(1); // Just Awards Season
  });

  it('calculates seasonal bonuses correctly', () => {
    vi.setSystemTime(new Date('2024-01-10')); // During Mercury Retrograde

    const result = calculateSeasonalBonus(100, ['snark', 'culturalResonance']);
    
    expect(result.modifiedScore).toBe(130); // 100 * 1.3
    expect(result.bonusPoints).toBe(30);
    expect(result.activeEvents).toHaveLength(2);
  });

  it('handles year-wrapping events', () => {
    // Test end of year
    vi.setSystemTime(new Date('2024-12-30'));
    let activeEvents = getActiveSeasonalModifiers();
    expect(activeEvents.some(e => e.name === 'Mercury Retrograde')).toBe(true);
    expect(activeEvents.some(e => e.name === 'Holiday Season')).toBe(true);

    // Test start of year
    vi.setSystemTime(new Date('2024-01-02'));
    activeEvents = getActiveSeasonalModifiers();
    expect(activeEvents.some(e => e.name === 'Mercury Retrograde')).toBe(true);
  });

  it('stacks compatible category bonuses', () => {
    vi.setSystemTime(new Date('2024-12-25')); // Holiday Season
    
    const result = calculateSeasonalBonus(100, ['culturalResonance', 'metaphorMastery']);
    
    expect(result.modifiedScore).toBe(140); // Using highest multiplier (1.4)
    expect(result.bonusPoints).toBe(40);
  });

  it('returns base score when no active events match categories', () => {
    vi.setSystemTime(new Date('2024-05-01')); // No active events
    
    const result = calculateSeasonalBonus(100, ['humor']);
    
    expect(result.modifiedScore).toBe(100);
    expect(result.bonusPoints).toBe(0);
    expect(result.activeEvents).toHaveLength(0);
  });
});