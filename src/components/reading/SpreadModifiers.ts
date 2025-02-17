import { SpreadType } from '../../types';

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