import React from 'react';
import Icon from '../../../components/AppIcon';

const NotificationStats = ({ stats }) => {
  const statCards = [
    {
      id: 'total',
      label: 'Total Sent',
      value: stats?.total || 0,
      icon: 'Send',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'delivered',
      label: 'Delivered',
      value: stats?.delivered || 0,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      percentage: stats?.total ? Math.round((stats?.delivered / stats?.total) * 100) : 0
    },
    {
      id: 'failed',
      label: 'Failed',
      value: stats?.failed || 0,
      icon: 'XCircle',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      percentage: stats?.total ? Math.round((stats?.failed / stats?.total) * 100) : 0
    },
    {
      id: 'pending',
      label: 'Pending',
      value: stats?.pending || 0,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const deliveryStats = [
    {
      id: 'sms',
      label: 'SMS',
      value: stats?.sms || 0,
      icon: 'Smartphone',
      color: 'text-accent'
    },
    {
      id: 'email',
      label: 'Email',
      value: stats?.email || 0,
      icon: 'Mail',
      color: 'text-secondary'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Main Stats */}
      {statCards?.map((stat) => (
        <div
          key={stat?.id}
          className="bg-card border border-border rounded-lg p-4 hover:elevation-1 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-full ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            {stat?.percentage !== undefined && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat?.percentage > 90 ? 'bg-success/10 text-success' :
                stat?.percentage > 70 ? 'bg-warning/10 text-warning': 'bg-destructive/10 text-destructive'
              }`}>
                {stat?.percentage}%
              </span>
            )}
          </div>
          
          <div>
            <p className="text-2xl font-bold text-foreground mb-1">
              {stat?.value?.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {stat?.label}
            </p>
          </div>

          {/* Trend indicator */}
          {stat?.id === 'delivered' && (
            <div className="flex items-center mt-2 text-xs">
              <Icon name="TrendingUp" size={12} className="text-success mr-1" />
              <span className="text-success">+12% from last week</span>
            </div>
          )}
          
          {stat?.id === 'failed' && stats?.failed > 0 && (
            <div className="flex items-center mt-2 text-xs">
              <Icon name="AlertTriangle" size={12} className="text-warning mr-1" />
              <span className="text-warning">Needs attention</span>
            </div>
          )}
        </div>
      ))}
      {/* Delivery Method Stats - spans remaining columns */}
      <div className="md:col-span-2 lg:col-span-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
            <Icon name="BarChart3" size={16} className="mr-2" />
            Delivery Methods
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {deliveryStats?.map((method) => (
              <div key={method?.id} className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
                  <Icon name={method?.icon} size={16} className={method?.color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {method?.label}
                    </span>
                    <span className="text-sm text-foreground">
                      {method?.value?.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        method?.id === 'sms' ? 'bg-accent' : 'bg-secondary'
                      }`}
                      style={{
                        width: `${stats?.total ? (method?.value / stats?.total) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {stats?.openRate || 0}%
              </p>
              <p className="text-xs text-muted-foreground">Open Rate</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {stats?.clickRate || 0}%
              </p>
              <p className="text-xs text-muted-foreground">Click Rate</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {stats?.avgDeliveryTime || 0}s
              </p>
              <p className="text-xs text-muted-foreground">Avg Delivery</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {stats?.templates || 0}
              </p>
              <p className="text-xs text-muted-foreground">Templates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationStats;