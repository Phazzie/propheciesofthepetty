export interface ShadeLevelDetails {
  level: number;
  title: string;
  description: string;
  feedback: string;
  undertoneStrength: string;
  colorClass: string;
}

// Weights for shade index components
const COMPONENT_WEIGHTS = {
  plausibleDeniability: 0.15,    // 15%
  guiltTripIntensity: 0.25,      // 25% - Higher weight for Pointed Pause levels
  emotionalManipulation: 0.20,   // 20%
  backhandedCompliments: 0.20,   // 20%
  strategicVagueness: 0.20       // 20%
} as const;

export const SHADE_LEVELS: Record<number, Omit<ShadeLevelDetails, 'level'>> = {
  // ... rest of the SHADE_LEVELS implementation stays the same ...
};

export const calculateShadeLevel = (shadeIndex: ShadeIndex): ShadeLevelDetails => {
  // ... rest of the implementation stays the same ...
};

export const getUndertoneStrength = (shadeIndex: ShadeIndex): string => {
  // ... rest of the implementation stays the same ...
};

export const isShadeLevelPassing = (shadeIndex: ShadeIndex): boolean => {
  // ... rest of the implementation stays the same ...
};

export const hasRequiredUndertones = (shadeIndex: ShadeIndex): boolean => {
  // ... rest of the implementation stays the same ...
};

export const getShadeBreakdown = (shadeIndex: ShadeIndex) => {
  // ... rest of the implementation stays the same ...
};

const getComponentFeedback = (component: keyof ShadeIndex, score: number): string => {
  // ... rest of the implementation stays the same ...
};