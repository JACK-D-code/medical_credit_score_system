import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  User, 
  Star, 
  Award,
  TrendingUp,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  ThumbsUp,
  Heart,
  Calendar,
  FileText,
  Plus,
  Send,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const ProviderEvaluation = () => {
  const [patients, setPatients] = useState([
    {
      id: 'P001',
      name: 'Rahul Sharma',
      age: 34,
      creditScore: 780,
      loyaltyLevel: 'Gold',
      lastVisit: '2024-03-15',
      totalVisits: 12,
      adherenceScore: 95,
      paymentHistory: 'Excellent',
      trustScore: 85,
      treatmentHistory: 'Cardiac Catheterization, Regular Checkups',
      insuranceStatus: 'Active',
      nextAppointment: '2024-03-20'
    },
    {
      id: 'P002',
      name: 'Priya Patel',
      age: 28,
      creditScore: 720,
      loyaltyLevel: 'Silver',
      lastVisit: '2024-03-14',
      totalVisits: 8,
      adherenceScore: 88,
      paymentHistory: 'Good',
      trustScore: 78,
      treatmentHistory: 'Dental Implant, Cleaning',
      insuranceStatus: 'Active',
      nextAppointment: '2024-03-18'
    },
    {
      id: 'P003',
      name: 'Amit Kumar',
      age: 45,
      creditScore: 650,
      loyaltyLevel: 'Bronze',
      lastVisit: '2024-03-08',
      totalVisits: 6,
      adherenceScore: 72,
      paymentHistory: 'Average',
      trustScore: 65,
      treatmentHistory: 'MRI Scan, Consultation',
      insuranceStatus: 'Active',
      nextAppointment: '2024-03-25'
    },
    {
      id: 'P004',
      name: 'Sunita Reddy',
      age: 52,
      creditScore: 820,
      loyaltyLevel: 'Platinum',
      lastVisit: '2024-03-12',
      totalVisits: 18,
      adherenceScore: 98,
      paymentHistory: 'Excellent',
      trustScore: 92,
      treatmentHistory: 'Diabetes Management, Eye Checkup',
      insuranceStatus: 'Premium',
      nextAppointment: '2024-03-22'
    }
  ]);

  const [evaluations, setEvaluations] = useState([
    {
      id: 'E001',
      patientId: 'P001',
      patientName: 'Rahul Sharma',
      evaluationType: 'Loyalty Bonus',
      bonusPoints: 50,
      reason: 'Regular hospital visits for 12 months consistently',
      comments: 'Excellent patient adherence and payment history',
      providerName: 'Dr. Priya Patel',
      date: '2024-03-15',
      status: 'Approved',
      approvedBy: 'Dr. Admin',
      approvedAt: '2024-03-15 14:30:00'
    },
    {
      id: 'E002',
      patientId: 'P004',
      patientName: 'Sunita Reddy',
      evaluationType: 'Trust Recognition',
      bonusPoints: 75,
      reason: 'Outstanding treatment compliance and trust building',
      comments: 'Exceptional patient with highest trust score',
      providerName: 'Dr. Amit Kumar',
      date: '2024-03-12',
      status: 'Approved',
      approvedBy: 'Dr. Admin',
      approvedAt: '2024-03-12 16:45:00'
    },
    {
      id: 'E003',
      patientId: 'P002',
      patientName: 'Priya Patel',
      evaluationType: 'Treatment Adherence',
      bonusPoints: 40,
      reason: 'Consistent medication adherence and follow-up visits',
      comments: 'Good compliance with treatment plan',
      providerName: 'Dr. Priya Patel',
      date: '2024-03-14',
      status: 'Pending',
      approvedBy: null,
      approvedAt: null
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [evaluationForm, setEvaluationForm] = useState({
    evaluationType: 'Loyalty Bonus',
    bonusPoints: 25,
    reason: '',
    comments: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  const evaluationTypes = [
    { value: 'Loyalty Bonus', label: 'Loyalty Bonus', maxPoints: 50, description: 'Regular visits and long-term relationship' },
    { value: 'Trust Recognition', label: 'Trust Recognition', maxPoints: 75, description: 'Building trust and rapport' },
    { value: 'Treatment Adherence', label: 'Treatment Adherence', maxPoints: 40, description: 'Following treatment plans consistently' },
    { value: 'Emergency Response', label: 'Emergency Response', maxPoints: 60, description: 'Quick response to emergency situations' },
    { value: 'Referral Bonus', label: 'Referral Bonus', maxPoints: 30, description: 'Referring new patients to the hospital' },
    { value: 'Special Recognition', label: 'Special Recognition', maxPoints: 100, description: 'Exceptional circumstances or contributions' }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prev => prev.map(patient => ({
        ...patient,
        trustScore: Math.min(100, patient.trustScore + Math.floor(Math.random() * 2))
      })));
    }, 12000);

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

  const getPaymentHistoryColor = (history: string) => {
    switch (history) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Average': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEvaluationStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLevel === 'all' || patient.loyaltyLevel.toLowerCase() === filterLevel.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleEvaluatePatient = (patient: any) => {
    setSelectedPatient(patient);
    setEvaluationForm({
      evaluationType: 'Loyalty Bonus',
      bonusPoints: 25,
      reason: '',
      comments: ''
    });
    setShowEvaluationModal(true);
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedPatient || !evaluationForm.reason) return;

    // Simulate API call
    const newEvaluation = {
      id: `E${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      evaluationType: evaluationForm.evaluationType,
      bonusPoints: evaluationForm.bonusPoints,
      reason: evaluationForm.reason,
      comments: evaluationForm.comments,
      providerName: 'Dr. Current Provider',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      approvedBy: null,
      approvedAt: null
    };

    setEvaluations([newEvaluation, ...evaluations]);
    
    // Update patient credit score
    setPatients(prev => prev.map(p => 
      p.id === selectedPatient.id 
        ? { ...p, creditScore: Math.min(850, p.creditScore + evaluationForm.bonusPoints) }
        : p
    ));

    // Reset form
    setShowEvaluationModal(false);
    setSelectedPatient(null);
    setEvaluationForm({
      evaluationType: 'Loyalty Bonus',
      bonusPoints: 25,
      reason: '',
      comments: ''
    });
  };

  const renderPatientList = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Patient Evaluation List
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="platinum">Platinum</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
        </div>

        {/* Patient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{patient.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">Age: {patient.age}</span>
                      <Badge className={getLoyaltyColor(patient.loyaltyLevel)}>
                        {patient.loyaltyLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{patient.creditScore}</div>
                    <div className="text-xs text-gray-500">Credit Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">Trust Score:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{patient.trustScore}</span>
                      <Star className="h-3 w-3 text-yellow-500" />
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Adherence:</span>
                    <div className="font-medium">{patient.adherenceScore}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Visits:</span>
                    <div className="font-medium">{patient.totalVisits}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment:</span>
                    <Badge className={getPaymentHistoryColor(patient.paymentHistory)}>
                      {patient.paymentHistory}
                    </Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-gray-600 text-sm">Treatment History:</span>
                  <p className="text-sm text-gray-800 mt-1">{patient.treatmentHistory}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Last visit: {patient.lastVisit} | Next: {patient.nextAppointment}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleEvaluatePatient(patient)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Award className="h-3 w-3 mr-1" />
                    Evaluate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderEvaluationModal = () => {
    if (!showEvaluationModal || !selectedPatient) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Evaluate Patient: {selectedPatient.name}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEvaluationModal(false)}
            >
              ×
            </Button>
          </div>

          {/* Patient Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{selectedPatient.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">Credit Score: {selectedPatient.creditScore}</span>
                  <Badge className={getLoyaltyColor(selectedPatient.loyaltyLevel)}>
                    {selectedPatient.loyaltyLevel}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{selectedPatient.trustScore}</div>
                <div className="text-xs text-gray-500">Trust Score</div>
              </div>
            </div>
          </div>

          {/* Evaluation Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Evaluation Type
              </label>
              <select
                value={evaluationForm.evaluationType}
                onChange={(e) => setEvaluationForm({
                  ...evaluationForm,
                  evaluationType: e.target.value,
                  bonusPoints: evaluationTypes.find(t => t.value === e.target.value)?.maxPoints || 25
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {evaluationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} (Max: {type.maxPoints} points)
                  </option>
                ))}
              </select>
              {evaluationTypes.find(t => t.value === evaluationForm.evaluationType)?.description && (
                <p className="text-xs text-gray-600 mt-1">
                  {evaluationTypes.find(t => t.value === evaluationForm.evaluationType)?.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bonus Points
              </label>
              <input
                type="number"
                min="1"
                max={evaluationTypes.find(t => t.value === evaluationForm.evaluationType)?.maxPoints || 100}
                value={evaluationForm.bonusPoints}
                onChange={(e) => setEvaluationForm({
                  ...evaluationForm,
                  bonusPoints: parseInt(e.target.value)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Evaluation *
              </label>
              <textarea
                value={evaluationForm.reason}
                onChange={(e) => setEvaluationForm({
                  ...evaluationForm,
                  reason: e.target.value
                })}
                rows={3}
                placeholder="Explain why this patient deserves bonus points..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Comments
              </label>
              <textarea
                value={evaluationForm.comments}
                onChange={(e) => setEvaluationForm({
                  ...evaluationForm,
                  comments: e.target.value
                })}
                rows={2}
                placeholder="Any additional notes or observations..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleSubmitEvaluation}
              disabled={!evaluationForm.reason}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Evaluation
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowEvaluationModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderRecentEvaluations = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" />
          Recent Evaluations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {evaluations.map((evaluation) => (
            <div key={evaluation.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{evaluation.patientName}</h4>
                    <Badge className={getEvaluationStatusColor(evaluation.status)}>
                      {evaluation.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <div className="font-medium">{evaluation.evaluationType}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Points:</span>
                      <div className="font-medium text-green-600">+{evaluation.bonusPoints}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Provider:</span>
                      <div className="font-medium">{evaluation.providerName}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <div className="font-medium">{evaluation.date}</div>
                    </div>
                  </div>
                  {evaluation.reason && (
                    <div className="mt-2">
                      <span className="text-gray-600 text-sm">Reason:</span>
                      <p className="text-sm text-gray-800 mt-1">{evaluation.reason}</p>
                    </div>
                  )}
                  {evaluation.comments && (
                    <div className="mt-2">
                      <span className="text-gray-600 text-sm">Comments:</span>
                      <p className="text-sm text-gray-800 mt-1">{evaluation.comments}</p>
                    </div>
                  )}
                  {evaluation.approvedBy && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          Approved by {evaluation.approvedBy} on {evaluation.approvedAt}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Provider Evaluation</h1>
          <p className="text-gray-600 mt-2">Evaluate patients and grant bonus credit points</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{patients.length}</div>
                  <div className="text-sm text-gray-600">Total Patients</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{evaluations.length}</div>
                  <div className="text-sm text-gray-600">Evaluations</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {evaluations.reduce((sum, e) => sum + e.bonusPoints, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Points Awarded</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">85%</div>
                  <div className="text-sm text-gray-600">Avg Trust Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {renderPatientList()}
          </div>
          <div className="space-y-6">
            {renderRecentEvaluations()}
          </div>
        </div>

        {/* Evaluation Modal */}
        {renderEvaluationModal()}
      </div>
    </div>
  );
};

export default ProviderEvaluation;
