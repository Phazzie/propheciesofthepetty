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

export type SpreadType = 'past-present-future' | 'celtic-cross' | 'three-card';

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
 * Reading interpretation information
 */
export interface ReadingInterpretation {
  /** The reading text */
  text: string;
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
  /** AI-generated interpretation */
  interpretation: ReadingInterpretation;
  /** Reading timestamp */
  createdAt: string;
  /** Type of spread used */
  spreadType: string;
}

export interface SpreadPosition {
  name: string;
  description: string;  // Our sassy position context
  id?: string;
  className?: string;
}

export interface CardInSpread extends Card {
  position: number;
  isReversed: boolean;
}