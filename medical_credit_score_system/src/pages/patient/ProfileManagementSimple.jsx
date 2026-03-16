import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import SessionSecurityHeader from '../../components/ui/SessionSecurityHeader';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import { Card } from '../../components/ui/card';
import Button from '../../components/ui/Button';
import { 
  User, 
  FileText, 
  Upload,
  Heart,
  Download,
  Save,
  X,
  Edit2
} from 'lucide-react';

const ProfileManagement = () => {
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const loadProfileData = () => {
      try {
        setLoading(true);
        
        // Get patient data from PHID system
        const savedPHID = localStorage.getItem('currentPHID');
        const savedData = localStorage.getItem('patientData');
        
        if (savedPHID && savedData) {
          const patientInfo = JSON.parse(savedData);
          setProfileData(patientInfo);
          setEditData(patientInfo);
          
          // Mock documents data
          setDocuments([
            {
              id: '1',
              fileName: 'Medical Report.pdf',
              fileType: 'PDF',
              status: 'VERIFIED',
              uploadedAt: new Date().toISOString()
            },
            {
              id: '2',
              fileName: 'Lab Results.jpg',
              fileType: 'JPG',
              status: 'PENDING',
              uploadedAt: new Date().toISOString()
            }
          ]);
        } else {
          setProfileData(null);
          setEditData(null);
          setDocuments([]);
        }

      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleEdit = () => {
    setEditData({ ...profileData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleSave = () => {
    try {
      setLoading(true);
      
      // Update localStorage with new data
      const updatedProfile = { ...editData };
      setProfileData(updatedProfile);
      setEditData(updatedProfile);
      setIsEditing(false);
      
      // Update localStorage
      localStorage.setItem('patientData', JSON.stringify(updatedProfile));
      
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      
      // Simulate document upload
      const newDoc = {
        id: Date.now().toString(),
        fileName: file.name,
        fileType: file.type.split('/')[1]?.toUpperCase() || 'FILE',
        status: 'PENDING',
        uploadedAt: new Date().toISOString()
      };
      
      setDocuments(prev => [newDoc, ...prev]);
      
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = (docId) => {
    try {
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <SessionSecurityHeader />
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading profile...</span>
            </div>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <SessionSecurityHeader />
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
              <p className="text-gray-600 mb-4">Please enter your PHID to access your profile.</p>
              <Button onClick={() => window.location.href = '/phid-entry'} className="mt-4">
                Enter PHID
              </Button>
            </div>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SessionSecurityHeader />
      <div className="flex">
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
            {profileData && (
              <p className="text-gray-600">
                Manage your personal and medical information • PHID: {profileData.phid}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Personal Information
                  </h3>
                  {!isEditing && (
                    <Button size="sm" onClick={handleEdit}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.email || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    {isEditing ? (
                      <select
                        value={editData.bloodGroup || ''}
                        onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      <p className="text-gray-900">{profileData.bloodGroup || 'Not provided'}</p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSave} disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Health Metrics */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-red-600" />
                  Health Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Credit Score</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {profileData.creditScore || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Trust Score</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {profileData.trustScore || 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Adherence Score</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {profileData.adherenceScore || 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Loyalty Level</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      {profileData.loyaltyLevel || 'Bronze'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Points</span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                      {profileData.totalPoints || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Medical Documents */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-green-600" />
                  Medical Documents
                </h3>
                <div className="space-y-4">
                  {/* Upload Button */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload medical documents</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                    </label>
                  </div>

                  {/* Documents List */}
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{doc.fileName}</p>
                            <p className="text-xs text-gray-500">{doc.fileType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            doc.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {doc.status}
                          </span>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteDocument(doc.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {documents.length === 0 && (
                    <div className="text-center py-4">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No documents uploaded yet</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default ProfileManagement;
