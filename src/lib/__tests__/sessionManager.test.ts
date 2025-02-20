import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SessionManager } from '../sessionManager';
import { supabase } from '../supabase';
import { AuthError, NetworkError } from '../errors';
import { RecoverySystem } from '../recovery';

vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      refreshSession: vi.fn()
    }
  }
}));

vi.mock('../recovery', () => ({
  RecoverySystem: {
    withRetry: vi.fn()
  }
}));

vi.mock('../logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn()
  }
}));

describe('SessionManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('initialize', () => {
    it('initializes session from Supabase', async () => {
      const mockSession = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        expires_at: Date.now() / 1000 + 3600
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
        data: { session: mockSession },
        error: null
      });

      await SessionManager.initialize();
      const state = await SessionManager.getSessionState();
      
      expect(state.isValid).toBe(true);
      expect(state.refreshToken).toBe('refresh-token');
    });

    it('handles initialization failure', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
        data: { session: null },
        error: new Error('Failed')
      });

      await expect(SessionManager.initialize()).rejects.toThrow(AuthError);
    });
  });

  describe('session state management', () => {
    it('returns invalid state for no session', async () => {
      const state = await SessionManager.getSessionState();
      expect(state.isValid).toBe(false);
      expect(state.refreshToken).toBeNull();
    });

    it('validates session expiration', async () => {
      const mockSession = {
        expires_at: Date.now() / 1000 + 3600,
        refresh_token: 'refresh-token'
      };

      await SessionManager.setSession(mockSession as any);
      const state = await SessionManager.getSessionState();
      
      expect(state.isValid).toBe(true);
      expect(state.refreshToken).toBe('refresh-token');
    });
  });

  describe('session refresh', () => {
    it('successfully refreshes session', async () => {
      const mockNewSession = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        expires_at: Date.now() / 1000 + 3600
      };

      vi.mocked(RecoverySystem.withRetry).mockImplementationOnce(async (operation) => {
        vi.mocked(supabase.auth.refreshSession).mockResolvedValueOnce({
          data: { session: mockNewSession },
          error: null
        });
        return operation();
      });

      await SessionManager.setSession({
        refresh_token: 'old-refresh-token',
        expires_at: Date.now() / 1000 - 3600
      } as any);

      await SessionManager.refreshSession();
      const state = await SessionManager.getSessionState();
      
      expect(state.refreshToken).toBe('new-refresh-token');
      expect(state.isValid).toBe(true);
    });

    it('handles refresh failure', async () => {
      vi.mocked(RecoverySystem.withRetry).mockRejectedValueOnce(new Error('Refresh failed'));

      await SessionManager.setSession({
        refresh_token: 'old-refresh-token',
        expires_at: Date.now() / 1000 - 3600
      } as any);

      await expect(SessionManager.refreshSession()).rejects.toThrow(NetworkError);
    });
  });

  describe('session validation', () => {
    it('validates and refreshes expiring session', async () => {
      const mockSession = {
        refresh_token: 'refresh-token',
        expires_at: Date.now() / 1000 + 60 // Expires in 1 minute
      };

      const mockNewSession = {
        refresh_token: 'new-refresh-token',
        expires_at: Date.now() / 1000 + 3600
      };

      await SessionManager.setSession(mockSession as any);

      vi.mocked(RecoverySystem.withRetry).mockImplementationOnce(async (operation) => {
        vi.mocked(supabase.auth.refreshSession).mockResolvedValueOnce({
          data: { session: mockNewSession },
          error: null
        });
        return operation();
      });

      const isValid = await SessionManager.validateSession();
      expect(isValid).toBe(true);

      const state = await SessionManager.getSessionState();
      expect(state.refreshToken).toBe('new-refresh-token');
    });

    it('handles invalid session', async () => {
      const mockSession = {
        refresh_token: 'refresh-token',
        expires_at: Date.now() / 1000 - 3600 // Expired
      };

      await SessionManager.setSession(mockSession as any);
      const isValid = await SessionManager.validateSession();
      expect(isValid).toBe(false);
    });
  });

  describe('session storage', () => {
    it('stores and retrieves session', async () => {
      const mockSession = {
        refresh_token: 'refresh-token',
        expires_at: Date.now() / 1000 + 3600
      };

      await SessionManager.setSession(mockSession as any);
      const state = await SessionManager.getSessionState();
      
      expect(state.refreshToken).toBe('refresh-token');
      expect(state.isValid).toBe(true);
    });

    it('clears session', async () => {
      const mockSession = {
        refresh_token: 'refresh-token',
        expires_at: Date.now() / 1000 + 3600
      };

      await SessionManager.setSession(mockSession as any);
      SessionManager.clearSession();
      
      const state = await SessionManager.getSessionState();
      expect(state.isValid).toBe(false);
      expect(state.refreshToken).toBeNull();
    });

    it('handles storage errors', async () => {
      const mockError = new Error('Storage error');
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn().mockImplementation(() => { throw mockError; });

      await expect(SessionManager.setSession({} as any)).rejects.toThrow('Failed to store session');

      localStorage.setItem = originalSetItem;
    });
  });
});