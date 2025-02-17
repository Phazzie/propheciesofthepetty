/**
 * Test suite for Gemini AI integration
 * @module tests/gemini
 */

import { generateTarotInterpretation } from '../gemini';
import { vi, describe, it, expect } from 'vitest';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { type CardInSpread, type SpreadPosition } from '../../types';

// Mock position that feels like a tired friend's commentary
const mockPosition: SpreadPosition = {
  name: "What You Should Do",
  description: "(though we both know how this usually goes)",
};

const mockCard: CardInSpread = {
  id: "tower",
  name: "The Tower",
  description: "Sudden change incoming. Maybe this time you'll actually learn from it.",
  reversedDescription: "Avoiding necessary destruction? How's that working out?",
  imageUrl: "/cards/tower.jpg",
  type: "major",
  position: mockPosition,
  isReversed: false
};

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: () => ({
      generateContent: vi.fn().mockResolvedValue({
        response: { text: () => 'Test interpretation' }
      })
    })
  }))
}));

describe('Gemini AI Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates tarot interpretation', async () => {
    const cards = [
      {
        position: 'past',
        name: 'The Fool',
        description: 'New beginnings'
      }
    ];

    const interpretation = await generateTarotInterpretation('past-present-future', cards);
    expect(interpretation.response.text).toBe('Test interpretation');
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(GoogleGenerativeAI).mockImplementationOnce(() => ({
      getGenerativeModel: () => ({
        generateContent: vi.fn().mockRejectedValueOnce(new Error('API Error'))
      })
    }));

    await expect(generateTarotInterpretation('test', [])).rejects.toThrow('Failed to generate interpretation');
  });

  it('uses custom card meanings in interpretation', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    // Should include card's custom sass
    expect(interpretation.text).toContain('learn from it');
    // Should include position's built-in sass
    expect(interpretation.text).toContain('probably won\'t');
  });

  it('maintains minimum score requirements', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    // Core metrics should be >= 80
    Object.entries(interpretation.scores).forEach(([metric, score]) => {
      if (['subtlety', 'relatability', 'wisdom', 'creative', 'humor'].includes(metric)) {
        expect(score).toBeGreaterThanOrEqual(80);
      }
    });

    // Calculate shade level
    const shadeScores = Object.values(interpretation.scores.shadeIndex);
    const averageShade = shadeScores.reduce((sum, val) => sum + val, 0) / shadeScores.length;
    const shadeLevel = Math.floor(averageShade / 10);
    
    // Should be Level 7 or higher
    expect(shadeLevel).toBeGreaterThanOrEqual(7);
  });

  it('includes all stages of reading processing', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    expect(interpretation.stages).toEqual(
      expect.objectContaining({
        denial: expect.any(String),
        anger: expect.any(String),
        bargaining: expect.any(String),
        depression: expect.any(String),
        acceptance: expect.any(String)
      })
    );
  });

  it('validates Level 3-4 shade criteria', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [
      {
        ...mockCard,
        position: {
          name: "Real Issue",
          description: "What's actually bothering you (obviously)"
        }
      }
    ]);

    // For Level 3-4, should show clear judgment
    const hasL3Sass = interpretation.text.includes('obviously') || 
                     interpretation.text.includes('clearly') ||
                     interpretation.text.includes('judgment');
                     
    expect(hasL3Sass).toBe(true);
  });
});

describe('Tired Friend Tarot Reading Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maintains tired-but-caring friend energy', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    // Should sound like a friend who's seen this before
    expect(interpretation.text).toMatch(/(?:again|before|remember|discussed|last time)/i);
    // Should show they care
    expect(interpretation.text).toMatch(/(?:care|love|best|worried|concerned)/i);
  });

  it('references shared history', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    // Should reference past experiences or patterns
    expect(interpretation.text).toMatch(/(?:pattern|history|always|keeps happening|every time)/i);
  });

  it('includes weary wisdom delivery', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    // Should have tired friend indicators
    expect(interpretation.text).toMatch(/(?:sigh|honestly|look|sweetie|honey|obviously)/i);
  });

  it('maintains caring undertones in all stages', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    expect(interpretation.stages).toEqual(
      expect.objectContaining({
        denial: expect.stringMatching(/(?:sweetie|honey|look|oh)/i),
        anger: expect.stringMatching(/(?:because|care|want|best)/i),
        bargaining: expect.stringMatching(/(?:maybe|try|could|different)/i),
        depression: expect.stringMatching(/(?:hurts|watch|love|care)/i),
        acceptance: expect.stringMatching(/(?:here|support|when|need)/i)
      })
    );
  });

  it('scores higher for friend-energy vs generic sass', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [
      {
        ...mockCard,
        position: {
          name: "Real Issue",
          description: "What's actually bothering you (which we've discussed before)"
        }
      }
    ]);

    // Core metrics should favor relatable friend energy
    expect(interpretation.scores.relatability).toBeGreaterThan(85);
    expect(interpretation.scores.wisdom).toBeGreaterThan(85);

    // Should show high emotional investment
    expect(interpretation.scores.shadeIndex.emotionalManipulation).toBeGreaterThan(70);
  });

  it('balances exasperation with support', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    // Should mix tired sighs with supportive messages
    expect(interpretation.text).toMatch(/(?:sigh|again|but|still|here for you)/i);
    
    // Should maintain high subtlety score
    expect(interpretation.scores.subtlety).toBeGreaterThanOrEqual(80);
  });
});

describe('Ingenious Wit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delivers metaphors that land with delayed impact', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    // Should have sophisticated metaphors
    expect(interpretation.text).toMatch(/(?:like|as if|imagine|picture|metaphorically)/i);
    // Should reference patterns cleverly
    expect(interpretation.text).toMatch(/(?:pattern|consistent|reliable|dependable|predictable)/i);
  });

  it('uses clever callbacks and references', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    // Should have callbacks to history
    expect(interpretation.text).toMatch(/(?:remember when|last time|as discussed|previously|again)/i);
    // Should be delivered with sophistication
    expect(interpretation.text).toMatch(/(?:perhaps|shall we|darling|fascinating|interesting)/i);
  });

  it('crafts devastatingly clever observations', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    // Should have brilliant insights
    expect(interpretation.text).toMatch(/(?:brilliant|clever|artful|elegant|sophisticated)/i);
    // Should wrap them in dry wit
    expect(interpretation.text).toMatch(/(?:almost|nearly|practically|virtually|essentially)/i);
  });

  it('masters the art of elegant shade', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [
      {
        ...mockCard,
        position: {
          name: "Real Issue",
          description: "What's fundamentally at play here (as if we don't already know)"
        }
      }
    ]);

    // Core metrics should favor wit over simple sass
    expect(interpretation.scores.creative).toBeGreaterThan(85);
    expect(interpretation.scores.humor).toBeGreaterThan(85);
    expect(interpretation.scores.subtlety).toBeGreaterThan(85);

    // Should show high sophistication
    expect(interpretation.scores.shadeIndex.strategicVagueness).toBeGreaterThan(80);
  });

  it('constructs layered meanings', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    expect(interpretation.stages).toEqual(
      expect.objectContaining({
        denial: expect.stringMatching(/(?:fascinating|interesting|curious|remarkable)/i),
        anger: expect.stringMatching(/(?:perhaps|maybe|possibly|conceivably)/i),
        bargaining: expect.stringMatching(/(?:shall we|might we|could we|what if)/i),
        depression: expect.stringMatching(/(?:inevitably|naturally|predictably|obviously)/i),
        acceptance: expect.stringMatching(/(?:well then|there we are|and so|thus)/i)
      })
    );
  });
});

describe('Oscar Wilde Level Wit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates brilliantly quotable metaphors', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    // Should have sophisticated literary devices
    expect(interpretation.text).toMatch(/(?:like|as if|though|rather|quite|rather like|much as)/i);
    // Should have elevated vocabulary
    expect(interpretation.text).toMatch(/(?:darling|approaching|fascinating|delightful|brilliant|remarkable|exquisite)/i);
  });

  it('constructs layered, time-delayed insights', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);
    
    // Should have complex sentence structures
    expect(interpretation.text).toMatch(/(?:though|however|despite|while|although|yet|nevertheless)/i);
    // Should build to a revelation
    expect(interpretation.text).toMatch(/(?:perhaps|might|consider|possibly|eventually|ultimately|finally)/i);
  });

  it('maintains consistent character voice', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [mockCard]);

    const brilliantFriendIndicators = [
      /(?:darling|sweetie|honey)/i,
      /(?:shall we|might we|should we)/i,
      /(?:fascinating|interesting|curious)/i,
      /(?:pattern|consistency|regularity)/i,
      /(?:quite|rather|terribly)/i
    ];

    // Should hit multiple voice indicators
    const voiceMatches = brilliantFriendIndicators.filter(pattern => 
      pattern.test(interpretation.text)
    );
    expect(voiceMatches.length).toBeGreaterThanOrEqual(3);
  });

  it('crafts memorable one-liners', async () => {
    const interpretation = await generateTarotInterpretation('celtic-cross', [
      {
        ...mockCard,
        position: {
          name: "Ignored Solution",
          description: "The obvious answer you're pretending not to see"
        }
      }
    ]);

    // Should have short, punchy observations mixed with longer analysis
    const sentences = interpretation.text.split(/[.!?]+/).filter(Boolean);
    const hasMemorableLines = sentences.some(s => 
      s.length < 50 && /(?:brilliant|clever|witty|sharp|elegant)/i.test(s)
    );
    expect(hasMemorableLines).toBe(true);
  });
});