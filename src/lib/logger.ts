import { analytics } from './analytics';
import { isAppError } from './errors';

/**
 * Application logging utility
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, unknown>;

interface LogEvent {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: Error;
  context?: LogContext;
  component?: string;
  action?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatError(error: unknown): string {
    if (isAppError(error)) {
      return `${error.name}[${error.code}]: ${error.message}${error.details ? ` (${JSON.stringify(error.details)})` : ''}`;
    }
    if (error instanceof Error) {
      return `${error.name}: ${error.message}\n${error.stack}`;
    }
    return String(error);
  }

  private createLogEvent(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: LogContext,
    component?: string,
    action?: string
  ): LogEvent {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(error && { error: error instanceof Error ? error : new Error(String(error)) }),
      ...(context && { context }),
      ...(component && { component }),
      ...(action && { action })
    };
  }

  private log(event: LogEvent) {
    const { timestamp, level, message, error, context, component, action } = event;
    const logParts = [
      `[${timestamp}]`,
      `[${level.toUpperCase()}]`,
      component && `[${component}]`,
      action && `[${action}]`,
      message,
      error && `\nError: ${this.formatError(error)}`,
      context && `\nContext: ${JSON.stringify(context, null, 2)}`
    ].filter(Boolean);

    const logMessage = logParts.join(' ');

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(logMessage);
        }
        break;
      case 'info':
        console.info(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'error':
        console.error(logMessage);
        break;
    }

    // Track errors and warnings in analytics with enhanced context
    if (level === 'error' || level === 'warn') {
      analytics.trackEvent({
        eventType: `log_${level}`,
        data: {
          message,
          errorType: error instanceof Error ? error.constructor.name : 'Unknown',
          errorMessage: error ? this.formatError(error) : undefined,
          component,
          action,
          context,
          severity: isAppError(error) ? error.severity : 'medium',
          timestamp,
          environment: this.isDevelopment ? 'development' : 'production'
        }
      });

      // Additional tracking for high severity errors
      if (isAppError(error) && error.severity === 'high') {
        analytics.trackEvent({
          eventType: 'high_severity_error',
          data: {
            code: error.code,
            component,
            action,
            context
          }
        });
      }
    }
  }

  debug(message: string, context?: LogContext, component?: string, action?: string) {
    this.log(this.createLogEvent('debug', message, undefined, context, component, action));
  }

  info(message: string, context?: LogContext, component?: string, action?: string) {
    this.log(this.createLogEvent('info', message, undefined, context, component, action));
  }

  warn(message: string, error?: unknown, context?: LogContext, component?: string, action?: string) {
    this.log(this.createLogEvent('warn', message, error, context, component, action));
  }

  error(message: string, error?: unknown, context?: LogContext, component?: string, action?: string) {
    this.log(this.createLogEvent('error', message, error, context, component, action));
  }
}

export const logger = new Logger();