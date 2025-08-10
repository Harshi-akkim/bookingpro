import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PaymentStatusIndicator = ({ status, size = 'default', showLabel = true, className = '' }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          label: 'Completed',
          description: 'Payment processed successfully'
        };
      case 'pending':
        return {
          icon: 'Clock',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          label: 'Pending',
          description: 'Payment is being processed'
        };
      case 'failed':
        return {
          icon: 'XCircle',
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
          label: 'Failed',
          description: 'Payment could not be processed'
        };
      case 'refunded':
        return {
          icon: 'RotateCcw',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          label: 'Refunded',
          description: 'Payment has been refunded'
        };
      case 'disputed':
        return {
          icon: 'AlertTriangle',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          label: 'Disputed',
          description: 'Payment is under dispute'
        };
      case 'cancelled':
        return {
          icon: 'Ban',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          label: 'Cancelled',
          description: 'Payment was cancelled'
        };
      default:
        return {
          icon: 'HelpCircle',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          label: 'Unknown',
          description: 'Unknown payment status'
        };
    }
  };

  const getSizeConfig = (size) => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1',
          icon: 12,
          text: 'text-xs',
          spacing: 'space-x-1'
        };
      case 'lg':
        return {
          container: 'px-4 py-2',
          icon: 20,
          text: 'text-base',
          spacing: 'space-x-3'
        };
      default:
        return {
          container: 'px-3 py-1.5',
          icon: 16,
          text: 'text-sm',
          spacing: 'space-x-2'
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const sizeConfig = getSizeConfig(size);

  if (!showLabel) {
    return (
      <div 
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${statusConfig?.bgColor} ${className}`}
        title={`${statusConfig?.label}: ${statusConfig?.description}`}
      >
        <Icon 
          name={statusConfig?.icon} 
          size={sizeConfig?.icon} 
          className={statusConfig?.color} 
        />
      </div>
    );
  }

  return (
    <span 
      className={`
        inline-flex items-center ${sizeConfig?.spacing} ${sizeConfig?.container}
        rounded-full border font-medium
        ${statusConfig?.color} ${statusConfig?.bgColor} ${statusConfig?.borderColor}
        ${sizeConfig?.text} ${className}
      `}
      title={statusConfig?.description}
    >
      <Icon 
        name={statusConfig?.icon} 
        size={sizeConfig?.icon} 
        className={statusConfig?.color} 
      />
      <span>{statusConfig?.label}</span>
    </span>
  );
};

// Animated status indicator for real-time updates
export const AnimatedPaymentStatusIndicator = ({ 
  status, 
  previousStatus, 
  size = 'default', 
  showLabel = true, 
  className = '' 
}) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (previousStatus && previousStatus !== status) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [status, previousStatus]);

  return (
    <div className={`transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
      <PaymentStatusIndicator 
        status={status} 
        size={size} 
        showLabel={showLabel} 
        className={className}
      />
    </div>
  );
};

// Status progress indicator for multi-step payments
export const PaymentProgressIndicator = ({ 
  currentStatus, 
  steps = ['pending', 'processing', 'completed'],
  className = '' 
}) => {
  const getCurrentStepIndex = () => {
    return steps?.findIndex(step => step === currentStatus?.toLowerCase());
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {steps?.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isUpcoming = index > currentStepIndex;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <PaymentStatusIndicator
                status={isCompleted ? 'completed' : isCurrent ? step : 'pending'}
                size="sm"
                showLabel={false}
                className={`
                  ${isCompleted ? 'opacity-100' : ''}
                  ${isCurrent ? 'opacity-100 ring-2 ring-primary/20' : ''}
                  ${isUpcoming ? 'opacity-50' : ''}
                `}
              />
              <span className={`text-xs mt-1 capitalize ${
                isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step}
              </span>
            </div>
            {index < steps?.length - 1 && (
              <div className={`flex-1 h-0.5 ${
                isCompleted ? 'bg-success' : 'bg-border'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default PaymentStatusIndicator;