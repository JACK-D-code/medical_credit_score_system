import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import NotificationCenter from '../../components/ui/NotificationCenter';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import PersonalInfoSection from './components/PersonalInfoSection';
import ContactInfoSection from './components/ContactInfoSection';
import MedicalInfoSection from './components/MedicalInfoSection';
import SecuritySettingsSection from './components/SecuritySettingsSection';
import DocumentUploadSection from './components/DocumentUploadSection';
import ActivityTimelineSection from './components/ActivityTimelineSection';
import DataPrivacySection from './components/DataPrivacySection';
import PHIDEntrySection from './components/PHIDEntrySection';
import api from '../../lib/api';
import { io } from 'socket.io-client';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ProfileManagement = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [userData, setUserData] = useState({ fullName: '', aadhaarId: '', dateOfBirth: '', gender: '' });
  const [contactData, setContactData] = useState({ mobileNumber: '', email: '', address: '', city: '', state: '', pincode: '' });
  const [medicalData, setMedicalData] = useState({ medicalHistory: '', allergies: '', chronicConditions: '' });
  const [securityData, setSecurityData] = useState({ mfaEnabled: false, lastPasswordChange: '' });
  const [documents, setDocuments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [privacySettings, setPrivacySettings] = useState({ shareWithHospitals: true, shareWithFinancial: true, marketingEmails: false, dataAnalytics: true });
  const [notifications, setNotifications] = useState([]);

  const [creditScore, setCreditScore] = useState(785);
  const [creditTrend, setCreditTrend] = useState('up');

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      const data = response.data;
      setUserData(data.personalInfo);
      setContactData(data.contactInfo);
      setMedicalData(data.medicalInfo || { medicalHistory: '', allergies: '', chronicConditions: '' });
      setSecurityData(data.securityInfo);
      setPrivacySettings(data.privacySettings);
      setDocuments(data.documents || []);
      setActivities(data.activities || []);
      setNotifications(data.notifications || []);

      if (data.creditScore) {
        setCreditScore(data.creditScore);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const phid = user?.phid;

    if (phid) {
        const socket = io('http://localhost:5000', {
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log('[socket] Profile Management Connected to Live Engine');
            socket.emit('join_phid_room', phid);
        });

        socket.on('scoreUpdated', () => {
            console.log("Real-time Score Update Received in Profile Management");
            fetchProfile();
        });

        return () => {
            socket.disconnect();
        };
    }
  }, []);

  const handlePersonalInfoSave = async (data) => {
    try {
      await api.put('/profile/personal', data);
      await fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleContactInfoSave = async (data) => {
    try {
      await api.put('/profile/contact', data);
      await fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMedicalInfoSave = async (data) => {
    try {
      await api.put('/profile/medical', data);
      await fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSecuritySave = async (data) => {
    try {
      const payload = {
        type: data.type,
        mfaEnabled: data.data?.enabled
      };
      await api.put('/profile/security', payload);
      await fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDocumentUpload = async (docs) => {
    // When docs are uploaded, the credit score might have updated on backend
    // Refetch the entire profile to correctly display new score and activities
    await fetchProfile();
  };

  const handlePrivacySave = async (settings) => {
    try {
      await api.put('/profile/privacy', settings);
      await fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/patient-login');
  };

  return (
    <>
      <Helmet>
        <title>Profile Management - MediCredit India</title>
        <meta name="description" content="Manage your personal information, security settings, and privacy preferences for your MediCredit India account" />
      </Helmet>

      {isLoading ? (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="min-h-screen bg-background">
          <Header onLogout={handleLogout} />
          <QuickActionsToolbar userRole="patient" />

          <main className="mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-24 lg:pb-12">
            <div className="mb-6 md:mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                    Profile Management
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Update your personal information and account settings
                  </p>
                </div>
                <div className="hidden lg:block">
                  <NotificationCenter notifications={notifications} />
                </div>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <PersonalInfoSection
                userData={userData}
                onSave={handlePersonalInfoSave}
              />

              <PHIDEntrySection 
                currentPhid={JSON.parse(localStorage.getItem('user') || '{}')?.phid}
                onLinked={(newPhid) => {
                  fetchProfile();
                  window.location.reload(); 
                }}
              />

              <ContactInfoSection
                contactData={contactData}
                onSave={handleContactInfoSave}
              />

              <MedicalInfoSection
                medicalData={medicalData}
                onSave={handleMedicalInfoSave}
              />

              <SecuritySettingsSection
                securityData={securityData}
                onSave={handleSecuritySave}
              />

              <DocumentUploadSection
                documents={documents}
                onUpload={handleDocumentUpload}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <ActivityTimelineSection activities={activities} />
                <DataPrivacySection
                  privacySettings={privacySettings}
                  onSave={handlePrivacySave}
                />
              </div>

              {/* Danger Zone / Logout Section */}
              <div className="pt-6 border-t border-border">
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
                      <Icon name="LogOut" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-foreground">Sign Out</h3>
                      <p className="text-sm text-muted-foreground">Log out of your account and clear your current session securely.</p>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    className="w-full md:w-auto px-8"
                    onClick={handleLogout}
                    iconName="LogOut"
                  >
                    Logout from Medicredit
                  </Button>
                </div>
              </div>
            </div>
          </main>

          <MobileBottomNav creditScore={creditScore} creditTrend={creditTrend} />
        </div>
      )}
    </>
  );
};

export default ProfileManagement;