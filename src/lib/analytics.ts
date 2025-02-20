import { supabase } from './supabase';
import { logger } from './logger';

export interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  data: Record<string, any>;
  timestamp?: string;
}

interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
}

class Analytics {
  private queue: AnalyticsEvent[] = [];
  private flushInterval: number = 5000; // 5 seconds
  private batchSize: number = 10;
  private isProcessing: boolean = false;

  constructor() {
    setInterval(() => this.flush(), this.flushInterval);
    this.setupPerformanceObservers();
  }

  private setupPerformanceObservers() {
    if (typeof window === 'undefined') return;

    // First Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        this.trackPerformance('fcp', entries[0].startTime);
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        this.trackPerformance('lcp', entries[entries.length - 1].startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        this.trackPerformance('fid', entries[0].duration);
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      let clsValue = 0;
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.trackPerformance('cls', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private async flush() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const batch = this.queue.splice(0, this.batchSize);

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert(batch);

      if (error) throw error;
    } catch (err) {
      logger.error('Failed to flush analytics events', err);
      // Put events back in queue
      this.queue.unshift(...batch);
    } finally {
      this.isProcessing = false;
    }
  }

  trackEvent(event: AnalyticsEvent) {
    this.queue.push({
      ...event,
      timestamp: new Date().toISOString()
    });

    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  private trackPerformance(metric: keyof PerformanceMetrics, value: number) {
    this.trackEvent({
      eventType: 'performance',
      data: { metric, value }
    });
  }
}

export const analytics = new Analytics();