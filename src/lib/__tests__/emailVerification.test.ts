import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailVerification } from '../emailVerification';
import { supabase } from '../supabase';
import { ValidationError } from '../errors';

vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: vi.fn(),
      verifyOtp: vi.fn()
    }
  }
}));

vi.mock('../logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn()
  }
}));

describe('EmailVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendVerificationEmail', () => {
    it('sends verification email successfully', async () => {
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValueOnce({ data: {}, error: null });
      
      await expect(EmailVerification.sendVerificationEmail('test@example.com')).resolves.not.toThrow();
    });

    it('throws error when sending fails', async () => {
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValueOnce({
        data: null,
        error: new Error('Failed to send')
      });

      await expect(EmailVerification.sendVerificationEmail('test@example.com'))
        .rejects.toThrow(ValidationError);
    });
  });

  describe('verifyEmail', () => {
    it('verifies email successfully', async () => {
      vi.mocked(supabase.auth.verifyOtp).mockResolvedValueOnce({ data: {}, error: null });

      const result = await EmailVerification.verifyEmail('valid-token');
      expect(result.success).toBe(true);
      expect(result.message).toMatch(/verified successfully/i);
    });

    it('handles verification failure', async () => {
      vi.mocked(supabase.auth.verifyOtp).mockResolvedValueOnce({
        data: null,
        error: new Error('Invalid token')
      });

      const result = await EmailVerification.verifyEmail('invalid-token');
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/verification failed/i);
    });
  });

  describe('resendVerification', () => {
    it('resends verification email', async () => {
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValueOnce({ data: {}, error: null });
      
      await expect(EmailVerification.resendVerification('test@example.com')).resolves.not.toThrow();
    });

    it('handles resend failure', async () => {
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValueOnce({
        data: null,
        error: new Error('Failed to send')
      });

      await expect(EmailVerification.resendVerification('test@example.com'))
        .rejects.toThrow(ValidationError);
    });
  });
});