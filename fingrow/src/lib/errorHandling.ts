import React from 'react';
import { logger } from './logger';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly correlationId?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    correlationId?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.correlationId = correlationId;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, correlationId?: string) {
    super(`Database Error: ${message}`, 503, true, correlationId);
  }
}

export class AIEngineError extends AppError {
  constructor(engine: string, operation: string, correlationId?: string) {
    super(`AI Engine Error: ${engine}.${operation} failed`, 500, true, correlationId);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, correlationId?: string) {
    super(`Validation Error: ${message}`, 400, true, correlationId);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', correlationId?: string) {
    super(message, 401, true, correlationId);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', correlationId?: string) {
    super(message, 403, true, correlationId);
  }
}

// Error handler for API routes
export function handleApiError(error: unknown, correlationId: string) {
  const context = { correlationId, action: 'error-handling' };

  if (error instanceof AppError) {
    logger.error(`Operational error: ${error.message}`, context, error);
    
    return {
      error: error.message,
      statusCode: error.statusCode,
      correlationId: error.correlationId || correlationId,
      timestamp: new Date().toISOString(),
    };
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any;
    
    switch (prismaError.code) {
      case 'P2002':
        logger.error('Database constraint violation', context, prismaError);
        return {
          error: 'A record with this information already exists',
          statusCode: 409,
          correlationId,
          timestamp: new Date().toISOString(),
        };
      
      case 'P2025':
        logger.error('Database record not found', context, prismaError);
        return {
          error: 'The requested resource was not found',
          statusCode: 404,
          correlationId,
          timestamp: new Date().toISOString(),
        };
      
      case 'P1001':
      case 'P1008':
      case 'P1009':
        logger.error('Database connection error', context, prismaError);
        return {
          error: 'Database is temporarily unavailable. Please try again later.',
          statusCode: 503,
          correlationId,
          timestamp: new Date().toISOString(),
          userMessage: 'Our database is experiencing issues. We\'re working to resolve this quickly.',
        };
      
      default:
        logger.error('Unknown database error', context, prismaError);
        return {
          error: 'A database error occurred',
          statusCode: 500,
          correlationId,
          timestamp: new Date().toISOString(),
        };
    }
  }

  // Handle unknown errors
  const unknownError = error instanceof Error ? error : new Error('Unknown error occurred');
  logger.error('Unexpected error', context, unknownError);
  
  return {
    error: 'An unexpected error occurred',
    statusCode: 500,
    correlationId,
    timestamp: new Date().toISOString(),
    userMessage: 'Something went wrong on our end. Please try again later.',
  };
}

// Graceful error boundaries for React components
export function withErrorBoundary<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  fallbackComponent?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  return function WrappedComponent(props: T) {
    const [error, setError] = React.useState<Error | null>(null);
    const [retryCount, setRetryCount] = React.useState(0);

    React.useEffect(() => {
      if (error) {
        const correlationId = logger.generateCorrelationId();
        logger.error('Component error boundary triggered', {
          correlationId,
          action: 'error-boundary',
          metadata: { componentName: Component.name, retryCount },
        }, error);
      }
    }, [error, retryCount]);

    const retry = React.useCallback(() => {
      setError(null);
      setRetryCount(prev => prev + 1);
    }, []);

    if (error) {
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent;
        return React.createElement(FallbackComponent, { error, retry });
      }

      return React.createElement('div', {
        className: 'p-4 bg-red-50 border border-red-200 rounded-lg'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-red-800 font-medium mb-2'
        }, 'Something went wrong'),
        React.createElement('p', {
          key: 'message',
          className: 'text-red-600 text-sm mb-3'
        }, error.message),
        React.createElement('button', {
          key: 'retry',
          onClick: retry,
          className: 'px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700'
        }, 'Try Again')
      ]);
    }

    try {
      return React.createElement(Component, props);
    } catch (componentError) {
      setError(componentError as Error);
      return null;
    }
  };
}

// AI Engine fallback system
export class AIEngineFallback {
  private static lastKnownRecommendations = new Map<string, any>();

  static setLastKnownRecommendation(userId: string, engine: string, recommendation: any) {
    const key = `${userId}:${engine}`;
    this.lastKnownRecommendations.set(key, {
      recommendation,
      timestamp: Date.now(),
    });
  }

  static getLastKnownRecommendation(userId: string, engine: string): any | null {
    const key = `${userId}:${engine}`;
    const cached = this.lastKnownRecommendations.get(key);
    
    if (!cached) return null;
    
    // Return cached recommendation if it's less than 1 hour old
    const isRecent = Date.now() - cached.timestamp < 60 * 60 * 1000;
    return isRecent ? cached.recommendation : null;
  }

  static getRuleBasedFallback(engine: string, userData: any): any {
    const correlationId = logger.generateCorrelationId();
    const context = { correlationId, action: 'ai-fallback', userId: userData.id };
    
    logger.warn(`Using rule-based fallback for ${engine}`, context);

    switch (engine) {
      case 'LiquidityPredictor':
        return this.getLiquidityFallback(userData);
      
      case 'MicroInvestmentAllocator':
        return this.getInvestmentFallback(userData);
      
      case 'SimulationEngine':
        return this.getSimulationFallback(userData);
      
      default:
        logger.error(`No fallback available for engine: ${engine}`, context);
        return null;
    }
  }

  private static getLiquidityFallback(userData: any) {
    const surplus = Math.max(0, userData.monthlyIncome - userData.monthlyExpenses);
    
    return [
      {
        month: 'Next Month',
        predictedSurplus: Math.round(surplus * 0.9), // Conservative estimate
        predictedExpenses: userData.monthlyExpenses,
        confidence: 70, // Lower confidence for fallback
      },
      {
        month: 'Month 2',
        predictedSurplus: Math.round(surplus * 0.85),
        predictedExpenses: userData.monthlyExpenses,
        confidence: 60,
      },
      {
        month: 'Month 3',
        predictedSurplus: Math.round(surplus * 0.8),
        predictedExpenses: userData.monthlyExpenses,
        confidence: 50,
      },
    ];
  }

  private static getInvestmentFallback(userData: any) {
    // Simple rule-based allocation: 5% of income
    const amount = Math.round(userData.monthlyIncome * 0.05);
    
    return {
      totalAmount: amount,
      breakdown: {
        'Conservative Allocation': amount,
      },
      note: 'Fallback recommendation: 5% of monthly income',
    };
  }

  private static getSimulationFallback(userData: any) {
    const monthlyInvestment = Math.round(userData.monthlyIncome * 0.05);
    const months = 12;
    const annualReturn = 0.08; // Conservative 8% return
    const monthlyReturn = annualReturn / 12;
    
    let cumulativeAmount = 0;
    const monthlyInvestments = [];
    
    for (let i = 1; i <= months; i++) {
      cumulativeAmount = (cumulativeAmount + monthlyInvestment) * (1 + monthlyReturn);
      monthlyInvestments.push({
        month: i,
        amount: monthlyInvestment,
        cumulativeAmount: Math.round(cumulativeAmount),
      });
    }
    
    return {
      monthlyInvestments,
      finalCorpus: Math.round(cumulativeAmount),
      totalInvested: monthlyInvestment * months,
      totalReturns: Math.round(cumulativeAmount - (monthlyInvestment * months)),
      note: 'Fallback simulation with conservative assumptions',
    };
  }
}

// Database connection fallback
export async function withDatabaseFallback<T>(
  operation: () => Promise<T>,
  fallback: () => T,
  correlationId: string
): Promise<T> {
  const context = { correlationId, action: 'database-fallback' };
  
  try {
    return await operation();
  } catch (error) {
    logger.warn('Database operation failed, using fallback', context);
    return fallback();
  }
}

// React hook for error handling
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);
  
  const handleError = React.useCallback((error: Error) => {
    const correlationId = logger.generateCorrelationId();
    logger.error('Client-side error handled', {
      correlationId,
      action: 'client-error-handler',
    }, error);
    
    setError(error);
  }, []);
  
  const clearError = React.useCallback(() => {
    setError(null);
  }, []);
  
  return { error, handleError, clearError };
}