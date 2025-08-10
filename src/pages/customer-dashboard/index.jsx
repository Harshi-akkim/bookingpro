import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import QuickActionFAB from '../../components/ui/QuickActionFAB';
import WelcomeSection from './components/WelcomeSection';
import UpcomingAppointments from './components/UpcomingAppointments';
import QuickBookingSection from './components/QuickBookingSection';
import MiniCalendar from './components/MiniCalendar';
import RecentBookings from './components/RecentBookings';
import QuickAccessTiles from './components/QuickAccessTiles';
import BookingStats from './components/BookingStats';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    memberSince: "2024-01-15",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  };

  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: "apt001",
      service: "Hair Cut & Styling",
      provider: "Sarah Johnson",
      date: "2025-08-05",
      time: "10:00 AM",
      location: "Downtown Salon",
      status: "confirmed",
      price: 85,
      duration: 60
    },
    {
      id: "apt002",
      service: "Deep Tissue Massage",
      provider: "Mike Chen",
      date: "2025-08-08",
      time: "2:30 PM",
      location: "Wellness Center",
      status: "pending",
      price: 120,
      duration: 90
    },
    {
      id: "apt003",
      service: "Dental Cleaning",
      provider: "Dr. Emily Davis",
      date: "2025-08-12",
      time: "9:00 AM",
      location: "Bright Smiles Clinic",
      status: "confirmed",
      price: 150,
      duration: 45
    }
  ];

  // Mock favorite services for quick booking
  const favoriteServices = [
    {
      id: "svc001",
      name: "Hair Cut",
      icon: "Scissors",
      price: 65,
      duration: 45,
      provider: "Sarah Johnson"
    },
    {
      id: "svc002",
      name: "Massage Therapy",
      icon: "Heart",
      price: 120,
      duration: 90,
      provider: "Mike Chen"
    },
    {
      id: "svc003",
      name: "Manicure",
      icon: "Sparkles",
      price: 35,
      duration: 30,
      provider: "Lisa Wong"
    }
  ];

  // Mock booked dates for calendar
  const bookedDates = [
    { date: "2025-08-05", status: "confirmed" },
    { date: "2025-08-08", status: "pending" },
    { date: "2025-08-12", status: "confirmed" },
    { date: "2025-08-15", status: "completed" },
    { date: "2025-08-20", status: "cancelled" }
  ];

  // Mock recent bookings
  const recentBookings = [
    {
      id: "bk001",
      service: "Hair Cut & Styling",
      provider: "Sarah Johnson",
      date: "2025-07-28",
      time: "10:00 AM",
      location: "Downtown Salon",
      status: "completed",
      price: 85,
      duration: 60,
      notes: "Regular trim and style",
      reviewed: false
    },
    {
      id: "bk002",
      service: "Deep Tissue Massage",
      provider: "Mike Chen",
      date: "2025-07-25",
      time: "2:30 PM",
      location: "Wellness Center",
      status: "completed",
      price: 120,
      duration: 90,
      notes: "Focus on lower back tension",
      reviewed: true
    },
    {
      id: "bk003",
      service: "Facial Treatment",
      provider: "Anna Martinez",
      date: "2025-07-20",
      time: "11:00 AM",
      location: "Beauty Spa",
      status: "completed",
      price: 95,
      duration: 75,
      notes: "Hydrating facial for dry skin",
      reviewed: true
    },
    {
      id: "bk004",
      service: "Yoga Class",
      provider: "David Kim",
      date: "2025-07-18",
      time: "6:00 PM",
      location: "Zen Studio",
      status: "cancelled",
      price: 25,
      duration: 60,
      notes: "Cancelled due to schedule conflict"
    },
    {
      id: "bk005",
      service: "Personal Training",
      provider: "Jessica Brown",
      date: "2025-07-15",
      time: "7:00 AM",
      location: "Fitness Center",
      status: "completed",
      price: 80,
      duration: 60,
      notes: "Upper body strength training",
      reviewed: false
    }
  ];

  // Mock booking statistics
  const bookingStats = {
    totalBookings: 24,
    completedBookings: 20,
    upcomingBookings: 3,
    cancelledBookings: 1,
    totalSpent: 1850,
    favoriteService: "Hair Cut & Styling"
  };

  const nextAppointment = upcomingAppointments?.length > 0 ? {
    service: upcomingAppointments?.[0]?.service,
    date: new Date(upcomingAppointments[0].date)?.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    }),
    time: upcomingAppointments?.[0]?.time
  } : null;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDateClick = (date) => {
    console.log('Date clicked:', date);
    // Navigate to booking flow with selected date
    navigate('/booking-flow', { state: { selectedDate: date } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Section */}
        <WelcomeSection 
          userName={userData?.name}
          nextAppointment={nextAppointment}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Appointments */}
            <UpcomingAppointments appointments={upcomingAppointments} />

            {/* Quick Booking Section */}
            <QuickBookingSection favoriteServices={favoriteServices} />

            {/* Recent Bookings */}
            <RecentBookings bookings={recentBookings} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mini Calendar */}
            <MiniCalendar 
              bookedDates={bookedDates}
              onDateClick={handleDateClick}
            />

            {/* Quick Access Tiles */}
            <QuickAccessTiles notificationCount={5} />

            {/* Booking Stats */}
            <BookingStats stats={bookingStats} />
          </div>
        </div>
      </main>
      {/* Quick Action FAB */}
      <QuickActionFAB userRole="customer" />
    </div>
  );
};

export default CustomerDashboard;