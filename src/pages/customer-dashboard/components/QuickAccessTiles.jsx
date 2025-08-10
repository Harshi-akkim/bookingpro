import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickAccessTiles = ({ notificationCount = 0 }) => {
  const navigate = useNavigate();

  const tiles = [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Messages & updates',
      icon: 'Bell',
      color: 'bg-accent text-accent-foreground',
      badge: notificationCount,
      onClick: () => navigate('/notifications-center')
    },
    {
      id: 'payments',
      title: 'Payment Methods',
      description: 'Manage cards & billing',
      icon: 'CreditCard',
      color: 'bg-success text-success-foreground',
      onClick: () => navigate('/payment-processing')
    },
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Update your information',
      icon: 'User',
      color: 'bg-secondary text-secondary-foreground',
      onClick: () => console.log('Navigate to profile')
    },
    {
      id: 'support',
      title: 'Help & Support',
      description: 'Get assistance',
      icon: 'HelpCircle',
      color: 'bg-primary text-primary-foreground',
      onClick: () => console.log('Navigate to support')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles?.map((tile) => (
          <button
            key={tile?.id}
            onClick={tile?.onClick}
            className="relative group p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${tile?.color} mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon name={tile?.icon} size={24} />
              </div>
              
              <h3 className="font-medium text-foreground text-sm mb-1">{tile?.title}</h3>
              <p className="text-xs text-muted-foreground">{tile?.description}</p>
            </div>
            
            {tile?.badge && tile?.badge > 0 && (
              <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs font-medium">
                {tile?.badge > 99 ? '99+' : tile?.badge}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessTiles;