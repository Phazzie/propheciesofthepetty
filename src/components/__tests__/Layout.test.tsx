import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Layout } from '../Layout';
import { AuthContext } from '../../context/AuthContext';
import '@testing-library/jest-dom';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon" />,
  User: () => <div data-testid="user-icon" />,
  LogOut: () => <div data-testid="logout-icon" />
}));

describe('Layout', () => {
  const mockUser = {
    email: 'test@example.com',
    id: 'test-id',
    subscriptionType: 'free'
  };

  const mockLogout = vi.fn();

  const renderWithAuth = (user = mockUser) => {
    return render(
      <AuthContext.Provider value={{ user, logout: mockLogout, loading: false, error: null, login: vi.fn(), register: vi.fn(), requestPasswordReset: vi.fn() }}>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </AuthContext.Provider>
    );
  };

  it('renders header and footer', () => {
    renderWithAuth();
    expect(screen.getByText('Passive-Aggressive Tarot')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText(/The cards may judge you/)).toBeInTheDocument();
  });

  it('displays user email when logged in', () => {
    renderWithAuth();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('does not display user section when logged out', () => {
    renderWithAuth(null);
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });
});