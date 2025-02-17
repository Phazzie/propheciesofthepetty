/**
 * Test suite for Gemini AI integration
 * @module tests/gemini
 */

import { generateTarotInterpretation } from '../gemini';
import { vi, describe, it, expect } from 'vitest';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
});