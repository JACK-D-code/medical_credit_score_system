import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import { 
  User, 
  CreditCard, 
  Calendar,
  Heart,
  TrendingUp,
  Award,
  Target,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  BarChart3,
  FileText,
  Plus
} from 'lucide-react';

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [healthTasks, setHealthTasks] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [creditScoreHistory, setCreditScoreHistory] = useState<any[]>([]);

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
          
          // Generate dynamic activities based on patient data
          const dynamicActivities = [
            {
              id: '1',
              type: 'MEDICINE',
              activityTitle: 'Morning Medicine',
              pointsEarned: 5,
              completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              status: 'completed',
              impact: '+5 points, +2 adherence score'
            },
            {
              id: '2',
              type: 'EXERCISE',
              activityTitle: 'Morning Walk',
              pointsEarned: 8,
              completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              status: 'completed',
              impact: '+8 points, +3 trust score'
            },
            {
              id: '3',
              type: 'DIET',
              activityTitle: 'Healthy Breakfast',
              pointsEarned: 5,
              completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              status: 'completed',
              impact: '+5 points, +1 adherence score'
            },
            {
              id: '4',
              type: 'CHECKUP',
              activityTitle: 'Blood Pressure Check',
              pointsEarned: 5,
              completedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
              status: 'completed',
              impact: '+5 points, +2 trust score'
            }
          ];

          // Generate dynamic appointments
          const dynamicAppointments = [
            {
              id: '1',
              title: 'Follow-up Consultation',
              provider: 'Dr. Smith',
              scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'scheduled',
              type: 'FOLLOW_UP'
            },
            {
              id: '2',
              title: 'General Health Checkup',
              provider: 'Dr. Johnson',
              scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'scheduled',
              type: 'CHECKUP'
            },
            {
              id: '3',
              title: 'Emergency Consultation',
              provider: 'Dr. Williams',
              scheduledFor: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'scheduled',
              type: 'EMERGENCY'
            }
          ];

          // Generate dynamic health tasks
          const dynamicHealthTasks = [
            {
              id: '1',
              title: 'Morning Blood Pressure Check',
              taskType: 'DAILY',
              points: 5,
              status: 'completed',
              dueDate: new Date().toISOString(),
              impact: '+5 points if completed'
            },
            {
              id: '2',
              title: 'Evening Walk - 30 mins',
              taskType: 'DAILY',
              points: 8,
              status: 'pending',
              dueDate: new Date().toISOString(),
              impact: '+8 points if completed'
            },
            {
              id: '3',
              title: 'Medicine Adherence',
              taskType: 'DAILY',
              points: 10,
              status: 'completed',
              dueDate: new Date().toISOString(),
              impact: '+10 points if completed'
            },
            {
              id: '4',
              title: 'Weekly Weight Tracking',
              taskType: 'WEEKLY',
              points: 15,
              status: 'pending',
              dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
              impact: '+15 points if completed'
            },
            {
              id: '5',
              title: 'Monthly Blood Test',
              taskType: 'MONTHLY',
              points: 25,
              status: 'pending',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              impact: '+25 points if completed'
            }
          ];

          // Generate dynamic bills
          const dynamicBills = [
            {
              id: '1',
              title: 'General Consultation',
              billAmount: 500,
              status: 'paid',
              billDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              billNumber: 'BILL-001'
            },
            {
              id: '2',
              title: 'Lab Tests',
              billAmount: 1200,
              status: 'paid',
              billDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              billNumber: 'BILL-002'
            },
            {
              id: '3',
              title: 'Emergency Consultation',
              billAmount: 1500,
              status: 'pending',
              billDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              billNumber: 'BILL-003'
            }
          ];

          // Generate credit score history based on activities
          const baseScore = patientInfo.creditScore || 750;
          const dynamicHistory = [
            { month: 'Jan', score: baseScore - 30 },
            { month: 'Feb', score: baseScore - 15 },
            { month: 'Mar', score: baseScore },
            { month: 'Apr', score: baseScore + 10 },
            { month: 'May', score: baseScore + 20 }
          ];

          setActivities(dynamicActivities);
          setAppointments(dynamicAppointments);
          setHealthTasks(dynamicHealthTasks);
          setBills(dynamicBills);
          setCreditScoreHistory(dynamicHistory);

        } else {
          // No PHID data - show empty state
          setPatientData(null);
          setActivities([]);
          setAppointments([]);
          setHealthTasks([]);
          setBills([]);
          setCreditScoreHistory([]);
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const completeTask = (taskId: string) => {
    const task = healthTasks.find(t => t.id === taskId);
    if (task && task.status === 'pending') {
      // Update task status
      setHealthTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'completed' } : t
      ));

      // Update patient scores
      if (patientData) {
        const updatedPatient = {
          ...patientData,
          totalPoints: (patientData.totalPoints || 0) + task.points,
          creditScore: Math.min(850, (patientData.creditScore || 750) + Math.floor(task.points / 5)),
          adherenceScore: Math.min(100, (patientData.adherenceScore || 85) + 2),
          trustScore: Math.min(100, (patientData.trustScore || 85) + 1)
        };

        setPatientData(updatedPatient);
        localStorage.setItem('patientData', JSON.stringify(updatedPatient));

        // Add new activity
        const newActivity = {
          id: Date.now().toString(),
          type: 'TASK_COMPLETION',
          activityTitle: task.title,
          pointsEarned: task.points,
          completedAt: new Date().toISOString(),
          status: 'completed',
          impact: `+${task.points} points, scores updated`
        };

        setActivities(prev => [newActivity, ...prev]);
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreCategory = (score: number) => {
    if (score >= 800) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 600) return 'Fair';
    return 'Poor';
  };

  const calculateTotalPoints = () => {
    return activities.reduce((sum, activity) => sum + (activity.pointsEarned || 0), 0);
  };

  const calculatePendingTasks = () => {
    return healthTasks.filter(task => task.status === 'pending').length;
  };

  const calculateUpcomingAppointments = () => {
    return appointments.filter(apt => apt.status === 'scheduled').length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Patient Data Found</h2>
          <p className="text-gray-600 mb-4">Please enter your PHID to access your dashboard.</p>
          <Button onClick={() => window.location.href = '/phid-entry'}>
            Enter PHID
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {patientData.name}!
          </h1>
          <p className="text-gray-600">
            Here's your health overview • PHID: {patientData.phid}
          </p>
        </div>

        {/* Credit Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Credit Score Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className={`text-4xl font-bold ${getScoreColor(patientData.creditScore || 750)}`}>
                    {patientData.creditScore || 750}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getScoreCategory(patientData.creditScore || 750)} Credit Score
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    +{calculateTotalPoints()}
                  </div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>
              </div>
              
              {/* Credit Score History */}
              <div className="h-32 flex items-end justify-between gap-2">
                {creditScoreHistory.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${((item.score - 600) / 300) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Health Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Trust Score</span>
                  <Badge className="bg-green-100 text-green-800">
                    {patientData.trustScore || 85}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Adherence Score</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {patientData.adherenceScore || 90}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Loyalty Level</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {patientData.loyaltyLevel || 'Gold'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Points</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    {patientData.totalPoints || calculateTotalPoints()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activities.length}</div>
                  <div className="text-sm text-gray-600">Activities Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{healthTasks.filter(t => t.status === 'completed').length}</div>
                  <div className="text-sm text-gray-600">Tasks Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{calculatePendingTasks()}</div>
                  <div className="text-sm text-gray-600">Pending Tasks</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{calculateUpcomingAppointments()}</div>
                  <div className="text-sm text-gray-600">Appointments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{activity.activityTitle}</h4>
                        <p className="text-xs text-gray-600">{new Date(activity.completedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">
                        +{activity.pointsEarned} pts
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{activity.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Health Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        task.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {task.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <p className="text-xs text-gray-600">{task.impact}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {task.status === 'completed' ? (
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      ) : (
                        <Button size="sm" onClick={() => completeTask(task.id)}>
                          Complete
                        </Button>
                      )}
                      <p className="text-xs text-gray-500 mt-1">+{task.points} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{appointment.title}</h4>
                    <Badge className="bg-blue-100 text-blue-800">
                      {appointment.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Dr. {appointment.provider}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.scheduledFor).toLocaleDateString()}
                  </p>
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
