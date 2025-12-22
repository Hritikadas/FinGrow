'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '@/lib/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  correlationId: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void; correlationId: string }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      correlationId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      correlationId: logger.generateCorrelationId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const correlationId = this.state.correlationId || logger.generateCorrelationId();
    
    logger.error('React Error Boundary caught error', {
      correlationId,
      action: 'error-boundary',
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name,
      },
    }, error);

    this.setState({
      errorInfo,
      correlationId,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    logger.info('Error boundary retry attempted', {
      correlationId: this.state.correlationId,
      action: 'error-boundary-retry',
    });

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      correlationId: '',
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback component if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            retry={this.handleRetry}
            correlationId={this.state.correlationId}
          />
        );
      }

      // Default error UI
      return <DefaultErrorFallback 
        error={this.state.error} 
        retry={this.handleRetry}
        correlationId={this.state.correlationId}
      />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  retry: () => void;
  correlationId: string;
}

function DefaultErrorFallback({ error, retry, correlationId }: DefaultErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-white/10 backdrop-blur-sm border-white/20 text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-gray-300">
            We encountered an unexpected error. Our team has been notified.
          </p>
        </div>

        {isDevelopment && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
            <h3 className="text-red-400 font-medium mb-2">Error Details (Development)</h3>
            <p className="text-red-300 text-sm mb-2">{error.message}</p>
            <p className="text-gray-400 text-xs">Correlation ID: {correlationId}</p>
            {error.stack && (
              <pre className="text-xs text-gray-400 mt-2 overflow-x-auto">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={retry}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="text-gray-300 border-gray-600 hover:border-gray-500"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>

        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-200">
            <strong>Educational Prototype:</strong> This is a demonstration application. 
            If you continue to experience issues, please refresh the page or try again later.
          </p>
        </div>
      </Card>
    </div>
  );
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; retry: () => void; correlationId: string }>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Hook for handling errors in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    const correlationId = logger.generateCorrelationId();
    
    logger.error('useErrorHandler caught error', {
      correlationId,
      action: 'use-error-handler',
    }, error);

    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  // Throw error to be caught by Error Boundary
  if (error) {
    throw error;
  }

  return { handleError, clearError };
}