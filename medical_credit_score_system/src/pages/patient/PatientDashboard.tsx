import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
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
  Hospital,
  Pill
} from 'lucide-react';

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState({
    name: 'Rahul Sharma',
    creditScore: 780,
    scoreCategory: 'Excellent',
    profileComplete: 85,
    totalActivities: 47,
    thisMonthActivities: 12
  });

  const [creditScoreHistory, setCreditScoreHistory] = useState([
    { month: 'Jan', score: 720 },
    { month: 'Feb', score: 735 },
    { month: 'Mar', score: 750 },
    { month: 'Apr', score: 765 },
    { month: 'May', score: 780 }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { 
      id: 1, 
      type: 'checkup', 
      description: 'Regular health checkup completed', 
      date: '2024-03-15', 
      points: 10,
      status: 'completed'
    },
    { 
      id: 2, 
      type: 'medicine', 
      description: 'Medicine adherence confirmed', 
      date: '2024-03-14', 
      points: 5,
      status: 'completed'
    },
    { 
      id: 3, 
      type: 'education', 
      description: 'Health education video watched', 
      date: '2024-03-13', 
      points: 3,
      status: 'completed'
    },
    { 
      id: 4, 
      type: 'appointment', 
      description: 'Doctor appointment scheduled', 
      date: '2024-03-12', 
      points: 8,
      status: 'completed'
    }
  ]);

  const [healthTasks, setHealthTasks] = useState([
    { 
      id: 1, 
      title: 'Daily Walking Challenge', 
      description: 'Walk 10,000 steps today', 
      points: 5,
      progress: 7500,
      target: 10000,
      status: 'in-progress'
    },
    { 
      id: 2, 
      title: 'Blood Pressure Check', 
      description: 'Record your blood pressure', 
      points: 3,
      progress: 0,
      target: 1,
      status: 'pending'
    },
    { 
      id: 3, 
      title: 'Medicine Reminder', 
      description: 'Take morning medicine', 
      points: 2,
      progress: 1,
      target: 1,
      status: 'completed'
    },
    { 
      id: 4, 
      title: 'Health Quiz', 
      description: 'Complete daily health quiz', 
      points: 4,
      progress: 0,
      target: 1,
      status: 'pending'
    }
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { 
      id: 1, 
      doctor: 'Dr. Priya Patel', 
      specialty: 'Cardiology', 
      date: '2024-03-20', 
      time: '10:00 AM',
      type: 'regular'
    },
    { 
      id: 2, 
      doctor: 'Dr. Amit Kumar', 
      specialty: 'General Medicine', 
      date: '2024-03-25', 
      time: '2:30 PM',
      type: 'follow-up'
    }
  ]);

  const [eligibleBenefits, setEligibleBenefits] = useState([
    { 
      title: '0% Interest EMI', 
      description: 'Get treatment financing at 0% interest', 
      available: true,
      icon: CreditCard
    },
    { 
      title: 'Priority Appointments', 
      description: 'Skip queues and get priority booking', 
      available: true,
      icon: Clock
    },
    { 
      title: 'Free Health Checkup', 
      description: 'Annual comprehensive health checkup', 
      available: true,
      icon: Heart
    },
    { 
      title: 'Surgery Sponsorship', 
      description: '100% sponsored surgery for excellent scores', 
      available: false,
      icon: Award
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update credit score randomly
      setPatientData(prev => ({
        ...prev,
        creditScore: Math.min(850, prev.creditScore + Math.floor(Math.random() * 3)),
        thisMonthActivities: prev.thisMonthActivities + Math.floor(Math.random() * 2)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 650) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 500) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'checkup': return Heart;
      case 'medicine': return Pill;
      case 'education': return FileText;
      case 'appointment': return Calendar;
      default: return Activity;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {patientData.name}!</p>
        </div>

        {/* Credit Score Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Medical Credit Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {patientData.creditScore}
                </div>
                <Badge className={`mb-4 ${getScoreColor(patientData.creditScore)}`}>
                  {patientData.scoreCategory}
                </Badge>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile Complete</span>
                    <span className="font-medium">{patientData.profileComplete}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${patientData.profileComplete}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Credit Score History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32">
                {creditScoreHistory.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-8 bg-blue-500 rounded-t"
                      style={{ height: `${(item.score - 700) * 2}px` }}
                    ></div>
                    <div className="text-xs mt-2">{item.month}</div>
                    <div className="text-xs font-medium">{item.score}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{patientData.totalActivities}</div>
                  <div className="text-sm text-gray-600">Total Activities</div>
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
                  <div className="text-2xl font-bold">{patientData.thisMonthActivities}</div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Gold</div>
                  <div className="text-sm text-gray-600">Member Level</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">4</div>
                  <div className="text-sm text-gray-600">Benefits Available</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border-b border-gray-100">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Icon className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{activity.date}</span>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            +{activity.points} pts
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Health Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Health Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {healthTasks.map((task) => (
                  <div key={task.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <p className="text-xs text-gray-600">{task.description}</p>
                      </div>
                      <Badge className={getTaskStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(task.progress / task.target) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">+{task.points} pts</span>
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
                <Calendar className="h-5 w-5 text-purple-600" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Hospital className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{appointment.doctor}</h4>
                        <p className="text-xs text-gray-600">{appointment.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{appointment.date}</span>
                          <span className="text-xs text-gray-500">{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Eligible Benefits */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Eligible Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {eligibleBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg ${
                      benefit.available 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-6 w-6 ${
                        benefit.available ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <h4 className="font-medium">{benefit.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                    {benefit.available ? (
                      <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                        Claim Benefit
                      </Button>
                    ) : (
                      <div className="mt-2 text-xs text-gray-500">
                        Unlock at 800+ credit score
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
