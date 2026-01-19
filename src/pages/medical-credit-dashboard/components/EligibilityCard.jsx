import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EligibilityCard = ({ eligibility = {} }) => {
  const {
    medicalLoan = false,
    cashlessTreatment = false,
    discountEligible = false,
    discountPercentage = 0,
    loanAmount = 0
  } = eligibility;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const benefits = [
    {
      title: 'Medical Loan',
      eligible: medicalLoan,
      description: medicalLoan 
        ? `Pre-approved up to ${formatCurrency(loanAmount)}` 
        : 'Not eligible currently',
      icon: 'CreditCard'
    },
    {
      title: 'Cashless Treatment',
      eligible: cashlessTreatment,
      description: cashlessTreatment 
        ? 'Available at partner hospitals' :'Improve score to unlock',
      icon: 'Shield'
    },
    {
      title: 'Treatment Discount',
      eligible: discountEligible,
      description: discountEligible 
        ? `Get ${discountPercentage}% off on treatments` 
        : 'Not available yet',
      icon: 'Tag'
    }
  ];

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Your Benefits
        </h3>
        <Icon name="Gift" size={24} color="var(--color-accent)" />
      </div>
      <div className="space-y-4">
        {benefits?.map((benefit, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 transition-smooth ${
              benefit?.eligible 
                ? 'border-success/30 bg-success/5' :'border-border bg-muted/30'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div 
                className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
                  benefit?.eligible ? 'bg-success/10' : 'bg-muted'
                }`}
              >
                <Icon 
                  name={benefit?.icon} 
                  size={20} 
                  color={benefit?.eligible ? 'var(--color-success)' : 'var(--color-muted-foreground)'} 
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm md:text-base font-heading font-semibold text-foreground">
                    {benefit?.title}
                  </h4>
                  {benefit?.eligible && (
                    <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {benefit?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <Button
          variant="default"
          fullWidth
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={16}
        >
          View All Benefits
        </Button>
      </div>
    </div>
  );
};

export default EligibilityCard;