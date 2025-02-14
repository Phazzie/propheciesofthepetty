/**
 * Core type definitions for the Passive-Aggressive Tarot application
 * @module types
 * 
 * @description
 * Contains TypeScript interfaces and types for:
 * - User management
 * - Tarot cards
 * - Readings
 * - Subscription handling
 */

export type SubscriptionType = 'free' | 'major_arcana' | 'full_deck';

/**
 * User profile information
 */
export interface User {
  /** Unique identifier */
  id: string;
  /** User's email address */
  email: string;
  /** Current subscription level */
  subscriptionType: SubscriptionType;
}

/**
 * Tarot card information
 */
export interface Card {
  /** Unique identifier */
  id: string;
  /** Card name */
  name: string;
  /** Upright meaning */
  description: string;
  /** Reversed meaning */
  reversedDescription?: string;
  /** Card image URL */
  imageUrl: string;
  /** Card type (major/minor arcana) */
  type: 'major' | 'minor';
  /** Associated mythological creature */
  monsterPair?: {
    /** Monster name */
    name: string;
    /** Monster description */
    description: string;
  };
}

/**
 * Reading score information
 * A passing grade requires:
 * - Minimum 8/10 in all Core Metrics
 * - Minimum Shade Scale™ rating of 7
 */
export interface ReadingScore {
  /** Subtlety: How artfully the hostility is veiled (1-10) */
  subtlety: number;
  /** Relatability: How effectively it targets common insecurities (1-10) */
  relatability: number;
  /** Wisdom: Quality of actual divinatory insight (1-10) */
  wisdom: number;
  /** Creative Writing: Memorability and eloquence of phrasing (1-10) */
  creative: number;
  /** Humor: Ability to provoke uncomfortable laughter (1-10) */
  humor: number;
  /** The Shade Scale™: A proprietary metric for shade-throwing effectiveness */
  shadeIndex: {
    /** Level 1-2: Barely noticeable criticism (0-100) */
    plausibleDeniability: number;
    /** Level 3-4: Clear undertones of judgment (0-100) */
    guiltTripIntensity: number;
    /** Level 5-6: Expert use of passive aggression (0-100) */
    emotionalManipulation: number;
    /** Level 7-8: Devastating criticism wrapped in sweetness (0-100) */
    backhandedCompliments: number;
    /** Level 9-10: So subtle it takes days to process (0-100) */
    strategicVagueness: number;
  };
  /** Modifiers based on spread type */
  spreadModifiers?: SpreadModifiers;
}

/**
 * Spread-specific scoring modifiers
 */
export interface SpreadModifiers {
  /** Bonus points for thematic consistency */
  thematicBonus: number;
  /** Multiplier for specific shade categories */
  shadeMultipliers: {
    [K in keyof ShadeIndex]?: number;
  };
  /** Special conditions that unlock bonus sass */
  specialConditions: {
    name: string;
    description: string;
    multiplier: number;
  }[];
}

/**
 * Tracks user's question patterns and sass response levels
 */
export interface UserPatternTracking {
  repeatedThemes: string[];
  sophisticationGrowth: number;
  consistencyScore: number;
}

/**
 * Processing stages for readings
 */
export interface ReadingStages {
  denial: string;
  anger: string;
  bargaining: string;
  depression: string;
  acceptance: string;
}

/**
 * Reading interpretation information
 */
export interface ReadingInterpretation {
  text: string;
  scores: ReadingScore;
}

/**
 * Enhanced reading interpretation with sass
 */
export interface EnhancedReadingInterpretation extends ReadingInterpretation {
  /** Tracks increasing levels of cosmic judgment */
  patternTracking: UserPatternTracking;
  /** Messages for each stage of processing */
  stages: ReadingStages;
  /** Custom sass responses based on pattern analysis */
  customSassResponses: string[];
}

/**
 * Complete tarot reading
 */
export interface Reading {
  /** Unique identifier */
  id: string;
  /** User who received the reading */
  userId: string;
  /** Cards drawn with positions */
  cards: (Card & { position: number; isReversed: boolean })[];
  /** AI-generated interpretation with scores */
  interpretation: ReadingInterpretation;
  /** Reading timestamp */
  createdAt: string;
  /** Type of spread used */
  spreadType: string;
}

export interface ReadingScores {
  humor: number;         // 0-140 points
  snark: number;        // 0-100 points
  culturalResonance: number; // 0-60 points
  metaphorMastery: number;   // 0-60 points
  subtlety: number;     // 0-80 points
  relatability: number; // 0-80 points
  wisdom: number;       // 0-80 points
  creative: number;     // 0-120 points
  quotability: number;  // 0-60 points
  shadeIndex: {
    plausibleDeniability: number;    // 0-100
    guiltTripIntensity: number;     // 0-100
    emotionalManipulation: number;   // 0-100
    backhandedCompliments: number;   // 0-100
    strategicVagueness: number;      // 0-100
  };
}

export interface ShadeIndex {
  plausibleDeniability: number;    // 0-100
  guiltTripIntensity: number;     // 0-100
  emotionalManipulation: number;   // 0-100
  backhandedCompliments: number;   // 0-100
  strategicVagueness: number;      // 0-100
}

export interface ScoringBreakdown {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
  subMetrics?: {
    name: string;
    score: number;
    maxScore: number;
  }[];
}

export interface EnhancedReadingInterpretation {
  scores: ReadingScores;
  patternTracking: {
    repeatedThemes: string[];
    sophisticationGrowth: number;
    consistencyScore: number;
  };
  stages: {
    denial: string;
    anger: string;
    bargaining: string;
    depression: string;
    acceptance: string;
  };
  breakdown: ScoringBreakdown[];
}