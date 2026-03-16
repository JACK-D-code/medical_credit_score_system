import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import MedicalCreditScoreSystem from '../../services/MedicalCreditScoreSystem';
import { 
  User, 
  FileText, 
  Upload,
  Heart,
  Download,
  Save,
  X,
  Edit2,
  Shield,
  CreditCard,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Droplet,
  Calendar,
  Wallet
} from 'lucide-react';

const ProfileManagementIntegrated = () => {
  const [mcs] = useState(() => MedicalCreditScoreSystem.getInstance());
  const [patientData, setPatientData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [editData, setEditData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const data = mcs.getPatientData();
      setPatientData(data);
      setEditData(data);
      setDocuments(mcs.getDocuments());
      setLoading(false);
    };

    loadData();

    const unsubscribe = mcs.on('patientDataUpdated', () => {
      setPatientData(mcs.getPatientData());
      setEditData(mcs.getPatientData());
    });

    return () => unsubscribe();
  }, [mcs]);

  const handleEdit = () => {
    setEditData({ ...patientData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData(patientData);
    setIsEditing(false);
  };

  const handleSave = () => {
    mcs.updatePatientData(editData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const newDoc = {
      fileName: file.name,
      fileType: file.type.split('/')[1]?.toUpperCase() || 'FILE',
      status: 'PENDING'
    };

    const result = mcs.addDocument(newDoc);
    setDocuments(mcs.getDocuments());
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-400';
    if (score >= 700) return 'text-blue-400';
    if (score >= 600) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 800) return { label: 'Excellent', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (score >= 700) return { label: 'Good', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (score >= 600) return { label: 'Fair', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return { label: 'Poor', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const scoreBadge = getScoreBadge(patientData?.creditScore || 750);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Save Success Notification */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div>
                <div className="font-bold text-green-400">Profile Updated!</div>
                <div className="text-sm text-green-300">Your changes have been saved</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Management</h1>
          <p className="text-slate-400">
            Manage your personal information • PHID: <span className="text-cyan-400 font-mono">{patientData?.phid}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-cyan-400" />
                  Personal Information
                </CardTitle>
                {!isEditing && (
                  <Button 
                    onClick={handleEdit}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-cyan-500/30"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData?.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <User className="h-5 w-5 text-slate-400" />
                        <span className="text-white font-medium">{patientData?.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData?.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <Mail className="h-5 w-5 text-slate-400" />
                        <span className="text-white">{patientData?.email || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData?.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <Phone className="h-5 w-5 text-slate-400" />
                        <span className="text-white">{patientData?.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Age</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData?.age || ''}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <Calendar className="h-5 w-5 text-slate-400" />
                        <span className="text-white">{patientData?.age} years</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Blood Group</label>
                    {isEditing ? (
                      <select
                        value={editData?.bloodGroup || ''}
                        onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <Droplet className="h-5 w-5 text-red-400" />
                        <span className="text-white">{patientData?.bloodGroup || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Monthly Income</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData?.monthlyIncome || ''}
                        onChange={(e) => handleInputChange('monthlyIncome', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <Wallet className="h-5 w-5 text-green-400" />
                        <span className="text-white">₹{patientData?.monthlyIncome?.toLocaleString() || 0}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700">
                  <Button 
                    onClick={handleSave}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button 
                    onClick={handleCancel}
                    variant="outline"
                    className="border-slate-600 text-slate-400"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Metrics */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Heart className="h-5 w-5 text-red-400" />
                Health Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Credit Score</span>
                    <Badge className={scoreBadge.color}>
                      {scoreBadge.label}
                    </Badge>
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(patientData?.creditScore || 750)}`}>
                    {patientData?.creditScore || 750}
                  </div>
                  <div className="text-slate-400 text-xs mt-1">Out of 1000</div>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Trust Score</span>
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {patientData?.trustScore}%
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${patientData?.trustScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Adherence Score</span>
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {patientData?.adherenceScore}%
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${patientData?.adherenceScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Loyalty Level</span>
                    <Award className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {patientData?.loyaltyLevel}
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    Total Points: {patientData?.totalPoints?.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Documents */}
        <Card className="mt-6 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5 text-green-400" />
              Medical Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Upload Section */}
              <div className="md:col-span-1">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-cyan-500/50 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-300 font-medium mb-1">Upload Documents</p>
                    <p className="text-slate-500 text-sm">PDF, JPG, PNG up to 10MB</p>
                  </label>
                </div>
              </div>

              {/* Documents List */}
              <div className="md:col-span-2">
                <div className="space-y-3">
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{doc.fileName}</p>
                            <p className="text-slate-400 text-sm">{doc.fileType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            doc.status === 'VERIFIED' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }>
                            {doc.status}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-slate-600 text-slate-400"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteDocument(doc.id)}
                            className="border-slate-600 text-red-400 hover:bg-red-500/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No documents uploaded yet</p>
                      <p className="text-sm">Upload your medical reports and prescriptions</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PHID Information */}
        <Card className="mt-6 bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                <Shield className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Patient Health ID (PHID)</h3>
                <p className="text-cyan-400 font-mono text-lg">{patientData?.phid}</p>
                <p className="text-slate-400 text-sm mt-1">
                  Your unique health identifier across all medical services
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileManagementIntegrated;
