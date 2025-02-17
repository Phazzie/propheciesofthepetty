# Scoring System Inconsistencies

## Core Metrics Range Inconsistency
- **Issue**: Core metrics use 1-10 scale while other metrics use varying ranges (0-140, 0-60)
- **Impact**: Makes comparison and modification difficult, obscures true weighting
- **Status**: RESOLVED
- **Resolution**: Converted all metrics to 0-100 base scale with explicit multipliers for weighting

## Shade Level Calculation
- **Issue**: Inconsistent calculation method and unclear level boundaries
- **Impact**: Makes it difficult to assess and validate shade levels
- **Status**: RESOLVED
- **Resolution**: 
  - Implemented weighted scoring system (15-25% weights per category)
  - Clear level boundaries with descriptive messages
  - Standardized modifier application

## Special Conditions System
- **Issue**: Unclear implementation and activation criteria
- **Impact**: Inconsistent bonus application
- **Status**: RESOLVED
- **Resolution**: 
  - Implemented structured condition system with IDs
  - Added clear activation criteria
  - Integrated with spread modifiers
  - Added three base conditions (Shadow Maestro, Balanced Blade, Zeitgeist Whisperer)

## Spread Modifiers
- **Issue**: Inconsistent application across different scoring components
- **Impact**: Some scores may not properly reflect spread-specific bonuses
- **Status**: RESOLVED
- **Resolution**: 
  - Standardized modifier structure for all spreads
  - Added base multipliers
  - Category-specific multipliers
  - Special condition thresholds
  - Thematic bonus integration

## Score Weighting System
- **Issue**: Non-standard score ranges (0-140, 0-60) used for weighting
- **Impact**: Makes the system harder to understand and maintain
- **Status**: RESOLVED
- **Resolution**: 
  - All base scores now use 0-100 scale
  - Weights applied through explicit multipliers
  - Spread-specific modifiers clearly defined

## Score Range Documentation
- **Issue**: Inconsistent documentation of score ranges and thresholds
- **Impact**: Makes it difficult to understand scoring requirements
- **Status**: RESOLVED
- **Resolution**: 
  - Added clear documentation in types
  - Standardized comments and descriptions
  - Explicit threshold definitions in spread modifiers

## Thematic Consistency Review
- **Issue**: Special condition names and descriptions not consistently passive-aggressive
- **Impact**: Breaks immersion and tone of the application
- **Status**: RESOLVED
- **Resolution**: 
  - Replaced achievement names with more thematically appropriate versions:
    - "Sweet Poison Master" (perfect shade achiever)
    - "Velvet Dagger" (balanced brutality)
    - "Tea Spiller Supreme" (social awareness weaponizer)
  - Updated descriptions to match passive-aggressive tone
  - Added tea/shade-related metaphors consistently

## Test Coverage
- **Issue**: Missing tests for new scoring components
- **Impact**: Reliability of scoring system not verified
- **Status**: RESOLVED
- **Resolution**: 
  - Added comprehensive test suite with mock data generators
  - Added test helpers for common test scenarios
  - Included tests for:
    - Special conditions triggers
    - Spread modifier applications
    - Score calculations
    - UI presentation
  - Added data-testid attributes for reliable testing

## Current Status Summary
All major inconsistencies have been addressed. The system now uses:
- Standard 0-100 base scale for all metrics
- Explicit multipliers for weighting
- Clear special conditions system
- Consistent spread modifier application
- Documented thresholds and requirements

To verify these changes are working correctly, we should:
1. Add unit tests for the new scoring calculations
2. Validate special conditions triggers
3. Test spread modifier applications
4. Review edge cases in shade level calculations

## Next Steps
1. Run the full test suite to verify all changes
2. Add edge case tests for special conditions
3. Consider adding more passive-aggressive achievements
4. Document the achievement system for users