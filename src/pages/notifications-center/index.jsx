import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import NotificationCard from './components/NotificationCard';
import NotificationFilters from './components/NotificationFilters';
import TemplateEditor from './components/TemplateEditor';
import NotificationStats from './components/NotificationStats';
import BulkActions from './components/BulkActions';
import NotificationSettings from './components/NotificationSettings';

const NotificationsCenter = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [expandedNotifications, setExpandedNotifications] = useState(new Set());
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    method: 'all',
    dateRange: 'last_7_days'
  });
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockNotifications = [
    {
      id: 1,
      title: "Appointment Confirmation",
      type: "booking_confirmation",
      recipient: "john.doe@email.com",
      content: "Hi John, your appointment with Dr. Smith on August 15, 2025 at 2:30 PM has been confirmed.",
      fullContent: `Hi John,\n\nYour appointment with Dr. Smith on August 15, 2025 at 2:30 PM has been confirmed.\n\nAppointment Details:\n- Service: Dental Cleaning\n- Provider: Dr. Smith\n- Date: August 15, 2025\n- Time: 2:30 PM\n- Location: BookingPro Clinic\n\nIf you need to reschedule or cancel, please contact us at least 24 hours in advance.\n\nThank you!`,
      status: "delivered",
      deliveryMethod: "Email",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      deliveryDetails: {
        method: "email",
        attempts: 1,
        openRate: 85,
        clickRate: 12
      }
    },
    {
      id: 2,
      title: "Appointment Reminder",
      type: "reminder",
      recipient: "+1-555-0123",
      content: "Reminder: You have an appointment tomorrow at 10:00 AM with Dr. Johnson. Reply CANCEL to cancel.",
      status: "sent",
      deliveryMethod: "SMS",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      deliveryDetails: {
        method: "sms",
        attempts: 1
      }
    },
    {
      id: 3,
      title: "Cancellation Notice",
      type: "cancellation",
      recipient: "sarah.wilson@email.com",
      content: "Your appointment scheduled for August 12, 2025 has been cancelled. Please reschedule at your convenience.",
      status: "failed",
      deliveryMethod: "Email",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      deliveryDetails: {
        method: "email",
        attempts: 3,
        openRate: 0,
        clickRate: 0
      }
    },
    {
      id: 4,
      title: "System Alert",
      type: "system_alert",
      recipient: "admin@bookingpro.com",
      content: "High volume of failed SMS deliveries detected. Please check Twilio configuration.",
      status: "delivered",
      deliveryMethod: "Email",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      deliveryDetails: {
        method: "email",
        attempts: 1,
        openRate: 100,
        clickRate: 25
      }
    },
    {
      id: 5,
      title: "Payment Reminder",
      type: "reminder",
      recipient: "+1-555-0456",
      content: "Payment due for your recent appointment. Please visit our payment portal to complete payment.",
      status: "pending",
      deliveryMethod: "SMS",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      deliveryDetails: {
        method: "sms",
        attempts: 0
      }
    }
  ];

  const mockStats = {
    total: 1247,
    delivered: 1156,
    failed: 45,
    pending: 46,
    sms: 623,
    email: 624,
    openRate: 78,
    clickRate: 15,
    avgDeliveryTime: 2.3,
    templates: 12
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
      setFilteredNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = notifications;

    if (filters?.search) {
      filtered = filtered?.filter(notification =>
        notification?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        notification?.recipient?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        notification?.content?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.type !== 'all') {
      filtered = filtered?.filter(notification => notification?.type === filters?.type);
    }

    if (filters?.status !== 'all') {
      filtered = filtered?.filter(notification => notification?.status === filters?.status);
    }

    if (filters?.method !== 'all') {
      filtered = filtered?.filter(notification => 
        notification?.deliveryMethod?.toLowerCase()?.includes(filters?.method)
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, filters]);

  const handleNotificationSelect = (notificationId, isSelected) => {
    setSelectedNotifications(prev => 
      isSelected 
        ? [...prev, notificationId]
        : prev?.filter(id => id !== notificationId)
    );
  };

  const handleSelectAll = (isSelected) => {
    setSelectedNotifications(isSelected ? filteredNotifications?.map(n => n?.id) : []);
  };

  const handleToggleExpand = (notificationId) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(notificationId)) {
        newSet?.delete(notificationId);
      } else {
        newSet?.add(notificationId);
      }
      return newSet;
    });
  };

  const handleResendNotification = async (notificationId) => {
    // Mock resend functionality
    console.log('Resending notification:', notificationId);
    
    // Update notification status
    setNotifications(prev => 
      prev?.map(notification => 
        notification?.id === notificationId 
          ? { ...notification, status: 'sent', timestamp: new Date() }
          : notification
      )
    );
  };

  const handleEditTemplate = (notification) => {
    setEditingTemplate({
      id: notification?.id,
      name: `${notification?.type?.replace('_', ' ')} Template`,
      type: notification?.type,
      content: notification?.content,
      method: notification?.deliveryMethod?.toLowerCase()
    });
    setShowTemplateEditor(true);
  };

  const handleSaveTemplate = async (templateData) => {
    console.log('Saving template:', templateData);
    setShowTemplateEditor(false);
    setEditingTemplate(null);
  };

  const handleBulkAction = async (action, notificationIds) => {
    console.log('Bulk action:', action, notificationIds);
    
    switch (action) {
      case 'resend':
        setNotifications(prev => 
          prev?.map(notification => 
            notificationIds?.includes(notification?.id)
              ? { ...notification, status: 'sent', timestamp: new Date() }
              : notification
          )
        );
        break;
      case 'mark_delivered':
        setNotifications(prev => 
          prev?.map(notification => 
            notificationIds?.includes(notification?.id)
              ? { ...notification, status: 'delivered' }
              : notification
          )
        );
        break;
      case 'delete':
        setNotifications(prev => 
          prev?.filter(notification => !notificationIds?.includes(notification?.id))
        );
        break;
      default:
        break;
    }
    
    setSelectedNotifications([]);
  };

  const handleSaveSettings = async (settings) => {
    console.log('Saving settings:', settings);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="flex items-center space-x-3">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="text-lg text-foreground">Loading notifications...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications Center</h1>
            <p className="text-muted-foreground mt-1">
              Manage automated reminders, confirmations, and system alerts
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Settings"
              iconPosition="left"
              onClick={() => setShowSettings(true)}
            >
              Settings
            </Button>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => {
                setEditingTemplate(null);
                setShowTemplateEditor(true);
              }}
            >
              New Template
            </Button>
          </div>
        </div>

        {/* Stats */}
        <NotificationStats stats={mockStats} />

        {/* Filters */}
        <NotificationFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={() => setFilters({
            search: '',
            type: 'all',
            status: 'all',
            method: 'all',
            dateRange: 'last_7_days'
          })}
          totalCount={notifications?.length}
          filteredCount={filteredNotifications?.length}
        />

        {/* Bulk Actions */}
        <BulkActions
          selectedNotifications={selectedNotifications}
          onBulkAction={handleBulkAction}
          onClearSelection={() => setSelectedNotifications([])}
          totalNotifications={filteredNotifications?.length}
        />

        {/* Notifications List */}
        <div className="bg-card border border-border rounded-lg">
          {/* List Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedNotifications?.length === filteredNotifications?.length && filteredNotifications?.length > 0}
                onChange={(e) => handleSelectAll(e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-foreground">
                {filteredNotifications?.length} notifications
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="RefreshCw"
                onClick={() => window.location?.reload()}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="divide-y divide-border">
            {filteredNotifications?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Icon name="Bell" size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No notifications found
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {filters?.search || filters?.type !== 'all' || filters?.status !== 'all' ?'Try adjusting your filters to see more results.' :'Notifications will appear here when they are sent to customers.'}
                </p>
              </div>
            ) : (
              filteredNotifications?.map((notification) => (
                <div key={notification?.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedNotifications?.includes(notification?.id)}
                      onChange={(e) => handleNotificationSelect(notification?.id, e?.target?.checked)}
                      className="mt-1 rounded border-border"
                    />
                    <div className="flex-1">
                      <NotificationCard
                        notification={notification}
                        onResend={handleResendNotification}
                        onEdit={handleEditTemplate}
                        onToggleExpand={handleToggleExpand}
                        isExpanded={expandedNotifications?.has(notification?.id)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Template Editor Modal */}
      <TemplateEditor
        template={editingTemplate}
        onSave={handleSaveTemplate}
        onCancel={() => {
          setShowTemplateEditor(false);
          setEditingTemplate(null);
        }}
        isVisible={showTemplateEditor}
      />
      {/* Settings Modal */}
      <NotificationSettings
        settings={{}}
        onSave={handleSaveSettings}
        onClose={() => setShowSettings(false)}
        isVisible={showSettings}
      />
    </div>
  );
};

export default NotificationsCenter;