import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('customer'); // customer or provider
  const [notificationCount, setNotificationCount] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target?.closest('.profile-menu') && !event.target?.closest('.profile-button')) {
        setIsProfileMenuOpen(false);
      }
      if (!event.target?.closest('.mobile-menu') && !event.target?.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/customer-dashboard',
      icon: 'LayoutDashboard',
      roles: ['customer', 'provider']
    },
    {
      label: 'Book Now',
      path: '/booking-flow',
      icon: 'Calendar',
      roles: ['customer']
    },
    {
      label: 'Calendar',
      path: '/calendar-management',
      icon: 'CalendarDays',
      roles: ['provider']
    },
    {
      label: 'Payments',
      path: '/payment-processing',
      icon: 'CreditCard',
      roles: ['provider']
    },
    {
      label: 'Messages',
      path: '/notifications-center',
      icon: 'MessageSquare',
      roles: ['provider'],
      badge: notificationCount
    }
  ];

  const visibleNavItems = navigationItems?.filter(item => 
    item?.roles?.includes(userRole)
  )?.slice(0, 4);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleRoleSwitch = (newRole) => {
    setUserRole(newRole);
    setIsProfileMenuOpen(false);
    // Navigate to appropriate dashboard
    navigate(newRole === 'customer' ? '/customer-dashboard' : '/calendar-management');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border elevation-1">
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 mr-8">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Calendar" size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-foreground">BookingPro</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 flex-1">
          {visibleNavItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`relative flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth touch-target ${
                isActive(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
              {item?.badge && item?.badge > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-accent rounded-full">
                  {item?.badge > 99 ? '99+' : item?.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Quick Action Button */}
          <Button
            variant="outline"
            size="sm"
            iconName={userRole === 'customer' ? 'Plus' : 'CalendarPlus'}
            iconPosition="left"
            onClick={() => handleNavigation(userRole === 'customer' ? '/booking-flow' : '/calendar-management')}
          >
            {userRole === 'customer' ? 'New Booking' : 'Add Slot'}
          </Button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              className="profile-button flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-smooth touch-target"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {isProfileMenuOpen && (
              <div className="profile-menu absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg elevation-2 animate-scale-in">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-muted-foreground mr-2">Role:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      userRole === 'provider' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground'
                    }`}>
                      {userRole === 'provider' ? 'Service Provider' : 'Customer'}
                    </span>
                  </div>
                </div>
                
                <div className="p-2">
                  <button
                    onClick={() => handleRoleSwitch(userRole === 'customer' ? 'provider' : 'customer')}
                    className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-smooth"
                  >
                    <Icon name="RefreshCw" size={16} className="mr-3" />
                    Switch to {userRole === 'customer' ? 'Provider' : 'Customer'}
                  </button>
                  
                  <button className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-smooth">
                    <Icon name="Settings" size={16} className="mr-3" />
                    Settings
                  </button>
                  
                  <button className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-smooth">
                    <Icon name="HelpCircle" size={16} className="mr-3" />
                    Help & Support
                  </button>
                  
                  <div className="border-t border-border mt-2 pt-2">
                    <button 
                      onClick={() => navigate('/login-register')}
                      className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-muted rounded-md transition-smooth"
                    >
                      <Icon name="LogOut" size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button md:hidden p-2 rounded-md hover:bg-muted transition-smooth touch-target"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
        </button>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu md:hidden border-t border-border bg-card animate-slide-in">
          <div className="p-4 space-y-2">
            {visibleNavItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`relative flex items-center space-x-3 w-full px-4 py-3 rounded-md text-sm font-medium transition-smooth touch-target ${
                  isActive(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
                {item?.badge && item?.badge > 0 && (
                  <span className="ml-auto flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-accent rounded-full">
                    {item?.badge > 99 ? '99+' : item?.badge}
                  </span>
                )}
              </button>
            ))}
            
            <div className="border-t border-border pt-4 mt-4">
              <Button
                variant="outline"
                fullWidth
                iconName={userRole === 'customer' ? 'Plus' : 'CalendarPlus'}
                iconPosition="left"
                onClick={() => handleNavigation(userRole === 'customer' ? '/booking-flow' : '/calendar-management')}
                className="mb-3"
              >
                {userRole === 'customer' ? 'New Booking' : 'Add Slot'}
              </Button>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">John Doe</p>
                    <p className="text-xs text-muted-foreground">
                      {userRole === 'provider' ? 'Service Provider' : 'Customer'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRoleSwitch(userRole === 'customer' ? 'provider' : 'customer')}
                  className="p-2 rounded-md hover:bg-background transition-smooth"
                >
                  <Icon name="RefreshCw" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;