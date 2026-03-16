import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const MethodologySection = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const methodologySteps = [
    {
      id: 1,
      title: "Total Medical Bills Assessment",
      weight: "30%",
      description: "We analyze your total medical expenditure over the past 24 months. Higher medical bills indicate greater healthcare engagement and responsibility.",
      calculation: "Score = (Total Bills in ₹ / 5,00,000) × 300 points",
      icon: "Receipt"
    },
    {
      id: 2,
      title: "Outstanding Dues Evaluation",
      weight: "25%",
      description: "Lower outstanding balances demonstrate financial responsibility and timely payment behavior.",
      calculation: "Score = (1 - Outstanding/Total Bills) × 250 points",
      icon: "AlertCircle"
    },
    {
      id: 3,
      title: "Payment History Consistency",
      weight: "25%",
      description: "Regular and timely payments significantly boost your credit score. We track payment patterns and delays.",
      calculation: "Score = (On-time Payments / Total Payments) × 250 points",
      icon: "Clock"
    },
    {
      id: 4,
      title: "Hospital Visit Frequency",
      weight: "10%",
      description: "Regular preventive care visits indicate proactive health management and lower risk profile.",
      calculation: "Score = (Preventive Visits / Total Visits) × 100 points",
      icon: "Activity"
    },
    {
      id: 5,
      title: "Treatment Type Diversity",
      weight: "10%",
      description: "Balanced mix of preventive, diagnostic, and treatment services shows comprehensive healthcare approach.",
      calculation: "Score = Treatment Diversity Index × 100 points",
      icon: "Layers"
    }
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="BookOpen" size={28} color="var(--color-primary)" />
        <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground">Scoring Methodology</h3>
      </div>
      <div className="space-y-3">
        {methodologySteps?.map((step) => (
          <div key={step?.id} className="border border-border rounded-lg overflow-hidden transition-smooth">
            <button
              onClick={() => toggleSection(step?.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted transition-smooth text-left"
            >
              <div className="flex items-center space-x-3 flex-1">
                <Icon name={step?.icon} size={20} color="var(--color-primary)" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-semibold text-sm md:text-base text-foreground">{step?.title}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Weight: {step?.weight}</p>
                </div>
              </div>
              <Icon 
                name={expandedSection === step?.id ? "ChevronUp" : "ChevronDown"} 
                size={20} 
                color="var(--color-muted-foreground)" 
              />
            </button>

            {expandedSection === step?.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-border pt-4">
                <p className="text-sm md:text-base text-foreground leading-relaxed">{step?.description}</p>
                <div className="bg-muted rounded-md p-3">
                  <p className="text-xs md:text-sm font-mono text-foreground">{step?.calculation}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-primary/10 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm md:text-base text-foreground font-medium mb-1">Final Score Calculation</p>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Your final credit score is calculated dynamically ranging from 300 to 900.
              <strong> 800+ (Excellent)</strong> grants 100% Charity Waiver.
              <strong> 650+ (Good)</strong> grants 0% Interest EMI Loans.
              <strong> 500+ (Fair)</strong> grants immediate 20% bill discounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodologySection;