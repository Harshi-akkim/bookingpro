import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionFAB = ({
  userRole = 'customer',
  className = '',
  onActionClick,
  customActions = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide/show FAB based on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsExpanded(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close expanded menu when route changes
  useEffect(() => {
    setIsExpanded(false);
  }, [location.pathname]);

  // Close expanded menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target?.closest('.quick-action-fab')) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getContextualActions = () => {
    const currentPath = location.pathname;
    
    // Custom actions take precedence
    if (customActions?.length > 0) {
      return customActions;
    }

    // Default actions based on current page and user role
    const actionMap = {
      '/customer-dashboard': {
        customer: [
          {
            id: 'new-booking',
            label: 'New Booking',
            icon: 'Plus',
            action: () => navigate('/booking-flow'),
            variant: 'default'
          },
          {
            id: 'view-bookings',
            label: 'My Bookings',
            icon: 'Calendar',
            action: () => navigate('/customer-dashboard'),
            variant: 'outline'
          }
        ],
        provider: [
          {
            id: 'add-availability',
            label: 'Add Availability',
            icon: 'CalendarPlus',
            action: () => navigate('/calendar-management'),
            variant: 'default'
          },
          {
            id: 'view-bookings',
            label: 'View Bookings',
            icon: 'Calendar',
            action: () => navigate('/calendar-management'),
            variant: 'outline'
          }
        ]
      },
      '/booking-flow': {
        customer: [
          {
            id: 'save-draft',
            label: 'Save Draft',
            icon: 'Save',
            action: () => console.log('Save booking draft'),
            variant: 'outline'
          }
        ]
      },
      '/calendar-management': {
        provider: [
          {
            id: 'quick-block',
            label: 'Block Time',
            icon: 'X',
            action: () => console.log('Quick block time'),
            variant: 'destructive'
          },
          {
            id: 'add-service',
            label: 'Add Service',
            icon: 'Plus',
            action: () => console.log('Add new service'),
            variant: 'default'
          }
        ]
      },
      '/payment-processing': {
        provider: [
          {
            id: 'manual-payment',
            label: 'Manual Payment',
            icon: 'CreditCard',
            action: () => console.log('Process manual payment'),
            variant: 'default'
          }
        ]
      },
      '/notifications-center': {
        provider: [
          {
            id: 'send-message',
            label: 'Send Message',
            icon: 'MessageSquare',
            action: () => console.log('Send new message'),
            variant: 'default'
          }
        ]
      }
    };

    const pageActions = actionMap?.[currentPath];
    return pageActions?.[userRole] || [];
  };

  const actions = getContextualActions();
  const primaryAction = actions?.[0];
  const secondaryActions = actions?.slice(1);

  const handlePrimaryAction = () => {
    if (secondaryActions?.length > 0) {
      setIsExpanded(!isExpanded);
    } else if (primaryAction) {
      if (onActionClick) {
        onActionClick(primaryAction);
      } else {
        primaryAction?.action();
      }
    }
  };

  const handleSecondaryAction = (action) => {
    if (onActionClick) {
      onActionClick(action);
    } else {
      action?.action();
    }
    setIsExpanded(false);
  };

  if (!primaryAction) {
    return null;
  }

  return (
    <div 
      className={`
        quick-action-fab fixed bottom-6 right-6 z-40
        transition-all duration-300 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
        ${className}
      `}
    >
      {/* Secondary Actions */}
      {isExpanded && secondaryActions?.length > 0 && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-scale-in">
          {secondaryActions?.map((action, index) => (
            <div
              key={action?.id}
              className="flex items-center space-x-3"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <span className="bg-popover text-popover-foreground px-3 py-1 rounded-md text-sm font-medium elevation-1 whitespace-nowrap">
                {action?.label}
              </span>
              <button
                onClick={() => handleSecondaryAction(action)}
                className={`
                  flex items-center justify-center w-12 h-12 rounded-full
                  elevation-2 transition-all duration-200 ease-out
                  hover:scale-105 active:scale-95 touch-target
                  ${action?.variant === 'destructive' ?'bg-destructive text-destructive-foreground hover:bg-destructive/90' :'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                  }
                `}
              >
                <Icon name={action?.icon} size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Primary Action Button */}
      <button
        onClick={handlePrimaryAction}
        className={`
          flex items-center justify-center w-14 h-14 rounded-full
          bg-primary text-primary-foreground
          elevation-3 transition-all duration-200 ease-out
          hover:scale-105 hover:elevation-3 active:scale-95
          touch-target
          ${isExpanded ? 'rotate-45' : 'rotate-0'}
        `}
      >
        <Icon 
          name={secondaryActions?.length > 0 ? 'Plus' : primaryAction?.icon} 
          size={24} 
        />
      </button>
      {/* Backdrop for expanded state */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

// Mini FAB for smaller spaces
export const MiniQuickActionFAB = ({
  action,
  className = '',
  size = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    default: 'w-12 h-12',
    lg: 'w-14 h-14'
  };

  const iconSizes = {
    sm: 16,
    default: 20,
    lg: 24
  };

  if (!action) return null;

  return (
    <button
      onClick={action?.action}
      className={`
        ${sizeClasses?.[size]}
        flex items-center justify-center rounded-full
        bg-primary text-primary-foreground
        elevation-2 transition-all duration-200 ease-out
        hover:scale-105 hover:elevation-3 active:scale-95
        touch-target
        ${className}
      `}
    >
      <Icon name={action?.icon} size={iconSizes?.[size]} />
    </button>
  );
};

export default QuickActionFAB;