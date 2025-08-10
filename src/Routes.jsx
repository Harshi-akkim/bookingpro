import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import BookingFlow from './pages/booking-flow';
import NotificationsCenter from './pages/notifications-center';
import LoginRegister from './pages/login-register';
import CustomerDashboard from './pages/customer-dashboard';
import CalendarManagement from './pages/calendar-management';
import PaymentProcessing from './pages/payment-processing';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<BookingFlow />} />
        <Route path="/booking-flow" element={<BookingFlow />} />
        <Route path="/notifications-center" element={<NotificationsCenter />} />
        <Route path="/login-register" element={<LoginRegister />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/calendar-management" element={<CalendarManagement />} />
        <Route path="/payment-processing" element={<PaymentProcessing />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
