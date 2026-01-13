import React, { useState } from 'react';
import RoleBasedNavigation, { QuickActionToolbar } from '../../components/ui/RoleBasedNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ScoreGauge from './components/ScoreGauge';
import ScoreEvolutionChart from './components/ScoreEvolutionChart';
import FactorBreakdown from './components/FactorBreakdown';
import ScoreSimulator from './components/ScoreSimulator';
import EligibilityThresholds from './components/EligibilityThresholds';
import HistoricalSnapshots from './components/HistoricalSnapshots';
import ComparisonMetrics from './components/ComparisonMetrics';

const CreditScoreDetails = () => {
  const [userRole] = useState('patient');

  const currentScore = 720;
  const scoreChange = 15;
  const changeType = 'increase';

  const evolutionData = [
    { month: 'Jul 2025', score: 650, event: null },
    { month: 'Aug 2025', score: 665, event: 'Paid $500 bill on time' },
    { month: 'Sep 2025', score: 680, event: null },
    { month: 'Oct 2025', score: 695, event: 'Cleared outstanding dues' },
    { month: 'Nov 2025', score: 705, event: null },
    { month: 'Dec 2025', score: 720, event: 'Consistent payment history' }
  ];

  const scoreFactors = [
    {
      name: 'Payment History',
      description: 'Your track record of on-time payments and cleared bills',
      icon: 'Receipt',
      impact: 85,
      current: '95% on-time',
      target: '100% on-time',
      recommendation: 'Continue making timely payments to maintain excellent payment history'
    },
    {
      name: 'Outstanding Dues',
      description: 'Total amount of unpaid medical bills and pending payments',
      icon: 'DollarSign',
      impact: 75,
      current: '$250 pending',
      target: '$0 pending',
      recommendation: 'Clear the remaining $250 to improve your score by 10-15 points'
    },
    {
      name: 'Visit Frequency',
      description: 'How often you seek medical services and treatment',
      icon: 'Activity',
      impact: 65,
      current: '3 visits/year',
      target: '2-4 visits/year',
      recommendation: 'Your visit frequency is within optimal range'
    },
    {
      name: 'Treatment Types',
      description: 'Complexity and cost of medical treatments received',
      icon: 'Stethoscope',
      impact: 70,
      current: 'Moderate complexity',
      target: 'Preventive care focus',
      recommendation: 'Focus on preventive care to reduce high-cost treatments'
    }
  ];

  const eligibilityThresholds = [
    {
      name: 'Premium Cashless Treatment',
      description: 'Access to cashless treatment at all partner hospitals',
      minScore: 750,
      benefits: [
        'Zero upfront payment',
        'All partner hospitals',
        'Priority processing',
        'Extended credit period'
      ]
    },
    {
      name: 'Standard Cashless Treatment',
      description: 'Cashless treatment at select partner hospitals',
      minScore: 650,
      benefits: [
        'Minimal upfront payment',
        'Major partner hospitals',
        'Standard processing',
        'Regular credit period'
      ]
    },
    {
      name: 'Medical Loan Eligibility',
      description: 'Qualify for medical loans with favorable interest rates',
      minScore: 600,
      benefits: [
        'Competitive interest rates',
        'Flexible repayment terms',
        'Quick approval process',
        'Higher loan amounts'
      ]
    },
    {
      name: 'Discount Programs',
      description: 'Access to special discount programs and offers',
      minScore: 550,
      benefits: [
        'Up to 15% discount',
        'Pharmacy benefits',
        'Diagnostic test discounts',
        'Wellness program access'
      ]
    }
  ];

  const historicalSnapshots = [
    {
      month: 'Dec',
      year: '2025',
      score: 720,
      change: 15,
      event: 'Cleared all outstanding dues and maintained consistent payment schedule',
      highlights: ['Best Score', 'All Dues Cleared']
    },
    {
      month: 'Nov',
      year: '2025',
      score: 705,
      change: 10,
      event: 'Made early payment on $1,200 hospital bill',
      highlights: ['Early Payment']
    },
    {
      month: 'Oct',
      year: '2025',
      score: 695,
      change: 15,
      event: 'Cleared $2,500 in outstanding medical bills',
      highlights: ['Major Payment']
    },
    {
      month: 'Sep',
      year: '2025',
      score: 680,
      change: 15,
      event: 'Enrolled in automatic payment plan',
      highlights: ['Auto-Pay Enabled']
    },
    {
      month: 'Aug',
      year: '2025',
      score: 665,
      change: 15,
      event: 'First on-time payment after enrollment',
      highlights: ['On-Time Payment']
    }
  ];

  const comparisonMetrics = [
    {
      category: 'Your Age Group (25-35)',
      icon: 'Users',
      average: 680
    },
    {
      category: 'Similar Income Range',
      icon: 'TrendingUp',
      average: 695
    },
    {
      category: 'Same Treatment History',
      icon: 'Activity',
      average: 710
    },
    {
      category: 'National Average',
      icon: 'Globe',
      average: 650
    }
  ];

  const handleGenerateReport = () => {
    console.log('Generating detailed credit score report...');
  };

  const handleExportData = () => {
    console.log('Exporting credit score data...');
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole={userRole} />
      <QuickActionToolbar userRole={userRole} />

      <main className="pt-16 lg:pt-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          <div className="mb-6 md:mb-8 lg:mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Medical Credit Score Details
                </h1>
                <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                  Comprehensive analysis of your medical creditworthiness and financial health
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  onClick={handleExportData}
                >
                  Export Data
                </Button>
                <Button
                  variant="default"
                  iconName="FileText"
                  iconPosition="left"
                  onClick={handleGenerateReport}
                >
                  Generate Report
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground caption">
              <Icon name="Clock" size={16} />
              <span>Last updated: January 11, 2026 at 2:57 PM</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-elevation-1 sticky top-20">
                <ScoreGauge
                  score={currentScore}
                  maxScore={850}
                  change={scoreChange}
                  changeType={changeType}
                />

                <div className="mt-6 md:mt-8 pt-6 border-t border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base text-muted-foreground">Score Range</span>
                    <span className="text-sm md:text-base font-medium text-foreground">300 - 850</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base text-muted-foreground">Percentile</span>
                    <span className="text-sm md:text-base font-medium text-success">Top 25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base text-muted-foreground">Next Review</span>
                    <span className="text-sm md:text-base font-medium text-foreground">Feb 11, 2026</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 shadow-elevation-1">
                <ScoreEvolutionChart data={evolutionData} />
              </div>

              <ComparisonMetrics
                currentScore={currentScore}
                comparisons={comparisonMetrics}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 shadow-elevation-1">
              <FactorBreakdown factors={scoreFactors} />
            </div>

            <div className="space-y-6 md:space-y-8">
              <ScoreSimulator currentScore={currentScore} />

              <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 shadow-elevation-1">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                      Score Insights
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Key factors affecting your score
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 md:p-4 bg-success/5 border border-success/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Icon name="CheckCircle2" size={18} className="text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm md:text-base font-medium text-foreground mb-1">
                          Excellent Payment History
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          You've maintained 95% on-time payments over the last 12 months
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 md:p-4 bg-warning/5 border border-warning/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Icon name="AlertCircle" size={18} className="text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm md:text-base font-medium text-foreground mb-1">
                          Outstanding Dues
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Clearing your $250 pending balance could improve your score by 10-15 points
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 md:p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Icon name="Info" size={18} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm md:text-base font-medium text-foreground mb-1">
                          Optimal Visit Frequency
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Your 3 visits per year is within the ideal range for your age group
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 shadow-elevation-1">
              <EligibilityThresholds
                currentScore={currentScore}
                thresholds={eligibilityThresholds}
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 shadow-elevation-1">
            <HistoricalSnapshots snapshots={historicalSnapshots} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreditScoreDetails;