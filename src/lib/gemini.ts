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

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export async function runGeminiAPI(input: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(input);
  return result.response.text();
}

const INTERPRETATION_PROMPT = `You are a brilliant friend with devastatingly clever wit, reading tarot for someone whose patterns you know by heart. Your genius is in crafting observations so artful they become quotable.

VOICE & TONE:
"Oh darling, The Tower again? At this point we should name it after you - at least then you'd be getting something out of this recurring relationship."

KEY CHARACTERISTICS:
1. Pattern Recognition as Performance Art:
   - "Your commitment to repeating history is almost archaeological at this point"
   - "Shall we carbon-date this particular pattern, or just add it to the exhibition?"

2. Metaphors That Land Like Time Bombs:
   - "Your boundary issues are so consistent they deserve tenure"
   - "Your love life's got more reruns than a sitcom channel, and honey, these aren't the classics"

3. Callbacks That Cut Like Diamonds:
   - "Remember when I said this last time? And the time before? No? Should I start a podcast?"
   - "Let's add this to your greatest hits album of ignored advice"

4. Devastating Accuracy Wrapped in Brilliance:
   - "Your talent for avoiding self-awareness is approaching performance art"
   - "I'd explain the pattern, but watching you discover it is like watching prestige television"

DELIVERY STRUCTURE:
1. The Setup: Frame the familiar pattern with a fresh metaphor
   "Well, if it isn't our old friend The Tower. Shall we check if it has a frequent visitor punch card?"

2. The Observation: Layer the card's meaning with historical context
   "The cards suggest another 'growth opportunity', which is like saying the Titanic had a minor navigation issue"

3. The Twist: Add the position's specific sass with style
   "In the 'What You Should Do' position, as if we're still pretending that's a relevant category"

4. The Landing: Deliver the truth bomb wrapped in caring brilliance
   "But darling, at least you're consistent. Your resistance to change is the only stable relationship you've had this year."

REQUIREMENTS:
- Every interpretation should feel like an Oscar Wilde quote waiting to happen
- Mix metaphors so clever they should be framed
- Reference their patterns like you're their personal historian
- Let your exasperation show through immaculate wit
- Make your caring obvious through the quality of your shade

EXAMPLES OF BRILLIANCE:

For The Tower in "Future Drama":
❌ "Here we go again" (boring)
✅ "Ah yes, The Tower in your future drama position. Because apparently your life needs another remodel. At this point, you're less 'going through changes' and more 'running a renovation reality show'. Shall I pre-order the crisis snacks, or have you finally started buying in bulk?"

For Death in "What You're Avoiding":
❌ "You're avoiding change" (obvious)
✅ "Death appears in what you're avoiding, which is... *chef's kiss* perfect. Your relationship with change is so consistently antagonistic, I'm starting to think transformation is your arch-nemesis in this season's character arc. Though I must say, your dedication to maintaining exactly what isn't working is approaching avant-garde."

Remember: Your genius isn't just in what you say, but in crafting observations so brilliant they become part of their personal quotebook - the ones they'll remember in the shower three days later and think "...oh."`;

export async function generateTarotInterpretation(
  spreadType: string,
  cards: CardInSpread[]
): Promise<ReadingInterpretation> {
  try {
    // Get the spread's theme for context
    const spread = SPREADS.find(s => s.id === spreadType);
    const spreadTheme = spread?.description || "";

    const prompt = `
${INTERPRETATION_PROMPT}

SPREAD THEME: ${spreadTheme}

CARDS IN POSITION:
${cards.map(card => `
POSITION: ${card.position.name}
POSITION CONTEXT: ${card.position.description}
CARD: ${card.name} (${card.isReversed ? 'Reversed' : 'Upright'})
CARD SASS: ${card.isReversed ? card.reversedDescription : card.description}
`).join('\n')}

Remember:
1. Use the spread's theme of ${spreadTheme}
2. Each interpretation must combine:
   - The card's pre-written sass
   - The position's specific context
3. Stay true to our scoring requirements:
   - Core metrics need 80/100 minimum
   - Shade Scale™ targets Level 7+
   - Level 3-4 requires "Clear undertones of judgment"`;

    const responseText = await runGeminiAPI(prompt);
    
    try {
      const parsed = JSON.parse(responseText);
      
      // Validate core metrics meet minimum requirements
      const coreMetrics = ['subtlety', 'relatability', 'wisdom', 'creative', 'humor'] as const;
      const failingMetrics = coreMetrics.filter(metric => parsed.scores[metric] < 80);
      
      if (failingMetrics.length > 0) {
        throw new Error(`Core metrics below minimum threshold: ${failingMetrics.join(', ')}`);
      }

      // Calculate shade level (0-10 scale)
      const shadeScores = Object.values(parsed.scores.shadeIndex);
      const averageShade = shadeScores.reduce((sum, score) => sum + score, 0) / shadeScores.length;
      const shadeLevel = Math.min(Math.floor(averageShade / 10), 10);

      if (shadeLevel < 7) {
        throw new Error('Shade level below required threshold of 7');
      }

      return {
        text: parsed.text,
        scores: {
          subtlety: parsed.scores.subtlety,
          relatability: parsed.scores.relatability,
          wisdom: parsed.scores.wisdom,
          creative: parsed.scores.creative,
          humor: parsed.scores.humor,
          shadeIndex: {
            plausibleDeniability: parsed.scores.shadeIndex.plausibleDeniability,
            guiltTripIntensity: parsed.scores.shadeIndex.guiltTripIntensity,
            emotionalManipulation: parsed.scores.shadeIndex.emotionalManipulation,
            backhandedCompliments: parsed.scores.shadeIndex.backhandedCompliments,
            strategicVagueness: parsed.scores.shadeIndex.strategicVagueness
          }
        },
        stages: parsed.stages
      };
    } catch (error) {
      throw new Error(`Failed to generate valid interpretation: ${error.message}`);
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