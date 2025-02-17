export interface SeasonalModifier {
  name: string;
  period: {
    start: { month: number; day: number };
    end: { month: number; day: number };
  };
  description: string;
  effects: {
    shadeBonus: number;
    primaryMetric: keyof typeof SHADE_METRICS;
    flavorText: string;
  };
}

// Define shade metrics with brilliant friend energy
const SHADE_METRICS = {
  plausibleDeniability: "Drawing parallels so elegant they take a week to land",
  guiltTripIntensity: "The kind of insight that hits you in the shower days later",
  emotionalManipulation: "Pattern recognition as performance art",
  backhandedCompliments: "Observations so clever they circle back to kindness",
  strategicVagueness: "The art of letting them connect their own dots"
} as const;

export const SEASONAL_MODIFIERS: SeasonalModifier[] = [
  {
    name: "Mercury Retrograde",
    period: {
      start: { month: 12, day: 13 },
      end: { month: 1, day: 1 }
    },
    description: "Peak metaphor season",
    effects: {
      shadeBonus: 25,
      primaryMetric: "plausibleDeniability",
      flavorText: "When miscommunication becomes an art form"
    }
  },
  {
    name: "Cancer Season",
    period: {
      start: { month: 6, day: 21 },
      end: { month: 7, day: 22 }
    },
    description: "Time for emotional brilliance",
    effects: {
      shadeBonus: 20,
      primaryMetric: "emotionalManipulation",
      flavorText: "When caring becomes cleverly crafted"
    }
  },
  {
    name: "Scorpio Season",
    period: {
      start: { month: 10, day: 23 },
      end: { month: 11, day: 21 }
    },
    description: "Sharp wit hours",
    effects: {
      shadeBonus: 30,
      primaryMetric: "backhandedCompliments",
      flavorText: "When truth becomes an elegant weapon"
    }
  },
  {
    name: "Leo Season",
    period: {
      start: { month: 7, day: 23 },
      end: { month: 8, day: 22 }
    },
    description: "Spotlight on genius",
    effects: {
      shadeBonus: 15,
      primaryMetric: "strategicVagueness",
      flavorText: "When drama becomes performance art"
    }
  },
  {
    name: "Full Moon",
    period: {
      start: { month: 0, day: 0 }, // Calculated dynamically
      end: { month: 0, day: 0 }
    },
    description: "Peak revelation hours",
    effects: {
      shadeBonus: 40,
      primaryMetric: "guiltTripIntensity",
      flavorText: "When insights become epiphanies"
    }
  }
];

export function getActiveSeasonalModifiers(date: Date = new Date()): SeasonalModifier[] {
  return SEASONAL_MODIFIERS.filter(modifier => {
    if (modifier.name === "Full Moon") {
      // Calculate full moon phase - simplified for example
      return false; // Replace with actual moon phase calculation
    }

    const start = new Date(date.getFullYear(), modifier.period.start.month - 1, modifier.period.start.day);
    const end = new Date(date.getFullYear(), modifier.period.end.month - 1, modifier.period.end.day);
    
    return date >= start && date <= end;
  });
}