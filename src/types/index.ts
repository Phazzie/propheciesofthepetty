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

export type SpreadType = 'classic' | 'celtic-cross' | 'three-card';

export type ThematicCategory = 'humor' | 'snark' | 'culturalResonance' | 'metaphorMastery';

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
  /** Core metrics - All use 0-100 base scale */
  subtlety: number;
  relatability: number;
  wisdom: number;
  creative: number;
  humor: number;

  /** Additional metrics with weights */
  snark: number;         // Base 0-100 with 1.0x multiplier
  culturalResonance: number;  // Base 0-100 with 0.6x multiplier
  metaphorMastery: number;    // Base 0-100 with 0.6x multiplier

  /** Shade Scale™ components - All 0-100 */
  shadeIndex: {
    /** Level 1-2: Barely noticeable criticism */
    plausibleDeniability: number;
    /** Level 3-4: Clear undertones of judgment */
    guiltTripIntensity: number;
    /** Level 5-6: Expert use of passive aggression */
    emotionalManipulation: number;
    /** Level 7-8: Devastating criticism wrapped in sweetness */
    backhandedCompliments: number;
    /** Level 9-10: So subtle it takes days to process */
    strategicVagueness: number;
  };

  /** Special condition achievements */
  specialConditions?: Array<{
    id: string;
    name: string;
    description: string;
    multiplier: number;
    unlocked: boolean;
  }>;

  /** Spread-specific modifiers */
  spreadModifiers?: SpreadModifiers;
}

/**
 * Spread-specific scoring modifiers
 */
export interface SpreadModifiers {
  /** Base multiplier for all scores */
  baseMultiplier: number;
  /** Category-specific multipliers */
  categoryMultipliers: {
    [key: string]: number;
  };
  /** Special condition trigger modifiers */
  specialConditionThresholds: {
    [key: string]: number;
  };
  /** Bonus points for thematic consistency */
  thematicBonus: number;
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

export interface SpreadPosition {
  name: string;
  description: string;  // Our sassy position context
  id?: string;
  className?: string;
}

export interface CardInSpread extends Card {
  position: SpreadPosition;
  isReversed: boolean;
}

export interface ReadingGeneration {
  spreadType: string;
  cards: CardInSpread[];
}