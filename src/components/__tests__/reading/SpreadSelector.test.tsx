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
    const mockOnSelect = vi.fn();dConfig = {
    const selectedSpread = null;
      name: 'Celtic Cross',
    beforeEach(() => {
        vi.clearAllMocks();
    });
expect.any(Array)
    it('renders all available spreads from SPREADS config', () => {
        render(
            <SpreadSelector 
                onSelect={mockOnSelect}<SpreadSelector 
                selectedSpread={selectedSpread}
            />edSpread}
        );

        // Check that all spread names are rendered
        expect(screen.getByText(/Past, Present, Future/i)).toBeInTheDocument();const selectedButton = screen.getByRole('button', { selected: true });
        expect(screen.getByText(/Celtic Cross/i)).toBeInTheDocument();    expect(selectedButton).toHaveTextContent('Celtic Cross');
        expect(screen.getByText(/I'm Fine/i)).toBeInTheDocument();
        expect(screen.getByText(/Just Saying/i)).toBeInTheDocument();
        expect(screen.getByText(/Whatever/i)).toBeInTheDocument();'displays card positions for selected spread', () => {
        expect(screen.getByText(/No Offense But.../i)).toBeInTheDocument();    const selectedSpread: SpreadConfig = {
    });
 'Past, Present, Future',
    it('displays correct card count for each spread', () => {ect.any(String),
        render(
            <SpreadSelector 
                onSelect={mockOnSelect}sitions: [
                selectedSpread={selectedSpread}  { name: 'Past', description: expect.any(String) },
            />        { name: 'Present', description: expect.any(String) },
        );

        expect(screen.getByText('3 cards')).toBeInTheDocument(); // Past Present Future
        expect(screen.getByText('10 cards')).toBeInTheDocument(); // Celtic Cross
        expect(screen.getByText('6 cards')).toBeInTheDocument(); // No Offense But...
    });

    it('shows card positions when spread is selected', () => {selectedSpread={selectedSpread}
        const selectedSpread = SPREADS[0]; // Past Present Future spread
        
        render(
            <SpreadSelector     expect(screen.getByText('Card Positions')).toBeInTheDocument();
                onSelect={mockOnSelect}
                selectedSpread={selectedSpread}screen.getByText('Present:')).toBeInTheDocument();
            />yText('Future:')).toBeInTheDocument();
        );
        // Check that position details are shown        expect(screen.getByText(/Past:/i)).toBeInTheDocument();        expect(screen.getByText(/Present:/i)).toBeInTheDocument();        expect(screen.getByText(/Future:/i)).toBeInTheDocument();    });    it('applies correct styling to selected spread', () => {        const selectedSpread = SPREADS[0];                render(            <SpreadSelector                 onSelect={mockOnSelect}                selectedSpread={selectedSpread}            />        );        const selectedButton = screen.getByText(selectedSpread.name).closest('button');        expect(selectedButton).toHaveClass('bg-purple-600');        expect(selectedButton).toHaveClass('text-white');    });    it('displays appropriate icons for each spread', () => {        render(            <SpreadSelector                 onSelect={mockOnSelect}                selectedSpread={selectedSpread}            />        );        const spreadButtons = screen.getAllByRole('button');        expect(spreadButtons[0]).toContainElement(screen.getByTestId('layout-icon'));        expect(spreadButtons[1]).toContainElement(screen.getByTestId('copy-x-icon'));    });});