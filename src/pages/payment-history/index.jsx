import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import RoleBasedNavigation, { QuickActionToolbar } from '../../components/ui/RoleBasedNavigation';
import PaymentFilters from './components/PaymentFilters';
import PaymentStatsCards from './components/PaymentStatsCards';
import PaymentCharts from './components/PaymentCharts';
import PaymentTable from './components/PaymentTable';
import PaymentTableMobile from './components/PaymentTableMobile';
import AuditTrail from './components/AuditTrail';

const PaymentHistory = () => {
  const [userRole] = useState('patient');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const mockTransactions = [
    {
      id: 'TXN-2026-001',
      transactionId: 'TXN-2026-001',
      date: '2026-01-10T14:30:00',
      provider: 'Memorial Hospital',
      treatment: 'General Consultation',
      amount: 250.00,
      status: 'completed',
      method: 'Credit Card',
      methodIcon: 'CreditCard',
      breakdown: {
        consultation: 150.00,
        treatment: 50.00,
        medication: 80.00,
        insurance: 30.00
      },
      paymentPlan: 'Full Payment',
      installments: '1/1',
      nextDueDate: 'N/A'
    },
    {
      id: 'TXN-2026-002',
      transactionId: 'TXN-2026-002',
      date: '2026-01-08T10:15:00',
      provider: 'City Medical Clinic',
      treatment: 'Blood Test & Lab Work',
      amount: 450.00,
      status: 'completed',
      method: 'Insurance',
      methodIcon: 'Shield',
      breakdown: {
        consultation: 100.00,
        treatment: 300.00,
        medication: 150.00,
        insurance: 100.00
      },
      paymentPlan: 'Insurance Coverage',
      installments: '1/1',
      nextDueDate: 'N/A'
    },
    {
      id: 'TXN-2026-003',
      transactionId: 'TXN-2026-003',
      date: '2026-01-05T16:45:00',
      provider: 'Wellness Healthcare Center',
      treatment: 'Physical Therapy Session',
      amount: 180.00,
      status: 'pending',
      method: 'Debit Card',
      methodIcon: 'CreditCard',
      breakdown: {
        consultation: 0.00,
        treatment: 180.00,
        medication: 0.00,
        insurance: 0.00
      },
      paymentPlan: '3 Installments',
      installments: '1/3',
      nextDueDate: '02/05/2026'
    },
    {
      id: 'TXN-2026-004',
      transactionId: 'TXN-2026-004',
      date: '2026-01-03T09:20:00',
      provider: 'Emergency Care Unit',
      treatment: 'Emergency Room Visit',
      amount: 1200.00,
      status: 'completed',
      method: 'Bank Transfer',
      methodIcon: 'Building',
      breakdown: {
        consultation: 300.00,
        treatment: 700.00,
        medication: 350.00,
        insurance: 150.00
      },
      paymentPlan: '6 Installments',
      installments: '2/6',
      nextDueDate: '02/03/2026'
    },
    {
      id: 'TXN-2025-005',
      transactionId: 'TXN-2025-005',
      date: '2025-12-28T13:00:00',
      provider: 'Memorial Hospital',
      treatment: 'X-Ray Imaging',
      amount: 320.00,
      status: 'refunded',
      method: 'Credit Card',
      methodIcon: 'CreditCard',
      breakdown: {
        consultation: 0.00,
        treatment: 320.00,
        medication: 0.00,
        insurance: 0.00
      },
      paymentPlan: 'Full Payment',
      installments: '1/1',
      nextDueDate: 'N/A'
    },
    {
      id: 'TXN-2025-006',
      transactionId: 'TXN-2025-006',
      date: '2025-12-20T11:30:00',
      provider: 'City Medical Clinic',
      treatment: 'Dental Checkup',
      amount: 150.00,
      status: 'completed',
      method: 'Cash',
      methodIcon: 'Wallet',
      breakdown: {
        consultation: 100.00,
        treatment: 50.00,
        medication: 0.00,
        insurance: 0.00
      },
      paymentPlan: 'Full Payment',
      installments: '1/1',
      nextDueDate: 'N/A'
    },
    {
      id: 'TXN-2025-007',
      transactionId: 'TXN-2025-007',
      date: '2025-12-15T15:45:00',
      provider: 'Wellness Healthcare Center',
      treatment: 'Vaccination',
      amount: 85.00,
      status: 'completed',
      method: 'Insurance',
      methodIcon: 'Shield',
      breakdown: {
        consultation: 35.00,
        treatment: 50.00,
        medication: 0.00,
        insurance: 0.00
      },
      paymentPlan: 'Insurance Coverage',
      installments: '1/1',
      nextDueDate: 'N/A'
    },
    {
      id: 'TXN-2025-008',
      transactionId: 'TXN-2025-008',
      date: '2025-12-10T08:00:00',
      provider: 'Memorial Hospital',
      treatment: 'Surgery - Minor Procedure',
      amount: 2500.00,
      status: 'pending',
      method: 'Bank Transfer',
      methodIcon: 'Building',
      breakdown: {
        consultation: 500.00,
        treatment: 1800.00,
        medication: 400.00,
        insurance: 200.00
      },
      paymentPlan: '12 Installments',
      installments: '3/12',
      nextDueDate: '02/10/2026'
    }
  ];

  const mockMonthlyData = [
    { month: 'Jul', amount: 1250 },
    { month: 'Aug', amount: 1580 },
    { month: 'Sep', amount: 1420 },
    { month: 'Oct', amount: 1890 },
    { month: 'Nov', amount: 2100 },
    { month: 'Dec', amount: 2455 },
    { month: 'Jan', amount: 2080 }
  ];

  const mockCategoryData = [
    { name: 'Consultations', value: 1250 },
    { name: 'Treatments', value: 3580 },
    { name: 'Medications', value: 980 },
    { name: 'Lab Tests', value: 750 },
    { name: 'Emergency Care', value: 1200 }
  ];

  const mockAuditLogs = [
    {
      id: 'AUDIT-001',
      type: 'payment',
      action: 'Payment Completed',
      description: 'Payment of $250.00 processed successfully for General Consultation at Memorial Hospital',
      performedBy: 'John Doe',
      timestamp: '2026-01-10T14:30:00',
      ipAddress: '192.168.1.100'
    },
    {
      id: 'AUDIT-002',
      type: 'modification',
      action: 'Payment Plan Modified',
      description: 'Payment plan changed from 3 to 6 installments for Emergency Room Visit',
      performedBy: 'System Admin',
      timestamp: '2026-01-09T10:15:00',
      ipAddress: '192.168.1.101'
    },
    {
      id: 'AUDIT-003',
      type: 'dispute',
      action: 'Dispute Initiated',
      description: 'Payment dispute raised for X-Ray Imaging charges - incorrect billing amount',
      performedBy: 'John Doe',
      timestamp: '2026-01-08T16:20:00',
      ipAddress: '192.168.1.100'
    },
    {
      id: 'AUDIT-004',
      type: 'refund',
      action: 'Refund Processed',
      description: 'Full refund of $320.00 issued for X-Ray Imaging after dispute resolution',
      performedBy: 'Billing Department',
      timestamp: '2026-01-07T11:30:00',
      ipAddress: '192.168.1.102'
    },
    {
      id: 'AUDIT-005',
      type: 'update',
      action: 'Insurance Coverage Updated',
      description: 'Insurance coverage details updated for Blood Test & Lab Work',
      performedBy: 'Insurance Provider',
      timestamp: '2026-01-06T09:45:00',
      ipAddress: '192.168.1.103'
    }
  ];

  useEffect(() => {
    setFilteredTransactions(mockTransactions);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateStats = (transactions) => {
    const completed = transactions?.filter(t => t?.status === 'completed');
    const pending = transactions?.filter(t => t?.status === 'pending');
    const totalAmount = completed?.reduce((sum, t) => sum + t?.amount, 0);
    const averageAmount = completed?.length > 0 ? totalAmount / completed?.length : 0;

    return {
      totalAmount,
      completedCount: completed?.length,
      pendingCount: pending?.length,
      averageAmount
    };
  };

  const handleFilterChange = (filters) => {
    let filtered = [...mockTransactions];

    if (filters?.searchQuery) {
      const query = filters?.searchQuery?.toLowerCase();
      filtered = filtered?.filter(
        t =>
          t?.transactionId?.toLowerCase()?.includes(query) ||
          t?.provider?.toLowerCase()?.includes(query) ||
          t?.treatment?.toLowerCase()?.includes(query)
      );
    }

    if (filters?.dateFrom) {
      filtered = filtered?.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
    }

    if (filters?.dateTo) {
      filtered = filtered?.filter(t => new Date(t.date) <= new Date(filters.dateTo));
    }

    if (filters?.status) {
      filtered = filtered?.filter(t => t?.status === filters?.status);
    }

    if (filters?.provider) {
      filtered = filtered?.filter(t => t?.provider?.toLowerCase()?.replace(/\s+/g, '-') === filters?.provider);
    }

    if (filters?.paymentMethod) {
      filtered = filtered?.filter(t => t?.method?.toLowerCase()?.replace(/\s+/g, '-') === filters?.paymentMethod);
    }

    if (filters?.minAmount) {
      filtered = filtered?.filter(t => t?.amount >= parseFloat(filters?.minAmount));
    }

    if (filters?.maxAmount) {
      filtered = filtered?.filter(t => t?.amount <= parseFloat(filters?.maxAmount));
    }

    setFilteredTransactions(filtered);
  };

  const handleExport = () => {
    console.log('Exporting payment history data...');
    alert('Payment history data exported successfully! Check your downloads folder.');
  };

  const handleViewDetails = (transactionId) => {
    console.log('Viewing details for transaction:', transactionId);
    alert(`Viewing full details for transaction ${transactionId}`);
  };

  const handleDownloadReceipt = (transactionId) => {
    console.log('Downloading receipt for transaction:', transactionId);
    alert(`Receipt for transaction ${transactionId} downloaded successfully!`);
  };

  const handleInitiateDispute = (transactionId) => {
    console.log('Initiating dispute for transaction:', transactionId);
    alert(`Dispute initiated for transaction ${transactionId}. Our team will review your case within 2-3 business days.`);
  };

  const stats = calculateStats(filteredTransactions);

  return (
    <>
      <Helmet>
        <title>Payment History - MedCreditScore</title>
        <meta
          name="description"
          content="Track and analyze your medical payment transactions with comprehensive filtering and export capabilities"
        />
      </Helmet>

      <RoleBasedNavigation userRole={userRole} />
      <QuickActionToolbar userRole={userRole} />

      <main className="min-h-screen bg-background pt-16 lg:pt-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-2">
              Payment History
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Comprehensive tracking and analysis of all your medical payment transactions
            </p>
          </div>

          <PaymentStatsCards stats={stats} />

          <PaymentFilters onFilterChange={handleFilterChange} onExport={handleExport} />

          <PaymentCharts monthlyData={mockMonthlyData} categoryData={mockCategoryData} />

          <div className="mb-6">
            {isMobile ? (
              <PaymentTableMobile
                transactions={filteredTransactions}
                onViewDetails={handleViewDetails}
                onDownloadReceipt={handleDownloadReceipt}
                onInitiateDispute={handleInitiateDispute}
              />
            ) : (
              <PaymentTable
                transactions={filteredTransactions}
                onViewDetails={handleViewDetails}
                onDownloadReceipt={handleDownloadReceipt}
                onInitiateDispute={handleInitiateDispute}
              />
            )}
          </div>

          <AuditTrail auditLogs={mockAuditLogs} />
        </div>
      </main>
    </>
  );
};

export default PaymentHistory;