import type { Reading, UserPatternTracking } from '../types';

interface PatternMetrics {
  repeatedCards: Map<string, number>;
  themeFrequency: Map<string, number>;
  reversalRate: number;
  spreadPreferences: Map<string, number>;
}

export function analyzeReadingPatterns(readings: Reading[]): UserPatternTracking {
  const metrics = calculatePatternMetrics(readings);
  
  return {
    repeatedThemes: identifyRecurringThemes(metrics.themeFrequency),
    sophisticationGrowth: calculateSophisticationGrowth(readings),
    consistencyScore: calculateConsistencyScore(metrics)
  };
}

function calculatePatternMetrics(readings: Reading[]): PatternMetrics {
  const repeatedCards = new Map<string, number>();
  const themeFrequency = new Map<string, number>();
  const spreadPreferences = new Map<string, number>();
  let totalReversals = 0;
  let totalCards = 0;

  readings.forEach(reading => {
    // Track spread types
    const spreadCount = spreadPreferences.get(reading.spreadType) || 0;
    spreadPreferences.set(reading.spreadType, spreadCount + 1);

    // Analyze cards and reversals
    reading.cards.forEach(card => {
      const cardCount = repeatedCards.get(card.id) || 0;
      repeatedCards.set(card.id, cardCount + 1);
      
      if (card.isReversed) totalReversals++;
      totalCards++;
    });
  });

  return {
    repeatedCards,
    themeFrequency,
    reversalRate: totalCards > 0 ? totalReversals / totalCards : 0,
    spreadPreferences
  };
}

function identifyRecurringThemes(themeFrequency: Map<string, number>): string[] {
  // Return themes that appear in more than 30% of readings
  const threshold = 0.3;
  return Array.from(themeFrequency.entries())
    .filter(([_, frequency]) => frequency >= threshold)
    .map(([theme]) => theme)
    .sort((a, b) => themeFrequency.get(b)! - themeFrequency.get(a)!);
}

function calculateSophisticationGrowth(readings: Reading[]): number {
  if (readings.length < 2) return 0;

  // Calculate average shade level increase over time
  const shadeLevels = readings
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map(reading => {
      const shadeScores = Object.values(reading.interpretation.scores.shadeIndex);
      return shadeScores.reduce((sum, score) => sum + score, 0) / shadeScores.length;
    });

  const growth = shadeLevels.reduce((acc, level, i) => {
    if (i === 0) return 0;
    const improvement = Math.max(0, level - shadeLevels[i - 1]);
    return acc + improvement;
  }, 0);

  return Math.min(100, (growth / (readings.length - 1)) * 10);
}

function calculateConsistencyScore(metrics: PatternMetrics): number {
  const spreadConsistency = calculateSpreadConsistency(metrics.spreadPreferences);
  const cardConsistency = calculateCardConsistency(metrics.repeatedCards);
  
  return Math.round((spreadConsistency + cardConsistency) / 2);
}

function calculateSpreadConsistency(spreadPreferences: Map<string, number>): number {
  const total = Array.from(spreadPreferences.values()).reduce((sum, count) => sum + count, 0);
  const variety = spreadPreferences.size;
  
  // Higher score for exploring different spreads while maintaining some favorites
  return Math.min(100, (variety * 20) + (total / variety * 10));
}

function calculateCardConsistency(repeatedCards: Map<string, number>): number {
  const frequencies = Array.from(repeatedCards.values());
  const variance = calculateVariance(frequencies);
  
  // Lower variance means more consistent card appearances
  return Math.min(100, 100 - (variance * 10));
}

function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
  return Math.sqrt(squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length);
}