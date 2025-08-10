import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const RegisterForm = ({ isLoading, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const userTypeOptions = [
    { value: 'customer', label: 'Customer', description: 'Book appointments and manage reservations' },
    { value: 'provider', label: 'Service Provider', description: 'Manage calendar, bookings, and payments' }
  ];

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

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, userType: value }));
    if (errors?.userType) {
      setErrors(prev => ({ ...prev, userType: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData?.name?.trim()?.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(formData?.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData?.userType) {
      newErrors.userType = 'Please select your user type';
    }
    
    if (!formData?.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      
      // Navigate based on user type
      if (formData?.userType === 'customer') {
        navigate('/customer-dashboard');
      } else {
        navigate('/calendar-management');
      }
    } catch (error) {
      setErrors({ email: 'Registration failed. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        name="name"
        placeholder="Enter your full name"
        value={formData?.name}
        onChange={handleInputChange}
        error={errors?.name}
        required
        disabled={isLoading}
      />
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
      <Input
        label="Phone Number"
        type="tel"
        name="phone"
        placeholder="Enter your phone number"
        value={formData?.phone}
        onChange={handleInputChange}
        error={errors?.phone}
        required
        disabled={isLoading}
      />
      <Select
        label="I am a..."
        placeholder="Select your role"
        options={userTypeOptions}
        value={formData?.userType}
        onChange={handleSelectChange}
        error={errors?.userType}
        required
        disabled={isLoading}
      />
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Create a strong password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          description="Must contain uppercase, lowercase, and number"
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
      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          error={errors?.confirmPassword}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          disabled={isLoading}
        >
          <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={18} />
        </button>
      </div>
      <Checkbox
        label="I agree to the Terms of Service and Privacy Policy"
        name="acceptTerms"
        checked={formData?.acceptTerms}
        onChange={handleInputChange}
        error={errors?.acceptTerms}
        required
        disabled={isLoading}
      />
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="left"
        className="mt-6"
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;