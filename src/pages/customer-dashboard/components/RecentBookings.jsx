import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentBookings = ({ bookings = [] }) => {
  const [expandedBooking, setExpandedBooking] = useState(null);
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'completed':
        return 'text-primary bg-primary/10';
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
      case 'completed':
        return 'Check';
      case 'cancelled':
        return 'XCircle';
      default:
        return 'Calendar';
    }
  };

  const canReschedule = (booking) => {
    return ['confirmed', 'pending']?.includes(booking?.status) && 
           new Date(booking.date + ' ' + booking.time) > new Date();
  };

  const canCancel = (booking) => {
    return ['confirmed', 'pending']?.includes(booking?.status) && 
           new Date(booking.date + ' ' + booking.time) > new Date();
  };

  const canReview = (booking) => {
    return booking?.status === 'completed' && !booking?.reviewed;
  };

  const handleAction = (action, booking) => {
    switch (action) {
      case 'reschedule': navigate('/booking-flow', { state: { rescheduleBooking: booking } });
        break;
      case 'cancel': console.log('Cancel booking:', booking?.id);
        break;
      case 'review': console.log('Review booking:', booking?.id);
        break;
      case 'rebook': navigate('/booking-flow', { state: { rebookService: booking?.service } });
        break;
      default:
        break;
    }
  };

  if (bookings?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Bookings</h2>
        <div className="text-center py-8">
          <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mx-auto mb-4">
            <Icon name="History" size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">No booking history yet</p>
          <Button 
            variant="outline" 
            iconName="Plus" 
            iconPosition="left"
            onClick={() => navigate('/booking-flow')}
          >
            Make Your First Booking
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Bookings</h2>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {bookings?.slice(0, 5)?.map((booking) => (
          <div key={booking?.id} className="border border-border rounded-lg overflow-hidden">
            <div 
              className="flex items-center space-x-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpandedBooking(expandedBooking === booking?.id ? null : booking?.id)}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                <Icon name="Calendar" size={20} className="text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-foreground truncate">{booking?.service}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking?.status)}`}>
                    <Icon name={getStatusIcon(booking?.status)} size={12} className="mr-1" />
                    {booking?.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {booking?.provider} • {booking?.date} at {booking?.time}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${booking?.price} • {booking?.duration} min
                </p>
              </div>
              
              <Icon 
                name={expandedBooking === booking?.id ? 'ChevronUp' : 'ChevronDown'} 
                size={20} 
                className="text-muted-foreground" 
              />
            </div>
            
            {expandedBooking === booking?.id && (
              <div className="px-4 pb-4 border-t border-border bg-muted/20">
                <div className="pt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <p className="font-medium text-foreground">{booking?.location}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Booking ID:</span>
                      <p className="font-medium text-foreground">#{booking?.id}</p>
                    </div>
                  </div>
                  
                  {booking?.notes && (
                    <div className="mb-4">
                      <span className="text-sm text-muted-foreground">Notes:</span>
                      <p className="text-sm text-foreground mt-1">{booking?.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {canReschedule(booking) && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        iconName="Calendar"
                        iconPosition="left"
                        onClick={() => handleAction('reschedule', booking)}
                      >
                        Reschedule
                      </Button>
                    )}
                    
                    {canCancel(booking) && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        iconName="X"
                        iconPosition="left"
                        onClick={() => handleAction('cancel', booking)}
                      >
                        Cancel
                      </Button>
                    )}
                    
                    {canReview(booking) && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        iconName="Star"
                        iconPosition="left"
                        onClick={() => handleAction('review', booking)}
                      >
                        Leave Review
                      </Button>
                    )}
                    
                    {booking?.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        iconName="Repeat"
                        iconPosition="left"
                        onClick={() => handleAction('rebook', booking)}
                      >
                        Book Again
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      iconName="MessageSquare"
                      iconPosition="left"
                      onClick={() => navigate('/notifications-center')}
                    >
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBookings;