import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import {
  Building2,
  Users,
  CreditCard,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  FileText,
  Activity,
  Shield,
  BarChart3
} from 'lucide-react';

const HospitalAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingBills: 0,
    activePatients: 0,
    bedOccupancy: 0,
    avgTreatmentValue: 0,
    creditApprovalRate: 0,
    totalEmiPlans: 0,
    monthlyGrowth: 0
  });

  const [departments, setDepartments] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchHospitalAdmin = async () => {
      try {
        const res = await api.get('/provider/analytics/hospital');
        if (res.data) {
          setStats(res.data.stats || stats);
          setDepartments(res.data.departments || []);
          setRecentTransactions(res.data.recentTransactions || []);
          setAlerts(res.data.alerts || []);
        }
      } catch (error) {
        console.error('Error fetching hospital analytics:', error);
      }
    };
    fetchHospitalAdmin();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'emi_approval': return 'bg-blue-100 text-blue-800';
      case 'down_payment': return 'bg-green-100 text-green-800';
      case 'full_payment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hospital Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage hospital operations, finances, and credit systems</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-green-600 mt-1">+{stats.monthlyGrowth}% this month</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Patients</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activePatients}</p>
                  <p className="text-xs text-gray-500 mt-1">Bed Occupancy: {stats.bedOccupancy}%</p>
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
                  <p className="text-sm font-medium text-gray-600">Credit Approval Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.creditApprovalRate}%</p>
                  <p className="text-xs text-green-600 mt-1">Above industry average</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active EMI Plans</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalEmiPlans}</p>
                  <p className="text-xs text-gray-500 mt-1">₹{stats.avgTreatmentValue.toLocaleString()} avg value</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <div className="mb-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{alert.title}</h4>
                        <p className="text-sm mt-1 opacity-90">{alert.message}</p>
                      </div>
                      <span className="text-xs opacity-75">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Performance */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Department Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                        <p className="text-sm text-gray-600">Dr. {dept.head}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {dept.occupancy}% Occupancy
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Patients</p>
                        <p className="font-semibold">{dept.patients}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Revenue</p>
                        <p className="font-semibold">₹{(dept.revenue / 100000).toFixed(1)}L</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Avg Credit Score: {dept.avgCreditScore}</span>
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

          {/* Recent Transactions */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{transaction.patientName}</h4>
                        <p className="text-sm text-gray-600">{transaction.department}</p>
                      </div>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">₹{transaction.amount.toLocaleString()}</p>
                        <Badge className={getTransactionTypeColor(transaction.type)} variant="outline">
                          {transaction.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{transaction.time}</span>
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
            <CardTitle>Administrative Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
              <Button variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Bills
              </Button>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Credit Settings
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalAdminDashboard;
