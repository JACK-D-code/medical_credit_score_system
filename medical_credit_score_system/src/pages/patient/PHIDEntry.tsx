import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  CreditCard,
  User,
  Calendar,
  Activity,
  Heart,
  Award,
  Bell,
  CheckCircle,
  AlertCircle,
  Loader,
  QrCode
} from 'lucide-react';

const PHIDEntry = () => {
  const [phid, setPhid] = useState('');
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState<any>(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Simulate QR code scanning
  const handleScanPHID = () => {
    setIsScanning(true);
    setError('');
    
    // Simulate scanning delay
    setTimeout(() => {
      const demoPHIDs = [
        'PHID-1K4J2A8-XYZ123',
        'PHID-1K4J2B9-ABC456', 
        'PHID-1K4J2C7-DEF789'
      ];
      
      const randomPHID = demoPHIDs[Math.floor(Math.random() * demoPHIDs.length)];
      setPhid(randomPHID);
      setIsScanning(false);
    }, 2000);
  };

  // Load patient data when PHID is entered
  const loadPatientData = async () => {
    if (!phid.trim()) {
      setError('Please enter a valid PHID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call API to get patient data
      const response = await fetch(`/api/phid/lookup/${phid}`);
      const data = await response.json();

      if (data.success) {
        setPatientData(data.patientData);
        // Store PHID in localStorage for session
        localStorage.setItem('currentPHID', phid);
        localStorage.setItem('patientData', JSON.stringify(data.patientData));
        
        // Show success notification
        showNotification('Patient loaded successfully!', 'success');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/patient-dashboard';
        }, 2000);
      } else {
        setError(data.error || 'Failed to load patient data');
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message: string, type: string) => {
    // This would integrate with your notification system
    console.log(`${type}: ${message}`);
  };

  // Handle input change
  const handlePHIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhid(e.target.value.toUpperCase());
    setError('');
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      loadPatientData();
    }
  };

  // Format PHID display
  const formatPHID = (input: string) => {
    if (!input) return '';
    
    // Auto-format PHID pattern: PHID-XXXX-XXXX
    const cleaned = input.replace(/[^A-Z0-9-]/g, '');
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Medical Credit Score System
          </h1>
          <p className="text-lg text-gray-600">
            Enter your Patient Health ID (PHID) to access your account
          </p>
        </div>

        {/* PHID Entry Card */}
        <Card className="mb-8 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <QrCode className="h-6 w-6 text-blue-600" />
              PHID Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* PHID Input */}
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Health ID (PHID)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatPHID(phid)}
                    onChange={(e) => setPhid(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))}
                    onKeyPress={handleKeyPress}
                    placeholder="PHID-XXXX-XXXX-XXXX"
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono"
                    disabled={loading || isScanning}
                  />
                  {isScanning && (
                    <div className="absolute right-3 top-3">
                      <Loader className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Format: PHID-XXXX-XXXX-XXXX
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={loadPatientData}
                  disabled={loading || !phid.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Loading Patient Data...
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      Load Patient Data
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleScanPHID}
                  disabled={isScanning}
                  variant="outline"
                  className="flex-1"
                >
                  {isScanning ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4 mr-2" />
                      Scan QR Code
                    </>
                  )}
                </Button>
              </div>

              {/* Demo PHIDs */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">
                  Demo PHIDs (for testing):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {['PHID-1K4J2A8-XYZ123', 'PHID-1K4J2B9-ABC456', 'PHID-1K4J2C7-DEF789'].map((demoPHID) => (
                    <button
                      key={demoPHID}
                      onClick={() => setPhid(demoPHID)}
                      className="p-2 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      {demoPHID}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Data Preview (when loaded) */}
        {patientData && (
          <Card className="mb-8 shadow-xl border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Patient Data Loaded Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Basic Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Basic Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{patientData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{patientData.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Group:</span>
                      <span className="font-medium">{patientData.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PHID:</span>
                      <span className="font-medium font-mono">{patientData.phid}</span>
                    </div>
                  </div>
                </div>

                {/* Credit Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Credit Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credit Score:</span>
                      <Badge className={getCreditScoreColor(patientData.creditScore)}>
                        {patientData.creditScore}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loyalty Level:</span>
                      <Badge className={getLoyaltyColor(patientData.loyaltyLevel)}>
                        {patientData.loyaltyLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trust Score:</span>
                      <span className="font-medium">{patientData.trustScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adherence:</span>
                      <span className="font-medium">{patientData.adherenceScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Activity Summary */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Activity Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Points:</span>
                      <span className="font-medium text-green-600">{patientData.totalPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Today's Activities:</span>
                      <span className="font-medium">{patientData.todayActivities.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pending Tasks:</span>
                      <span className="font-medium">{patientData.pendingTasks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Today's Appointments:</span>
                      <span className="font-medium">{patientData.todayAppointments}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-green-700">
                  Redirecting to your dashboard in 2 seconds...
                </p>
                <div className="mt-2">
                  <Loader className="h-4 w-4 animate-spin text-green-600 mx-auto" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use PHID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">For Patients:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Enter your PHID in the format: PHID-XXXX-XXXX-XXXX</li>
                  <li>• Click "Load Patient Data" to access your account</li>
                  <li>• Or click "Scan QR Code" to scan your PHID card</li>
                  <li>• Your data will be loaded automatically with all your health information</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Providers:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Create PHIDs for new patients through admin panel</li>
                  <li>• Each PHID contains complete patient health data</li>
                  <li>• PHIDs replace default values with real patient information</li>
                  <li>• All modules update automatically when PHID is entered</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper functions
const getCreditScoreColor = (score: number) => {
  if (score >= 800) return 'bg-green-100 text-green-800';
  if (score >= 750) return 'bg-yellow-100 text-yellow-800';
  if (score >= 650) return 'bg-blue-100 text-blue-800';
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

export default PHIDEntry;
