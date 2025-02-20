import { supabase } from './supabase';
import { ValidationError } from './errors';
import { logger } from './logger';
import { ValidationUtils } from './validation';

export interface ResetResult {
  success: boolean;
  message: string;
}

export class PasswordReset {
  private static readonly RESET_TOKEN_EXPIRY = 3600; // 1 hour in seconds
  private static readonly MAX_RESET_ATTEMPTS = 3;
  private static readonly LOCKOUT_DURATION = 24 * 60 * 60; // 24 hours in seconds

  static async initiateReset(email: string): Promise<void> {
    const emailValidation = ValidationUtils.validateEmail(email);
    if (!emailValidation.isValid) {
      throw new ValidationError(emailValidation.errors[0]);
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
      captchaToken: await this.generateCaptchaToken()
    });

    if (error) {
      logger.error('Failed to initiate password reset', error);
      throw new ValidationError('Unable to send reset instructions. Please try again later.');
    }

    logger.info('Password reset initiated', { email });
  }

  static async validateResetToken(token: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        return false;
      }
      return true;
    } catch (err) {
      logger.error('Token validation failed', err);
      return false;
    }
  }

  static async resetPassword(token: string, newPassword: string): Promise<ResetResult> {
    const passwordValidation = ValidationUtils.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: passwordValidation.errors[0]
      };
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: 'Password has been successfully reset.'
      };
    } catch (err) {
      logger.error('Password reset failed', err);
      return {
        success: false,
        message: 'Failed to reset password. Please try again.'
      };
    }
  }

  private static async generateCaptchaToken(): Promise<string> {
    // Integration with reCAPTCHA or similar service would go here
    return 'dummy-captcha-token';
  }
}