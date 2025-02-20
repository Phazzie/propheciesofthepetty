import { CoreMetrics, ShadeIndex } from '../types';
import { ExtendedMetrics } from '../types';
import { ValidationError } from './errors';

// Core metrics must reach 80/100 (equivalent to original 8/10)
export const CORE_METRIC_THRESHOLD = 80;

// Validates that all core metrics meet minimum requirements
export function validateCoreMetrics(metrics: CoreMetrics): boolean {
  return Object.values(metrics).every(score => score >= CORE_METRIC_THRESHOLD);
}

// Special conditions for scoring boosts
export interface SpecialCondition {
  id: string;
  name: string;
  description: string;
  check: (metrics: CoreMetrics & ExtendedMetrics & { shadeIndex: ShadeIndex }) => boolean;
  bonus: number;
}

export const SPECIAL_CONDITIONS: SpecialCondition[] = [
  {
    id: 'shadow-maestro',
    name: 'Shadow Maestro',
    description: 'Perfect balance of subtlety and strategic vagueness',
    check: ({ subtlety, shadeIndex }) => 
      subtlety >= 90 && shadeIndex.strategicVagueness >= 90,
    bonus: 15
  },
  {
    id: 'balanced-blade',
    name: 'Balanced Blade',
    description: 'Peak performance in both wisdom and emotional manipulation',
    check: ({ wisdom, shadeIndex }) => 
      wisdom >= 85 && shadeIndex.emotionalManipulation >= 85,
    bonus: 10
  },
  {
    id: 'zeitgeist-whisperer',
    name: 'Zeitgeist Whisperer',
    description: 'Masterful cultural resonance with plausible deniability',
    check: ({ culturalResonance, shadeIndex }) =>
      culturalResonance >= 85 && shadeIndex.plausibleDeniability >= 85,
    bonus: 12
  }
];

// Calculates total score with bonuses
export function calculateTotalScore(
  metrics: CoreMetrics & ExtendedMetrics & { shadeIndex: ShadeIndex },
  baseScore: number
): number {
  const activeConditions = SPECIAL_CONDITIONS.filter(condition => 
    condition.check(metrics)
  );
  
  const totalBonus = activeConditions.reduce((sum, condition) => 
    sum + condition.bonus, 0
  );

  return Math.min(100, baseScore + totalBonus);
}

interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export const emailRules: ValidationRule<string>[] = [
  {
    validate: (email) => email.length > 0,
    message: 'Email is required'
  },
  {
    validate: (email) => isEmail(email, { allow_utf8_local_part: false }),
    message: 'Please enter a valid email address'
  }
];

export const passwordRules: ValidationRule<string>[] = [
  {
    validate: (password) => password.length >= 8,
    message: 'Password must be at least 8 characters'
  },
  {
    validate: (password) => /[A-Z]/.test(password),
    message: 'Password must contain at least one uppercase letter'
  },
  {
    validate: (password) => /[a-z]/.test(password),
    message: 'Password must contain at least one lowercase letter'
  },
  {
    validate: (password) => /[0-9]/.test(password),
    message: 'Password must contain at least one number'
  },
  {
    validate: (password) => /[!@#$%^&*]/.test(password),
    message: 'Password must contain at least one special character (!@#$%^&*)'
  }
];

export const validateInput = <T>(value: T, rules: ValidationRule<T>[]) => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      throw new ValidationError(rule.message);
    }
  }
};

export const validateEmail = (email: string) => validateInput(email, emailRules);
export const validatePassword = (password: string) => validateInput(password, passwordRules);