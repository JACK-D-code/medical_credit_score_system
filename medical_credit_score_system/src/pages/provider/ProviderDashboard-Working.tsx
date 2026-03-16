import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Award, 
  Activity, 
  Heart, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  BarChart3, 
  Target, 
  Zap,
  Shield,
  CreditCard
} from 'lucide-react';

const ProviderDashboard = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProviderData = () => {
      try {
        setLoading(true);
        
        // Generate dynamic patient data
        const dynamicPatients = [
          {
            id: 'P001',
            name: 'Rahul Sharma',
            phid: 'PHID-1K4J2A8-XYZ123',
            age: 34,
            creditScore: 750,
            loyaltyLevel: 'Gold',
            lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            totalVisits: 12,
            adherenceScore: 90,
            paymentHistory: 'Excellent',
            trustScore: 85,
            treatmentHistory: 'Cardiac Catheterization, Regular Checkups',
            insuranceStatus: 'Active',
            nextAppointment: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            totalBilled: 15000,
            totalPaid: 15000,
            pendingAmount: 0
          },
          {
            id: 'P002',
            name: 'Priya Patel',
            phid: 'PHID-1K4J2B9-ABC456',
            age: 28,
            creditScore: 720,
            loyaltyLevel: 'Silver',
            lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            totalVisits: 8,
            adherenceScore: 85,
            paymentHistory: 'Good',
            trustScore: 78,
            treatmentHistory: 'Diabetes Management, Regular Checkups',
            insuranceStatus: 'Active',
            nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            totalBilled: 8500,
            totalPaid: 7000,
            pendingAmount: 1500
          },
          {
            id: 'P003',
            name: 'Amit Kumar',
            phid: 'PHID-1K4J2C7-DEF789',
            age: 42,
            creditScore: 680,
            loyaltyLevel: 'Bronze',
            lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            totalVisits: 6,
            adherenceScore: 75,
            paymentHistory: 'Fair',
            trustScore: 70,
            treatmentHistory: 'Hypertension Treatment',
            insuranceStatus: 'Active',
            nextAppointment: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            totalBilled: 6000,
            totalPaid: 4000,
            pendingAmount: 2000
          }
        ];

        // Generate dynamic appointments
        const dynamicAppointments = [
          {
            id: 'A001',
            patientId: 'P001',
            patientName: 'Rahul Sharma',
            type: 'Follow-up',
            scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            duration: 30,
            status: 'scheduled',
            purpose: 'Post-treatment checkup',
            priority: 'medium'
          },
          {
            id: 'A002',
            patientId: 'P002',
            patientName: 'Priya Patel',
            type: 'Consultation',
            scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            duration: 45,
            status: 'scheduled',
            purpose: 'Diabetes review',
            priority: 'low'
          },
          {
            id: 'A003',
            patientId: 'P003',
            patientName: 'Amit Kumar',
            type: 'Emergency',
            scheduledFor: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            duration: 60,
            status: 'confirmed',
            purpose: 'Urgent follow-up',
            priority: 'high'
          }
        ];

        // Generate revenue data
        const dynamicRevenue = {
          today: 2500,
          thisWeek: 12500,
          thisMonth: 45000,
          totalRevenue: 295000,
          pendingPayments: 3500,
          averagePerPatient: 9833,
          growth: 15.5
        };

        // Generate performance metrics
        const dynamicPerformance = {
          totalPatients: patients.length,
          activePatients: patients.filter(p => p.status === 'active').length,
          averageCreditScore: Math.round(patients.reduce((sum, p) => sum + p.creditScore, 0) / patients.length),
          patientSatisfaction: 4.6,
          appointmentCompletionRate: 92,
          treatmentAdherenceRate: 83,
          paymentCollectionRate: 85,
          newPatientsThisMonth: 8,
          retentionRate: 78
        };

        setPatients(dynamicPatients);
        setAppointments(dynamicAppointments);
        setRevenue(dynamicRevenue);
        setPerformance(dynamicPerformance);

      } catch (error) {
        console.error('Error loading provider data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProviderData();
  }, []);

  const getLoyaltyColor = (level: string) => {
    switch (level) {
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
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

  const getPaymentStatusColor = (history: string) => {
    switch (history) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading provider dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
          <p className="text-gray-600">
            Manage your patients, appointments, and practice performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{performance?.totalPatients || 0}</div>
                  <div className="text-sm text-gray-600">Total Patients</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">₹{revenue?.thisMonth?.toLocaleString() || 0}</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{appointments.filter(a => a.status === 'scheduled').length}</div>
                  <div className="text-sm text-gray-600">Today's Appointments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{performance?.patientSatisfaction || 0}</div>
                  <div className="text-sm text-gray-600">Patient Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Appointment Completion</span>
                      <span>{performance?.appointmentCompletionRate || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${performance?.appointmentCompletionRate || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Treatment Adherence</span>
                      <span>{performance?.treatmentAdherenceRate || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${performance?.treatmentAdherenceRate || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Payment Collection</span>
                      <span>{performance?.paymentCollectionRate || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${performance?.paymentCollectionRate || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Patient Retention</span>
                      <span>{performance?.retentionRate || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${performance?.retentionRate || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Revenue Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Today</span>
                  <span className="font-medium">₹{revenue?.today?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="font-medium">₹{revenue?.thisWeek?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-medium">₹{revenue?.thisMonth?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="font-medium text-red-600">₹{revenue?.pendingPayments?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Growth</span>
                  <span className="font-medium text-green-600">+{revenue?.growth || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Appointments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                    </div>
                    <Badge className={getPriorityColor(appointment.priority)}>
                      {appointment.priority}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span>{new Date(appointment.scheduledFor).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{appointment.duration} mins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purpose:</span>
                      <span>{appointment.purpose}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Reschedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Patients Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Patients Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Patient</th>
                    <th className="text-left py-3 px-4">PHID</th>
                    <th className="text-left py-3 px-4">Credit Score</th>
                    <th className="text-left py-3 px-4">Loyalty</th>
                    <th className="text-left py-3 px-4">Adherence</th>
                    <th className="text-left py-3 px-4">Payment</th>
                    <th className="text-left py-3 px-4">Billing</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="border-b">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-gray-600">Age: {patient.age}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-mono">{patient.phid}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{patient.creditScore}</span>
                          <Shield className="h-4 w-4 text-blue-600" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getLoyaltyColor(patient.loyaltyLevel)}>
                          {patient.loyaltyLevel}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span>{patient.adherenceScore}%</span>
                          <Heart className="h-4 w-4 text-red-600" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getPaymentStatusColor(patient.paymentHistory)}>
                          {patient.paymentHistory}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-sm">Total: ₹{patient.totalBilled.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Paid: ₹{patient.totalPaid.toLocaleString()}</div>
                          {patient.pendingAmount > 0 && (
                            <div className="text-sm text-red-600">Pending: ₹{patient.pendingAmount.toLocaleString()}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-3 w-3" />
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
      </div>
    </div>
  );
};

export default ProviderDashboard;
