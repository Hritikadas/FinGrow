'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Database, RefreshCw, AlertTriangle, Wifi } from 'lucide-react';

interface DatabaseErrorFallbackProps {
  error?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function DatabaseErrorFallback({ 
  error, 
  onRetry, 
  showRetry = true 
}: DatabaseErrorFallbackProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await onRetry();
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const getErrorMessage = () => {
    if (error?.includes('connection') || error?.includes('timeout')) {
      return {
        title: 'Database Connection Issue',
        message: 'We\'re having trouble connecting to our database. This might be temporary.',
        icon: Wifi,
        suggestion: 'Please try again in a few moments.',
      };
    }

    if (error?.includes('unavailable') || error?.includes('down')) {
      return {
        title: 'Database Temporarily Unavailable',
        message: 'Our database service is currently experiencing issues.',
        icon: Database,
        suggestion: 'We\'re working to resolve this quickly. Please try again later.',
      };
    }

    return {
      title: 'Database Error',
      message: 'We encountered an issue while accessing your data.',
      icon: AlertTriangle,
      suggestion: 'Please try refreshing the page or contact support if the issue persists.',
    };
  };

  const errorInfo = getErrorMessage();
  const Icon = errorInfo.icon;

  return (
    <Card className="p-8 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 text-center">
      <div className="mb-6">
        <Icon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-800 mb-2">{errorInfo.title}</h2>
        <p className="text-red-600 mb-2">{errorInfo.message}</p>
        <p className="text-red-500 text-sm">{errorInfo.suggestion}</p>
      </div>

      {showRetry && (
        <div className="space-y-4">
          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </Button>
          
          {retryCount > 0 && (
            <p className="text-sm text-red-500">
              Retry attempts: {retryCount}
            </p>
          )}
        </div>
      )}

      {/* Fallback Data Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-center mb-2">
          <Database className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">Using Cached Data</span>
        </div>
        <p className="text-xs text-blue-600">
          We're showing you the last known data while we resolve the database issue. 
          Some information may be outdated.
        </p>
      </div>

      {/* Educational Notice */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-700">
          <strong>Educational Prototype:</strong> This is a demonstration of error handling 
          in a real application. In production, we would have additional monitoring and 
          automatic failover systems.
        </p>
      </div>
    </Card>
  );
}

// Hook for database error handling
export function useDatabaseErrorHandler() {
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleDatabaseError = (error: any) => {
    let errorMessage = 'Database error occurred';
    
    if (error?.code === 'P1001' || error?.code === 'P1008' || error?.code === 'P1009') {
      errorMessage = 'Database connection failed';
    } else if (error?.message?.includes('timeout')) {
      errorMessage = 'Database request timed out';
    } else if (error?.message?.includes('unavailable')) {
      errorMessage = 'Database service unavailable';
    }
    
    setError(errorMessage);
  };

  const retry = async (operation: () => Promise<any>) => {
    setIsRetrying(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (error) {
      handleDatabaseError(error);
      throw error;
    } finally {
      setIsRetrying(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    isRetrying,
    handleDatabaseError,
    retry,
    clearError,
  };
}