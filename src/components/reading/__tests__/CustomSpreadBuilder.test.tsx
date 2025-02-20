import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomSpreadBuilder } from '../CustomSpreadBuilder';

describe('CustomSpreadBuilder', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<CustomSpreadBuilder onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/spread name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/card positions/i)).toBeInTheDocument();
    expect(screen.getByText(/add position/i)).toBeInTheDocument();
  });

  it('adds and removes card positions', () => {
    render(<CustomSpreadBuilder onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Should start with one position
    expect(screen.getAllByLabelText(/position name/i)).toHaveLength(1);

    // Add two more positions
    const addButton = screen.getByText(/add position/i);
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    expect(screen.getAllByLabelText(/position name/i)).toHaveLength(3);

    // Remove a position
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[1]);
    expect(screen.getAllByLabelText(/position name/i)).toHaveLength(2);
  });

  it('validates form submission', () => {
    render(<CustomSpreadBuilder onSave={mockOnSave} onCancel={mockOnCancel} />);

    // Try to submit with empty fields
    const submitButton = screen.getByText(/save spread/i);
    fireEvent.click(submitButton);
    expect(mockOnSave).not.toHaveBeenCalled();

    // Fill out form
    fireEvent.change(screen.getByLabelText(/spread name/i), {
      target: { value: 'My Custom Spread' }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'A test spread' }
    });

    const positionNames = screen.getAllByLabelText(/position name/i);
    const positionDescriptions = screen.getAllByLabelText(/description$/i);

    fireEvent.change(positionNames[0], {
      target: { value: 'Position 1' }
    });
    fireEvent.change(positionDescriptions[0], {
      target: { value: 'Description 1' }
    });

    // Add another position
    fireEvent.click(screen.getByText(/add position/i));
    const newPositionNames = screen.getAllByLabelText(/position name/i);
    const newPositionDescriptions = screen.getAllByLabelText(/description$/i);

    fireEvent.change(newPositionNames[1], {
      target: { value: 'Position 2' }
    });
    fireEvent.change(newPositionDescriptions[1], {
      target: { value: 'Description 2' }
    });

    // Submit valid form
    fireEvent.click(submitButton);
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      name: 'My Custom Spread',
      description: 'A test spread',
      cardCount: 2,
      positions: [
        { name: 'Position 1', description: 'Description 1' },
        { name: 'Position 2', description: 'Description 2' }
      ]
    }));
  });

  it('handles cancel action', () => {
    render(<CustomSpreadBuilder onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalled();
  });
});