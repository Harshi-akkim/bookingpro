import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AuthTabs = ({ activeTab, onTabChange, isLoading }) => {
  const tabs = [
    { id: 'login', label: 'Sign In', icon: 'LogIn' },
    { id: 'register', label: 'Sign Up', icon: 'UserPlus' }
  ];

  return (
    <div className="flex bg-muted rounded-lg p-1 mb-6">
      {tabs?.map((tab) => (
        <button
          key={tab?.id}
          onClick={() => !isLoading && onTabChange(tab?.id)}
          disabled={isLoading}
          className={`
            flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md
            text-sm font-medium transition-all duration-200 ease-out touch-target
            ${activeTab === tab?.id
              ? 'bg-card text-foreground elevation-1'
              : 'text-muted-foreground hover:text-foreground'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Icon name={tab?.icon} size={18} />
          <span>{tab?.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AuthTabs;