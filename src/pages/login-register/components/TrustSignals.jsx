import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Encrypted',
      description: 'Your data is protected with 256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Secure Payments',
      description: 'PCI DSS compliant payment processing'
    },
    {
      icon: 'Users',
      title: '10,000+ Users',
      description: 'Trusted by businesses worldwide'
    },
    {
      icon: 'Clock',
      title: '24/7 Support',
      description: 'Round-the-clock customer assistance'
    }
  ];

  const securityBadges = [
    { name: 'SSL Certificate', icon: 'ShieldCheck' },
    { name: 'GDPR Compliant', icon: 'FileCheck' },
    { name: 'SOC 2 Type II', icon: 'Award' }
  ];

  return (
    <div className="space-y-6">
      {/* Trust Features */}
      <div className="grid grid-cols-2 gap-4">
        {trustFeatures?.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name={feature?.icon} size={20} className="text-primary" />
            </div>
            <h4 className="text-sm font-medium text-foreground mb-1">
              {feature?.title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
      {/* Security Badges */}
      <div className="border-t border-border pt-4">
        <p className="text-xs text-muted-foreground text-center mb-3">
          Protected by industry-leading security standards
        </p>
        <div className="flex justify-center space-x-4">
          {securityBadges?.map((badge, index) => (
            <div key={index} className="flex items-center space-x-1">
              <Icon name={badge?.icon} size={14} className="text-success" />
              <span className="text-xs text-muted-foreground">{badge?.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Privacy Notice */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-foreground font-medium mb-1">
              Your Privacy Matters
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We never share your personal information and use it only to provide 
              you with the best booking experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;