import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ notifications = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const count = notifications?.filter(n => !n?.read)?.length;
    setUnreadCount(count);
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'score_change':
        return { name: 'TrendingUp', color: 'var(--color-success)' };
      case 'payment_due':
        return { name: 'AlertCircle', color: 'var(--color-warning)' };
      case 'eligibility':
        return { name: 'CheckCircle', color: 'var(--color-primary)' };
      case 'system':
        return { name: 'Info', color: 'var(--color-muted-foreground)' };
      default:
        return { name: 'Bell', color: 'var(--color-muted-foreground)' };
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date?.toLocaleDateString();
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-md hover:bg-muted transition-smooth press-scale"
        aria-label="Notifications"
      >
        <Icon name="Bell" size={24} color="currentColor" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-error text-error-foreground text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-popover rounded-lg shadow-elevation-4 border border-border overflow-hidden z-50">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-heading font-semibold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-primary hover:text-primary/80"
              >
                Mark all read
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="p-8 text-center">
                <Icon name="Bell" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
                <p className="text-muted-foreground font-caption">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications?.map((notification) => {
                  const icon = getNotificationIcon(notification?.type);
                  return (
                    <div
                      key={notification?.id}
                      className={`p-4 hover:bg-muted transition-smooth cursor-pointer ${
                        !notification?.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <Icon name={icon?.name} size={20} color={icon?.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground mb-1">
                            {notification?.title}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification?.message}
                          </p>
                          <span className="text-xs text-muted-foreground font-caption">
                            {formatTimestamp(notification?.timestamp || notification?.createdAt)}
                          </span>
                        </div>
                        {!notification?.read && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {notifications?.length > 0 && (
            <div className="p-3 border-t border-border text-center">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;