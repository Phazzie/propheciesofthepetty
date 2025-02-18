/**
 * Google Gemini AI integration for tarot interpretations
 * @module lib/gemini
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ReadingInterpretation, CardInSpread } from '../types';
import { SHADE_LEVELS } from './ShadeLevels';
import { CORE_METRICS, PASSING_THRESHOLD } from './ScoringSystem';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
});

// Update the prompt to include our sophisticated scoring requirements
const INTERPRETATION_PROMPT = `You are a brilliantly witty friend reading tarot cards. Your goal is to deliver insights with sophisticated passive-aggressive undertones, emphasizing:

SCORING REQUIREMENTS:
1. Core Metrics (Minimum 80/100 required for each):
${CORE_METRICS.map(metric => `   - ${metric}`).join('\n')}

2. Shade Level™ System:
${Object.entries(SHADE_LEVELS)
  .map(([level, details]) => `   Level ${level}: ${details.title} - ${details.description}`)
  .join('\n')}

SPECIAL EMPHASIS:
- Levels 3-4 (The Pointed Pause): Clear undertones of judgment are required
- Level 7+ required for passing grade
- Maintain plausible deniability while delivering cosmic truth bombs

VOICE EXAMPLES:
❌ "You need to change" (too direct)
✅ "I'm not saying you need to change, but the cards are giving me that look..."

❌ "This is your fault" (too harsh)
✅ "Interesting how this pattern keeps showing up in your readings... universe must really want you to notice something."

FORMAT YOUR RESPONSE AS JSON:
{
  "text": "Your interpretation here...",
  "scores": {
    // Core metrics
    "subtlety": 0-100,
    "relatability": 0-100,
    "wisdom": 0-100,
    "creative": 0-100,
    "humor": 0-100,
    
    // Additional metrics
    "snark": 0-100,
    "culturalResonance": 0-60,
    "metaphorMastery": 0-60,
    
    // Shade components
    "shadeIndex": {
      "plausibleDeniability": 0-100,
      "guiltTripIntensity": 0-100,
      "emotionalManipulation": 0-100,
      "backhandedCompliments": 0-100,
      "strategicVagueness": 0-100
    }
  },
  "stages": {
    "denial": "Initial reaction",
    "anger": "Second thoughts",
    "bargaining": "Attempting to negotiate",
    "depression": "Accepting the shade",
    "acceptance": "Finding the humor"
  }
}`;

export async function runGeminiAPI(input: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(input);
  return result.response.text();
}

export async function generateTarotInterpretation(
  spreadType: string,
  cards: CardInSpread[]
): Promise<ReadingInterpretation> {
  try {
    // Get spread's theme for context
    const cardPositions = cards.map(card => `
POSITION: ${card.position.name}
POSITION CONTEXT: ${card.position.description}
CARD: ${card.name} (${card.isReversed ? 'Reversed' : 'Upright'})
CARD MEANING: ${card.isReversed ? card.reversedDescription : card.description}
`).join('\n');

    const prompt = `
${INTERPRETATION_PROMPT}

SPREAD TYPE: ${spreadType}

CARDS IN READING:
${cardPositions}

Remember:
1. Maintain consistent shade level throughout
2. Each response must score at least ${PASSING_THRESHOLD}/100 in core metrics
3. Achieve minimum Level 3-4 in undertones
4. Wrap brutal honesty in elegant delivery
5. Make them laugh while they learn
`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    try {
      const parsed = JSON.parse(response);
      return {
        text: parsed.text,
        scores: parsed.scores
      };
    } catch (error) {
      throw new Error(`Failed to parse valid interpretation: ${error.message}`);
    }
  } catch (error) {
    throw new Error(`Interpretation generation failed: ${error.message}`);
  }
}

export async function testGeminiTarotKnowledge(): Promise<string> {
  try {
    const prompt = `Demonstrate your knowledge of tarot by explaining:
1. The difference between Major and Minor Arcana
2. Three common tarot spreads and their purposes
3. How reversals affect card meanings
4. The significance of the four suits

Format your response in clear paragraphs.`;

    const responseText = await runGeminiAPI(prompt);
    return responseText;
  } catch (error) {
    throw new Error('Failed to test Gemini knowledge');
  }
}