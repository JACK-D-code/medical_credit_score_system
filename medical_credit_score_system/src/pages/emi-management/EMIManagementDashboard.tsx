import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  FileText,
  CreditCard,
  BarChart3,
  Target,
  Bell
} from 'lucide-react';

const EMIManagementDashboard = () => {
  const [stats] = useState({
    totalActivePlans: 156,
    totalOutstanding: 8750000,
    monthlyRevenue: 1240000,
    defaultRate: 2.3,
    onTimePaymentRate: 94.7,
    overdueAmount: 234000,
    newPlansThisMonth: 23
  });

  const [activePlans] = useState([
    {
      id: 'EMI001',
      patientName: 'Rahul Sharma',
      patientId: 'P001',
      treatmentType: 'Cardiac Catheterization',
      principalAmount: 250000,
      monthlyInstallment: 20833,
      durationMonths: 12,
      paidInstallments: 3,
      totalPaid: 62500,
      outstandingBalance: 187500,
      nextDueDate: '2024-03-15',
      status: 'active',
      riskLevel: 'low',
      creditScore: 780,
      interestRate: 8.5
    },
    {
      id: 'EMI002',
      patientName: 'Priya Patel',
      patientId: 'P002',
      treatmentType: 'Laparoscopic Surgery',
      principalAmount: 120000,
      monthlyInstallment: 10000,
      durationMonths: 12,
      paidInstallments: 6,
      totalPaid: 60000,
      outstandingBalance: 60000,
      nextDueDate: '2024-03-10',
      status: 'active',
      riskLevel: 'low',
      creditScore: 720,
      interestRate: 9.2
    },
    {
      id: 'EMI003',
      patientName: 'Amit Kumar',
      patientId: 'P003',
      treatmentType: 'MRI Scan + Consultation',
      principalAmount: 15000,
      monthlyInstallment: 1250,
      durationMonths: 12,
      paidInstallments: 2,
      totalPaid: 2500,
      outstandingBalance: 12500,
      nextDueDate: '2024-03-20',
      status: 'overdue',
      riskLevel: 'medium',
      creditScore: 650,
      interestRate: 10.5
    }
  ]);

  const [overduePayments] = useState([
    {
      emiId: 'EMI003',
      patientName: 'Amit Kumar',
      installmentNumber: 3,
      dueAmount: 1250,
      overdueDays: 5,
      lateFee: 125,
      totalDue: 1375,
      lastContact: '2 days ago',
      riskLevel: 'medium'
    },
    {
      emiId: 'EMI004',
      patientName: 'Sunita Reddy',
      installmentNumber: 7,
      dueAmount: 29167,
      overdueDays: 12,
      lateFee: 875,
      totalDue: 30042,
      lastContact: '1 week ago',
      riskLevel: 'high'
    }
  ]);

  const [paymentSchedule] = useState([
    {
      date: '2024-03-10',
      totalDue: 45000,
      paymentsCount: 8,
      status: 'upcoming'
    },
    {
      date: '2024-03-15',
      totalDue: 67000,
      paymentsCount: 12,
      status: 'upcoming'
    },
    {
      date: '2024-03-20',
      totalDue: 23000,
      paymentsCount: 4,
      status: 'upcoming'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'defaulted': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScheduleStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (paidInstallments: number, totalInstallments: number) => {
    return (paidInstallments / totalInstallments) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">EMI Management Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage medical loan EMI plans and payments</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Plans</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalActivePlans}</p>
                  <p className="text-xs text-green-600 mt-1">+{stats.newPlansThisMonth} this month</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{(stats.totalOutstanding / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-gray-500 mt-1">₹{(stats.overdueAmount / 1000).toFixed(0)}K overdue</p>
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
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-green-600 mt-1">+8.3% growth</p>
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
                  <p className="text-sm font-medium text-gray-600">On-Time Payment Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.onTimePaymentRate}%</p>
                  <p className="text-xs text-green-600 mt-1">Above target</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert for Overdue Payments */}
        {overduePayments.length > 0 && (
          <Card className="bg-red-50 border-red-200 mb-8">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800">Payment Overdue Alert</h4>
                  <p className="text-red-600 text-sm">{overduePayments.length} payments overdue totaling ₹{overduePayments.reduce((sum, p) => sum + p.totalDue, 0).toLocaleString()}</p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Reminders
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active EMI Plans */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Active EMI Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activePlans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{plan.patientName}</h4>
                          <p className="text-sm text-gray-600">ID: {plan.patientId}</p>
                          <p className="text-sm font-medium text-gray-700 mt-1">{plan.treatmentType}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(plan.status)}>
                            {plan.status}
                          </Badge>
                          <Badge className={getRiskLevelColor(plan.riskLevel)}>
                            {plan.riskLevel} risk
                          </Badge>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress: {plan.paidInstallments}/{plan.durationMonths} payments</span>
                          <span className="font-semibold">{calculateProgress(plan.paidInstallments, plan.durationMonths).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${calculateProgress(plan.paidInstallments, plan.durationMonths)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Financial Details</p>
                          <div className="mt-1 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Principal:</span>
                              <span className="font-semibold">₹{plan.principalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Monthly EMI:</span>
                              <span className="font-semibold">₹{plan.monthlyInstallment.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Interest Rate:</span>
                              <span className="font-semibold">{plan.interestRate}%</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Payment Status</p>
                          <div className="mt-1 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">Total Paid:</span>
                              <span className="font-semibold text-green-600">₹{plan.totalPaid.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Outstanding:</span>
                              <span className="font-semibold">₹{plan.outstandingBalance.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Next Due:</span>
                              <span className="font-semibold">{plan.nextDueDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Credit Score: {plan.creditScore}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overdue Payments */}
          <div>
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Overdue Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {overduePayments.map((payment) => (
                    <div key={payment.emiId} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-900">{payment.patientName}</h4>
                        <p className="text-sm text-gray-600">EMI {payment.installmentNumber}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Due Amount</p>
                          <p className="font-semibold">₹{payment.dueAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Overdue Days</p>
                          <p className="font-semibold text-red-600">{payment.overdueDays} days</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Late Fee:</span>
                          <span className="font-semibold text-red-600">₹{payment.lateFee}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm font-semibold">Total Due:</span>
                          <span className="font-bold text-red-600">₹{payment.totalDue}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <Badge className={getRiskLevelColor(payment.riskLevel)}>
                          {payment.riskLevel} risk
                        </Badge>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Send Reminder
                        </Button>
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        Last contact: {payment.lastContact}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Payments */}
            <Card className="bg-white border border-gray-200 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentSchedule.map((schedule, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{schedule.date}</p>
                          <p className="text-sm text-gray-600">{schedule.paymentsCount} payments</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{schedule.totalDue.toLocaleString()}</p>
                          <Badge className={getScheduleStatusColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200 mt-8">
          <CardHeader>
            <CardTitle>EMI Management Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
              <Button variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Send Reminders
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Risk Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EMIManagementDashboard;
