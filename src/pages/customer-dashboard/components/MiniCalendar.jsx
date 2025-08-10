import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const MiniCalendar = ({ bookedDates = [], onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const year = currentDate?.getFullYear();
  const month = currentDate?.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth?.getDay();
  const daysInMonth = lastDayOfMonth?.getDate();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const navigateMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };
  
  const isToday = (day) => {
    return today?.getDate() === day && 
           today?.getMonth() === month && 
           today?.getFullYear() === year;
  };
  
  const getBookingStatus = (day) => {
    const dateStr = `${year}-${String(month + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
    return bookedDates?.find(booking => booking?.date === dateStr);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return '';
    }
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days?.push(<div key={`empty-${i}`} className="h-8"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const booking = getBookingStatus(day);
      const isPast = new Date(year, month, day) < today;
      
      days?.push(
        <button
          key={day}
          onClick={() => onDateClick && onDateClick(new Date(year, month, day))}
          disabled={isPast}
          className={`
            relative h-8 w-8 rounded-md text-sm font-medium transition-all duration-200
            hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20
            ${isToday(day) ? 'bg-primary text-primary-foreground' : ''}
            ${booking ? getStatusColor(booking?.status) : 'text-foreground hover:text-foreground'}
            ${isPast ? 'text-muted-foreground opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {day}
          {booking && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full"></div>
          )}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Calendar</h2>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            iconName="ChevronLeft"
            onClick={() => navigateMonth(-1)}
          >
            <span className="sr-only">Previous month</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="ChevronRight"
            onClick={() => navigateMonth(1)}
          >
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-center font-medium text-foreground">
          {monthNames?.[month]} {year}
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames?.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
      {bookedDates?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-muted-foreground">Confirmed</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                <span className="text-muted-foreground">Cancelled</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCalendar;