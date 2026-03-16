import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
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
  CreditCard
} from 'lucide-react';

const CreditScoreAnalysis = () => {
  const [patientData, setPatientData] = useState<any>(null);
  const [creditHistory, setCreditHistory] = useState<any[]>([]);
  const [scoreFactors, setScoreFactors] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCreditAnalysis = () => {
      try {
        setLoading(true);
        
        // Get patient data from PHID system
        const savedPHID = localStorage.getItem('currentPHID');
        const savedData = localStorage.getItem('patientData');
        
        if (savedPHID && savedData) {
          const patientInfo = JSON.parse(savedData);
          setPatientData(patientInfo);
          
          const currentScore = patientInfo.creditScore || 750;
          
          // Generate credit history based on patient data
          const dynamicHistory = [
            { 
              month: 'Jan', 
              score: Math.max(300, currentScore - 50),
              change: -15,
              reason: 'Missed medication doses'
            },
            { 
              month: 'Feb', 
              score: Math.max(300, currentScore - 30),
              change: +20,
              reason: 'Improved exercise routine'
            },
            { 
              month: 'Mar', 
              score: Math.max(300, currentScore - 15),
              change: +15,
              reason: 'Regular health checkups'
            },
            { 
              month: 'Apr', 
              score: currentScore - 10,
              change: +10,
              reason: 'Completed treatment plan'
            },
            { 
              month: 'May', 
              score: currentScore,
              change: +10,
              reason: 'Excellent adherence'
            }
          ];

          // Generate score factors
          const dynamicFactors = [
            {
              id: '1',
              factor: 'Medication Adherence',
              impact: 'positive',
              weight: 30,
              current: patientInfo.adherenceScore || 85,
              description: 'Consistent medication intake',
              icon: Heart,
              trend: 'up'
            },
            {
              id: '2',
              factor: 'Activity Completion',
              impact: 'positive',
              weight: 25,
              current: 90,
              description: 'Regular health activities',
              icon: Activity,
              trend: 'up'
            },
            {
              id: '3',
              factor: 'Appointment Attendance',
              impact: 'positive',
              weight: 20,
              current: 95,
              description: 'Punctual for appointments',
              icon: Calendar,
              trend: 'stable'
            },
            {
              id: '4',
              factor: 'Payment History',
              impact: 'positive',
              weight: 15,
              current: 88,
              description: 'Timely bill payments',
              icon: CreditCard,
              trend: 'up'
            },
            {
              id: '5',
              factor: 'Health Metrics',
              impact: 'neutral',
              weight: 10,
              current: 75,
              description: 'Vital signs monitoring',
              icon: Shield,
              trend: 'down'
            }
          ];

          // Generate recommendations
          const dynamicRecommendations = [
            {
              id: '1',
              title: 'Improve Health Metrics Tracking',
              description: 'Monitor blood pressure and weight regularly for better scores',
              impact: '+15-20 points',
              priority: 'high',
              category: 'Health',
              action: 'Start daily vitals tracking'
            },
            {
              id: '2',
              title: 'Maintain Medication Adherence',
              description: 'Continue taking medications on time to sustain current score',
              impact: 'Maintain current level',
              priority: 'medium',
              category: 'Adherence',
              action: 'Set medication reminders'
            },
            {
              id: '3',
              title: 'Complete Pending Activities',
              description: 'Finish remaining daily activities to boost score',
              impact: '+10-15 points',
              priority: 'medium',
              category: 'Activities',
              action: 'Complete evening yoga session'
            },
            {
              id: '4',
              title: 'Schedule Regular Checkups',
              description: 'Book preventive health appointments for score improvement',
              impact: '+5-10 points',
              priority: 'low',
              category: 'Prevention',
              action: 'Book monthly health checkup'
            }
          ];

          setCreditHistory(dynamicHistory);
          setScoreFactors(dynamicFactors);
          setRecommendations(dynamicRecommendations);

        } else {
          setPatientData(null);
          setCreditHistory([]);
          setScoreFactors([]);
          setRecommendations([]);
        }

      } catch (error) {
        console.error('Error loading credit analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCreditAnalysis();
  }, []);

  const getScoreCategory = (score: number) => {
    if (score >= 800) return { category: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 750) return { category: 'Very Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 700) return { category: 'Good', color: 'text-cyan-600', bg: 'bg-cyan-100' };
    if (score >= 650) return { category: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 600) return { category: 'Poor', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { category: 'Very Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculatePotentialScore = () => {
    const currentScore = patientData?.creditScore || 750;
    const highPriorityRecs = recommendations.filter(r => r.priority === 'high' && r.impact.includes('+'));
    const potentialIncrease = highPriorityRecs.reduce((sum, rec) => {
      const match = rec.impact.match(/\+(\d+)/);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0);
    return Math.min(850, currentScore + potentialIncrease);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading credit analysis...</span>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Patient Data Found</h2>
          <p className="text-gray-600 mb-4">Please enter your PHID to access credit score analysis.</p>
          <Button onClick={() => window.location.href = '/phid-entry'}>
            Enter PHID
          </Button>
        </div>
      </div>
    );
  }

  const currentScore = patientData.creditScore || 750;
  const scoreInfo = getScoreCategory(currentScore);
  const potentialScore = calculatePotentialScore();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Credit Score Analysis</h1>
          <p className="text-gray-600">
            Detailed analysis of your medical credit score • PHID: {patientData.phid}
          </p>
        </div>

        {/* Score Overview */}
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
                  <div className={`text-5xl font-bold ${scoreInfo.color}`}>
                    {currentScore}
                  </div>
                  <div className="text-lg text-gray-600 mb-2">
                    {scoreInfo.category} Credit Score
                  </div>
                  <Badge className={scoreInfo.bg}>
                    {scoreInfo.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Potential Score</div>
                  <div className="text-2xl font-bold text-green-600">
                    {potentialScore}
                  </div>
                  <div className="text-sm text-green-600">
                    +{potentialScore - currentScore} points possible
                  </div>
                </div>
              </div>

              {/* Score History Chart */}
              <div className="h-40 flex items-end justify-between gap-2">
                {creditHistory.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t relative"
                      style={{ height: `${((item.score - 300) / 550) * 100}%` }}
                    >
                      {item.change > 0 && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-green-600">
                          +{item.change}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Score Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scoreFactors.slice(0, 4).map((factor) => (
                  <div key={factor.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <factor.icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{factor.factor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{factor.current}%</span>
                      {getTrendIcon(factor.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Score Factors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Detailed Score Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreFactors.map((factor) => (
                <div key={factor.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <factor.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{factor.factor}</h3>
                        <p className="text-sm text-gray-600">{factor.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{factor.current}%</span>
                        {getTrendIcon(factor.trend)}
                      </div>
                      <Badge className={
                        factor.impact === 'positive' ? 'bg-green-100 text-green-800' :
                        factor.impact === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {factor.impact}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Weight: {factor.weight}%</span>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${factor.current}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-green-600" />
              Recommendations for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium mb-1">{rec.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority} priority
                        </Badge>
                        <span className="text-sm font-medium text-green-600">{rec.impact}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-100 text-blue-800">
                      {rec.category}
                    </Badge>
                    <Button size="sm" variant="outline">
                      {rec.action}
                    </Button>
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

export default CreditScoreAnalysis;
