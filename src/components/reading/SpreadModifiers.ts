import { SpreadType } from '../../types';
import type { ShadeLevel } from '../../types';

type CategoryMultipliers = {
  humor: number;
  snark: number;
  culturalResonance: number;
  metaphorMastery: number;
};

interface SpreadModifier {
  baseMultiplier: number;
  categoryMultipliers: CategoryMultipliers;
  thematicBonus?: number;
}

// All spreads use standardized 0-100 base scale
export const SPREAD_MODIFIERS: Record<SpreadType, SpreadModifier> = {
  classic: {
    baseMultiplier: 1.0,
    categoryMultipliers: {
      humor: 1.4,      // Max 140
      snark: 1.0,      // Max 100
      culturalResonance: 0.6,   // Max 60
      metaphorMastery: 0.6      // Max 60
    }
  },
  celtic: {
    baseMultiplier: 1.2,
    categoryMultipliers: {
      humor: 1.4,
      snark: 1.0,
      culturalResonance: 0.6,
      metaphorMastery: 0.6
    },
    thematicBonus: 10  // Celtic spread gets thematic bonus
  },
  relationship: {
    baseMultiplier: 1.1,
    categoryMultipliers: {
      humor: 1.4,
      snark: 1.0,
      culturalResonance: 0.6,
      metaphorMastery: 0.6
    }
  }
};

export const SHADE_LEVELS: Record<number, ShadeLevel> = {
  1: { description: 'Barely Noticeable', criteria: ['Mild skepticism', 'Gentle questioning'] },
  2: { description: 'Subtle Side-Eye', criteria: ['Raised eyebrow', 'Brief meaningful silence'] },
  3: { 
    description: 'Pointed Pause', 
    criteria: [
      'Clear undertones of judgment',
      'Deliberate dramatic pauses',
      'Meaningful glances'
    ],
    multiplier: 1.3
  },
  4: {
    description: 'Clear Judgment',
    criteria: [
      'Clear undertones of judgment',
      'Extended dramatic silence',
      'Unmistakable disapproval'
    ],
    multiplier: 1.4
  },
  5: { description: 'Advanced Snark', criteria: ['Witty comebacks', 'Subtle mockery'] },
  6: { description: 'Expert Shade', criteria: ['Layered meanings', 'Strategic timing'] },
  7: { description: 'Master of Sass', criteria: ['Complex shade combinations', 'Perfect delivery'] },
  8: { description: 'Legendary Eye-Roll', criteria: ['Devastating timing', 'Memorable impact'] },
  9: { description: 'Supreme Shade', criteria: ['Historical references', 'Cultural impacts'] },
  10: { description: 'Cosmic Shade', criteria: ['Transcendent sass', 'Reality-altering shade'] }
};

export const evaluateShadeLevel = (metrics: Record<string, number>): number => {
  const {
    timing = 0,
    delivery = 0,
    subtlety = 0,
    impact = 0
  } = metrics;

  // Convert to 10-point scale
  const normalizedScore = (timing + delivery + subtlety + impact) / 40;
  return Math.min(Math.max(Math.round(normalizedScore * 10), 1), 10);
};