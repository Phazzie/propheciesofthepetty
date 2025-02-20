import { describe, it, expect } from 'vitest';
import { ValidationUtils } from '../validation';

describe('ValidationUtils', () => {
  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+label@domain.com'
      ];

      validEmails.forEach(email => {
        const result = ValidationUtils.validateEmail(email);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('invalidates incorrect email formats', () => {
      const invalidEmails = [
        '',
        'invalid',
        '@domain.com',
        'user@',
        'user@domain',
        'user.domain.com'
      ];

      invalidEmails.forEach(email => {
        const result = ValidationUtils.validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(1);
      });
    });
  });

  describe('checkPasswordStrength', () => {
    it('scores strong passwords highly', () => {
      const strongPassword = 'StrongP@ss123';
      const result = ValidationUtils.checkPasswordStrength(strongPassword);
      expect(result.score).toBeGreaterThanOrEqual(3);
      expect(result.requirements.hasUppercase).toBe(true);
      expect(result.requirements.hasLowercase).toBe(true);
      expect(result.requirements.hasNumber).toBe(true);
      expect(result.requirements.hasSpecialChar).toBe(true);
      expect(result.requirements.hasMinLength).toBe(true);
    });

    it('identifies weak passwords', () => {
      const weakPasswords = [
        'password',
        '12345678',
        'abcdefgh',
        'ABCDEFGH'
      ];

      weakPasswords.forEach(password => {
        const result = ValidationUtils.checkPasswordStrength(password);
        expect(result.score).toBeLessThan(3);
        expect(result.feedback.length).toBeGreaterThan(0);
      });
    });

    it('provides appropriate feedback', () => {
      const password = '123';
      const result = ValidationUtils.checkPasswordStrength(password);
      expect(result.feedback).toContain('Must be at least 8 characters long');
      expect(result.feedback).toContain('Must include an uppercase letter');
      expect(result.feedback).toContain('Must include a lowercase letter');
    });
  });

  describe('validatePasswordConfirmation', () => {
    it('validates matching passwords', () => {
      const result = ValidationUtils.validatePasswordConfirmation('password123', 'password123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('invalidates non-matching passwords', () => {
      const result = ValidationUtils.validatePasswordConfirmation('password123', 'password124');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Passwords do not match');
    });
  });

  describe('validateTermsAcceptance', () => {
    it('validates accepted terms', () => {
      const result = ValidationUtils.validateTermsAcceptance(true);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('invalidates unaccepted terms', () => {
      const result = ValidationUtils.validateTermsAcceptance(false);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('You must accept the terms and conditions');
    });
  });
});