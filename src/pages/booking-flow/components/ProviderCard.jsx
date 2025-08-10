import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProviderCard = ({ provider, isSelected, onSelect, className = '' }) => {
  const [showVenueTour, setShowVenueTour] = useState(false);

  const handleSelect = () => {
    onSelect(provider);
  };

  const handleVenueTour = (e) => {
    e?.stopPropagation();
    setShowVenueTour(true);
  };

  return (
    <>
      <div
        onClick={handleSelect}
        className={`
          relative group cursor-pointer transition-all duration-300 ease-out
          ${isSelected 
            ? 'ring-2 ring-primary bg-primary/5 elevation-3' :'hover:elevation-2 hover:scale-[1.02]'
          }
          bg-card border border-border rounded-xl overflow-hidden
          ${className}
        `}
      >
        {/* Provider Image */}
        <div className="relative h-32 overflow-hidden">
          <Image
            src={provider?.image}
            alt={provider?.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Availability Status */}
          <div className={`
            absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium
            ${provider?.isAvailable 
              ? 'bg-success text-success-foreground' 
              : 'bg-muted text-muted-foreground'
            }
          `}>
            {provider?.isAvailable ? 'Available' : 'Busy'}
          </div>

          {/* Featured Badge */}
          {provider?.isFeatured && (
            <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">
              Featured
            </div>
          )}
        </div>

        {/* Provider Details */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {provider?.name}
              </h3>
              <p className="text-sm text-muted-foreground">{provider?.title}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} className="text-accent fill-current" />
                <span className="font-medium text-sm">{provider?.rating}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {provider?.reviewCount} reviews
              </div>
            </div>
          </div>

          {/* Experience and Specialties */}
          <div className="mb-3">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={12} />
                <span>{provider?.experience} years</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={12} />
                <span>{provider?.location}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {provider?.specialties?.slice(0, 2)?.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                >
                  {specialty}
                </span>
              ))}
              {provider?.specialties?.length > 2 && (
                <span className="text-xs text-muted-foreground px-2 py-1">
                  +{provider?.specialties?.length - 2} more
                </span>
              )}
            </div>
          </div>

          {/* Next Available */}
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-muted-foreground">Next available:</span>
            <span className="font-medium text-foreground">{provider?.nextAvailable}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Eye"
              iconPosition="left"
              onClick={handleVenueTour}
              className="flex-1"
            >
              Venue Tour
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="MessageCircle"
              className="px-3"
            >
            </Button>
          </div>

          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute top-4 left-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Check" size={14} color="white" />
            </div>
          )}
        </div>
      </div>
      {/* 3D Venue Tour Modal */}
      {showVenueTour && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold">3D Venue Tour - {provider?.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setShowVenueTour(false)}
              />
            </div>
            <div className="p-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Icon name="Play" size={48} className="text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">3D Venue Tour</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Interactive tour of {provider?.name}'s facility
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {provider?.venueImages?.map((image, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`Venue ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProviderCard;