import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const SecuritySettingsTab = ({ securitySettings, onSave }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settings, setSettings] = useState({
    mfaEnabled: securitySettings?.mfaEnabled ?? true,
    sessionTimeout: securitySettings?.sessionTimeout ?? 30,
    loginAlerts: securitySettings?.loginAlerts ?? true
  });
  const [errors, setErrors] = useState({});

  const handlePasswordChange = (e) => {
    const { name, value } = e?.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordSave = () => {
    const newErrors = {};
    
    if (!passwordData?.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (passwordData?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({ ...settings, lastPasswordChange: new Date()?.toISOString() });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
  };

  const handleSettingChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    onSave(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Security Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account security and authentication preferences</p>
      </div>

      <div className="space-y-6">
        <div className="border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="Key" size={20} color="var(--color-primary)" />
              <div>
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">Password</h3>
                <p className="text-sm text-muted-foreground">Last changed: 15 days ago</p>
              </div>
            </div>
            {!isChangingPassword && (
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                iconPosition="left"
                iconSize={16}
                onClick={() => setIsChangingPassword(true)}
              >
                Change
              </Button>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4 mt-4">
              <Input
                label="Current Password"
                type="password"
                name="currentPassword"
                value={passwordData?.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                error={errors?.currentPassword}
                required
              />

              <Input
                label="New Password"
                type="password"
                name="newPassword"
                value={passwordData?.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                error={errors?.newPassword}
                description="Minimum 8 characters"
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={passwordData?.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                error={errors?.confirmPassword}
                required
              />

              <div className="flex items-center space-x-3 pt-2">
                <Button
                  variant="default"
                  size="sm"
                  iconName="Save"
                  iconPosition="left"
                  iconSize={16}
                  onClick={handlePasswordSave}
                >
                  Update Password
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-start space-x-2 mb-4">
            <Icon name="Shield" size={20} color="var(--color-primary)" className="mt-1" />
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security by enabling two-factor authentication via SMS.</p>
              
              <Checkbox
                label="Enable Two-Factor Authentication"
                description="You will receive a verification code via SMS during login"
                checked={settings?.mfaEnabled}
                onChange={(e) => handleSettingChange('mfaEnabled', e?.target?.checked)}
              />
            </div>
            <Icon 
              name={settings?.mfaEnabled ? "CheckCircle" : "Circle"} 
              size={24} 
              color={settings?.mfaEnabled ? "var(--color-success)" : "var(--color-muted-foreground)"} 
            />
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-start space-x-2 mb-4">
            <Icon name="Clock" size={20} color="var(--color-primary)" className="mt-1" />
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">Session Management</h3>
              <p className="text-sm text-muted-foreground mb-4">Configure automatic session timeout for enhanced security.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Session Timeout</label>
                  <select
                    value={settings?.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e?.target?.value))}
                    className="flex h-10 w-full md:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                  </select>
                  <p className="text-sm text-muted-foreground mt-1">Your session will expire after this period of inactivity</p>
                </div>

                <Checkbox
                  label="Login Activity Alerts"
                  description="Receive notifications when your account is accessed from a new device or location"
                  checked={settings?.loginAlerts}
                  onChange={(e) => handleSettingChange('loginAlerts', e?.target?.checked)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-start space-x-2">
            <Icon name="Monitor" size={20} color="var(--color-primary)" className="mt-1" />
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">Active Sessions</h3>
              <p className="text-sm text-muted-foreground mb-4">Manage devices where you're currently logged in.</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Laptop" size={20} color="var(--color-foreground)" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Desktop - Chrome</p>
                      <p className="text-xs text-muted-foreground">Mumbai, Maharashtra • Active now</p>
                    </div>
                  </div>
                  <span className="text-xs text-success font-medium">Current</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Smartphone" size={20} color="var(--color-foreground)" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Mobile - Safari</p>
                      <p className="text-xs text-muted-foreground">Mumbai, Maharashtra • 2 hours ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" iconName="X" iconSize={14} />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                iconName="LogOut"
                iconPosition="left"
                iconSize={16}
                className="mt-4"
              >
                End All Other Sessions
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} color="var(--color-warning)" className="mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-heading font-semibold text-foreground mb-1">Security Recommendations</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Use a strong, unique password with at least 8 characters</li>
                <li>Enable two-factor authentication for enhanced security</li>
                <li>Review active sessions regularly and end unknown sessions</li>
                <li>Never share your password or OTP with anyone</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsTab;