import React, { useState } from 'react';

import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const PaymentFilters = ({ onFilterChange, onExport }) => {
  const [filters, setFilters] = useState({
    searchQuery: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    provider: '',
    minAmount: '',
    maxAmount: '',
    paymentMethod: ''
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const providerOptions = [
    { value: '', label: 'All Providers' },
    { value: 'memorial-hospital', label: 'Memorial Hospital' },
    { value: 'city-clinic', label: 'City Medical Clinic' },
    { value: 'wellness-center', label: 'Wellness Healthcare Center' },
    { value: 'emergency-care', label: 'Emergency Care Unit' }
  ];

  const paymentMethodOptions = [
    { value: '', label: 'All Methods' },
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'debit-card', label: 'Debit Card' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'cash', label: 'Cash' },
    { value: 'bank-transfer', label: 'Bank Transfer' }
  ];

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      searchQuery: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      provider: '',
      minAmount: '',
      maxAmount: '',
      paymentMethod: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-card rounded-xl shadow-elevation-2 p-4 md:p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
          Filter Transactions
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={handleReset}
          >
            Reset Filters
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export Data
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3">
          <Input
            type="search"
            label="Search Transactions"
            placeholder="Search by transaction ID, provider, or treatment..."
            value={filters?.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
          />
        </div>

        <Input
          type="date"
          label="From Date"
          value={filters?.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
        />

        <Input
          type="date"
          label="To Date"
          value={filters?.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
        />

        <Select
          label="Payment Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Select
          label="Healthcare Provider"
          options={providerOptions}
          value={filters?.provider}
          onChange={(value) => handleFilterChange('provider', value)}
          searchable
        />

        <Select
          label="Payment Method"
          options={paymentMethodOptions}
          value={filters?.paymentMethod}
          onChange={(value) => handleFilterChange('paymentMethod', value)}
        />

        <Input
          type="number"
          label="Min Amount ($)"
          placeholder="0.00"
          value={filters?.minAmount}
          onChange={(e) => handleFilterChange('minAmount', e?.target?.value)}
        />

        <Input
          type="number"
          label="Max Amount ($)"
          placeholder="10000.00"
          value={filters?.maxAmount}
          onChange={(e) => handleFilterChange('maxAmount', e?.target?.value)}
        />
      </div>
    </div>
  );
};

export default PaymentFilters;