/**
 * Test suite for UserProfile component
 * @module tests/UserProfile
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { UserProfile } from '../UserProfile';
import { AuthContext } from '../../../context/AuthContext';
import * as useDatabase from '../../../hooks/useDatabase';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { supabase } from '../../../lib/supabase';
import '@testing-library/jest-dom';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  CreditCard: () => <div data-testid="credit-card-icon" />,
  History: () => <div data-testid="history-icon" />,
  Loader: () => <div data-testid="loader-icon" />,
  AlertCircle: () => <div data-testid="alert-icon" />,
  Moon: () => <div data-testid="moon-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
  Bell: () => <div data-testid="bell-icon" />,
  BellOff: () => <div data-testid="bell-off-icon" />,
  Download: () => <div data-testid="download-icon" />,
  Trash2: () => <div data-testid="trash-icon" />
}));

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              theme: 'light',
              email_notifications: true
            }
          })
        }))
      })),
      upsert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockResolvedValue({ error: null })
    })),
    auth: {
      admin: {
        deleteUser: vi.fn().mockResolvedValue({ error: null })
      }
    }
  }
}));

describe('UserProfile', () => {
  const mockUser = {
    id: 'test-user',
    email: 'test@example.com',
    subscriptionType: 'free'
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

  const renderComponent = (authContextValue = {}, themeContextValue = {}) => {
    const defaultAuthContext = {
      user: mockUser,
      ...authContextValue
    };

    const defaultThemeContext = {
      theme: 'light',
      setTheme: vi.fn(),
      ...themeContextValue
    };

    return render(
      <AuthContext.Provider value={defaultAuthContext}>
        <ThemeContext.Provider value={defaultThemeContext}>
          <UserProfile />
        </ThemeContext.Provider>
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

  it('loads and displays user preferences', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Manage Preferences')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Manage Preferences'));

    expect(screen.getByText('Switch to Dark')).toBeInTheDocument();
    expect(screen.getByText('Turn Off')).toBeInTheDocument();
  });

  it('toggles theme preference', async () => {
    const setTheme = vi.fn();
    renderComponent({}, { setTheme });

    await waitFor(() => {
      expect(screen.getByText('Manage Preferences')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Manage Preferences'));
    fireEvent.click(screen.getByText('Switch to Dark'));

    expect(setTheme).toHaveBeenCalledWith('dark');
    expect(supabase.from).toHaveBeenCalledWith('user_preferences');
  });

  it('handles data export', async () => {
    const mockCreateElement = vi.spyOn(document, 'createElement');
    const mockClick = vi.fn();
    mockCreateElement.mockReturnValue({ 
      setAttribute: vi.fn(),
      click: mockClick,
      style: {},
      href: '',
      download: ''
    } as any);

    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Manage Preferences')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Manage Preferences'));
    fireEvent.click(screen.getByText('Download JSON'));

    expect(mockClick).toHaveBeenCalled();
  });

  it('confirms before account deletion', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockReturnValue(true);

    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Manage Preferences')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Manage Preferences'));
    fireEvent.click(screen.getByText('Delete Account'));

    expect(confirmSpy).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith('readings');
    expect(supabase.auth.admin.deleteUser).toHaveBeenCalledWith(mockUser.id);
  });
});