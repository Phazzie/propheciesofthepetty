import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpreadSelector } from '../SpreadSelector';
import type { SpreadConfig } from '../SpreadSelector';

const mockCustomSpread: SpreadConfig = {
  id: 'custom-123456789' as const,
  name: 'My Test Spread',
  description: 'A custom test spread',
  cardCount: 3,
  icon: 'threeCard',
  positions: [
    { name: 'Test 1', description: 'Test description 1' },
    { name: 'Test 2', description: 'Test description 2' },
    { name: 'Test 3', description: 'Test description 3' }
  ],
  isCustom: true
};

describe('SpreadSelector', () => {
  const mockOnSelect = vi.fn();
  
  it('selects a spread', () => {
    render(<SpreadSelector onSelect={mockOnSelect} selectedSpread={null} />);
    
    const classicSpread = screen.getByRole('button', { name: /past, present, future/i });
    fireEvent.click(classicSpread);
    
    expect(mockOnSelect).toHaveBeenCalledWith(expect.objectContaining({
      id: 'classic',
      name: 'Past, Present, Future',
      description: expect.any(String),
      cardCount: 3,
      icon: 'threeCard',
      positions: expect.any(Array)
    }));
  });

  it('shows selected state correctly', () => {
    const selectedSpread: SpreadConfig = {
      id: 'classic',
      name: 'Past, Present, Future',
      description: 'Test description',
      cardCount: 3,
      icon: 'threeCard',
      positions: []
    };
    
    render(<SpreadSelector onSelect={vi.fn()} selectedSpread={selectedSpread} />);
    
    const selectedButton = screen.getByRole('button', { name: /past, present, future/i });
    expect(selectedButton).toHaveClass('bg-purple-600', 'text-white');
  });
});

describe('SpreadSelector with Custom Spreads', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows custom spread creation button', () => {
    render(<SpreadSelector onSelect={mockOnSelect} selectedSpread={null} />);
    expect(screen.getByText(/create custom spread/i)).toBeInTheDocument();
  });

  it('opens custom spread builder when create button clicked', () => {
    render(<SpreadSelector onSelect={mockOnSelect} selectedSpread={null} />);
    fireEvent.click(screen.getByText(/create custom spread/i));
    expect(screen.getByText(/create custom spread/i, { selector: 'h2' })).toBeInTheDocument();
  });

  it('adds and selects custom spread after creation', () => {
    const { rerender } = render(<SpreadSelector onSelect={mockOnSelect} selectedSpread={null} />);

    // Create custom spread
    fireEvent.click(screen.getByText(/create custom spread/i));

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/spread name/i), {
      target: { value: mockCustomSpread.name }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: mockCustomSpread.description }
    });

    // Add positions
    mockCustomSpread.positions.forEach((pos, i) => {
      if (i > 0) {
        fireEvent.click(screen.getByText(/add position/i));
      }
      const positionNames = screen.getAllByLabelText(/position name/i);
      const positionDescriptions = screen.getAllByLabelText(/description$/i);
      fireEvent.change(positionNames[i], { target: { value: pos.name } });
      fireEvent.change(positionDescriptions[i], { target: { value: pos.description } });
    });

    // Save the spread
    fireEvent.click(screen.getByText(/save spread/i));

    // Check if onSelect was called with the new spread
    expect(mockOnSelect).toHaveBeenCalledWith(expect.objectContaining({
      name: mockCustomSpread.name,
      description: mockCustomSpread.description,
      positions: mockCustomSpread.positions
    }));

    // Rerender with the new spread selected
    rerender(<SpreadSelector onSelect={mockOnSelect} selectedSpread={mockCustomSpread} />);

    // Verify the custom spread is displayed and selected
    expect(screen.getByText(mockCustomSpread.name)).toBeInTheDocument();
    expect(screen.getByText(mockCustomSpread.description)).toBeInTheDocument();
    expect(screen.getByText(`${mockCustomSpread.cardCount} cards`)).toBeInTheDocument();
  });

  it('displays custom spread positions when selected', () => {
    render(<SpreadSelector onSelect={mockOnSelect} selectedSpread={mockCustomSpread} />);

    mockCustomSpread.positions.forEach(pos => {
      expect(screen.getByText(pos.name + ':')).toBeInTheDocument();
      expect(screen.getByText(pos.description)).toBeInTheDocument();
    });
  });

  it('preserves existing spreads alongside custom spreads', () => {
    render(<SpreadSelector onSelect={mockOnSelect} selectedSpread={mockCustomSpread} />);

    // Check that built-in spreads still exist
    expect(screen.getByText(/past, present, future/i)).toBeInTheDocument();
    expect(screen.getByText(/celtic cross/i)).toBeInTheDocument();

    // And custom spread is shown
    expect(screen.getByText(mockCustomSpread.name)).toBeInTheDocument();
  });
});