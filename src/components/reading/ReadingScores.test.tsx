import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ReadingScores } from './ReadingScores';
import { mockReadingData } from '../../test/mocks/readingData';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>{ui}</ThemeProvider>
  );
};

describe('ReadingScores Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct theme styles', () => {
    renderWithTheme(<ReadingScores interpretation={mockReadingData} />);
    const container = screen.getByTestId('scores-container');
    expect(container).toHaveClass('bg-white dark:bg-gray-800');
  });

  it('applies correct theme classes', () => {
    renderWithTheme({ interpretation: mockReadingData });
    const container = screen.getByTestId('scores-container');
    expect(container).toHaveClass('dark:bg-gray-800');
  });
});