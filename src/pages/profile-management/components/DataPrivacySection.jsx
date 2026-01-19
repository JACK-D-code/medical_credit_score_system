import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const DataPrivacySection = ({ privacySettings, onSave }) => {
  const [settings, setSettings] = useState({
    shareWithHospitals: privacySettings?.shareWithHospitals ?? true,
    shareWithFinancial: privacySettings?.shareWithFinancial ?? true,
    marketingEmails: privacySettings?.marketingEmails ?? false,
    dataAnalytics: privacySettings?.dataAnalytics ?? true
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
    console.log('Account deletion requested...');
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6 lg:p-8 transition-smooth">
      <div className="flex items-center space-x-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-error/10 rounded-md flex items-center justify-center">
          <Icon name="Lock" size={24} color="var(--color-error)" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Data Privacy & Control</h2>
          <p className="text-sm text-muted-foreground">Manage how your data is used and shared</p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="border border-border rounded-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4">Data Sharing Preferences</h3>
          
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

        <div className="border border-border rounded-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4">Data Rights</h3>
          
          <div className="space-y-4">
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
                className="ml-4"
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
                className="ml-4"
              >
                Delete
              </Button>
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

export default DataPrivacySection;