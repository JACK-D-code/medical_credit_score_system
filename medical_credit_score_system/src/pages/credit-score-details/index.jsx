import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
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
import api from '../../lib/api';
import { io } from 'socket.io-client';

const CreditScoreDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('breakdown');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    patientData: {},
    scoreBreakdown: [],
    recommendations: [],
    historyData: [],
    timelineEvents: [],
    notifications: []
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get('/scores/details');
        setData(response.data);
      } catch (err) {
        console.error('Failed to load credit score details', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const phid = user?.phid;

    if (phid) {
        const socket = io('http://localhost:5000', {
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log('[socket] Score Details Connected to Live Engine');
            socket.emit('join_phid_room', phid);
        });

        socket.on('scoreUpdated', () => {
            console.log("Real-time Score Update Received in Score Details");
            fetchDetails();
        });

        return () => {
            socket.disconnect();
        };
    }
  }, []);

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
      <Header onLogout={handleLogout} />
      <QuickActionsToolbar />
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-24 lg:pb-8">
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
                <NotificationCenter notifications={data?.notifications || []} />
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
              <CreditScoreWidget score={data?.patientData?.creditScore || 0} trend={data?.patientData?.creditTrend || 'stable'} />
            </div>
            <div className="lg:col-span-2 bg-card rounded-lg shadow-elevation-2 p-4 md:p-6">
              <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-mono font-bold text-primary mb-1">{data?.patientData?.creditScore || 0}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Current Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-mono font-bold text-success mb-1">+{data?.patientData?.pointsThisYear || 0}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Points This Year</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-mono font-bold text-warning mb-1">{data?.patientData?.paymentRatio ?? 100}%</div>
                  <div className="text-xs md:text-sm text-muted-foreground">On-Time Payments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-mono font-bold text-accent mb-1">{data?.patientData?.totalBillsFormatted || '₹0'}</div>
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
                    className={`flex items-center space-x-2 px-4 md:px-6 py-3 md:py-4 transition-smooth whitespace-nowrap ${activeTab === tab?.id
                        ? 'border-b-2 border-primary text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
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
              {data?.scoreBreakdown?.map((factor) => (
                <ScoreBreakdownCard key={factor?.factor} {...factor} />
              ))}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data?.recommendations?.map((recommendation, index) => (
                <ImprovementRecommendation key={index} {...recommendation} />
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ScoreHistoryChart data={data?.historyData?.length ? data?.historyData : [{ date: 'N/A', score: 0 }]} />
              </div>
              <div className="lg:col-span-1">
                <ScoreTimeline events={data?.timelineEvents} />
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
              <EligibilityComparison currentScore={data?.patientData?.creditScore || 0} />
            </div>
          )}

          {activeTab === 'certificate' && (
            <div className="max-w-3xl mx-auto">
              <CertificateGenerator
                patientName={data?.patientData?.name}
                patientId={data?.patientData?.patientId}
                creditScore={data?.patientData?.creditScore}
                validUntil={data?.patientData?.validUntil}
              />
            </div>
          )}
        </div>
      )}
      <MobileBottomNav creditScore={data?.patientData?.creditScore || 0} creditTrend={data?.patientData?.creditTrend || 'stable'} />
    </div>
  );
};

export default CreditScoreDetails;