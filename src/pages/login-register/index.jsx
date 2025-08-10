import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SocialLogin from './components/SocialLogin';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import TrustSignals from './components/TrustSignals';

const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [slideDirection, setSlideDirection] = useState('');
  const navigate = useNavigate();

  // Handle tab transitions with slide animation
  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    
    setSlideDirection(newTab === 'register' ? 'slide-left' : 'slide-right');
    
    setTimeout(() => {
      setActiveTab(newTab);
      setSlideDirection('');
    }, 150);
  };

  // Mock authentication functions
  const handleLogin = async (formData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Login attempt:', formData);
    setIsLoading(false);
  };

  const handleRegister = async (formData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Registration attempt:', formData);
    setIsLoading(false);
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    
    // Simulate social login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Social login with:', provider);
    
    // Navigate to customer dashboard for demo
    navigate('/customer-dashboard');
    setIsLoading(false);
  };

  const handleForgotPassword = async (email) => {
    // Simulate password reset email
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex">
      {/* Left Side - Auth Forms (Mobile: Full Width, Desktop: Half Width) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl elevation-2">
                <Icon name="Calendar" size={28} color="white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">BookingPro</h1>
            </div>
            <p className="text-muted-foreground">
              {activeTab === 'login' ?'Welcome back! Sign in to your account' :'Create your account to get started'
              }
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-card rounded-xl border border-border elevation-2 p-6 lg:p-8">
            {/* Tab Navigation */}
            <AuthTabs 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              isLoading={isLoading}
            />

            {/* Form Content with Slide Animation */}
            <div className={`transition-all duration-300 ease-out ${slideDirection}`}>
              {activeTab === 'login' ? (
                <LoginForm
                  isLoading={isLoading}
                  onSubmit={handleLogin}
                  onForgotPassword={() => setShowForgotPassword(true)}
                />
              ) : (
                <RegisterForm
                  isLoading={isLoading}
                  onSubmit={handleRegister}
                />
              )}
            </div>

            {/* Social Login */}
            <div className="mt-6">
              <SocialLogin
                isLoading={isLoading}
                onSocialLogin={handleSocialLogin}
              />
            </div>
          </div>

          {/* Trust Signals - Mobile Only */}
          <div className="lg:hidden mt-8">
            <TrustSignals />
          </div>
        </div>
      </div>
      {/* Right Side - Promotional Content (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary p-8 items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-lg">
          {/* Hero Image */}
          <div className="mb-8">
            <div className="w-64 h-64 mx-auto bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Icon name="CalendarDays" size={120} color="white" className="opacity-80" />
            </div>
          </div>

          {/* Hero Content */}
          <h2 className="text-3xl font-bold mb-4">
            Streamline Your Booking Experience
          </h2>
          <p className="text-lg opacity-90 mb-8 leading-relaxed">
            Join thousands of businesses using BookingPro to manage appointments, 
            reduce no-shows, and grow their revenue with our all-in-one platform.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-4">
            {[
              { icon: 'Zap', text: 'Real-time booking management' },
              { icon: 'Shield', text: 'Secure payment processing' },
              { icon: 'Bell', text: 'Automated reminders' },
              { icon: 'BarChart3', text: 'Advanced analytics' }
            ]?.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 justify-center">
                <Icon name={feature?.icon} size={20} />
                <span className="text-sm">{feature?.text}</span>
              </div>
            ))}
          </div>

          {/* Trust Signals - Desktop */}
          <div className="mt-12">
            <TrustSignals />
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSubmit={handleForgotPassword}
      />
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 elevation-3 flex items-center space-x-3">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="text-foreground">
              {activeTab === 'login' ? 'Signing you in...' : 'Creating your account...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginRegister;