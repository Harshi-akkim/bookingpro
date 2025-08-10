import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationSettings = ({ 
  settings, 
  onSave, 
  isVisible = false, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    reminderTiming: {
      booking_confirmation: { enabled: true, timing: 'immediate' },
      reminder_24h: { enabled: true, timing: '24_hours' },
      reminder_2h: { enabled: true, timing: '2_hours' },
      cancellation: { enabled: true, timing: 'immediate' }
    },
    deliveryMethods: {
      sms: { enabled: true, priority: 1 },
      email: { enabled: true, priority: 2 }
    },
    twilioSettings: {
      accountSid: '',
      authToken: '',
      phoneNumber: '',
      webhookUrl: ''
    },
    emailSettings: {
      provider: 'smtp',
      smtpHost: '',
      smtpPort: 587,
      username: '',
      password: '',
      fromEmail: '',
      fromName: ''
    },
    businessHours: {
      enabled: true,
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'America/New_York'
    },
    retrySettings: {
      maxRetries: 3,
      retryInterval: 30,
      backoffMultiplier: 2
    }
  });
  const [activeTab, setActiveTab] = useState('timing');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'timing', label: 'Timing', icon: 'Clock' },
    { id: 'delivery', label: 'Delivery', icon: 'Send' },
    { id: 'twilio', label: 'Twilio SMS', icon: 'Smartphone' },
    { id: 'email', label: 'Email', icon: 'Mail' },
    { id: 'business', label: 'Business Hours', icon: 'Calendar' },
    { id: 'advanced', label: 'Advanced', icon: 'Settings' }
  ];

  const timingOptions = [
    { value: 'immediate', label: 'Immediately' },
    { value: '5_minutes', label: '5 minutes before' },
    { value: '15_minutes', label: '15 minutes before' },
    { value: '30_minutes', label: '30 minutes before' },
    { value: '1_hour', label: '1 hour before' },
    { value: '2_hours', label: '2 hours before' },
    { value: '24_hours', label: '24 hours before' },
    { value: '48_hours', label: '48 hours before' }
  ];

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' }
  ];

  const emailProviders = [
    { value: 'smtp', label: 'SMTP' },
    { value: 'sendgrid', label: 'SendGrid' },
    { value: 'mailgun', label: 'Mailgun' },
    { value: 'ses', label: 'Amazon SES' }
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [subsection]: {
          ...prev?.[section]?.[subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (type) => {
    // Mock test connection
    console.log(`Testing ${type} connection...`);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Notification Settings
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Configure automated reminders and delivery preferences
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 border-r border-border bg-muted/30 p-4">
            <nav className="space-y-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Timing Settings */}
            {activeTab === 'timing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Reminder Timing
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(formData?.reminderTiming)?.map(([key, config]) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={config?.enabled}
                            onChange={(e) => handleNestedChange('reminderTiming', key, 'enabled', e?.target?.checked)}
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {key?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {key === 'booking_confirmation' && 'Sent when booking is confirmed'}
                              {key === 'reminder_24h' && 'Sent 24 hours before appointment'}
                              {key === 'reminder_2h' && 'Sent 2 hours before appointment'}
                              {key === 'cancellation' && 'Sent when booking is cancelled'}
                            </p>
                          </div>
                        </div>
                        <div className="w-48">
                          <Select
                            options={timingOptions}
                            value={config?.timing}
                            onChange={(value) => handleNestedChange('reminderTiming', key, 'timing', value)}
                            disabled={!config?.enabled}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Settings */}
            {activeTab === 'delivery' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Delivery Methods
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(formData?.deliveryMethods)?.map(([method, config]) => (
                      <div key={method} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={config?.enabled}
                            onChange={(e) => handleNestedChange('deliveryMethods', method, 'enabled', e?.target?.checked)}
                          />
                          <div className="flex items-center space-x-2">
                            <Icon name={method === 'sms' ? 'Smartphone' : 'Mail'} size={16} />
                            <div>
                              <p className="text-sm font-medium text-foreground capitalize">
                                {method}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {method === 'sms' ? 'Text message notifications' : 'Email notifications'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="w-32">
                          <Input
                            type="number"
                            label="Priority"
                            min="1"
                            max="10"
                            value={config?.priority}
                            onChange={(e) => handleNestedChange('deliveryMethods', method, 'priority', parseInt(e?.target?.value))}
                            disabled={!config?.enabled}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Twilio Settings */}
            {activeTab === 'twilio' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Twilio SMS Configuration
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Configure Twilio for SMS delivery
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="TestTube"
                    iconPosition="left"
                    onClick={() => testConnection('twilio')}
                  >
                    Test Connection
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Account SID"
                    type="password"
                    placeholder="Enter Twilio Account SID"
                    value={formData?.twilioSettings?.accountSid}
                    onChange={(e) => handleInputChange('twilioSettings', 'accountSid', e?.target?.value)}
                  />
                  <Input
                    label="Auth Token"
                    type="password"
                    placeholder="Enter Twilio Auth Token"
                    value={formData?.twilioSettings?.authToken}
                    onChange={(e) => handleInputChange('twilioSettings', 'authToken', e?.target?.value)}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+1234567890"
                    value={formData?.twilioSettings?.phoneNumber}
                    onChange={(e) => handleInputChange('twilioSettings', 'phoneNumber', e?.target?.value)}
                  />
                  <Input
                    label="Webhook URL"
                    placeholder="https://your-domain.com/webhook"
                    value={formData?.twilioSettings?.webhookUrl}
                    onChange={(e) => handleInputChange('twilioSettings', 'webhookUrl', e?.target?.value)}
                  />
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Email Configuration
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Configure email delivery settings
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="TestTube"
                    iconPosition="left"
                    onClick={() => testConnection('email')}
                  >
                    Test Connection
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Email Provider"
                    options={emailProviders}
                    value={formData?.emailSettings?.provider}
                    onChange={(value) => handleInputChange('emailSettings', 'provider', value)}
                  />
                  <Input
                    label="SMTP Host"
                    placeholder="smtp.gmail.com"
                    value={formData?.emailSettings?.smtpHost}
                    onChange={(e) => handleInputChange('emailSettings', 'smtpHost', e?.target?.value)}
                  />
                  <Input
                    label="SMTP Port"
                    type="number"
                    placeholder="587"
                    value={formData?.emailSettings?.smtpPort}
                    onChange={(e) => handleInputChange('emailSettings', 'smtpPort', parseInt(e?.target?.value))}
                  />
                  <Input
                    label="Username"
                    placeholder="your-email@domain.com"
                    value={formData?.emailSettings?.username}
                    onChange={(e) => handleInputChange('emailSettings', 'username', e?.target?.value)}
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    value={formData?.emailSettings?.password}
                    onChange={(e) => handleInputChange('emailSettings', 'password', e?.target?.value)}
                  />
                  <Input
                    label="From Email"
                    placeholder="noreply@yourbusiness.com"
                    value={formData?.emailSettings?.fromEmail}
                    onChange={(e) => handleInputChange('emailSettings', 'fromEmail', e?.target?.value)}
                  />
                  <Input
                    label="From Name"
                    placeholder="Your Business Name"
                    value={formData?.emailSettings?.fromName}
                    onChange={(e) => handleInputChange('emailSettings', 'fromName', e?.target?.value)}
                  />
                </div>
              </div>
            )}

            {/* Business Hours */}
            {activeTab === 'business' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Business Hours
                  </h3>
                  <div className="space-y-4">
                    <Checkbox
                      label="Respect business hours for notifications"
                      description="Only send notifications during business hours"
                      checked={formData?.businessHours?.enabled}
                      onChange={(e) => handleInputChange('businessHours', 'enabled', e?.target?.checked)}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Start Time"
                        type="time"
                        value={formData?.businessHours?.startTime}
                        onChange={(e) => handleInputChange('businessHours', 'startTime', e?.target?.value)}
                        disabled={!formData?.businessHours?.enabled}
                      />
                      <Input
                        label="End Time"
                        type="time"
                        value={formData?.businessHours?.endTime}
                        onChange={(e) => handleInputChange('businessHours', 'endTime', e?.target?.value)}
                        disabled={!formData?.businessHours?.enabled}
                      />
                      <Select
                        label="Timezone"
                        options={timezoneOptions}
                        value={formData?.businessHours?.timezone}
                        onChange={(value) => handleInputChange('businessHours', 'timezone', value)}
                        disabled={!formData?.businessHours?.enabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Retry Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Max Retries"
                      type="number"
                      min="0"
                      max="10"
                      value={formData?.retrySettings?.maxRetries}
                      onChange={(e) => handleInputChange('retrySettings', 'maxRetries', parseInt(e?.target?.value))}
                    />
                    <Input
                      label="Retry Interval (minutes)"
                      type="number"
                      min="1"
                      max="60"
                      value={formData?.retrySettings?.retryInterval}
                      onChange={(e) => handleInputChange('retrySettings', 'retryInterval', parseInt(e?.target?.value))}
                    />
                    <Input
                      label="Backoff Multiplier"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData?.retrySettings?.backoffMultiplier}
                      onChange={(e) => handleInputChange('retrySettings', 'backoffMultiplier', parseFloat(e?.target?.value))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Shield" size={14} />
            <span>All credentials are encrypted and stored securely</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
              loading={isSaving}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;