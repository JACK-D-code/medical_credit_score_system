import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import {
  DollarSign,
  Users,
  TrendingUp,
  Shield,
  CheckCircle,
  FileText,
  PieChart,
  Target,
  Banknote,
  Calculator,
  Clock
} from 'lucide-react';

const FinanceProviderDashboard = () => {
  const [stats, setStats] = useState({
    totalLoanPortfolio: 0,
    activeBorrowers: 0,
    approvalRate: 0,
    defaultRate: 0,
    avgLoanAmount: 0,
    totalInterest: 0,
    riskAdjustedReturn: 0,
    pendingApplications: 0
  });

  const [loanPortfolio, setLoanPortfolio] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<any[]>([]);

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const res = await api.get('/provider/analytics/finance');
        if (res.data) {
          setStats(res.data.stats || stats);
          setLoanPortfolio(res.data.loanPortfolio || []);
          setRecentApplications(res.data.recentApplications || []);
          setRiskMetrics(res.data.riskMetrics || []);
        }
      } catch (error) {
        console.error('Error fetching finance analytics:', error);
      }
    };
    fetchFinance();
  }, []);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'auto_approve': return 'bg-green-100 text-green-800';
      case 'manual_review': return 'bg-yellow-100 text-yellow-800';
      case 'reject': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Finance Provider Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage medical loan portfolio and credit risk assessment</p>
        </div>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Portfolio</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{(stats.totalLoanPortfolio / 10000000).toFixed(1)}Cr</p>
                  <p className="text-xs text-green-600 mt-1">+12.3% YoY</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Banknote className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Borrowers</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeBorrowers.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Avg Loan: ₹{stats.avgLoanAmount.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.approvalRate}%</p>
                  <p className="text-xs text-green-600 mt-1">Above target</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Default Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.defaultRate}%</p>
                  <p className="text-xs text-green-600 mt-1">Below industry avg</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Loan Portfolio by Category */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Loan Portfolio by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanPortfolio.map((category, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{category.category}</h4>
                        <p className="text-sm text-gray-600">{category.borrowers} borrowers</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getRiskLevelColor(category.riskLevel)}>
                          {category.riskLevel} risk
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800">
                          {category.defaultRate}% default
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Portfolio Value</p>
                        <p className="font-semibold">₹{(category.amount / 100000).toFixed(1)}L</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Avg Credit Score</p>
                        <p className="font-semibold">{category.avgCreditScore}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{category.avgInterestRate}% avg rate</span>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{application.patientName}</h4>
                        <p className="text-sm text-gray-600">{application.hospital}</p>
                      </div>
                      <Badge className={getActionColor(application.recommendedAction)}>
                        {application.recommendedAction.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Loan Amount</p>
                        <p className="font-semibold">₹{application.loanAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Credit Score</p>
                        <p className="font-semibold">{application.creditScore}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{application.timeToDecision}</span>
                      </div>
                      <span className="text-xs text-gray-500">{application.appliedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Metrics */}
        <Card className="bg-white border border-gray-200 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Risk Metrics Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {riskMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getStatusColor(metric.status)} mb-3`}>
                    <span className="text-2xl font-bold">{metric.value}{metric.metric.includes('Rate') ? '%' : ''}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{metric.metric}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {getTrendIcon(metric.trend)} {metric.trend}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200 mt-8">
          <CardHeader>
            <CardTitle>Finance Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Calculator className="h-4 w-4 mr-2" />
                Risk Assessment
              </Button>
              <Button variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Review Applications
              </Button>
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Portfolio Analytics
              </Button>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Compliance Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceProviderDashboard;
