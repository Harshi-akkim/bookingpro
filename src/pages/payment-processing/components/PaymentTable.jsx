import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentTable = ({ 
  payments, 
  onPaymentSelect, 
  selectedPayments, 
  onBulkAction,
  sortConfig,
  onSort 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'failed':
        return 'text-destructive bg-destructive/10';
      case 'refunded':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit card':
        return 'CreditCard';
      case 'debit card':
        return 'CreditCard';
      case 'paypal':
        return 'Wallet';
      case 'bank transfer':
        return 'Building2';
      default:
        return 'CreditCard';
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onPaymentSelect(payments?.map(p => p?.id));
    } else {
      onPaymentSelect([]);
    }
  };

  const handleRowSelect = (paymentId, checked) => {
    if (checked) {
      onPaymentSelect([...selectedPayments, paymentId]);
    } else {
      onPaymentSelect(selectedPayments?.filter(id => id !== paymentId));
    }
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) {
      return 'ArrowUpDown';
    }
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAllSelected = selectedPayments?.length === payments?.length && payments?.length > 0;
  const isPartiallySelected = selectedPayments?.length > 0 && selectedPayments?.length < payments?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedPayments?.length > 0 && (
        <div className="bg-primary/5 border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedPayments?.length} payment{selectedPayments?.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => onBulkAction('export')}
              >
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Receipt"
                iconPosition="left"
                onClick={() => onBulkAction('receipt')}
              >
                Send Receipts
              </Button>
              <Button
                variant="destructive"
                size="sm"
                iconName="RotateCcw"
                iconPosition="left"
                onClick={() => onBulkAction('refund')}
              >
                Bulk Refund
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-6 py-4">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartiallySelected;
                  }}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
              </th>
              {[
                { key: 'date', label: 'Date & Time' },
                { key: 'customer', label: 'Customer' },
                { key: 'service', label: 'Service' },
                { key: 'amount', label: 'Amount' },
                { key: 'status', label: 'Status' },
                { key: 'method', label: 'Payment Method' }
              ]?.map((column) => (
                <th
                  key={column?.key}
                  className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => onSort(column?.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column?.label}</span>
                    <Icon name={getSortIcon(column?.key)} size={14} />
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {payments?.map((payment) => (
              <tr
                key={payment?.id}
                className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                  selectedPayments?.includes(payment?.id) ? 'bg-primary/5' : ''
                }`}
                onMouseEnter={() => setHoveredRow(payment?.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onPaymentSelect([payment?.id])}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPayments?.includes(payment?.id)}
                    onChange={(e) => {
                      e?.stopPropagation();
                      handleRowSelect(payment?.id, e?.target?.checked);
                    }}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">{formatDate(payment?.date)}</div>
                  <div className="text-xs text-muted-foreground">ID: {payment?.transactionId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {payment?.customer?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{payment?.customer?.name}</div>
                      <div className="text-xs text-muted-foreground">{payment?.customer?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">{payment?.service?.name}</div>
                  <div className="text-xs text-muted-foreground">{payment?.service?.duration} min</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">${payment?.amount?.toFixed(2)}</div>
                  {payment?.refundAmount > 0 && (
                    <div className="text-xs text-destructive">-${payment?.refundAmount?.toFixed(2)} refunded</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment?.status)}`}>
                    {payment?.status}
                  </span>
                  {payment?.status === 'failed' && (
                    <div className="text-xs text-muted-foreground mt-1" title={payment?.failureReason}>
                      {payment?.failureReason}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Icon name={getPaymentMethodIcon(payment?.paymentMethod)} size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">{payment?.paymentMethod}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">•••• {payment?.last4}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`flex items-center justify-end space-x-1 transition-opacity ${
                    hoveredRow === payment?.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onPaymentSelect([payment?.id]);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Receipt"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onBulkAction('receipt', [payment?.id]);
                      }}
                    />
                    {payment?.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="RotateCcw"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onBulkAction('refund', [payment?.id]);
                        }}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Empty State */}
      {payments?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="CreditCard" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No payments found</h3>
          <p className="text-muted-foreground">No payment transactions match your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;