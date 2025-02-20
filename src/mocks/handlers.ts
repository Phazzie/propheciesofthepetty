import { http } from 'msw';
import { logger } from '../lib/logger';
import { NetworkError, ValidationError, RateLimitError } from '../lib/errors';

const simulateNetworkConditions = () => {
  if (Math.random() < 0.1) { // 10% chance of network error
    throw new NetworkError('Network connection failed');
  }
  if (Math.random() < 0.05) { // 5% chance of rate limit
    throw new RateLimitError('Too many requests', 5000);
  }
};

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    try {
      simulateNetworkConditions();
      const body = await request.json();

      if (!body.email || !body.password) {
        throw new ValidationError('Email and password are required');
      }

      // Simulate successful login
      return new Response(
        JSON.stringify({
          user: {
            id: 'test-user',
            email: body.email
          },
          token: 'fake-jwt-token'
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      logger.error('Login request failed', error);
      
      if (error instanceof ValidationError) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400 }
        );
      }
      
      if (error instanceof RateLimitError) {
        return new Response(
          JSON.stringify({ 
            message: error.message,
            retryAfter: error.metadata.retryDelay
          }),
          { 
            status: 429,
            headers: {
              'Retry-After': `${error.metadata.retryDelay / 1000}`
            }
          }
        );
      }
      
      if (error instanceof NetworkError) {
        return new Response(
          JSON.stringify({ message: 'Service temporarily unavailable' }),
          { status: 503 }
        );
      }

      return new Response(
        JSON.stringify({ message: 'Internal server error' }),
        { status: 500 }
      );
    }
  }),

  http.post('/api/auth/register', async ({ request }) => {
    try {
      simulateNetworkConditions();
      const body = await request.json();

      if (!body.email || !body.password) {
        throw new ValidationError('Email and password are required');
      }

      return new Response(
        JSON.stringify({
          user: {
            id: 'new-user',
            email: body.email
          },
          token: 'fake-jwt-token'
        }),
        { status: 201 }
      );
    } catch (error) {
      logger.error('Registration request failed', error);
      
      if (error instanceof ValidationError) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400 }
        );
      }
      
      if (error instanceof RateLimitError) {
        return new Response(
          JSON.stringify({ 
            message: error.message,
            retryAfter: error.metadata.retryDelay
          }),
          { 
            status: 429,
            headers: {
              'Retry-After': `${error.metadata.retryDelay / 1000}`
            }
          }
        );
      }

      return new Response(
        JSON.stringify({ message: 'Internal server error' }),
        { status: 500 }
      );
    }
  }),

  http.post('/api/auth/reset-password', async ({ request }) => {
    try {
      simulateNetworkConditions();
      const body = await request.json();

      if (!body.email) {
        throw new ValidationError('Email is required');
      }

      return new Response(
        JSON.stringify({ 
          message: 'Password reset email sent' 
        }),
        { status: 200 }
      );
    } catch (error) {
      logger.error('Password reset request failed', error);
      
      if (error instanceof ValidationError) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400 }
        );
      }
      
      if (error instanceof RateLimitError) {
        return new Response(
          JSON.stringify({ 
            message: error.message,
            retryAfter: error.metadata.retryDelay
          }),
          { 
            status: 429,
            headers: {
              'Retry-After': `${error.metadata.retryDelay / 1000}`
            }
          }
        );
      }

      return new Response(
        JSON.stringify({ message: 'Internal server error' }),
        { status: 500 }
      );
    }
  }),

  http.get('/api/readings', async ({ request }) => {
    try {
      simulateNetworkConditions();
      
      return new Response(
        JSON.stringify([
          {
            id: '1',
            spreadType: 'celtic-cross',
            createdAt: '2024-01-15T12:00:00Z',
            cards: []
          }
        ]),
        { status: 200 }
      );
    } catch (error) {
      logger.error('Readings request failed', error);
      
      if (error instanceof RateLimitError) {
        return new Response(
          JSON.stringify({ 
            message: error.message,
            retryAfter: error.metadata.retryDelay
          }),
          { 
            status: 429,
            headers: {
              'Retry-After': `${error.metadata.retryDelay / 1000}`
            }
          }
        );
      }

      if (error instanceof NetworkError) {
        return new Response(
          JSON.stringify({ message: 'Service temporarily unavailable' }),
          { status: 503 }
        );
      }

      return new Response(
        JSON.stringify({ message: 'Internal server error' }),
        { status: 500 }
      );
    }
  }),

  // Health check endpoint for recovery system
  http.get('/api/health', () => {
    try {
      simulateNetworkConditions();
      return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
    } catch (error) {
      if (error instanceof NetworkError) {
        return new Response(
          JSON.stringify({ message: 'Service unhealthy' }),
          { status: 503 }
        );
      }
      return new Response(
        JSON.stringify({ message: 'Health check failed' }),
        { status: 500 }
      );
    }
  })
];