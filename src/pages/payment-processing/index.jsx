import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PaymentAnalytics from './components/PaymentAnalytics';
import PaymentTable from './components/PaymentTable';
import PaymentFilters from './components/PaymentFilters';
import PaymentDetails from './components/PaymentDetails';


const PaymentProcessing = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    paymentMethod: 'all',
    amountRange: 'all',
    startDate: '',
    endDate: '',
    quickDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock payment data
  const mockPayments = [
    {
      id: 'pay_001',
      transactionId: 'TXN-2025-001',
      date: '2025-01-31T14:30:00Z',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567'
      },
      service: {
        name: 'Deep Tissue Massage',
        duration: 60,
        description: 'Therapeutic massage targeting muscle tension and knots',
        location: 'Spa Room 1'
      },
      amount: 120.00,
      refundAmount: 0,
      status: 'completed',
      paymentMethod: 'Credit Card',
      last4: '4242',
      processingFee: 3.78,
      appointmentDate: '2025-02-05T10:00:00Z',
      timeline: [
        { type: 'success', description: 'Payment initiated', timestamp: '2025-01-31T14:30:00Z' },
        { type: 'success', description: 'Payment authorized', timestamp: '2025-01-31T14:30:15Z' },
        { type: 'success', description: 'Payment completed', timestamp: '2025-01-31T14:30:30Z' }
      ]
    },
    {
      id: 'pay_002',
      transactionId: 'TXN-2025-002',
      date: '2025-01-31T11:15:00Z',
      customer: {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 234-5678'
      },
      service: {
        name: 'Hair Cut & Style',
        duration: 45,
        description: 'Professional haircut with styling',
        location: 'Chair 3'
      },
      amount: 85.00,
      refundAmount: 0,
      status: 'pending',
      paymentMethod: 'Debit Card',
      last4: '1234',
      processingFee: 2.68,
      appointmentDate: '2025-02-03T15:30:00Z',
      timeline: [
        { type: 'success', description: 'Payment initiated', timestamp: '2025-01-31T11:15:00Z' },
        { type: 'warning', description: 'Awaiting bank authorization', timestamp: '2025-01-31T11:15:15Z' }
      ]
    },
    {
      id: 'pay_003',
      transactionId: 'TXN-2025-003',
      date: '2025-01-30T16:45:00Z',
      customer: {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        phone: '+1 (555) 345-6789'
      },
      service: {
        name: 'Facial Treatment',
        duration: 90,
        description: 'Rejuvenating facial with organic products',
        location: 'Treatment Room 2'
      },
      amount: 150.00,
      refundAmount: 75.00,
      status: 'refunded',
      paymentMethod: 'PayPal',
      last4: '7890',
      processingFee: 4.73,
      appointmentDate: '2025-02-01T13:00:00Z',
      timeline: [
        { type: 'success', description: 'Payment completed', timestamp: '2025-01-30T16:45:00Z' },
        { type: 'warning', description: 'Refund requested', timestamp: '2025-01-31T09:20:00Z' },
        { type: 'success', description: 'Partial refund processed', timestamp: '2025-01-31T10:15:00Z' }
      ]
    },
    {
      id: 'pay_004',
      transactionId: 'TXN-2025-004',
      date: '2025-01-30T09:20:00Z',
      customer: {
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        phone: '+1 (555) 456-7890'
      },
      service: {
        name: 'Personal Training Session',
        duration: 60,
        description: 'One-on-one fitness training session',
        location: 'Gym Area'
      },
      amount: 95.00,
      refundAmount: 0,
      status: 'failed',
      paymentMethod: 'Credit Card',
      last4: '5678',
      processingFee: 0,
      failureReason: 'Insufficient funds',
      appointmentDate: '2025-02-02T08:00:00Z',
      timeline: [
        { type: 'success', description: 'Payment initiated', timestamp: '2025-01-30T09:20:00Z' },
        { type: 'error', description: 'Payment failed - Insufficient funds', timestamp: '2025-01-30T09:20:15Z' }
      ]
    }
  ];

  const [payments, setPayments] = useState(mockPayments);
  const [filteredPayments, setFilteredPayments] = useState(mockPayments);

  // Filter and sort payments
  useEffect(() => {
    let filtered = [...payments];

    // Apply search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(payment => 
        payment?.customer?.name?.toLowerCase()?.includes(searchTerm) ||
        payment?.customer?.email?.toLowerCase()?.includes(searchTerm) ||
        payment?.transactionId?.toLowerCase()?.includes(searchTerm) ||
        payment?.amount?.toString()?.includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters?.status && filters?.status !== 'all') {
      filtered = filtered?.filter(payment => payment?.status === filters?.status);
    }

    // Apply payment method filter
    if (filters?.paymentMethod && filters?.paymentMethod !== 'all') {
      const methodMap = {
        'credit_card': 'Credit Card',
        'debit_card': 'Debit Card',
        'paypal': 'PayPal',
        'bank_transfer': 'Bank Transfer'
      };
      filtered = filtered?.filter(payment => 
        payment?.paymentMethod === methodMap?.[filters?.paymentMethod]
      );
    }

    // Apply amount range filter
    if (filters?.amountRange && filters?.amountRange !== 'all') {
      const [min, max] = filters?.amountRange?.split('-')?.map(v => 
        v === '' ? Infinity : parseFloat(v?.replace('+', ''))
      );
      filtered = filtered?.filter(payment => {
        if (max === Infinity) return payment?.amount >= min;
        return payment?.amount >= min && payment?.amount <= max;
      });
    }

    // Apply date range filter
    if (filters?.startDate || filters?.endDate) {
      filtered = filtered?.filter(payment => {
        const paymentDate = new Date(payment.date);
        const start = filters?.startDate ? new Date(filters.startDate) : new Date('1900-01-01');
        const end = filters?.endDate ? new Date(filters.endDate) : new Date('2100-12-31');
        return paymentDate >= start && paymentDate <= end;
      });
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (sortConfig?.key === 'customer') {
        aValue = a?.customer?.name;
        bValue = b?.customer?.name;
      } else if (sortConfig?.key === 'service') {
        aValue = a?.service?.name;
        bValue = b?.service?.name;
      } else if (sortConfig?.key === 'method') {
        aValue = a?.paymentMethod;
        bValue = b?.paymentMethod;
      }

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredPayments(filtered);
  }, [payments, filters, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePaymentSelect = (paymentIds) => {
    if (paymentIds?.length === 1 && !selectedPayments?.includes(paymentIds?.[0])) {
      const payment = payments?.find(p => p?.id === paymentIds?.[0]);
      setSelectedPaymentDetails(payment);
    }
    setSelectedPayments(paymentIds);
  };

  const handleBulkAction = async (action, paymentIds = selectedPayments) => {
    setIsLoading(true);
    try {
      switch (action) {
        case 'export':
          console.log('Exporting payments:', paymentIds);
          break;
        case 'receipt': console.log('Sending receipts for:', paymentIds);
          break;
        case 'refund': console.log('Processing refunds for:', paymentIds);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefund = async (paymentId, refundData) => {
    setIsLoading(true);
    try {
      // Mock refund processing
      setPayments(prev => prev?.map(payment => 
        payment?.id === paymentId 
          ? { 
              ...payment, 
              status: 'refunded',
              refundAmount: (payment?.refundAmount || 0) + refundData?.amount,
              timeline: [
                ...payment?.timeline,
                {
                  type: 'success',
                  description: `Refund processed: $${refundData?.amount} - ${refundData?.reason}`,
                  timestamp: new Date()?.toISOString()
                }
              ]
            }
          : payment
      ));
      setSelectedPaymentDetails(null);
    } catch (error) {
      console.error('Refund failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReceipt = async (paymentId) => {
    console.log('Sending receipt for payment:', paymentId);
  };

  const handleDispute = async (paymentId) => {
    console.log('Reporting dispute for payment:', paymentId);
  };

  const handleExport = () => {
    console.log('Exporting payment data with filters:', filters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      paymentMethod: 'all',
      amountRange: 'all',
      startDate: '',
      endDate: '',
      quickDate: ''
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {/* Left Sidebar - Analytics */}
        <div className="hidden lg:block w-80 bg-card border-r border-border p-6 h-[calc(100vh-4rem)] overflow-y-auto">
          <PaymentAnalytics 
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Payment Processing</h1>
                <p className="text-muted-foreground">
                  Manage transactions, process refunds, and track payment analytics
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => window.location?.reload()}
                >
                  Refresh
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => navigate('/booking-flow')}
                >
                  New Booking
                </Button>
              </div>
            </div>

            {/* Mobile Analytics */}
            <div className="lg:hidden">
              <PaymentAnalytics 
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </div>

            {/* Filters */}
            <PaymentFilters
              filters={filters}
              onFiltersChange={setFilters}
              onExport={handleExport}
              onClearFilters={handleClearFilters}
            />

            {/* Payment Table */}
            <PaymentTable
              payments={filteredPayments}
              onPaymentSelect={handlePaymentSelect}
              selectedPayments={selectedPayments}
              onBulkAction={handleBulkAction}
              sortConfig={sortConfig}
              onSort={handleSort}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPayments?.length} of {payments?.length} payments
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                <span className="text-sm text-foreground px-3 py-1">1</span>
                <Button variant="outline" size="sm" disabled>
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Payment Details */}
        {selectedPaymentDetails && (
          <div className="hidden xl:block w-96 bg-card border-l border-border h-[calc(100vh-4rem)] overflow-y-auto">
            <PaymentDetails
              payment={selectedPaymentDetails}
              onClose={() => setSelectedPaymentDetails(null)}
              onRefund={handleRefund}
              onSendReceipt={handleSendReceipt}
              onDispute={handleDispute}
            />
          </div>
        )}
      </div>
      {/* Mobile Payment Details Modal */}
      {selectedPaymentDetails && (
        <div className="xl:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <PaymentDetails
              payment={selectedPaymentDetails}
              onClose={() => setSelectedPaymentDetails(null)}
              onRefund={handleRefund}
              onSendReceipt={handleSendReceipt}
              onDispute={handleDispute}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessing;