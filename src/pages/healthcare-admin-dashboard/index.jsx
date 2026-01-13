import React, { useState, useMemo, useEffect } from 'react';
import RoleBasedNavigation, { QuickActionToolbar } from '../../components/ui/RoleBasedNavigation';
import MetricsPanel from './components/MetricsPanel';
import FilterControls from './components/FilterControls';
import QuickActions from './components/QuickActions';
import PatientTable from './components/PatientTable';
import CreditScoreDistribution from './components/CreditScoreDistribution';
import Icon from '../../components/AppIcon';


const HealthcareAdminDashboard = () => {
  const [filters, setFilters] = useState({
    search: '',
    scoreRange: 'all',
    paymentStatus: 'all',
    treatmentType: 'all',
    resultCount: 0
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const mockPatients = [
    {
      id: 1,
      patientId: 'PT-2026-001',
      name: 'Sarah Johnson',
      initials: 'SJ',
      email: 'sarah.johnson@email.com',
      creditScore: 785,
      outstandingBalance: 1250.00,
      paymentStatus: 'current',
      reliability: 'high',
      lastVisit: '01/08/2026',
      treatmentType: 'consultation'
    },
    {
      id: 2,
      patientId: 'PT-2026-002',
      name: 'Michael Chen',
      initials: 'MC',
      email: 'michael.chen@email.com',
      creditScore: 692,
      outstandingBalance: 3450.00,
      paymentStatus: 'overdue',
      reliability: 'medium',
      lastVisit: '12/28/2025',
      treatmentType: 'surgery'
    },
    {
      id: 3,
      patientId: 'PT-2026-003',
      name: 'Emily Rodriguez',
      initials: 'ER',
      email: 'emily.rodriguez@email.com',
      creditScore: 820,
      outstandingBalance: 0.00,
      paymentStatus: 'paid',
      reliability: 'high',
      lastVisit: '01/05/2026',
      treatmentType: 'diagnostic'
    },
    {
      id: 4,
      patientId: 'PT-2026-004',
      name: 'David Thompson',
      initials: 'DT',
      email: 'david.thompson@email.com',
      creditScore: 545,
      outstandingBalance: 8920.00,
      paymentStatus: 'overdue',
      reliability: 'low',
      lastVisit: '11/15/2025',
      treatmentType: 'emergency'
    },
    {
      id: 5,
      patientId: 'PT-2026-005',
      name: 'Jennifer Martinez',
      initials: 'JM',
      email: 'jennifer.martinez@email.com',
      creditScore: 715,
      outstandingBalance: 2100.00,
      paymentStatus: 'current',
      reliability: 'high',
      lastVisit: '01/10/2026',
      treatmentType: 'consultation'
    },
    {
      id: 6,
      patientId: 'PT-2026-006',
      name: 'Robert Williams',
      initials: 'RW',
      email: 'robert.williams@email.com',
      creditScore: 478,
      outstandingBalance: 15600.00,
      paymentStatus: 'overdue',
      reliability: 'low',
      lastVisit: '10/22/2025',
      treatmentType: 'surgery'
    },
    {
      id: 7,
      patientId: 'PT-2026-007',
      name: 'Lisa Anderson',
      initials: 'LA',
      email: 'lisa.anderson@email.com',
      creditScore: 765,
      outstandingBalance: 890.00,
      paymentStatus: 'current',
      reliability: 'high',
      lastVisit: '01/09/2026',
      treatmentType: 'diagnostic'
    },
    {
      id: 8,
      patientId: 'PT-2026-008',
      name: 'James Taylor',
      initials: 'JT',
      email: 'james.taylor@email.com',
      creditScore: 625,
      outstandingBalance: 4200.00,
      paymentStatus: 'current',
      reliability: 'medium',
      lastVisit: '01/03/2026',
      treatmentType: 'emergency'
    }
  ];

  const metricsData = [
    {
      id: 1,
      label: 'Average Collection Rate',
      value: '87.5%',
      subtitle: 'Last 30 days',
      icon: 'TrendingUp',
      iconBg: 'bg-success/10',
      iconColor: '#10B981',
      trend: 'up',
      change: '+5.2%'
    },
    {
      id: 2,
      label: 'Total Outstanding Dues',
      value: '$36,410',
      subtitle: 'Across all patients',
      icon: 'DollarSign',
      iconBg: 'bg-warning/10',
      iconColor: '#F59E0B',
      trend: 'down',
      change: '-12.3%'
    },
    {
      id: 3,
      label: 'Active Patients',
      value: '1,248',
      subtitle: 'With credit profiles',
      icon: 'Users',
      iconBg: 'bg-primary/10',
      iconColor: '#3B82F6',
      trend: 'up',
      change: '+8.7%'
    },
    {
      id: 4,
      label: 'Avg Credit Score',
      value: '682',
      subtitle: 'Institution average',
      icon: 'Award',
      iconBg: 'bg-accent/10',
      iconColor: '#7C3AED',
      trend: 'up',
      change: '+15 pts'
    }
  ];

  const distributionData = [
    { name: 'Excellent (750-850)', value: 342, category: 'excellent' },
    { name: 'Good (650-749)', value: 486, category: 'good' },
    { name: 'Fair (550-649)', value: 298, category: 'fair' },
    { name: 'Poor (300-549)', value: 122, category: 'poor' }
  ];

  const filteredPatients = useMemo(() => {
    let result = [...mockPatients];

    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      result = result?.filter(p => 
        p?.name?.toLowerCase()?.includes(searchLower) ||
        p?.patientId?.toLowerCase()?.includes(searchLower) ||
        p?.email?.toLowerCase()?.includes(searchLower)
      );
    }

    if (filters?.scoreRange !== 'all') {
      result = result?.filter(p => {
        if (filters?.scoreRange === 'excellent') return p?.creditScore >= 750;
        if (filters?.scoreRange === 'good') return p?.creditScore >= 650 && p?.creditScore < 750;
        if (filters?.scoreRange === 'fair') return p?.creditScore >= 550 && p?.creditScore < 650;
        if (filters?.scoreRange === 'poor') return p?.creditScore < 550;
        return true;
      });
    }

    if (filters?.paymentStatus !== 'all') {
      result = result?.filter(p => p?.paymentStatus === filters?.paymentStatus);
    }

    if (filters?.treatmentType !== 'all') {
      result = result?.filter(p => p?.treatmentType === filters?.treatmentType);
    }

    return result;
  }, [filters, mockPatients]);

  const sortedPatients = useMemo(() => {
    if (!sortConfig?.key) return filteredPatients;

    return [...filteredPatients]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];

      if (typeof aValue === 'string') {
        return sortConfig?.direction === 'asc' 
          ? aValue?.localeCompare(bValue)
          : bValue?.localeCompare(aValue);
      }

      return sortConfig?.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });
  }, [filteredPatients, sortConfig]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      scoreRange: 'all',
      paymentStatus: 'all',
      treatmentType: 'all',
      resultCount: mockPatients?.length
    });
    setSortConfig({ key: null, direction: 'asc' });
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleQuickAction = (actionId) => {
    console.log(`Quick action triggered: ${actionId}`);
  };

  React.useEffect(() => {
    setFilters(prev => ({ ...prev, resultCount: filteredPatients?.length }));
  }, [filteredPatients]);

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation userRole="admin" />
      <QuickActionToolbar userRole="admin" />
      <main className="pt-16 lg:pt-30">
        <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2">
                Healthcare Admin Dashboard
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Manage patient financial profiles and assess payment reliability
              </p>
            </div>
            <div className="text-sm text-muted-foreground caption">
              Last updated: {new Date()?.toLocaleString('en-US', { 
                month: '2-digit', 
                day: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <MetricsPanel metrics={metricsData} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <FilterControls
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onReset={handleResetFilters}
              />

              <QuickActions onAction={handleQuickAction} />

              <PatientTable
                patients={sortedPatients}
                onSort={handleSort}
                sortConfig={sortConfig}
              />
            </div>

            <div className="space-y-6">
              <CreditScoreDistribution data={distributionData} />

              <div className="bg-card rounded-xl p-4 md:p-6 shadow-elevation-1 border border-border">
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      action: 'Payment Recorded',
                      patient: 'Sarah Johnson',
                      amount: '$1,250.00',
                      time: '2 hours ago',
                      icon: 'CheckCircle2',
                      iconColor: 'text-success'
                    },
                    {
                      id: 2,
                      action: 'Credit Score Updated',
                      patient: 'Michael Chen',
                      detail: 'Score decreased by 15 points',
                      time: '4 hours ago',
                      icon: 'TrendingDown',
                      iconColor: 'text-error'
                    },
                    {
                      id: 3,
                      action: 'New Bill Added',
                      patient: 'Emily Rodriguez',
                      amount: '$3,200.00',
                      time: '6 hours ago',
                      icon: 'FileText',
                      iconColor: 'text-primary'
                    },
                    {
                      id: 4,
                      action: 'Discount Approved',
                      patient: 'Lisa Anderson',
                      detail: '15% discount eligibility',
                      time: '1 day ago',
                      icon: 'Tag',
                      iconColor: 'text-warning'
                    }
                  ]?.map((activity) => (
                    <div key={activity?.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 ${activity?.iconColor}`}>
                        <Icon name={activity?.icon} size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity?.action}</p>
                        <p className="text-xs text-muted-foreground caption">{activity?.patient}</p>
                        {activity?.amount && (
                          <p className="text-sm font-semibold text-foreground data-text mt-1">{activity?.amount}</p>
                        )}
                        {activity?.detail && (
                          <p className="text-xs text-muted-foreground mt-1">{activity?.detail}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground caption whitespace-nowrap">{activity?.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HealthcareAdminDashboard;