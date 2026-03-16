import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/shadcn-button';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Award, 
  Activity, 
  Heart, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  BarChart3, 
  Target, 
  Zap,
  Shield,
  CreditCard,
  ChevronRight,
  RefreshCw,
  Bell,
  Settings,
  Search,
  Filter,
  Download
} from 'lucide-react';

// Admin Dashboard with real patient data from patient site
const AdminDashboardIntegrated = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load data from localStorage (shared with patient site)
    const loadData = () => {
      try {
        // Get patient data from localStorage
        const savedPatientData = localStorage.getItem('mcs_patientData');
        const savedActivities = localStorage.getItem('mcs_activities');
        const savedBills = localStorage.getItem('mcs_bills');

        if (savedPatientData) {
          const patientData = JSON.parse(savedPatientData);
          
          // Create patient record
          const patient = {
            id: patientData.phid || 'PHID-1K4J2A8-XYZ123',
            name: patientData.name || 'Rahul Sharma',
            age: patientData.age || 34,
            creditScore: patientData.creditScore || 750,
            trustScore: patientData.trustScore || 85,
            adherenceScore: patientData.adherenceScore || 90,
            loyaltyLevel: patientData.loyaltyLevel || 'Gold',
            totalPoints: patientData.totalPoints || 2840,
            status: 'active',
            lastVisit: new Date().toISOString(),
            totalVisits: 12,
            paymentHistory: 'Excellent',
            treatmentHistory: 'Cardiac Catheterization, Regular Checkups',
            insuranceStatus: 'Active',
            nextAppointment: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            monthlyIncome: patientData.monthlyIncome || 50000
          };

          setPatients([patient]);
          setSelectedPatient(patient);

          // Load activities
          if (savedActivities) {
            const activities = JSON.parse(savedActivities);
            setRecentActivities(activities.slice(0, 10));
          }

          // Calculate analytics
          const bills = savedBills ? JSON.parse(savedBills) : [];
          const totalBilled = bills.reduce((sum: number, bill: any) => sum + (bill.amount || 0), 0);
          const totalPaid = bills
            .filter((bill: any) => bill.status === 'paid')
            .reduce((sum: number, bill: any) => sum + (bill.amount || 0), 0);

          setAnalytics({
            totalPatients: 1,
            activePatients: 1,
            averageCreditScore: patient.creditScore,
            patientSatisfaction: 4.6,
            appointmentCompletionRate: 92,
            treatmentAdherenceRate: patient.adherenceScore,
            paymentCollectionRate: Math.round((totalPaid / (totalBilled || 1)) * 100),
            newPatientsThisMonth: 1,
            retentionRate: 95,
            totalRevenue: totalPaid,
            pendingPayments: totalBilled - totalPaid,
            totalBilled: totalBilled
          });
        } else {
          // Use default data if nothing in localStorage
          const defaultPatient = {
            id: 'PHID-1K4J2A8-XYZ123',
            name: 'Rahul Sharma',
            age: 34,
            creditScore: 750,
            trustScore: 85,
            adherenceScore: 90,
            loyaltyLevel: 'Gold',
            totalPoints: 2840,
            status: 'active',
            lastVisit: new Date().toISOString(),
            totalVisits: 12,
            paymentHistory: 'Excellent',
            treatmentHistory: 'Cardiac Catheterization, Regular Checkups',
            insuranceStatus: 'Active',
            nextAppointment: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            monthlyIncome: 50000
          };

          setPatients([defaultPatient]);
          setSelectedPatient(defaultPatient);
          
          setAnalytics({
            totalPatients: 1,
            activePatients: 1,
            averageCreditScore: 750,
            patientSatisfaction: 4.6,
            appointmentCompletionRate: 92,
            treatmentAdherenceRate: 90,
            paymentCollectionRate: 85,
            newPatientsThisMonth: 1,
            retentionRate: 95,
            totalRevenue: 15000,
            pendingPayments: 0,
            totalBilled: 15000
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading admin data:', error);
        setLoading(false);
      }
    };

    loadData();

    // Listen for storage changes (real-time sync with patient site)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mcs_patientData' || e.key === 'mcs_activities') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for messages from patient site
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'MCS_UPDATE') {
        loadData();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-400';
    if (score >= 700) return 'text-blue-400';
    if (score >= 600) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLoyaltyColor = (level: string) => {
    switch (level) {
      case 'Gold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Silver': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'Bronze': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getPaymentStatusColor = (history: string) => {
    switch (history) {
      case 'Excellent': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Fair': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const refreshData = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-slate-400">Real-time patient monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshData}
                className="border-slate-600 text-slate-400 hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{analytics?.totalPatients || 0}</div>
                  <div className="text-sm text-slate-400">Total Patients</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">₹{analytics?.totalRevenue?.toLocaleString() || 0}</div>
                  <div className="text-sm text-slate-400">Total Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {patients.filter(p => new Date(p.nextAppointment) > new Date()).length}
                  </div>
                  <div className="text-sm text-slate-400">Upcoming Appointments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{analytics?.averageCreditScore || 0}</div>
                  <div className="text-sm text-slate-400">Avg Credit Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Appointment Completion</span>
                    <span className="text-white">{analytics?.appointmentCompletionRate || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analytics?.appointmentCompletionRate || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Treatment Adherence</span>
                    <span className="text-white">{analytics?.treatmentAdherenceRate || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analytics?.treatmentAdherenceRate || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Payment Collection</span>
                    <span className="text-white">{analytics?.paymentCollectionRate || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analytics?.paymentCollectionRate || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Patient Retention</span>
                    <span className="text-white">{analytics?.retentionRate || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analytics?.retentionRate || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Revenue Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Billed</span>
                  <span className="font-medium text-white">₹{analytics?.totalBilled?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Paid</span>
                  <span className="font-medium text-green-400">₹{analytics?.totalRevenue?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pending</span>
                  <span className="font-medium text-yellow-400">₹{analytics?.pendingPayments?.toLocaleString() || 0}</span>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Collection Rate</span>
                    <span className="font-medium text-cyan-400">{analytics?.paymentCollectionRate || 0}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-cyan-400" />
                Patient Overview
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 w-64"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-slate-600 text-slate-400"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPatients.map((patient) => (
                <div 
                  key={patient.id} 
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedPatient?.id === patient.id 
                      ? 'bg-slate-700/50 border-cyan-500/30' 
                      : 'bg-slate-700/30 border-slate-700 hover:border-slate-600'
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {patient.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium text-lg">{patient.name}</div>
                        <div className="text-slate-400 text-sm font-mono">{patient.id}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-slate-500 text-xs">Age: {patient.age}</span>
                          <span className="text-slate-500 text-xs">•</span>
                          <span className="text-slate-500 text-xs">Income: ₹{patient.monthlyIncome?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(patient.creditScore)}`}>
                          {patient.creditScore}
                        </div>
                        <div className="text-slate-400 text-xs">Credit Score</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getLoyaltyColor(patient.loyaltyLevel)}>
                          {patient.loyaltyLevel}
                        </Badge>
                        <Badge className={getPaymentStatusColor(patient.paymentHistory)}>
                          {patient.paymentHistory}
                        </Badge>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Patient Details */}
        {selectedPatient && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  Recent Patient Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
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
                              <AlertCircle className="h-4 w-4 text-red-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-white font-medium">{activity.title}</div>
                            <div className="text-slate-400 text-sm">{activity.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${activity.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {activity.points > 0 ? '+' : ''}{activity.points}
                          </div>
                          <div className="text-slate-400 text-xs">
                            {new Date(activity.timestamp || activity.completedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No recent activities</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Heart className="h-5 w-5 text-red-400" />
                  Patient Health Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-400">{selectedPatient.adherenceScore}%</div>
                      <div className="text-slate-400 text-sm">Adherence</div>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-400">{selectedPatient.trustScore}%</div>
                      <div className="text-slate-400 text-sm">Trust Score</div>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-yellow-400">{selectedPatient.totalPoints?.toLocaleString()}</div>
                      <div className="text-slate-400 text-sm">Total Points</div>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-purple-400">{selectedPatient.totalVisits}</div>
                      <div className="text-slate-400 text-sm">Total Visits</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400">Next Appointment</span>
                      <Calendar className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="text-white font-medium">
                      {new Date(selectedPatient.nextAppointment).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400">Treatment History</span>
                      <FileText className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="text-white text-sm">
                      {selectedPatient.treatmentHistory}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live Data Sync Active</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-cyan-400" />
            <span>Real-time Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span>Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardIntegrated;
