import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button.tsx';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap,
  Star,
  Users,
  Activity,
  Bell
} from 'lucide-react';
import DemoDataService from '../utils/demo-data.service';

const DemoShowcase = () => {
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [demoData, setDemoData] = useState<any>(null);
  const [activityLog, setActivityLog] = useState<string[]>([]);

  const demoSteps = [
    {
      title: 'Patient Login & Dashboard',
      description: 'Initial state with patient data',
      action: 'Load patient dashboard'
    },
    {
      title: 'Track Morning Medicine',
      description: 'Patient takes morning medicine',
      action: 'Track activity (+5 points)'
    },
    {
      title: 'Complete Morning Walk',
      description: 'Patient completes 30-min walk',
      action: 'Track activity (+8 points)'
    },
    {
      title: 'Complete Health Task',
      description: 'Patient completes BP check task',
      action: 'Complete task (+5 points)'
    },
    {
      title: 'Score Update',
      description: 'Credit score updates based on activities',
      action: 'Calculate new score'
    },
    {
      title: 'Provider Evaluation',
      description: 'Provider submits evaluation with bonus points',
      action: 'Submit evaluation (+25 points)'
    },
    {
      title: 'Final Score Update',
      description: 'Credit score updates with bonus points',
      action: 'Apply bonus points'
    },
    {
      title: 'Book Appointment',
      description: 'Patient books new appointment',
      action: 'Book appointment'
    },
    {
      title: 'Pay EMI',
      description: 'Patient pays monthly EMI',
      action: 'Process payment'
    }
  ];

  useEffect(() => {
    // Load initial demo data
    const data = DemoDataService.getPatientData();
    setDemoData(data);
    addToLog('Demo initialized with patient data');
  }, []);

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setActivityLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const runDemoStep = async (stepIndex: number) => {
    const step = demoSteps[stepIndex];
    if (!step) return;

    addToLog(`🎬 ${step.title}`);
    setCurrentStep(stepIndex);

    switch (stepIndex) {
      case 0:
        // Load patient dashboard
        const data = DemoDataService.getPatientData();
        setDemoData(data);
        addToLog(`📊 Loaded dashboard: Score ${data.creditScore}, Points ${data.totalPoints}`);
        break;

      case 1:
        // Track morning medicine
        const medicineActivity = DemoDataService.trackActivity('MEDICINE', 'Morning Medicine', 5);
        setDemoData(DemoDataService.getPatientData());
        addToLog(`💊 Tracked medicine: +${medicineActivity.pointsEarned} points`);
        break;

      case 2:
        // Complete morning walk
        const walkActivity = DemoDataService.trackActivity('EXERCISE', 'Morning Walk', 8);
        setDemoData(DemoDataService.getPatientData());
        addToLog(`🏃 Completed walk: +${walkActivity.pointsEarned} points`);
        break;

      case 3:
        // Complete health task
        const task = DemoDataService.completeHealthTask('T001');
        setDemoData(DemoDataService.getPatientData());
        if (task) {
          addToLog(`✅ Completed task: +${task.points} points`);
        }
        break;

      case 4:
        // Update credit score
        setDemoData(DemoDataService.getPatientData());
        addToLog(`📈 Credit score updated to ${demoData.creditScore}`);
        break;

      case 5:
        // Provider evaluation
        const evaluation = DemoDataService.submitEvaluation('P001', {
          evaluationType: 'Loyalty Bonus',
          bonusPoints: 25,
          reason: 'Excellent treatment adherence and regular checkups'
        });
        addToLog(`⭐ Provider submitted evaluation: +${evaluation.bonusPoints} bonus points`);
        break;

      case 6:
        // Final score update
        setTimeout(() => {
          setDemoData(DemoDataService.getPatientData());
          addToLog(`🎯 Final score: ${demoData.creditScore} (${demoData.loyaltyLevel} level)`);
        }, 2500);
        break;

      case 7:
        // Book appointment
        const appointment = DemoDataService.bookAppointment({
          providerName: 'Dr. Priya Patel',
          type: 'Follow-up Consultation',
          date: '2024-03-20',
          time: '10:30 AM'
        });
        setDemoData(DemoDataService.getPatientData());
        addToLog(`📅 Booked appointment with ${appointment.providerName}`);
        break;

      case 8:
        // Pay EMI
        const paymentSuccess = DemoDataService.payBill('E001', 12500);
        setDemoData(DemoDataService.getPatientData());
        if (paymentSuccess) {
          addToLog(`💳 EMI payment processed: ₹12,500`);
        }
        break;

      default:
        addToLog('✅ Demo completed!');
        setIsDemoRunning(false);
        break;
    }
  };

  const startAutoDemo = async () => {
    setIsDemoRunning(true);
    addToLog('🚀 Starting automatic demo...');

    for (let i = 0; i < demoSteps.length; i++) {
      if (!isDemoRunning) break;
      
      await runDemoStep(i);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay between steps
    }

    setIsDemoRunning(false);
    addToLog('🎉 Demo completed successfully!');
  };

  const stopDemo = () => {
    setIsDemoRunning(false);
    addToLog('⏹️ Demo stopped');
  };

  const resetDemo = () => {
    setIsDemoRunning(false);
    setCurrentStep(0);
    DemoDataService.resetData();
    setDemoData(DemoDataService.getPatientData());
    setActivityLog([]);
    addToLog('🔄 Demo reset to initial state');
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return 'bg-green-100 text-green-800';
    if (score >= 750) return 'bg-yellow-100 text-yellow-800';
    if (score >= 650) return 'bg-blue-100 text-blue-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎭 Medical Credit Score System - Live Demo
          </h1>
          <p className="text-gray-600">
            Watch real-time patient interactions and system responses
          </p>
        </div>

        {/* Demo Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-600" />
              Demo Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Button
                onClick={startAutoDemo}
                disabled={isDemoRunning}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Auto Demo
              </Button>
              
              <Button
                onClick={stopDemo}
                disabled={!isDemoRunning}
                variant="outline"
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop Demo
              </Button>
              
              <Button
                onClick={resetDemo}
                variant="outline"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Demo
              </Button>

              {isDemoRunning && (
                <Badge className="bg-green-100 text-green-800 animate-pulse">
                  Demo Running...
                </Badge>
              )}
            </div>

            {/* Demo Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoSteps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    currentStep === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : index < currentStep 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                  onClick={() => !isDemoRunning && runDemoStep(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{step.title}</h4>
                    {index < currentStep ? (
                      <Badge className="bg-green-100 text-green-800 text-xs">✓ Done</Badge>
                    ) : currentStep === index ? (
                      <Badge className="bg-blue-100 text-blue-800 text-xs animate-pulse">Running</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 text-xs">{index + 1}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{step.description}</p>
                  <p className="text-xs text-blue-600 mt-1">{step.action}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Live Patient Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Patient Data (Live)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {demoData && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <p className="font-semibold">{demoData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Credit Score</label>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{demoData.creditScore}</span>
                      <Badge className={getCreditScoreColor(demoData.creditScore)}>
                        {demoData.loyaltyLevel}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Total Points</label>
                    <p className="text-xl font-bold text-green-600">{demoData.totalPoints}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Adherence Score</label>
                    <p className="text-xl font-bold text-blue-600">{demoData.adherenceScore}%</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Active EMIs</label>
                    <p className="text-xl font-bold text-purple-600">{demoData.activeEMI}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DemoDataService.getActivities().slice(0, 5).map((activity: any) => (
                  <div key={activity.id} className="p-3 border border-gray-200 rounded-lg bg-green-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-sm">{activity.activityTitle}</h4>
                        <p className="text-xs text-gray-600">{new Date(activity.completedAt).toLocaleTimeString()}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        +{activity.pointsEarned} pts
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DemoDataService.getNotifications().slice(0, 5).map((notification: any) => (
                  <div key={notification.id} className="p-3 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                    <p className="text-xs text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Live Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
              {activityLog.length > 0 ? (
                activityLog.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">
                  Waiting for demo to start...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-600" />
              Demo Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🎯 What This Demo Shows:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Real-time patient activity tracking</li>
                  <li>• Dynamic credit score updates</li>
                  <li>• Provider evaluation impact</li>
                  <li>• Interactive health tasks</li>
                  <li>• Live notification system</li>
                  <li>• Appointment and payment flows</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🚀 How to Use:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Click "Start Auto Demo" for automatic walkthrough</li>
                  <li>• Click individual steps to run them manually</li>
                  <li>• Watch the live data updates</li>
                  <li>• Monitor the activity log for real-time events</li>
                  <li>• Reset demo to try again</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoShowcase;
