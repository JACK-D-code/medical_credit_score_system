import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionCards = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'View Billing Records',
      description: 'Access your complete medical billing history and payment details',
      icon: 'FileText',
      iconColor: 'var(--color-primary)',
      bgColor: 'var(--color-primary)',
      route: '/billing-records'
    },
    {
      title: 'Update Profile',
      description: 'Manage your personal information and contact details',
      icon: 'User',
      iconColor: 'var(--color-secondary)',
      bgColor: 'var(--color-secondary)',
      route: '/profile-management'
    },
    {
      title: 'Download Certificate',
      description: 'Get your medical credit score certificate for loan applications',
      icon: 'Download',
      iconColor: 'var(--color-success)',
      bgColor: 'var(--color-success)',
      route: '/credit-score-details'
    },
    {
      title: 'Health Insurance Hub',
      description: 'Link your health insurance to instantly boost credit profile limits',
      icon: 'ShieldCheck',
      iconColor: 'var(--color-primary)',
      bgColor: 'var(--color-primary)',
      route: '/insurance-hub'
    },
    {
      title: 'EMI Simulator',
      description: 'Calculate medical loan EMIs using your live credit score',
      icon: 'Calculator',
      iconColor: 'var(--color-accent)',
      bgColor: 'var(--color-accent)',
      route: '/emi-simulator'
    },
    {
      title: 'Claim Extra Points',
      description: 'Submit proof of hospital visits or fitness to boost your live score',
      icon: 'PlusCircle',
      iconColor: 'var(--color-success)',
      bgColor: 'var(--color-success)',
      route: '/claim-credit'
    },
    {
      title: 'Medical Offers',
      description: 'Apply for specialized low-interest loans or hospital EMIs',
      icon: 'Gift',
      iconColor: 'var(--color-primary)',
      bgColor: 'var(--color-primary)',
      route: '/offers'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {actions?.map((action, index) => (
        <div
          key={index}
          className="bg-card rounded-lg shadow-elevation-2 p-6 hover-lift transition-smooth cursor-pointer"
          onClick={() => navigate(action?.route)}
        >
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-md flex items-center justify-center mb-4"
            style={{ backgroundColor: `${action?.bgColor}15` }}
          >
            <Icon name={action?.icon} size={24} color={action?.iconColor} />
          </div>

          <h4 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">
            {action?.title}
          </h4>

          <p className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-2">
            {action?.description}
          </p>

          <Button
            variant="ghost"
            size="sm"
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={16}
            className="text-primary hover:text-primary/80 p-0"
          >
            Go to {action?.title?.split(' ')?.[0]}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default QuickActionCards;