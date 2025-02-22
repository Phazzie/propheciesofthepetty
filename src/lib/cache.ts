import { logger } from './logger';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  defaultTTL: number;  // Time to live in milliseconds
  maxEntries: number;
  version: string;
}

export class CacheSystem {
  private cache: Map<string, CacheEntry<any>>;
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.cache = new Map();
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      maxEntries: 100,
      version: '1.0',
      ...config
    };

    // Load persisted cache
    this.loadPersistedCache();
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    logger.debug('Cache hit', { key }, 'CacheSystem', 'get');
    return entry.data as T;
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    if (this.cache.size >= this.config.maxEntries) {
      this.evictOldest();
    }

    const timestamp = Date.now();
    const expiresAt = timestamp + (ttl || this.config.defaultTTL);

    this.cache.set(key, {
      data,
      timestamp,
      expiresAt
    });

    logger.debug('Cache set', { key }, 'CacheSystem', 'set');
    this.persistCache();
  }

  async invalidate(key: string): Promise<void> {
    this.cache.delete(key);
    logger.debug('Cache invalidated', { key }, 'CacheSystem', 'invalidate');
    this.persistCache();
  }

  async clear(): Promise<void> {
    this.cache.clear();
    logger.debug('Cache cleared', undefined, 'CacheSystem', 'clear');
    this.persistCache();
  }

  private evictOldest(): void {
    const entries = Array.from(this.cache.entries());
    if (entries.length === 0) return;

    const oldest = entries.reduce((oldest, current) => {
      return current[1].timestamp < oldest[1].timestamp ? current : oldest;
    });

    this.cache.delete(oldest[0]);
    logger.debug('Cache entry evicted', { key: oldest[0] }, 'CacheSystem', 'evictOldest');
  }

  private persistCache(): void {
    try {
      const data = Array.from(this.cache.entries());
      localStorage.setItem('app_cache', JSON.stringify({
        version: this.config.version,
        data
      }));
    } catch (error) {
      logger.warn('Failed to persist cache', error);
    }
  }

  private loadPersistedCache(): void {
    try {
      const stored = localStorage.getItem('app_cache');
      if (!stored) return;

      const { version, data } = JSON.parse(stored);
      
      // Clear cache if version mismatch
      if (version !== this.config.version) {
        localStorage.removeItem('app_cache');
        return;
      }

      // Restore valid entries
      const now = Date.now();
      data.forEach(([key, entry]: [string, CacheEntry<any>]) => {
        if (entry.expiresAt > now) {
          this.cache.set(key, entry);
        }
      });

      logger.debug('Cache loaded from storage', { 
        entryCount: this.cache.size 
      });
    } catch (error) {
      logger.warn('Failed to load persisted cache', error);
    }
  }
}