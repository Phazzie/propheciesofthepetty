import type { ShadeIndex } from '../types';

export interface ShadeLevelDetails {
  level: number;
  title: string;
  description: string;
  feedback: string;
  undertoneStrength: string;
  colorClass: string;
}

/**
 * Shade Level™ Criteria
 * Each level represents increasing sophistication in passive-aggressive delivery
 */
export const SHADE_LEVELS: Record<number, Omit<ShadeLevelDetails, 'level'>> = {
  1: {
    title: 'Sweet Summer Child',
    description: 'Barely noticeable criticism',
    feedback: "Honey, we're not here to make friends, but we're not here to be obvious either.",
    undertoneStrength: 'Minimal',
    colorClass: 'text-green-400'
  },
  2: {
    title: 'Amateur Hour',
    description: 'Attempts at subtlety',
    feedback: "There's potential here, but let's work on your... everything.",
    undertoneStrength: 'Developing',
    colorClass: 'text-emerald-400'
  },
  3: {
    title: 'The Pointed Pause',
    description: 'Clear undertones of judgment',
    feedback: "Now we're getting somewhere. Your silence speaks volumes.",
    undertoneStrength: 'Clear',
    colorClass: 'text-teal-400'
  },
  4: {
    title: 'The Raised Eyebrow',
    description: 'Mastery of the loaded question',
    feedback: "The way you phrase things... *chef's kiss*",
    undertoneStrength: 'Strong',
    colorClass: 'text-cyan-400'
  },
  5: {
    title: 'The Deep Sigh',
    description: 'Expert use of passive aggression',
    feedback: "Your exasperation is an art form.",
    undertoneStrength: 'Expert',
    colorClass: 'text-blue-400'
  },
  6: {
    title: 'The Concerned Friend',
    description: 'Weaponized empathy',
    feedback: "Your 'concern' is absolutely devastating.",
    undertoneStrength: 'Refined',
    colorClass: 'text-indigo-400'
  },
  7: {
    title: 'The Sugar Coated Dagger',
    description: 'Devastating criticism wrapped in sweetness',
    feedback: "The way you make criticism sound like a compliment? Brilliant.",
    undertoneStrength: 'Advanced',
    colorClass: 'text-purple-400'
  },
  8: {
    title: 'The Velvet Hammer',
    description: 'Elegantly brutal observations',
    feedback: "Your delivery is so smooth they won't feel the burn until tomorrow.",
    undertoneStrength: 'Masterful',
    colorClass: 'text-fuchsia-400'
  },
  9: {
    title: 'The Delayed Reaction',
    description: 'So subtle it takes days to process',
    feedback: "They'll be unpacking this one for weeks. Masterful.",
    undertoneStrength: 'Supreme',
    colorClass: 'text-pink-400'
  },
  10: {
    title: 'The Cosmic Shade',
    description: 'Transcendent levels of passive aggression',
    feedback: "You've weaponized politeness to an art form. We're not worthy.",
    undertoneStrength: 'Legendary',
    colorClass: 'text-rose-400'
  }
};

export const calculateShadeLevel = (shadeIndex: ShadeIndex): ShadeLevelDetails => {
  // Calculate base shade level
  const values = Object.values(shadeIndex);
  const averageScore = values.reduce((sum, val) => sum + val, 0) / values.length;
  const level = Math.min(Math.floor(averageScore / 10), 10);
  
  // Get level details
  const details = SHADE_LEVELS[level] || SHADE_LEVELS[1];
  
  return {
    level,
    ...details
  };
};

export const getUndertoneStrength = (shadeIndex: ShadeIndex): string => {
  const { undertoneStrength } = calculateShadeLevel(shadeIndex);
  return undertoneStrength;
};

export const isShadeLevelPassing = (shadeIndex: ShadeIndex): boolean => {
  const { level } = calculateShadeLevel(shadeIndex);
  return level >= 7; // Minimum passing level
};

// Special emphasis on Levels 3-4 (Clear undertones of judgment)
export const hasRequiredUndertones = (shadeIndex: ShadeIndex): boolean => {
  const { level } = calculateShadeLevel(shadeIndex);
  return level >= 3; // Minimum required for clear undertones
};

// Get component breakdowns for detailed feedback
export const getShadeBreakdown = (shadeIndex: ShadeIndex) => {
  return Object.entries(shadeIndex).map(([component, score]) => ({
    component,
    score,
    feedback: getComponentFeedback(component as keyof ShadeIndex, score)
  }));
};

const getComponentFeedback = (component: keyof ShadeIndex, score: number): string => {
  const feedbackMap: Record<keyof ShadeIndex, Record<string, string>> = {
    plausibleDeniability: {
      high: "Perfect balance of 'Who, me?' energy",
      medium: "They suspect, but can't prove anything",
      low: "A bit too obvious, darling"
    },
    guiltTripIntensity: {
      high: "The emotional manipulation is *chef's kiss*",
      medium: "The guilt is there, but needs more trip",
      low: "Try adding more disappointment"
    },
    emotionalManipulation: {
      high: "Using caring as a weapon? Brilliant",
      medium: "The concern is almost believable",
      low: "Show them you care... aggressively"
    },
    backhandedCompliments: {
      high: "The compliment hits, then the shade follows",
      medium: "More backhanded, less compliment",
      low: "These are just regular compliments, sweetie"
    },
    strategicVagueness: {
      high: "The art of saying nothing while saying everything",
      medium: "Getting warmer, but still too direct",
      low: "Be less specific about your specifics"
    }
  };

  if (score >= 80) return feedbackMap[component].high;
  if (score >= 50) return feedbackMap[component].medium;
  return feedbackMap[component].low;
};