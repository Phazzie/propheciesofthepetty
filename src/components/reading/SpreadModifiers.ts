export const SPREAD_MODIFIERS: Record<SpreadType, SpreadModifiers> = {
  'past-present-future': {
    thematicBonus: 10,
    shadeMultipliers: {
      strategicVagueness: 1.2 // Extra points for vague future predictions
    },
    specialConditions: [{
      name: "Time Lord",
      description: "Successfully connected past mistakes to future consequences",
      multiplier: 1.3
    }]
  },
  'celtic-cross': {
    thematicBonus: 15,
    shadeMultipliers: {
      plausibleDeniability: 1.3,
      emotionalManipulation: 1.2
    },
    specialConditions: [{
      name: "Cross Examination",
      description: "Used every position to build a cohesive critique",
      multiplier: 1.4
    }]
  },
  'im-fine': {
    thematicBonus: 20,
    shadeMultipliers: {
      guiltTripIntensity: 1.5,
      backhandedCompliments: 1.3
    },
    specialConditions: [{
      name: "Fine & Dandy",
      description: "Maximum contrast between surface and real issues",
      multiplier: 1.5
    }]
  },
  'just-saying': {
    thematicBonus: 25,
    shadeMultipliers: {
      plausibleDeniability: 1.6,
      strategicVagueness: 1.4
    },
    specialConditions: [{
      name: "Just Being Honest",
      description: "Achieved peak passive-aggression while maintaining deniability",
      multiplier: 1.6
    }]
  },
  'whatever': {
    thematicBonus: 15,
    shadeMultipliers: {
      backhandedCompliments: 1.4,
      emotionalManipulation: 1.3
    },
    specialConditions: [{
      name: "Unbothered Queen",
      description: "Conveyed maximum judgment while appearing completely detached",
      multiplier: 1.4
    }]
  },
  'no-offense': {
    thematicBonus: 30,
    shadeMultipliers: {
      backhandedCompliments: 1.7,
      guiltTripIntensity: 1.5
    },
    specialConditions: [{
      name: "Sweet Poison",
      description: "Delivered devastating critique wrapped in pure sugar",
      multiplier: 1.7
    }]
  }
};