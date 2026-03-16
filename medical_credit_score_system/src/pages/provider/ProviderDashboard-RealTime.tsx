import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Activity,
  Star,
  Heart,
  Award,
  Bell,
  Eye,
  MessageSquare
} from 'lucide-react';
import ProviderApiService from '../../services/provider-api.service';

const ProviderDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0,
    averageCreditScore: 0,
    totalBonusPoints: 0,
    monthlyRevenue: 0,
    activeEMIPlans: 0
  });

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [patientUpdates, setPatientUpdates] = useState([]);

  // Load real provider data
  useEffect(() => {
    const loadProviderData = async () => {
      try {
        setLoading(true);
        
        const [
          statsData,
          patientsData,
          appointmentsData,
          evaluationsData,
          notificationsData
        ] = await Promise.all([
          ProviderApiService.getProviderStats(),
          ProviderApiService.getPatients({ limit: 10 }),
          ProviderApiService.getTodayAppointments(),
          ProviderApiService.getEvaluations({ status: 'PENDING' }),
          ProviderApiService.getNotifications() // Provider notifications
        ]);

        setRealTimeData({
          totalPatients: statsData.totalPatients,
          todayAppointments: statsData.todayAppointments,
          pendingEvaluations: statsData.pendingEvaluations,
          completedEvaluations: statsData.completedEvaluations,
          averageCreditScore: statsData.averageCreditScore,
          totalBonusPoints: statsData.totalBonusPoints,
          monthlyRevenue: statsData.monthlyRevenue,
          activeEMIPlans: statsData.activeEMIPlans
        });

        setPatients(patientsData.patients);
        setAppointments(appointmentsData);
        setEvaluations(evaluationsData.evaluations);
        setNotifications(notificationsData.notifications || []);

      } catch (error) {
        console.error('Error loading provider data:', error);
        showNotification('Error loading provider dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProviderData();

    // Set up real-time WebSocket listeners
    ProviderApiService.onScoreUpdate((data) => {
      // Update patient score in real-time
      setPatients(prev => prev.map(patient => 
        patient.id === data.patientId 
          ? {...patient, creditScore: data.newScore}
          : patient
      ));
      
      // Update average score
      setRealTimeData(prev => {
        const updatedPatients = patients.map(p => 
          p.id === data.patientId ? {...p, creditScore: data.newScore} : p
        );
        const avgScore = updatedPatients.reduce((sum, p) => sum + (p.creditScore || 0), 0) / updatedPatients.length;
        return {
          ...prev,
          averageCreditScore: Math.round(avgScore)
        };
      });
      
      showNotification(`Patient ${data.patientId} score updated to ${data.newScore}`, 'info');
    });

    ProviderApiService.onActivityUpdate((data) => {
      // Show patient activities in real-time
      setRecentActivities(prev => [data.activity, ...prev.slice(0, 9)]);
      
      // Update patient adherence
      setPatients(prev => prev.map(patient => 
        patient.id === data.patientId 
          ? {...patient, adherenceScore: Math.min(100, (patient.adherenceScore || 0) + 2)}
          : patient
      ));
      
      showNotification(`${data.patientName} completed ${data.activity.activityTitle}`, 'success');
    });

    ProviderApiService.onAppointmentUpdate((data) => {
      setAppointments(prev => {
        const updated = prev.map(apt => 
          apt.id === data.appointment.id ? data.appointment : apt
        );
        if (!prev.find(apt => apt.id === data.appointment.id)) {
          return [data.appointment, ...updated];
        }
        return updated;
      });
      
      setRealTimeData(prev => ({
        ...prev,
        todayAppointments: prev.todayAppointments + 1
      }));
      
      showNotification('New appointment booked', 'info');
    });

    ProviderApiService.onEvaluationUpdate((data) => {
      setEvaluations(prev => {
        const updated = prev.map(eval => 
          eval.id === data.evaluation.id ? data.evaluation : eval
        );
        if (!prev.find(eval => eval.id === data.evaluation.id)) {
          return [data.evaluation, ...updated];
        }
        return updated;
      });
      
      setRealTimeData(prev => ({
        ...prev,
        pendingEvaluations: prev.pendingEvaluations + 1
      }));
      
      showNotification('New evaluation submitted', 'info');
    });

  }, []);

  // Submit evaluation with real impact
  const submitEvaluation = async (patientId: string, evaluationData: any) => {
    try {
      const evaluation = await ProviderApiService.submitEvaluation({
        patientId,
        evaluationType: evaluationData.evaluationType,
        bonusPoints: evaluationData.bonusPoints,
        reason: evaluationData.reason,
        comments: evaluationData.comments
      });

      showNotification(`Evaluation submitted! Patient will receive ${evaluationData.bonusPoints} bonus points`, 'success');
      
      // Update evaluations list
      setEvaluations(prev => [evaluation, ...prev]);
      setRealTimeData(prev => ({
        ...prev,
        totalBonusPoints: prev.totalBonusPoints + evaluationData.bonusPoints
      }));

      // Simulate score update after evaluation
      setTimeout(async () => {
        try {
          const patientScore = await ProviderApiService.getPatientCreditScore(patientId);
          showNotification(`Patient credit score updated to ${patientScore.score}`, 'success');
        } catch (error) {
          console.error('Error getting updated score:', error);
        }
      }, 2000);

    } catch (error) {
      console.error('Error submitting evaluation:', error);
      showNotification('Failed to submit evaluation', 'error');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading provider dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time patient monitoring and management</p>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{realTimeData.totalPatients}</div>
                  <div className="text-sm text-gray-600">Total Patients</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{realTimeData.todayAppointments}</div>
                  <div className="text-sm text-gray-600">Today's Appointments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{realTimeData.pendingEvaluations}</div>
                  <div className="text-sm text-gray-600">Pending Evaluations</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{realTimeData.totalBonusPoints}</div>
                  <div className="text-sm text-gray-600">Total Bonus Points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Patients with Real Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Recent Patients
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Live Updates
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patients.slice(0, 5).map((patient: any) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-lg font-semibold">{patient.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Score: {patient.creditScore || 0}</span>
                        <span>•</span>
                        <span>Adherence: {patient.adherenceScore || 0}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getCreditScoreColor(patient.creditScore || 0)}>
                        {patient.creditScore || 0}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Patient Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Live Patient Activities
                <Badge className="bg-red-100 text-red-800 text-xs animate-pulse">
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.slice(0, 5).map((activity: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-green-50">
                    <div>
                      <p className="font-semibold text-sm">{activity.activityTitle}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{activity.patientName || 'Patient'}</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium">+{activity.pointsEarned} pts</span>
                        <span>•</span>
                        <span>Just now</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {activity.activityType}
                    </Badge>
                  </div>
                ))}
                
                {recentActivities.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No patient activities yet today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.slice(0, 6).map((appointment: any) => (
                <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{appointment.patientName}</h4>
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
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{appointment.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Score:</span>
                      <span className="font-medium">{appointment.creditScore}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Evaluation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-600" />
              Quick Patient Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patients.slice(0, 4).map((patient: any) => (
                <div key={patient.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{patient.name}</h4>
                    <Badge className={getCreditScoreColor(patient.creditScore || 0)}>
                      Score: {patient.creditScore || 0}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <select className="w-full p-2 border border-gray-300 rounded">
                      <option value="">Select evaluation type...</option>
                      <option value="Loyalty Bonus">Loyalty Bonus (Max 50)</option>
                      <option value="Trust Recognition">Trust Recognition (Max 75)</option>
                      <option value="Treatment Adherence">Treatment Adherence (Max 40)</option>
                      <option value="Emergency Response">Emergency Response (Max 60)</option>
                    </select>
                    
                    <input
                      type="number"
                      placeholder="Bonus points"
                      className="w-full p-2 border border-gray-300 rounded"
                      min="1"
                      max="100"
                    />
                    
                    <textarea
                      placeholder="Reason for bonus points..."
                      className="w-full p-2 border border-gray-300 rounded"
                      rows={2}
                    />
                    
                    <Button
                      onClick={() => submitEvaluation(patient.id, {
                        evaluationType: 'Loyalty Bonus',
                        bonusPoints: 25,
                        reason: 'Excellent treatment adherence'
                      })}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Submit Evaluation
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Recent Notifications
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    {notifications.filter(n => !n.isRead).length} new
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification: any) => (
                  <div key={notification.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-orange-600" />
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

export default ProviderDashboard;
