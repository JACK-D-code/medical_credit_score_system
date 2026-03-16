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
  Target,
  Bell,
  Plus,
  Play,
  Pause
} from 'lucide-react';
import PatientApiService from '../../services/patient-api.service';

const PatientDashboard = () => {
  // Real-time state management
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState({
    name: 'Rahul Sharma',
    age: 34,
    creditScore: 0,
    loyaltyLevel: 'Bronze',
    trustScore: 0,
    adherenceScore: 0,
    totalPoints: 0,
    activeEMI: 0,
    pendingBills: 0,
    todayAppointments: 0,
    completedEvaluations: 0
  });

  const [activities, setActivities] = useState([]);
  const [healthTasks, setHealthTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [emiPlans, setEmiPlans] = useState([]);
  const [bills, setBills] = useState([]);

  // Activity tracking state
  const [todayPoints, setTodayPoints] = useState(0);
  const [activityStreak, setActivityStreak] = useState(0);
  const [lastActivityTime, setLastActivityTime] = useState(null);

  // Real-time updates
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch real data from API
        const [
          profileData,
          creditScoreData,
          activitiesData,
          appointmentsData,
          billsData,
          emiData,
          notificationsData,
          healthTasksData
        ] = await Promise.all([
          PatientApiService.getProfile(),
          PatientApiService.getCurrentCreditScore(),
          PatientApiService.getActivities({ limit: 10 }),
          PatientApiService.getAppointments({ status: 'SCHEDULED' }),
          PatientApiService.getBills({ status: 'PENDING' }),
          PatientApiService.getEMIPlans({ status: 'ACTIVE' }),
          PatientApiService.getNotifications({ isRead: false }),
          PatientApiService.getHealthTasks({ status: 'PENDING' })
        ]);

        // Update state with real data
        setRealTimeData(prev => ({
          ...prev,
          name: `${profileData.firstName} ${profileData.lastName}`,
          age: PatientApiService.calculateAge(profileData.dateOfBirth),
          creditScore: creditScoreData.score || 0,
          loyaltyLevel: PatientApiService.getLoyaltyLevel(creditScoreData.score || 0),
          trustScore: profileData.trustScore || 0,
          adherenceScore: profileData.adherenceScore || 0,
          totalPoints: profileData.totalPoints || 0,
          activeEMI: emiData.emiPlans.length,
          pendingBills: billsData.bills.length,
          todayAppointments: appointmentsData.appointments.filter(apt => 
            new Date(apt.scheduledFor).toDateString() === new Date().toDateString()
          ).length,
          completedEvaluations: 0 // Would come from evaluations API
        }));

        setActivities(activitiesData.activities);
        setAppointments(appointmentsData.appointments);
        setBills(billsData.bills);
        setEmiPlans(emiData.emiPlans);
        setNotifications(notificationsData.notifications);
        setHealthTasks(healthTasksData.tasks);

        // Calculate today's points
        const todayActivities = activitiesData.activities.filter(activity => 
          new Date(activity.completedAt).toDateString() === new Date().toDateString()
        );
        const todayTotal = todayActivities.reduce((sum, activity) => sum + activity.pointsEarned, 0);
        setTodayPoints(todayTotal);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // Set up real-time WebSocket listeners
    PatientApiService.onScoreUpdate((data) => {
      setRealTimeData(prev => ({
        ...prev,
        creditScore: data.newScore,
        loyaltyLevel: PatientApiService.getLoyaltyLevel(data.newScore)
      }));
      showNotification(`Credit score updated to ${data.newScore}!`, 'success');
    });

    PatientApiService.onActivityUpdate((data) => {
      setActivities(prev => [data.activity, ...prev]);
      setTodayPoints(prev => prev + data.activity.pointsEarned);
      setRealTimeData(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + data.activity.pointsEarned
      }));
      showNotification(`+${data.activity.pointsEarned} points earned!`, 'success');
    });

    PatientApiService.onAppointmentUpdate((data) => {
      setAppointments(prev => {
        const updated = prev.map(apt => 
          apt.id === data.appointment.id ? data.appointment : apt
        );
        if (!prev.find(apt => apt.id === data.appointment.id)) {
          return [data.appointment, ...updated];
        }
        return updated;
      });
      showNotification('Appointment updated', 'info');
    });

    PatientApiService.onPaymentUpdate((data) => {
      setBills(prev => prev.map(bill => 
        bill.id === data.billId ? {...bill, status: 'PAID'} : bill
      ));
      showNotification('Payment processed successfully', 'success');
    });

    PatientApiService.onNotification((data) => {
      setNotifications(prev => [data, ...prev]);
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification(data.title, {
          body: data.message,
          icon: '/favicon.ico'
        });
      }
    });

  }, []);

  // Interactive activity tracking
  const trackActivity = async (activityType: string, title: string, points: number) => {
    try {
      const activity = await PatientApiService.trackActivity({
        activityType,
        activityTitle: title,
        description: `Completed ${title} activity`,
        metadata: {
          trackedAt: new Date().toISOString(),
          device: 'web'
        }
      });

      // Update UI immediately
      setActivities(prev => [activity, ...prev]);
      setTodayPoints(prev => prev + points);
      setRealTimeData(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + points
      }));
      setLastActivityTime(new Date());

      // Update streak
      setActivityStreak(prev => prev + 1);

      // Show immediate feedback
      showNotification(`+${points} points earned for ${title}!`, 'success');

      // Trigger score update
      setTimeout(async () => {
        try {
          await PatientApiService.requestScoreCalculation();
        } catch (error) {
          console.error('Error updating score:', error);
        }
      }, 1000);

    } catch (error) {
      console.error('Error tracking activity:', error);
      showNotification('Failed to track activity', 'error');
    }
  };

  // Complete health task
  const completeHealthTask = async (taskId: string) => {
    try {
      const updatedTask = await PatientApiService.completeTask(taskId);
      
      setHealthTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      
      showNotification(`Task completed! +${updatedTask.points} points`, 'success');
      
      // Update points
      setTodayPoints(prev => prev + updatedTask.points);
      setRealTimeData(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + updatedTask.points,
        adherenceScore: Math.min(100, prev.adherenceScore + 2)
      }));

    } catch (error) {
      console.error('Error completing task:', error);
      showNotification('Failed to complete task', 'error');
    }
  };

  // Book appointment
  const bookAppointment = async (appointmentData: any) => {
    try {
      const appointment = await PatientApiService.createAppointment(appointmentData);
      
      setAppointments(prev => [appointment, ...prev]);
      setRealTimeData(prev => ({
        ...prev,
        todayAppointments: prev.todayAppointments + 1
      }));
      
      showNotification('Appointment booked successfully!', 'success');
    } catch (error) {
      console.error('Error booking appointment:', error);
      showNotification('Failed to book appointment', 'error');
    }
  };

  // Pay bill
  const payBill = async (billId: string, amount: number) => {
    try {
      await PatientApiService.payBill(billId, {
        amount,
        paymentMethod: 'CREDIT_CARD',
        transactionId: `TXN_${Date.now()}`
      });
      
      setBills(prev => prev.map(bill => 
        bill.id === billId ? {...bill, status: 'PAID'} : bill
      ));
      
      setRealTimeData(prev => ({
        ...prev,
        pendingBills: Math.max(0, prev.pendingBills - 1)
      }));
      
      showNotification('Payment processed successfully!', 'success');
    } catch (error) {
      console.error('Error processing payment:', error);
      showNotification('Payment failed', 'error');
    }
  };

  // Notification helper
  const showNotification = (message: string, type: string = 'info') => {
    const notification = {
      id: Date.now().toString(),
      title: type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : 'Info',
      message,
      type: type.toUpperCase(),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => [notification, ...prev]);
  };

  // Get credit score color
  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return 'bg-green-100 text-green-800';
    if (score >= 650) return 'bg-blue-100 text-blue-800';
    if (score >= 500) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Get loyalty color
  const getLoyaltyColor = (level: string) => {
    switch (level) {
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with real-time updates */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {realTimeData.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Your health and financial wellness dashboard
            {lastActivityTime && (
              <span className="ml-2 text-sm text-green-600">
                Last activity: {lastActivityTime.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>

        {/* Real-time Credit Score Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Medical Credit Score</h2>
                <div className="text-5xl font-bold mb-4">{realTimeData.creditScore}</div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-white text-blue-600">
                    {realTimeData.loyaltyLevel} Member
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>Trust Score: {realTimeData.trustScore}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>Streak: {activityStreak} days</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg mb-2">Today's Progress</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Points Earned</span>
                    <span className="font-semibold">+{todayPoints}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Points</span>
                    <span className="font-semibold">{realTimeData.totalPoints}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Adherence</span>
                    <span className="font-semibold">{realTimeData.adherenceScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Activity Tracking */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Quick Activities - Earn Points Now!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => trackActivity('MEDICINE', 'Morning Medicine', 5)}
                className="h-20 flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 text-green-800"
              >
                <div className="text-2xl mb-1">💊</div>
                <span className="font-semibold">Took Medicine</span>
                <span className="text-xs">+5 points</span>
              </Button>
              
              <Button
                onClick={() => trackActivity('EXERCISE', 'Morning Walk', 8)}
                className="h-20 flex flex-col items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-800"
              >
                <div className="text-2xl mb-1">🏃</div>
                <span className="font-semibold">Morning Walk</span>
                <span className="text-xs">+8 points</span>
              </Button>
              
              <Button
                onClick={() => trackActivity('DIET', 'Healthy Breakfast', 5)}
                className="h-20 flex flex-col items-center justify-center bg-orange-100 hover:bg-orange-200 text-orange-800"
              >
                <div className="text-2xl mb-1">🥗</div>
                <span className="font-semibold">Healthy Meal</span>
                <span className="text-xs">+5 points</span>
              </Button>
              
              <Button
                onClick={() => trackActivity('CHECKUP', 'Blood Pressure Check', 5)}
                className="h-20 flex flex-col items-center justify-center bg-purple-100 hover:bg-purple-200 text-purple-800"
              >
                <div className="text-2xl mb-1">💉</div>
                <span className="font-semibold">BP Check</span>
                <span className="text-xs">+5 points</span>
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Today's Progress:</strong> {todayPoints} points earned • 
                Keep going to unlock achievements!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid with Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{realTimeData.totalPoints}</div>
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
                  <div className="text-2xl font-bold">{realTimeData.adherenceScore}%</div>
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
                  <div className="text-2xl font-bold">{realTimeData.activeEMI}</div>
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
                  <div className="text-2xl font-bold">{realTimeData.pendingBills}</div>
                  <div className="text-sm text-gray-600">Pending Bills</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                {activities.slice(0, 5).map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-sm">{activity.activityTitle}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{new Date(activity.completedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium">+{activity.pointsEarned} pts</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {activity.activityType}
                    </Badge>
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
                {healthTasks.slice(0, 5).map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-sm">{task.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{task.taskType}</span>
                        <span>•</span>
                        <span className="text-purple-600 font-medium">+{task.points} pts</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => completeHealthTask(task.id)}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Complete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification: any) => (
                  <div key={notification.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
