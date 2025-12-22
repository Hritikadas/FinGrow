import { randomUUID } from 'crypto';

export interface LogContext {
  correlationId: string;
  userId?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  correlationId: string;
  userId?: string;
  action?: string;
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  generateCorrelationId(): string {
    return randomUUID();
  }

  private formatLog(entry: LogEntry): string {
    if (this.isDevelopment) {
      // Pretty format for development
      const timestamp = new Date(entry.timestamp).toISOString();
      const level = entry.level.toUpperCase().padEnd(5);
      const correlation = entry.correlationId.slice(0, 8);
      const user = entry.userId ? `[${entry.userId.slice(0, 8)}]` : '[anonymous]';
      const action = entry.action ? `[${entry.action}]` : '';
      
      let message = `${timestamp} ${level} ${correlation} ${user} ${action} ${entry.message}`;
      
      if (entry.metadata && Object.keys(entry.metadata).length > 0) {
        message += `\n  Metadata: ${JSON.stringify(entry.metadata, null, 2)}`;
      }
      
      if (entry.error) {
        message += `\n  Error: ${entry.error.name}: ${entry.error.message}`;
        if (entry.error.stack) {
          message += `\n  Stack: ${entry.error.stack}`;
        }
      }
      
      return message;
    } else {
      // JSON format for production
      return JSON.stringify(entry);
    }
  }

  private log(level: LogEntry['level'], message: string, context: LogContext, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      correlationId: context.correlationId,
      userId: context.userId,
      action: context.action,
      metadata: context.metadata,
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    const formattedLog = this.formatLog(entry);
    
    switch (level) {
      case 'error':
        console.error(formattedLog);
        break;
      case 'warn':
        console.warn(formattedLog);
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedLog);
        }
        break;
      default:
        console.log(formattedLog);
    }
  }

  info(message: string, context: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context: LogContext, error?: Error) {
    this.log('error', message, context, error);
  }

  debug(message: string, context: LogContext) {
    this.log('debug', message, context);
  }

  // Helper method for API routes
  apiLog(method: string, path: string, context: LogContext, statusCode?: number, duration?: number) {
    const metadata = {
      method,
      path,
      statusCode,
      duration: duration ? `${duration}ms` : undefined,
      ...context.metadata,
    };

    const level = statusCode && statusCode >= 400 ? 'error' : 'info';
    const message = `${method} ${path} ${statusCode || 'pending'}`;

    this.log(level, message, { ...context, metadata });
  }

  // Helper method for AI engine operations
  aiLog(engine: string, operation: string, context: LogContext, success: boolean, duration?: number) {
    const metadata = {
      engine,
      operation,
      success,
      duration: duration ? `${duration}ms` : undefined,
      ...context.metadata,
    };

    const level = success ? 'info' : 'warn';
    const message = `AI Engine ${engine}.${operation} ${success ? 'succeeded' : 'failed'}`;

    this.log(level, message, { ...context, metadata });
  }

  // Helper method for database operations
  dbLog(operation: string, table: string, context: LogContext, success: boolean, duration?: number) {
    const metadata = {
      operation,
      table,
      success,
      duration: duration ? `${duration}ms` : undefined,
      ...context.metadata,
    };

    const level = success ? 'info' : 'error';
    const message = `Database ${operation} on ${table} ${success ? 'succeeded' : 'failed'}`;

    this.log(level, message, { ...context, metadata });
  }
}

export const logger = new Logger();

// Middleware helper for Next.js API routes
export function withLogging<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  action: string
) {
  return async (...args: T): Promise<R> => {
    const correlationId = logger.generateCorrelationId();
    const startTime = Date.now();
    
    const context: LogContext = {
      correlationId,
      action,
    };

    try {
      logger.info(`Starting ${action}`, context);
      const result = await handler(...args);
      const duration = Date.now() - startTime;
      
      logger.info(`Completed ${action}`, {
        ...context,
        metadata: { duration: `${duration}ms` },
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error(`Failed ${action}`, {
        ...context,
        metadata: { duration: `${duration}ms` },
      }, error as Error);
      
      throw error;
    }
  };
}