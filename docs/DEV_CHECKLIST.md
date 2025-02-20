# Developer's Quick Check
Last Updated: 2024-01-14

## Before Starting a Task
- [ ] Check TEST_STATUS.md for related issues
- [ ] Review BLOCKERS.md for dependencies
- [ ] Verify no partial implementations exist
- [ ] Plan test coverage approach

## During Implementation
- [ ] Write tests first
- [ ] Keep components small and focused
- [ ] Add loading states for async ops
- [ ] Include error boundaries
- [ ] Document edge cases

## Before Committing
- [ ] Run test suite
- [ ] Check TypeScript errors
- [ ] Verify 85%+ coverage
- [ ] Test loading states
- [ ] Test error states
- [ ] Check performance impact

## After Deployment
- [ ] Monitor error rates
- [ ] Watch performance metrics
- [ ] Review user feedback
- [ ] Update documentation

## Red Flags
- Incomplete features
- Missing tests
- Any type usage
- Direct DOM manipulation
- Prop drilling
- Missing error handling
- Unclear loading states

This checklist auto-updates based on system validation results