import React from 'react';
import type { BaseComponentProps, FormFieldProps } from '../../types';

// Button Component
interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'btn-success',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled ? 'btn-disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
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
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  className = '',
  error,
  ...props
}) => {
  const inputClasses = [
    'form-input',
    error ? 'form-input-error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <input
      className={inputClasses}
      {...props}
    />
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
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  className = '',
  error,
  children,
  ...props
}) => {
  const selectClasses = [
    'form-input',
    error ? 'form-input-error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <select
      className={selectClasses}
      {...props}
    >
      {children}
    </select>
  );
};

// Checkbox Field Component
interface CheckboxFieldProps extends FormFieldProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  required = false,
  error,
  touched = false,
  checked = false,
  onChange,
  onBlur,
  className = '',
}) => {
  const showError = touched && error;

  return (
    <div className={`mb-4 ${className}`}>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={checked}
          className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          onChange={(e) => onChange?.(e.target.checked)}
          onBlur={onBlur}
        />
        <span className={`ml-2 text-sm font-medium text-gray-700 ${required ? 'text-required' : ''}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>
      {showError && (
        <div className="form-error mt-1">{error}</div>
      )}
    </div>
  );
};

// Card Component
interface CardProps extends BaseComponentProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  className = '',
  onClick,
}) => {
  return (
    <div 
      className={`card ${className}`}
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
        <div className="card-header">
          {header}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

// Alert Component
interface AlertProps extends BaseComponentProps {
  variant?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  onClose,
  className = '',
}) => {
  const variantClasses = {
    info: 'alert-info',
    warning: 'alert-warning',
    error: 'alert-error',
    success: 'alert-success',
  };

  const classes = [
    'alert',
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="flex">
        <div className="flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              <span className="sr-only">閉じる</span>
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
