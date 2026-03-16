import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  CreditCard,
  TrendingUp,
  Calendar,
  Activity,
  Heart,
  Award,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Users,
  Target,
  Bell,
  ChevronRight,
  Plus
} from 'lucide-react';

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState({
    name: 'Rahul Sharma',
    age: 34,
    creditScore: 780,
    loyaltyLevel: 'Gold',
    trustScore: 85,
    adherenceScore: 95,
    totalPoints: 2840,
    activeEMI: 2,
    pendingBills: 1
  });

  const [creditScoreHistory, setCreditScoreHistory] = useState([
    { date: '2024-03-15', score: 780, category: 'Excellent' },
    { date: '2024-03-01', score: 750, category: 'Good' },
    { date: '2024-02-15', score: 720, category: 'Good' },
    { date: '2024-02-01', score: 680, category: 'Good' }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'Checkup', title: 'Regular Health Checkup', points: 10, date: '2024-03-15', status: 'completed' },
    { id: 2, type: 'Medicine', title: 'Daily Medication Adherence', points: 5, date: '2024-03-14', status: 'completed' },
    { id: 3, type: 'Exercise', title: 'Morning Walk - 30 mins', points: 8, date: '2024-03-13', status: 'completed' },
    { id: 4, type: 'Diet', title: 'Healthy Meal Tracking', points: 5, date: '2024-03-12', status: 'completed' }
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { id: 1, provider: 'Dr. Priya Patel', type: 'Follow-up Consultation', date: '2024-03-20', time: '10:30 AM', status: 'confirmed' },
    { id: 2, provider: 'Dr. Amit Kumar', type: 'Cardiac Review', date: '2024-03-25', time: '02:00 PM', status: 'scheduled' }
  ]);

  const [healthTasks, setHealthTasks] = useState([
    { id: 1, title: 'Morning Blood Pressure Check', type: 'Daily', points: 5, completed: true, streak: 15 },
    { id: 2, title: 'Evening Walk - 30 mins', type: 'Daily', points: 8, completed: false, streak: 12 },
    { id: 3, title: 'Medicine Adherence', type: 'Daily', points: 10, completed: true, streak: 30 },
    { id: 4, title: 'Weekly Weight Tracking', type: 'Weekly', points: 15, completed: false, streak: 8 }
  ]);

  const [emiPlans, setEmiPlans] = useState([
    { id: 1, treatment: 'Cardiac Catheterization', amount: 250000, emi: 12500, remaining: 87500, nextDue: '2024-03-25' },
    { id: 2, treatment: 'MRI Scan', amount: 15000, emi: 3000, remaining: 9000, nextDue: '2024-03-20' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Credit Score Updated', message: 'Your credit score increased by 30 points!', type: 'success', time: '2 hours ago' },
    { id: 2, title: 'Appointment Reminder', message: 'Follow-up consultation tomorrow at 10:30 AM', type: 'reminder', time: '1 day ago' },
    { id: 3, title: 'EMI Payment Due', message: 'Your EMI payment of ₹3,000 is due on March 20', type: 'warning', time: '2 days ago' }
  ]);

  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return 'bg-green-100 text-green-800';
    if (score >= 650) return 'bg-blue-100 text-blue-800';
    if (score >= 500) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getLoyaltyColor = (level: string) => {
    switch (level) {
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Checkup': return <Heart className="h-4 w-4 text-red-500" />;
      case 'Medicine': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'Exercise': return <Activity className="h-4 w-4 text-green-500" />;
      case 'Diet': return <Target className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'reminder': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPatientData(prev => ({
        ...prev,
        trustScore: Math.min(100, prev.trustScore + Math.floor(Math.random() * 2))
      }));
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {patientData.name}!</h1>
          <p className="text-gray-600 mt-2">Your health and financial wellness dashboard</p>
        </div>

        {/* Credit Score Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Medical Credit Score</h2>
                <div className="text-5xl font-bold mb-4">{patientData.creditScore}</div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-white text-blue-600">
                    {patientData.loyaltyLevel} Member
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>Trust Score: {patientData.trustScore}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg mb-2">Score History</div>
                <div className="space-y-2">
                  {creditScoreHistory.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{item.date}</span>
                      <span className="font-semibold">{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{patientData.totalPoints}</div>
                  <div className="text-sm text-gray-600">Loyalty Points</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{patientData.adherenceScore}%</div>
                  <div className="text-sm text-gray-600">Adherence Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{patientData.activeEMI}</div>
                  <div className="text-sm text-gray-600">Active EMIs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{patientData.pendingBills}</div>
                  <div className="text-sm text-gray-600">Pending Bills</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{activity.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{activity.date}</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium">+{activity.points} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{appointment.provider}</h4>
                      <Badge className="bg-blue-100 text-blue-800">
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{appointment.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{appointment.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Health Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healthTasks.map((task) => (
                  <div key={task.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{task.title}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">🔥</span>
                        <span className="text-xs font-medium">{task.streak}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={task.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {task.type}
                        </Badge>
                        <span className="text-xs text-gray-600">+{task.points} pts</span>
                      </div>
                      <Button
                        size="sm"
                        className={task.completed ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
                      >
                        {task.completed ? '✓' : '+'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* EMI Plans */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Active EMI Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emiPlans.map((plan) => (
                <div key={plan.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{plan.treatment}</h4>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Amount:</span>
                      <div className="font-medium">₹{plan.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Monthly EMI:</span>
                      <div className="font-medium">₹{plan.emi.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Remaining:</span>
                      <div className="font-medium">₹{plan.remaining.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Next Due:</span>
                      <div className="font-medium">{plan.nextDue}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      Pay EMI
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
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
