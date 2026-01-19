import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionSecurityHeader from '../../components/ui/SessionSecurityHeader';
import CreditScoreWidget from '../../components/ui/CreditScoreWidget';
import NotificationCenter from '../../components/ui/NotificationCenter';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import ScoreBreakdownCard from './components/ScoreBreakdownCard';
import ImprovementRecommendation from './components/ImprovementRecommendation';
import ScoreHistoryChart from './components/ScoreHistoryChart';
import MethodologySection from './components/MethodologySection';
import EligibilityComparison from './components/EligibilityComparison';
import ScoreTimeline from './components/ScoreTimeline';
import CertificateGenerator from './components/CertificateGenerator';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const CreditScoreDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('breakdown');

  const mockPatientData = {
    name: "Rajesh Kumar Sharma",
    patientId: "MCI2026001234",
    creditScore: 782,
    creditTrend: "up",
    validUntil: "19/04/2026"
  };

  const mockScoreBreakdown = [
    {
      factor: "Total Medical Bills",
      score: 245,
      maxScore: 300,
      weight: 30,
      trend: "up",
      description: "Your total medical expenditure of ₹4,08,500 over the past 24 months demonstrates consistent healthcare engagement and responsibility.",
      icon: "Receipt",
      color: "var(--color-primary)"
    },
    {
      factor: "Outstanding Dues",
      score: 198,
      maxScore: 250,
      weight: 25,
      trend: "stable",
      description: "You have ₹12,300 in outstanding dues (3% of total bills), showing excellent payment discipline and financial management.",
      icon: "AlertCircle",
      color: "var(--color-success)"
    },
    {
      factor: "Payment History",
      score: 215,
      maxScore: 250,
      weight: 25,
      trend: "up",
      description: "86% of your payments were made on time, with only 2 delays in the past year. Consistent improvement noted.",
      icon: "Clock",
      color: "var(--color-warning)"
    },
    {
      factor: "Hospital Visit Frequency",
      score: 68,
      maxScore: 100,
      weight: 10,
      trend: "up",
      description: "You've made 8 preventive care visits out of 12 total visits, indicating proactive health management.",
      icon: "Activity",
      color: "var(--color-accent)"
    },
    {
      factor: "Treatment Type Diversity",
      score: 56,
      maxScore: 100,
      weight: 10,
      trend: "stable",
      description: "Balanced mix of preventive (40%), diagnostic (35%), and treatment services (25%) shows comprehensive healthcare approach.",
      icon: "Layers",
      color: "var(--color-secondary)"
    }
  ];

  const mockRecommendations = [
    {
      title: "Clear Outstanding Balance",
      description: "Paying off your remaining ₹12,300 outstanding dues will immediately boost your score. Consider setting up auto-payment for future bills to maintain consistency.",
      impact: 35,
      actionLabel: "View Payment Options",
      priority: "high",
      icon: "CreditCard"
    },
    {
      title: "Schedule Preventive Checkups",
      description: "Increase your preventive care visits from 8 to 12 annually. Regular health screenings demonstrate proactive healthcare management and reduce risk profile.",
      impact: 28,
      actionLabel: "Book Appointment",
      priority: "medium",
      icon: "Calendar"
    },
    {
      title: "Maintain Payment Timeliness",
      description: "Continue your excellent payment track record. Setting up payment reminders 5 days before due dates can help avoid any delays.",
      impact: 15,
      actionLabel: "Set Reminders",
      priority: "medium",
      icon: "Bell"
    },
    {
      title: "Diversify Healthcare Services",
      description: "Consider adding dental and eye care checkups to your healthcare routine. This demonstrates comprehensive health awareness.",
      impact: 12,
      actionLabel: "Explore Services",
      priority: "low",
      icon: "Eye"
    }
  ];

  const mockHistoryData = [
    { date: "Jan 2025", score: 685, event: "Initial assessment" },
    { date: "Feb 2025", score: 698, event: "On-time payment" },
    { date: "Mar 2025", score: 712, event: "Preventive checkup" },
    { date: "Apr 2025", score: 705, event: "Payment delay" },
    { date: "May 2025", score: 728, event: "Outstanding cleared" },
    { date: "Jun 2025", score: 745, event: "Regular payments" },
    { date: "Jul 2025", score: 738, event: "New medical bill" },
    { date: "Aug 2025", score: 756, event: "Early payment" },
    { date: "Sep 2025", score: 765, event: "Preventive care" },
    { date: "Oct 2025", score: 772, event: "Consistent payments" },
    { date: "Nov 2025", score: 778, event: "Low outstanding" },
    { date: "Dec 2025", score: 782, event: "Excellent track record" }
  ];

  const mockTimelineEvents = [
    {
      id: 1,
      type: "payment",
      title: "Early Payment Bonus",
      date: "15/12/2025",
      description: "Paid ₹45,000 medical bill 10 days before due date, demonstrating excellent financial discipline.",
      impact: 8
    },
    {
      id: 2,
      type: "visit",
      title: "Preventive Health Checkup",
      date: "03/12/2025",
      description: "Completed annual preventive health screening at Apollo Hospital, showing proactive healthcare management.",
      impact: 6
    },
    {
      id: 3,
      type: "payment",
      title: "Outstanding Balance Cleared",
      date: "28/11/2025",
      description: "Cleared pending balance of ₹18,500 from previous treatment, reducing outstanding dues to 3%.",
      impact: 12
    },
    {
      id: 4,
      type: "delay",
      title: "Payment Delay",
      date: "15/10/2025",
      description: "Payment of ₹22,000 was delayed by 8 days due to processing issues. Resolved promptly.",
      impact: -5
    },
    {
      id: 5,
      type: "bill",
      title: "New Medical Bill Added",
      date: "05/10/2025",
      description: "New bill of ₹35,000 for diagnostic tests at Fortis Hospital added to your account.",
      impact: 0
    },
    {
      id: 6,
      type: "payment",
      title: "Consistent Payment Record",
      date: "20/09/2025",
      description: "Maintained 6-month streak of on-time payments, demonstrating reliability and financial stability.",
      impact: 15
    }
  ];

  const mockNotifications = [
    {
      id: 1,
      type: "score_change",
      title: "Credit Score Increased",
      message: "Your credit score improved by 8 points due to early payment.",
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: 2,
      type: "eligibility",
      title: "New Tier Unlocked",
      message: "You're now eligible for Premium Cashless treatment up to ₹10,00,000.",
      timestamp: new Date(Date.now() - 86400000),
      read: false
    },
    {
      id: 3,
      type: "payment_due",
      title: "Payment Reminder",
      message: "Outstanding balance of ₹12,300 due in 5 days.",
      timestamp: new Date(Date.now() - 172800000),
      read: true
    }
  ];

  const handleLogout = () => {
    navigate('/patient-login');
  };

  const tabs = [
    { id: 'breakdown', label: 'Score Breakdown', icon: 'BarChart3' },
    { id: 'recommendations', label: 'Improvements', icon: 'Lightbulb' },
    { id: 'history', label: 'History', icon: 'TrendingUp' },
    { id: 'methodology', label: 'Methodology', icon: 'BookOpen' },
    { id: 'eligibility', label: 'Eligibility', icon: 'Award' },
    { id: 'certificate', label: 'Certificate', icon: 'FileText' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SessionSecurityHeader onLogout={handleLogout} />
      <Header />
      <QuickActionsToolbar />
      <div className="mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 pb-24 lg:pb-8">
        <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
              Credit Score Analysis
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Comprehensive breakdown of your medical creditworthiness
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden lg:block">
              <NotificationCenter notifications={mockNotifications} />
            </div>
            <Button
              variant="outline"
              iconName="ArrowLeft"
              iconPosition="left"
              onClick={() => navigate('/medical-credit-dashboard')}
            >
              <span className="hidden md:inline">Back to Dashboard</span>
              <span className="md:hidden">Back</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 md:mb-8">
          <div className="lg:col-span-1">
            <CreditScoreWidget score={mockPatientData?.creditScore} trend={mockPatientData?.creditTrend} />
          </div>
          <div className="lg:col-span-2 bg-card rounded-lg shadow-elevation-2 p-4 md:p-6">
            <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-mono font-bold text-primary mb-1">782</div>
                <div className="text-xs md:text-sm text-muted-foreground">Current Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-mono font-bold text-success mb-1">+97</div>
                <div className="text-xs md:text-sm text-muted-foreground">Points This Year</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-mono font-bold text-warning mb-1">86%</div>
                <div className="text-xs md:text-sm text-muted-foreground">On-Time Payments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-mono font-bold text-accent mb-1">₹4.1L</div>
                <div className="text-xs md:text-sm text-muted-foreground">Total Bills</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-elevation-2 mb-6 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="flex border-b border-border min-w-max">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 md:px-6 py-3 md:py-4 transition-smooth whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'border-b-2 border-primary text-primary font-medium' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} color="currentColor" />
                  <span className="text-sm md:text-base font-caption">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === 'breakdown' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockScoreBreakdown?.map((factor) => (
              <ScoreBreakdownCard key={factor?.factor} {...factor} />
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockRecommendations?.map((recommendation, index) => (
              <ImprovementRecommendation key={index} {...recommendation} />
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ScoreHistoryChart data={mockHistoryData} />
            </div>
            <div className="lg:col-span-1">
              <ScoreTimeline events={mockTimelineEvents} />
            </div>
          </div>
        )}

        {activeTab === 'methodology' && (
          <div className="max-w-4xl mx-auto">
            <MethodologySection />
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className="max-w-4xl mx-auto">
            <EligibilityComparison currentScore={mockPatientData?.creditScore} />
          </div>
        )}

        {activeTab === 'certificate' && (
          <div className="max-w-3xl mx-auto">
            <CertificateGenerator
              patientName={mockPatientData?.name}
              patientId={mockPatientData?.patientId}
              creditScore={mockPatientData?.creditScore}
              validUntil={mockPatientData?.validUntil}
            />
          </div>
        )}
      </div>
      <MobileBottomNav creditScore={mockPatientData?.creditScore} creditTrend={mockPatientData?.creditTrend} />
    </div>
  );
};

export default CreditScoreDetails;