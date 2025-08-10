import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingAppointments = ({ appointments = [] }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'cancelled':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'cancelled':
        return 'XCircle';
      default:
        return 'Calendar';
    }
  };

  if (appointments?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Upcoming Appointments</h2>
        </div>
        <div className="text-center py-8">
          <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mx-auto mb-4">
            <Icon name="Calendar" size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">No upcoming appointments</p>
          <Button 
            variant="outline" 
            iconName="Plus" 
            iconPosition="left"
            onClick={() => navigate('/booking-flow')}
          >
            Book Your First Appointment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Upcoming Appointments</h2>
        <Button 
          variant="ghost" 
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={() => navigate('/booking-flow')}
        >
          New Booking
        </Button>
      </div>
      <div className="space-y-4">
        {appointments?.slice(0, 3)?.map((appointment) => (
          <div key={appointment?.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
              <Icon name="Calendar" size={20} className="text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-foreground truncate">{appointment?.service}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment?.status)}`}>
                  <Icon name={getStatusIcon(appointment?.status)} size={12} className="mr-1" />
                  {appointment?.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {appointment?.provider} • {appointment?.date} at {appointment?.time}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {appointment?.location}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" iconName="MessageSquare">
                <span className="sr-only">Message</span>
              </Button>
              <Button variant="ghost" size="sm" iconName="MoreVertical">
                <span className="sr-only">More options</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
      {appointments?.length > 3 && (
        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm">
            View All Appointments ({appointments?.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;