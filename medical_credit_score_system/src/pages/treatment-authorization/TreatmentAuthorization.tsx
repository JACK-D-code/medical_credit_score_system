import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import {
  CheckCircle,
  Clock,
  FileText,
  DollarSign,
  Activity,
  TrendingUp,
  Timer
} from 'lucide-react';

const TreatmentAuthorization = () => {
  const [pendingAuthorizations] = useState([
    {
      id: 'AUTH001',
      patientName: 'Rahul Sharma',
      patientId: 'P001',
      age: 34,
      treatment: 'Cardiac Catheterization',
      hospital: 'Apollo Hospital',
      doctor: 'Dr. Rajesh Kumar',
      requestedAmount: 250000,
      creditScore: 780,
      riskLevel: 'low',
      urgency: 'high',
      insuranceCoverage: 150000,
      patientResponsibility: 100000,
      recommendedAction: 'instant_approval',
      estimatedTime: '2 minutes',
      submittedAt: '30 minutes ago'
    },
    {
      id: 'AUTH002',
      patientName: 'Priya Patel',
      patientId: 'P002',
      age: 28,
      treatment: 'Laparoscopic Surgery',
      hospital: 'Fortis Hospital',
      doctor: 'Dr. Priya Sharma',
      requestedAmount: 120000,
      creditScore: 720,
      riskLevel: 'low',
      urgency: 'medium',
      insuranceCoverage: 80000,
      patientResponsibility: 40000,
      recommendedAction: 'instant_approval',
      estimatedTime: '3 minutes',
      submittedAt: '2 hours ago'
    },
    {
      id: 'AUTH003',
      patientName: 'Amit Kumar',
      patientId: 'P003',
      age: 45,
      treatment: 'MRI Scan + Consultation',
      hospital: 'Max Hospital',
      doctor: 'Dr. Amit Patel',
      requestedAmount: 15000,
      creditScore: 650,
      riskLevel: 'medium',
      urgency: 'low',
      insuranceCoverage: 10000,
      patientResponsibility: 5000,
      recommendedAction: 'manual_review',
      estimatedTime: '15 minutes',
      submittedAt: '4 hours ago'
    }
  ]);

  const [approvedToday] = useState([
    {
      id: 'AUTH004',
      patientName: 'Sunita Reddy',
      treatment: 'Knee Replacement Surgery',
      amount: 350000,
      creditScore: 810,
      approvedAt: '1 hour ago',
      processingTime: '3 minutes'
    },
    {
      id: 'AUTH005',
      patientName: 'Vijay Kumar',
      treatment: 'Cataract Surgery',
      amount: 25000,
      creditScore: 745,
      approvedAt: '3 hours ago',
      processingTime: '2 minutes'
    }
  ]);

  const [stats] = useState({
    pendingCount: 12,
    approvedToday: 8,
    avgProcessingTime: 4.2,
    instantApprovalRate: 73,
    totalValueToday: 1875000
  });

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'instant_approval': return 'bg-green-100 text-green-800';
      case 'manual_review': return 'bg-yellow-100 text-yellow-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (authId: string) => {
    console.log('Approving authorization:', authId);
    // In real app, this would call API to approve
  };

  const handleReview = (authId: string) => {
    console.log('Reviewing authorization:', authId);
    // In real app, this would open detailed review modal
  };

  const handleDeny = (authId: string) => {
    console.log('Denying authorization:', authId);
    // In real app, this would call API to deny
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Treatment Authorization Center</h1>
          <p className="text-gray-600 mt-2">Real-time credit authorization for medical treatments</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingCount}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Today</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.approvedToday}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgProcessingTime}m</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Timer className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Instant Approval</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.instantApprovalRate}%</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Value</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{(stats.totalValueToday / 100000).toFixed(1)}L</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Authorizations */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Authorizations ({pendingAuthorizations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingAuthorizations.map((auth) => (
                    <div key={auth.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{auth.patientName}</h4>
                          <p className="text-sm text-gray-600">ID: {auth.patientId} • Age: {auth.age}</p>
                          <p className="text-sm font-medium text-gray-700 mt-1">{auth.treatment}</p>
                          <p className="text-sm text-gray-600">{auth.hospital} • Dr. {auth.doctor}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getUrgencyColor(auth.urgency)}>
                            {auth.urgency}
                          </Badge>
                          <Badge className={getRiskLevelColor(auth.riskLevel)}>
                            {auth.riskLevel} risk
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Financial Breakdown</p>
                          <div className="mt-1 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Total Cost:</span>
                              <span className="font-semibold">₹{auth.requestedAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Insurance:</span>
                              <span className="text-green-600">-₹{auth.insuranceCoverage.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Patient:</span>
                              <span className="font-semibold">₹{auth.patientResponsibility.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Credit Assessment</p>
                          <div className="mt-1 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Credit Score:</span>
                              <span className="font-semibold">{auth.creditScore}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Recommended:</span>
                              <Badge className={getActionColor(auth.recommendedAction)} variant="outline">
                                {auth.recommendedAction.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Est. Time:</span>
                              <span className="text-sm">{auth.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Submitted {auth.submittedAt}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(auth.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReview(auth.id)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeny(auth.id)}
                          >
                            Deny
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recently Approved */}
          <div>
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Recently Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvedToday.map((auth) => (
                    <div key={auth.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-900">{auth.patientName}</h4>
                        <p className="text-sm text-gray-600">{auth.treatment}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="font-semibold">₹{auth.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Credit Score</p>
                          <p className="font-semibold">{auth.creditScore}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-600">
                          <CheckCircle className="inline h-4 w-4 mr-1" />
                          Approved
                        </span>
                        <span className="text-gray-500">{auth.approvedAt}</span>
                      </div>

                      <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-2 rounded">
                        Processing time: {auth.processingTime}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white border border-gray-200 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Authorization Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-semibold text-green-600">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Credit Score</span>
                    <span className="font-semibold">743</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">High Priority</span>
                    <span className="font-semibold text-red-600">3 pending</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">System Health</span>
                    <span className="font-semibold text-green-600">Optimal</span>
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

export default TreatmentAuthorization;
