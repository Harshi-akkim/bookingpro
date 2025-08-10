import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarHeader = ({
  currentDate,
  viewMode,
  onViewModeChange,
  onDateChange,
  onTodayClick,
  onSyncCalendar,
  isSyncing = false
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const viewModes = [
    { id: 'day', label: 'Day', icon: 'Calendar' },
    { id: 'week', label: 'Week', icon: 'CalendarDays' },
    { id: 'month', label: 'Month', icon: 'CalendarRange' }
  ];

  const formatHeaderDate = () => {
    const options = {
      day: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      week: { year: 'numeric', month: 'long', day: 'numeric' },
      month: { year: 'numeric', month: 'long' }
    };
    
    return currentDate?.toLocaleDateString('en-US', options?.[viewMode]);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'day':
        newDate?.setDate(newDate?.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate?.setDate(newDate?.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate?.setMonth(newDate?.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-card border-b border-border">
      {/* Left Section - Navigation */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            onClick={() => navigateDate('prev')}
            className="w-10 h-10"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            onClick={() => navigateDate('next')}
            className="w-10 h-10"
          />
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onTodayClick}
        >
          Today
        </Button>
        
        <div className="relative">
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="flex items-center space-x-2 px-3 py-2 text-lg font-semibold text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <span>{formatHeaderDate()}</span>
            <Icon name="ChevronDown" size={16} />
          </button>
        </div>
      </div>
      {/* Center Section - View Mode Toggle */}
      <div className="flex items-center bg-muted rounded-lg p-1">
        {viewModes?.map((mode) => (
          <button
            key={mode?.id}
            onClick={() => onViewModeChange(mode?.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${viewMode === mode?.id 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }
            `}
          >
            <Icon name={mode?.icon} size={16} />
            <span className="hidden sm:inline">{mode?.label}</span>
          </button>
        ))}
      </div>
      {/* Right Section - Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          iconName={isSyncing ? "Loader2" : "RefreshCw"}
          iconPosition="left"
          onClick={onSyncCalendar}
          disabled={isSyncing}
          className={isSyncing ? "animate-spin" : ""}
        >
          <span className="hidden sm:inline">
            {isSyncing ? 'Syncing...' : 'Sync'}
          </span>
        </Button>
        
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          iconPosition="left"
        >
          <span className="hidden sm:inline">Add Appointment</span>
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;