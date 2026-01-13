import React, { useState, useMemo } from 'react';
import RoleBasedNavigation, { QuickActionToolbar } from '../../components/ui/RoleBasedNavigation';
import LoanApplicationCard from './components/LoanApplicationCard';
import RiskAnalyticsPanel from './components/RiskAnalyticsPanel';
import FilterControls from './components/FilterControls';
import ApplicationTable from './components/ApplicationTable';
import ApplicationDetailsModal from './components/ApplicationDetailsModal';

const FinancialInstitutionDashboard = () => {
  const [viewMode, setViewMode] = useState('table');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'appliedDate', direction: 'desc' });
  const [filters, setFilters] = useState({
    creditScore: 'all',
    loanType: 'all',
    status: 'all',
    search: '',
    minAmount: '',
    maxAmount: ''
  });

  const mockApplications = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      patientId: "PT-2024-001",
      initials: "SJ",
      creditScore: 785,
      loanAmount: 15000,
      loanType: "Medical Procedure",
      appliedDate: "01/08/2026",
      paymentHistory: "98% on-time payments",
      outstandingDues: 2500,
      defaultRate: 0.5,
      accountAge: "3 years 2 months",
      visitFrequency: "Quarterly visits",
      status: "pending",
      riskAssessment: "Low risk applicant with excellent payment history and stable medical credit profile. Recommended for approval with standard terms.",
      riskFactors: ["High credit score", "Consistent payment history", "Low outstanding balance"],
      creditTrend: [
        { month: "Jul", score: 760 },
        { month: "Aug", score: 765 },
        { month: "Sep", score: 770 },
        { month: "Oct", score: 775 },
        { month: "Nov", score: 780 },
        { month: "Dec", score: 785 }
      ]
    },
    {
      id: 2,
      patientName: "Michael Chen",
      patientId: "PT-2024-002",
      initials: "MC",
      creditScore: 695,
      loanAmount: 8500,
      loanType: "Emergency Care",
      appliedDate: "01/09/2026",
      paymentHistory: "85% on-time payments",
      outstandingDues: 4200,
      defaultRate: 2.1,
      accountAge: "2 years 8 months",
      visitFrequency: "Monthly visits",
      status: "under-review",
      riskAssessment: "Medium risk applicant with acceptable payment history but higher outstanding dues. Consider approval with modified terms or additional security.",
      riskFactors: ["Moderate credit score", "Higher outstanding balance", "Frequent medical visits"],
      creditTrend: [
        { month: "Jul", score: 680 },
        { month: "Aug", score: 682 },
        { month: "Sep", score: 685 },
        { month: "Oct", score: 688 },
        { month: "Nov", score: 692 },
        { month: "Dec", score: 695 }
      ]
    },
    {
      id: 3,
      patientName: "Emily Rodriguez",
      patientId: "PT-2024-003",
      initials: "ER",
      creditScore: 820,
      loanAmount: 25000,
      loanType: "Elective Surgery",
      appliedDate: "01/07/2026",
      paymentHistory: "100% on-time payments",
      outstandingDues: 0,
      defaultRate: 0,
      accountAge: "5 years 6 months",
      visitFrequency: "Annual checkups",
      status: "pending",
      riskAssessment: "Excellent risk profile with perfect payment history and no outstanding dues. Highly recommended for approval with premium terms.",
      riskFactors: ["Excellent credit score", "Perfect payment record", "Zero outstanding balance"],
      creditTrend: [
        { month: "Jul", score: 810 },
        { month: "Aug", score: 812 },
        { month: "Sep", score: 814 },
        { month: "Oct", score: 816 },
        { month: "Nov", score: 818 },
        { month: "Dec", score: 820 }
      ]
    },
    {
      id: 4,
      patientName: "David Thompson",
      patientId: "PT-2024-004",
      initials: "DT",
      creditScore: 540,
      loanAmount: 12000,
      loanType: "Dental Care",
      appliedDate: "01/10/2026",
      paymentHistory: "65% on-time payments",
      outstandingDues: 8900,
      defaultRate: 5.8,
      accountAge: "1 year 4 months",
      visitFrequency: "Bi-weekly visits",
      status: "pending",
      riskAssessment: "High risk applicant with poor payment history and significant outstanding dues. Recommend rejection or approval with strict terms and collateral requirements.",
      riskFactors: ["Low credit score", "High outstanding balance", "Inconsistent payment history", "High default rate"],
      creditTrend: [
        { month: "Jul", score: 520 },
        { month: "Aug", score: 525 },
        { month: "Sep", score: 530 },
        { month: "Oct", score: 532 },
        { month: "Nov", score: 536 },
        { month: "Dec", score: 540 }
      ]
    },
    {
      id: 5,
      patientName: "Lisa Anderson",
      patientId: "PT-2024-005",
      initials: "LA",
      creditScore: 755,
      loanAmount: 18500,
      loanType: "Vision Care",
      appliedDate: "01/09/2026",
      paymentHistory: "92% on-time payments",
      outstandingDues: 3100,
      defaultRate: 1.2,
      accountAge: "4 years 1 month",
      visitFrequency: "Semi-annual visits",
      status: "pending",
      riskAssessment: "Low risk applicant with strong payment history and manageable outstanding dues. Recommended for approval with standard terms.",
      riskFactors: ["Good credit score", "Strong payment history", "Moderate outstanding balance"],
      creditTrend: [
        { month: "Jul", score: 740 },
        { month: "Aug", score: 743 },
        { month: "Sep", score: 746 },
        { month: "Oct", score: 749 },
        { month: "Nov", score: 752 },
        { month: "Dec", score: 755 }
      ]
    },
    {
      id: 6,
      patientName: "James Wilson",
      patientId: "PT-2024-006",
      initials: "JW",
      creditScore: 670,
      loanAmount: 9800,
      loanType: "Medical Procedure",
      appliedDate: "01/08/2026",
      paymentHistory: "78% on-time payments",
      outstandingDues: 5600,
      defaultRate: 3.4,
      accountAge: "2 years 3 months",
      visitFrequency: "Monthly visits",
      status: "under-review",
      riskAssessment: "Medium risk applicant with acceptable but inconsistent payment history. Consider approval with modified interest rates or payment plans.",
      riskFactors: ["Fair credit score", "Moderate outstanding balance", "Inconsistent payments"],
      creditTrend: [
        { month: "Jul", score: 655 },
        { month: "Aug", score: 658 },
        { month: "Sep", score: 662 },
        { month: "Oct", score: 665 },
        { month: "Nov", score: 668 },
        { month: "Dec", score: 670 }
      ]
    }
  ];

  const portfolioData = {
    totalAmount: 2450000,
    defaultRate: 2.8,
    activeLoans: 342
  };

  const creditDistribution = [
    { name: "Low Risk (750+)", value: 45 },
    { name: "Medium Risk (650-749)", value: 35 },
    { name: "High Risk (<650)", value: 20 }
  ];

  const defaultTrends = [
    { month: "Jul", defaultRate: 3.2, approvalRate: 78 },
    { month: "Aug", defaultRate: 3.0, approvalRate: 80 },
    { month: "Sep", defaultRate: 2.9, approvalRate: 82 },
    { month: "Oct", defaultRate: 2.8, approvalRate: 83 },
    { month: "Nov", defaultRate: 2.7, approvalRate: 85 },
    { month: "Dec", defaultRate: 2.8, approvalRate: 84 }
  ];

  const filteredApplications = useMemo(() => {
    return mockApplications?.filter(app => {
      if (filters?.creditScore !== 'all') {
        if (filters?.creditScore === 'excellent' && app?.creditScore < 750) return false;
        if (filters?.creditScore === 'good' && (app?.creditScore < 650 || app?.creditScore >= 750)) return false;
        if (filters?.creditScore === 'fair' && (app?.creditScore < 550 || app?.creditScore >= 650)) return false;
        if (filters?.creditScore === 'poor' && app?.creditScore >= 550) return false;
      }

      if (filters?.loanType !== 'all') {
        const loanTypeMap = {
          'medical-procedure': 'Medical Procedure',
          'emergency-care': 'Emergency Care',
          'elective-surgery': 'Elective Surgery',
          'dental-care': 'Dental Care',
          'vision-care': 'Vision Care'
        };
        if (app?.loanType !== loanTypeMap?.[filters?.loanType]) return false;
      }

      if (filters?.status !== 'all' && app?.status !== filters?.status) return false;

      if (filters?.search) {
        const searchLower = filters?.search?.toLowerCase();
        if (!app?.patientName?.toLowerCase()?.includes(searchLower) &&
            !app?.patientId?.toLowerCase()?.includes(searchLower)) {
          return false;
        }
      }

      if (filters?.minAmount && app?.loanAmount < Number(filters?.minAmount)) return false;
      if (filters?.maxAmount && app?.loanAmount > Number(filters?.maxAmount)) return false;

      return true;
    });
  }, [filters]);

  const sortedApplications = useMemo(() => {
    const sorted = [...filteredApplications];
    sorted?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (sortConfig?.key === 'appliedDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredApplications, sortConfig]);

  const applicationCounts = {
    total: mockApplications?.length,
    pending: mockApplications?.filter(app => app?.status === 'pending')?.length
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      creditScore: 'all',
      loanType: 'all',
      status: 'all',
      search: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
  };

  const handleApprove = (application) => {
    console.log('Approved application:', application?.id);
  };

  const handleReject = (application) => {
    console.log('Rejected application:', application?.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole="financial" />
      <QuickActionToolbar userRole="financial" />
      <main className="pt-32 lg:pt-36 pb-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2">
              Loan Application Dashboard
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Review and assess medical loan applications with standardized credit evaluation tools
            </p>
          </div>

          <RiskAnalyticsPanel
            portfolioData={portfolioData}
            creditDistribution={creditDistribution}
            defaultTrends={defaultTrends}
          />

          <div className="mt-6">
            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              applicationCounts={applicationCounts}
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              Applications ({sortedApplications?.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'table' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'card' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Card View
              </button>
            </div>
          </div>

          {viewMode === 'table' ? (
            <ApplicationTable
              applications={sortedApplications}
              onSort={handleSort}
              sortConfig={sortConfig}
              onViewDetails={handleViewDetails}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {sortedApplications?.map(application => (
                <LoanApplicationCard
                  key={application?.id}
                  application={application}
                  onViewDetails={handleViewDetails}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}

          {sortedApplications?.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-8 md:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Applications Found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </div>
      </main>
      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default FinancialInstitutionDashboard;