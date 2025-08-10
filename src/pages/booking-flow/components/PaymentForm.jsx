import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const PaymentForm = ({ 
  bookingSummary, 
  onPaymentSubmit, 
  isProcessing = false,
  className = '' 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [errors, setErrors] = useState({});

  // Mock saved payment methods
  const savedPaymentMethods = [
    {
      id: 'card_1',
      type: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: 'card_2',
      type: 'mastercard',
      last4: '5555',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ];

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;

    // Format card number
    if (field === 'cardNumber') {
      formattedValue = value?.replace(/\s/g, '')?.replace(/(.{4})/g, '$1 ')?.trim();
      if (formattedValue?.length > 19) formattedValue = formattedValue?.slice(0, 19);
    }

    // Format expiry date
    if (field === 'expiryDate') {
      formattedValue = value?.replace(/\D/g, '')?.replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue?.length > 5) formattedValue = formattedValue?.slice(0, 5);
    }

    // Format CVV
    if (field === 'cvv') {
      formattedValue = value?.replace(/\D/g, '')?.slice(0, 4);
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBillingAddressChange = (field, value) => {
    setBillingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePaymentForm = () => {
    const newErrors = {};

    if (paymentMethod === 'card') {
      if (!cardData?.cardNumber?.replace(/\s/g, '')) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardData?.cardNumber?.replace(/\s/g, '')?.length < 13) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }

      if (!cardData?.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/?.test(cardData?.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }

      if (!cardData?.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (cardData?.cvv?.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }

      if (!cardData?.cardholderName?.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }

      if (!billingAddress?.street?.trim()) {
        newErrors.street = 'Street address is required';
      }

      if (!billingAddress?.city?.trim()) {
        newErrors.city = 'City is required';
      }

      if (!billingAddress?.zipCode?.trim()) {
        newErrors.zipCode = 'ZIP code is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validatePaymentForm()) {
      const paymentData = {
        method: paymentMethod,
        ...(paymentMethod === 'card' && {
          card: cardData,
          billingAddress,
          savePaymentMethod
        })
      };
      onPaymentSubmit(paymentData);
    }
  };

  const getCardIcon = (cardNumber) => {
    const number = cardNumber?.replace(/\s/g, '');
    if (number?.startsWith('4')) return 'CreditCard'; // Visa
    if (number?.startsWith('5')) return 'CreditCard'; // Mastercard
    if (number?.startsWith('3')) return 'CreditCard'; // Amex
    return 'CreditCard';
  };

  return (
    <div className={`bg-card rounded-xl border border-border p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="CreditCard" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Payment Details</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Payment Method</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e?.target?.value)}
                className="text-primary focus:ring-primary"
              />
              <Icon name="CreditCard" size={20} />
              <span className="text-sm font-medium">Credit/Debit Card</span>
            </label>

            <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e?.target?.value)}
                className="text-primary focus:ring-primary"
              />
              <Icon name="Wallet" size={20} />
              <span className="text-sm font-medium">PayPal</span>
            </label>

            <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="apple_pay"
                checked={paymentMethod === 'apple_pay'}
                onChange={(e) => setPaymentMethod(e?.target?.value)}
                className="text-primary focus:ring-primary"
              />
              <Icon name="Smartphone" size={20} />
              <span className="text-sm font-medium">Apple Pay</span>
            </label>
          </div>
        </div>

        {/* Saved Payment Methods */}
        {savedPaymentMethods?.length > 0 && paymentMethod === 'card' && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Saved Payment Methods</h4>
            <div className="space-y-2">
              {savedPaymentMethods?.map((method) => (
                <label
                  key={method?.id}
                  className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="radio"
                    name="savedPaymentMethod"
                    value={method?.id}
                    className="text-primary focus:ring-primary"
                  />
                  <Icon name="CreditCard" size={20} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        •••• •••• •••• {method?.last4}
                      </span>
                      {method?.isDefault && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Expires {method?.expiryMonth}/{method?.expiryYear}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Card Details Form */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Card Information</h4>
            
            <div className="relative">
              <Input
                label="Card Number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardData?.cardNumber}
                onChange={(e) => handleCardInputChange('cardNumber', e?.target?.value)}
                error={errors?.cardNumber}
                required
              />
              <div className="absolute right-3 top-8">
                <Icon name={getCardIcon(cardData?.cardNumber)} size={20} className="text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                type="text"
                placeholder="MM/YY"
                value={cardData?.expiryDate}
                onChange={(e) => handleCardInputChange('expiryDate', e?.target?.value)}
                error={errors?.expiryDate}
                required
              />

              <Input
                label="CVV"
                type="text"
                placeholder="123"
                value={cardData?.cvv}
                onChange={(e) => handleCardInputChange('cvv', e?.target?.value)}
                error={errors?.cvv}
                required
              />
            </div>

            <Input
              label="Cardholder Name"
              type="text"
              placeholder="Name on card"
              value={cardData?.cardholderName}
              onChange={(e) => handleCardInputChange('cardholderName', e?.target?.value)}
              error={errors?.cardholderName}
              required
            />

            {/* Billing Address */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Billing Address</h4>
              
              <Input
                label="Street Address"
                type="text"
                placeholder="123 Main Street"
                value={billingAddress?.street}
                onChange={(e) => handleBillingAddressChange('street', e?.target?.value)}
                error={errors?.street}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  placeholder="New York"
                  value={billingAddress?.city}
                  onChange={(e) => handleBillingAddressChange('city', e?.target?.value)}
                  error={errors?.city}
                  required
                />

                <Input
                  label="ZIP Code"
                  type="text"
                  placeholder="10001"
                  value={billingAddress?.zipCode}
                  onChange={(e) => handleBillingAddressChange('zipCode', e?.target?.value)}
                  error={errors?.zipCode}
                  required
                />
              </div>
            </div>

            {/* Save Payment Method */}
            <Checkbox
              label="Save this payment method"
              description="Securely save for future bookings"
              checked={savePaymentMethod}
              onChange={(e) => setSavePaymentMethod(e?.target?.checked)}
            />
          </div>
        )}

        {/* Booking Summary */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Booking Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-medium">{bookingSummary?.service?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider:</span>
              <span className="font-medium">{bookingSummary?.provider?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date & Time:</span>
              <span className="font-medium">
                {bookingSummary?.date} at {bookingSummary?.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{bookingSummary?.service?.duration}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-primary">${bookingSummary?.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isProcessing}
          iconName="Lock"
          iconPosition="left"
        >
          {isProcessing ? 'Processing Payment...' : `Pay $${bookingSummary?.total}`}
        </Button>
      </form>
      {/* Security Badges */}
      <div className="flex items-center justify-center space-x-4 mt-6 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={12} />
          <span>SSL Encrypted</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Lock" size={12} />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="CreditCard" size={12} />
          <span>Stripe Powered</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;