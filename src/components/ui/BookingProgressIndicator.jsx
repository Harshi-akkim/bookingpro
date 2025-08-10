import React from 'react';
import Icon from '../AppIcon';

const BookingProgressIndicator = ({
  currentStep = 1,
  totalSteps = 4,
  steps = [],
  onStepClick,
  allowBackNavigation = true,
  className = ''
}) => {
  const defaultSteps = [
    { id: 1, label: 'Service', icon: 'Calendar' },
    { id: 2, label: 'Date & Time', icon: 'Clock' },
    { id: 3, label: 'Details', icon: 'User' },
    { id: 4, label: 'Payment', icon: 'CreditCard' }
  ];

  const progressSteps = steps?.length > 0 ? steps : defaultSteps?.slice(0, totalSteps);
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  const handleStepClick = (stepNumber) => {
    if (onStepClick && allowBackNavigation && stepNumber <= currentStep) {
      onStepClick(stepNumber);
    }
  };

  const getStepClasses = (stepNumber) => {
    const status = getStepStatus(stepNumber);
    const isClickable = allowBackNavigation && stepNumber <= currentStep && onStepClick;
    
    const baseClasses = `
      relative flex items-center justify-center w-10 h-10 rounded-full
      transition-all duration-300 ease-out font-medium text-sm
      ${isClickable ? 'cursor-pointer hover:scale-105' : ''}
    `;

    switch (status) {
      case 'completed':
        return `${baseClasses} bg-success text-success-foreground elevation-1`;
      case 'current':
        return `${baseClasses} bg-primary text-primary-foreground elevation-2 ring-2 ring-primary/20`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground border-2 border-border`;
    }
  };

  const getLabelClasses = (stepNumber) => {
    const status = getStepStatus(stepNumber);
    const baseClasses = 'text-xs font-medium mt-2 transition-colors duration-200';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} text-success`;
      case 'current':
        return `${baseClasses} text-primary font-semibold`;
      default:
        return `${baseClasses} text-muted-foreground`;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Progress Bar */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-border">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {progressSteps?.map((step, index) => {
              const stepNumber = index + 1;
              const status = getStepStatus(stepNumber);
              
              return (
                <div 
                  key={step?.id}
                  className="flex flex-col items-center"
                  onClick={() => handleStepClick(stepNumber)}
                >
                  <div className={getStepClasses(stepNumber)}>
                    {status === 'completed' ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={step?.icon} size={16} />
                    )}
                  </div>
                  <span className={getLabelClasses(stepNumber)}>
                    {step?.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {progressSteps?.[currentStep - 1]?.label}
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        
        {/* Mobile Step Dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {progressSteps?.map((_, index) => {
            const stepNumber = index + 1;
            const status = getStepStatus(stepNumber);
            
            return (
              <button
                key={index}
                onClick={() => handleStepClick(stepNumber)}
                disabled={!allowBackNavigation || stepNumber > currentStep}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${status === 'completed' || status === 'current' 
                    ? 'bg-primary' :'bg-muted-foreground/30'
                  }
                  ${allowBackNavigation && stepNumber <= currentStep 
                    ? 'cursor-pointer hover:scale-125' :''
                  }
                `}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingProgressIndicator;