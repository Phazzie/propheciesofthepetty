# Project Roadmap
Last Updated: 2024-01-14

## Highest Impact Tasks

### 1. Test Infrastructure (ETA: 1 week)
- Create central test context provider
- Fix flaky auth tests
- Add missing integration tests
- Impact: Enables faster feature development

### 2. Core Reading System (ETA: 1 week)
- Fix Shade Level™ calculations
- Standardize scoring system (0-100)
- Add missing edge case tests
- Impact: Core feature reliability

### 3. Performance Optimization (ETA: 3 days)
- Add memoization to SpreadSelector
- Implement proper loading states
- Fix unnecessary re-renders
- Impact: Better user experience

## Current Blockers
1. Test Context Issues
   - Blocks: Reliable test suite
   - Solution: Create shared provider

2. Score Standardization
   - Blocks: Accurate readings
   - Solution: Convert to 0-100 scale

## Quick Wins
1. Add test wrapper (1 day)
2. Fix score normalization (1 day)
3. Add loading states (1 day)

## Success Metrics
- Test Coverage: 85%+
- No flaky tests
- All scores normalized
- Performance baseline met

This file auto-updates with commits