import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpreadSelector, type SpreadConfig } from '../../reading/SpreadSelector';

describe('SpreadSelector', () => {
  const mockSelect = vi.fn();
  const defaultProps = {
    onSelect: mockSelect,
    selectedSpread: null as SpreadConfig | null
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders available spreads', () => {
    render(<SpreadSelector {...defaultProps} />);

    // Celtic Cross should be available
    const celticCross = screen.getByText(/celtic cross/i);
    expect(celticCross).toBeInTheDocument();
    
    fireEvent.click(celticCross);
    expect(mockSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'celtic-cross',
        cardCount: 10
      })
    );
  });

  it('shows spread descriptions with shade requirements', () => {
    render(<SpreadSelector {...defaultProps} />);

    const spreads = screen.getAllByRole('button');
    expect(spreads.length).toBeGreaterThan(0);
    
    const descriptions = screen.getAllByText(/spread/i);
    expect(descriptions.some(d => d.textContent?.includes('cosmic judgment'))).toBe(true);
  });

  it('highlights selected spread', () => {
    const selectedSpread: SpreadConfig = {
      id: 'celtic-cross',
      name: 'Celtic Cross',
      description: expect.any(String),
      cardCount: 10,
      icon: 'celticCross',
      positions: expect.any(Array)
    };

    render(
      <SpreadSelector 
        onSelect={mockSelect}
        selectedSpread={selectedSpread}
      />
    );

    const selectedButton = screen.getByRole('button', { selected: true });
    expect(selectedButton).toHaveTextContent('Celtic Cross');
  });

  it('displays card positions for selected spread', () => {
    const selectedSpread: SpreadConfig = {
      id: 'past-present-future',
      name: 'Past, Present, Future',
      description: expect.any(String),
      cardCount: 3,
      icon: 'threeCard',
      positions: [
        { name: 'Past', description: expect.any(String) },
        { name: 'Present', description: expect.any(String) },
        { name: 'Future', description: expect.any(String) }
      ]
    };

    render(
      <SpreadSelector 
        onSelect={mockSelect}
        selectedSpread={selectedSpread}
      />
    );

    expect(screen.getByText('Card Positions')).toBeInTheDocument();
    expect(screen.getByText('Past:')).toBeInTheDocument();
    expect(screen.getByText('Present:')).toBeInTheDocument();
    expect(screen.getByText('Future:')).toBeInTheDocument();
  });
});