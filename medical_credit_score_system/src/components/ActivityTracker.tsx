import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/Button';
import { 
  TrendingUp, 
  Activity, 
  Trophy, 
  Target,
  Zap,
  Users,
  Clock,
  Star,
  Award,
  BarChart3
} from 'lucide-react';
import { ActivityTrackerService } from '../services/activity-tracker.service';

interface ComponentValue {
  componentId: string;
  moduleName: string;
  currentValue: number;
  targetValue: number;
  lastUpdated: Date;
  activities: string[];
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const ActivityTracker = () => {
  const [componentValues, setComponentValues] = useState<Record<string, ComponentValue>>({});
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    // Load initial data
    const values = ActivityTrackerService.getAllComponentValues();
    const activities = ActivityTrackerService.getRecentActivities(10);
    const score = ActivityTrackerService.getTotalValueScore();
    const leaders = ActivityTrackerService.getValueLeaderboard(5);

    setComponentValues(values);
    setRecentActivities(activities);
    setTotalScore(score);
    setLeaderboard(leaders);

    // Set up real-time updates
    const interval = setInterval(() => {
      const updatedValues = ActivityTrackerService.getAllComponentValues();
      const updatedScore = ActivityTrackerService.getTotalValueScore();
      const updatedActivities = ActivityTrackerService.getRecentActivities(10);
      const updatedLeaders = ActivityTrackerService.getValueLeaderboard(5);

      setComponentValues(updatedValues);
      setTotalScore(updatedScore);
      setRecentActivities(updatedActivities);
      setLeaderboard(updatedLeaders);
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressWidth = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const trackActivity = (module: string, action: string, metadata: any = {}) => {
    ActivityTrackerService.trackActivity(
      'user_001',
      'Current User',
      action,
      module,
      0,
      metadata
    );
  };

  const renderActivityFeed = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Real-Time Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No activities yet. Start using the system to increase component values!</p>
            </div>
          ) : (
            recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.value >= 10 ? 'bg-green-500' :
                    activity.value >= 5 ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={
                      activity.value >= 10 ? 'bg-green-100 text-green-800' :
                      activity.value >= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }>
                      {activity.module}
                    </Badge>
                    <span className="font-semibold text-sm">{activity.action}</span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.userName}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{key}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderComponentValues = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(componentValues).map(([moduleId, component]) => (
        <Card key={moduleId} className={`${getLevelColor(component.level)} transition-all duration-300 hover:shadow-lg`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {component.moduleName}
              </div>
              <Badge className="ml-auto">
                Level {component.level.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Current Value</span>
                <span className="text-2xl font-bold">{component.currentValue}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className={`h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500`}
                  style={{ width: `${getProgressWidth(component.currentValue, component.targetValue)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Target: {component.targetValue}</span>
                <span className="text-gray-500">
                  {component.targetValue - component.currentValue} to go
                </span>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">Value Increase Suggestions</h4>
                <div className="space-y-2">
                  {ActivityTrackerService.getValueIncreaseSuggestions(moduleId).slice(0, 3).map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{suggestion.description}</p>
                        <p className="text-xs text-gray-500">+{suggestion.potentialValue - component.currentValue} points</p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => trackActivity(moduleId, suggestion.action)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Target className="h-3 w-3 mr-1" />
                        Execute
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Total Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{totalScore}</div>
            <p className="text-sm text-gray-600">Total Component Value</p>
            <div className="mt-2 text-xs text-gray-500">
              {totalScore >= 500 ? '🏆 Expert Level' : 
               totalScore >= 300 ? '⭐ Advanced Level' : 
               totalScore >= 100 ? '📈 Intermediate Level' : 
               '🌱 Beginner Level'}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.value >= 10 ? 'bg-green-100' :
                  activity.value >= 5 ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.module} • +{activity.value} points</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Value Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((leader, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-400' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}>
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{leader.module}</p>
                    <p className="text-sm text-gray-600">{leader.value} points</p>
                    <Badge className={getLevelColor(leader.level)}>
                      {leader.level}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏆 Component Value Tracker
          </h1>
          <p className="text-gray-600">
            Increase component value through real-time user activity and system interactions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            {renderActivityFeed()}
          </div>

          {/* Component Values */}
          <div>
            {renderComponentValues()}
          </div>
        </div>

        {/* Statistics */}
        {renderStats()}
      </div>
    </div>
  );
};

export default ActivityTracker;
