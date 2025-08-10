import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCard = ({ 
  notification, 
  onResend, 
  onEdit, 
  onToggleExpand,
  isExpanded = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return { name: 'Send', color: 'text-primary' };
      case 'delivered':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'failed':
        return { name: 'XCircle', color: 'text-destructive' };
      case 'pending':
        return { name: 'Clock', color: 'text-warning' };
      default:
        return { name: 'AlertCircle', color: 'text-muted-foreground' };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'booking_confirmation':
        return { name: 'Calendar', color: 'text-primary' };
      case 'reminder':
        return { name: 'Bell', color: 'text-warning' };
      case 'cancellation':
        return { name: 'X', color: 'text-destructive' };
      case 'system_alert':
        return { name: 'AlertTriangle', color: 'text-accent' };
      default:
        return { name: 'MessageSquare', color: 'text-muted-foreground' };
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor((now - date) / (1000 * 60));
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date?.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await onResend(notification?.id);
    } finally {
      setIsLoading(false);
    }
  };

  const statusIcon = getStatusIcon(notification?.status);
  const typeIcon = getTypeIcon(notification?.type);

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:elevation-1 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full bg-muted ${typeIcon?.color}`}>
            <Icon name={typeIcon?.name} size={16} />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-foreground">
                {notification?.title}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                notification?.type === 'booking_confirmation' ? 'bg-primary/10 text-primary' :
                notification?.type === 'reminder' ? 'bg-warning/10 text-warning' :
                notification?.type === 'cancellation'? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'
              }`}>
                {notification?.type?.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              To: {notification?.recipient}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${statusIcon?.color}`}>
            <Icon name={statusIcon?.name} size={14} />
            <span className="text-xs font-medium capitalize">
              {notification?.status}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(notification?.timestamp)}
          </span>
        </div>
      </div>
      {/* Content Preview */}
      <div className="mb-3">
        <p className="text-sm text-foreground line-clamp-2">
          {notification?.content}
        </p>
        {notification?.content?.length > 100 && (
          <button
            onClick={() => onToggleExpand(notification?.id)}
            className="text-xs text-primary hover:text-primary/80 mt-1 transition-colors"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      {/* Expanded Content */}
      {isExpanded && (
        <div className="mb-3 p-3 bg-muted rounded-md">
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {notification?.fullContent || notification?.content}
          </p>
          {notification?.deliveryDetails && (
            <div className="mt-3 pt-3 border-t border-border">
              <h4 className="text-xs font-medium text-foreground mb-2">Delivery Details</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Method:</span>
                  <span className="ml-1 text-foreground capitalize">
                    {notification?.deliveryDetails?.method}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Attempts:</span>
                  <span className="ml-1 text-foreground">
                    {notification?.deliveryDetails?.attempts}
                  </span>
                </div>
                {notification?.deliveryDetails?.openRate && (
                  <div>
                    <span className="text-muted-foreground">Open Rate:</span>
                    <span className="ml-1 text-foreground">
                      {notification?.deliveryDetails?.openRate}%
                    </span>
                  </div>
                )}
                {notification?.deliveryDetails?.clickRate && (
                  <div>
                    <span className="text-muted-foreground">Click Rate:</span>
                    <span className="ml-1 text-foreground">
                      {notification?.deliveryDetails?.clickRate}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={handleResend}
            loading={isLoading}
            disabled={notification?.status === 'delivered'}
          >
            Resend
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={() => onEdit(notification)}
          >
            Edit Template
          </Button>
        </div>
        
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="Smartphone" size={12} />
          <span>{notification?.deliveryMethod}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;