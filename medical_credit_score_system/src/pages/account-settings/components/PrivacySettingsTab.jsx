import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PrivacySettingsTab = ({ privacySettings, onSave }) => {
  const [settings, setSettings] = useState({
    shareWithHospitals: privacySettings?.shareWithHospitals ?? true,
    shareWithFinancial: privacySettings?.shareWithFinancial ?? true,
    marketingEmails: privacySettings?.marketingEmails ?? false,
    dataAnalytics: privacySettings?.dataAnalytics ?? true,
    profileVisibility: privacySettings?.profileVisibility ?? 'private'
  });

  const handleSettingChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    onSave(updated);
  };

  const handleDownloadData = () => {
    console.log('Downloading user data...');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested...');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Privacy & Data Control</h2>
        <p className="text-sm text-muted-foreground">Manage how your data is used, shared, and stored</p>
      </div>

      <div className="space-y-6">
        <div className="border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-start space-x-2 mb-4">
            <Icon name="Share2" size={20} color="var(--color-primary)" className="mt-1" />
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">Data Sharing Preferences</h3>
              <p className="text-sm text-muted-foreground mb-4">Control who can access your medical credit information.</p>
              
              <div className="space-y-4">
                <Checkbox
                  label="Share with Healthcare Providers"
                  description="Allow hospitals and clinics to access your medical credit score for treatment approvals"
                  checked={settings?.shareWithHospitals}
                  onChange={(e) => handleSettingChange('shareWithHospitals', e?.target?.checked)}
                />

                <Checkbox
                  label="Share with Financial Institutions"
                  description="Enable banks and NBFCs to view your medical credit profile for loan processing"
                  checked={settings?.shareWithFinancial}
                  onChange={(e) => handleSettingChange('shareWithFinancial', e?.target?.checked)}
                />

                <Checkbox
                  label="Marketing Communications"
                  description="Receive promotional emails about healthcare financing offers and updates"
                  checked={settings?.marketingEmails}
                  onChange={(e) => handleSettingChange('marketingEmails', e?.target?.checked)}
                />

                <Checkbox
                  label="Anonymous Data Analytics"
                  description="Help improve our services by sharing anonymized usage data"
                  checked={settings?.dataAnalytics}
                  onChange={(e) => handleSettingChange('dataAnalytics', e?.target?.checked)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-start space-x-2 mb-4">
            <Icon name="Eye" size={20} color="var(--color-primary)" className="mt-1" />
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">Profile Visibility</h3>
              <p className="text-sm text-muted-foreground mb-4">Choose who can see your profile information.</p>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-smooth">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="private"
                    checked={settings?.profileVisibility === 'private'}
                    onChange={(e) => handleSettingChange('profileVisibility', e?.target?.value)}
                    className="h-4 w-4 text-primary focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Private</p>
                    <p className="text-xs text-muted-foreground">Only you and authorized institutions can view your profile</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-smooth">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="limited"
                    checked={settings?.profileVisibility === 'limited'}
                    onChange={(e) => handleSettingChange('profileVisibility', e?.target?.value)}
                    className="h-4 w-4 text-primary focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Limited</p>
                    <p className="text-xs text-muted-foreground">Basic information visible to healthcare providers you interact with</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-start space-x-2 mb-4">
            <Icon name="Database" size={20} color="var(--color-primary)" className="mt-1" />
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">Data Rights</h3>
              <p className="text-sm text-muted-foreground mb-4">Exercise your rights over your personal data.</p>
              
              <div className="space-y-3">
                <div className="flex items-start justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-heading font-semibold text-foreground mb-1">Download Your Data</h4>
                    <p className="text-sm text-muted-foreground">Get a copy of all your personal information and medical credit history</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                    iconSize={16}
                    onClick={handleDownloadData}
                    className="ml-4 flex-shrink-0"
                  >
                    Download
                  </Button>
                </div>

                <div className="flex items-start justify-between p-4 bg-error/5 border border-error/20 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-heading font-semibold text-error mb-1">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    iconName="Trash2"
                    iconPosition="left"
                    iconSize={16}
                    onClick={handleDeleteAccount}
                    className="ml-4 flex-shrink-0"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-start space-x-2">
            <Icon name="FileText" size={20} color="var(--color-primary)" className="mt-1" />
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">Consent Management</h3>
              <p className="text-sm text-muted-foreground mb-4">Review and manage your consent for data processing activities.</p>
              
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">Credit Score Calculation</p>
                    <Icon name="CheckCircle" size={18} color="var(--color-success)" />
                  </div>
                  <p className="text-xs text-muted-foreground">Granted on: Jan 10, 2026</p>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">Medical History Processing</p>
                    <Icon name="CheckCircle" size={18} color="var(--color-success)" />
                  </div>
                  <p className="text-xs text-muted-foreground">Granted on: Jan 10, 2026</p>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">Third-Party Data Sharing</p>
                    <Icon name="CheckCircle" size={18} color="var(--color-success)" />
                  </div>
                  <p className="text-xs text-muted-foreground">Granted on: Jan 10, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-heading font-semibold text-foreground mb-1">Your Privacy Matters</h4>
              <p className="text-sm text-muted-foreground">We are committed to protecting your personal and medical information. All data is encrypted and stored securely in compliance with Indian data protection regulations. Your information is never sold to third parties.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsTab;