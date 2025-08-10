import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarView = ({ 
  selectedDate, 
  onDateSelect, 
  selectedTimeSlot, 
  onTimeSlotSelect, 
  provider,
  className = '' 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState({});
  const [lockedSlots, setLockedSlots] = useState(new Set());

  // Mock available time slots for each date
  useEffect(() => {
    const generateSlots = () => {
      const slots = {};
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date?.setDate(today?.getDate() + i);
        const dateKey = date?.toISOString()?.split('T')?.[0];
        
        // Generate random available slots
        const timeSlots = [];
        const startHour = 9;
        const endHour = 17;
        
        for (let hour = startHour; hour < endHour; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            if (Math.random() > 0.3) { // 70% chance of availability
              const time = `${hour?.toString()?.padStart(2, '0')}:${minute?.toString()?.padStart(2, '0')}`;
              timeSlots?.push({
                time,
                available: Math.random() > 0.1, // 90% available, 10% booked
                price: provider?.basePrice || 75
              });
            }
          }
        }
        slots[dateKey] = timeSlots;
      }
      return slots;
    };

    setAvailableSlots(generateSlots());
  }, [provider]);

  // Simulate real-time slot locking
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance every 3 seconds
        const dates = Object.keys(availableSlots);
        const randomDate = dates?.[Math.floor(Math.random() * dates?.length)];
        const slots = availableSlots?.[randomDate];
        if (slots && slots?.length > 0) {
          const randomSlot = slots?.[Math.floor(Math.random() * slots?.length)];
          const slotKey = `${randomDate}-${randomSlot?.time}`;
          setLockedSlots(prev => new Set([...prev, slotKey]));
          
          // Remove lock after 30 seconds
          setTimeout(() => {
            setLockedSlots(prev => {
              const newSet = new Set(prev);
              newSet?.delete(slotKey);
              return newSet;
            });
          }, 30000);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [availableSlots]);

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date) => {
    if (!date) return false;
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    
    if (date < today) return false;
    
    const dateKey = date?.toISOString()?.split('T')?.[0];
    const slots = availableSlots?.[dateKey];
    return slots && slots?.some(slot => slot?.available);
  };

  const getDateSlotCount = (date) => {
    if (!date) return 0;
    const dateKey = date?.toISOString()?.split('T')?.[0];
    const slots = availableSlots?.[dateKey];
    return slots ? slots?.filter(slot => slot?.available)?.length : 0;
  };

  const handleDateClick = (date) => {
    if (isDateAvailable(date)) {
      onDateSelect(date);
    }
  };

  const handleTimeSlotClick = (slot) => {
    const dateKey = selectedDate?.toISOString()?.split('T')?.[0];
    const slotKey = `${dateKey}-${slot?.time}`;
    
    if (!lockedSlots?.has(slotKey) && slot?.available) {
      onTimeSlotSelect(slot);
    }
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDateSlots = selectedDate ? availableSlots?.[selectedDate?.toISOString()?.split('T')?.[0]] || [] : [];

  return (
    <div className={`bg-card rounded-xl border border-border p-6 ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Select Date & Time
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="ChevronLeft"
            onClick={() => navigateMonth(-1)}
          />
          <span className="text-sm font-medium min-w-[120px] text-center">
            {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            iconName="ChevronRight"
            onClick={() => navigateMonth(1)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Grid */}
        <div>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames?.map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days?.map((date, index) => {
              if (!date) {
                return <div key={index} className="aspect-square" />;
              }

              const isAvailable = isDateAvailable(date);
              const isSelected = selectedDate && date?.toDateString() === selectedDate?.toDateString();
              const slotCount = getDateSlotCount(date);
              const isToday = date?.toDateString() === new Date()?.toDateString();

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={!isAvailable}
                  className={`
                    aspect-square flex flex-col items-center justify-center text-sm rounded-lg
                    transition-all duration-200 ease-out relative
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary/20' 
                      : isAvailable 
                        ? 'bg-success/10 text-success hover:bg-success/20 cursor-pointer' :'bg-muted text-muted-foreground cursor-not-allowed'
                    }
                    ${isToday ? 'ring-1 ring-accent' : ''}
                  `}
                >
                  <span className="font-medium">{date?.getDate()}</span>
                  {isAvailable && slotCount > 0 && (
                    <span className="text-xs opacity-75">{slotCount}</span>
                  )}
                  {isToday && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success/20 rounded" />
              <span className="text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-muted rounded" />
              <span className="text-muted-foreground">Unavailable</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary rounded" />
              <span className="text-muted-foreground">Selected</span>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h4 className="text-md font-medium text-foreground mb-4">
            {selectedDate 
              ? `Available Times - ${selectedDate?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}` 
              : 'Select a date to view available times'
            }
          </h4>

          {selectedDate ? (
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {selectedDateSlots?.map((slot, index) => {
                const dateKey = selectedDate?.toISOString()?.split('T')?.[0];
                const slotKey = `${dateKey}-${slot?.time}`;
                const isLocked = lockedSlots?.has(slotKey);
                const isSelected = selectedTimeSlot?.time === slot?.time;

                return (
                  <button
                    key={index}
                    onClick={() => handleTimeSlotClick(slot)}
                    disabled={!slot?.available || isLocked}
                    className={`
                      p-3 rounded-lg text-sm font-medium transition-all duration-200 ease-out
                      ${isSelected 
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary/20' 
                        : slot?.available && !isLocked
                          ? 'bg-success/10 text-success hover:bg-success/20 cursor-pointer' :'bg-muted text-muted-foreground cursor-not-allowed'
                      }
                      ${isLocked ? 'animate-pulse' : ''}
                    `}
                  >
                    <div>{slot?.time}</div>
                    <div className="text-xs opacity-75">${slot?.price}</div>
                    {isLocked && (
                      <div className="text-xs text-warning">Temporarily locked</div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <Icon name="Calendar" size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a date to view available time slots</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Real-time Updates Indicator */}
      <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
        <Icon name="Wifi" size={12} className="mr-1" />
        <span>Real-time availability updates</span>
      </div>
    </div>
  );
};

export default CalendarView;