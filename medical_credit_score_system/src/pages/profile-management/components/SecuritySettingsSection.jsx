import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecuritySettingsSection = ({ securityData, onSave }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [mfaEnabled, setMfaEnabled] = useState(securityData?.mfaEnabled || false);
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

    onSave({ type: 'password', data: passwordData });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
  };

  const handleMfaToggle = (checked) => {
    setMfaEnabled(checked);
    onSave({ type: 'mfa', data: { enabled: checked } });
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6 lg:p-8 transition-smooth">
      <div className="flex items-center space-x-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/10 rounded-md flex items-center justify-center">
          <Icon name="Shield" size={24} color="var(--color-accent)" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Security Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your account security</p>
        </div>
      </div>
      <div className="space-y-6 md:space-y-8">
        <div className="border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">Password</h3>
              <p className="text-sm text-muted-foreground">Last changed: 15 days ago</p>
            </div>
            {!isChangingPassword && (
              <Button
                variant="outline"
                size="sm"
                iconName="Key"
                iconPosition="left"
                iconSize={16}
                onClick={() => setIsChangingPassword(true)}
              >
                Change
              </Button>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4">
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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account by enabling two-factor authentication via SMS.</p>
              
              <Checkbox
                label="Enable Two-Factor Authentication"
                description="You will receive a verification code via SMS during login"
                checked={mfaEnabled}
                onChange={(e) => handleMfaToggle(e?.target?.checked)}
              />
            </div>
            <div className="ml-4">
              <Icon 
                name={mfaEnabled ? "CheckCircle" : "Circle"} 
                size={24} 
                color={mfaEnabled ? "var(--color-success)" : "var(--color-muted-foreground)"} 
              />
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-base font-heading font-semibold text-foreground mb-2">Session Management</h3>
              <p className="text-sm text-muted-foreground mb-3">Your session will automatically expire after 30 minutes of inactivity for security purposes.</p>
              <Button
                variant="outline"
                size="sm"
                iconName="LogOut"
                iconPosition="left"
                iconSize={16}
              >
                End All Other Sessions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsSection;