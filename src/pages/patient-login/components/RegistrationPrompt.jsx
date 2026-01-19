import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const RegistrationPrompt = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: 'TrendingUp',
      title: 'Build Credit Score',
      description: 'Track your medical creditworthiness from 0-1000'
    },
    {
      icon: 'CreditCard',
      title: 'Easy Loan Approval',
      description: 'Get faster medical loan approvals with good credit'
    },
    {
      icon: 'Percent',
      title: 'Exclusive Discounts',
      description: 'Unlock discounts based on your credit score'
    },
    {
      icon: 'Zap',
      title: 'Cashless Treatment',
      description: 'Access cashless treatment options at partner hospitals'
    }
  ];

  const handleRegister = () => {
    navigate('/patient-registration');
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 md:p-8 border border-primary/10">
      <div className="text-center mb-6 md:mb-8">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="UserPlus" size={32} color="var(--color-primary)" />
        </div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
          New to MediCredit System
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Create your account and start building your medical credit score today
        </p>
      </div>
      <div className="space-y-4 mb-6 md:mb-8">
        {benefits?.map((benefit, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 bg-card rounded-lg p-4 hover-lift transition-smooth"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
              <Icon name={benefit?.icon} size={20} color="var(--color-primary)" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground mb-1">
                {benefit?.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {benefit?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="default"
        size="lg"
        fullWidth
        iconName="ArrowRight"
        iconPosition="right"
        iconSize={20}
        onClick={handleRegister}
      >
        Create Free Account
      </Button>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Registration takes less than 3 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPrompt;