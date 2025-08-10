import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeSection = ({ userName = "John Doe", nextAppointment = null }) => {
  const currentHour = new Date()?.getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-xl text-white mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-2">
            {getGreeting()}, {userName}!
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            Welcome back to your booking dashboard
          </p>
        </div>
        <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
          <Icon name="Calendar" size={32} color="white" />
        </div>
      </div>
      {nextAppointment && (
        <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
              <Icon name="Clock" size={20} color="white" />
            </div>
            <div>
              <p className="text-sm font-medium">Next Appointment</p>
              <p className="text-xs text-primary-foreground/80">
                {nextAppointment?.service} • {nextAppointment?.date} at {nextAppointment?.time}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeSection;