import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = ({ onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/medical-credit-dashboard',
      icon: 'LayoutDashboard'
    },
    {
      label: 'Credit Analysis',
      path: '/credit-score-details',
      icon: 'TrendingUp'
    },
    {
      label: 'Billing History',
      path: '/billing-records',
      icon: 'FileText'
    },
    {
      label: 'Insurance Hub',
      path: '/insurance-hub',
      icon: 'Shield'
    },
    {
      label: 'Loans & Offers',
      path: '/offers',
      icon: 'CreditCard'
    },
    {
      label: 'Claim Points',
      path: '/claim-credit',
      icon: 'UploadCloud'
    },
    {
      label: 'Activity Reports',
      path: '/activity-reports',
      icon: 'FileText'
    },
    {
      label: 'Book Appointment',
      path: '/book-appointment',
      icon: 'Calendar'
    },
    {
      label: 'My Profile',
      path: '/profile-management',
      icon: 'User'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[400] bg-card shadow-elevation-2 transition-smooth">
        <div className="mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/medical-credit-dashboard" 
              className="flex items-center space-x-3 hover-lift"
              onClick={handleNavClick}
            >
              <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center transition-smooth">
                <Icon name="Activity" size={24} color="var(--color-primary)" />
              </div>
              <span className="text-xl font-heading font-semibold text-foreground">
                Medicredit Patient
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-md
                    transition-smooth hover-lift press-scale
                    ${isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground shadow-elevation-1'
                      : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    color={isActivePath(item?.path) ? 'var(--color-primary-foreground)' : 'currentColor'}
                  />
                  <span className="font-caption font-medium">{item?.label}</span>
                </Link>
              ))}
              
              <div className="h-6 w-px bg-border mx-2" />
              
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-foreground hover:bg-muted transition-smooth hover-lift press-scale"
              >
                <Icon name="LogOut" size={20} color="currentColor" />
                <span className="font-caption font-medium">Logout</span>
              </button>
            </nav>

            <button
              onClick={handleMobileMenuToggle}
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-smooth press-scale"
              aria-label="Toggle mobile menu"
            >
              <Icon 
                name={mobileMenuOpen ? 'X' : 'Menu'} 
                size={24} 
                color="currentColor"
              />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-card border-t border-border">
            <nav className="px-6 py-4 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={handleNavClick}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-md
                    transition-smooth press-scale
                    ${isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground shadow-elevation-1'
                      : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    color={isActivePath(item?.path) ? 'var(--color-primary-foreground)' : 'currentColor'}
                  />
                  <span className="font-caption font-medium">{item?.label}</span>
                </Link>
              ))}
              
              <div className="my-2 border-t border-border" />
              
              <button
                onClick={() => {
                  handleNavClick();
                  onLogout();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-foreground hover:bg-muted transition-smooth"
              >
                <Icon name="LogOut" size={20} color="currentColor" />
                <span className="font-caption font-medium">Logout</span>
              </button>
            </nav>
          </div>
        )}
      </header>
      <div className="h-16" />
    </>
  );
};

export default Header;