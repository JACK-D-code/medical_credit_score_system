import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const NotificationSettingsTab = ({ notificationSettings, onSave }) => {
  const [settings, setSettings] = useState({
    emailNotifications: {
      scoreUpdates: notificationSettings?.emailNotifications?.scoreUpdates ?? true,
      billingAlerts: notificationSettings?.emailNotifications?.billingAlerts ?? true,
      securityAlerts: notificationSettings?.emailNotifications?.securityAlerts ?? true,
      promotions: notificationSettings?.emailNotifications?.promotions ?? false
    },
    smsNotifications: {
      scoreUpdates: notificationSettings?.smsNotifications?.scoreUpdates ?? false,
      billingAlerts: notificationSettings?.smsNotifications?.billingAlerts ?? true,
      securityAlerts: notificationSettings?.smsNotifications?.securityAlerts ?? true,
      promotions: notificationSettings?.smsNotifications?.promotions ?? false
    },
    pushNotifications: {
      scoreUpdates: notificationSettings?.pushNotifications?.scoreUpdates ?? true,
      billingAlerts: notificationSettings?.pushNotifications?.billingAlerts ?? true,
      securityAlerts: notificationSettings?.pushNotifications?.securityAlerts ?? true,
      promotions: notificationSettings?.pushNotifications?.promotions ?? false
    }
  });

  const handleNotificationChange = (channel, type, value) => {
    const updated = {
      ...settings,
      [channel]: {
        ...settings?.[channel],
        [type]: value
      }
    };
    setSettings(updated);
    onSave(updated);
  };

  const notificationTypes = [
    {
      id: 'scoreUpdates',
      label: 'Credit Score Updates',
      description: 'Notifications when your medical credit score changes',
      icon: 'TrendingUp'
    },
    {
      id: 'billingAlerts',
      label: 'Billing Alerts',
      description: 'Reminders for upcoming payments and billing updates',
      icon: 'FileText'
    },
    {
      id: 'securityAlerts',
      label: 'Security Alerts',
      description: 'Important security notifications and login activity',
      icon: 'Shield'
    },
    {
      id: 'promotions',
      label: 'Promotional Offers',
      description: 'Special offers, discounts, and product updates',
      icon: 'Tag'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Notification Preferences</h2>
        <p className="text-sm text-muted-foreground">Choose how you want to receive notifications across different channels</p>
      </div>

      <div className="space-y-6">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 text-sm font-heading font-semibold text-foreground">
                    Notification Type
                  </th>
                  <th className="text-center p-4 text-sm font-heading font-semibold text-foreground">
                    <div className="flex items-center justify-center space-x-2">
                      <Icon name="Mail" size={16} color="var(--color-foreground)" />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="text-center p-4 text-sm font-heading font-semibold text-foreground">
                    <div className="flex items-center justify-center space-x-2">
                      <Icon name="MessageSquare" size={16} color="var(--color-foreground)" />
                      <span>SMS</span>
                    </div>
                  </th>
                  <th className="text-center p-4 text-sm font-heading font-semibold text-foreground">
                    <div className="flex items-center justify-center space-x-2">
                      <Icon name="Bell" size={16} color="var(--color-foreground)" />
                      <span>Push</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {notificationTypes?.map((type, index) => (
                  <tr key={type?.id} className={index % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                    <td className="p-4">
                      <div className="flex items-start space-x-3">
                        <Icon name={type?.icon} size={20} color="var(--color-primary)" className="mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{type?.label}</p>
                          <p className="text-xs text-muted-foreground">{type?.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={settings?.emailNotifications?.[type?.id]}
                          onChange={(e) => handleNotificationChange('emailNotifications', type?.id, e?.target?.checked)}
                          className="h-5 w-5 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={settings?.smsNotifications?.[type?.id]}
                          onChange={(e) => handleNotificationChange('smsNotifications', type?.id, e?.target?.checked)}
                          className="h-5 w-5 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={settings?.pushNotifications?.[type?.id]}
                          onChange={(e) => handleNotificationChange('pushNotifications', type?.id, e?.target?.checked)}
                          className="h-5 w-5 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-start space-x-2 mb-4">
            <Icon name="Clock" size={20} color="var(--color-primary)" className="mt-1" />
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">Notification Frequency</h3>
              <p className="text-sm text-muted-foreground mb-4">Control how often you receive non-urgent notifications.</p>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-smooth">
                  <input
                    type="radio"
                    name="frequency"
                    value="instant"
                    defaultChecked
                    className="h-4 w-4 text-primary focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Instant</p>
                    <p className="text-xs text-muted-foreground">Receive notifications immediately as events occur</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-smooth">
                  <input
                    type="radio"
                    name="frequency"
                    value="daily"
                    className="h-4 w-4 text-primary focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Daily Digest</p>
                    <p className="text-xs text-muted-foreground">Receive a summary of non-urgent notifications once per day</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-smooth">
                  <input
                    type="radio"
                    name="frequency"
                    value="weekly"
                    className="h-4 w-4 text-primary focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Weekly Summary</p>
                    <p className="text-xs text-muted-foreground">Receive a weekly summary of all non-urgent notifications</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-start space-x-2">
            <Icon name="Volume2" size={20} color="var(--color-primary)" className="mt-1" />
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">Quiet Hours</h3>
              <p className="text-sm text-muted-foreground mb-4">Set a time range when you don't want to receive non-critical notifications.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Start Time</label>
                  <input
                    type="time"
                    defaultValue="22:00"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">End Time</label>
                  <input
                    type="time"
                    defaultValue="08:00"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Security alerts will still be delivered during quiet hours</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-heading font-semibold text-foreground mb-1">Important Notes</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Security alerts are always sent immediately regardless of your preferences</li>
                <li>SMS notifications may incur carrier charges</li>
                <li>Push notifications require browser or app permissions</li>
                <li>You can unsubscribe from promotional emails at any time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsTab;