import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, helperText, leftIcon, rightIcon, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full px-4 py-3 border-2 border-gray-200 rounded-xl',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'transition-all duration-200',
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
              'placeholder:text-gray-400',
              'hover:border-gray-300',
              leftIcon && 'pl-10',
              (rightIcon || isPassword) && 'pr-10',
              error && 'border-error-500 focus:ring-error-500 focus:border-error-500',
              success && 'border-success-500 focus:ring-success-500 focus:border-success-500',
              className
            )}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          
          {rightIcon && !isPassword && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-error-600 flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        )}
        
        {success && (
          <p className="mt-2 text-sm text-success-600 flex items-center gap-1">
            <span>✅</span>
            {success}
          </p>
        )}
        
        {helperText && !error && !success && (
          <p className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
