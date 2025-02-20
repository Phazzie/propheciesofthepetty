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

// All metrics use standardized 0-100 base scale
export const SPREAD_MODIFIERS: Record<SpreadType, SpreadModifier> = {
  classic: {
    baseMultiplier: 1.0,
    categoryMultipliers: {
      humor: 1.0,
      snark: 1.0,
      culturalResonance: 1.0,
      metaphorMastery: 1.0
    }
  },
  'celtic-cross': {
    baseMultiplier: 1.2,
    categoryMultipliers: {
      humor: 1.2,
      snark: 1.1,
      culturalResonance: 1.0,
      metaphorMastery: 1.0
    },
    thematicBonus: 10
  },
  'three-card': {
    baseMultiplier: 1.1,
    categoryMultipliers: {
      humor: 1.3,
      snark: 1.2,
      culturalResonance: 1.0,
      metaphorMastery: 1.0
    }
  }
};