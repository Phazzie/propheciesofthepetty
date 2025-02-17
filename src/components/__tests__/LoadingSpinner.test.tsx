import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';
import '@testing-library/jest-dom';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Loader: () => <div data-testid="loader-icon" />
}));

describe('LoadingSpinner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it('renders with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveClass('justify-center');
  });

  it('renders custom message', () => {
    const message = "Custom loading message";
    render(<LoadingSpinner message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('rotates through shade messages', async () => {
    const { rerender } = render(<LoadingSpinner />);
    
    // Check initial message
    expect(screen.getByText("Still waiting... like that text you never replied to")).toBeInTheDocument();
    
    // Advance timers and force a re-render
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    rerender(<LoadingSpinner />);
    
    // Wait for the update
    await waitFor(() => {
      expect(screen.getByText("Loading at the speed of your last life-changing decision")).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('respects size prop', () => {
    const size = 48;
    render(<LoadingSpinner size={size} />);
    const loader = screen.getByTestId('loader-icon');
    expect(loader).toHaveStyle({ width: size, height: size });
  });

  it('can be left-aligned', () => {
    render(<LoadingSpinner center={false} />);
    expect(screen.getByRole('status')).not.toHaveClass('justify-center');
  });
});