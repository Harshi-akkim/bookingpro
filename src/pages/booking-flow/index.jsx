import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BookingProgressIndicator from '../../components/ui/BookingProgressIndicator';
import ServiceCard from './components/ServiceCard';
import ProviderCard from './components/ProviderCard';
import CalendarView from './components/CalendarView';
import BookingForm from './components/BookingForm';
import PaymentForm from './components/PaymentForm';
import BookingSummary from './components/BookingSummary';
import ConfirmationScreen from './components/ConfirmationScreen';
import Button from '../../components/ui/Button';


const BookingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [formData, setFormData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();

  // Mock services data
  const services = [
    {
      id: 1,
      name: "Deep Tissue Massage",
      description: "Therapeutic massage targeting deep muscle layers to relieve chronic tension and pain. Perfect for athletes and those with muscle knots.",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400",
      price: 120,
      originalPrice: 150,
      duration: "90 minutes",
      isPopular: true,
      features: ["Deep muscle work", "Pain relief", "Stress reduction", "Improved circulation"],
      rating: 4.8,
      reviewCount: 234,
      bookingCount: 1250
    },
    {
      id: 2,
      name: "Swedish Relaxation Massage",
      description: "Gentle, flowing massage techniques designed to promote relaxation and improve circulation. Ideal for stress relief and general wellness.",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400",
      price: 85,
      duration: "60 minutes",
      features: ["Relaxation", "Stress relief", "Gentle pressure", "Full body"],
      rating: 4.7,
      reviewCount: 189,
      bookingCount: 890
    },
    {
      id: 3,
      name: "Hot Stone Therapy",
      description: "Luxurious treatment using heated stones to melt away tension and promote deep relaxation. Combines heat therapy with massage.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      price: 140,
      duration: "75 minutes",
      features: ["Hot stone therapy", "Deep relaxation", "Muscle tension relief", "Luxury experience"],
      rating: 4.9,
      reviewCount: 156,
      bookingCount: 567
    },
    {
      id: 4,
      name: "Prenatal Massage",
      description: "Specialized massage for expecting mothers, focusing on comfort and safety. Helps reduce pregnancy-related discomfort.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      price: 95,
      duration: "60 minutes",
      features: ["Pregnancy safe", "Comfort focused", "Reduces swelling", "Stress relief"],
      rating: 4.8,
      reviewCount: 98,
      bookingCount: 345
    },
    {
      id: 5,
      name: "Sports Massage",
      description: "Performance-focused massage for athletes and active individuals. Helps prevent injuries and improve recovery time.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      price: 110,
      duration: "75 minutes",
      features: ["Athletic performance", "Injury prevention", "Recovery focused", "Flexibility improvement"],
      rating: 4.7,
      reviewCount: 167,
      bookingCount: 678
    },
    {
      id: 6,
      name: "Couples Massage",
      description: "Romantic massage experience for two people in the same room. Perfect for special occasions and bonding.",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400",
      price: 220,
      duration: "60 minutes",
      features: ["Side by side", "Romantic atmosphere", "Shared experience", "Special occasion"],
      rating: 4.9,
      reviewCount: 89,
      bookingCount: 234
    }
  ];

  // Mock providers data
  const providers = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Licensed Massage Therapist",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
      rating: 4.9,
      reviewCount: 245,
      experience: 8,
      location: "Downtown Spa Center",
      specialties: ["Deep Tissue", "Swedish", "Hot Stone"],
      isAvailable: true,
      isFeatured: true,
      nextAvailable: "Today 2:00 PM",
      basePrice: 120,
      venueImages: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400",
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400"
      ]
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Sports Massage Specialist",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
      rating: 4.8,
      reviewCount: 189,
      experience: 6,
      location: "Athletic Recovery Center",
      specialties: ["Sports Massage", "Deep Tissue", "Injury Recovery"],
      isAvailable: true,
      isFeatured: false,
      nextAvailable: "Tomorrow 9:00 AM",
      basePrice: 110,
      venueImages: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400"
      ]
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      title: "Prenatal & Wellness Specialist",
      image: "https://images.unsplash.com/photo-1594824804732-ca8db7d1e3d8?w=400",
      rating: 4.9,
      reviewCount: 156,
      experience: 10,
      location: "Wellness Sanctuary",
      specialties: ["Prenatal", "Swedish", "Aromatherapy"],
      isAvailable: false,
      isFeatured: true,
      nextAvailable: "Jan 3, 10:00 AM",
      basePrice: 95,
      venueImages: [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400"
      ]
    },
    {
      id: 4,
      name: "David Kim",
      title: "Therapeutic Massage Expert",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400",
      rating: 4.7,
      reviewCount: 198,
      experience: 12,
      location: "Healing Hands Clinic",
      specialties: ["Therapeutic", "Hot Stone", "Reflexology"],
      isAvailable: true,
      isFeatured: false,
      nextAvailable: "Today 4:30 PM",
      basePrice: 130,
      venueImages: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
      ]
    }
  ];

  const steps = [
    { id: 1, label: 'Service', icon: 'Calendar' },
    { id: 2, label: 'Provider', icon: 'User' },
    { id: 3, label: 'Date & Time', icon: 'Clock' },
    { id: 4, label: 'Details', icon: 'FileText' },
    { id: 5, label: 'Payment', icon: 'CreditCard' }
  ];

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return selectedService !== null;
      case 2: return selectedProvider !== null;
      case 3: return selectedDate !== null && selectedTimeSlot !== null;
      case 4: return formData?.firstName && formData?.email && formData?.phone && formData?.termsAccepted;
      case 5: return false; // Payment step handles its own submission
      default: return false;
    }
  };

  const handleNextStep = () => {
    if (canProceedToNextStep() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleFormDataChange = (newFormData) => {
    setFormData(newFormData);
  };

  const handleFormSubmit = (submittedFormData) => {
    setFormData(submittedFormData);
    handleNextStep();
  };

  const handlePaymentSubmit = async (paymentData) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create booking data
      const newBookingData = {
        bookingId: 'BK-' + Date.now()?.toString()?.slice(-6),
        service: selectedService,
        provider: selectedProvider,
        date: selectedDate?.toISOString()?.split('T')?.[0],
        time: selectedTimeSlot?.time,
        customer: {
          firstName: formData?.firstName,
          lastName: formData?.lastName,
          email: formData?.email,
          phone: formData?.phone
        },
        specialRequests: formData?.specialRequests,
        paymentData,
        total: calculateTotal(),
        status: 'confirmed',
        createdAt: new Date()?.toISOString()
      };
      
      setBookingData(newBookingData);
      setBookingComplete(true);
      setIsProcessing(false);
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    const basePrice = selectedTimeSlot?.price || selectedService?.price || 0;
    const tax = basePrice * 0.08;
    const serviceFee = 2.99;
    return (basePrice + tax + serviceFee)?.toFixed(2);
  };

  const handleAddToCalendar = (booking) => {
    const startDate = new Date(`${booking.date} ${booking.time}`);
    const endDate = new Date(startDate.getTime() + (90 * 60 * 1000)); // 90 minutes
    
    const formatCalendarDate = (date) => {
      return date?.toISOString()?.replace(/[-:]/g, '')?.split('.')?.[0] + 'Z';
    };

    const title = encodeURIComponent(`${booking?.service?.name} - ${booking?.provider?.name}`);
    const details = encodeURIComponent(`Appointment with ${booking?.provider?.name}\nService: ${booking?.service?.name}\nLocation: ${booking?.provider?.location}`);
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}&details=${details}`;
    
    window.open(calendarUrl, '_blank');
  };

  const handleSendConfirmation = async (booking) => {
    // Simulate sending confirmation
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Confirmation sent for booking:', booking?.bookingId);
  };

  // Auto-advance after service selection
  useEffect(() => {
    if (currentStep === 1 && selectedService) {
      const timer = setTimeout(() => {
        handleNextStep();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [selectedService, currentStep]);

  // Auto-advance after provider selection
  useEffect(() => {
    if (currentStep === 2 && selectedProvider) {
      const timer = setTimeout(() => {
        handleNextStep();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [selectedProvider, currentStep]);

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <ConfirmationScreen
            bookingData={bookingData}
            onAddToCalendar={handleAddToCalendar}
            onSendConfirmation={handleSendConfirmation}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className={`${currentStep === 1 ? 'px-0 py-0' : 'container mx-auto px-4 py-8'}`}>
        {/* Progress Indicator - only show when not on step 1 */}
        {currentStep !== 1 && (
          <div className="mb-8">
            <BookingProgressIndicator
              currentStep={currentStep}
              totalSteps={5}
              steps={steps}
              onStepClick={handleStepClick}
              allowBackNavigation={true}
            />
          </div>
        )}

        <div className={`${currentStep === 1 ? '' : 'grid grid-cols-1 lg:grid-cols-3 gap-8'}`}>
          {/* Main Content */}
          <div className={`${currentStep === 1 ? '' : 'lg:col-span-2'}`}>
            {/* Step 1: Service Selection - Full Screen */}
            {currentStep === 1 && (
              <div className="min-h-screen relative">
                {/* Progress indicator in fixed position for step 1 */}
                <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
                  <div className="container mx-auto px-4 py-4">
                    <BookingProgressIndicator
                      currentStep={currentStep}
                      totalSteps={5}
                      steps={steps}
                      onStepClick={handleStepClick}
                      allowBackNavigation={true}
                    />
                  </div>
                </div>

                {/* Full screen service grid */}
                <div className="pt-32 pb-8 px-4 min-h-screen">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Choose Your Service</h1>
                    <p className="text-lg text-muted-foreground">
                      Select from our range of professional massage services
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
                    {services?.map((service) => (
                      <ServiceCard
                        key={service?.id}
                        service={service}
                        isSelected={selectedService?.id === service?.id}
                        onSelect={handleServiceSelect}
                        fullScreen={true}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Provider Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Choose Your Provider</h1>
                  <p className="text-lg text-muted-foreground">
                    Select from our experienced massage therapists
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {providers?.map((provider) => (
                    <ProviderCard
                      key={provider?.id}
                      provider={provider}
                      isSelected={selectedProvider?.id === provider?.id}
                      onSelect={handleProviderSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Select Date & Time</h1>
                  <p className="text-lg text-muted-foreground">
                    Choose your preferred appointment slot
                  </p>
                </div>

                <CalendarView
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  selectedTimeSlot={selectedTimeSlot}
                  onTimeSlotSelect={handleTimeSlotSelect}
                  provider={selectedProvider}
                />
              </div>
            )}

            {/* Step 4: Booking Form */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Your Information</h1>
                  <p className="text-lg text-muted-foreground">
                    Please provide your details for the appointment
                  </p>
                </div>

                <BookingForm
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                  onSubmit={handleFormSubmit}
                />
              </div>
            )}

            {/* Step 5: Payment */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Booking</h1>
                  <p className="text-lg text-muted-foreground">
                    Secure payment to confirm your appointment
                  </p>
                </div>

                <PaymentForm
                  bookingSummary={{
                    service: selectedService,
                    provider: selectedProvider,
                    date: selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    }),
                    time: selectedTimeSlot?.time,
                    total: calculateTotal()
                  }}
                  onPaymentSubmit={handlePaymentSubmit}
                  isProcessing={isProcessing}
                />
              </div>
            )}

            {/* Navigation Buttons - only show when not on step 1 or move to fixed position */}
            {currentStep === 1 ? (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                <Button
                  variant="default"
                  size="lg"
                  iconName="ArrowRight"
                  iconPosition="right"
                  onClick={handleNextStep}
                  disabled={!canProceedToNextStep()}
                  className="shadow-lg"
                >
                  Continue
                </Button>
              </div>
            ) : currentStep < 5 && (
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  iconName="ArrowLeft"
                  iconPosition="left"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                <Button
                  variant="default"
                  size="lg"
                  iconName="ArrowRight"
                  iconPosition="right"
                  onClick={handleNextStep}
                  disabled={!canProceedToNextStep()}
                >
                  {currentStep === 4 ? 'Continue to Payment' : 'Next'}
                </Button>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar - only show when not on step 1 */}
          {currentStep !== 1 && (
            <div className="lg:col-span-1">
              <BookingSummary
                service={selectedService}
                provider={selectedProvider}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                formData={formData}
                isSticky={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;