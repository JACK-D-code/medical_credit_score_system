import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import CreditScoreWidget from './CreditScoreWidget';

const MobileBottomNav = ({ creditScore = 0, creditTrend = 'stable' }) => {
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/medical-credit-dashboard',
      icon: 'LayoutDashboard'
    },
    {
      label: 'Analysis',
      path: '/credit-score-details',
      icon: 'TrendingUp'
    },
    {
      label: 'Score',
      path: '/medical-credit-dashboard',
      isScore: true
    },
    {
      label: 'Billing',
      path: '/billing-records',
      icon: 'FileText'
    },
    {
      label: 'Profile',
      path: '/profile-management',
      icon: 'User'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-100 bg-card border-t border-border shadow-elevation-3">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems?.map((item) => {
          if (item?.isScore) {
            return (
              <Link
                key="score"
                to={item?.path}
                className="flex flex-col items-center justify-center min-w-0"
              >
                <CreditScoreWidget 
                  score={creditScore} 
                  trend={creditTrend} 
                  compact 
                />
              </Link>
            );
          }

          return (
            <Link
              key={item?.path}
              to={item?.path}
              className={`
                flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-md
                transition-smooth press-scale min-w-0
                ${isActivePath(item?.path)
                  ? 'text-primary' :'text-muted-foreground'
                }
              `}
            >
              <Icon 
                name={item?.icon} 
                size={22} 
                color={isActivePath(item?.path) ? 'var(--color-primary)' : 'currentColor'}
              />
              <span className="text-xs font-caption font-medium truncate">
                {item?.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;