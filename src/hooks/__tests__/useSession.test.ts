import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSession } from '../useSession';
import { SessionManager } from '../../lib/sessionManager';
import { useAuth } from '../../context/AuthContext';

vi.mock('../../context/AuthContext');
vi.mock('../../lib/sessionManager');
vi.mock('../../lib/logger');

describe('useSession', () => {
  const mockLogout = vi.fn();
  const mockUser = { id: '1', email: 'test@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    (useAuth as vi.Mock).mockReturnValue({
      user: mockUser,
      logout: mockLogout
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with valid session', async () => {
    vi.mocked(SessionManager.validateSession).mockResolvedValue(true);

    const { result } = renderHook(() => useSession());
    
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.isValid).toBe(true);
  });

  it('detects invalid session', async () => {
    vi.mocked(SessionManager.validateSession).mockResolvedValue(false);

    const { result } = renderHook(() => useSession());
    
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.isValid).toBe(false);
    expect(mockLogout).toHaveBeenCalled();
  });

  it('refreshes session periodically', async () => {
    vi.mocked(SessionManager.validateSession).mockResolvedValue(true);

    renderHook(() => useSession({ refreshInterval: 1000 }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(SessionManager.validateSession).toHaveBeenCalledTimes(6); // Initial + 5 intervals
  });

  it('calls onExpire when session expires', async () => {
    const onExpire = vi.fn();
    vi.mocked(SessionManager.validateSession).mockResolvedValue(false);

    renderHook(() => useSession({ onExpire }));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(onExpire).toHaveBeenCalled();
    expect(mockLogout).toHaveBeenCalled();
  });

  it('handles manual session validation', async () => {
    vi.mocked(SessionManager.validateSession).mockResolvedValue(true);

    const { result } = renderHook(() => useSession());

    await act(async () => {
      const isValid = await result.current.validate();
      expect(isValid).toBe(true);
    });
  });

  it('handles manual session refresh', async () => {
    vi.mocked(SessionManager.refreshSession).mockResolvedValue();

    const { result } = renderHook(() => useSession());

    await act(async () => {
      const success = await result.current.refresh();
      expect(success).toBe(true);
      expect(result.current.isValid).toBe(true);
    });
  });

  it('handles refresh failure', async () => {
    vi.mocked(SessionManager.refreshSession).mockRejectedValue(new Error('Refresh failed'));

    const { result } = renderHook(() => useSession());

    await act(async () => {
      const success = await result.current.refresh();
      expect(success).toBe(false);
      expect(result.current.isValid).toBe(false);
    });
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    
    const { unmount } = renderHook(() => useSession({ refreshInterval: 1000 }));
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('does not start session check without user', async () => {
    (useAuth as vi.Mock).mockReturnValue({
      user: null,
      logout: mockLogout
    });

    vi.mocked(SessionManager.validateSession).mockResolvedValue(true);

    renderHook(() => useSession());
    
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(SessionManager.validateSession).not.toHaveBeenCalled();
  });
});