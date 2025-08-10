import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const BookingForm = ({ 
  formData, 
  onFormDataChange, 
  onSubmit, 
  isLoading = false,
  className = '' 
}) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData?.termsAccepted) {
      newErrors.termsAccepted = 'Please accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className={`bg-card rounded-xl border border-border p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="User" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Your Details</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            placeholder="Enter your first name"
            value={formData?.firstName || ''}
            onChange={(e) => handleInputChange('firstName', e?.target?.value)}
            error={errors?.firstName}
            required
          />

          <Input
            label="Last Name"
            type="text"
            placeholder="Enter your last name"
            value={formData?.lastName || ''}
            onChange={(e) => handleInputChange('lastName', e?.target?.value)}
            error={errors?.lastName}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          description="We'll send your booking confirmation here"
          value={formData?.email || ''}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          description="For appointment reminders and updates"
          value={formData?.phone || ''}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          error={errors?.phone}
          required
        />

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Special Requests or Notes
          </label>
          <textarea
            placeholder="Any special requirements or notes for your appointment..."
            value={formData?.specialRequests || ''}
            onChange={(e) => handleInputChange('specialRequests', e?.target?.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>

        {/* Notification Preferences */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Notification Preferences</h4>
          
          <Checkbox
            label="Email reminders"
            description="Receive appointment reminders via email"
            checked={formData?.emailReminders || false}
            onChange={(e) => handleInputChange('emailReminders', e?.target?.checked)}
          />

          <Checkbox
            label="SMS reminders"
            description="Receive appointment reminders via text message"
            checked={formData?.smsReminders || false}
            onChange={(e) => handleInputChange('smsReminders', e?.target?.checked)}
          />

          <Checkbox
            label="Marketing communications"
            description="Receive updates about new services and promotions"
            checked={formData?.marketingEmails || false}
            onChange={(e) => handleInputChange('marketingEmails', e?.target?.checked)}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="border-t border-border pt-4">
          <Checkbox
            label="I agree to the terms and conditions"
            description="By checking this box, you agree to our terms of service and privacy policy"
            checked={formData?.termsAccepted || false}
            onChange={(e) => handleInputChange('termsAccepted', e?.target?.checked)}
            error={errors?.termsAccepted}
            required
          />
        </div>

        {/* Emergency Contact */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
            <Icon name="Phone" size={16} className="mr-2" />
            Emergency Contact (Optional)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Name"
              type="text"
              placeholder="Emergency contact name"
              value={formData?.emergencyContactName || ''}
              onChange={(e) => handleInputChange('emergencyContactName', e?.target?.value)}
            />

            <Input
              label="Contact Phone"
              type="tel"
              placeholder="Emergency contact phone"
              value={formData?.emergencyContactPhone || ''}
              onChange={(e) => handleInputChange('emergencyContactPhone', e?.target?.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="ArrowRight"
            iconPosition="right"
          >
            Continue to Payment
          </Button>
        </div>
      </form>
      {/* Security Notice */}
      <div className="flex items-center justify-center space-x-2 mt-4 text-xs text-muted-foreground">
        <Icon name="Shield" size={12} />
        <span>Your information is secure and encrypted</span>
      </div>
    </div>
  );
};

export default BookingForm;