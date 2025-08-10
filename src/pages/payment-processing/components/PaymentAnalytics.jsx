import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const PaymentAnalytics = ({ selectedPeriod, onPeriodChange }) => {
  const revenueData = [
    { name: 'Mon', amount: 2400, transactions: 12 },
    { name: 'Tue', amount: 1398, transactions: 8 },
    { name: 'Wed', amount: 9800, transactions: 24 },
    { name: 'Thu', amount: 3908, transactions: 18 },
    { name: 'Fri', amount: 4800, transactions: 22 },
    { name: 'Sat', amount: 3800, transactions: 16 },
    { name: 'Sun', amount: 4300, transactions: 19 }
  ];

  const paymentMethodData = [
    { name: 'Credit Card', value: 65, color: '#4CAF50' },
    { name: 'Debit Card', value: 25, color: '#FF9800' },
    { name: 'PayPal', value: 8, color: '#2196F3' },
    { name: 'Bank Transfer', value: 2, color: '#9C27B0' }
  ];

  const monthlyTrend = [
    { month: 'Jan', revenue: 45000, refunds: 2300 },
    { month: 'Feb', revenue: 52000, refunds: 1800 },
    { month: 'Mar', revenue: 48000, refunds: 2100 },
    { month: 'Apr', revenue: 61000, refunds: 1600 },
    { month: 'May', revenue: 55000, refunds: 1900 },
    { month: 'Jun', revenue: 67000, refunds: 1400 }
  ];

  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  const totalRevenue = revenueData?.reduce((sum, item) => sum + item?.amount, 0);
  const totalTransactions = revenueData?.reduce((sum, item) => sum + item?.transactions, 0);
  const avgTransactionValue = totalRevenue / totalTransactions;

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Payment Analytics</h3>
        <div className="flex items-center space-x-2">
          {periods?.map((period) => (
            <button
              key={period?.value}
              onClick={() => onPeriodChange(period?.value)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedPeriod === period?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {period?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">${totalRevenue?.toLocaleString()}</p>
              <p className="text-xs text-success flex items-center mt-1">
                <Icon name="TrendingUp" size={12} className="mr-1" />
                +12.5% from last period
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="DollarSign" size={24} className="text-success" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold text-foreground">{totalTransactions}</p>
              <p className="text-xs text-success flex items-center mt-1">
                <Icon name="TrendingUp" size={12} className="mr-1" />
                +8.3% from last period
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="CreditCard" size={24} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Transaction</p>
              <p className="text-2xl font-bold text-foreground">${avgTransactionValue?.toFixed(2)}</p>
              <p className="text-xs text-warning flex items-center mt-1">
                <Icon name="Minus" size={12} className="mr-1" />
                -2.1% from last period
              </p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-accent" />
            </div>
          </div>
        </div>
      </div>
      {/* Revenue Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-medium text-foreground mb-4">Daily Revenue</h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="name" stroke="#757575" fontSize={12} />
              <YAxis stroke="#757575" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  name === 'amount' ? `$${value?.toLocaleString()}` : value,
                  name === 'amount' ? 'Revenue' : 'Transactions'
                ]}
              />
              <Bar dataKey="amount" fill="#4CAF50" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Payment Methods Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-medium text-foreground mb-4">Payment Methods</h4>
        <div className="flex items-center space-x-8">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {paymentMethodData?.map((method) => (
              <div key={method?.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: method?.color }}
                  />
                  <span className="text-sm text-foreground">{method?.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{method?.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Monthly Trend */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-medium text-foreground mb-4">Revenue vs Refunds Trend</h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="month" stroke="#757575" fontSize={12} />
              <YAxis stroke="#757575" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  `$${value?.toLocaleString()}`,
                  name === 'revenue' ? 'Revenue' : 'Refunds'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4CAF50" 
                strokeWidth={3}
                dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="refunds" 
                stroke="#D32F2F" 
                strokeWidth={3}
                dot={{ fill: '#D32F2F', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalytics;