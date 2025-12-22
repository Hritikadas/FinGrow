import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
}

export default function Loading({ size = 'md', variant = 'spinner', className }: LoadingProps) {
  if (variant === 'spinner') {
    return (
      <div
        className={cn(
          'border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin',
          {
            'w-4 h-4': size === 'sm',
            'w-6 h-6': size === 'md',
            'w-8 h-8': size === 'lg',
          },
          className
        )}
      />
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'bg-primary-600 rounded-full animate-pulse',
              {
                'w-2 h-2': size === 'sm',
                'w-3 h-3': size === 'md',
                'w-4 h-4': size === 'lg',
              }
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div
        className={cn(
          'bg-primary-600 rounded-full animate-pulse',
          {
            'w-4 h-4': size === 'sm',
            'w-6 h-6': size === 'md',
            'w-8 h-8': size === 'lg',
          },
          className
        )}
      />
    );
  }

  return null;
}

// Loading skeleton component
export function LoadingSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('skeleton', className)}
      {...props}
    />
  );
}

// Full page loading component
export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading...</h2>
        <p className="text-gray-500">Please wait while we prepare your experience</p>
      </div>
    </div>
  );
}