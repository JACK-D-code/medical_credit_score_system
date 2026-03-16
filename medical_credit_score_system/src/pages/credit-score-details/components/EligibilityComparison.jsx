import React from 'react';
import Icon from '../../../components/AppIcon';

const EligibilityComparison = ({ currentScore }) => {
  const eligibilityTiers = [
    {
      name: "100% Charity Waiver",
      minScore: 800,
      maxScore: 900,
      benefits: ["Instant 100% bill waiver", "Priority hospital access", "Zero documentation", "Full philanthropic coverage"],
      color: "var(--color-success)",
      icon: "Award"
    },
    {
      name: "0% Interest EMI Loans",
      minScore: 650,
      maxScore: 799,
      benefits: ["Instant EMI approval", "0% interest charges", "Flexible repayment duration", "Network hospital access"],
      color: "var(--color-primary)",
      icon: "CheckCircle"
    },
    {
      name: "20% Discount Allocation",
      minScore: 500,
      maxScore: 649,
      benefits: ["Immediate 20% discount on final bill", "Standard documentation", "Flexible payment options", "Pre-approved limits"],
      color: "var(--color-warning)",
      icon: "CreditCard"
    },
    {
      name: "Standard At-Risk Processing",
      minScore: 300,
      maxScore: 499,
      benefits: ["Standard Medical Bill Processing", "Requires guarantor for loans", "Higher interest rates", "Strict documentation"],
      color: "var(--color-error)",
      icon: "AlertCircle"
    }
  ];

  const getCurrentTier = () => {
    return eligibilityTiers?.find(tier => currentScore >= tier?.minScore && currentScore <= tier?.maxScore);
  };

  const currentTier = getCurrentTier();

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6">
      <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground mb-6">Eligibility Comparison</h3>
      <div className="space-y-4">
        {eligibilityTiers?.map((tier) => {
          const isCurrentTier = tier?.name === currentTier?.name;
          
          return (
            <div 
              key={tier?.name}
              className={`border-2 rounded-lg p-4 md:p-5 transition-smooth ${
                isCurrentTier ? 'border-primary shadow-elevation-2' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `${tier?.color}15` }}
                  >
                    <Icon name={tier?.icon} size={24} color={tier?.color} />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-base md:text-lg text-foreground">{tier?.name}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">Score Range: {tier?.minScore} - {tier?.maxScore}</p>
                  </div>
                </div>
                {isCurrentTier && (
                  <span className="bg-primary text-primary-foreground text-xs font-caption font-medium px-3 py-1 rounded-full">
                    Your Tier
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {tier?.benefits?.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Icon name="Check" size={16} color={tier?.color} className="flex-shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              {!isCurrentTier && currentScore < tier?.minScore && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">+{tier?.minScore - currentScore} points</span> needed to unlock this tier
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EligibilityComparison;