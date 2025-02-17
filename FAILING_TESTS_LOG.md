# Failing Tests Log

## Test Inventory (Updated)

### Auth Components
1. **RegisterForm Tests** (5/8 failing)
   - ❌ renders registration form
   - ❌ validates password requirements
   - ❌ validates password confirmation match
   - ❌ requires terms acceptance
   - ✓ submits form with valid data
   - ✓ shows loading state
   - ✓ displays error message
   - ❌ handles back button click

2. **ForgotPasswordForm Tests** (2/5 failing)
   - ✓ renders the form
   - ❌ handles back button click
   - ❌ submits the form and shows success message
   - ✓ shows loading state during submission
   - ✓ displays error message when request fails

3. **LoginForm Tests** (6/6 failing)
   - ❌ renders login form
   - ❌ toggles password visibility
   - ❌ switches to register form
   - ❌ validates email format
   - ❌ validates password length
   - ❌ submits form with valid data

### Reading Components
4. **ReadingInterface Tests** (4/4 failing)
   - ❌ renders spread selection initially
   - ❌ shows card selection after spread choice
   - ❌ displays loading state during interpretation
   - ❌ shows error message on failure

5. **SpreadLayout Tests** (2/4 failing)
   - ❌ renders past-present-future spread correctly
   - ✓ handles celtic cross spread layout
   - ❌ shows placeholder for empty positions
   - ✓ displays reversed cards correctly

6. **SpreadSelector Tests** (1/1 failing)
   - ❌ selects a spread

### Loading Components
7. **LoadingSpinner Tests** (1/5 failing)
   - ✓ renders with default props
   - ✓ renders custom message
   - ❌ rotates through shade messages
   - ✓ respects size prop
   - ✓ can be left-aligned

### Context Tests
8. **AuthContext Tests** (1/1 failing)
   - ❌ hello world!

### Integration Tests
9. **Gemini AI Integration Tests** (1/2 failing)
   - ❌ generates tarot interpretation
   - ✓ handles API errors gracefully

## Common Issues
1. Module Resolution Issues: Many test failures appear to be related to module resolution problems, particularly in component tests.
2. Context Setup: Several auth-related component tests are failing due to potential context setup issues.
3. Mock Issues: Some tests may be failing due to incomplete or incorrect mocking of dependencies.

## Next Steps
1. Review and fix module resolution configuration
2. Update test setup for auth context components
3. Verify mock implementations for external dependencies
4. Focus on fixing auth component tests first as they have the highest failure rate
