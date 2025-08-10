import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const CalendarGrid = ({
  viewMode,
  currentDate,
  appointments = [],
  availableSlots = [],
  onSlotClick,
  onAppointmentClick,
  onSlotDrop,
  selectedSlot = null
}) => {
  const [draggedAppointment, setDraggedAppointment] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const gridRef = useRef(null);

  // Mock data for appointments
  const mockAppointments = [
    {
      id: 1,
      title: "Dr. Smith - Consultation",
      customer: "John Doe",
      time: "09:00",
      duration: 60,
      status: "confirmed",
      type: "consultation",
      date: "2025-08-01"
    },
    {
      id: 2,
      title: "Dental Cleaning",
      customer: "Jane Smith",
      time: "10:30",
      duration: 45,
      status: "pending",
      type: "cleaning",
      date: "2025-08-01"
    },
    {
      id: 3,
      title: "Follow-up Appointment",
      customer: "Mike Johnson",
      time: "14:00",
      duration: 30,
      status: "confirmed",
      type: "followup",
      date: "2025-08-01"
    },
    {
      id: 4,
      title: "Emergency Consultation",
      customer: "Sarah Wilson",
      time: "16:00",
      duration: 90,
      status: "urgent",
      type: "emergency",
      date: "2025-08-02"
    }
  ];

  // Generate time slots for the day
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 18;
    const slotDuration = 30; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const timeString = `${hour?.toString()?.padStart(2, '0')}:${minute?.toString()?.padStart(2, '0')}`;
        slots?.push({
          time: timeString,
          available: Math.random() > 0.3, // 70% available
          blocked: Math.random() > 0.9 // 10% blocked
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getSlotStatus = (slot) => {
    const hasAppointment = mockAppointments?.some(apt => apt?.time === slot?.time);
    if (hasAppointment) return 'booked';
    if (slot?.blocked) return 'blocked';
    if (slot?.available) return 'available';
    return 'unavailable';
  };

  const getSlotClasses = (slot) => {
    const status = getSlotStatus(slot);
    const isSelected = selectedSlot?.time === slot?.time;
    const isDragOver = dragOverSlot === slot?.time;
    
    const baseClasses = `
      relative p-3 border border-border rounded-lg cursor-pointer
      transition-all duration-200 ease-out min-h-[60px]
      ${isSelected ? 'ring-2 ring-primary' : ''}
      ${isDragOver ? 'ring-2 ring-accent scale-105' : ''}
    `;

    switch (status) {
      case 'available':
        return `${baseClasses} bg-success/10 border-success/30 hover:bg-success/20`;
      case 'booked':
        return `${baseClasses} bg-primary/10 border-primary/30 hover:bg-primary/20`;
      case 'blocked':
        return `${baseClasses} bg-destructive/10 border-destructive/30 hover:bg-destructive/20`;
      default:
        return `${baseClasses} bg-muted border-muted-foreground/20 hover:bg-muted/80`;
    }
  };

  const handleDragStart = (e, appointment) => {
    setDraggedAppointment(appointment);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, slot) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot(slot?.time);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e, slot) => {
    e?.preventDefault();
    if (draggedAppointment && getSlotStatus(slot) === 'available') {
      onSlotDrop?.(draggedAppointment, slot);
    }
    setDraggedAppointment(null);
    setDragOverSlot(null);
  };

  const renderAppointmentCard = (appointment) => {
    const statusColors = {
      confirmed: 'bg-primary text-primary-foreground',
      pending: 'bg-warning text-warning-foreground',
      urgent: 'bg-destructive text-destructive-foreground'
    };

    return (
      <div
        key={appointment?.id}
        draggable
        onDragStart={(e) => handleDragStart(e, appointment)}
        onClick={() => onAppointmentClick?.(appointment)}
        className={`
          ${statusColors?.[appointment?.status] || 'bg-secondary text-secondary-foreground'}
          p-2 rounded-md cursor-move hover:scale-105 transition-transform
          text-xs font-medium shadow-sm
        `}
      >
        <div className="flex items-center space-x-1 mb-1">
          <Icon name="Clock" size={12} />
          <span>{appointment?.time}</span>
          <span>({appointment?.duration}min)</span>
        </div>
        <div className="font-semibold truncate">{appointment?.customer}</div>
        <div className="opacity-90 truncate">{appointment?.title}</div>
      </div>
    );
  };

  const renderDayView = () => (
    <div className="grid grid-cols-1 gap-2 p-4">
      {timeSlots?.map((slot) => {
        const slotAppointments = mockAppointments?.filter(apt => apt?.time === slot?.time);
        
        return (
          <div
            key={slot?.time}
            className={getSlotClasses(slot)}
            onClick={() => onSlotClick?.(slot)}
            onDragOver={(e) => handleDragOver(e, slot)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, slot)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{slot?.time}</span>
              <div className="flex items-center space-x-1">
                {getSlotStatus(slot) === 'available' && (
                  <Icon name="Plus" size={14} className="text-success" />
                )}
                {getSlotStatus(slot) === 'blocked' && (
                  <Icon name="X" size={14} className="text-destructive" />
                )}
              </div>
            </div>
            {slotAppointments?.length > 0 && (
              <div className="space-y-1">
                {slotAppointments?.map(renderAppointmentCard)}
              </div>
            )}
            {getSlotStatus(slot) === 'available' && slotAppointments?.length === 0 && (
              <div className="text-xs text-muted-foreground">Available</div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderWeekView = () => {
    const weekDays = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek?.setDate(currentDate?.getDate() - currentDate?.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day?.setDate(startOfWeek?.getDate() + i);
      weekDays?.push(day);
    }

    return (
      <div className="grid grid-cols-7 gap-2 p-4">
        {weekDays?.map((day, index) => (
          <div key={index} className="space-y-2">
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">
                {day?.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-lg font-semibold text-foreground">
                {day?.getDate()}
              </div>
            </div>
            
            <div className="space-y-1 min-h-[400px]">
              {timeSlots?.slice(0, 8)?.map((slot) => {
                const dayAppointments = mockAppointments?.filter(apt => 
                  apt?.date === day?.toISOString()?.split('T')?.[0] && apt?.time === slot?.time
                );
                
                return (
                  <div
                    key={`${day?.toISOString()}-${slot?.time}`}
                    className={`${getSlotClasses(slot)} min-h-[40px] p-2`}
                    onClick={() => onSlotClick?.({ ...slot, date: day })}
                  >
                    <div className="text-xs text-muted-foreground mb-1">{slot?.time}</div>
                    {dayAppointments?.map(apt => (
                      <div key={apt?.id} className="text-xs bg-primary text-primary-foreground p-1 rounded truncate">
                        {apt?.customer}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate?.setDate(startDate?.getDate() - startDate?.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= monthEnd || days?.length < 42) {
      days?.push(new Date(current));
      current?.setDate(current?.getDate() + 1);
    }

    return (
      <div className="p-4">
        {/* Month header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']?.map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days?.map((day, index) => {
            const isCurrentMonth = day?.getMonth() === currentDate?.getMonth();
            const isToday = day?.toDateString() === new Date()?.toDateString();
            const dayAppointments = mockAppointments?.filter(apt => 
              apt?.date === day?.toISOString()?.split('T')?.[0]
            );
            
            return (
              <div
                key={index}
                className={`
                  min-h-[100px] p-2 border border-border rounded-lg cursor-pointer
                  transition-colors hover:bg-muted
                  ${!isCurrentMonth ? 'opacity-50' : ''}
                  ${isToday ? 'ring-2 ring-primary' : ''}
                `}
                onClick={() => onSlotClick?.({ date: day })}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : 'text-foreground'}`}>
                  {day?.getDate()}
                </div>
                <div className="space-y-1">
                  {dayAppointments?.slice(0, 3)?.map(apt => (
                    <div key={apt?.id} className="text-xs bg-primary text-primary-foreground p-1 rounded truncate">
                      {apt?.time} {apt?.customer}
                    </div>
                  ))}
                  {dayAppointments?.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayAppointments?.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={gridRef} className="bg-card border border-border rounded-lg overflow-hidden">
      {viewMode === 'day' && renderDayView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'month' && renderMonthView()}
    </div>
  );
};

export default CalendarGrid;