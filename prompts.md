# Passive-Aggressive Tarot - Development Prompts

## Frontend Development Sequence

### Authentication & User Management
1. "Implement the login form component with email/password fields, form validation, error handling, and loading states. Include 'Forgot Password' link and 'Remember Me' checkbox."

2. "Create the registration form with email, password, password confirmation, and terms acceptance. Add strong password requirements and real-time validation feedback."

3. "Build the forgot password flow with email submission form and reset password functionality. Include email validation and success/error states."

4. "Develop the user profile page showing account details, subscription status, and reading history. Add the ability to update profile information and manage notification preferences."

### Tarot Reading Interface
5. "Create the card deck interface with a grid of face-down cards. Implement smooth flip animations and ensure responsive layout across all screen sizes."

6. "Build the reading spread selector component allowing users to choose between different spread types (3-card, Celtic Cross, etc.). Include visual previews of each spread layout."

7. "Implement the reading interpretation view showing selected cards with their positions, meanings, and overall reading interpretation. Add the ability to save readings and share them."

8. "Create the reading history view with filtering options (date, spread type) and the ability to revisit past readings. Include pagination and sorting functionality."

### Subscription Management
9. "Build the subscription plans comparison page showcasing different tiers with features and pricing. Include interactive tooltips explaining each feature."

10. "Implement the subscription checkout flow with plan selection, payment form, and confirmation. Add clear pricing information and subscription terms."

### Admin Interface
11. "Create the admin dashboard layout with navigation, overview statistics, and recent activity. Include user management and content moderation tools."

12. "Build the card management interface for admins to edit card descriptions, images, and interpretations. Include preview functionality and version history."

## Backend Development Sequence

### API Development
13. "Set up the Express.js server with middleware configuration, error handling, and logging. Include rate limiting and security headers."

14. "Implement the authentication API endpoints (register, login, password reset) with JWT token management and refresh token rotation."

15. "Create the readings API with endpoints for drawing cards, saving readings, and retrieving reading history. Include proper validation and authorization."

16. "Build the subscription management API with endpoints for creating, updating, and canceling subscriptions. Integrate with the payment processor."

### Database & Models
17. "Set up the database schema with models for users, readings, cards, and subscriptions. Include proper indexing and relationships."

18. "Implement data access layer with repositories pattern for clean separation of concerns. Add caching strategy for frequently accessed data."

## Testing & Documentation
19. "Set up the testing environment with Jest and React Testing Library. Create test suites for critical components and user flows."

20. "Create comprehensive API documentation with OpenAPI/Swagger. Include request/response examples and authentication details."

## Questions to be Answered
- [ ] What level of AI integration do we want for card interpretations?
- [ ] Should we implement a queuing system for background jobs?
- [ ] Do we need to support multiple payment providers?
- [ ] What analytics metrics are most important to track?
- [ ] Should we implement a recommendation system for readings?
- [ ] What level of customization should we allow for reading spreads?
- [ ] How should we handle user data exports and account deletion?
- [ ] What backup and disaster recovery strategies should we implement?

## Implementation Notes
- Each prompt should be completed sequentially for the most efficient development flow
- Components should be built with reusability in mind
- All features should have proper error handling and loading states
- Maintain consistent styling and UX patterns throughout
- Follow accessibility best practices
- Implement proper TypeScript types for all components and functions
- Add comprehensive comments and documentation
- Include unit tests for all new features

## Current Focus
We are currently in the initial frontend phase. The next prompt to implement would be:

"Implement the login form component with email/password fields, form validation, error handling, and loading states. Include 'Forgot Password' link and 'Remember Me' checkbox."

This will build upon our existing authentication context and lay the groundwork for user management.