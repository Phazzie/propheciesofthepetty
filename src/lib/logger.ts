/**
 * Application logging utility
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  details?: unknown;
  error?: Error;
  component?: string;
  action?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private sessionId = crypto.randomUUID();
  private logBuffer: LogEntry[] = [];

  private formatEntry(entry: LogEntry): string {
    return JSON.stringify({
      ...entry,
      sessionId: this.sessionId,
      error: entry.error ? {
        name: entry.error.name,
        message: entry.error.message,
        stack: this.isDevelopment ? entry.error.stack : undefined
      } : undefined
    });
  }

  private logToConsole(entry: LogEntry) {
    const formattedEntry = this.formatEntry(entry);

    switch (entry.level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedEntry);
        }
        break;
      case 'info':
        console.info(formattedEntry);
        break;
      case 'warn':
        console.warn(formattedEntry);
        break;
      case 'error':
        console.error(formattedEntry);
        break;
    }

    // In production, send errors and warnings to logging service
    if (!this.isDevelopment && (entry.level === 'error' || entry.level === 'warn')) {
      this.sendToLogService(entry);
    }
  }

  private async sendToLogService(entry: LogEntry) {
    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...this.formatEntry(entry),
          environment: import.meta.env.MODE,
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to send log to service:', response.statusText);
      }
    } catch (error) {
      // Avoid infinite loop by not logging this error
      console.error('Error sending log to service:', error);
    }
  }

  log(level: LogLevel, message: string, ...args: any[]) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      args
    };
    this.logBuffer.push(logEntry);
    console[level](message, ...args);
  }

  debug(message: string, details?: unknown, component?: string, action?: string) {
    this.logToConsole({
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
      details,
      component,
      action
    });
  }

  info(message: string, details?: unknown, component?: string, action?: string) {
    this.logToConsole({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      details,
      component,
      action
    });
  }

  warn(message: string, details?: unknown, component?: string, action?: string) {
    this.logToConsole({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      details,
      component,
      action
    });
  }

  error(message: string, error?: Error, details?: unknown, component?: string, action?: string) {
    this.logToConsole({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      details,
      error,
      component,
      action
    });
  }
}

export const logger = new Logger();