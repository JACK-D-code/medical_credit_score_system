import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import {
  Brain,
  Target,
  Activity,
  FileText,
  BarChart3,
  Zap,
  Shield,
  Calculator
} from 'lucide-react';

const CreditEngineDashboard = () => {
  const [engineStats, setEngineStats] = useState({
    totalScoresCalculated: 0,
    avgProcessingTime: 0,
    approvalRate: 0,
    avgCreditScore: 0,
    systemAccuracy: 0,
    dailyVolume: 0,
    riskAssessments: 0,
    modelVersion: ''
  });

  const [scoreBreakdown, setScoreBreakdown] = useState<any[]>([]);
  const [recentCalculations, setRecentCalculations] = useState<any[]>([]);
  const [modelPerformance, setModelPerformance] = useState<any[]>([]);
  const [riskFactors, setRiskFactors] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/provider/analytics/engine');
        if (res.data) {
          setEngineStats(res.data.engineStats || engineStats);
          setScoreBreakdown(res.data.scoreBreakdown || []);
          setRecentCalculations(res.data.recentCalculations || []);
          setModelPerformance(res.data.modelPerformance || []);
          setRiskFactors(res.data.riskFactors || []);
        }
      } catch (error) {
        console.error('Error fetching credit engine analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'instant_approval': return 'bg-green-100 text-green-800';
      case 'manual_review': return 'bg-yellow-100 text-yellow-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Credit Engine Dashboard</h1>
          <p className="text-gray-600 mt-2">AI-powered medical credit scoring and risk assessment</p>
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-blue-100 text-blue-800">
              Model v{engineStats.modelVersion}
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              System Active
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              {engineStats.systemAccuracy}% Accuracy
            </Badge>
          </div>
        </div>

        {/* Engine Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scores Calculated</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{engineStats.totalScoresCalculated.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">{engineStats.dailyVolume} today</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{engineStats.avgProcessingTime}s</p>
                  <p className="text-xs text-green-600 mt-1">Below target</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{engineStats.approvalRate}%</p>
                  <p className="text-xs text-green-600 mt-1">Above target</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{engineStats.avgCreditScore}</p>
                  <p className="text-xs text-blue-600 mt-1">Healthy range</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Brain className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Score Distribution */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scoreBreakdown.map((score, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{score.range}</span>
                      <span className="text-sm text-gray-600">{score.count} ({score.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${score.color} h-2 rounded-full`}
                        style={{ width: `${score.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{score.approvalRate}% approval</span>
                      <Badge className={getRiskLevelColor(score.riskLevel)} variant="outline">
                        {score.riskLevel} risk
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Calculations */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Calculations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalculations.map((calc) => (
                  <div key={calc.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{calc.patientName}</h4>
                        <p className="text-sm text-gray-600">ID: {calc.patientId}</p>
                      </div>
                      <Badge className={getRecommendationColor(calc.recommendation)}>
                        {calc.recommendation.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-xs text-gray-500">Score</p>
                        <div className="flex items-center gap-1">
                          <span className="font-bold">{calc.finalScore}</span>
                          {calc.previousScore && (
                            <span className="text-xs text-green-600">+{calc.finalScore - calc.previousScore}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Risk</p>
                        <Badge className={getRiskLevelColor(calc.riskLevel)} variant="outline">
                          {calc.riskLevel}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      {calc.processingTime} • {calc.calculatedAt}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Model Performance */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Model Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelPerformance.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{metric.value}{metric.metric.includes('Rate') ? '%' : 's'}</span>
                        <span className="text-xs text-gray-500">{getTrendIcon(metric.trend)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Target: {metric.target}{metric.metric.includes('Rate') ? '%' : 's'}</span>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Factors Analysis */}
        <Card className="bg-white border border-gray-200 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Risk Factors Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {riskFactors.map((factor, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-2">
                      <span className="text-2xl font-bold text-blue-600">{factor.weight}%</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">{factor.factor}</h4>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Score:</span>
                      <span className="font-semibold">{factor.avgScore}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Impact:</span>
                      <Badge className={getRiskLevelColor(factor.impact)} variant="outline">
                        {factor.impact}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Trend:</span>
                      <span className="text-xs">{getTrendIcon(factor.trend)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200 mt-8">
          <CardHeader>
            <CardTitle>Engine Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Brain className="h-4 w-4 mr-2" />
                Retrain Model
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export Analytics
              </Button>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Risk Assessment
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Performance Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditEngineDashboard;
