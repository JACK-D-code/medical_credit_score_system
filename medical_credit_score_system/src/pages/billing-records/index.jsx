import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
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
import ApplyCreditModal from './components/ApplyCreditModal';
import BillPreviewModal from './components/BillPreviewModal';
import InsightsPanel from './components/InsightsPanel';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { io } from 'socket.io-client';

const BillingRecords = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('table');
  const [expandedRecords, setExpandedRecords] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    hospital: 'all',
    treatmentType: 'all',
    status: 'all'
  });

  const [billingData, setBillingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isApplyCreditModalOpen, setIsApplyCreditModalOpen] = useState(false);
  const [isBillPreviewModalOpen, setIsBillPreviewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [creditScore, setCreditScore] = useState(0);
  const [creditTrend, setCreditTrend] = useState('stable');

  const fetchBilling = async () => {
    try {
      const response = await api.get('/billing');
      setBillingData(response.data);
    } catch (err) {
      console.error('Failed to load billing records', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchScore = async () => {
        try {
            const res = await api.get('/dashboard');
            const score = res.data?.currentScore?.score || 0;
            setCreditScore(score);
            setCreditTrend(res.data?.currentScore?.trend || 'stable');
        } catch (err) {
            console.error(err);
        }
    };
    fetchScore();
    fetchBilling();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const phid = user?.phid;

    if (phid) {
        const socket = io('http://localhost:5000', {
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log('[socket] Billing Records Connected to Live Engine');
            socket.emit('join_phid_room', phid);
        });

        socket.on('score_updated', () => {
            console.log("Real-time Score Update Received in Billing Records");
            fetchScore();
            fetchBilling();
        });

        return () => {
            socket.disconnect();
        };
    }
  }, []);

  useEffect(() => {
    if (billingData) {
      applyFilters();
    }
  }, [filters, billingData]);

  const applyFilters = () => {
    if (!billingData) return;
    let filtered = [...billingData.bills];

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
    setFilteredRecords(billingData?.bills || []);
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
    setIsBillPreviewModalOpen(true);
    handleExpandRecord(record?.id);
  };

  const handlePayment = (record) => {
    setSelectedRecord(record);
    setIsPaymentModalOpen(true);
  };

  const handleApplyCredit = (record) => {
    setSelectedRecord(record);
    setIsApplyCreditModalOpen(true);
  };

  const handleDispute = (record) => {
    setSelectedRecord(record);
    setIsDisputeModalOpen(true);
  };

  const handleExport = (exportData) => {
    console.log('Exporting records:', exportData);
  };

  const handleApplyCreditSubmit = async (creditData) => {
    try {
      await api.post('/billing/apply-credit', { billId: selectedRecord.id, months: creditData.months });
      await fetchBilling();
      setIsApplyCreditModalOpen(false);
      alert('Medical Credit / EMI successfully approved!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply for credit');
    }
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      const amountToPay = paymentData?.amount || selectedRecord.outstanding;
      await api.post('/billing/pay', { billId: selectedRecord.id, amount: amountToPay });
      await fetchBilling();
      setIsPaymentModalOpen(false);
    } catch (err) {
      console.error('Failed to process payment:', err);
    }
  };

  const handleDisputeSubmit = (disputeData) => {
    console.log('Submitting dispute:', disputeData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/patient-login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Billing Records - MediCredit India</title>
        <meta name="description" content="View and manage your medical billing records, payment history, and outstanding dues with MediCredit India" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header onLogout={handleLogout} />
        <QuickActionsToolbar />

        <main className="mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-24 lg:pb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Billing Records
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Track your medical expenses and payment history
              </p>
              <div className="flex items-center space-x-2 mt-2 bg-emerald-500/5 border border-emerald-500/20 rounded-full px-3 py-1 w-fit">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live Engine Sync Active</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full lg:w-auto">
              <div className="hidden md:flex items-center space-x-2 bg-muted rounded-md p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 rounded-md transition-smooth press-scale ${viewMode === 'table' ? 'bg-card shadow-elevation-1' : 'hover:bg-card/50'
                    }`}
                >
                  <span className="text-sm font-caption font-medium">Table</span>
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 rounded-md transition-smooth press-scale ${viewMode === 'cards' ? 'bg-card shadow-elevation-1' : 'hover:bg-card/50'
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

              <NotificationCenter notifications={billingData?.notifications || []} />
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <BillingSummary summary={{
              totalExpenses: billingData?.summary?.totalExpenses || 0,
              totalOutstanding: billingData?.summary?.totalOutstanding || 0,
              avgPaymentTime: billingData?.summary?.avgPaymentTime || 0,
              creditScoreContribution: billingData?.summary?.creditScoreContribution || 0
            }} />

            <BillingFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              onApply={applyFilters}
            />

            <InsightsPanel insights={billingData?.summary?.insights} />

            {viewMode === 'table' ? (
              <div className="hidden md:block">
                <BillingTable
                  records={filteredRecords}
                  onViewDetails={handleViewDetails}
                  onPayment={handlePayment}
                  onDispute={handleDispute}
                  onApplyCredit={handleApplyCredit}
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
                    onApplyCredit={handleApplyCredit}
                    isExpanded={expandedRecords?.includes(record?.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        <MobileBottomNav creditScore={creditScore} creditTrend={creditTrend} />
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
      <ApplyCreditModal
        isOpen={isApplyCreditModalOpen}
        onClose={() => setIsApplyCreditModalOpen(false)}
        record={selectedRecord}
        onSubmit={handleApplyCreditSubmit}
      />
      <BillPreviewModal
        isOpen={isBillPreviewModalOpen}
        onClose={() => setIsBillPreviewModalOpen(false)}
        record={selectedRecord}
      />
    </>
  );
};

export default BillingRecords;