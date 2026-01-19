import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionSecurityHeader from '../../components/ui/SessionSecurityHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import ScoreRing from './components/ScoreRing';
import ScoreHistoryChart from './components/ScoreHistoryChart';
import MetricsPanel from './components/MetricsPanel';
import QuickActionCards from './components/QuickActionCards';
import AlertNotifications from './components/AlertNotifications';
import EligibilityCard from './components/EligibilityCard';

const MedicalCreditDashboard = () => {
  const navigate = useNavigate();
  const [currentScore, setCurrentScore] = useState(725);
  const [scoreTrend, setScoreTrend] = useState('up');
  const [scoreChange, setScoreChange] = useState(45);

  const mockNotifications = [
    {
      id: 1,
      type: 'score_change',
      title: 'Credit Score Updated',
      message: 'Your medical credit score increased by 45 points due to timely payment',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: 2,
      type: 'payment_due',
      title: 'Payment Reminder',
      message: 'Outstanding bill of ₹15,000 is due in 5 days',
      timestamp: new Date(Date.now() - 7200000),
      read: false
    },
    {
      id: 3,
      type: 'eligibility',
      title: 'New Benefit Unlocked',
      message: 'You are now eligible for cashless treatment at partner hospitals',
      timestamp: new Date(Date.now() - 86400000),
      read: true
    }
  ];

  const mockScoreHistory = [
    { date: '01/07/2025', score: 620 },
    { date: '01/08/2025', score: 640 },
    { date: '01/09/2025', score: 655 },
    { date: '01/10/2025', score: 670 },
    { date: '01/11/2025', score: 680 },
    { date: '01/12/2025', score: 695 },
    { date: '01/01/2026', score: 725 }
  ];

  const mockMetrics = [
    {
      label: 'Total Medical Bills',
      value: 250000,
      isCurrency: true,
      icon: 'Receipt',
      type: 'total',
      trend: 'up',
      trendValue: '₹25,000 this month'
    },
    {
      label: 'Outstanding Dues',
      value: 15000,
      isCurrency: true,
      icon: 'AlertCircle',
      type: 'outstanding',
      trend: 'down',
      trendValue: '₹5,000 less than last month'
    },
    {
      label: 'Payment History',
      value: 92,
      isPercentage: true,
      icon: 'CheckCircle',
      type: 'payment',
      trend: 'up',
      trendValue: '5% improvement'
    },
    {
      label: 'Hospital Visits',
      value: 12,
      icon: 'Activity',
      type: 'visits',
      trend: 'up',
      trendValue: '3 visits this quarter'
    }
  ];

  const mockAlerts = [
    {
      type: 'success',
      title: 'Score Improvement',
      message: 'Your credit score increased by 45 points this month due to consistent payment behavior. Keep up the good work!',
      action: {
        label: 'View Details',
        onClick: () => navigate('/credit-score-details')
      }
    },
    {
      type: 'warning',
      title: 'Payment Due Soon',
      message: 'You have an outstanding bill of ₹15,000 due on 25/01/2026. Pay before the due date to maintain your credit score.',
      action: {
        label: 'Pay Now',
        onClick: () => navigate('/billing-records')
      }
    },
    {
      type: 'info',
      title: 'Cashless Treatment Available',
      message: 'You are now eligible for cashless treatment at 50+ partner hospitals across India. Check your benefits section for more details.',
      action: {
        label: 'View Hospitals',
        onClick: () => navigate('/credit-score-details')
      }
    }
  ];

  const mockEligibility = {
    medicalLoan: true,
    cashlessTreatment: true,
    discountEligible: true,
    discountPercentage: 15,
    loanAmount: 500000
  };

  const handleLogout = () => {
    navigate('/patient-login');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const randomChange = Math.floor(Math.random() * 10) - 5;
      setCurrentScore(prev => Math.max(0, Math.min(1000, prev + randomChange)));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SessionSecurityHeader 
        sessionTimeout={1800000}
        onLogout={handleLogout}
      />
      
      <Header />
      
      <QuickActionsToolbar userRole="patient" />

      <div className="mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10 pb-24 lg:pb-10">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Medical Credit Dashboard
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Track your healthcare financial standing and creditworthiness
              </p>
            </div>

            <div className="hidden lg:block">
              <NotificationCenter notifications={mockNotifications} />
            </div>
          </div>
        </div>

        <div className="mb-6 md:mb-8">
          <AlertNotifications alerts={mockAlerts} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-elevation-2 mb-6 md:mb-8">
              <ScoreRing 
                score={currentScore}
                maxScore={1000}
                trend={scoreTrend}
                changeAmount={scoreChange}
              />
            </div>

            <ScoreHistoryChart data={mockScoreHistory} />
          </div>

          <div className="space-y-6 md:space-y-8">
            <EligibilityCard eligibility={mockEligibility} />

            <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 pb-3 border-b border-border">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Payment Received</p>
                    <p className="text-xs text-muted-foreground">₹10,000 • 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 pb-3 border-b border-border">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Hospital Visit</p>
                    <p className="text-xs text-muted-foreground">Apollo Hospital • 5 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">New Bill Generated</p>
                    <p className="text-xs text-muted-foreground">₹15,000 • 1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-4 md:mb-6">
            Key Metrics
          </h2>
          <MetricsPanel metrics={mockMetrics} />
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-4 md:mb-6">
            Quick Actions
          </h2>
          <QuickActionCards />
        </div>
      </div>

      <MobileBottomNav 
        creditScore={currentScore}
        creditTrend={scoreTrend}
      />
    </div>
  );
};

export default MedicalCreditDashboard;