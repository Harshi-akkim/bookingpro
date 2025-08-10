import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TemplateEditor = ({ 
  template, 
  onSave, 
  onCancel, 
  isVisible = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'booking_confirmation',
    method: 'both',
    variables: []
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template?.name || '',
        subject: template?.subject || '',
        content: template?.content || '',
        type: template?.type || 'booking_confirmation',
        method: template?.method || 'both',
        variables: template?.variables || []
      });
    }
  }, [template]);

  const templateTypes = [
    { value: 'booking_confirmation', label: 'Booking Confirmation' },
    { value: 'reminder', label: 'Appointment Reminder' },
    { value: 'cancellation', label: 'Cancellation Notice' },
    { value: 'system_alert', label: 'System Alert' }
  ];

  const deliveryMethods = [
    { value: 'sms', label: 'SMS Only' },
    { value: 'email', label: 'Email Only' },
    { value: 'both', label: 'SMS & Email' }
  ];

  const availableVariables = [
    { key: '{{customer_name}}', description: 'Customer full name' },
    { key: '{{appointment_date}}', description: 'Appointment date' },
    { key: '{{appointment_time}}', description: 'Appointment time' },
    { key: '{{service_name}}', description: 'Service or appointment type' },
    { key: '{{provider_name}}', description: 'Service provider name' },
    { key: '{{business_name}}', description: 'Business name' },
    { key: '{{booking_id}}', description: 'Booking reference number' },
    { key: '{{cancellation_link}}', description: 'Cancellation link' },
    { key: '{{reschedule_link}}', description: 'Reschedule link' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const insertVariable = (variable) => {
    const textarea = document.getElementById('template-content');
    const start = textarea?.selectionStart;
    const end = textarea?.selectionEnd;
    const text = formData?.content;
    const before = text?.substring(0, start);
    const after = text?.substring(end, text?.length);
    
    const newContent = before + variable?.key + after;
    handleInputChange('content', newContent);
    
    // Reset cursor position
    setTimeout(() => {
      textarea?.focus();
      textarea?.setSelectionRange(start + variable?.key?.length, start + variable?.key?.length);
    }, 0);
  };

  const generatePreview = () => {
    let preview = formData?.content;
    
    // Replace variables with sample data
    const sampleData = {
      '{{customer_name}}': 'John Doe',
      '{{appointment_date}}': 'August 15, 2025',
      '{{appointment_time}}': '2:30 PM',
      '{{service_name}}': 'Dental Cleaning',
      '{{provider_name}}': 'Dr. Smith',
      '{{business_name}}': 'BookingPro Clinic',
      '{{booking_id}}': 'BP-2025-001',
      '{{cancellation_link}}': 'https://bookingpro.com/cancel/abc123',
      '{{reschedule_link}}': 'https://bookingpro.com/reschedule/abc123'
    };

    Object.entries(sampleData)?.forEach(([key, value]) => {
      preview = preview?.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    });

    return preview;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {template ? 'Edit Template' : 'Create Template'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Customize notification templates with dynamic variables
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onCancel}
          />
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Editor Panel */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Template Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Template Name"
                  placeholder="Enter template name"
                  value={formData?.name}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                  required
                />
                
                <Select
                  label="Template Type"
                  options={templateTypes}
                  value={formData?.type}
                  onChange={(value) => handleInputChange('type', value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Subject Line"
                  placeholder="Email subject (leave empty for SMS)"
                  value={formData?.subject}
                  onChange={(e) => handleInputChange('subject', e?.target?.value)}
                />
                
                <Select
                  label="Delivery Method"
                  options={deliveryMethods}
                  value={formData?.method}
                  onChange={(value) => handleInputChange('method', value)}
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message Content
                </label>
                <textarea
                  id="template-content"
                  rows={12}
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your message content here. Use variables like {{customer_name}} for personalization."
                  value={formData?.content}
                  onChange={(e) => handleInputChange('content', e?.target?.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Character count: {formData?.content?.length} 
                  {formData?.method === 'sms' && ' (SMS limit: 160 characters)'}
                </p>
              </div>

              {/* Variables Panel */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Available Variables
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableVariables?.map((variable) => (
                    <button
                      key={variable?.key}
                      onClick={() => insertVariable(variable)}
                      className="flex items-center justify-between p-2 text-left border border-border rounded-md hover:bg-muted transition-colors"
                    >
                      <div>
                        <code className="text-xs font-mono text-primary">
                          {variable?.key}
                        </code>
                        <p className="text-xs text-muted-foreground">
                          {variable?.description}
                        </p>
                      </div>
                      <Icon name="Plus" size={14} className="text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-80 border-l border-border bg-muted/30">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Preview</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName={isPreviewMode ? 'Code' : 'Eye'}
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                >
                  {isPreviewMode ? 'Code' : 'Preview'}
                </Button>
              </div>
            </div>
            
            <div className="p-4 h-full overflow-y-auto">
              {isPreviewMode ? (
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Smartphone" size={16} className="text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground">
                        {formData?.method === 'email' ? 'Email Preview' : 'SMS Preview'}
                      </span>
                    </div>
                    {formData?.subject && formData?.method !== 'sms' && (
                      <p className="text-sm font-medium text-foreground mb-2">
                        Subject: {formData?.subject}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-foreground whitespace-pre-wrap">
                    {generatePreview()}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Raw Template:</div>
                  <pre className="text-xs text-foreground whitespace-pre-wrap font-mono bg-background p-3 rounded border border-border">
                    {formData?.content}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={14} />
            <span>Templates are automatically saved as drafts</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
              loading={isSaving}
              disabled={!formData?.name || !formData?.content}
            >
              Save Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;