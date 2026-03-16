import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Users, 
  Calendar,
  CreditCard,
  TrendingUp,
  Award,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  FileText,
  Heart,
  DollarSign,
  Search,
  Filter,
  Plus,
  Eye
} from 'lucide-react';

const ProviderDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 247,
    todayAppointments: 8,
    pendingEvaluations: 12,
    completedEvaluations: 156,
    averageCreditScore: 742,
    totalBonusPoints: 2840,
    monthlyRevenue: 450000,
    activeEMIPlans: 89
  });

  const [recentPatients, setRecentPatients] = useState([
    {
      id: 'P001',
      name: 'Rahul Sharma',
      age: 34,
      creditScore: 780,
      lastVisit: '2024-03-15',
      treatment: 'Cardiac Catheterization',
      status: 'active',
      loyaltyLevel: 'Gold',
      nextAppointment: '2024-03-20'
    },
    {
      id: 'P002',
      name: 'Priya Patel',
      age: 28,
      creditScore: 720,
      lastVisit: '2024-03-14',
      treatment: 'Dental Implant',
      status: 'active',
      loyaltyLevel: 'Silver',
      nextAppointment: '2024-03-18'
    },
    {
      id: 'P003',
      name: 'Amit Kumar',
      age: 45,
      creditScore: 650,
      lastVisit: '2024-03-10',
      treatment: 'MRI Scan + Consultation',
      status: 'active',
      loyaltyLevel: 'Bronze',
      nextAppointment: '2024-03-25'
    }
  ]);

  const [pendingEvaluations, setPendingEvaluations] = useState([
    {
      id: 'E001',
      patientId: 'P001',
      patientName: 'Rahul Sharma',
      evaluationType: 'Loyalty Bonus',
      bonusPoints: 50,
      reason: 'Regular hospital visits for 12 months',
      submittedDate: '2024-03-15',
      status: 'pending'
    },
    {
      id: 'E002',
      patientId: 'P004',
      patientName: 'Sunita Reddy',
      evaluationType: 'Trust Recognition',
      bonusPoints: 75,
      reason: 'Outstanding treatment compliance',
      submittedDate: '2024-03-14',
      status: 'pending'
    }
  ]);

  const [todayAppointments, setTodayAppointments] = useState([
    {
      id: 'A001',
      patientName: 'Rahul Sharma',
      time: '09:00 AM',
      type: 'Follow-up',
      duration: 30,
      status: 'scheduled',
      creditScore: 780
    },
    {
      id: 'A002',
      patientName: 'Priya Patel',
      time: '10:30 AM',
      type: 'Consultation',
      duration: 45,
      status: 'scheduled',
      creditScore: 720
    },
    {
      id: 'A003',
      patientName: 'Amit Kumar',
      time: '02:00 PM',
      type: 'Treatment',
      duration: 60,
      status: 'confirmed',
      creditScore: 650
    }
  ]);

  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', revenue: 380000, patients: 45 },
    { month: 'Feb', revenue: 420000, patients: 52 },
    { month: 'Mar', revenue: 450000, patients: 58 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalPatients: prev.totalPatients + Math.floor(Math.random() * 3),
        averageCreditScore: Math.min(850, prev.averageCreditScore + Math.floor(Math.random() * 5))
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return 'bg-green-100 text-green-800';
    if (score >= 650) return 'bg-blue-100 text-blue-800';
    if (score >= 500) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getLoyaltyColor = (level: string) => {
    switch (level) {
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPatients = recentPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage patients, evaluations, and treatments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalPatients}</div>
                  <div className="text-sm text-gray-600">Total Patients</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.todayAppointments}</div>
                  <div className="text-sm text-gray-600">Today's Appointments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalBonusPoints}</div>
                  <div className="text-sm text-gray-600">Bonus Points Awarded</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{appointment.patientName}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{appointment.time}</span>
                          <span>•</span>
                          <span>{appointment.type}</span>
                          <span>•</span>
                          <span>{appointment.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getCreditScoreColor(appointment.creditScore)}>
                        Score: {appointment.creditScore}
                      </Badge>
                      <Badge className={getAppointmentStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Evaluations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Pending Evaluations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingEvaluations.map((evaluation) => (
                  <div key={evaluation.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{evaluation.patientName}</h4>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {evaluation.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{evaluation.evaluationType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bonus Points:</span>
                        <span className="font-medium text-green-600">+{evaluation.bonusPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium">{evaluation.submittedDate}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-600">{evaluation.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Patient Management
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Patient</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Credit Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Loyalty</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Visit</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Next Appointment</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <h4 className="font-semibold">{patient.name}</h4>
                          <p className="text-sm text-gray-600">Age: {patient.age}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getCreditScoreColor(patient.creditScore)}>
                          {patient.creditScore}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getLoyaltyColor(patient.loyaltyLevel)}>
                          {patient.loyaltyLevel}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {patient.lastVisit}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {patient.nextAppointment}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Award className="h-3 w-3 mr-1" />
                            Evaluate
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Analytics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Revenue Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹{(revenueData.reduce((sum, item) => sum + item.revenue, 0)).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Revenue (3 months)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{revenueData.reduce((sum, item) => sum + item.patients, 0)}</div>
                <div className="text-sm text-gray-600">Total Patients (3 months)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">₹{Math.round(revenueData.reduce((sum, item) => sum + item.revenue, 0) / revenueData.reduce((sum, item) => sum + item.patients, 0)).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Avg Revenue per Patient</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-end justify-between h-32">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-8 bg-green-500 rounded-t"
                      style={{ height: `${(item.revenue / 500000) * 100}px` }}
                    ></div>
                    <div className="text-xs mt-2">{item.month}</div>
                    <div className="text-xs font-medium">₹{(item.revenue / 1000).toFixed(0)}K</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Add Patient</h3>
                <p className="text-sm text-gray-600 mb-4">Register a new patient in the system</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Add New Patient
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Evaluate Patient</h3>
                <p className="text-sm text-gray-600 mb-4">Grant bonus points for loyal patients</p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Evaluate Patient
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Generate Report</h3>
                <p className="text-sm text-gray-600 mb-4">Download patient and revenue reports</p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
