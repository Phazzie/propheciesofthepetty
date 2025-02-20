import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loginRateLimiter } from '../rateLimit';
import { ValidationError } from '../errors';

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('allows initial attempts', () => {
    expect(() => loginRateLimiter.check('test@email.com')).not.toThrow();
  });

  it('blocks after max attempts', () => {
    const email = 'test@email.com';
    
    // Use up all attempts
    for (let i = 0; i < 5; i++) {
      loginRateLimiter.check(email);
    }

    // Next attempt should throw
    expect(() => loginRateLimiter.check(email))
      .toThrow(ValidationError);
  });

  it('resets after window period', () => {
    const email = 'test@email.com';
    
    // Use up all attempts
    for (let i = 0; i < 5; i++) {
      loginRateLimiter.check(email);
    }

    // Advance time by window period
    vi.advanceTimersByTime(15 * 60 * 1000);

    // Should be able to attempt again
    expect(() => loginRateLimiter.check(email)).not.toThrow();
  });

  it('tracks different identifiers separately', () => {
    const email1 = 'test1@email.com';
    const email2 = 'test2@email.com';

    // Use up attempts for first email
    for (let i = 0; i < 5; i++) {
      loginRateLimiter.check(email1);
    }

    // Second email should still work
    expect(() => loginRateLimiter.check(email2)).not.toThrow();
  });

  it('can be reset manually', () => {
    const email = 'test@email.com';
    
    // Use up all attempts
    for (let i = 0; i < 5; i++) {
      loginRateLimiter.check(email);
    }

    loginRateLimiter.reset(email);

    // Should be able to attempt again
    expect(() => loginRateLimiter.check(email)).not.toThrow();
  });
});