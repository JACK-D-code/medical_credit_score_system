import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import SessionSecurityHeader from '../../components/ui/SessionSecurityHeader';
import NotificationCenter from '../../components/ui/NotificationCenter';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import Button from '../../components/ui/Button';
import BillingFilters from './components/BillingFilters';
import BillingSummary from './components/BillingSummary';
import BillingTable from './components/BillingTable';
import BillingRecordCard from './components/BillingRecordCard';
import ExportModal from './components/ExportModal';
import PaymentModal from './components/PaymentModal';
import DisputeModal from './components/DisputeModal';

const BillingRecords = () => {
  const [viewMode, setViewMode] = useState('table');
  const [expandedRecords, setExpandedRecords] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    hospital: 'all',
    treatmentType: 'all',
    status: 'all'
  });
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const mockNotifications = [
    {
      id: 1,
      type: 'payment_due',
      title: 'Payment Due Reminder',
      message: 'Your payment of ₹15,000 for Apollo Hospital is due in 3 days',
      timestamp: new Date(Date.now() - 7200000),
      read: false
    },
    {
      id: 2,
      type: 'score_change',
      title: 'Credit Score Updated',
      message: 'Your recent payment has improved your credit score by +12 points',
      timestamp: new Date(Date.now() - 86400000),
      read: false
    }
  ];

  const mockBillingRecords = [
    {
      id: 1,
      hospitalName: "Apollo Hospital",
      treatmentType: "surgery",
      billAmount: 125000,
      outstanding: 15000,
      status: "pending",
      billDate: "2025-12-15",
      dueDate: "2026-01-22",
      creditImpact: 8,
      itemizedCharges: [
        { description: "Surgical Procedure", amount: 85000 },
        { description: "Room Charges (3 days)", amount: 15000 },
        { description: "Medicines & Consumables", amount: 18000 },
        { description: "Diagnostic Tests", amount: 7000 }
      ],
      paymentHistory: [
        { date: "2025-12-20", amount: 50000 },
        { date: "2026-01-05", amount: 60000 }
      ]
    },
    {
      id: 2,
      hospitalName: "Fortis Healthcare",
      treatmentType: "emergency",
      billAmount: 45000,
      outstanding: 0,
      status: "paid",
      billDate: "2025-11-28",
      dueDate: "2025-12-28",
      creditImpact: 15,
      itemizedCharges: [
        { description: "Emergency Treatment", amount: 25000 },
        { description: "ICU Charges (1 day)", amount: 12000 },
        { description: "Medicines", amount: 8000 }
      ],
      paymentHistory: [
        { date: "2025-12-15", amount: 45000 }
      ]
    },
    {
      id: 3,
      hospitalName: "Max Healthcare",
      treatmentType: "normal",
      billAmount: 8500,
      outstanding: 0,
      status: "paid",
      billDate: "2025-11-10",
      dueDate: "2025-12-10",
      creditImpact: 5,
      itemizedCharges: [
        { description: "Consultation Fee", amount: 1500 },
        { description: "Diagnostic Tests", amount: 4000 },
        { description: "Medicines", amount: 3000 }
      ],
      paymentHistory: [
        { date: "2025-11-12", amount: 8500 }
      ]
    },
    {
      id: 4,
      hospitalName: "AIIMS Delhi",
      treatmentType: "normal",
      billAmount: 12000,
      outstanding: 12000,
      status: "overdue",
      billDate: "2025-10-20",
      dueDate: "2025-11-20",
      creditImpact: -10,
      itemizedCharges: [
        { description: "Specialist Consultation", amount: 2000 },
        { description: "MRI Scan", amount: 8000 },
        { description: "Medicines", amount: 2000 }
      ],
      paymentHistory: []
    },
    {
      id: 5,
      hospitalName: "Manipal Hospital",
      treatmentType: "surgery",
      billAmount: 95000,
      outstanding: 0,
      status: "paid",
      billDate: "2025-09-15",
      dueDate: "2025-10-15",
      creditImpact: 20,
      itemizedCharges: [
        { description: "Surgical Procedure", amount: 65000 },
        { description: "Room Charges (2 days)", amount: 10000 },
        { description: "Medicines & Consumables", amount: 15000 },
        { description: "Post-operative Care", amount: 5000 }
      ],
      paymentHistory: [
        { date: "2025-09-20", amount: 50000 },
        { date: "2025-10-10", amount: 45000 }
      ]
    },
    {
      id: 6,
      hospitalName: "Fortis Healthcare",
      treatmentType: "normal",
      billAmount: 6500,
      outstanding: 0,
      status: "paid",
      billDate: "2025-08-25",
      dueDate: "2025-09-25",
      creditImpact: 3,
      itemizedCharges: [
        { description: "Consultation Fee", amount: 1500 },
        { description: "Blood Tests", amount: 3000 },
        { description: "Medicines", amount: 2000 }
      ],
      paymentHistory: [
        { date: "2025-08-28", amount: 6500 }
      ]
    }
  ];

  const mockSummary = {
    totalExpenses: 292000,
    totalOutstanding: 27000,
    avgPaymentTime: 12,
    creditScoreContribution: 41
  };

  useEffect(() => {
    applyFilters();
  }, []);

  const applyFilters = () => {
    let filtered = [...mockBillingRecords];

    if (filters?.fromDate) {
      filtered = filtered?.filter(record => new Date(record.billDate) >= new Date(filters.fromDate));
    }

    if (filters?.toDate) {
      filtered = filtered?.filter(record => new Date(record.billDate) <= new Date(filters.toDate));
    }

    if (filters?.hospital !== 'all') {
      filtered = filtered?.filter(record => 
        record?.hospitalName?.toLowerCase()?.includes(filters?.hospital?.toLowerCase())
      );
    }

    if (filters?.treatmentType !== 'all') {
      filtered = filtered?.filter(record => record?.treatmentType === filters?.treatmentType);
    }

    if (filters?.status !== 'all') {
      filtered = filtered?.filter(record => record?.status === filters?.status);
    }

    setFilteredRecords(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      hospital: 'all',
      treatmentType: 'all',
      status: 'all'
    });
    setFilteredRecords(mockBillingRecords);
  };

  const handleExpandRecord = (recordId) => {
    setExpandedRecords(prev => 
      prev?.includes(recordId) 
        ? prev?.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    handleExpandRecord(record?.id);
  };

  const handlePayment = (record) => {
    setSelectedRecord(record);
    setIsPaymentModalOpen(true);
  };

  const handleDispute = (record) => {
    setSelectedRecord(record);
    setIsDisputeModalOpen(true);
  };

  const handleExport = (exportData) => {
    console.log('Exporting records:', exportData);
  };

  const handlePaymentSubmit = (paymentData) => {
    console.log('Processing payment:', paymentData);
  };

  const handleDisputeSubmit = (disputeData) => {
    console.log('Submitting dispute:', disputeData);
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  return (
    <>
      <Helmet>
        <title>Billing Records - MediCredit India</title>
        <meta name="description" content="View and manage your medical billing records, payment history, and outstanding dues with MediCredit India" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <SessionSecurityHeader onLogout={handleLogout} />
        <Header />
        <QuickActionsToolbar />

        <main className="mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 pb-24 lg:pb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Billing Records
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Track your medical expenses and payment history
              </p>
            </div>

            <div className="flex items-center space-x-3 w-full lg:w-auto">
              <div className="hidden md:flex items-center space-x-2 bg-muted rounded-md p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 rounded-md transition-smooth press-scale ${
                    viewMode === 'table' ? 'bg-card shadow-elevation-1' : 'hover:bg-card/50'
                  }`}
                >
                  <span className="text-sm font-caption font-medium">Table</span>
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 rounded-md transition-smooth press-scale ${
                    viewMode === 'cards' ? 'bg-card shadow-elevation-1' : 'hover:bg-card/50'
                  }`}
                >
                  <span className="text-sm font-caption font-medium">Cards</span>
                </button>
              </div>

              <Button
                variant="default"
                iconName="Download"
                iconPosition="left"
                onClick={() => setIsExportModalOpen(true)}
                className="flex-1 lg:flex-initial"
              >
                Export
              </Button>

              <NotificationCenter notifications={mockNotifications} />
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <BillingSummary summary={mockSummary} />

            <BillingFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              onApply={applyFilters}
            />

            {viewMode === 'table' ? (
              <div className="hidden md:block">
                <BillingTable
                  records={filteredRecords}
                  onViewDetails={handleViewDetails}
                  onPayment={handlePayment}
                  onDispute={handleDispute}
                />
              </div>
            ) : null}

            <div className={viewMode === 'cards' ? 'block' : 'md:hidden'}>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {filteredRecords?.map(record => (
                  <BillingRecordCard
                    key={record?.id}
                    record={record}
                    onExpand={handleExpandRecord}
                    onPayment={handlePayment}
                    onDispute={handleDispute}
                    isExpanded={expandedRecords?.includes(record?.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        <MobileBottomNav creditScore={785} creditTrend="up" />
      </div>
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        record={selectedRecord}
        onSubmit={handlePaymentSubmit}
      />
      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        record={selectedRecord}
        onSubmit={handleDisputeSubmit}
      />
    </>
  );
};

export default BillingRecords;