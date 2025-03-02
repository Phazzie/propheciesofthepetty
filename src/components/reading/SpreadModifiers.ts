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

// Added implementation of applySpreadModifiers
export function applySpreadModifiers(scores: any, spreadType: string) {
  const modified = { ...scores };
  // Apply thematic bonuses based on spread type
  if (spreadType === 'celtic-cross') {
    // For example, apply a 10% bonus on humor
    modified.humor = Math.min(Math.round(scores.humor * 1.1), 100);
    // Also bonus for shadeIndex if exists
    if (scores.shadeIndex) {
      const newShade = {};
      for (const key in scores.shadeIndex) {
        newShade[key] = Math.min(Math.round(scores.shadeIndex[key] * 1.1), 100);
      }
      modified.shadeIndex = newShade;
    }
  } else if (spreadType === 'classic') {
    // No bonus for classic; ensure scores remain the same
    modified.humor = scores.humor;
  } else {
    // Default: no modifications
  }
  return modified;
}