import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import NotificationCenter from '../../components/ui/NotificationCenter';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import Icon from '../../components/AppIcon';
import ProfileSettingsTab from './components/ProfileSettingsTab';
import SecuritySettingsTab from './components/SecuritySettingsTab';
import PrivacySettingsTab from './components/PrivacySettingsTab';
import NotificationSettingsTab from './components/NotificationSettingsTab';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    fullName: "Rajesh Kumar Sharma",
    email: "stevesjc66@gmail.com",
    mobileNumber: "9489330190",
    aadhaarId: "2345 6789 0123",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    address: "Flat 301, Sunrise Apartments, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  });

  const [securitySettings, setSecuritySettings] = useState({
    mfaEnabled: true,
    lastPasswordChange: "2026-01-04T10:30:00",
    sessionTimeout: 30,
    loginAlerts: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareWithHospitals: true,
    shareWithFinancial: true,
    marketingEmails: false,
    dataAnalytics: true,
    profileVisibility: 'private'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      scoreUpdates: true,
      billingAlerts: true,
      securityAlerts: true,
      promotions: false
    },
    smsNotifications: {
      scoreUpdates: false,
      billingAlerts: true,
      securityAlerts: true,
      promotions: false
    },
    pushNotifications: {
      scoreUpdates: true,
      billingAlerts: true,
      securityAlerts: true,
      promotions: false
    }
  });

  const [notifications] = useState([
    {
      id: 1,
      type: 'security',
      title: 'Settings Updated',
      message: 'Your account settings have been successfully saved.',
      timestamp: new Date(Date.now() - 1800000)?.toISOString(),
      read: false
    }
  ]);

  const creditScore = 785;
  const creditTrend = 'up';

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: 'User' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'privacy', label: 'Privacy', icon: 'Lock' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' }
  ];

  const handleProfileSave = (data) => {
    setUserData(data);
  };

  const handleSecuritySave = (data) => {
    setSecuritySettings(data);
  };

  const handlePrivacySave = (data) => {
    setPrivacySettings(data);
  };

  const handleNotificationSave = (data) => {
    setNotificationSettings(data);
  };

  return (
    <>
      <Helmet>
        <title>Account Settings - MediCredit System</title>
        <meta
          name="description"
          content="Manage your MediCredit account settings, security preferences, privacy controls, and notification settings."
        />
      </Helmet>

      <Header onLogout={() => navigate('/patient-login')} />
      <NotificationCenter notifications={notifications} />
      <QuickActionsToolbar />

      <main className="min-h-screen bg-background pb-20 lg:pb-8">
        <div className="mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-24 lg:pb-12">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Settings" size={28} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
                  Account Settings
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Manage your profile, security, privacy, and notification preferences
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-elevation-2 overflow-hidden">
            <div className="border-b border-border overflow-x-auto">
              <div className="flex space-x-1 p-2 min-w-max">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-3 rounded-md
                      transition-smooth press-scale font-caption font-medium
                      ${activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground shadow-elevation-1'
                        : 'text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <Icon
                      name={tab?.icon}
                      size={18}
                      color={activeTab === tab?.id ? 'var(--color-primary-foreground)' : 'currentColor'}
                    />
                    <span className="whitespace-nowrap">{tab?.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 md:p-6 lg:p-8">
              {activeTab === 'profile' && (
                <ProfileSettingsTab
                  userData={userData}
                  onSave={handleProfileSave}
                />
              )}
              {activeTab === 'security' && (
                <SecuritySettingsTab
                  securitySettings={securitySettings}
                  onSave={handleSecuritySave}
                />
              )}
              {activeTab === 'privacy' && (
                <PrivacySettingsTab
                  privacySettings={privacySettings}
                  onSave={handlePrivacySave}
                />
              )}
              {activeTab === 'notifications' && (
                <NotificationSettingsTab
                  notificationSettings={notificationSettings}
                  onSave={handleNotificationSave}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav creditScore={creditScore} creditTrend={creditTrend} />
    </>
  );
};

export default AccountSettings;