/**
 * Test suite for UserProfile component
 * @module tests/UserProfile
 */

import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from '../UserProfile';
import { AuthProvider } from '../../../context/AuthContext';
import { vi } from 'vitest';
import { describe, it, expect } from 'vitest';
import { AuthContext } from '../../../context/AuthContext';
import * as useDatabase from '../../../hooks/useDatabase';
import '@testing-library/jest-dom';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  CreditCard: () => <div data-testid="credit-card-icon" />,
  History: () => <div data-testid="history-icon" />,
  Loader: () => <div data-testid="loader-icon" />,
  AlertCircle: () => <div data-testid="alert-icon" />
}));

// Mock useReadings hook
vi.mock('../../../hooks/useDatabase', () => ({
  useReadings: vi.fn(() => ({
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
  }))
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
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    subscriptionType: 'Premium'
  };

  const mockReadings = [
    {
      id: '1',
      spreadType: 'celtic-cross',
      createdAt: '2024-01-15T12:00:00Z'
    },
    {
      id: '2',
      spreadType: 'three-card',
      createdAt: '2024-01-14T12:00:00Z'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDatabase.useReadings).mockReturnValue({
      getUserReadings: vi.fn().mockResolvedValue(mockReadings)
    });
  });

  const renderComponent = (authContextValue = {}) => {
    const defaultAuthContext = {
      user: mockUser,
      ...authContextValue
    };

    return render(
      <AuthContext.Provider value={defaultAuthContext}>
        <UserProfile />
      </AuthContext.Provider>
    );
  };

  it('renders user information', async () => {
    renderComponent();
    expect(await screen.findByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(/member since/i)).toBeInTheDocument();
  });

  it('displays subscription information', async () => {
    renderComponent();
    expect(await screen.findByText(/current plan:/i)).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useDatabase.useReadings).mockReturnValue({
      getUserReadings: vi.fn().mockImplementation(() => new Promise(() => {}))
    });
    renderComponent();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
  });

  it('displays error state', async () => {
    vi.mocked(useDatabase.useReadings).mockReturnValue({
      getUserReadings: vi.fn().mockRejectedValue(new Error('Failed to load'))
    });
    renderComponent();
    expect(await screen.findByText(/failed to load user data/i)).toBeInTheDocument();
  });

  it('renders recent readings', async () => {
    renderComponent();
    expect(await screen.findByText('celtic-cross Reading')).toBeInTheDocument();
    expect(screen.getByText('three-card Reading')).toBeInTheDocument();
  });

  it('shows no readings message when empty', async () => {
    vi.mocked(useDatabase.useReadings).mockReturnValue({
      getUserReadings: vi.fn().mockResolvedValue([])
    });
    renderComponent();
    expect(await screen.findByText(/no readings yet/i)).toBeInTheDocument();
  });

  it('does not load data when user is not authenticated', () => {
    const getUserReadings = vi.fn();
    vi.mocked(useDatabase.useReadings).mockReturnValue({ getUserReadings });
    renderComponent({ user: null });
    expect(getUserReadings).not.toHaveBeenCalled();
  });
});