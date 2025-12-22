import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-95 hover:scale-105',
          'relative overflow-hidden',
          {
            // Primary variant
            'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-primary-500/25': variant === 'primary',
            
            // Secondary variant
            'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 border border-secondary-200 hover:border-secondary-300': variant === 'secondary',
            
            // Outline variant
            'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700 bg-transparent': variant === 'outline',
            
            // Ghost variant
            'hover:bg-gray-100 text-gray-700 bg-transparent': variant === 'ghost',
            
            // Success variant
            'bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 shadow-lg hover:shadow-xl hover:shadow-success-500/25': variant === 'success',
            
            // Warning variant
            'bg-gradient-to-r from-warning-500 to-warning-600 text-white hover:from-warning-600 hover:to-warning-700 shadow-lg hover:shadow-xl hover:shadow-warning-500/25': variant === 'warning',
            
            // Error variant
            'bg-gradient-to-r from-error-500 to-error-600 text-white hover:from-error-600 hover:to-error-700 shadow-lg hover:shadow-xl hover:shadow-error-500/25': variant === 'error',
            
            // Sizes
            'px-3 py-1.5 text-sm h-8': size === 'sm',
            'px-5 py-2.5 text-base h-10': size === 'md',
            'px-8 py-4 text-lg h-12': size === 'lg',
            'px-10 py-5 text-xl h-14': size === 'xl',
          },
          className
        )}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        <span className={cn('flex items-center gap-2', loading && 'opacity-0')}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
