import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import Header from '../../components/ui/Header';
import NotificationCenter from '../../components/ui/NotificationCenter';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import Icon from '../../components/AppIcon';
import ScoreRing from './components/ScoreRing';
import ScoreHistoryChart from './components/ScoreHistoryChart';
import MetricsPanel from './components/MetricsPanel';
import QuickActionCards from './components/QuickActionCards';
import AlertNotifications from './components/AlertNotifications';
import EligibilityCard from './components/EligibilityCard';
import PredictiveInsightCard from './components/PredictiveInsightCard';
import ReportVisitModal from './components/ReportVisitModal';
import CreditTasksPanel from './components/CreditTasksPanel';
import Button from '../../components/ui/Button';

import { io } from 'socket.io-client';
import VirtualCreditCard from '../VirtualCreditCard';
import PatientActivities from '../PatientActivities';

const MedicalCreditDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const getSafeUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  };

  const user = getSafeUser();
  const [localPhid, setLocalPhid] = useState(user?.phid || "PH-UNASSIGNED");

  useEffect(() => {
    const fetchDashboard = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/dashboard');
            setDashboardData(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
            setError(err.response?.data?.error || err.message || 'Failed to load dashboard');
        } finally {
            setIsLoading(false);
        }
    };
    fetchDashboard();
  }, []);

  const [toast, setToast] = useState(null);

  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 8000); // Clear after 8s
  };

  // WebSocket Connection for Real-Time Sync
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    if (!userId) return;

    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
        withCredentials: true,
    });

    socket.on('connect', () => {
        console.log('[socket] Connected to Live Engine');
        socket.emit('join_user_room', userId);
    });

    socket.on('score_updated', async (data) => {
        console.log("Real-time Score Update Received", data);
        showToast("Credit Score Updated", data.message || "Your medical credit score has been refreshed.");
        try {
            const response = await api.get('/dashboard');
            setDashboardData(response.data);
        } catch (err) {
            console.error("WebSocket Refetch Failed:", err);
        }
    });

    socket.on('phid_generated', async (data) => {
        console.log("Real-time PHID Generated", data);
        showToast("PH-ID Assigned!", `Your unique Health ID: ${data.phid} is now active.`);
        try {
            // Update local state and storage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, phid: data.phid };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setLocalPhid(data.phid);

            // Refetch dashboard data
            const response = await api.get('/dashboard');
            setDashboardData(response.data);
        } catch (err) {
            console.error("PHID Sync Failed:", err);
        }
    });

    socket.on('notification', async (data) => {
        console.log("Real-time Notification Received", data);
        if (data.title && data.message) {
            showToast(data.title, data.message);
        }
        try {
            const response = await api.get('/dashboard');
            setDashboardData(response.data);
        } catch (err) {
            console.error("Notification Sync Failed:", err);
        }
    });

    return () => {
        socket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/patient-login');
  };

  const handleReportVisit = async (formData) => {
    try {
      await api.post('/profile/timeline', formData);
      // Re-fetch dashboard data to show the updated score immediately
      const response = await api.get('/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      console.error('Failed to report visit:', err);
      alert('Failed to report visit');
    }
  };

  const handleTaskComplete = async (taskData) => {
    try {
      await api.post('/profile/complete-task', {
        taskId: taskData.taskId,
        points: taskData.points,
        type: 'task',
        title: taskData.title,
        description: taskData.description
      });
      // Re-fetch dashboard data to show the updated score
      const response = await api.get('/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      console.error('Failed to complete task:', err);
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-elevation-2 p-6 text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Failed to Load Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Formatting metrics array to match the child component logic
  const metrics = dashboardData?.metrics ? [
    {
      label: 'Total Medical Bills',
      value: dashboardData.metrics.totalMedicalBills || 0,
      isCurrency: true,
      icon: 'Receipt',
      type: 'total',
      trend: 'up',
      trendValue: 'Based on total history'
    },
    {
      label: 'Outstanding Dues',
      value: dashboardData.metrics.outstandingDues || 0,
      isCurrency: true,
      icon: 'AlertCircle',
      type: 'outstanding',
      trend: dashboardData.metrics.outstandingDues > 0 ? 'up' : 'stable',
      trendValue: 'Current standing'
    },
    {
      label: 'Payment History',
      value: dashboardData.metrics.paymentHistoryPercent || 0,
      isPercentage: true,
      icon: 'CheckCircle',
      type: 'payment',
      trend: 'up',
      trendValue: 'Overall metric'
    },
    {
      label: 'Hospital Visits',
      value: dashboardData.metrics.hospitalVisits || 0,
      icon: 'Activity',
      type: 'visits',
      trend: 'up',
      trendValue: 'Total recorded visits'
    }
  ] : [];

  const rawScore = dashboardData?.currentScore?.score || 0;
  const rawTrend = dashboardData?.currentScore?.trend || 'stable';

  return (
    <div className={`min-h-screen bg-background relative`}>
      {/* Real-time Event Toast */}
      {toast && (
        <div className="fixed top-24 right-4 z-[100] w-full max-w-sm bg-card border-l-4 border-primary shadow-elevation-4 animate-in slide-in-from-right duration-300 rounded-lg overflow-hidden">
          <div className="p-4 flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Icon name="ShieldCheck" size={20} color="var(--color-primary)" />
            </div>
            <div className="flex-1">
              <h4 className="font-heading font-bold text-sm text-foreground">{toast.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-muted-foreground hover:text-foreground">
              <Icon name="X" size={16} />
            </button>
          </div>
          <div className="h-1 bg-primary/20 w-full overflow-hidden">
             <div className="h-full bg-primary animate-progress-shrink" />
          </div>
        </div>
      )}

      <Header onLogout={handleLogout} />

      <QuickActionsToolbar userRole="patient" />

      <div className={`mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-24 lg:pb-10 transition-all duration-100`}>
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

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Plus"
                onClick={() => setIsReportModalOpen(true)}
              >
                Report Visit
              </Button>
              <div className="hidden lg:block">
                <NotificationCenter notifications={dashboardData?.alerts || []} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 md:mb-8">
            <AlertNotifications alerts={dashboardData?.alerts || []} />
        </div>

        <div className="mb-6 md:mb-8 mt-4">
            <VirtualCreditCard 
                phid={localPhid} 
                patientName={`${user?.firstName || ''} ${user?.lastName || ''}`} 
                creditScore={rawScore} 
            />
        </div>

        <div className="mb-6 md:mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <PredictiveInsightCard currentScore={rawScore} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-elevation-2 mb-6 md:mb-8">
              <ScoreRing
                score={rawScore}
                maxScore={1000}
                trend={rawTrend}
                changeAmount={dashboardData?.currentScore?.change || 0}
              />
            </div>

            <ScoreHistoryChart data={dashboardData?.scoreHistory || []} />
          </div>

          <div className="space-y-6 md:space-y-8">
            <EligibilityCard eligibility={dashboardData?.eligibility} />

            <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {dashboardData?.recentActivity?.length > 0 ? (
                  dashboardData.recentActivity.map((activity, i) => (
                    <div key={activity.id} className={`flex items-start space-x-3 pb-3 ${i < dashboardData.recentActivity.length - 1 ? 'border-b border-border' : ''}`}>
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.type === 'payment' ? 'bg-success' : 'bg-primary'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                          {activity.amount !== 0 && ` • Impact: ${activity.amount > 0 ? '+' : ''}${activity.amount}`}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity found.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 md:mb-8">
            <CreditTasksPanel onTaskComplete={handleTaskComplete} />
        </div>

        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-4 md:mb-6">
            Key Metrics
          </h2>
          <MetricsPanel metrics={metrics} />
        </div>



        <div>
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-4 md:mb-6">
            Quick Actions
          </h2>
          <QuickActionCards />
        </div>
      </div>

      <MobileBottomNav
        creditScore={rawScore}
        creditTrend={rawTrend}
      />

      <ReportVisitModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportVisit}
      />
    </div>
  );
};

export default MedicalCreditDashboard;