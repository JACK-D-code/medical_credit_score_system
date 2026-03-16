import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
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
  CheckCircle
} from 'lucide-react';

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buyingPower, setBuyingPower] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [healthScore, setHealthScore] = useState<any>(null);
  const [quickActions, setQuickActions] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = () => {
      try {
        setLoading(true);
        
        // Get patient data from PHID system
        const savedPHID = localStorage.getItem('currentPHID');
        const savedData = localStorage.getItem('patientData');
        
        if (savedPHID && savedData) {
          const patientInfo = JSON.parse(savedData);
          setPatientData(patientInfo);
          
          // Calculate buying power based on credit score
          const creditScore = patientInfo.creditScore || 750;
          const baseBuyingPower = creditScore * 1000;
          
          const dynamicBuyingPower = {
            totalLimit: baseBuyingPower,
            availableLimit: baseBuyingPower * 0.75,
            usedAmount: baseBuyingPower * 0.25,
            monthlyIncome: patientInfo.monthlyIncome || 50000,
            creditScore: creditScore,
            trustScore: patientInfo.trustScore || 85,
            status: 'active',
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          };

          // Generate recent transactions
          const dynamicTransactions = [
            {
              id: '1',
              type: 'medical',
              title: 'Medicine Purchase',
              amount: 2500,
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed',
              category: 'Healthcare',
              pointsEarned: 25
            },
            {
              id: '2',
              type: 'consultation',
              title: 'Doctor Consultation',
              amount: 1200,
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed',
              category: 'Healthcare',
              pointsEarned: 12
            },
            {
              id: '3',
              type: 'lab',
              title: 'Lab Tests',
              amount: 3500,
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'processing',
              category: 'Diagnostics',
              pointsEarned: 35
            }
          ];

          // Generate health score
          const dynamicHealthScore = {
            overall: 85,
            adherence: 90,
            activity: 80,
            nutrition: 75,
            sleep: 85,
            stress: 70,
            lastUpdated: new Date().toISOString(),
            trend: 'improving'
          };

          // Generate quick actions
          const dynamicQuickActions = [
            {
              id: '1',
              title: 'Book Appointment',
              icon: Calendar,
              color: 'blue',
              action: 'appointment'
            },
            {
              id: '2',
              title: 'Order Medicine',
              icon: Heart,
              color: 'green',
              action: 'medicine'
            },
            {
              id: '3',
              title: 'Lab Tests',
              icon: Activity,
              color: 'purple',
              action: 'lab'
            },
            {
              id: '4',
              title: 'Emergency',
              icon: Shield,
              color: 'red',
              action: 'emergency'
            }
          ];

          setBuyingPower(dynamicBuyingPower);
          setRecentTransactions(dynamicTransactions);
          setHealthScore(dynamicHealthScore);
          setQuickActions(dynamicQuickActions);

        } else {
          setPatientData(null);
          setBuyingPower(null);
          setRecentTransactions([]);
          setHealthScore(null);
          setQuickActions([]);
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getActionColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      green: 'bg-green-100 text-green-600 hover:bg-green-200',
      purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
      red: 'bg-red-100 text-red-600 hover:bg-red-200'
    };
    return colors[color] || 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading your digital health wallet...</span>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Patient Data Found</h2>
          <p className="text-gray-600 mb-4">Please enter your PHID to access your digital health wallet.</p>
          <Button onClick={() => window.location.href = '/phid-entry'}>
            Enter PHID
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Digital Health Wallet</h1>
                <p className="text-sm text-gray-600">Welcome back, {patientData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Digital Buying Power Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Digital Buying Power</h2>
                <p className="text-blue-100">Active • Valid until {new Date(buyingPower?.expiryDate || '').toLocaleDateString()}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Limit</p>
                <p className="text-3xl font-bold">₹{buyingPower?.totalLimit?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Available Limit</p>
                <p className="text-3xl font-bold">₹{buyingPower?.availableLimit?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Credit Score</p>
                <p className={`text-3xl font-bold ${getCreditScoreColor(buyingPower?.creditScore || 750)}`}>
                  {buyingPower?.creditScore || 750}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Used Amount</span>
                <span>₹{buyingPower?.usedAmount?.toLocaleString() || 0}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((buyingPower?.usedAmount || 0) / (buyingPower?.totalLimit || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Score & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Health Score Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getHealthScoreColor(healthScore?.overall || 0)}`}>
                    {healthScore?.overall || 0}
                  </div>
                  <p className="text-sm text-gray-600">Overall</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getHealthScoreColor(healthScore?.adherence || 0)}`}>
                    {healthScore?.adherence || 0}%
                  </div>
                  <p className="text-sm text-gray-600">Adherence</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getHealthScoreColor(healthScore?.activity || 0)}`}>
                    {healthScore?.activity || 0}%
                  </div>
                  <p className="text-sm text-gray-600">Activity</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getHealthScoreColor(healthScore?.nutrition || 0)}`}>
                    {healthScore?.nutrition || 0}%
                  </div>
                  <p className="text-sm text-gray-600">Nutrition</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getHealthScoreColor(healthScore?.sleep || 0)}`}>
                    {healthScore?.sleep || 0}%
                  </div>
                  <p className="text-sm text-gray-600">Sleep</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getHealthScoreColor(healthScore?.stress || 0)}`}>
                    {healthScore?.stress || 0}%
                  </div>
                  <p className="text-sm text-gray-600">Stress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className={`h-20 flex flex-col items-center justify-center gap-2 ${getActionColor(action.color)}`}
                  >
                    <action.icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{action.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.status === 'completed' ? 'bg-green-100' :
                      transaction.status === 'processing' ? 'bg-yellow-100' :
                      'bg-red-100'
                    }`}>
                      {transaction.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : transaction.status === 'processing' ? (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{transaction.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{transaction.amount.toLocaleString()}</div>
                    <div className="text-sm text-green-600">+{transaction.pointsEarned} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
