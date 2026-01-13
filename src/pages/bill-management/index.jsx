import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoleBasedNavigation, { QuickActionToolbar } from '../../components/ui/RoleBasedNavigation';
import BillCard from './components/BillCard';
import BillEntryForm from './components/BillEntryForm';
import FilterControls from './components/FilterControls';
import OutstandingDuesCard from './components/OutstandingDuesCard';
import PaymentPlanCard from './components/PaymentPlanCard';
import StatisticsOverview from './components/StatisticsOverview';

const BillManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPaymentPlan, setShowPaymentPlan] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [bills, setBills] = useState([
    {
      id: 1,
      providerName: "Memorial General Hospital",
      providerType: "hospital",
      serviceType: "Surgery",
      serviceDate: "2025-12-15",
      billNumber: "MGH-2025-001234",
      totalAmount: 15000,
      insuranceCovered: 12000,
      patientResponsibility: 3000,
      status: "pending",
      dueDate: "2026-02-15",
      breakdown: [
        { description: "Surgical Procedure", amount: 10000 },
        { description: "Anesthesia", amount: 2000 },
        { description: "Room Charges", amount: 2000 },
        { description: "Medications", amount: 1000 }
      ],
      paymentHistory: [],
      notes: "Post-operative care included in the charges"
    },
    {
      id: 2,
      providerName: "City Medical Clinic",
      providerType: "clinic",
      serviceType: "Consultation",
      serviceDate: "2026-01-05",
      billNumber: "CMC-2026-000567",
      totalAmount: 250,
      insuranceCovered: 200,
      patientResponsibility: 50,
      status: "paid",
      dueDate: "2026-02-05",
      breakdown: [
        { description: "Doctor Consultation", amount: 200 },
        { description: "Lab Tests", amount: 50 }
      ],
      paymentHistory: [
        { date: "2026-01-08", amount: 50 }
      ],
      notes: "Follow-up scheduled for next month"
    },
    {
      id: 3,
      providerName: "Downtown Pharmacy",
      providerType: "pharmacy",
      serviceType: "Medication",
      serviceDate: "2025-11-20",
      billNumber: "DTP-2025-003421",
      totalAmount: 450,
      insuranceCovered: 300,
      patientResponsibility: 150,
      status: "overdue",
      dueDate: "2025-12-20",
      breakdown: [
        { description: "Prescription Medications", amount: 400 },
        { description: "Over-the-counter Items", amount: 50 }
      ],
      paymentHistory: [],
      notes: "Refill available after 30 days"
    },
    {
      id: 4,
      providerName: "Advanced Diagnostics Lab",
      providerType: "laboratory",
      serviceType: "Diagnostic Tests",
      serviceDate: "2025-12-28",
      billNumber: "ADL-2025-002890",
      totalAmount: 800,
      insuranceCovered: 600,
      patientResponsibility: 200,
      status: "partial",
      dueDate: "2026-01-28",
      breakdown: [
        { description: "Blood Tests", amount: 300 },
        { description: "X-Ray", amount: 250 },
        { description: "MRI Scan", amount: 250 }
      ],
      paymentHistory: [
        { date: "2026-01-02", amount: 100 }
      ],
      notes: "Results available within 48 hours"
    },
    {
      id: 5,
      providerName: "Cardiac Care Specialists",
      providerType: "specialist",
      serviceType: "Consultation",
      serviceDate: "2026-01-10",
      billNumber: "CCS-2026-000123",
      totalAmount: 500,
      insuranceCovered: 400,
      patientResponsibility: 100,
      status: "pending",
      dueDate: "2026-02-10",
      breakdown: [
        { description: "Specialist Consultation", amount: 350 },
        { description: "ECG Test", amount: 150 }
      ],
      paymentHistory: [],
      notes: "Follow-up appointment recommended in 3 months"
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    provider: 'all',
    service: 'all',
    sort: 'date-desc',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      provider: 'all',
      service: 'all',
      sort: 'date-desc',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  const filteredBills = useMemo(() => {
    let result = [...bills];

    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      result = result?.filter(bill =>
        bill?.providerName?.toLowerCase()?.includes(searchLower) ||
        bill?.billNumber?.toLowerCase()?.includes(searchLower) ||
        bill?.serviceType?.toLowerCase()?.includes(searchLower)
      );
    }

    if (filters?.status !== 'all') {
      result = result?.filter(bill => bill?.status === filters?.status);
    }

    if (filters?.provider !== 'all') {
      result = result?.filter(bill => bill?.providerType === filters?.provider);
    }

    if (filters?.service !== 'all') {
      result = result?.filter(bill => bill?.serviceType?.toLowerCase() === filters?.service);
    }

    if (filters?.dateFrom) {
      result = result?.filter(bill => new Date(bill.serviceDate) >= new Date(filters.dateFrom));
    }

    if (filters?.dateTo) {
      result = result?.filter(bill => new Date(bill.serviceDate) <= new Date(filters.dateTo));
    }

    if (filters?.minAmount) {
      result = result?.filter(bill => bill?.patientResponsibility >= parseFloat(filters?.minAmount));
    }

    if (filters?.maxAmount) {
      result = result?.filter(bill => bill?.patientResponsibility <= parseFloat(filters?.maxAmount));
    }

    switch (filters?.sort) {
      case 'date-desc':
        result?.sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));
        break;
      case 'date-asc':
        result?.sort((a, b) => new Date(a.serviceDate) - new Date(b.serviceDate));
        break;
      case 'amount-desc':
        result?.sort((a, b) => b?.patientResponsibility - a?.patientResponsibility);
        break;
      case 'amount-asc':
        result?.sort((a, b) => a?.patientResponsibility - b?.patientResponsibility);
        break;
      case 'status':
        result?.sort((a, b) => a?.status?.localeCompare(b?.status));
        break;
      default:
        break;
    }

    return result;
  }, [bills, filters]);

  const statistics = useMemo(() => {
    return {
      totalBills: bills?.length,
      totalAmount: bills?.reduce((sum, bill) => sum + bill?.patientResponsibility, 0),
      paidBills: bills?.filter(bill => bill?.status === 'paid')?.length,
      pendingBills: bills?.filter(bill => bill?.status === 'pending' || bill?.status === 'partial')?.length
    };
  }, [bills]);

  const outstandingDues = useMemo(() => {
    const unpaidBills = bills?.filter(bill => bill?.status !== 'paid');
    const totalDue = unpaidBills?.reduce((sum, bill) => {
      if (bill?.status === 'partial') {
        const paid = bill?.paymentHistory?.reduce((paidSum, payment) => paidSum + payment?.amount, 0);
        return sum + (bill?.patientResponsibility - paid);
      }
      return sum + bill?.patientResponsibility;
    }, 0);

    const overdueCount = unpaidBills?.filter(bill => new Date(bill.dueDate) < new Date())?.length;
    const upcomingCount = unpaidBills?.filter(bill => new Date(bill.dueDate) >= new Date())?.length;

    return { totalDue, overdueCount, upcomingCount };
  }, [bills]);

  const handleAddBill = (billData) => {
    const newBill = {
      id: bills?.length + 1,
      ...billData,
      breakdown: [
        { description: billData?.description || 'Service Charges', amount: billData?.totalAmount }
      ],
      paymentHistory: []
    };
    setBills([newBill, ...bills]);
    setShowAddForm(false);
  };

  const handlePayment = (bill) => {
    console.log('Processing payment for bill:', bill?.billNumber);
  };

  const handleDispute = (bill) => {
    console.log('Initiating dispute for bill:', bill?.billNumber);
  };

  const handleCreatePaymentPlan = (planData) => {
    console.log('Creating payment plan:', planData);
    setShowPaymentPlan(false);
    setSelectedBill(null);
  };

  const handlePayAll = () => {
    console.log('Processing payment for all outstanding dues');
  };

  const handleViewDetails = () => {
    console.log('Viewing detailed breakdown of outstanding dues');
  };

  return (
    <>
      <Helmet>
        <title>Bill Management - MedCreditScore</title>
        <meta name="description" content="Manage your medical bills, track payments, and create payment plans with MedCreditScore's comprehensive bill management system." />
      </Helmet>
      <RoleBasedNavigation userRole="patient" />
      <QuickActionToolbar userRole="patient" />
      <div className="min-h-screen bg-background pt-16 lg:pt-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Bill Management
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Track and manage your medical bills and payments
                </p>
              </div>
              <Button
                variant="default"
                size="lg"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? 'Cancel' : 'Add New Bill'}
              </Button>
            </div>

            <StatisticsOverview stats={statistics} />
          </div>

          {showAddForm && (
            <div className="mb-6 md:mb-8">
              <BillEntryForm
                onSubmit={handleAddBill}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}

          {showPaymentPlan && selectedBill && (
            <div className="mb-6 md:mb-8">
              <PaymentPlanCard
                bill={selectedBill}
                onCreatePlan={handleCreatePaymentPlan}
                onCancel={() => {
                  setShowPaymentPlan(false);
                  setSelectedBill(null);
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="lg:col-span-2">
              <FilterControls
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
            <div>
              <OutstandingDuesCard
                totalDue={outstandingDues?.totalDue}
                overdueCount={outstandingDues?.overdueCount}
                upcomingCount={outstandingDues?.upcomingCount}
                onPayAll={handlePayAll}
                onViewDetails={handleViewDetails}
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-foreground">
                Your Bills ({filteredBills?.length})
              </h2>
              {filteredBills?.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => console.log('Exporting bills')}
                >
                  Export
                </Button>
              )}
            </div>
          </div>

          {filteredBills?.length === 0 ? (
            <div className="bg-card rounded-xl border border-border shadow-elevation-1 p-8 md:p-12 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Icon name="FileText" size={32} color="var(--color-muted-foreground)" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No Bills Found</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                {filters?.search || filters?.status !== 'all' || filters?.provider !== 'all' ?'Try adjusting your filters to see more results' :'Start by adding your first medical bill'}
              </p>
              {!showAddForm && (
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setShowAddForm(true)}
                >
                  Add Your First Bill
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {filteredBills?.map((bill) => (
                <BillCard
                  key={bill?.id}
                  bill={bill}
                  onPayment={handlePayment}
                  onViewDetails={() => console.log('Viewing details for:', bill?.billNumber)}
                  onDispute={handleDispute}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BillManagement;