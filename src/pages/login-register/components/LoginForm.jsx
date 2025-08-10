import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const LoginForm = ({ isLoading, onSubmit, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const mockCredentials = {
    customer: { email: 'customer@bookingpro.com', password: 'customer123' },
    provider: { email: 'provider@bookingpro.com', password: 'provider123' }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    // Check mock credentials
    const isCustomer = formData?.email === mockCredentials?.customer?.email && 
                      formData?.password === mockCredentials?.customer?.password;
    const isProvider = formData?.email === mockCredentials?.provider?.email && 
                      formData?.password === mockCredentials?.provider?.password;

    if (!isCustomer && !isProvider) {
      setErrors({
        email: 'Invalid credentials. Use customer@bookingpro.com/customer123 or provider@bookingpro.com/provider123'
      });
      return;
    }

    try {
      await onSubmit(formData);
      
      // Navigate based on user type
      if (isCustomer) {
        navigate('/customer-dashboard');
      } else {
        navigate('/calendar-management');
      }
    } catch (error) {
      setErrors({ email: 'Login failed. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData?.email}
        onChange={handleInputChange}
        error={errors?.email}
        required
        disabled={isLoading}
      />
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          disabled={isLoading}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        iconName="LogIn"
        iconPosition="left"
        className="mt-6"
      >
        Sign In
      </Button>
      {/* Mock Credentials Helper */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground mb-2">Demo Credentials:</p>
        <div className="space-y-1 text-xs">
          <div>Customer: customer@bookingpro.com / customer123</div>
          <div>Provider: provider@bookingpro.com / provider123</div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;