import { CoreMetrics, ShadeIndex } from '../types';
import { ExtendedMetrics } from '../types';
import { ValidationError } from './errors';
import { logger } from './logger';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface PasswordStrengthResult {
  score: number;  // 0-4 scale
  requirements: {
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
  feedback: string[];
}

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

export class ValidationUtils {
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain one uppercase letter');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain one lowercase letter');
      }
      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain one number');
      }
      if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain one special character (!@#$%^&*)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validatePasswordConfirmation(password: string, confirmation: string): ValidationResult {
    const errors: string[] = [];

    if (!confirmation) {
      errors.push('Please confirm your password');
    } else if (password !== confirmation) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateTermsAcceptance(accepted: boolean): ValidationResult {
    return {
      isValid: accepted,
      errors: accepted ? [] : ['You must accept the terms and conditions']
    };
  }

  static validateForm<T extends Record<string, any>>(
    data: T,
    validations: {
      [K in keyof T]?: (value: T[K]) => ValidationResult;
    }
  ): ValidationResult {
    const errors: string[] = [];

    Object.entries(validations).forEach(([field, validate]) => {
      if (validate) {
        const result = validate(data[field]);
        if (!result.isValid) {
          errors.push(...result.errors.map(error => `${field}: ${error}`));
        }
      }
    });

    const isValid = errors.length === 0;
    if (!isValid) {
      logger.warn('Form validation failed', { errors });
    }

    return {
      isValid,
      errors
    };
  }

  static checkPasswordStrength(password: string): { score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    // Length
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    else feedback.push('Consider using a longer password');

    // Character types
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');
    
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Add numbers');
    
    if (/[!@#$%^&*]/.test(password)) score += 1;
    else feedback.push('Add special characters');

    // Common patterns
    if (/(.)\1{2,}/.test(password)) {
      score -= 1;
      feedback.push('Avoid repeated characters');
    }

    if (/^(?:abc|123|qwerty|password)/i.test(password)) {
      score -= 1;
      feedback.push('Avoid common patterns');
    }

    return {
      score: Math.max(0, Math.min(5, score)),
      feedback
    };
  }

  static validate<T>(value: T, validator: (value: T) => ValidationResult): T {
    const result = validator(value);
    if (!result.isValid) {
      throw new ValidationError(result.errors.join(', '));
    }
    return value;
  }
}