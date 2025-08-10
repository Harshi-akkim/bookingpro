import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ 
  selectedNotifications = [], 
  onBulkAction, 
  onClearSelection,
  totalNotifications = 0 
}) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const bulkActionOptions = [
    { value: '', label: 'Select action...' },
    { value: 'resend', label: 'Resend Selected' },
    { value: 'mark_delivered', label: 'Mark as Delivered' },
    { value: 'mark_failed', label: 'Mark as Failed' },
    { value: 'delete', label: 'Delete Selected' },
    { value: 'export', label: 'Export to CSV' }
  ];

  const handleActionSelect = (action) => {
    setSelectedAction(action);
    if (action === 'delete') {
      setShowConfirmation(true);
    }
  };

  const executeBulkAction = async () => {
    if (!selectedAction || selectedNotifications?.length === 0) return;

    setIsProcessing(true);
    try {
      await onBulkAction(selectedAction, selectedNotifications);
      setSelectedAction('');
      setShowConfirmation(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionDescription = () => {
    switch (selectedAction) {
      case 'resend':
        return `Resend ${selectedNotifications?.length} notification(s)`;
      case 'mark_delivered':
        return `Mark ${selectedNotifications?.length} notification(s) as delivered`;
      case 'mark_failed':
        return `Mark ${selectedNotifications?.length} notification(s) as failed`;
      case 'delete':
        return `Permanently delete ${selectedNotifications?.length} notification(s)`;
      case 'export':
        return `Export ${selectedNotifications?.length} notification(s) to CSV`;
      default:
        return '';
    }
  };

  if (selectedNotifications?.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
              <Icon name="Check" size={16} color="white" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {selectedNotifications?.length} of {totalNotifications} notifications selected
              </p>
              <p className="text-xs text-muted-foreground">
                Choose an action to apply to selected items
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Select
              options={bulkActionOptions}
              value={selectedAction}
              onChange={handleActionSelect}
              placeholder="Select action..."
              className="w-48"
            />
            
            <Button
              variant="default"
              size="sm"
              iconName="Play"
              iconPosition="left"
              onClick={executeBulkAction}
              disabled={!selectedAction || isProcessing}
              loading={isProcessing}
            >
              Execute
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="X"
              onClick={onClearSelection}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Action Preview */}
        {selectedAction && (
          <div className="mt-3 p-3 bg-muted rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={14} className="text-primary" />
              <span className="text-sm text-foreground">
                {getActionDescription()}
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-destructive/10 rounded-full">
                <Icon name="AlertTriangle" size={20} className="text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Confirm Action
                </h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-foreground">
                Are you sure you want to {getActionDescription()?.toLowerCase()}?
              </p>
              {selectedAction === 'delete' && (
                <div className="mt-3 p-3 bg-destructive/10 rounded-md">
                  <p className="text-xs text-destructive">
                    Warning: Deleted notifications cannot be recovered. This will permanently remove all selected notifications from the system.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedAction('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant={selectedAction === 'delete' ? 'destructive' : 'default'}
                iconName="Check"
                iconPosition="left"
                onClick={executeBulkAction}
                loading={isProcessing}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;