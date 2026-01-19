import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import SessionSecurityHeader from '../../components/ui/SessionSecurityHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import PersonalInfoSection from './components/PersonalInfoSection';
import ContactInfoSection from './components/ContactInfoSection';
import SecuritySettingsSection from './components/SecuritySettingsSection';
import DocumentUploadSection from './components/DocumentUploadSection';
import ActivityTimelineSection from './components/ActivityTimelineSection';
import DataPrivacySection from './components/DataPrivacySection';

const ProfileManagement = () => {
  const [userData, setUserData] = useState({
    fullName: "Rajesh Kumar Sharma",
    aadhaarId: "2345 6789 0123",
    dateOfBirth: "1985-06-15",
    gender: "Male"
  });

  const [contactData, setContactData] = useState({
    mobileNumber: "9876543210",
    email: "rajesh.sharma@email.com",
    address: "Flat 301, Sunrise Apartments, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  });

  const [securityData, setSecurityData] = useState({
    mfaEnabled: true,
    lastPasswordChange: "2026-01-04T10:30:00"
  });

  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: 'aadhaar',
      name: 'Aadhaar_Card_Front.pdf',
      uploadDate: '2026-01-10T14:20:00',
      status: 'verified'
    },
    {
      id: 2,
      type: 'pan',
      name: 'PAN_Card.pdf',
      uploadDate: '2026-01-12T09:15:00',
      status: 'pending'
    }
  ]);

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'profile_update',
      title: 'Profile Information Updated',
      description: 'Contact information was successfully updated',
      timestamp: new Date(Date.now() - 3600000)?.toISOString(),
      metadata: {
        device: 'Desktop',
        location: 'Mumbai, Maharashtra'
      }
    },
    {
      id: 2,
      type: 'login',
      title: 'Successful Login',
      description: 'Account accessed from new device',
      timestamp: new Date(Date.now() - 7200000)?.toISOString(),
      metadata: {
        device: 'Mobile',
        location: 'Mumbai, Maharashtra'
      }
    },
    {
      id: 3,
      type: 'security',
      title: 'Two-Factor Authentication Enabled',
      description: 'Additional security layer activated for your account',
      timestamp: new Date(Date.now() - 86400000)?.toISOString(),
      metadata: {
        device: 'Desktop',
        location: 'Mumbai, Maharashtra'
      }
    },
    {
      id: 4,
      type: 'document',
      title: 'Document Uploaded',
      description: 'PAN Card document submitted for verification',
      timestamp: new Date(Date.now() - 172800000)?.toISOString(),
      metadata: {
        device: 'Mobile',
        location: 'Mumbai, Maharashtra'
      }
    },
    {
      id: 5,
      type: 'document',
      title: 'Document Verified',
      description: 'Aadhaar Card verification completed successfully',
      timestamp: new Date(Date.now() - 259200000)?.toISOString(),
      metadata: {
        device: 'System',
        location: 'Automated Process'
      }
    }
  ]);

  const [privacySettings, setPrivacySettings] = useState({
    shareWithHospitals: true,
    shareWithFinancial: true,
    marketingEmails: false,
    dataAnalytics: true
  });

  const [notifications] = useState([
    {
      id: 1,
      type: 'security',
      title: 'Security Alert',
      message: 'Your password will expire in 15 days. Please update it.',
      timestamp: new Date(Date.now() - 1800000)?.toISOString(),
      read: false
    },
    {
      id: 2,
      type: 'eligibility',
      title: 'Document Verification',
      message: 'Your PAN Card is under review. Verification typically takes 24-48 hours.',
      timestamp: new Date(Date.now() - 3600000)?.toISOString(),
      read: false
    },
    {
      id: 3,
      type: 'system',
      title: 'Profile Updated',
      message: 'Your contact information has been successfully updated.',
      timestamp: new Date(Date.now() - 7200000)?.toISOString(),
      read: true
    }
  ]);

  const creditScore = 785;
  const creditTrend = 'up';

  const handlePersonalInfoSave = (data) => {
    setUserData(data);
    const newActivity = {
      id: activities?.length + 1,
      type: 'profile_update',
      title: 'Personal Information Updated',
      description: 'Personal details were successfully modified',
      timestamp: new Date()?.toISOString(),
      metadata: {
        device: 'Desktop',
        location: 'Mumbai, Maharashtra'
      }
    };
    setActivities([newActivity, ...activities]);
  };

  const handleContactInfoSave = (data) => {
    setContactData(data);
    const newActivity = {
      id: activities?.length + 1,
      type: 'profile_update',
      title: 'Contact Information Updated',
      description: 'Contact details were successfully modified',
      timestamp: new Date()?.toISOString(),
      metadata: {
        device: 'Desktop',
        location: 'Mumbai, Maharashtra'
      }
    };
    setActivities([newActivity, ...activities]);
  };

  const handleSecuritySave = (data) => {
    if (data?.type === 'password') {
      setSecurityData({
        ...securityData,
        lastPasswordChange: new Date()?.toISOString()
      });
      const newActivity = {
        id: activities?.length + 1,
        type: 'security',
        title: 'Password Changed',
        description: 'Account password was successfully updated',
        timestamp: new Date()?.toISOString(),
        metadata: {
          device: 'Desktop',
          location: 'Mumbai, Maharashtra'
        }
      };
      setActivities([newActivity, ...activities]);
    } else if (data?.type === 'mfa') {
      setSecurityData({
        ...securityData,
        mfaEnabled: data?.data?.enabled
      });
      const newActivity = {
        id: activities?.length + 1,
        type: 'security',
        title: data?.data?.enabled ? 'Two-Factor Authentication Enabled' : 'Two-Factor Authentication Disabled',
        description: `Two-factor authentication was ${data?.data?.enabled ? 'activated' : 'deactivated'} for your account`,
        timestamp: new Date()?.toISOString(),
        metadata: {
          device: 'Desktop',
          location: 'Mumbai, Maharashtra'
        }
      };
      setActivities([newActivity, ...activities]);
    }
  };

  const handleDocumentUpload = (docs) => {
    setDocuments(docs);
    const latestDoc = docs?.[docs?.length - 1];
    if (latestDoc) {
      const newActivity = {
        id: activities?.length + 1,
        type: 'document',
        title: 'Document Uploaded',
        description: `${latestDoc?.name} submitted for verification`,
        timestamp: new Date()?.toISOString(),
        metadata: {
          device: 'Desktop',
          location: 'Mumbai, Maharashtra'
        }
      };
      setActivities([newActivity, ...activities]);
    }
  };

  const handlePrivacySave = (settings) => {
    setPrivacySettings(settings);
    const newActivity = {
      id: activities?.length + 1,
      type: 'profile_update',
      title: 'Privacy Settings Updated',
      description: 'Data sharing preferences were modified',
      timestamp: new Date()?.toISOString(),
      metadata: {
        device: 'Desktop',
        location: 'Mumbai, Maharashtra'
      }
    };
    setActivities([newActivity, ...activities]);
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  return (
    <>
      <Helmet>
        <title>Profile Management - MediCredit India</title>
        <meta name="description" content="Manage your personal information, security settings, and privacy preferences for your MediCredit India account" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <SessionSecurityHeader onLogout={handleLogout} />
        <Header />
        <QuickActionsToolbar userRole="patient" />

        <main className="mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12 pb-24 lg:pb-12">
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

            <ContactInfoSection 
              contactData={contactData} 
              onSave={handleContactInfoSave} 
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
          </div>
        </main>

        <MobileBottomNav creditScore={creditScore} creditTrend={creditTrend} />
      </div>
    </>
  );
};

export default ProfileManagement;