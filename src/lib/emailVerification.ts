import { supabase } from './supabase';
import { ValidationError } from './errors';
import { logger } from './logger';

export interface VerificationResult {
  success: boolean;
  message: string;
}

export class EmailVerification {
  private static readonly VERIFICATION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  static async sendVerificationEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/verify-email`
    });

    if (error) {
      logger.error('Failed to send verification email', error);
      throw new ValidationError('Failed to send verification email. Please try again.');
    }
  }

  static async verifyEmail(token: string): Promise<VerificationResult> {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });

      if (error) {
        logger.error('Email verification failed', error);
        return {
          success: false,
          message: 'Email verification failed. Please try again.'
        };
      }

      return {
        success: true,
        message: 'Email verified successfully!'
      };
    } catch (err) {
      logger.error('Email verification error', err);
      return {
        success: false,
        message: 'An error occurred during verification. Please try again.'
      };
    }
  }

  static async resendVerification(email: string): Promise<void> {
    await this.sendVerificationEmail(email);
  }
}