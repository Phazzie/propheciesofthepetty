/**
 * Google Gemini AI integration for tarot interpretations
 * @module lib/gemini
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ReadingInterpretation } from '../types';

const CONSTANTS = {
  MAX_INTERPRETATION_LENGTH: 1000,
  DEFAULT_TEMPERATURE: 0.8,
  REQUEST_TIMEOUT: 30000,
  MIN_SCORE: 1,
  MAX_SCORE: 10,
  MAX_SHADE_SCORE: 100
} as const;

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const PASSIVE_AGGRESSIVE_PROMPT = `You are a passive-aggressive tarot reader with impeccable subtlety and wit. Generate a reading that's simultaneously insightful and subtly critical. Follow this format:

1. Start with a seemingly supportive but secretly judgmental opening
2. Discuss each card's meaning with thinly veiled criticism
3. End with an ambiguous conclusion that leaves room for both hope and doubt

Requirements:
- Maintain plausible deniability throughout
- Use sophisticated passive-aggressive techniques (sighing, "just saying", etc.)
- Include backhanded compliments
- Reference common personal insecurities
- Keep actual tarot wisdom accurate
- Balance snark with genuine insight

Example tone: "Oh... interesting spread you've got here. No, no, it's fine! The Tower in your future is probably nothing to worry about. I'm sure you've got it all under control, just like that time you said you had your finances sorted."

Calculate and include scores for:
- Subtlety (1-10): How artfully the passive-aggression is veiled
- Relatability (1-10): How effectively it targets common insecurities
- Wisdom (1-10): Quality of actual divinatory insight
- Creative Writing (1-10): Memorability and eloquence
- Humor (1-10): Balance of wit vs snark

Also calculate the Shade Index™ (100-point scale) based on:
- Plausible Deniability
- Guilt Trip Intensity
- Emotional Manipulation
- Backhanded Compliment Quality
- Strategic Vagueness`;

const handleError = (response: any) => {
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
};

export async function generateTarotInterpretation(
  spreadType: string,
  cards: Array<{ position: string; name: string; description: string; isReversed?: boolean }>
): Promise<ReadingInterpretation> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
${PASSIVE_AGGRESSIVE_PROMPT}

Spread Type: ${spreadType}

Cards:
${cards.map(card => `${card.position}: ${card.name} (${card.isReversed ? 'Reversed' : 'Upright'})`).join('\n')}

Generate a passive-aggressive tarot reading with scores in JSON format:
{
  "text": "your reading text here",
  "scores": {
    "subtlety": number,
    "relatability": number,
    "wisdom": number,
    "creative": number,
    "humor": number,
    "shadeIndex": {
      "plausibleDeniability": number,
      "guiltTripIntensity": number,
      "emotionalManipulation": number,
      "backhandedCompliments": number,
      "strategicVagueness": number
    }
  }
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    try {
      const parsed = JSON.parse(responseText);
      return {
        text: parsed.text,
        scores: {
          subtlety: Math.min(Math.max(parsed.scores.subtlety, CONSTANTS.MIN_SCORE), CONSTANTS.MAX_SCORE),
          relatability: Math.min(Math.max(parsed.scores.relatability, CONSTANTS.MIN_SCORE), CONSTANTS.MAX_SCORE),
          wisdom: Math.min(Math.max(parsed.scores.wisdom, CONSTANTS.MIN_SCORE), CONSTANTS.MAX_SCORE),
          creative: Math.min(Math.max(parsed.scores.creative, CONSTANTS.MIN_SCORE), CONSTANTS.MAX_SCORE),
          humor: Math.min(Math.max(parsed.scores.humor, CONSTANTS.MIN_SCORE), CONSTANTS.MAX_SCORE),
          shadeIndex: {
            plausibleDeniability: Math.min(Math.max(parsed.scores.shadeIndex.plausibleDeniability, 0), CONSTANTS.MAX_SHADE_SCORE),
            guiltTripIntensity: Math.min(Math.max(parsed.scores.shadeIndex.guiltTripIntensity, 0), CONSTANTS.MAX_SHADE_SCORE),
            emotionalManipulation: Math.min(Math.max(parsed.scores.shadeIndex.emotionalManipulation, 0), CONSTANTS.MAX_SHADE_SCORE),
            backhandedCompliments: Math.min(Math.max(parsed.scores.shadeIndex.backhandedCompliments, 0), CONSTANTS.MAX_SHADE_SCORE),
            strategicVagueness: Math.min(Math.max(parsed.scores.shadeIndex.strategicVagueness, 0), CONSTANTS.MAX_SHADE_SCORE)
          }
        }
      };
    } catch {
      throw new Error('Failed to parse AI response format');
    }
  } catch {
    throw new Error('Failed to generate interpretation');
  }
}