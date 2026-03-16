import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import MedicalCreditScoreSystem from '../../services/MedicalCreditScoreSystem';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Target, 
  BarChart3, 
  Calendar,
  Info,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  Shield,
  Heart,
  Activity,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

const CreditScoreAnalysisIntegrated = () => {
  const [mcs] = useState(() => MedicalCreditScoreSystem.getInstance());
  const [patientData, setPatientData] = useState<any>(null);
  const [scoreHistory, setScoreHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');

  useEffect(() => {
    const loadData = () => {
      setPatientData(mcs.getPatientData());
      setScoreHistory(mcs.getScoreHistory());
      setLoading(false);
    };

    loadData();

    const unsubscribe = mcs.on('scoreUpdated', () => {
      setPatientData(mcs.getPatientData());
      setScoreHistory(mcs.getScoreHistory());
    });

    return () => unsubscribe();
  }, [mcs]);

  const getScoreCategory = (score: number) => {
    if (score >= 800) return { category: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/30' };
    if (score >= 700) return { category: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' };
    if (score >= 600) return { category: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30' };
    return { category: 'Poor', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' };
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-green-400" />;
    if (change < 0) return <ArrowDownRight className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const scoreFactors = [
    { name: 'Payment History', weight: 35, score: 95, icon: CreditCard, trend: 'up' },
    { name: 'Health Adherence', weight: 25, score: patientData?.adherenceScore || 90, icon: Heart, trend: 'up' },
    { name: 'Activity Level', weight: 20, score: 85, icon: Activity, trend: 'stable' },
    { name: 'Credit Utilization', weight: 10, score: 70, icon: BarChart3, trend: 'down' },
    { name: 'Account Age', weight: 10, score: 80, icon: Calendar, trend: 'stable' }
  ];

  const recommendations = [
    { 
      title: 'Improve Activity Consistency', 
      impact: '+15-20 points', 
      priority: 'High',
      description: 'Complete daily health tasks consistently',
      action: 'Log activities daily'
    },
    { 
      title: 'Maintain Payment Schedule', 
      impact: '+10 points', 
      priority: 'Medium',
      description: 'Pay medical bills on time',
      action: 'Set up auto-pay'
    },
    { 
      title: 'Increase Exercise Frequency', 
      impact: '+12 points', 
      priority: 'Medium',
      description: 'Exercise at least 3 times per week',
      action: 'Schedule workouts'
    },
    { 
      title: 'Regular Health Checkups', 
      impact: '+8 points', 
      priority: 'Low',
      description: 'Complete monthly health assessments',
      action: 'Book appointment'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const currentScore = patientData?.creditScore || 750;
  const scoreInfo = getScoreCategory(currentScore);
  const previousScore = scoreHistory.length > 1 ? scoreHistory[scoreHistory.length - 2].score : currentScore;
  const scoreChange = currentScore - previousScore;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Credit Score Analysis</h1>
          <p className="text-slate-400">
            Detailed analysis of your medical credit score • Current: <span className={scoreInfo.color}>{currentScore}</span>
          </p>
        </div>

        {/* Main Score Card */}
        <Card className="mb-8 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Medical Credit Score</h2>
                <div className="flex items-center gap-4">
                  <div className={`text-6xl font-bold ${scoreInfo.color}`}>{currentScore}</div>
                  <div>
                    <Badge className={`${scoreInfo.bg} text-sm mb-1`}>
                      {scoreInfo.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      {getTrendIcon(scoreChange)}
                      <span className={scoreChange > 0 ? 'text-green-400' : scoreChange < 0 ? 'text-red-400' : 'text-gray-400'}>
                        {scoreChange > 0 ? '+' : ''}{scoreChange} from last month
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100 mb-1">Potential Score</div>
                <div className="text-3xl font-bold text-green-400">{Math.min(1000, currentScore + 50)}</div>
                <div className="text-sm text-blue-100">+50 points possible</div>
              </div>
            </div>

            {/* Score Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-blue-100 mb-2">
                <span>Poor</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${(currentScore / 1000) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score History Chart */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
                Score History
              </CardTitle>
              <div className="flex gap-2">
                {['3months', '6months', '1year'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      selectedTimeframe === timeframe
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {scoreHistory.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full">
                    <div 
                      className="w-full bg-cyan-500/60 rounded-t-lg transition-all duration-500 hover:bg-cyan-400"
                      style={{ height: `${(item.score / 1000) * 200}px` }}
                    ></div>
                    {item.change !== 0 && (
                      <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold ${
                        item.change > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {item.change > 0 ? '+' : ''}{item.change}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 mt-2">{item.month}</span>
                  <span className="text-xs text-slate-500">{item.score}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score Factors & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Factors */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="h-5 w-5 text-purple-400" />
                Score Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scoreFactors.map((factor) => (
                  <div key={factor.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                          <factor.icon className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{factor.name}</div>
                          <div className="text-slate-400 text-xs">Weight: {factor.weight}%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          factor.score >= 80 ? 'text-green-400' : 
                          factor.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>{factor.score}%</span>
                        {factor.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-400" />}
                        {factor.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-400" />}
                        {factor.trend === 'stable' && <Minus className="h-4 w-4 text-gray-400" />}
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          factor.score >= 80 ? 'bg-green-500' : 
                          factor.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Info className="h-5 w-5 text-green-400" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-medium mb-1">{rec.title}</h3>
                        <p className="text-slate-400 text-sm">{rec.description}</p>
                      </div>
                      <Badge className={
                        rec.priority === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        rec.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-green-500/20 text-green-400 border-green-500/30'
                      }>
                        {rec.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 text-sm font-bold">{rec.impact}</span>
                      <Button size="sm" className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-cyan-500/30">
                        {rec.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips & Info */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Star className="h-5 w-5 text-yellow-400" />
              Credit Score Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-400 mb-3" />
                <h3 className="text-white font-medium mb-2">Pay on Time</h3>
                <p className="text-slate-400 text-sm">Always pay your medical bills on time to maintain a good score.</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Activity className="h-8 w-8 text-cyan-400 mb-3" />
                <h3 className="text-white font-medium mb-2">Stay Active</h3>
                <p className="text-slate-400 text-sm">Regular health activities improve your adherence score.</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Shield className="h-8 w-8 text-purple-400 mb-3" />
                <h3 className="text-white font-medium mb-2">Monitor Regularly</h3>
                <p className="text-slate-400 text-sm">Check your score monthly and address any issues promptly.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditScoreAnalysisIntegrated;
