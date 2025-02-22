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

export type SpreadType = 
  | 'past-present-future'
  | 'celtic-cross' 
  | 'im-fine' 
  | 'just-saying'
  | 'whatever'
  | 'no-offense'
  | `custom-${number}`;

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
  /** Card image URL */
  imageUrl: string;
  /** Card type (major/minor arcana) */
  type: 'major' | 'minor';
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

// Base interfaces for scoring system
export interface CoreMetrics {
  subtlety: number;      // 0-100, passing ≥ 80
  relatability: number;  // 0-100, passing ≥ 80
  wisdom: number;        // 0-100, passing ≥ 80
  creative: number;      // 0-100, passing ≥ 80
  humor: number;         // 0-100, passing ≥ 80
}

export interface ExtendedMetrics {
  snark: number;             // 0-100
  culturalResonance: number; // 0-100
  metaphorMastery: number;   // 0-100
}

export interface ShadeIndex {
  plausibleDeniability: number;    // 0-100
  guiltTripIntensity: number;      // 0-100
  emotionalManipulation: number;   // 0-100
  backhandedCompliments: number;   // 0-100
  strategicVagueness: number;      // 0-100
}

export interface ShadeLevel {
  description: string;
  criteria: string[];
  multiplier?: number;
}

export interface ReadingScores extends CoreMetrics, ExtendedMetrics {
  shadeIndex: ShadeIndex;
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
    sophisticationGrowth: number; // 0-100
    consistencyScore: number;     // 0-100
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

export type SpreadPosition = {
  name: string;
  description: string;
};

export interface SpreadConfig {
  id: SpreadType;
  name: string;
  description: string;
  cardCount: number;
  icon: 'threeCard' | 'celticCross' | 'starSpread' | 'imFine' | 'justSaying' | 'whatever' | 'noOffense';
  positions: SpreadPosition[];
  isCustom?: boolean;
}

export interface SpreadModifier {
  baseMultiplier: number;
  categoryMultipliers: {
    humor: number;
    snark: number;
    culturalResonance: number;
    metaphorMastery: number;
  };
  thematicBonus?: number;
}

export interface CardInSpread extends Card {
  position: number;
  isReversed: boolean;
}

export type ReadingConfiguration = {
  spreadType: SpreadType;
  cards: CardInSpread[];
  userId: string;
  question?: string;
};