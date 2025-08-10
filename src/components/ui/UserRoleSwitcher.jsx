import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const UserRoleSwitcher = ({
  currentRole = 'customer',
  availableRoles = ['customer', 'provider'],
  onRoleChange,
  user = null,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const roleConfig = {
    customer: {
      label: 'Customer',
      description: 'Book appointments and manage reservations',
      icon: 'User',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    provider: {
      label: 'Service Provider',
      description: 'Manage calendar, bookings, and payments',
      icon: 'Briefcase',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    admin: {
      label: 'Administrator',
      description: 'System administration and user management',
      icon: 'Shield',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target?.closest('.role-switcher')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleRoleSwitch = async (newRole) => {
    if (newRole === currentRole || isTransitioning) return;

    setIsTransitioning(true);
    
    try {
      if (onRoleChange) {
        await onRoleChange(newRole);
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Role switch failed:', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  const currentRoleConfig = roleConfig?.[currentRole];
  const otherRoles = availableRoles?.filter(role => role !== currentRole);

  if (availableRoles?.length <= 1) {
    return null;
  }

  return (
    <div className={`role-switcher relative ${className}`}>
      {/* Current Role Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTransitioning}
        className={`
          flex items-center space-x-3 w-full p-3 rounded-lg border border-border
          hover:bg-muted transition-all duration-200 ease-out
          ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'ring-2 ring-primary/20' : ''}
        `}
      >
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-full
          ${currentRoleConfig?.bgColor}
        `}>
          <Icon 
            name={currentRoleConfig?.icon} 
            size={20} 
            className={currentRoleConfig?.color}
          />
        </div>
        
        <div className="flex-1 text-left">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground">
              {currentRoleConfig?.label}
            </span>
            {isTransitioning && (
              <Icon name="Loader2" size={14} className="animate-spin text-muted-foreground" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {currentRoleConfig?.description}
          </p>
        </div>
        
        <Icon 
          name={isOpen ? 'ChevronUp' : 'ChevronDown'} 
          size={16} 
          className="text-muted-foreground transition-transform duration-200"
        />
      </button>
      {/* Role Options Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg elevation-2 animate-scale-in z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground px-3 py-2 border-b border-border mb-2">
              Switch Role
            </div>
            
            {otherRoles?.map((role) => {
              const config = roleConfig?.[role];
              return (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  disabled={isTransitioning}
                  className={`
                    flex items-center space-x-3 w-full p-3 rounded-md
                    hover:bg-muted transition-all duration-200 ease-out
                    ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full
                    ${config?.bgColor}
                  `}>
                    <Icon 
                      name={config?.icon} 
                      size={16} 
                      className={config?.color}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-sm font-medium text-foreground block">
                      {config?.label}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {config?.description}
                    </p>
                  </div>
                  <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                </button>
              );
            })}
          </div>
          
          {user && (
            <div className="border-t border-border p-3">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Info" size={12} />
                <span>Signed in as {user?.name || user?.email}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Compact version for use in headers/navbars
export const CompactRoleSwitcher = ({
  currentRole = 'customer',
  availableRoles = ['customer', 'provider'],
  onRoleChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const roleConfig = {
    customer: { label: 'Customer', icon: 'User', color: 'text-primary' },
    provider: { label: 'Provider', icon: 'Briefcase', color: 'text-secondary' },
    admin: { label: 'Admin', icon: 'Shield', color: 'text-accent' }
  };

  const handleRoleSwitch = async (newRole) => {
    if (newRole === currentRole || isTransitioning) return;

    setIsTransitioning(true);
    try {
      if (onRoleChange) {
        await onRoleChange(newRole);
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Role switch failed:', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  if (availableRoles?.length <= 1) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTransitioning}
        iconName={isTransitioning ? 'Loader2' : 'RefreshCw'}
        iconPosition="left"
        className={isTransitioning ? 'animate-spin' : ''}
      >
        Switch Role
      </Button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg elevation-2 animate-scale-in z-50">
          <div className="p-2">
            {availableRoles?.filter(role => role !== currentRole)?.map((role) => {
              const config = roleConfig?.[role];
              return (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                >
                  <Icon name={config?.icon} size={16} className={config?.color} />
                  <span>{config?.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoleSwitcher;