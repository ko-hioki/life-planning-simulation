import React from 'react';
import type { BaseComponentProps, WizardStep } from '../../types';

// Wizard Container Component
interface WizardProps extends BaseComponentProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  isLastStep: boolean;
  progress: number;
}

export const Wizard: React.FC<WizardProps> = ({
  steps,
  currentStep,
  onStepChange,
  onNext,
  onPrev,
  onComplete,
  canGoNext,
  canGoPrev,
  isLastStep,
  progress,
  children,
  className = '',
}) => {
  return (
    <div className={`wizard ${className}`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">進捗状況</span>
          <span className="text-sm font-medium text-gray-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Navigation */}
      <WizardStepNavigation
        steps={steps}
        currentStep={currentStep}
        onStepChange={onStepChange}
      />

      {/* Current Step Content */}
      <div className="mt-8">
        {children}
      </div>

      {/* Navigation Buttons */}
      <WizardNavigationButtons
        onNext={onNext}
        onPrev={onPrev}
        onComplete={onComplete}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
        isLastStep={isLastStep}
      />
    </div>
  );
};

// Step Navigation Component
interface WizardStepNavigationProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const WizardStepNavigation: React.FC<WizardStepNavigationProps> = ({
  steps,
  currentStep,
  onStepChange,
}) => {
  return (
    <nav className="flex justify-center">
      <ol className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = step.isCompleted;
          const isClickable = index <= currentStep || isCompleted;

          let stepClasses = 'wizard-step';
          if (isActive) {
            stepClasses += ' wizard-step-active';
          } else if (isCompleted) {
            stepClasses += ' wizard-step-completed';
          } else {
            stepClasses += ' wizard-step-inactive';
          }

          return (
            <li key={step.id} className={stepClasses}>
              <button
                type="button"
                className="flex items-center"
                onClick={() => isClickable && onStepChange(index)}
                disabled={!isClickable}
              >
                {/* Step Number/Icon */}
                <div className="wizard-step-number">
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step Title */}
                <div className="ml-3 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    isActive 
                      ? 'text-blue-600' 
                      : isCompleted 
                        ? 'text-green-600' 
                        : 'text-gray-500'
                  }`}>
                    {step.title}
                    {step.isOptional && (
                      <span className="text-xs text-gray-400 ml-1">(任意)</span>
                    )}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500">
                      {step.description}
                    </div>
                  )}
                </div>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="wizard-step-line" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Navigation Buttons Component
interface WizardNavigationButtonsProps {
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  isLastStep: boolean;
}

export const WizardNavigationButtons: React.FC<WizardNavigationButtonsProps> = ({
  onNext,
  onPrev,
  onComplete,
  canGoNext,
  canGoPrev,
  isLastStep,
}) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <button
        type="button"
        className={`btn btn-secondary ${!canGoPrev ? 'btn-disabled' : ''}`}
        onClick={onPrev}
        disabled={!canGoPrev}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        前へ
      </button>

      <div className="flex space-x-3">
        {isLastStep ? (
          <button
            type="button"
            className="btn btn-success"
            onClick={onComplete}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            完了
          </button>
        ) : (
          <button
            type="button"
            className={`btn btn-primary ${!canGoNext ? 'btn-disabled' : ''}`}
            onClick={onNext}
            disabled={!canGoNext}
          >
            次へ
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Step Content Wrapper
interface WizardStepContentProps extends BaseComponentProps {
  title: string;
  description?: string;
  isOptional?: boolean;
}

export const WizardStepContent: React.FC<WizardStepContentProps> = ({
  title,
  description,
  isOptional = false,
  children,
  className = '',
}) => {
  return (
    <div className={`wizard-step-content ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
          {isOptional && (
            <span className="text-sm text-gray-500 font-normal ml-2">(任意)</span>
          )}
        </h2>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

// Step Validation Summary
interface StepValidationSummaryProps {
  errors: string[];
  warnings?: string[];
}

export const StepValidationSummary: React.FC<StepValidationSummaryProps> = ({
  errors,
  warnings = [],
}) => {
  if (errors.length === 0 && warnings.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 space-y-2">
      {errors.length > 0 && (
        <div className="alert-error">
          <h4 className="font-medium mb-2">入力エラー</h4>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {warnings.length > 0 && (
        <div className="alert-warning">
          <h4 className="font-medium mb-2">注意事項</h4>
          <ul className="list-disc list-inside space-y-1">
            {warnings.map((warning, index) => (
              <li key={index} className="text-sm">{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
