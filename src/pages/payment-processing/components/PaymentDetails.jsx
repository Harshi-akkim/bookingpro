import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentDetails = ({ payment, onClose, onRefund, onSendReceipt, onDispute }) => {
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!payment) return null;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'failed':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'refunded':
        return 'text-muted-foreground bg-muted border-border';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const handleRefund = async () => {
    if (!refundAmount || !refundReason) return;
    
    setIsProcessing(true);
    try {
      await onRefund(payment?.id, {
        amount: parseFloat(refundAmount),
        reason: refundReason
      });
      setShowRefundForm(false);
      setRefundAmount('');
      setRefundReason('');
    } catch (error) {
      console.error('Refund failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const maxRefundAmount = payment?.amount - (payment?.refundAmount || 0);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Payment Details</h3>
          <p className="text-sm text-muted-foreground">Transaction ID: {payment?.transactionId}</p>
        </div>
        <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
      </div>
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Status and Amount */}
        <div className="flex items-center justify-between">
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(payment?.status)}`}>
              {payment?.status}
            </span>
            {payment?.status === 'failed' && (
              <p className="text-sm text-destructive mt-2">{payment?.failureReason}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">${payment?.amount?.toFixed(2)}</p>
            {payment?.refundAmount > 0 && (
              <p className="text-sm text-destructive">-${payment?.refundAmount?.toFixed(2)} refunded</p>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Customer Information</h4>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-primary">
                {payment?.customer?.name?.split(' ')?.map(n => n?.[0])?.join('')}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{payment?.customer?.name}</p>
              <p className="text-sm text-muted-foreground">{payment?.customer?.email}</p>
              <p className="text-sm text-muted-foreground">{payment?.customer?.phone}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="MessageSquare"
              iconPosition="left"
            >
              Contact
            </Button>
          </div>
        </div>

        {/* Service Details */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Service Details</h4>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground">{payment?.service?.name}</p>
              <p className="text-sm text-muted-foreground">{payment?.service?.duration} minutes</p>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{payment?.service?.description}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{formatDate(payment?.appointmentDate)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>{payment?.service?.location}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Payment Method</h4>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="CreditCard" size={20} className="text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">{payment?.paymentMethod}</p>
                <p className="text-sm text-muted-foreground">•••• •••• •••• {payment?.last4}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Processing Fee:</span>
                <span className="ml-2 text-foreground">${payment?.processingFee?.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Net Amount:</span>
                <span className="ml-2 text-foreground">${(payment?.amount - payment?.processingFee)?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Timeline */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Transaction Timeline</h4>
          <div className="space-y-3">
            {payment?.timeline?.map((event, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  event.type === 'success' ? 'bg-success' :
                  event.type === 'warning' ? 'bg-warning' :
                  event.type === 'error' ? 'bg-destructive' : 'bg-muted-foreground'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(event.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Form */}
        {showRefundForm && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Process Refund</h4>
            <div className="space-y-4">
              <Input
                type="number"
                label="Refund Amount"
                placeholder="0.00"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e?.target?.value)}
                description={`Maximum refundable: $${maxRefundAmount?.toFixed(2)}`}
                max={maxRefundAmount}
                step="0.01"
              />
              <Input
                type="text"
                label="Refund Reason"
                placeholder="Enter reason for refund..."
                value={refundReason}
                onChange={(e) => setRefundReason(e?.target?.value)}
                required
              />
              <div className="flex items-center space-x-3">
                <Button
                  variant="destructive"
                  size="sm"
                  loading={isProcessing}
                  onClick={handleRefund}
                  disabled={!refundAmount || !refundReason || parseFloat(refundAmount) > maxRefundAmount}
                >
                  Process Refund
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRefundForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            iconName="Receipt"
            iconPosition="left"
            onClick={() => onSendReceipt(payment?.id)}
          >
            Send Receipt
          </Button>
          
          {payment?.status === 'completed' && maxRefundAmount > 0 && (
            <Button
              variant="destructive"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={() => setShowRefundForm(true)}
            >
              Refund
            </Button>
          )}
          
          {payment?.status === 'failed' && (
            <Button
              variant="outline"
              iconName="AlertTriangle"
              iconPosition="left"
              onClick={() => onDispute(payment?.id)}
            >
              Report Dispute
            </Button>
          )}
          
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
          >
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;