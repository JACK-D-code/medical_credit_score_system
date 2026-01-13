import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const RoleBasedNavigation = ({ userRole = 'patient' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = {
    patient: [
      { label: 'Dashboard', path: '/patient-dashboard', icon: 'LayoutDashboard' },
      { label: 'Payment History', path: '/payment-history', icon: 'Receipt' },
      { label: 'Bill Management', path: '/bill-management', icon: 'FileText' },
      { label: 'Credit Analysis', path: '/credit-score-details', icon: 'TrendingUp' }
    ],
    admin: [
      { label: 'Dashboard', path: '/healthcare-admin-dashboard', icon: 'LayoutDashboard' },
      { label: 'Payment History', path: '/payment-history', icon: 'Receipt' },
      { label: 'Bill Management', path: '/bill-management', icon: 'FileText' },
      { label: 'Credit Analysis', path: '/credit-score-details', icon: 'TrendingUp' }
    ],
    financial: [
      { label: 'Dashboard', path: '/financial-institution-dashboard', icon: 'LayoutDashboard' },
      { label: 'Payment History', path: '/payment-history', icon: 'Receipt' },
      { label: 'Credit Analysis', path: '/credit-score-details', icon: 'TrendingUp' }
    ]
  };

  const currentNavItems = navigationItems?.[userRole] || navigationItems?.patient;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location?.pathname === path;

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="role-nav-header">
        <div className="role-nav-logo-container">
          <div className="role-nav-logo">
            <Icon name="Activity" size={24} color="#FFFFFF" />
          </div>
          <span className="role-nav-brand">MedCreditScore</span>
        </div>

        <nav className="role-nav-menu">
          {currentNavItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`role-nav-item ${isActive(item?.path) ? 'active' : ''}`}
              aria-current={isActive(item?.path) ? 'page' : undefined}
            >
              <span className="flex items-center gap-2">
                <Icon name={item?.icon} size={18} />
                {item?.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          <div className="hidden lg:block">
            <UserContextHeader userRole={userRole} />
          </div>
          <div className="hidden lg:block">
            <NotificationCenter />
          </div>
        </div>
      </header>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="role-nav-mobile-toggle"
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
      >
        <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
      </button>
      <div className={`role-nav-mobile-menu ${!isMobileMenuOpen ? 'closed' : ''}`}>
        <div className="role-nav-mobile-header">
          <div className="role-nav-logo-container">
            <div className="role-nav-logo">
              <Icon name="Activity" size={24} color="#FFFFFF" />
            </div>
            <span className="role-nav-brand">MedCreditScore</span>
          </div>
        </div>

        <nav className="role-nav-mobile-items">
          {currentNavItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`role-nav-mobile-item ${isActive(item?.path) ? 'active' : ''}`}
              aria-current={isActive(item?.path) ? 'page' : undefined}
            >
              <span className="flex items-center gap-3">
                <Icon name={item?.icon} size={20} />
                {item?.label}
              </span>
            </button>
          ))}

          <div className="mt-8 pt-8 border-t border-border">
            <UserContextHeader userRole={userRole} isMobile />
          </div>

          <div className="mt-4">
            <NotificationCenter isMobile />
          </div>
        </nav>
      </div>
    </>
  );
};

const UserContextHeader = ({ userRole = 'patient', isMobile = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const roleLabels = {
    patient: 'Patient',
    admin: 'Healthcare Admin',
    financial: 'Financial Analyst'
  };

  const userInfo = {
    name: 'John Doe',
    role: roleLabels?.[userRole] || 'Patient',
    institution: userRole === 'patient' ? null : 'Memorial Hospital',
    initials: 'JD'
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    setIsDropdownOpen(false);
  };

  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg">
          <div className="user-context-avatar">
            {userInfo?.initials}
          </div>
          <div>
            <div className="user-context-name">{userInfo?.name}</div>
            <div className="user-context-role">{userInfo?.role}</div>
            {userInfo?.institution && (
              <div className="text-xs text-muted-foreground caption">{userInfo?.institution}</div>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-muted rounded-lg transition-colors duration-250"
        >
          <Icon name="LogOut" size={18} />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="user-context-button"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className="user-context-avatar">
          {userInfo?.initials}
        </div>
        <div className="user-context-info">
          <div className="user-context-name">{userInfo?.name}</div>
          <div className="user-context-role">{userInfo?.role}</div>
        </div>
        <Icon name="ChevronDown" size={16} />
      </button>
      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-[1050]"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="user-context-dropdown">
            <div className="px-4 py-3 border-b border-border">
              <div className="text-sm font-medium text-popover-foreground">{userInfo?.name}</div>
              <div className="text-xs text-muted-foreground caption">{userInfo?.role}</div>
              {userInfo?.institution && (
                <div className="text-xs text-muted-foreground caption mt-1">{userInfo?.institution}</div>
              )}
            </div>

            <button
              onClick={() => {
                console.log('Profile clicked');
                setIsDropdownOpen(false);
              }}
              className="user-context-dropdown-item"
            >
              <Icon name="User" size={18} />
              Profile Settings
            </button>

            <button
              onClick={() => {
                console.log('Preferences clicked');
                setIsDropdownOpen(false);
              }}
              className="user-context-dropdown-item"
            >
              <Icon name="Settings" size={18} />
              Preferences
            </button>

            <div className="user-context-dropdown-divider" />

            <button
              onClick={handleLogout}
              className="user-context-dropdown-item text-error"
            >
              <Icon name="LogOut" size={18} />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const NotificationCenter = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Payment Due Reminder',
      message: 'Your payment of $250 is due in 3 days',
      time: '2 hours ago',
      unread: true,
      type: 'warning'
    },
    {
      id: 2,
      title: 'Credit Score Updated',
      message: 'Your medical credit score has increased by 15 points',
      time: '5 hours ago',
      unread: true,
      type: 'success'
    },
    {
      id: 3,
      title: 'New Bill Added',
      message: 'A new medical bill of $1,200 has been added to your account',
      time: '1 day ago',
      unread: false,
      type: 'info'
    }
  ]);

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  const markAsRead = (id) => {
    setNotifications(notifications?.map(n =>
      n?.id === id ? { ...n, unread: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications?.map(n => ({ ...n, unread: false })));
  };

  if (isMobile) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm font-semibold text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-2 py-1 text-xs font-semibold bg-error text-error-foreground rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="space-y-2">
          {notifications?.map((notification) => (
            <button
              key={notification?.id}
              onClick={() => markAsRead(notification?.id)}
              className={`w-full text-left px-4 py-3 rounded-lg hover:bg-muted transition-colors duration-250 ${
                notification?.unread ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{notification?.title}</span>
                <span className="text-xs text-muted-foreground caption whitespace-nowrap">{notification?.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{notification?.message}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notification-button"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[1050]"
            onClick={() => setIsOpen(false)}
          />
          <div className="notification-panel">
            <div className="notification-header">
              <span className="notification-title">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="notification-list">
              {notifications?.map((notification) => (
                <button
                  key={notification?.id}
                  onClick={() => markAsRead(notification?.id)}
                  className={`notification-item ${notification?.unread ? 'unread' : ''}`}
                >
                  <div className="notification-item-header">
                    <span className="notification-item-title">{notification?.title}</span>
                    <span className="notification-item-time">{notification?.time}</span>
                  </div>
                  <p className="notification-item-message">{notification?.message}</p>
                </button>
              ))}
            </div>

            <div className="notification-footer">
              <button
                onClick={() => {
                  console.log('View all notifications');
                  setIsOpen(false);
                }}
                className="notification-footer-link"
              >
                View All Notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const QuickActionToolbar = ({ userRole = 'patient' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const actions = {
    patient: [
      { label: 'Record Payment', icon: 'DollarSign', primary: true },
      { label: 'Add Bill', icon: 'Plus', primary: false },
      { label: 'Export Report', icon: 'Download', primary: false }
    ],
    admin: [
      { label: 'Add Patient', icon: 'UserPlus', primary: true },
      { label: 'Generate Report', icon: 'FileText', primary: false },
      { label: 'Export Data', icon: 'Download', primary: false }
    ],
    financial: [
      { label: 'New Assessment', icon: 'FileSearch', primary: true },
      { label: 'Export Analysis', icon: 'Download', primary: false },
      { label: 'Generate Report', icon: 'FileText', primary: false }
    ]
  };

  const currentActions = actions?.[userRole] || actions?.patient;

  const handleAction = (label) => {
    console.log(`Action clicked: ${label}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="quick-action-toolbar hidden lg:flex">
        {currentActions?.map((action) => (
          <button
            key={action?.label}
            onClick={() => handleAction(action?.label)}
            className={`quick-action-button ${action?.primary ? 'primary' : ''}`}
          >
            <Icon name={action?.icon} size={18} />
            {action?.label}
          </button>
        ))}
      </div>
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="quick-action-mobile"
          aria-label="Quick actions"
        >
          <Icon name={isMobileMenuOpen ? 'X' : 'Zap'} size={24} />
        </button>

        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-[850]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="quick-action-mobile-menu">
              {currentActions?.map((action) => (
                <button
                  key={action?.label}
                  onClick={() => handleAction(action?.label)}
                  className="quick-action-mobile-item"
                >
                  <Icon name={action?.icon} size={20} />
                  {action?.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RoleBasedNavigation;
export { UserContextHeader, NotificationCenter, QuickActionToolbar };