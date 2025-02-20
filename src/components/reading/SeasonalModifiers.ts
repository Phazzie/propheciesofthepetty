import { CoreMetrics, ShadeIndex } from '../../types';

export interface SeasonalModifier {
  name: string;
  period: {
    start: { month: number; day: number };
    end: { month: number; day: number };
  };
  description: string;
  effects: {
    shadeBonus: number;        // 0-40 bonus points
    primaryMetric: keyof CoreMetrics | 'shadeIndex';
    flavorText: string;
  };
}

export const SEASONAL_MODIFIERS: SeasonalModifier[] = [
  {
    name: "Mercury Retrograde",
    period: {
      start: { month: 11, day: 29 },
      end: { month: 0, day: 18 }
    },
    description: "Communication chaos enhances passive-aggressive potential",
    effects: {
      shadeBonus: 30,
      primaryMetric: "shadeIndex",
      flavorText: "When even the planets support your shade"
    }
  },
  {
    name: "Leo Season",
    period: {
      start: { month: 6, day: 23 },
      end: { month: 7, day: 22 }
    },
    description: "Peak dramatic energy",
    effects: {
      shadeBonus: 25,
      primaryMetric: "creative",
      flavorText: "When drama becomes an art form"
    }
  },
  {
    name: "Holiday Season",
    period: {
      start: { month: 10, day: 20 },
      end: { month: 11, day: 31 }
    },
    description: "Family gatherings amplify passive-aggressive potential",
    effects: {
      shadeBonus: 35,
      primaryMetric: "wisdom",
      flavorText: "Deck the halls with subtle judgment"
    }
  }
];

export function calculateSeasonalBonus(
  date: Date,
  metrics: CoreMetrics & { shadeIndex: ShadeIndex }
): number {
  const activeModifiers = SEASONAL_MODIFIERS.filter(modifier => 
    isDateInPeriod(date, modifier.period)
  );

  return activeModifiers.reduce((totalBonus, modifier) => {
    const baseMetricScore = getMetricScore(metrics, modifier.effects.primaryMetric);
    const multiplier = baseMetricScore >= 80 ? 1 : baseMetricScore / 100;
    return totalBonus + (modifier.effects.shadeBonus * multiplier);
  }, 0);
}

function isDateInPeriod(date: Date, period: SeasonalModifier['period']): boolean {
  const month = date.getMonth();
  const day = date.getDate();

  const start = period.start;
  const end = period.end;

  // Handle year wrap-around (e.g., Dec-Jan periods)
  if (start.month > end.month) {
    return (month > start.month || (month === start.month && day >= start.day)) ||
           (month < end.month || (month === end.month && day <= end.day));
  }

  // Normal period within same year
  return (month > start.month || (month === start.month && day >= start.day)) &&
         (month < end.month || (month === end.month && day <= end.day));
}

function getMetricScore(
  metrics: CoreMetrics & { shadeIndex: ShadeIndex },
  metric: keyof (CoreMetrics & { shadeIndex: ShadeIndex })
): number {
  if (metric === 'shadeIndex') {
    const shadeValues = Object.values(metrics.shadeIndex);
    return shadeValues.reduce((sum: number, val: number) => sum + val, 0) / shadeValues.length;
  }
  return metrics[metric];
}