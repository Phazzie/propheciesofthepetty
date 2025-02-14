/**
 * Test suite for UserProfile component
 * @module tests/UserProfile
 */

import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from '../UserProfile';
import { AuthProvider } from '../../../context/AuthContext';
import { vi } from 'vitest';

// Mock hooks
vi.mock('../../../hooks/useDatabase', () => ({
  useReadings: () => ({
    getUserReadings: vi.fn().mockResolvedValue([
      {
        id: '1',
        spreadType: 'Past, Present, Future',
        interpretation: 'Test reading',
        createdAt: new Date().toISOString(),
        cards: []
      }
    ]),
    loading: false,
    error: null
  })
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user',
      email: 'test@example.com',
      subscriptionType: 'free'
    }
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('UserProfile', () => {
  it('renders user information', async () => {
    render(
      <AuthProvider>
        <UserProfile />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText(/member since/i)).toBeInTheDocument();
    });
  });

  it('displays subscription information', async () => {
    render(
      <AuthProvider>
        <UserProfile />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/current plan/i)).toBeInTheDocument();
      expect(screen.getByText('Free')).toBeInTheDocument();
    });
  });

  it('shows reading history', async () => {
    render(
      <AuthProvider>
        <UserProfile />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/past, present, future/i)).toBeInTheDocument();
      expect(screen.getByText(/total readings: 1/i)).toBeInTheDocument();
    });
  });

  it('handles loading state', async () => {
    vi.mocked(useReadings).mockImplementationOnce(() => ({
      getUserReadings: vi.fn(),
      loading: true,
      error: null
    }));

    render(
      <AuthProvider>
        <UserProfile />
      </AuthProvider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays error message', async () => {
    vi.mocked(useReadings).mockImplementationOnce(() => ({
      getUserReadings: vi.fn().mockRejectedValue(new Error('Failed to load')),
      loading: false,
      error: 'Failed to load user data'
    }));

    render(
      <AuthProvider>
        <UserProfile />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to load user data/i)).toBeInTheDocument();
    });
  });
});