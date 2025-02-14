export interface SeasonalModifier {
  name: string;
  period: {
    start: { month: number; day: number };
    end: { month: number; day: number };
  };
  description: string;
  effects: {
    shadeBonus: number;
    primaryMetric: keyof ShadeIndex;
    flavorText: string;
  };
}

export const SEASONAL_MODIFIERS: SeasonalModifier[] = [
  {
    name: "Mercury Retrograde",
    period: {
      start: { month: 12, day: 13 },
      end: { month: 1, day: 1 }
    },
    description: "Peak communication chaos",
    effects: {
      shadeBonus: 25,
      primaryMetric: "plausibleDeniability",
      flavorText: "Blame it on Mercury, sweetie"
    }
  },
  {
    name: "Cancer Season",
    period: {
      start: { month: 6, day: 21 },
      end: { month: 7, day: 22 }
    },
    description: "Maximum emotional manipulation potential",
    effects: {
      shadeBonus: 20,
      primaryMetric: "emotionalManipulation",
      flavorText: "It's not me being dramatic, it's literally my zodiac"
    }
  },
  {
    name: "Scorpio Season",
    period: {
      start: { month: 10, day: 23 },
      end: { month: 11, day: 21 }
    },
    description: "Enhanced venomous undertones",
    effects: {
      shadeBonus: 30,
      primaryMetric: "backhandedCompliments",
      flavorText: "Just being honest, as Scorpio season demands"
    }
  },
  {
    name: "Leo Season",
    period: {
      start: { month: 7, day: 23 },
      end: { month: 8, day: 22 }
    },
    description: "Dramatic flair intensified",
    effects: {
      shadeBonus: 15,
      primaryMetric: "strategicVagueness",
      flavorText: "Not to be dramatic, but..."
    }
  },
  {
    name: "Full Moon",
    period: {
      start: { month: 0, day: 0 }, // Calculated dynamically
      end: { month: 0, day: 0 }
    },
    description: "Peak cosmic judgment",
    effects: {
      shadeBonus: 40,
      primaryMetric: "guiltTripIntensity",
      flavorText: "The moon made me say it"
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