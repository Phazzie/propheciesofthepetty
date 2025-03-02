import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { ReadingScores } from '../ReadingScores';
import { SpreadType } from '../../../types';
import type { ShadeIndex } from '../../types';

interface ScoreOverrides {
    subtlety?: number;
    relatability?: number;
    wisdom?: number;
    creative?: number;
    humor?: number;
    snark?: number;
    culturalResonance?: number;
    metaphorMastery?: number;
    shadeIndex?: Required<ShadeIndex>;
}

const DEFAULT_SHADE_INDEX: Required<ShadeIndex> = {
    plausibleDeniability: 85,
    guiltTripIntensity: 80,
    emotionalManipulation: 75,
    backhandedCompliments: 90,
    strategicVagueness: 85
};

const createMockScores = (overrides: ScoreOverrides = {}) => {
    const shadeIndex = overrides.shadeIndex || DEFAULT_SHADE_INDEX;
    return {
        subtlety: 85,
        relatability: 85,
        wisdom: 85,
        creative: 85,
        humor: 85,
        snark: 75,
        culturalResonance: 70,
        metaphorMastery: 65,
        shadeIndex,
        ...overrides
    };
};

const createMockInterpretation = (scores = createMockScores()) => ({
    scores,
    text: "Your reading...",
    stages: {
        denial: "Oh, this can't be right...",
        anger: "How dare you say that!",
        bargaining: "Maybe if I look at it differently...",
        depression: "You might have a point...",
        acceptance: "Well, tea has been spilled"
    }
});

interface RenderProps {
    interpretation?: ReturnType<typeof createMockInterpretation>;
    spreadType?: SpreadType;
}

const renderWithTheme = (props: RenderProps = {}) => {
    const defaultProps = {
        interpretation: createMockInterpretation(),
        spreadType: 'classic' as const
    };
    return render(
        <ThemeProvider>
            <ReadingScores {...defaultProps} {...props} />
        </ThemeProvider>
    );
};

describe('ReadingScores Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with correct theme styles', () => {
        renderWithTheme();
        const container = screen.getByTestId('scores-container');
        expect(container).toHaveClass('bg-white dark:bg-gray-800');
    });

    it('applies correct weight multipliers to scores', () => {
        const scores = createMockScores({
            humor: 80,
            snark: 75,
            culturalResonance: 100,
            metaphorMastery: 100
        });
        renderWithTheme({ interpretation: createMockInterpretation(scores) });
        
        // Check weighted scores
        expect(screen.getByText('112/140')).toBeInTheDocument(); // Humor: 80 * 1.4
        expect(screen.getByText('75/100')).toBeInTheDocument();  // Snark: 75 * 1.0
        expect(screen.getByText('60/60')).toBeInTheDocument();   // Cultural: 100 * 0.6
        expect(screen.getByText('60/60')).toBeInTheDocument();   // Metaphor: 100 * 0.6
    });

    it('shows base scores alongside weighted scores', () => {
        const scores = createMockScores({
            humor: 90
        });
        renderWithTheme({ interpretation: createMockInterpretation(scores) });
        
        const humorScore = screen.getByText('126/140');
        expect(humorScore.parentElement).toHaveTextContent('(90/100 base)');
    });

    it('shows passing status when core metrics meet requirements', () => {
        const passingScores = createMockScores({
            subtlety: 90,
            relatability: 85,
            wisdom: 85,
            creative: 85,
            humor: 85,
            shadeIndex: {
                plausibleDeniability: 90,
                guiltTripIntensity: 85,
                emotionalManipulation: 85,
                backhandedCompliments: 90,
                strategicVagueness: 90
            }
        });
        renderWithTheme({ interpretation: createMockInterpretation(passingScores) });
        const status = screen.getByTestId('passing-status');
        expect(status).toHaveTextContent('Serving Excellence');
    });

    it('shows failing status when core metrics are below threshold', () => {
        const failingScores = createMockScores({
            humor: 70, // Below 8/10 threshold
            snark: 65,
            culturalResonance: 40,
            metaphorMastery: 35,
            shadeIndex: {
                plausibleDeniability: 90,
                guiltTripIntensity: 85,
                emotionalManipulation: 85,
                backhandedCompliments: 90,
                strategicVagueness: 90
            }
        });
        renderWithTheme({ interpretation: createMockInterpretation(failingScores) });
        const status = screen.getByTestId('passing-status');
        expect(status).toHaveTextContent('Needs Work, Darling');
    });

    it('shows failing status when shade level is below 7', () => {
        const lowShadeScores = createMockScores({
            shadeIndex: {
                plausibleDeniability: 50,
                guiltTripIntensity: 45,
                emotionalManipulation: 40,
                backhandedCompliments: 55,
                strategicVagueness: 50
            }
        });
        renderWithTheme({ interpretation: createMockInterpretation(lowShadeScores) });
        const status = screen.getByTestId('passing-status');
        expect(status).toHaveTextContent('Needs Work, Darling');
    });

    it('displays correct shade level messages for level 3-4', () => {
        const level4ShadeScores = createMockScores({
            shadeIndex: {
                plausibleDeniability: 40,
                guiltTripIntensity: 45,
                emotionalManipulation: 40,
                backhandedCompliments: 45,
                strategicVagueness: 40
            }
        });
        renderWithTheme({ interpretation: createMockInterpretation(level4ShadeScores) });
        const shadeMessage = screen.getByTestId('shade-message');
        expect(shadeMessage).toHaveTextContent('The passive is there, but the aggressive needs work');
        expect(screen.getByTestId('sass-level')).toHaveTextContent('4');
    });

    it('displays humor and snark metrics with correct scores', () => {
        const scores = createMockScores({
            humor: 95,
            snark: 75
        });
        renderWithTheme({ interpretation: createMockInterpretation(scores) });
        
        const metrics = screen.getByTestId('primary-metrics');
        expect(metrics).toBeInTheDocument();
        
        // Check Humor score
        const humorSection = screen.getByText('Humor').closest('div');
        const humorScore = humorSection?.querySelector('.text-purple-600');
        expect(humorScore).toHaveTextContent('95/140');
        
        // Check Snark score
        const snarkSection = screen.getByText('Snark').closest('div');
        const snarkScore = snarkSection?.querySelector('.text-purple-600');
        expect(snarkScore).toHaveTextContent('75/100');
    });

    it('correctly evaluates passing criteria with 80/100 scale', () => {
        const barelyPassingScores = createMockScores({
            subtlety: 80,
            relatability: 80,
            wisdom: 80,
            creative: 80,
            humor: 80
        });
        renderWithTheme({ interpretation: createMockInterpretation(barelyPassingScores) });
        expect(screen.getByTestId('passing-status')).toHaveTextContent('Serving Excellence');
    });

    it('fails when core metrics are below 80/100', () => {
        const failingScores = createMockScores({
            humor: 79  // Just below threshold
        });
        renderWithTheme({ interpretation: createMockInterpretation(failingScores) });
        expect(screen.getByTestId('passing-status')).toHaveTextContent('Needs Work, Darling');
    });

    it('correctly identifies Level 3-4 shade mastery', () => {
        const level4Scores = createMockScores({
            shadeIndex: {
                plausibleDeniability: 45,
                guiltTripIntensity: 65, // Above 60 threshold for Level 3-4 mastery
                emotionalManipulation: 45,
                backhandedCompliments: 45,
                strategicVagueness: 45
            }
        });
        renderWithTheme({ interpretation: createMockInterpretation(level4Scores) });
        expect(screen.getByTestId('shade-level')).toHaveTextContent('Level 4');
        expect(screen.getByTestId('shade-message')).toHaveTextContent('Clear judgment, darling');
    });

    it('applies Level 3-4 boost when criteria are met', () => {
        const level3BoostScores = createMockScores({
            shadeIndex: {
                plausibleDeniability: 40,
                guiltTripIntensity: 70, // High enough for boost
                emotionalManipulation: 40,
                backhandedCompliments: 40,
                strategicVagueness: 40
            }
        });
        renderWithTheme({ interpretation: createMockInterpretation(level3BoostScores) });
        expect(screen.getByTestId('shade-level')).toHaveTextContent('Level 4'); // Should boost from 3 to 4
    });

    it('displays updated scoring guidelines', () => {
        renderWithTheme({ interpretation: createMockInterpretation() });
        const guidelines = screen.getByText(/Scoring Guidelines:/);
        expect(guidelines.parentElement).toHaveTextContent(/Core metrics require minimum 80\/100/);
        expect(guidelines.parentElement).toHaveTextContent(/Level 3-4: Mastery of clear undertones/);
    });

    it('evaluates passing criteria based on base scores', () => {
        const barelyPassingScores = createMockScores({
            humor: 80,  // Will be weighted to 112, but passing check uses base score
            snark: 80,
            culturalResonance: 80,
            metaphorMastery: 80
        });
        renderWithTheme({ interpretation: createMockInterpretation(barelyPassingScores) });
        expect(screen.getByTestId('passing-status')).toHaveTextContent('Serving Excellence');
    });

    it('fails based on base scores even with high weighted scores', () => {
        const failingScores = createMockScores({
            humor: 79  // Will be weighted to 110.6, but still fails on base score
        });
        renderWithTheme({ interpretation: createMockInterpretation(failingScores) });
        expect(screen.getByTestId('passing-status')).toHaveTextContent('Needs Work, Darling');
    });

    it('validates 8/10 (80/100) minimum passing requirement for core metrics', () => {
        const barelyPassing = createMockInterpretation({
            subtlety: 80,
            relatability: 80,
            wisdom: 80,
            creative: 80,
            humor: 80,
            snark: 0,
            culturalResonance: 0,
            metaphorMastery: 0,
            shadeIndex: DEFAULT_SHADE_INDEX
        });

        renderWithTheme({ interpretation: barelyPassing });
        expect(screen.getByTestId('passing-status')).toHaveTextContent('Serving Excellence');
    });

    it('fails when any core metric is below 80/100', () => {
        const failing = createMockInterpretation({
            humor: 79 // Just below threshold
            ,
            subtlety: 0,
            relatability: 0,
            wisdom: 0,
            creative: 0,
            snark: 0,
            culturalResonance: 0,
            metaphorMastery: 0,
            shadeIndex: DEFAULT_SHADE_INDEX
        });

        renderWithTheme({ interpretation: failing });
        expect(screen.getByTestId('passing-status')).toHaveTextContent('Needs Work, Darling');
    });

    it('validates Level 3-4 Shade Scale criteria (Pointed Pause)', () => {
        const level4Shade = createMockInterpretation({
            shadeIndex: {
                plausibleDeniability: 45,
                guiltTripIntensity: 65, // Above 60 for Level 3-4
                emotionalManipulation: 45,
                backhandedCompliments: 45,
                strategicVagueness: 45
            },
            subtlety: 0,
            relatability: 0,
            wisdom: 0,
            creative: 0,
            humor: 0,
            snark: 0,
            culturalResonance: 0,
            metaphorMastery: 0
        });

        renderWithTheme({ interpretation: level4Shade });
        const message = screen.getByTestId('shade-message');
        expect(message).toHaveTextContent('Clear undertones of judgment');
    });

    it('requires minimum Level 7 Shade Scale for passing', () => {
        const lowShade = createMockInterpretation({
            shadeIndex: {
                plausibleDeniability: 60,
                guiltTripIntensity: 60,
                emotionalManipulation: 60,
                backhandedCompliments: 60,
                strategicVagueness: 60
            },
            subtlety: 0,
            relatability: 0,
            wisdom: 0,
            creative: 0,
            humor: 0,
            snark: 0,
            culturalResonance: 0,
            metaphorMastery: 0
        });

        renderWithTheme({ interpretation: lowShade });
        expect(screen.getByTestId('passing-status')).toHaveTextContent('Needs Work, Darling');
    });

    it('shows all stage messages when provided', () => {
        renderWithTheme();
        expect(screen.getByText('Oh honey...')).toBeInTheDocument();
        expect(screen.getByText('The audacity!')).toBeInTheDocument();
        expect(screen.getByText('But maybe if...')).toBeInTheDocument();
        expect(screen.getByText('You might be right...')).toBeInTheDocument();
        expect(screen.getByText('Well, tea has been spilled')).toBeInTheDocument();
    });

    it('displays correct metric colors based on scores', () => {
        const mixedScores = createMockInterpretation(createMockScores({
            subtlety: 95, // Green
            relatability: 75, // Yellow/Red
            wisdom: 85, // Green
            creative: 65, // Red
            humor: 90 // Green
        }));

        renderWithTheme({ interpretation: mixedScores });
        
        const subtletyScore = screen.getByText('95/100');
        const relatabilityScore = screen.getByText('75/100');
        
        expect(subtletyScore.className).toContain('text-green-600');
        expect(relatabilityScore.className).toContain('text-red-600');
    });
});