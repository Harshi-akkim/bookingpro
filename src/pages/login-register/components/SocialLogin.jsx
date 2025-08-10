import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SocialLogin = ({ isLoading, onSocialLogin }) => {
  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'text-red-600',
      bgColor: 'hover:bg-red-50'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50'
    }
  ];

  const handleSocialLogin = (provider) => {
    if (onSocialLogin) {
      onSocialLogin(provider);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialProviders?.map((provider) => (
          <Button
            key={provider?.id}
            variant="outline"
            size="default"
            fullWidth
            onClick={() => handleSocialLogin(provider)}
            disabled={isLoading}
            className={`${provider?.bgColor} transition-colors`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Icon 
                name={provider?.icon} 
                size={18} 
                className={provider?.color}
              />
              <span>{provider?.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SocialLogin;