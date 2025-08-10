import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookingSummary = ({ 
  service, 
  provider, 
  selectedDate, 
  selectedTimeSlot, 
  formData,
  className = '',
  isSticky = false 
}) => {
  if (!service) return null;

  const formatDate = (date) => {
    if (!date) return '';
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotal = () => {
    const basePrice = selectedTimeSlot?.price || service?.price;
    const tax = basePrice * 0.08; // 8% tax
    const serviceFee = 2.99;
    return {
      subtotal: basePrice,
      tax: tax,
      serviceFee: serviceFee,
      total: basePrice + tax + serviceFee
    };
  };

  const pricing = calculateTotal();

  return (
    <div className={`
      bg-card border border-border rounded-xl p-6 
      ${isSticky ? 'sticky top-24' : ''}
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="FileText" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Booking Summary</h3>
      </div>
      {/* Service Details */}
      <div className="space-y-4">
        {/* Service */}
        <div className="flex space-x-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={service?.image}
              alt={service?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{service?.name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {service?.description}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Icon name="Clock" size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{service?.duration}</span>
            </div>
          </div>
        </div>

        {/* Provider */}
        {provider && (
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={provider?.image}
                alt={provider?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">{provider?.name}</p>
              <p className="text-xs text-muted-foreground">{provider?.title}</p>
              <div className="flex items-center space-x-1 mt-1">
                <Icon name="Star" size={12} className="text-accent fill-current" />
                <span className="text-xs font-medium">{provider?.rating}</span>
                <span className="text-xs text-muted-foreground">({provider?.reviewCount})</span>
              </div>
            </div>
          </div>
        )}

        {/* Date & Time */}
        {selectedDate && selectedTimeSlot && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Calendar" size={16} className="text-primary" />
              <span className="font-medium text-foreground">Appointment Details</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{selectedTimeSlot?.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{service?.duration}</span>
              </div>
            </div>
          </div>
        )}

        {/* Customer Details */}
        {formData && (formData?.firstName || formData?.email) && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="User" size={16} className="text-primary" />
              <span className="font-medium text-foreground">Customer Details</span>
            </div>
            <div className="space-y-1 text-sm">
              {(formData?.firstName || formData?.lastName) && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">
                    {formData?.firstName} {formData?.lastName}
                  </span>
                </div>
              )}
              {formData?.email && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium text-xs">{formData?.email}</span>
                </div>
              )}
              {formData?.phone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{formData?.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Special Requests */}
        {formData?.specialRequests && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="MessageSquare" size={16} className="text-primary" />
              <span className="font-medium text-foreground">Special Requests</span>
            </div>
            <p className="text-sm text-muted-foreground">{formData?.specialRequests}</p>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="border-t border-border pt-4">
          <h4 className="font-medium text-foreground mb-3">Price Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service fee:</span>
              <span>${pricing?.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform fee:</span>
              <span>${pricing?.serviceFee?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (8%):</span>
              <span>${pricing?.tax?.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span className="text-primary">${pricing?.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={12} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Cancellation Policy</p>
              <p>Free cancellation up to 24 hours before your appointment. Cancellations within 24 hours may incur a 50% fee.</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            iconName="HelpCircle"
            iconPosition="left"
          >
            Need help? Contact support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;