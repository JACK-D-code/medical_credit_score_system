import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/shadcn-button';
import {
  Users,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
  UserCheck,
  Building
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  creditScore: number;
  treatment: string;
  cost: number;
  status: 'pending' | 'approved' | 'rejected';
  urgency: 'low' | 'medium' | 'high' | 'emergency';
}

interface CreditApplication {
  id: string;
  patientId: string;
  patientName: string;
  treatmentType: string;
  requestedAmount: number;
  creditScore: number;
  status: 'pending' | 'approved' | 'rejected';
  emiPlan?: {
    monthlyAmount: number;
    duration: number;
    interestRate: number;
    totalAmount: number;
  };
  processingTime?: number;
}

const RealTimeDemo = () => {
  const [activeWindow, setActiveWindow] = useState<'doctor' | 'patient' | 'admin'>('doctor');
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [creditApplications, setCreditApplications] = useState<CreditApplication[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Mock data for demonstration
  const mockPatient: Patient = {
    id: 'MCI-1234',
    name: 'Rahul Sharma',
    age: 34,
    creditScore: 780,
    treatment: 'Cardiac Catheterization Surgery',
    cost: 100000,
    status: 'pending',
    urgency: 'high'
  };

  const mockCreditApplication: CreditApplication = {
    id: 'APP-001',
    patientId: 'MCI-1234',
    patientName: 'Rahul Sharma',
    treatmentType: 'Cardiac Catheterization Surgery',
    requestedAmount: 100000,
    creditScore: 780,
    status: 'pending'
  };

  // Simulate credit application processing
  const processCreditApplication = async (application: CreditApplication) => {
    setIsProcessing(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const updatedApplication = {
      ...application,
      status: 'approved' as const,
      processingTime: 2.3,
      emiPlan: {
        monthlyAmount: 8333,
        duration: 12,
        interestRate: 0,
        totalAmount: 100000
      }
    };

    setCreditApplications(prev => [...prev, updatedApplication]);
    setIsProcessing(false);

    return updatedApplication;
  };

  // Auto-start demo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (demoStep === 0) {
        setDemoStep(1);
        setCurrentPatient(mockPatient);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [demoStep]);

  const renderDoctorWindow = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Doctor Portal - Patient Treatment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPatient ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Patient Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">ID:</span> {currentPatient.id}</p>
                    <p><span className="text-gray-600">Name:</span> {currentPatient.name}</p>
                    <p><span className="text-gray-600">Age:</span> {currentPatient.age} years</p>
                    <p><span className="text-gray-600">Treatment:</span> {currentPatient.treatment}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Financial Assessment</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Treatment Cost:</span> ₹{currentPatient.cost.toLocaleString()}</p>
                    <p><span className="text-gray-600">Credit Score:</span>
                      <Badge className={currentPatient.creditScore >= 750 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {currentPatient.creditScore}
                      </Badge>
                    </p>
                    <p><span className="text-gray-600">Urgency:</span>
                      <Badge className={currentPatient.urgency === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                        {currentPatient.urgency.toUpperCase()}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setDemoStep(2);
                    setActiveWindow('patient');
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Issue ₹{currentPatient.cost.toLocaleString()} Bill
                </Button>
                <Button variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Request Manual Review
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading patient information...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderPatientWindow = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Patient Portal - Medical Credit Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          {demoStep >= 2 && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">Unpayable Treatment Bill</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Treatment:</span> {mockPatient.treatment}</p>
                  <p><span className="font-medium">Total Cost:</span> ₹{mockPatient.cost.toLocaleString()}</p>
                  <p><span className="font-medium">Due Date:</span> {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => {
                    setDemoStep(3);
                    processCreditApplication(mockCreditApplication);
                  }}
                  className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Clock className="h-5 w-5 mr-2 animate-spin" />
                      Processing Credit Application...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Apply for Medical Credit
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {creditApplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Credit Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            {creditApplications.map((app) => (
              <div key={app.id} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{app.patientName}</h4>
                    <p className="text-sm text-gray-600">{app.treatmentType}</p>
                  </div>
                  <Badge className={
                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                  }>
                    {app.status.toUpperCase()}
                  </Badge>
                </div>

                {app.status === 'approved' && app.emiPlan && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold text-green-800">✅ Instantly Approved!</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Credit Score:</p>
                        <p className="font-semibold">{app.creditScore}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Processing Time:</p>
                        <p className="font-semibold">{app.processingTime} seconds</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Monthly EMI:</p>
                        <p className="font-semibold">₹{app.emiPlan.monthlyAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Duration:</p>
                        <p className="font-semibold">{app.emiPlan.duration} months</p>
                      </div>
                    </div>
                    <div className="mt-2 p-2 bg-blue-100 rounded text-center">
                      <p className="text-sm font-semibold text-blue-800">
                        🎉 0% Interest for 12 months due to excellent credit score!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAdminWindow = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-purple-600" />
            Admin Portal - Patient Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Registered Patients</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-gray-600">+23 this month</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Credit Approved</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">892</p>
                <p className="text-sm text-gray-600">71.5% approval rate</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold">Total Credit Value</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">₹4.58M</p>
                <p className="text-sm text-gray-600">+₹12.3L this month</p>
              </div>
            </div>

            <div className="border rounded-lg">
              <h3 className="font-semibold p-3 border-b">Recent Registered Patients</h3>
              <div className="divide-y">
                {[
                  { id: 'MCI-1234', name: 'Rahul Sharma', creditScore: 780, registered: '2 hours ago' },
                  { id: 'MCI-1235', name: 'Priya Patel', creditScore: 720, registered: '5 hours ago' },
                  { id: 'MCI-1236', name: 'Amit Kumar', creditScore: 650, registered: '1 day ago' }
                ].map((patient) => (
                  <div key={patient.id} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600">ID: {patient.id}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={patient.creditScore >= 750 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        Score: {patient.creditScore}
                      </Badge>
                      <p className="text-xs text-gray-500">{patient.registered}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏥 Medical Credit Score System - Real-Time Demo
          </h1>
          <p className="text-gray-600">
            Complete fintech platform for instant medical credit approval
          </p>
        </div>

        {/* Window Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setActiveWindow('doctor')}
            className={activeWindow === 'doctor' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Doctor Portal
          </Button>
          <Button
            onClick={() => setActiveWindow('patient')}
            className={activeWindow === 'patient' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}
          >
            <Users className="h-4 w-4 mr-2" />
            Patient Portal
          </Button>
          <Button
            onClick={() => setActiveWindow('admin')}
            className={activeWindow === 'admin' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}
          >
            <Building className="h-4 w-4 mr-2" />
            Admin Portal
          </Button>
        </div>

        {/* Active Window Content */}
        <div className="grid grid-cols-1 gap-8">
          {activeWindow === 'doctor' && renderDoctorWindow()}
          {activeWindow === 'patient' && renderPatientWindow()}
          {activeWindow === 'admin' && renderAdminWindow()}
        </div>

        {/* Demo Instructions */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">🎯 Real-Time Demo Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-800">Step 1: Doctor Portal</h4>
                <p>Doctor finds patient MCI-1234 and issues ₹1,00,000 surgery bill</p>
                <Badge className={demoStep >= 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {demoStep >= 1 ? '✅ Completed' : '⏳ Pending'}
                </Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-800">Step 2: Patient Portal</h4>
                <p>Patient sees bill and clicks "Apply for Medical Credit"</p>
                <Badge className={demoStep >= 2 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {demoStep >= 2 ? '✅ Completed' : '⏳ Pending'}
                </Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-800">Step 3: Credit Engine</h4>
                <p>System reads score (780) and instantly approves 12-month 0% EMI plan</p>
                <Badge className={demoStep >= 3 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {demoStep >= 3 ? '✅ Completed' : '⏳ Pending'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeDemo;
