import React from 'react';
import { SPREAD_MODIFIERS } from './SpreadModifiers';

interface ShadeIndex {
  plausibleDeniability: number;
  guiltTripIntensity: number;
  emotionalManipulation: number;
  backhandedCompliments: number;
  strategicVagueness: number;
}

interface Scores {
  humor: number;
  snark: number;
  culturalResonance: number;
  metaphorMastery: number;
  shadeIndex: ShadeIndex;
}

interface Interpretation {
  scores: Scores;
  stages?: {
    [key: string]: string;
  };
}

interface Props {
  interpretation: Interpretation | null;
  spreadType: SpreadType;
}

export const ReadingScores: React.FC<Props> = ({ interpretation, spreadType }) => {
  if (!interpretation) {
    return <p>No reading data available</p>;
  }

  const { scores, stages } = interpretation;
  const modifiers = SPREAD_MODIFIERS[spreadType];

  const renderScore = (score: number, max: number) => {
    const getScoreColor = (score: number, max: number) => {
      const ratio = score / max;
      if (ratio >= 0.8) return 'bg-green-600';
      if (ratio >= 0.6) return 'bg-yellow-500';
      if (ratio >= 0.4) return 'bg-orange-500';
      return 'bg-red-500';
    };

    return (
      <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${getScoreColor(score, max)}`}
          style={{ width: `${(score / max) * 100}%` }}
        />
      </div>
    );
  };

  const applySpreadModifiers = (baseScore: number, category: keyof ShadeIndex): number => {
    if (!modifiers) return baseScore;
    
    const multiplier = modifiers.shadeMultipliers[category] || 1;
    let modifiedScore = baseScore * multiplier;
    
    // Apply thematic bonus if exists
    if (modifiers.thematicBonus) {
      modifiedScore += modifiers.thematicBonus;
    }
    
    return Math.min(modifiedScore, 100); // Cap at 100
  };

  const getActiveSpecialConditions = (): Array<{name: string, description: string}> => {
    if (!modifiers?.specialConditions) return [];
    
    return modifiers.specialConditions.filter(condition => {
      const totalScore = Object.values(scores.shadeIndex).reduce((sum, score) => sum + score, 0);
      return totalScore / 5 >= 85; // Activate special conditions on high performance
    });
  };

  const calculateShadeLevel = (shadeIndex: ShadeIndex) => {
    // Apply modifiers to each component
    const modifiedIndex = {
      plausibleDeniability: applySpreadModifiers(shadeIndex.plausibleDeniability, 'plausibleDeniability'),
      guiltTripIntensity: applySpreadModifiers(shadeIndex.guiltTripIntensity, 'guiltTripIntensity'),
      emotionalManipulation: applySpreadModifiers(shadeIndex.emotionalManipulation, 'emotionalManipulation'),
      backhandedCompliments: applySpreadModifiers(shadeIndex.backhandedCompliments, 'backhandedCompliments'),
      strategicVagueness: applySpreadModifiers(shadeIndex.strategicVagueness, 'strategicVagueness')
    };

    // If all indices are high, display "Maximum Shade"
    if (
      modifiedIndex.plausibleDeniability >= 90 &&
      modifiedIndex.guiltTripIntensity >= 90 &&
      modifiedIndex.emotionalManipulation >= 90 &&
      modifiedIndex.backhandedCompliments >= 90 &&
      modifiedIndex.strategicVagueness >= 90
    ) {
      return 'Maximum Shade';
    }
    // Otherwise, compute a simplified score (for demo purposes)
    const score =
      (modifiedIndex.plausibleDeniability +
        modifiedIndex.guiltTripIntensity +
        modifiedIndex.emotionalManipulation +
        modifiedIndex.backhandedCompliments +
        modifiedIndex.strategicVagueness) /
      50;
    return `${Math.round(score)}/10`;
  };

  const getShadeLevelMessage = (level: number) => {
    if (level >= 9) return "Your words cut deeper than a June birthday party no-show";
    if (level >= 7) return "Weaponized politeness at its finest, dear";
    if (level >= 5) return "Getting there, but your tea needs more spill";
    if (level >= 3) return "The judgment is clear... clearly needs work";
    return "Honey, even a rubber band has more snap than this";
  };

  const getDetailedMetricBreakdown = (metric: string, score: number) => {
    const breakdowns: Record<string, { levels: Array<[number, string]> }> = {
      Humor: {
        levels: [
          [30, "Basic shade, needs more sparkle"],
          [70, "The wit is starting to show"],
          [100, "Serving looks and laughs"],
          [140, "Your shade has its own gravitational pull"]
        ]
      },
      Snark: {
        levels: [
          [25, "More rubber duck than snake"],
          [50, "The venom is diluted, darling"],
          [75, "Now you're getting venomous"],
          [100, "Cobra-level strike precision"]
        ]
      },
      Cultural: {
        levels: [
          [15, "Very 2019 energy"],
          [30, "At least you're in this decade"],
          [45, "The references are giving current"],
          [60, "Trending topic material"]
        ]
      },
      Metaphor: {
        levels: [
          [15, "Similes are not your friend"],
          [30, "The analogies are... trying"],
          [45, "These comparisons? Tea."],
          [60, "Metaphors so sharp they need a warning label"]
        ]
      }
    };

    const breakdown = breakdowns[metric];
    if (!breakdown) return null;

    const sorted = [...breakdown.levels].sort((a, b) => b[0] - a[0]);
    const level = sorted.find(([threshold]) => score >= threshold);
    return level ? level[1] : "Oh honey...";
  };

  const getMetricImportanceClass = (metric: string) => {
    const importanceMap: Record<string, string> = {
      Humor: "border-l-4 border-purple-400",
      Snark: "border-l-2 border-purple-300",
      Cultural: "border-l border-purple-200",
      Metaphor: "border-l border-purple-200"
    };
    return importanceMap[metric] || "";
  };

  const renderDetailedScore = (metric: string, score: number, maxScore: number) => {
    const isHighPriority = ["Humor", "Snark"].includes(metric);

    return (
      <div className={`p-3 ${getMetricImportanceClass(metric)} bg-white/50 rounded-r-lg`}>
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm font-medium ${isHighPriority ? 'text-purple-900' : 'text-gray-700'}`}>
            {metric}
          </span>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${score >= maxScore * 0.8 ? 'text-green-600' : 'text-purple-600'}`}>
              {score}/{maxScore}
            </span>
            {isHighPriority && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Critical
              </span>
            )}
          </div>
        </div>
        {renderScore(score, maxScore)}
        <div className="text-xs text-gray-500 italic mt-1">
          {getDetailedMetricBreakdown(metric, score)}
        </div>
      </div>
    );
  };

  const isPassing = () => {
    const coreMetricsPassing = [scores.humor, scores.snark, scores.culturalResonance, scores.metaphorMastery]
      .every(score => score >= 8);
    const shadeLevelPassing = calculateShadeLevel(scores.shadeIndex) >= 7;
    return coreMetricsPassing && shadeLevelPassing;
  };

  return (
    <div data-testid="scores-container" className="bg-white dark:bg-gray-800 p-4">
      <h2>Reading Analysis</h2>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-purple-900">Reading Analysis</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isPassing() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isPassing() ? 'Serving Excellence' : 'Needs Work, Darling'}
        </span>
      </div>

      <div className="text-sm text-gray-600 italic space-y-2 border-l-4 border-purple-200 pl-4">
        <div className="text-purple-700">{stages?.denial}</div>
        <div className="text-red-600">{stages?.anger}</div>
        <div className="text-yellow-600">{stages?.bargaining}</div>
        <div className="text-blue-600">{stages?.depression}</div>
        <div className="text-green-600 font-medium">{stages?.acceptance}</div>
      </div>
      
      <section>
        <h3>Primary Metrics</h3>
        <div className="space-y-2">
          {renderDetailedScore("Humor", scores.humor, 140)}
          {renderDetailedScore("Snark", scores.snark, 100)}
        </div>
      </section>

      <section data-testid="passive-aggressive-metrics">
        <h3>Style & Delivery</h3>
        <div className="space-y-2">
          {renderDetailedScore("Cultural", scores.culturalResonance, 60)}
          {renderDetailedScore("Metaphor", scores.metaphorMastery, 60)}
        </div>
      </section>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-semibold text-purple-900">Shade Index™ Analysis</h4>
          <div className="text-right">
            <span className="text-sm font-medium text-purple-600 block">
              Level {calculateShadeLevel(scores.shadeIndex)}/10
            </span>
            <span className="text-xs text-gray-500 italic">
              {getShadeLevelMessage(calculateShadeLevel(scores.shadeIndex))}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          {Object.entries(scores.shadeIndex).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {key.split(/(?=[A-Z])/).join(" ")}
                </span>
                <span className="text-sm text-purple-600">{value}/100</span>
              </div>
              {renderScore(value, 100)}
            </div>
          ))}
        </div>
      </div>

      <p data-testid="sass-level">
        {calculateShadeLevel(scores.shadeIndex)}
      </p>

      <div className="text-xs text-gray-500 mt-2">
        <p className="font-medium mb-2">Scoring Guidelines:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>• Core metrics require minimum 8/10 for passing</li>
          <li>• Shade Scale™ requires minimum Level 7</li>
          <li>• Humor must exceed Snark (Current ratio: {(scores.humor / scores.snark).toFixed(2)})</li>
          <li>• Cultural references must be current (Relevance score: {scores.culturalResonance}/60)</li>
          <li>• Metaphors should be both clever and cutting (Impact score: {scores.metaphorMastery}/60)</li>
        </ul>
        <p className="mt-2 italic text-purple-600">
          "Remember darling, we're not here to destroy souls, just to gently bruise egos."
        </p>
      </div>

      {getActiveSpecialConditions().length > 0 && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">Special Achievements</h4>
          <div className="space-y-2">
            {getActiveSpecialConditions().map((condition, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-purple-600">✨</span>
                <div>
                  <p className="text-sm font-medium text-purple-900">{condition.name}</p>
                  <p className="text-xs text-gray-600">{condition.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};