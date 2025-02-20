import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserPreferences } from '../UserPreferences';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { supabase } from '../../../lib/supabase';

// Mock Supabase client
vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      upsert: vi.fn().mockResolvedValue({ error: null })
    })
  }
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Moon: () => <div data-testid="moon-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
  Bell: () => <div data-testid="bell-icon" />,
  Eye: () => <div data-testid="eye-icon" />
}));

describe('UserPreferences', () => {
  it('renders all preference options', () => {
    render(
      <ThemeProvider>
        <UserPreferences />
      </ThemeProvider>
    );

    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByText(/shade level/i)).toBeInTheDocument();
  });

  it('toggles theme', async () => {
    render(
      <ThemeProvider>
        <UserPreferences />
      </ThemeProvider>
    );

    const themeButton = screen.getByRole('button', { name: /switch to dark/i });
    fireEvent.click(themeButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /switch to light/i })).toBeInTheDocument();
    });
  });

  it('updates email notification preference', async () => {
    render(
      <ThemeProvider>
        <UserPreferences />
      </ThemeProvider>
    );

    const emailToggle = screen.getByRole('checkbox', { name: '' });
    fireEvent.click(emailToggle);

    await waitFor(() => {
      expect(supabase.from().upsert).toHaveBeenCalledWith({
        email_notifications: false
      });
    });
  });

  it('updates shade level visibility preference', async () => {
    render(
      <ThemeProvider>
        <UserPreferences />
      </ThemeProvider>
    );

    const shadeToggle = screen.getByRole('checkbox', { name: '' });
    fireEvent.click(shadeToggle);

    await waitFor(() => {
      expect(supabase.from().upsert).toHaveBeenCalledWith({
        show_shade_level: false
      });
    });
  });

  it('handles preference update errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(supabase.from().upsert).mockResolvedValueOnce({ error: new Error('Update failed') });

    render(
      <ThemeProvider>
        <UserPreferences />
      </ThemeProvider>
    );

    const toggle = screen.getAllByRole('checkbox')[0];
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});