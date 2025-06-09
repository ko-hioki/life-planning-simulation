import React from 'react';
import type { BaseComponentProps, FormFieldProps } from '../../types';

// Button Component - SmartHRデザインシステム準拠
interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  icon,
  fullWidth = false,
}) => {
  const baseClasses = 'btn inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-smarthr-blue text-white hover:bg-smarthr-blue-dark focus:ring-smarthr-blue',
    secondary: 'bg-white text-smarthr-black border-smarthr-grey-30 hover:bg-smarthr-grey-05 focus:ring-smarthr-blue',
    outline: 'border-smarthr-blue text-smarthr-blue hover:bg-smarthr-blue-05 focus:ring-smarthr-blue',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      aria-disabled={disabled}
    >
      {icon && <span className="mr-2" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
};

// Input Field Component
interface InputFieldProps extends FormFieldProps {
  type?: 'text' | 'number' | 'email' | 'password';
  value?: string | number;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
  readOnly?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  required = false,
  error,
  touched = false,
  type = 'text',
  value = '',
  placeholder,
  onChange,
  onBlur,
  min,
  max,
  step,
  readOnly = false,
  className = '',
}) => {
  const showError = touched && error;
  const inputClasses = [
    'form-input',
    showError ? 'form-input-error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="mb-4">
      <label className={`form-label ${required ? 'form-label-required' : ''}`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        className={inputClasses}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        min={min}
        max={max}
        step={step}
        readOnly={readOnly}
      />
      {showError && (
        <div className="form-error">{error}</div>
      )}
    </div>
  );
};

// Basic Input Component (without label)
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  required,
  id,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'form-input',
    error ? 'form-input-error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div>
      {label && (
        <label htmlFor={id} className={`form-label ${required ? 'form-label-required' : ''}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        className={inputClasses}
        required={required}
        {...props}
      />
      {helpText && (
        <p className="text-sm text-gray-500 mt-1">
          {helpText}
        </p>
      )}
      {error && (
        <div className="form-error">{error}</div>
      )}
    </div>
  );
};

// Select Field Component
interface SelectFieldProps extends FormFieldProps {
  value?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  required = false,
  error,
  touched = false,
  value = '',
  options,
  placeholder,
  onChange,
  onBlur,
  className = '',
}) => {
  const showError = touched && error;
  const selectClasses = [
    'form-input',
    showError ? 'form-input-error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="mb-4">
      <label className={`form-label ${required ? 'form-label-required' : ''}`}>
        {label}
      </label>
      <select
        value={value}
        className={selectClasses}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {showError && (
        <div className="form-error">{error}</div>
      )}
    </div>
  );
};

// Basic Select Component (without label)
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options = [],
  placeholder,
  error,
  id,
  className = '',
  children,
  ...props
}) => {
  const selectClasses = [
    'form-input',
    error ? 'form-input-error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <select
        id={id}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <div className="form-error">{error}</div>
      )}
    </div>
  );
};

// Checkbox Field Component - SmartHRデザインシステム準拠
interface CheckboxFieldProps extends FormFieldProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  description?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  required = false,
  error,
  touched = false,
  checked = false,
  onChange,
  onBlur,
  description,
  className = '',
}) => {
  const showError = touched && error;

  return (
    <div className={`mb-4 ${className}`}>
      <label className="flex items-start">
        <input
          type="checkbox"
          checked={checked}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
          style={{
            accentColor: 'var(--color-smarthr-blue)',
            borderColor: 'var(--color-border-primary)',
          }}
          onChange={(e) => onChange?.(e.target.checked)}
          onBlur={onBlur}
        />
        <div className="ml-3">
          <span className={`block text-sm font-medium ${required ? 'text-required' : ''}`}
                style={{ color: 'var(--color-text-primary)' }}>
            {label}
            {required && <span className="text-required ml-1">*</span>}
          </span>
          {description && (
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {description}
            </span>
          )}
        </div>
      </label>
      {showError && (
        <div className="form-error mt-1">{error}</div>
      )}
    </div>
  );
};

// Card Component - SmartHRデザインシステム準拠
interface CardProps extends BaseComponentProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  className = '',
  onClick,
  hover = true,
}) => {
  const cardClasses = [
    'bg-white',
    'rounded-lg',
    'shadow-md',
    'p-6',
    hover ? 'hover:shadow-lg transition-shadow' : '',
    onClick ? 'cursor-pointer' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {header && (
        <div className="mb-4 border-b border-gray-200 pb-3">
          {header}
        </div>
      )}
      {children}
      {footer && (
        <div className="mt-4 border-t border-gray-200 pt-3">
          {footer}
        </div>
      )}
    </div>
  );
};

// Alert Component - SmartHRデザインシステム準拠
interface AlertProps extends BaseComponentProps {
  variant?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  onClose,
  icon,
  className = '',
}) => {
  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };

  const defaultIcons = {
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  };

  const classes = [
    'border',
    'border-l-4',
    'p-4',
    'rounded-r',
    'text-sm',
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          {icon || defaultIcons[variant]}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-semibold mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-4 flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-smarthr-blue transition-colors duration-200"
              onClick={onClose}
              aria-label="閉じる"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading Spinner Component
interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} text-blue-600`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <span className="ml-2 text-sm text-gray-600">{text}</span>
      )}
    </div>
  );
};

// Modal Component
interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  title,
  size = 'md',
  className = '',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className={`inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 ${sizeClasses[size]} ${className}`}>
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {title}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={onClose}
              >
                <span className="sr-only">閉じる</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
