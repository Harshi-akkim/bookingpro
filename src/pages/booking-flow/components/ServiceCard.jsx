import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ServiceCard = ({ service, isSelected, onSelect, className = '', fullScreen = false }) => {
  const handleSelect = () => {
    onSelect(service);
  };

  return (
    <div
      onClick={handleSelect}
      className={`
        relative group cursor-pointer transition-all duration-300 ease-out
        ${isSelected 
          ? 'ring-2 ring-primary bg-primary/5 elevation-3' :'hover:elevation-2 hover:scale-[1.02]'
        }
        bg-card border border-border rounded-xl overflow-hidden
        ${fullScreen 
          ? 'h-[70vh] md:h-[75vh] lg:h-[60vh] min-h-[400px]' 
          : 'h-auto'
        }
        ${className}
      `}
    >
      {/* Service Image */}
      <div className={`relative overflow-hidden ${fullScreen ? 'h-3/5' : 'h-48'}`}>
        <Image
          src={service?.image}
          alt={service?.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Duration Badge */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-2 rounded-md text-sm font-medium">
          {service?.duration}
        </div>
        
        {/* Popular Badge */}
        {service?.isPopular && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-2 rounded-md text-sm font-medium">
            Popular
          </div>
        )}

        {/* Full screen mode: Overlay service name on image */}
        {fullScreen && (
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {service?.name}
            </h3>
            <div className="text-right">
              <div className="text-xl md:text-2xl font-bold text-accent-foreground bg-accent px-3 py-1 rounded-md inline-block">
                ${service?.price}
              </div>
              {service?.originalPrice && service?.originalPrice > service?.price && (
                <div className="text-sm text-white/80 line-through ml-2 inline-block">
                  ${service?.originalPrice}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Service Details */}
      <div className={`p-4 ${fullScreen ? 'h-2/5 flex flex-col justify-between' : ''}`}>
        {!fullScreen && (
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {service?.name}
            </h3>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">${service?.price}</div>
              {service?.originalPrice && service?.originalPrice > service?.price && (
                <div className="text-sm text-muted-foreground line-through">
                  ${service?.originalPrice}
                </div>
              )}
            </div>
          </div>
        )}

        <p className={`text-muted-foreground mb-3 ${fullScreen ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>
          {service?.description}
        </p>

        {/* Service Features */}
        <div className="flex flex-wrap gap-2 mb-3">
          {service?.features?.slice(0, fullScreen ? 4 : 3)?.map((feature, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-2 py-1 bg-muted text-muted-foreground rounded-md ${fullScreen ? 'text-sm' : 'text-xs'}`}
            >
              <Icon name="Check" size={fullScreen ? 14 : 12} className="mr-1" />
              {feature}
            </span>
          ))}
          {service?.features?.length > (fullScreen ? 4 : 3) && (
            <span className={`text-muted-foreground ${fullScreen ? 'text-sm' : 'text-xs'}`}>
              +{service?.features?.length - (fullScreen ? 4 : 3)} more
            </span>
          )}
        </div>

        {/* Rating and Booking Count */}
        <div className={`flex items-center justify-between ${fullScreen ? 'text-base mt-auto' : 'text-sm'}`}>
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={fullScreen ? 16 : 14} className="text-accent fill-current" />
            <span className="font-medium">{service?.rating}</span>
            <span className="text-muted-foreground">({service?.reviewCount})</span>
          </div>
          <div className="text-muted-foreground">
            {service?.bookingCount} bookings
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className={`absolute ${fullScreen ? 'top-6 left-6 w-8 h-8' : 'top-4 left-4 w-6 h-6'} bg-primary rounded-full flex items-center justify-center`}>
            <Icon name="Check" size={fullScreen ? 18 : 14} color="white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;