import { SpreadType } from '../../../types';

// Test utilities for ReadingScores component
export const mockShadeIndexScores = {
  plausibleDeniability: 85,
  guiltTripIntensity: 80,
  emotionalManipulation: 75,
  backhandedCompliments: 90,
  strategicVagueness: 85
};

export const mockCoreMetrics = {
  subtlety: 90,
  relatability: 85,
  wisdom: 80,
  creative: 85,
  humor: 85
};

export type TestScoreOverrides = Partial<typeof mockCoreMetrics & {
  shadeIndex: Partial<typeof mockShadeIndexScores>
}>;

export const createTestScores = (overrides: TestScoreOverrides = {}) => ({
  ...mockCoreMetrics,
  snark: 75,
  culturalResonance: 70,
  metaphorMastery: 65,
  quotability: 75,
  shadeIndex: {
    ...mockShadeIndexScores,
    ...(overrides.shadeIndex || {})
  },
  ...overrides
});

export const createTestInterpretation = (scoreOverrides?: TestScoreOverrides) => ({
  scores: createTestScores(scoreOverrides),
  stages: {
    denial: "Is this reading serious right now?",
    anger: "The cards are clearly having a moment",
    bargaining: "Maybe there's another interpretation...",
    depression: "When the tea is too hot to sip",
    acceptance: "...and I took that personally"
  }
});

export const spreadTypes: SpreadType[] = ['classic', 'celtic-cross', 'three-card'];