# Passive-Aggressive Tarot System Architecture

## Core Development Principles
- Complete all features atomically (no partial implementations)
- Build small, testable, reusable components
- Automate status tracking and validation
- Maintain comprehensive testing coverage
- Document all decisions and changes

## Implementation Rules
### Code Standards
- TypeScript strict mode non-negotiable
- No implicit any types allowed
- No circular dependencies
- No prop drilling (use context/composition)
- Loading states for all async operations

### Testing Requirements
- Every component must have unit tests
- Integration tests for all features
- E2E tests for critical user flows
- Minimum 85% test coverage
- All edge cases must be tested

### Performance Standards
- Memoize expensive operations
- Optimize re-renders (React.memo)
- Monitor and log performance metrics
- Implement proper code splitting
- Cache frequently accessed data

### Error Handling
- Error boundaries around all routes
- Clear user-facing error messages
- Detailed error logging for debugging
- Automatic error reporting
- Recovery mechanisms in place

## Auto-Updated Status Files
1. TEST_STATUS.md:
   - Current test coverage
   - Failed/flaky tests
   - Blocked test cases
   - Weekly progress metrics

2. ROADMAP.md:
   - Highest impact tasks
   - Current blockers
   - Quick wins
   - Success metrics

3. BLOCKERS.md:
   - Technical blockers
   - Partial implementations
   - Dependencies
   - Type safety issues

## Development Workflow
1. Check Status
   - Review TEST_STATUS.md
   - Check BLOCKERS.md
   - Verify ROADMAP.md

2. Select Task
   - Pick highest impact item
   - Verify dependencies
   - Check for blockers

3. Implement
   - Write tests first
   - Implement feature
   - Add error handling
   - Document changes

4. Validate
   - Run test suite
   - Check performance
   - Verify types
   - Update docs

5. Monitor
   - Track performance
   - Watch error rates
   - Update metrics
   - Review coverage

## Automated Validation
- Test runs update status files
- Coverage reports trigger alerts
- Performance monitoring active
- Type checking on save
- Lint rules enforced

## Project-Specific Requirements
### Reading System
- Score normalization (0-100 scale)
- Complete Shade Level™ implementation
- Edge case coverage for all calculations
- Performance optimization for card renders

### Auth System
- Comprehensive integration tests
- Centralized test context
- Mock providers for all tests
- Clear error states

### UI Components
- Consistent loading states
- Error boundary protection
- Accessibility compliance
- Performance monitoring

## Documentation Standards
- Clear inline documentation
- Updated interface definitions
- Comprehensive test docs
- Performance notes
- Architecture decisions

## Success Criteria
1. Technical
   - 85%+ test coverage
   - No flaky tests
   - All scores normalized
   - Type-safe codebase

2. Performance
   - Sub-200ms renders
   - Optimized re-renders
   - Efficient data access
   - Smooth animations

3. Quality
   - No partial features
   - Complete error handling
   - Full documentation
   - Automated validation

The system automatically maintains these standards through:
- Test run monitoring
- Coverage tracking
- Performance metrics
- Status file updates