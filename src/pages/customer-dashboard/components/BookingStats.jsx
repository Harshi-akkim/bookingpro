import React from 'react';
import Icon from '../../../components/AppIcon';

const BookingStats = ({ stats = {} }) => {
  const defaultStats = {
    totalBookings: 0,
    completedBookings: 0,
    upcomingBookings: 0,
    cancelledBookings: 0,
    totalSpent: 0,
    favoriteService: null,
    ...stats
  };

  const statCards = [
    {
      id: 'total',
      title: 'Total Bookings',
      value: defaultStats?.totalBookings,
      icon: 'Calendar',
      color: 'text-primary bg-primary/10'
    },
    {
      id: 'completed',
      title: 'Completed',
      value: defaultStats?.completedBookings,
      icon: 'CheckCircle',
      color: 'text-success bg-success/10'
    },
    {
      id: 'upcoming',
      title: 'Upcoming',
      value: defaultStats?.upcomingBookings,
      icon: 'Clock',
      color: 'text-warning bg-warning/10'
    },
    {
      id: 'spent',
      title: 'Total Spent',
      value: `$${defaultStats?.totalSpent?.toFixed(2)}`,
      icon: 'DollarSign',
      color: 'text-accent bg-accent/10'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Your Stats</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {statCards?.map((stat) => (
          <div key={stat?.id} className="text-center p-4 rounded-lg bg-muted/30">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${stat?.color} mb-2`}>
              <Icon name={stat?.icon} size={20} />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat?.value}</p>
            <p className="text-xs text-muted-foreground">{stat?.title}</p>
          </div>
        ))}
      </div>
      {defaultStats?.favoriteService && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
              <Icon name="Heart" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Favorite Service</p>
              <p className="text-xs text-muted-foreground">{defaultStats?.favoriteService}</p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Member since</span>
          <span>January 2024</span>
        </div>
      </div>
    </div>
  );
};

export default BookingStats;