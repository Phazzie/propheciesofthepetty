import { logger } from './logger';
import { BaseError, NetworkError, RateLimitError } from './errors';
import { CacheSystem } from './cache';

interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay?: number;
  backoffFactor?: number;
  useCache?: boolean;
  cacheTTL?: number;
}

const defaultConfig: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  useCache: true,
  cacheTTL: 5 * 60 * 1000 // 5 minutes
};

export class RecoverySystem {
  private static cache = new CacheSystem();

  static async withRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const fullConfig = { ...defaultConfig, ...config };
    let attempt = 0;
    let delay = fullConfig.initialDelay;
    const cacheKey = operation.toString();

    // Try to get from cache first if using cache
    if (fullConfig.useCache) {
      const cached = await this.cache.get<T>(cacheKey);
      if (cached) {
        logger.debug('Using cached data', { cacheKey });
        return cached;
      }
    }

    while (attempt < fullConfig.maxAttempts) {
      try {
        const result = await operation();
        
        // Cache successful result if using cache
        if (fullConfig.useCache) {
          await this.cache.set(cacheKey, result, fullConfig.cacheTTL);
        }
        
        return result;
      } catch (error) {
        attempt++;
        
        if (attempt === fullConfig.maxAttempts) {
          // On final attempt failure, try to return cached data even if expired
          if (fullConfig.useCache) {
            const cached = await this.cache.get<T>(cacheKey);
            if (cached) {
              logger.warn('Using expired cached data after all retries failed', { cacheKey });
              return cached;
            }
          }
          throw error;
        }

        if (error instanceof RateLimitError) {
          delay = error.metadata.retryDelay || delay;
        } else {
          delay = Math.min(
            delay * (fullConfig.backoffFactor || 2),
            fullConfig.maxDelay || Infinity
          );
        }

        logger.warn(
          `Operation failed, retrying in ${delay}ms`,
          { attempt, error },
          'RecoverySystem',
          'withRetry'
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Max retry attempts reached');
  }

  static async recover(error: BaseError): Promise<void> {
    logger.info(
      'Attempting recovery',
      { errorCode: error.metadata.code, severity: error.metadata.severity },
      'RecoverySystem',
      'recover'
    );

    if (!error.metadata.retry) {
      throw new Error('Error is not recoverable');
    }

    if (error instanceof NetworkError) {
      await this.handleNetworkError(error);
    } else if (error instanceof RateLimitError) {
      await this.handleRateLimitError(error);
    }
  }

  static async clearCache(): Promise<void> {
    await this.cache.clear();
  }

  private static async handleNetworkError(error: NetworkError): Promise<void> {
    const checkConnection = async () => {
      try {
        await fetch('/api/health');
        return true;
      } catch {
        return false;
      }
    };

    await this.withRetry(checkConnection, {
      maxAttempts: 5,
      initialDelay: 2000
    });
  }

  private static async handleRateLimitError(error: RateLimitError): Promise<void> {
    await new Promise(resolve => 
      setTimeout(resolve, error.metadata.retryDelay || defaultConfig.initialDelay)
    );
  }
}

class CircuitState {
  private static instance: CircuitState;
  private circuits: Map<string, {
    failures: number;
    lastFailure: number;
    isOpen: boolean;
  }>;

  private constructor() {
    this.circuits = new Map();
  }

  static getInstance(): CircuitState {
    if (!CircuitState.instance) {
      CircuitState.instance = new CircuitState();
    }
    return CircuitState.instance;
  }

  isOpen(key: string): boolean {
    return this.circuits.get(key)?.isOpen ?? false;
  }

  shouldAttemptReset(key: string, halfOpenAfter: number): boolean {
    const circuit = this.circuits.get(key);
    if (!circuit?.isOpen) return true;

    const timeElapsed = Date.now() - circuit.lastFailure;
    return timeElapsed >= halfOpenAfter;
  }

  recordSuccess(key: string): void {
    this.circuits.set(key, {
      failures: 0,
      lastFailure: 0,
      isOpen: false
    });
  }

  recordFailure(key: string, threshold: number, timeWindow: number): void {
    const now = Date.now();
    const circuit = this.circuits.get(key) ?? {
      failures: 0,
      lastFailure: now,
      isOpen: false
    };

    if (now - circuit.lastFailure > timeWindow) {
      circuit.failures = 1;
    } else {
      circuit.failures++;
    }

    circuit.lastFailure = now;
    circuit.isOpen = circuit.failures >= threshold;

    this.circuits.set(key, circuit);
  }
}