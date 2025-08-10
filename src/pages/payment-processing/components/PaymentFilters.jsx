import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentFilters = ({ filters, onFiltersChange, onExport, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: filters?.startDate || '',
    endDate: filters?.endDate || ''
  });

  const statusOptions = [
    { value: 'all', label: 'All Status', count: 156 },
    { value: 'completed', label: 'Completed', count: 142 },
    { value: 'pending', label: 'Pending', count: 8 },
    { value: 'failed', label: 'Failed', count: 4 },
    { value: 'refunded', label: 'Refunded', count: 2 }
  ];

  const paymentMethodOptions = [
    { value: 'all', label: 'All Methods', count: 156 },
    { value: 'credit_card', label: 'Credit Card', count: 101 },
    { value: 'debit_card', label: 'Debit Card', count: 39 },
    { value: 'paypal', label: 'PayPal', count: 12 },
    { value: 'bank_transfer', label: 'Bank Transfer', count: 4 }
  ];

  const amountRanges = [
    { value: 'all', label: 'All Amounts' },
    { value: '0-50', label: '$0 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200+', label: '$200+' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleDateRangeChange = (key, value) => {
    const newDateRange = { ...dateRange, [key]: value };
    setDateRange(newDateRange);
    onFiltersChange({ ...filters, ...newDateRange });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.search) count++;
    if (filters?.status && filters?.status !== 'all') count++;
    if (filters?.paymentMethod && filters?.paymentMethod !== 'all') count++;
    if (filters?.amountRange && filters?.amountRange !== 'all') count++;
    if (filters?.startDate || filters?.endDate) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by customer, transaction ID, or amount..."
              value={filters?.search || ''}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            iconName="Filter"
            iconPosition="left"
            onClick={() => setIsExpanded(!isExpanded)}
            className={activeFiltersCount > 0 ? 'border-primary text-primary' : ''}
          >
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export
          </Button>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={onClearFilters}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-border pt-4 space-y-4 animate-slide-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <div className="space-y-2">
                {statusOptions?.map((option) => (
                  <label key={option?.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={option?.value}
                      checked={filters?.status === option?.value || (!filters?.status && option?.value === 'all')}
                      onChange={(e) => handleFilterChange('status', e?.target?.value)}
                      className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-foreground flex-1">{option?.label}</span>
                    <span className="text-xs text-muted-foreground">({option?.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Payment Method</label>
              <div className="space-y-2">
                {paymentMethodOptions?.map((option) => (
                  <label key={option?.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option?.value}
                      checked={filters?.paymentMethod === option?.value || (!filters?.paymentMethod && option?.value === 'all')}
                      onChange={(e) => handleFilterChange('paymentMethod', e?.target?.value)}
                      className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-foreground flex-1">{option?.label}</span>
                    <span className="text-xs text-muted-foreground">({option?.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amount Range Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount Range</label>
              <div className="space-y-2">
                {amountRanges?.map((range) => (
                  <label key={range?.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="amountRange"
                      value={range?.value}
                      checked={filters?.amountRange === range?.value || (!filters?.amountRange && range?.value === 'all')}
                      onChange={(e) => handleFilterChange('amountRange', e?.target?.value)}
                      className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-foreground">{range?.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
              <div className="space-y-3">
                <Input
                  type="date"
                  label="From"
                  value={dateRange?.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e?.target?.value)}
                />
                <Input
                  type="date"
                  label="To"
                  value={dateRange?.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e?.target?.value)}
                />
              </div>
            </div>
          </div>

          {/* Quick Date Filters */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Quick Date Filters</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Today', value: 'today' },
                { label: 'Yesterday', value: 'yesterday' },
                { label: 'Last 7 days', value: 'week' },
                { label: 'Last 30 days', value: 'month' },
                { label: 'This month', value: 'current_month' },
                { label: 'Last month', value: 'last_month' }
              ]?.map((quick) => (
                <Button
                  key={quick?.value}
                  variant={filters?.quickDate === quick?.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('quickDate', quick?.value)}
                >
                  {quick?.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center space-x-2 pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters?.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                Search: "{filters?.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.status && filters?.status !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                Status: {statusOptions?.find(s => s?.value === filters?.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', 'all')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.paymentMethod && filters?.paymentMethod !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                Method: {paymentMethodOptions?.find(m => m?.value === filters?.paymentMethod)?.label}
                <button
                  onClick={() => handleFilterChange('paymentMethod', 'all')}
                  className="ml-1 hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentFilters;