import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickBookingSection = ({ favoriteServices = [] }) => {
  const navigate = useNavigate();

  const handleQuickBook = (service) => {
    navigate('/booking-flow', { state: { preselectedService: service } });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Quick Booking</h2>
        <Button 
          variant="ghost" 
          size="sm"
          iconName="Settings"
          onClick={() => console.log('Manage favorites')}
        >
          <span className="sr-only">Manage favorites</span>
        </Button>
      </div>
      {favoriteServices?.length === 0 ? (
        <div className="text-center py-6">
          <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-full mx-auto mb-3">
            <Icon name="Heart" size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-3">No favorite services yet</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/booking-flow')}
          >
            Browse Services
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteServices?.map((service) => (
            <div key={service?.id} className="group relative overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-all duration-200">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <Icon name={service?.icon} size={32} className="text-primary" />
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-foreground mb-1">{service?.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{service?.duration} min</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary">${service?.price}</span>
                  <Button 
                    size="sm" 
                    onClick={() => handleQuickBook(service)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
              
              <div className="absolute top-2 right-2">
                <button className="flex items-center justify-center w-8 h-8 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors">
                  <Icon name="Heart" size={16} className="text-destructive fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          fullWidth
          iconName="Search"
          iconPosition="left"
          onClick={() => navigate('/booking-flow')}
        >
          Browse All Services
        </Button>
      </div>
    </div>
  );
};

export default QuickBookingSection;