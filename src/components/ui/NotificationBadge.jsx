import React, { useState, useEffect } from 'react';


const NotificationBadge = ({ 
  count = 0, 
  maxCount = 99, 
  showZero = false, 
  size = 'default',
  variant = 'default',
  className = '',
  onClick,
  children 
}) => {
  const [animatedCount, setAnimatedCount] = useState(count);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count !== animatedCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setAnimatedCount(count);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [count, animatedCount]);

  const displayCount = animatedCount > maxCount ? `${maxCount}+` : animatedCount;
  const shouldShowBadge = showZero || animatedCount > 0;

  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    default: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm'
  };

  const variantClasses = {
    default: 'bg-accent text-accent-foreground',
    primary: 'bg-primary text-primary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground'
  };

  const positionClasses = children ? 'absolute -top-1 -right-1' : '';

  if (!shouldShowBadge && children) {
    return (
      <div className={`relative inline-block ${className}`} onClick={onClick}>
        {children}
      </div>
    );
  }

  const badgeElement = shouldShowBadge && (
    <span
      className={`
        ${positionClasses}
        ${sizeClasses?.[size]}
        ${variantClasses?.[variant]}
        inline-flex items-center justify-center
        font-medium rounded-full
        transition-all duration-200 ease-out
        ${isAnimating ? 'scale-125' : 'scale-100'}
        ${className}
      `}
    >
      {displayCount}
    </span>
  );

  if (children) {
    return (
      <div className="relative inline-block" onClick={onClick}>
        {children}
        {badgeElement}
      </div>
    );
  }

  return badgeElement;
};

// Hook for managing notification state
export const useNotifications = (initialCount = 0) => {
  const [count, setCount] = useState(initialCount);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setCount(prev => prev + 1);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(notif => 
        notif?.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev?.map(notif => ({ ...notif, read: true }))
    );
    setCount(0);
  };

  const clearNotification = (notificationId) => {
    const notification = notifications?.find(n => n?.id === notificationId);
    setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
    if (notification && !notification?.read) {
      setCount(prev => Math.max(0, prev - 1));
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setCount(0);
  };

  return {
    count,
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications
  };
};

export default NotificationBadge;