import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const NotificationFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  totalCount = 0,
  filteredCount = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'booking_confirmation', label: 'Booking Confirmations' },
    { value: 'reminder', label: 'Reminders' },
    { value: 'cancellation', label: 'Cancellations' },
    { value: 'system_alert', label: 'System Alerts' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'sent', label: 'Sent' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending', label: 'Pending' }
  ];

  const methodOptions = [
    { value: 'all', label: 'All Methods' },
    { value: 'sms', label: 'SMS' },
    { value: 'email', label: 'Email' },
    { value: 'both', label: 'SMS & Email' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last_7_days', label: 'Last 7 days' },
    { value: 'last_30_days', label: 'Last 30 days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value && value !== 'all' && value !== ''
  );

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {filteredCount} of {totalCount} notifications
          </span>
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less' : 'More'} Filters
          </Button>
        </div>
      </div>
      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search notifications by recipient, content, or type..."
          value={filters?.search || ''}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Quick Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Select
          label="Type"
          options={typeOptions}
          value={filters?.type || 'all'}
          onChange={(value) => handleFilterChange('type', value)}
        />
        
        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status || 'all'}
          onChange={(value) => handleFilterChange('status', value)}
        />
        
        <Select
          label="Method"
          options={methodOptions}
          value={filters?.method || 'all'}
          onChange={(value) => handleFilterChange('method', value)}
        />
        
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters?.dateRange || 'last_7_days'}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-border pt-4 animate-slide-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Custom Date Range */}
            {filters?.dateRange === 'custom' && (
              <>
                <Input
                  type="date"
                  label="From Date"
                  value={filters?.fromDate || ''}
                  onChange={(e) => handleFilterChange('fromDate', e?.target?.value)}
                />
                <Input
                  type="date"
                  label="To Date"
                  value={filters?.toDate || ''}
                  onChange={(e) => handleFilterChange('toDate', e?.target?.value)}
                />
              </>
            )}
            
            {/* Recipient Filter */}
            <Input
              type="text"
              label="Recipient"
              placeholder="Filter by recipient email/phone"
              value={filters?.recipient || ''}
              onChange={(e) => handleFilterChange('recipient', e?.target?.value)}
            />
          </div>

          {/* Advanced Options */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters?.failedOnly || false}
                onChange={(e) => handleFilterChange('failedOnly', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-foreground">Failed deliveries only</span>
            </label>
            
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters?.unreadOnly || false}
                onChange={(e) => handleFilterChange('unreadOnly', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-foreground">Unread notifications only</span>
            </label>
            
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters?.highPriority || false}
                onChange={(e) => handleFilterChange('highPriority', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-foreground">High priority only</span>
            </label>
          </div>
        </div>
      )}
      {/* Filter Actions */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">
            {filteredCount} results found
          </span>
          <Button
            variant="outline"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationFilters;