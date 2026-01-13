import React, { useState } from 'react';
import RoleBasedNavigation, { QuickActionToolbar } from '../../components/ui/RoleBasedNavigation';
import CreditScoreCard from './components/CreditScoreCard';
import OutstandingDuesCard from './components/OutstandingDuesCard';
import ScoreTrendChart from './components/ScoreTrendChart';
import PaymentPatternChart from './components/PaymentPatternChart';
import KeyMetricsGrid from './components/KeyMetricsGrid';
import RecentTransactionsTable from './components/RecentTransactionsTable';
import NotificationAlerts from './components/NotificationAlerts';
import QuickActionsPanel from './components/QuickActionsPanel';

const PatientDashboard = () => {
  const [currentScore] = useState(735);
  const [scoreChange] = useState(15);

  const scoreTrendData = [
    { month: 'Aug', score: 680 },
    { month: 'Sep', score: 695 },
    { month: 'Oct', score: 710 },
    { month: 'Nov', score: 720 },
    { month: 'Dec', score: 720 },
    { month: 'Jan', score: 735 }
  ];

  const paymentPatternData = [
    { month: 'Aug', onTime: 1200, late: 300, missed: 0 },
    { month: 'Sep', onTime: 1500, late: 0, missed: 0 },
    { month: 'Oct', onTime: 2000, late: 500, missed: 0 },
    { month: 'Nov', onTime: 1800, late: 0, missed: 0 },
    { month: 'Dec', onTime: 2200, late: 0, missed: 0 },
    { month: 'Jan', onTime: 1600, late: 0, missed: 0 }
  ];

  const outstandingDues = [
    {
      id: 1,
      description: 'Cardiology Consultation',
      billNumber: 'MED-2026-001234',
      amount: 450.00,
      dueDate: '2026-01-18'
    },
    {
      id: 2,
      description: 'Laboratory Tests - Blood Work',
      billNumber: 'MED-2026-001189',
      amount: 280.00,
      dueDate: '2026-01-25'
    },
    {
      id: 3,
      description: 'Physical Therapy Session',
      billNumber: 'MED-2025-004567',
      amount: 120.00,
      dueDate: '2026-01-08'
    }
  ];

  const keyMetrics = [
    {
      id: 1,
      type: 'visits',
      label: 'Hospital Visits',
      value: '24',
      description: 'Last 12 months',
      badge: { type: 'success', icon: 'TrendingUp', text: '+3 this month' }
    },
    {
      id: 2,
      type: 'treatments',
      label: 'Treatment Types',
      value: '8',
      description: 'Different categories',
      badge: null
    },
    {
      id: 3,
      type: 'loanEligible',
      label: 'Loan Eligible',
      value: 'Yes',
      description: 'Up to $15,000',
      badge: { type: 'success', icon: 'CheckCircle', text: 'Approved' }
    },
    {
      id: 4,
      type: 'cashless',
      label: 'Cashless Status',
      value: 'Active',
      description: '12 partner hospitals',
      badge: { type: 'success', icon: 'Shield', text: 'Verified' }
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      date: '2026-01-10',
      description: 'Emergency Room Visit',
      billNumber: 'MED-2026-001298',
      amount: 850.00,
      status: 'completed'
    },
    {
      id: 2,
      date: '2026-01-08',
      description: 'Prescription Medication',
      billNumber: 'MED-2026-001276',
      amount: 125.50,
      status: 'completed'
    },
    {
      id: 3,
      date: '2026-01-05',
      description: 'Dental Cleaning',
      billNumber: 'MED-2026-001245',
      amount: 180.00,
      status: 'completed'
    },
    {
      id: 4,
      date: '2025-12-28',
      description: 'X-Ray Imaging',
      billNumber: 'MED-2025-004892',
      amount: 320.00,
      status: 'completed'
    },
    {
      id: 5,
      date: '2025-12-20',
      description: 'Specialist Consultation',
      billNumber: 'MED-2025-004756',
      amount: 400.00,
      status: 'pending'
    }
  ];

  const notificationAlerts = [
    {
      id: 1,
      type: 'error',
      title: 'Payment Overdue',
      message: 'Your payment of $120.00 for Physical Therapy Session (Bill #MED-2025-004567) is overdue by 3 days. Please make payment to avoid late fees.',
      actions: [
        { label: 'Pay Now', primary: true, onClick: () => handlePayNow() },
        { label: 'View Details', primary: false, onClick: () => console.log('View details') }
      ]
    },
    {
      id: 2,
      type: 'warning',
      title: 'Upcoming Payment Due',
      message: 'You have a payment of $450.00 due in 7 days for Cardiology Consultation (Bill #MED-2026-001234).',
      actions: [
        { label: 'Set Reminder', primary: false, onClick: () => console.log('Set reminder') }
      ]
    },
    {
      id: 3,
      type: 'success',
      title: 'Credit Score Improved',
      message: 'Congratulations! Your medical credit score has increased by 15 points this month due to consistent on-time payments.',
      actions: []
    }
  ];

  const handlePayNow = () => {
    console.log('Navigating to payment page...');
  };

  const handleQuickAction = (actionId) => {
    console.log(`Quick action triggered: ${actionId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole="patient" />
      <QuickActionToolbar userRole="patient" />
      <main className="pt-16 lg:pt-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
              Welcome back, John
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Here's your medical credit overview for {new Date()?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="mb-6 md:mb-8">
            <NotificationAlerts alerts={notificationAlerts} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="lg:col-span-2">
              <CreditScoreCard score={currentScore} change={scoreChange} />
            </div>
            <div className="lg:col-span-1">
              <OutstandingDuesCard dues={outstandingDues} onPayNow={handlePayNow} />
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <KeyMetricsGrid metrics={keyMetrics} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <ScoreTrendChart data={scoreTrendData} />
            <PaymentPatternChart data={paymentPatternData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="lg:col-span-2">
              <RecentTransactionsTable transactions={recentTransactions} />
            </div>
            <div className="lg:col-span-1">
              <QuickActionsPanel onAction={handleQuickAction} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;