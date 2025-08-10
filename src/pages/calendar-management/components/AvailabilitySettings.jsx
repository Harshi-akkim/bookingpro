import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AvailabilitySettings = ({ onSettingsChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [workingHours, setWorkingHours] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '10:00', end: '14:00' },
    sunday: { enabled: false, start: '10:00', end: '14:00' }
  });

  const [slotDuration, setSlotDuration] = useState(30);
  const [bufferTime, setBufferTime] = useState(15);
  const [maxAdvanceBooking, setMaxAdvanceBooking] = useState(30);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday', short: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { key: 'thursday', label: 'Thursday', short: 'Thu' },
    { key: 'friday', label: 'Friday', short: 'Fri' },
    { key: 'saturday', label: 'Saturday', short: 'Sat' },
    { key: 'sunday', label: 'Sunday', short: 'Sun' }
  ];

  const handleDayToggle = (day) => {
    const updatedHours = {
      ...workingHours,
      [day]: {
        ...workingHours?.[day],
        enabled: !workingHours?.[day]?.enabled
      }
    };
    setWorkingHours(updatedHours);
    onSettingsChange?.(updatedHours);
  };

  const handleTimeChange = (day, field, value) => {
    const updatedHours = {
      ...workingHours,
      [day]: {
        ...workingHours?.[day],
        [field]: value
      }
    };
    setWorkingHours(updatedHours);
    onSettingsChange?.(updatedHours);
  };

  const applyToAllDays = () => {
    const mondaySettings = workingHours?.monday;
    const updatedHours = {};
    
    daysOfWeek?.forEach(day => {
      updatedHours[day.key] = { ...mondaySettings };
    });
    
    setWorkingHours(updatedHours);
    onSettingsChange?.(updatedHours);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Availability Settings</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-8 h-8"
        />
      </div>
      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* General Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">General Settings</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Slot Duration (minutes)"
                type="number"
                value={slotDuration}
                onChange={(e) => setSlotDuration(parseInt(e?.target?.value))}
                min="15"
                max="120"
                step="15"
              />
              
              <Input
                label="Buffer Time (minutes)"
                type="number"
                value={bufferTime}
                onChange={(e) => setBufferTime(parseInt(e?.target?.value))}
                min="0"
                max="60"
                step="5"
              />
            </div>
            
            <Input
              label="Max Advance Booking (days)"
              type="number"
              value={maxAdvanceBooking}
              onChange={(e) => setMaxAdvanceBooking(parseInt(e?.target?.value))}
              min="1"
              max="365"
            />
          </div>

          {/* Working Hours */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Working Hours</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={applyToAllDays}
                className="text-xs"
              >
                Apply Monday to All
              </Button>
            </div>
            
            <div className="space-y-3">
              {daysOfWeek?.map((day) => (
                <div key={day?.key} className="flex items-center space-x-3">
                  <Checkbox
                    checked={workingHours?.[day?.key]?.enabled}
                    onChange={() => handleDayToggle(day?.key)}
                  />
                  
                  <div className="w-16 text-sm font-medium text-foreground">
                    {day?.short}
                  </div>
                  
                  {workingHours?.[day?.key]?.enabled ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <Input
                        type="time"
                        value={workingHours?.[day?.key]?.start}
                        onChange={(e) => handleTimeChange(day?.key, 'start', e?.target?.value)}
                        className="flex-1"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={workingHours?.[day?.key]?.end}
                        onChange={(e) => handleTimeChange(day?.key, 'end', e?.target?.value)}
                        className="flex-1"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 text-sm text-muted-foreground">
                      Closed
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
            
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                iconName="X"
                iconPosition="left"
                fullWidth
              >
                Block Time Slot
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                iconName="Copy"
                iconPosition="left"
                fullWidth
              >
                Copy This Week
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                iconName="Calendar"
                iconPosition="left"
                fullWidth
              >
                Set Holiday
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilitySettings;