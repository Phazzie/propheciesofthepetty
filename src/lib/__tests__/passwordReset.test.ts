import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PasswordReset } from '../passwordReset';
import { supabase } from '../supabase';
import { ValidationError } from '../errors';

vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: vi.fn(),
      getUser: vi.fn(),
      updateUser: vi.fn()
    }
  }
}));

vi.mock('../logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn()
  }
}));

describe('PasswordReset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initiateReset', () => {
    it('validates email before sending reset', async () => {
      await expect(PasswordReset.initiateReset('invalid-email'))
        .rejects.toThrow(ValidationError);
    });

    it('sends reset email for valid email', async () => {
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValueOnce({ 
        data: {}, 
        error: null 
      });

      await expect(PasswordReset.initiateReset('valid@email.com'))
        .resolves.not.toThrow();
    });

    it('handles API errors', async () => {
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValueOnce({
        data: null,
        error: new Error('API Error')
      });

      await expect(PasswordReset.initiateReset('valid@email.com'))
        .rejects.toThrow('Unable to send reset instructions');
    });
  });

  describe('validateResetToken', () => {
    it('validates valid token', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
        data: { user: { id: 'user-id' } },
        error: null
      });

      const result = await PasswordReset.validateResetToken('valid-token');
      expect(result).toBe(true);
    });

    it('invalidates expired or invalid token', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
        data: { user: null },
        error: new Error('Invalid token')
      });

      const result = await PasswordReset.validateResetToken('invalid-token');
      expect(result).toBe(false);
    });
  });

  describe('resetPassword', () => {
    it('validates password requirements', async () => {
      const result = await PasswordReset.resetPassword('token', 'weak');
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/password must be/i);
    });

    it('successfully resets password', async () => {
      vi.mocked(supabase.auth.updateUser).mockResolvedValueOnce({
        data: { user: { id: 'user-id' } },
        error: null
      });

      const result = await PasswordReset.resetPassword('token', 'StrongP@ssword123');
      expect(result.success).toBe(true);
      expect(result.message).toMatch(/successfully reset/i);
    });

    it('handles reset failures', async () => {
      vi.mocked(supabase.auth.updateUser).mockResolvedValueOnce({
        data: null,
        error: new Error('Reset failed')
      });

      const result = await PasswordReset.resetPassword('token', 'StrongP@ssword123');
      expect(result.success).toBe(false);
      expect(result.message).toMatch(/failed to reset/i);
    });
  });
});