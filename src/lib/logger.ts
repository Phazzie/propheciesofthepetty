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
  args?: any[]; // Added property to support additional arguments in log entries
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
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

  private async sendToLogService(_entry: LogEntry) {
    // Implementation for sending logs to a service in production
    // This is a placeholder for future implementation
  }

  log(level: LogLevel, message: string, ...args: any[]) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      args
    };
    this.logBuffer.push(logEntry);
    // Instead of using console[level] which might cause type issues, use a switch case
    switch (level) {
      case 'debug':
        console.debug(message, ...args);
        break;
      case 'info':
        console.info(message, ...args);
        break;
      case 'warn':
        console.warn(message, ...args);
        break;
      case 'error':
        console.error(message, ...args);
        break;
    }
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