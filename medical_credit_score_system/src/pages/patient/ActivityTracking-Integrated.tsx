import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import MedicalCreditScoreSystem from '../../services/MedicalCreditScoreSystem';
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
  Brain,
  ChevronRight,
  Plus,
  Minus,
  RefreshCw,
  Trophy,
  Flame
} from 'lucide-react';

const ActivityTrackingIntegrated = () => {
  const [mcs] = useState(() => MedicalCreditScoreSystem.getInstance());
  const [patientData, setPatientData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [healthTasks, setHealthTasks] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');
  const [lastScoreChange, setLastScoreChange] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      setPatientData(mcs.getPatientData());
      setActivities(mcs.getActivities());
      setHealthTasks(mcs.getHealthTasks());
      setAnalytics(mcs.getAnalytics());
      setLoading(false);
    };

    loadData();

    // Subscribe to updates
    const unsubscribeScore = mcs.on('scoreUpdated', (data: any) => {
      setPatientData(mcs.getPatientData());
      setAnalytics(mcs.getAnalytics());
      setLastScoreChange(data);
      
      // Clear notification after 3 seconds
      setTimeout(() => setLastScoreChange(null), 3000);
    });

    const unsubscribeActivity = mcs.on('activityCompleted', (data: any) => {
      setActivities(mcs.getActivities());
      setHealthTasks(mcs.getHealthTasks());
      setAnalytics(mcs.getAnalytics());
    });

    return () => {
      unsubscribeScore();
      unsubscribeActivity();
    };
  }, [mcs]);

  // Complete a health task
  const completeTask = (taskId: string) => {
    const result = mcs.completeActivity(taskId);
    if (result.success) {
      console.log(`Task completed: ${result.activity.title} (+${result.activity.points} points)`);
    }
  };

  // Simulate activity
  const simulateActivity = (type: string, points: number, title: string) => {
    const result = mcs.simulateActivity(type, points, title);
    if (result.success) {
      console.log(`Activity completed: ${title} (+${points} points)`);
    }
  };

  // Get progress color
  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'MEDICINE': return Pill;
      case 'EXERCISE': return Footprints;
      case 'DIET': return Apple;
      case 'CHECKUP': return Heart;
      case 'MENTAL': return Brain;
      default: return Activity;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading activity tracking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Score Change Notification */}
      {lastScoreChange && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div className={`p-4 rounded-xl shadow-2xl border backdrop-blur-xl ${
            lastScoreChange.change > 0 
              ? 'bg-green-500/20 border-green-500/30 text-green-400' 
              : 'bg-red-500/20 border-red-500/30 text-red-400'
          }`}>
            <div className="flex items-center gap-3">
              {lastScoreChange.change > 0 ? (
                <TrendingUp className="h-6 w-6" />
              ) : (
                <Minus className="h-6 w-6" />
              )}
              <div>
                <div className="font-bold text-lg">
                  {lastScoreChange.change > 0 ? '+' : ''}{lastScoreChange.change} points
                </div>
                <div className="text-sm opacity-80">
                  Score: {lastScoreChange.oldScore} → {lastScoreChange.newScore}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Activity Tracking</h1>
              <p className="text-slate-400">
                Track your health activities • Current Score: <span className="text-cyan-400 font-bold">{patientData?.creditScore}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{analytics?.todayActivities || 0}</div>
                <div className="text-sm text-slate-400">Today's Activities</div>
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                <Activity className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Goals */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="h-5 w-5 text-cyan-400" />
              Daily Health Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {healthTasks.map((task) => (
                <div key={task.id} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        task.status === 'completed' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                      }`}>
                        {task.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                      <span className="text-white font-medium text-sm">{task.title}</span>
                    </div>
                    <Badge className={
                      task.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }>
                      {task.status}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{task.status === 'completed' ? '100%' : '0%'}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: task.status === 'completed' ? '100%' : '0%' }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">+{task.points} points</span>
                    {task.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => completeTask(task.id)}
                        className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-cyan-500/30"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Activity Buttons */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-yellow-400" />
              Quick Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => simulateActivity('MEDICINE', 10, 'Take Morning Medicine')}
                className="flex flex-col items-center gap-3 p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Pill className="h-6 w-6 text-green-400" />
                </div>
                <div className="text-center">
                  <div className="text-white font-medium text-sm">Take Medicine</div>
                  <div className="text-green-400 text-xs font-bold">+10 points</div>
                </div>
              </button>

              <button
                onClick={() => simulateActivity('EXERCISE', 15, 'Morning Exercise')}
                className="flex flex-col items-center gap-3 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Footprints className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-center">
                  <div className="text-white font-medium text-sm">Exercise</div>
                  <div className="text-blue-400 text-xs font-bold">+15 points</div>
                </div>
              </button>

              <button
                onClick={() => simulateActivity('DIET', 12, 'Healthy Meal')}
                className="flex flex-col items-center gap-3 p-4 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 hover:border-orange-500/40 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Apple className="h-6 w-6 text-orange-400" />
                </div>
                <div className="text-center">
                  <div className="text-white font-medium text-sm">Healthy Meal</div>
                  <div className="text-orange-400 text-xs font-bold">+12 points</div>
                </div>
              </button>

              <button
                onClick={() => simulateActivity('CHECKUP', 20, 'Health Checkup')}
                className="flex flex-col items-center gap-3 p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="h-6 w-6 text-purple-400" />
                </div>
                <div className="text-center">
                  <div className="text-white font-medium text-sm">Checkup</div>
                  <div className="text-purple-400 text-xs font-bold">+20 points</div>
                </div>
              </button>

              <button
                onClick={() => simulateActivity('MENTAL', 8, 'Meditation')}
                className="flex flex-col items-center gap-3 p-4 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 hover:border-pink-500/40 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6 text-pink-400" />
                </div>
                <div className="text-center">
                  <div className="text-white font-medium text-sm">Meditation</div>
                  <div className="text-pink-400 text-xs font-bold">+8 points</div>
                </div>
              </button>

              <button
                onClick={() => simulateActivity('WATER', 5, 'Drink Water')}
                className="flex flex-col items-center gap-3 p-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="text-center">
                  <div className="text-white font-medium text-sm">Drink Water</div>
                  <div className="text-cyan-400 text-xs font-bold">+5 points</div>
                </div>
              </button>

              <button
                onClick={() => simulateActivity('SLEEP', 10, 'Good Sleep')}
                className="flex flex-col items-center gap-3 p-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="text-center">
                  <div className="text-white font-medium text-sm">Good Sleep</div>
                  <div className="text-indigo-400 text-xs font-bold">+10 points</div>
                </div>
              </button>

              <button
                onClick={() => simulateActivity('MISSED', -10, 'Missed Activity')}
                className="flex flex-col items-center gap-3 p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all group"
              >
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Minus className="h-6 w-6 text-red-400" />
                </div>
                <div className="text-center">
                  <div className="text-white font-medium text-sm">Missed Activity</div>
                  <div className="text-red-400 text-xs font-bold">-10 points</div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Activity History & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity History */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5 text-cyan-400" />
                Recent Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.length > 0 ? (
                  activities.map((activity) => {
                    const IconComponent = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.points > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${
                              activity.points > 0 ? 'text-green-400' : 'text-red-400'
                            }`} />
                          </div>
                          <div>
                            <div className="text-white font-medium">{activity.title}</div>
                            <div className="text-slate-400 text-sm">{activity.type}</div>
                            <div className="text-slate-500 text-xs">
                              {new Date(activity.completedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${
                            activity.points > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {activity.points > 0 ? '+' : ''}{activity.points}
                          </div>
                          <div className="text-slate-400 text-xs">points</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Activity className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg mb-2">No activities yet</p>
                    <p className="text-sm">Click the activity buttons above to start tracking!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5 text-purple-400" />
                Activity Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400">Today's Activities</span>
                    <span className="text-2xl font-bold text-white">{analytics?.todayActivities || 0}</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((analytics?.todayActivities || 0) / 10 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400">Task Completion</span>
                    <span className="text-2xl font-bold text-green-400">{analytics?.adherenceRate || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analytics?.adherenceRate || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400">Total Points</span>
                    <span className="text-2xl font-bold text-yellow-400">{patientData?.totalPoints?.toLocaleString() || 0}</span>
                  </div>
                  <div className="text-slate-400 text-sm">
                    Keep earning points to improve your credit score!
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Current Streak</div>
                      <div className="text-2xl font-bold text-yellow-400">5 days</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <Flame className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Calories Burned</div>
                      <div className="text-2xl font-bold text-orange-400">1,240</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActivityTrackingIntegrated;
