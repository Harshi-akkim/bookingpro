import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import CalendarHeader from './components/CalendarHeader';
import AvailabilitySettings from './components/AvailabilitySettings';
import CalendarGrid from './components/CalendarGrid';
import AppointmentDetails from './components/AppointmentDetails';
import BulkOperationsToolbar from './components/BulkOperationsToolbar';
import QuickActionFAB from '../../components/ui/QuickActionFAB';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CalendarManagement = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.ctrlKey || e?.metaKey) {
        switch (e?.key) {
          case 'd':
            e?.preventDefault();
            setViewMode('day');
            break;
          case 'w':
            e?.preventDefault();
            setViewMode('week');
            break;
          case 'm':
            e?.preventDefault();
            setViewMode('month');
            break;
          case 't':
            e?.preventDefault();
            handleTodayClick();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleSyncCalendar = async () => {
    setIsSyncing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setSelectedAppointment(null);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedSlot(null);
  };

  const handleSlotDrop = (appointment, slot) => {
    console.log('Rescheduling appointment:', appointment, 'to slot:', slot);
    // Handle appointment rescheduling logic here
  };

  const handleBulkReschedule = (appointments) => {
    console.log('Bulk reschedule:', appointments);
    setSelectedAppointments([]);
  };

  const handleBulkCancel = (appointments) => {
    console.log('Bulk cancel:', appointments);
    setSelectedAppointments([]);
  };

  const handleBulkConfirm = (appointments) => {
    console.log('Bulk confirm:', appointments);
    setSelectedAppointments([]);
  };

  const handleBulkExport = (appointments) => {
    console.log('Bulk export:', appointments);
    // Generate CSV or PDF export
  };

  const customFABActions = [
    {
      id: 'add-appointment',
      label: 'Add Appointment',
      icon: 'Plus',
      action: () => setSelectedSlot({ time: '09:00', available: true }),
      variant: 'default'
    },
    {
      id: 'block-time',
      label: 'Block Time',
      icon: 'X',
      action: () => console.log('Block time slot'),
      variant: 'destructive'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden p-4 border-b border-border">
          <Button
            variant="outline"
            iconName="Menu"
            iconPosition="left"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            fullWidth
          >
            Settings & Tools
          </Button>
        </div>

        {/* Left Sidebar - Availability Settings */}
        <div className={`
          lg:w-80 bg-card border-r border-border overflow-y-auto
          ${showMobileMenu ? 'block' : 'hidden lg:block'}
        `}>
          <div className="p-4 space-y-6">
            <AvailabilitySettings
              onSettingsChange={(settings) => console.log('Settings changed:', settings)}
            />

            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Icon name="BarChart3" size={20} className="text-primary" />
                <span>Today's Overview</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">8</div>
                  <div className="text-xs text-muted-foreground">Appointments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">12</div>
                  <div className="text-xs text-muted-foreground">Available Slots</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">2</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-muted-foreground">4</div>
                  <div className="text-xs text-muted-foreground">Blocked</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Icon name="Activity" size={20} className="text-primary" />
                <span>Recent Activity</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2" />
                  <div className="flex-1">
                    <div className="text-sm text-foreground">New booking confirmed</div>
                    <div className="text-xs text-muted-foreground">John Doe - 2:00 PM today</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                  <div className="flex-1">
                    <div className="text-sm text-foreground">Appointment rescheduled</div>
                    <div className="text-xs text-muted-foreground">Jane Smith - moved to tomorrow</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2" />
                  <div className="flex-1">
                    <div className="text-sm text-foreground">Appointment cancelled</div>
                    <div className="text-xs text-muted-foreground">Mike Johnson - 10:00 AM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Calendar Header */}
          <CalendarHeader
            currentDate={currentDate}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onDateChange={setCurrentDate}
            onTodayClick={handleTodayClick}
            onSyncCalendar={handleSyncCalendar}
            isSyncing={isSyncing}
          />

          {/* Calendar Grid */}
          <div className="flex-1 overflow-auto">
            <CalendarGrid
              viewMode={viewMode}
              currentDate={currentDate}
              onSlotClick={handleSlotClick}
              onAppointmentClick={handleAppointmentClick}
              onSlotDrop={handleSlotDrop}
              selectedSlot={selectedSlot}
            />
          </div>
        </div>

        {/* Right Sidebar - Appointment Details */}
        <div className="lg:w-80 bg-card border-l border-border overflow-y-auto">
          <div className="p-4">
            <AppointmentDetails
              selectedAppointment={selectedAppointment}
              selectedSlot={selectedSlot}
              onClose={() => {
                setSelectedAppointment(null);
                setSelectedSlot(null);
              }}
              onSave={(data) => console.log('Save appointment:', data)}
              onDelete={(appointment) => console.log('Delete appointment:', appointment)}
              onReschedule={(appointment) => console.log('Reschedule appointment:', appointment)}
            />
          </div>
        </div>
      </div>
      {/* Bulk Operations Toolbar */}
      <BulkOperationsToolbar
        selectedAppointments={selectedAppointments}
        isVisible={selectedAppointments?.length > 0}
        onClearSelection={() => setSelectedAppointments([])}
        onBulkReschedule={handleBulkReschedule}
        onBulkCancel={handleBulkCancel}
        onBulkConfirm={handleBulkConfirm}
        onBulkExport={handleBulkExport}
      />
      {/* Quick Action FAB */}
      <QuickActionFAB
        userRole="provider"
        customActions={customFABActions}
        onActionClick={(action) => action?.action()}
      />
      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 left-4 z-30">
        <div className="bg-card border border-border rounded-lg p-2 text-xs text-muted-foreground">
          <div className="font-medium mb-1">Shortcuts:</div>
          <div>Ctrl+D: Day view</div>
          <div>Ctrl+W: Week view</div>
          <div>Ctrl+M: Month view</div>
          <div>Ctrl+T: Today</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarManagement;