import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ConfirmationScreen = ({ 
  bookingData, 
  onAddToCalendar, 
  onSendConfirmation,
  className = '' 
}) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Animation delay
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    // Auto-send confirmation
    const confirmationTimer = setTimeout(() => {
      handleSendConfirmation();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(confirmationTimer);
    };
  }, []);

  const handleSendConfirmation = async () => {
    try {
      if (onSendConfirmation) {
        await onSendConfirmation(bookingData);
      }
      setConfirmationSent(true);
    } catch (error) {
      console.error('Failed to send confirmation:', error);
    }
  };

  const handleAddToCalendar = () => {
    if (onAddToCalendar) {
      onAddToCalendar(bookingData);
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateCalendarLink = () => {
    const startDate = new Date(`${bookingData.date} ${bookingData.time}`);
    const endDate = new Date(startDate.getTime() + (60 * 60 * 1000)); // 1 hour duration
    
    const formatCalendarDate = (date) => {
      return date?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0] + 'Z';
    };

    const title = encodeURIComponent(`${bookingData?.service?.name} - ${bookingData?.provider?.name}`);
    const details = encodeURIComponent(`Appointment with ${bookingData?.provider?.name}\nService: ${bookingData?.service?.name}\nLocation: ${bookingData?.provider?.location}`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}&details=${details}`;
  };

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Success Animation */}
      <div className="text-center mb-8">
        <div className={`
          inline-flex items-center justify-center w-20 h-20 rounded-full bg-success text-success-foreground mb-4
          transition-all duration-500 ease-out
          ${isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}
        `}>
          <Icon name="Check" size={32} />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-lg text-muted-foreground">
          Your appointment has been successfully booked
        </p>
      </div>
      {/* Booking Details Card */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6 elevation-1">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Calendar" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Appointment Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service & Provider */}
          <div className="space-y-4">
            <div className="flex space-x-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={bookingData?.service?.image}
                  alt={bookingData?.service?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{bookingData?.service?.name}</h3>
                <p className="text-sm text-muted-foreground">{bookingData?.service?.duration}</p>
                <p className="text-sm font-medium text-primary">${bookingData?.service?.price}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={bookingData?.provider?.image}
                  alt={bookingData?.provider?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{bookingData?.provider?.name}</h4>
                <p className="text-sm text-muted-foreground">{bookingData?.provider?.title}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Icon name="Star" size={12} className="text-accent fill-current" />
                  <span className="text-xs font-medium">{bookingData?.provider?.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={16} className="text-primary" />
                  <span className="font-medium text-foreground">
                    {formatDate(bookingData?.date)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-primary" />
                  <span className="font-medium text-foreground">
                    {bookingData?.time}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={16} className="text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {bookingData?.provider?.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Reference */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Booking Reference:</span>
                <span className="font-mono font-medium text-foreground">
                  {bookingData?.bookingId || 'BK-' + Date.now()?.toString()?.slice(-6)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Confirmation Status */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Confirmation Status</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center
              ${confirmationSent ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}
            `}>
              {confirmationSent ? (
                <Icon name="Check" size={14} />
              ) : (
                <Icon name="Clock" size={14} />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">Email Confirmation</p>
              <p className="text-sm text-muted-foreground">
                {confirmationSent 
                  ? `Sent to ${bookingData?.customer?.email}` 
                  : 'Sending confirmation email...'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center
              ${confirmationSent ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}
            `}>
              {confirmationSent ? (
                <Icon name="Check" size={14} />
              ) : (
                <Icon name="Clock" size={14} />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">SMS Reminder</p>
              <p className="text-sm text-muted-foreground">
                {confirmationSent 
                  ? `Sent to ${bookingData?.customer?.phone}` 
                  : 'Setting up SMS reminders...'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button
          variant="outline"
          size="lg"
          iconName="Calendar"
          iconPosition="left"
          onClick={handleAddToCalendar}
          fullWidth
        >
          Add to Calendar
        </Button>

        <Button
          variant="outline"
          size="lg"
          iconName="Share"
          iconPosition="left"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Appointment Confirmation',
                text: `Appointment booked with ${bookingData?.provider?.name} on ${formatDate(bookingData?.date)} at ${bookingData?.time}`,
                url: window.location?.href
              });
            }
          }}
          fullWidth
        >
          Share Details
        </Button>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          iconName="MessageCircle"
          iconPosition="left"
          fullWidth
        >
          Message Provider
        </Button>

        <Button
          variant="ghost"
          size="sm"
          iconName="MapPin"
          iconPosition="left"
          fullWidth
        >
          Get Directions
        </Button>

        <Button
          variant="ghost"
          size="sm"
          iconName="Phone"
          iconPosition="left"
          fullWidth
        >
          Call Provider
        </Button>
      </div>
      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          size="lg"
          iconName="ArrowLeft"
          iconPosition="left"
          onClick={() => navigate('/customer-dashboard')}
          fullWidth
        >
          View My Bookings
        </Button>

        <Button
          variant="default"
          size="lg"
          iconName="Plus"
          iconPosition="left"
          onClick={() => navigate('/booking-flow')}
          fullWidth
        >
          Book Another Appointment
        </Button>
      </div>
      {/* Important Notes */}
      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Important Notes:</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Please arrive 10 minutes early for your appointment</li>
              <li>• Bring a valid ID and any relevant documents</li>
              <li>• You can reschedule or cancel up to 24 hours in advance</li>
              <li>• Contact the provider directly for any special requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;