import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Button } from '../../components/ui/shadcn-button';
import {
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Activity
} from 'lucide-react';

const DoctorDashboard = () => {
  const [stats] = useState({
    totalPatients: 1247,
    todayAppointments: 8,
    pendingAuthorizations: 3,
    approvedTreatments: 23,
    avgCreditScore: 742,
    totalTreatmentValue: 4580000
  });

  const [recentPatients] = useState([
    {
      id: 'P001',
      name: 'Rahul Sharma',
      age: 34,
      creditScore: 780,
      treatment: 'Cardiac Catheterization',
      cost: 250000,
      status: 'pending',
      urgency: 'high'
    },
    {
      id: 'P002',
      name: 'Priya Patel',
      age: 28,
      creditScore: 720,
      treatment: 'Laparoscopic Surgery',
      cost: 120000,
      status: 'approved',
      urgency: 'medium'
    },
    {
      id: 'P003',
      name: 'Amit Kumar',
      age: 45,
      creditScore: 650,
      treatment: 'MRI Scan + Consultation',
      cost: 15000,
      status: 'pending',
      urgency: 'low'
    }
  ]);

  const [treatmentQueue] = useState([
    {
      patientName: 'Rahul Sharma',
      treatment: 'Cardiac Catheterization',
      requestedAmount: 250000,
      creditScore: 780,
      recommendedAction: 'instant_approval',
      estimatedTime: '2 minutes'
    },
    {
      patientName: 'Amit Kumar',
      treatment: 'MRI Scan + Consultation',
      requestedAmount: 15000,
      creditScore: 650,
      recommendedAction: 'manual_review',
      estimatedTime: '15 minutes'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage patient treatments and credit authorizations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPatients.toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.todayAppointments}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Authorizations</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingAuthorizations}</p>
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
                  <p className="text-sm font-medium text-gray-600">Avg Credit Score</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgCreditScore}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Treatment Authorization Queue */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Treatment Authorization Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {treatmentQueue.map((treatment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{treatment.patientName}</h4>
                        <p className="text-sm text-gray-600">{treatment.treatment}</p>
                      </div>
                      <Badge className={getActionColor(treatment.recommendedAction)}>
                        {treatment.recommendedAction.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Requested Amount</p>
                        <p className="font-semibold">₹{treatment.requestedAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Credit Score</p>
                        <p className="font-semibold">{treatment.creditScore}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        <Clock className="inline h-4 w-4 mr-1" />
                        Est. {treatment.estimatedTime}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                        <p className="text-sm text-gray-600">Age {patient.age} • ID: {patient.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                        <Badge className={getUrgencyColor(patient.urgency)}>
                          {patient.urgency}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700">{patient.treatment}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Treatment Cost</p>
                        <p className="font-semibold">₹{patient.cost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Credit Score</p>
                        <p className="font-semibold">{patient.creditScore}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200 mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                New Treatment Plan
              </Button>
              <Button variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Pending
              </Button>
              <Button variant="outline">
                <AlertCircle className="h-4 w-4 mr-2" />
                Review Cases
              </Button>
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
