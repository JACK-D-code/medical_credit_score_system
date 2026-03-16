import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Target,
  Award,
  BarChart3,
  Zap,
  Heart,
  Pill,
  Footprints,
  Apple,
  Brain
} from 'lucide-react';

const ActivityTracking = () => {
  const [patientData, setPatientData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [dailyGoals, setDailyGoals] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const loadActivityData = () => {
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
              title: 'Morning Medicine',
              description: 'Take prescribed morning medication',
              points: 5,
              completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              status: 'completed',
              icon: Pill,
              impact: 'Adherence +2%',
              category: 'Health'
            },
            {
              id: '2',
              type: 'EXERCISE',
              title: 'Morning Walk',
              description: '30 minutes brisk walking',
              points: 8,
              completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              status: 'completed',
              icon: Footprints,
              impact: 'Trust +3%',
              category: 'Fitness'
            },
            {
              id: '3',
              type: 'DIET',
              title: 'Healthy Breakfast',
              description: 'Balanced nutritious breakfast',
              points: 5,
              completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              status: 'completed',
              icon: Apple,
              impact: 'Credit +1',
              category: 'Nutrition'
            },
            {
              id: '4',
              type: 'VITALS',
              title: 'Blood Pressure Check',
              description: 'Monitor blood pressure and heart rate',
              points: 5,
              completedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
              status: 'completed',
              icon: Heart,
              impact: 'Trust +2%',
              category: 'Health'
            },
            {
              id: '5',
              type: 'EXERCISE',
              title: 'Evening Yoga',
              description: '20 minutes relaxation and stretching',
              points: 6,
              completedAt: null,
              status: 'pending',
              icon: Brain,
              impact: 'Adherence +2%',
              category: 'Fitness'
            },
            {
              id: '6',
              type: 'MEDICINE',
              title: 'Evening Medicine',
              description: 'Take prescribed evening medication',
              points: 5,
              completedAt: null,
              status: 'pending',
              icon: Pill,
              impact: 'Adherence +2%',
              category: 'Health'
            }
          ];

          // Generate daily goals
          const dynamicGoals = [
            {
              id: '1',
              title: 'Medicine Adherence',
              target: 2,
              current: 1,
              unit: 'doses',
              icon: Pill,
              color: 'blue'
            },
            {
              id: '2',
              title: 'Exercise Minutes',
              target: 30,
              current: 30,
              unit: 'minutes',
              icon: Footprints,
              color: 'green'
            },
            {
              id: '3',
              title: 'Healthy Meals',
              target: 3,
              current: 2,
              unit: 'meals',
              icon: Apple,
              color: 'orange'
            },
            {
              id: '4',
              title: 'Vitals Check',
              target: 2,
              current: 1,
              unit: 'checks',
              icon: Heart,
              color: 'red'
            },
            {
              id: '5',
              title: 'Water Intake',
              target: 8,
              current: 5,
              unit: 'glasses',
              icon: Heart,
              color: 'cyan'
            }
          ];

          // Generate weekly stats
          const dynamicWeeklyStats = {
            totalActivities: 28,
            completedActivities: 22,
            totalPoints: 156,
            adherenceRate: 85,
            trustScore: patientInfo.trustScore || 85,
            creditScore: patientInfo.creditScore || 750,
            categoryBreakdown: {
              'Health': 8,
              'Fitness': 6,
              'Nutrition': 5,
              'Mental': 3
            },
            dailyProgress: [
              { day: 'Mon', completed: 4, total: 5 },
              { day: 'Tue', completed: 5, total: 5 },
              { day: 'Wed', completed: 3, total: 5 },
              { day: 'Thu', completed: 4, total: 5 },
              { day: 'Fri', completed: 3, total: 5 },
              { day: 'Sat', completed: 2, total: 5 },
              { day: 'Sun', completed: 1, total: 5 }
            ]
          };

          setActivities(dynamicActivities);
          setDailyGoals(dynamicGoals);
          setWeeklyStats(dynamicWeeklyStats);

        } else {
          setPatientData(null);
          setActivities([]);
          setDailyGoals([]);
          setWeeklyStats(null);
        }

      } catch (error) {
        console.error('Error loading activity data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivityData();
  }, []);

  const completeActivity = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity && activity.status === 'pending') {
      // Update activity status
      setActivities(prev => prev.map(a => 
        a.id === activityId ? { 
          ...a, 
          status: 'completed', 
          completedAt: new Date().toISOString() 
        } : a
      ));

      // Update daily goals
      const goalType = activity.type === 'MEDICINE' ? 'Medicine Adherence' :
                      activity.type === 'EXERCISE' ? 'Exercise Minutes' :
                      activity.type === 'DIET' ? 'Healthy Meals' :
                      activity.type === 'VITALS' ? 'Vitals Check' : null;

      if (goalType) {
        setDailyGoals(prev => prev.map(goal => 
          goal.title === goalType ? { 
            ...goal, 
            current: Math.min(goal.current + 1, goal.target) 
          } : goal
        ));
      }

      // Update patient scores
      if (patientData) {
        const updatedPatient = {
          ...patientData,
          totalPoints: (patientData.totalPoints || 0) + activity.points,
          creditScore: Math.min(850, (patientData.creditScore || 750) + Math.floor(activity.points / 5)),
          adherenceScore: Math.min(100, (patientData.adherenceScore || 85) + 2),
          trustScore: Math.min(100, (patientData.trustScore || 85) + 1)
        };

        setPatientData(updatedPatient);
        localStorage.setItem('patientData', JSON.stringify(updatedPatient));
      }

      // Update weekly stats
      if (weeklyStats) {
        setWeeklyStats(prev => ({
          ...prev,
          completedActivities: prev.completedActivities + 1,
          totalPoints: prev.totalPoints + activity.points,
          adherenceRate: Math.min(100, ((prev.completedActivities + 1) / prev.totalActivities) * 100)
        }));
      }
    }
  };

  const getActivityIcon = (iconType: any) => {
    const IconComponent = iconType;
    return <IconComponent className="h-5 w-5" />;
  };

  const getGoalProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getGoalColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      cyan: 'bg-cyan-500'
    };
    return colors[color] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading activity tracking...</span>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Patient Data Found</h2>
          <p className="text-gray-600 mb-4">Please enter your PHID to access activity tracking.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Tracking</h1>
          <p className="text-gray-600">
            Monitor and track your daily health activities • PHID: {patientData.phid}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{weeklyStats?.completedActivities || 0}/{weeklyStats?.totalActivities || 0}</div>
                  <div className="text-sm text-gray-600">Activities Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{weeklyStats?.adherenceRate || 0}%</div>
                  <div className="text-sm text-gray-600">Adherence Rate</div>
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
                  <div className="text-2xl font-bold">{weeklyStats?.totalPoints || 0}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{patientData.creditScore || 750}</div>
                  <div className="text-sm text-gray-600">Credit Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Goals */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {dailyGoals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 bg-${goal.color}-100 rounded-full flex items-center justify-center`}>
                      {getActivityIcon(goal.icon)}
                    </div>
                    <h3 className="font-medium text-sm">{goal.title}</h3>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{goal.current}/{goal.target}</span>
                      <span>{Math.round(getGoalProgress(goal.current, goal.target))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${getGoalColor(goal.color)} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${getGoalProgress(goal.current, goal.target)}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{goal.unit}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Today's Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Activities</h2>
            <div className="space-y-4">
              {activities.map((activity) => (
                <Card key={activity.id} className={activity.status === 'completed' ? 'border-green-200' : 'border-gray-200'}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {getActivityIcon(activity.icon)}
                        </div>
                        <div>
                          <h3 className="font-medium">{activity.title}</h3>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              {activity.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{activity.impact}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.status === 'completed' ? (
                          <div>
                            <Badge className="bg-green-100 text-green-800 mb-1">
                              Completed
                            </Badge>
                            <p className="text-sm font-medium text-green-600">+{activity.points} pts</p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.completedAt!).toLocaleTimeString()}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <Button size="sm" onClick={() => completeActivity(activity.id)}>
                              Complete
                            </Button>
                            <p className="text-sm font-medium text-gray-600 mt-1">+{activity.points} pts</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Weekly Progress */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Progress</h2>
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Daily Activity Completion</h3>
                  <div className="space-y-3">
                    {weeklyStats?.dailyProgress.map((day, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-8">{day.day}</span>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${(day.completed / day.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">{day.completed}/{day.total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Category Breakdown</h3>
                  <div className="space-y-2">
                    {Object.entries(weeklyStats?.categoryBreakdown || {}).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <Badge className="bg-gray-100 text-gray-800">
                          {count} activities
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTracking;
