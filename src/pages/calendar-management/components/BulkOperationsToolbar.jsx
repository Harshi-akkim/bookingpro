import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkOperationsToolbar = ({
  selectedAppointments = [],
  onClearSelection,
  onBulkReschedule,
  onBulkCancel,
  onBulkConfirm,
  onBulkExport,
  isVisible = false
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleBulkAction = (action, actionFn) => {
    setConfirmAction({ action, actionFn });
    setShowConfirmDialog(true);
  };

  const executeAction = () => {
    if (confirmAction?.actionFn) {
      confirmAction?.actionFn(selectedAppointments);
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const getActionMessage = () => {
    const count = selectedAppointments?.length;
    const action = confirmAction?.action;
    
    switch (action) {
      case 'cancel':
        return `Are you sure you want to cancel ${count} appointment${count > 1 ? 's' : ''}? This action cannot be undone.`;
      case 'confirm':
        return `Confirm ${count} appointment${count > 1 ? 's' : ''}? Confirmation emails will be sent to customers.`;
      case 'reschedule':
        return `Reschedule ${count} appointment${count > 1 ? 's' : ''}? You'll be able to select new time slots next.`;
      default:
        return `Perform this action on ${count} appointment${count > 1 ? 's' : ''}?`;
    }
  };

  if (!isVisible || selectedAppointments?.length === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Operations Toolbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-slide-up">
        <div className="bg-card border border-border rounded-lg elevation-3 p-4">
          <div className="flex items-center space-x-4">
            {/* Selection Info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-foreground">
                  {selectedAppointments?.length}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {selectedAppointments?.length} appointment{selectedAppointments?.length > 1 ? 's' : ''} selected
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-border" />

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Check"
                iconPosition="left"
                onClick={() => handleBulkAction('confirm', onBulkConfirm)}
              >
                Confirm
              </Button>

              <Button
                variant="outline"
                size="sm"
                iconName="Calendar"
                iconPosition="left"
                onClick={() => handleBulkAction('reschedule', onBulkReschedule)}
              >
                Reschedule
              </Button>

              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => onBulkExport?.(selectedAppointments)}
              >
                Export
              </Button>

              <Button
                variant="destructive"
                size="sm"
                iconName="X"
                iconPosition="left"
                onClick={() => handleBulkAction('cancel', onBulkCancel)}
              >
                Cancel
              </Button>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-border" />

            {/* Clear Selection */}
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClearSelection}
              className="w-8 h-8"
            />
          </div>
        </div>
      </div>
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${confirmAction?.action === 'cancel' ?'bg-destructive/10 text-destructive' :'bg-warning/10 text-warning'
                  }
                `}>
                  <Icon 
                    name={confirmAction?.action === 'cancel' ? 'AlertTriangle' : 'HelpCircle'} 
                    size={24} 
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Confirm Action
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please confirm your selection
                  </p>
                </div>
              </div>

              <p className="text-sm text-foreground mb-6">
                {getActionMessage()}
              </p>

              {/* Selected Appointments Preview */}
              <div className="bg-muted rounded-lg p-3 mb-6 max-h-32 overflow-y-auto">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Selected Appointments:
                </div>
                <div className="space-y-1">
                  {selectedAppointments?.slice(0, 3)?.map((apt, index) => (
                    <div key={index} className="text-xs text-foreground">
                      {apt?.time} - {apt?.customer} ({apt?.title})
                    </div>
                  ))}
                  {selectedAppointments?.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{selectedAppointments?.length - 3} more appointments
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant={confirmAction?.action === 'cancel' ? 'destructive' : 'default'}
                  onClick={executeAction}
                  fullWidth
                >
                  {confirmAction?.action === 'cancel' ? 'Cancel Appointments' : 'Confirm'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkOperationsToolbar;