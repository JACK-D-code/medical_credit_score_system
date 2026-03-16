import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/shadcn-button';
import MedicalCreditScoreSystem from '../services/MedicalCreditScoreSystem';
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  Zap, 
  Shield, 
  Star,
  Activity,
  Calendar,
  Target,
  Award,
  BarChart3,
  Bell,
  Settings,
  User,
  Heart,
  Clock,
  CheckCircle,
  TrendingDown,
  AlertCircle,
  FileText,
  ChevronRight,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react';

const PatientDashboardIntegrated = () => {
  const [mcs] = useState(() => MedicalCreditScoreSystem.getInstance());
  const [patientData, setPatientData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scoreAnimation, setScoreAnimation] = useState(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    // Load initial data
    const loadData = () => {
      setPatientData(mcs.getPatientData());
      setActivities(mcs.getActivities());
      setBills(mcs.getBills());
      setAnalytics(mcs.getAnalytics());
      setRecentActivities(mcs.getActivities().slice(0, 5));
      setLoading(false);
    };

    loadData();

    // Subscribe to updates
    const unsubscribeScore = mcs.on('scoreUpdated', (data: any) => {
      setPatientData(mcs.getPatientData());
      setAnalytics(mcs.getAnalytics());
      
      // Animate score change
      animateScore(data.oldScore, data.newScore);
    });

    const unsubscribeActivity = mcs.on('activityCompleted', (data: any) => {
      setActivities(mcs.getActivities());
      setRecentActivities(mcs.getActivities().slice(0, 5));
      setAnalytics(mcs.getAnalytics());
    });

    const unsubscribeBill = mcs.on('billPaid', (data: any) => {
      setBills(mcs.getBills());
      setAnalytics(mcs.getAnalytics());
    });

    return () => {
      unsubscribeScore();
      unsubscribeActivity();
      unsubscribeBill();
    };
  }, [mcs]);

  // Animate score change
  const animateScore = (from: number, to: number) => {
    const duration = 1000;
    const steps = 30;
    const stepValue = (to - from) / steps;
    let current = from;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current += stepValue;
      if (step >= steps) {
        clearInterval(interval);
        setScoreAnimation(to);
      } else {
        setScoreAnimation(Math.round(current));
      }
    }, duration / steps);
  };

  // Simulate patient activity
  const simulateActivity = (type: string, points: number, title: string) => {
    const result = mcs.simulateActivity(type, points, title);
    if (result.success) {
      // Show success notification
      console.log(`Activity completed: ${title} (+${points} points)`);
    }
  };

  // Get credit score color
  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-400';
    if (score >= 700) return 'text-blue-400';
    if (score >= 600) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Get score badge
  const getScoreBadge = (score: number) => {
    if (score >= 800) return { label: 'Excellent', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (score >= 700) return { label: 'Good', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (score >= 600) return { label: 'Fair', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return { label: 'Poor', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your digital health wallet...</p>
        </div>
      </div>
    );
  }

  const currentScore = scoreAnimation || patientData?.creditScore || 750;
  const scoreBadge = getScoreBadge(currentScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Wallet className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Digital Health Wallet</h1>
                <p className="text-sm text-slate-400">Welcome back, {patientData?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600">
                <Shield className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-slate-300">PHID: {patientData?.phid}</span>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Credit Score Card - NO MORE STATIC 0! */}
        <Card className="mb-8 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white border-0 shadow-2xl shadow-cyan-500/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Medical Credit Score</h2>
                <p className="text-blue-100 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Live • Updates in real-time
                </p>
              </div>
              <div className="text-right">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(currentScore)}`}>
                  {currentScore}
                </div>
                <Badge className={`${scoreBadge.color} border`}>
                  {scoreBadge.label}
                </Badge>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-blue-100 mb-2">
                <span>Score Range: 0 - 1000</span>
                <span>{Math.round((currentScore / 1000) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(currentScore / 1000) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{patientData?.trustScore}%</div>
                <div className="text-sm text-blue-100">Trust Score</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{patientData?.adherenceScore}%</div>
                <div className="text-sm text-blue-100">Adherence</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{patientData?.totalPoints?.toLocaleString()}</div>
                <div className="text-sm text-blue-100">Total Points</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{analytics?.todayActivities || 0}</div>
                <div className="text-sm text-blue-100">Today's Activities</div>
              </div>
            </div>

            {/* Activity Simulation Buttons - TEST THE WORKING MECHANISM */}
            <div className="bg-slate-900/50 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm text-slate-300 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                Simulate Patient Activities (Test the working mechanism)
              </p>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => simulateActivity('MEDICINE', 10, 'Take Medicine')}
                  className="flex flex-col items-center gap-2 p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all"
                >
                  <Plus className="h-5 w-5 text-green-400" />
                  <span className="text-xs text-green-300">Medicine +10</span>
                </button>
                <button
                  onClick={() => simulateActivity('EXERCISE', 15, 'Exercise')}
                  className="flex flex-col items-center gap-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all"
                >
                  <Plus className="h-5 w-5 text-blue-400" />
                  <span className="text-xs text-blue-300">Exercise +15</span>
                </button>
                <button
                  onClick={() => simulateActivity('APPOINTMENT', 20, 'Doctor Visit')}
                  className="flex flex-col items-center gap-2 p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-all"
                >
                  <Plus className="h-5 w-5 text-purple-400" />
                  <span className="text-xs text-purple-300">Visit +20</span>
                </button>
                <button
                  onClick={() => simulateActivity('MISSED', -10, 'Missed Activity')}
                  className="flex flex-col items-center gap-2 p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all"
                >
                  <Minus className="h-5 w-5 text-red-400" />
                  <span className="text-xs text-red-300">Missed -10</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Health Metrics */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Heart className="h-5 w-5 text-red-400" />
                Health Metrics Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className={`text-3xl font-bold mb-1 ${getScoreColor(patientData?.adherenceScore || 0)}`}>
                    {patientData?.adherenceScore}%
                  </div>
                  <p className="text-sm text-slate-400">Adherence</p>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className={`text-3xl font-bold mb-1 ${getScoreColor(analytics?.adherenceRate || 0)}`}>
                    {analytics?.adherenceRate}%
                  </div>
                  <p className="text-sm text-slate-400">Task Completion</p>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-3xl font-bold mb-1 text-cyan-400">
                    {analytics?.todayActivities || 0}
                  </div>
                  <p className="text-sm text-slate-400">Today's Activities</p>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-3xl font-bold mb-1 text-purple-400">
                    {analytics?.completedTasks || 0}
                  </div>
                  <p className="text-sm text-slate-400">Tasks Done</p>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-3xl font-bold mb-1 text-yellow-400">
                    {analytics?.pendingTasks || 0}
                  </div>
                  <p className="text-sm text-slate-400">Pending</p>
                </div>
                <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-3xl font-bold mb-1 text-green-400">
                    {analytics?.totalPoints?.toLocaleString() || 0}
                  </div>
                  <p className="text-sm text-slate-400">Total Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-yellow-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-14 bg-slate-700/50 border-slate-600 hover:bg-slate-600 text-white"
                  onClick={() => window.location.href = '/activity-tracking'}
                >
                  <Activity className="h-5 w-5 text-cyan-400" />
                  <div className="text-left">
                    <div className="font-medium">Track Activity</div>
                    <div className="text-xs text-slate-400">Log health activities</div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-slate-500" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-14 bg-slate-700/50 border-slate-600 hover:bg-slate-600 text-white"
                  onClick={() => window.location.href = '/billing-management'}
                >
                  <CreditCard className="h-5 w-5 text-green-400" />
                  <div className="text-left">
                    <div className="font-medium">Pay Bills</div>
                    <div className="text-xs text-slate-400">Manage payments</div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-slate-500" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-14 bg-slate-700/50 border-slate-600 hover:bg-slate-600 text-white"
                  onClick={() => window.location.href = '/credit-analysis'}
                >
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  <div className="text-left">
                    <div className="font-medium">Credit Analysis</div>
                    <div className="text-xs text-slate-400">View score details</div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-slate-500" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-14 bg-slate-700/50 border-slate-600 hover:bg-slate-600 text-white"
                  onClick={() => window.location.href = '/profile-management'}
                >
                  <User className="h-5 w-5 text-blue-400" />
                  <div className="text-left">
                    <div className="font-medium">Profile</div>
                    <div className="text-xs text-slate-400">Manage your info</div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-slate-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5 text-cyan-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div key={activity.id || index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.points > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {activity.points > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium">{activity.title}</div>
                          <div className="text-slate-400 text-xs">{activity.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${activity.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {activity.points > 0 ? '+' : ''}{activity.points}
                        </div>
                        <div className="text-slate-500 text-xs">
                          {new Date(activity.completedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No activities yet. Click the buttons above to simulate activities!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Billing Overview */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-5 w-5 text-green-400" />
                Billing Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-white">₹{analytics?.totalSpent?.toLocaleString() || 0}</div>
                    <div className="text-xs text-slate-400">Total Spent</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">₹{analytics?.totalSavings?.toLocaleString() || 0}</div>
                    <div className="text-xs text-slate-400">Savings</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">{analytics?.pendingBills || 0}</div>
                    <div className="text-xs text-slate-400">Pending</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {bills.slice(0, 3).map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <div>
                          <div className="text-white text-sm">{bill.title}</div>
                          <div className="text-slate-400 text-xs">{bill.billNumber}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">₹{bill.amount?.toLocaleString()}</div>
                        <Badge className={
                          bill.status === 'paid' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }>
                          {bill.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Status */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>System Active</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-cyan-400" />
            <span>Real-time Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span>Data Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardIntegrated;
