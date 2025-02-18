import { type ThematicCategory } from '../types';

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

interface SeasonalEvent {
  name: string;
  startDate: string;  // MM-DD
  endDate: string;    // MM-DD
  scoreMultiplier: number;
  description: string;
  categories: ThematicCategory[];
}

const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    name: "Mercury Retrograde",
    startDate: "12-29",
    endDate: "01-18",
    scoreMultiplier: 1.3,
    description: "Communication chaos? More like opportunity for advanced shade.",
    categories: ['snark', 'culturalResonance']
  },
  {
    name: "April Fool's Season",
    startDate: "03-25",
    endDate: "04-02",
    scoreMultiplier: 1.2,
    description: "When clever observations are basically mandatory.",
    categories: ['humor', 'metaphorMastery']
  },
  {
    name: "Holiday Season",
    startDate: "11-20",
    endDate: "12-31",
    scoreMultiplier: 1.4,
    description: "Family gatherings? Perfect time for elevated passive aggression.",
    categories: ['culturalResonance', 'metaphorMastery']
  },
  {
    name: "Awards Season",
    startDate: "01-07",
    endDate: "03-15",
    scoreMultiplier: 1.25,
    description: "Channel your inner critic with red carpet energy.",
    categories: ['snark', 'culturalResonance']
  }
];

export const getActiveSeasonalModifiers = (): SeasonalEvent[] => {
  const today = new Date();
  const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
  const currentDay = String(today.getDate()).padStart(2, '0');
  const currentDate = `${currentMonth}-${currentDay}`;

  return SEASONAL_EVENTS.filter(event => {
    const isYearWrap = event.startDate > event.endDate;
    
    if (isYearWrap) {
      // Event wraps around the year (e.g., Dec 29 - Jan 18)
      return currentDate >= event.startDate || currentDate <= event.endDate;
    } else {
      // Event within same year
      return currentDate >= event.startDate && currentDate <= event.endDate;
    }
  });
};

export const calculateSeasonalBonus = (baseScore: number, categories: ThematicCategory[]): {
  modifiedScore: number;
  activeEvents: SeasonalEvent[];
  bonusPoints: number;
} => {
  const activeEvents = getActiveSeasonalModifiers();
  let maxMultiplier = 1;
  
  // Find events that match the reading's categories
  const relevantEvents = activeEvents.filter(event => 
    event.categories.some(category => categories.includes(category))
  );

  if (relevantEvents.length > 0) {
    // Use the highest applicable multiplier
    maxMultiplier = Math.max(...relevantEvents.map(e => e.scoreMultiplier));
  }

  const modifiedScore = Math.round(baseScore * maxMultiplier);
  const bonusPoints = modifiedScore - baseScore;

  return {
    modifiedScore,
    activeEvents,
    bonusPoints
  };
};