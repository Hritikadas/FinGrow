'use client';

import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export default function Toast({ 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose,
  className 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Wait for animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-full',
        'transform transition-all duration-300 ease-in-out',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        className
      )}
    >
      <div
        className={cn(
          'rounded-xl shadow-lg border p-4',
          'bg-white border-gray-200',
          {
            'border-l-4 border-l-success-500': type === 'success',
            'border-l-4 border-l-error-500': type === 'error',
            'border-l-4 border-l-warning-500': type === 'warning',
            'border-l-4 border-l-primary-500': type === 'info',
          }
        )}
      >
        <div className="flex items-start gap-3">
          <Icon
            className={cn(
              'w-5 h-5 mt-0.5 flex-shrink-0',
              {
                'text-success-500': type === 'success',
                'text-error-500': type === 'error',
                'text-warning-500': type === 'warning',
                'text-primary-500': type === 'info',
              }
            )}
          />
          
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {title}
              </h4>
            )}
            <p className="text-sm text-gray-600">
              {message}
            </p>
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast container for managing multiple toasts
export function ToastContainer({ toasts }: { toasts: Array<ToastProps & { id: string }> }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ transform: `translateY(${index * 10}px)` }}
        >
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
}