import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterControls = ({ filters, onFilterChange, onReset }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'partial', label: 'Partial' }
  ];

  const providerOptions = [
    { value: 'all', label: 'All Providers' },
    { value: 'hospital', label: 'Hospitals' },
    { value: 'clinic', label: 'Clinics' },
    { value: 'pharmacy', label: 'Pharmacies' },
    { value: 'laboratory', label: 'Laboratories' },
    { value: 'specialist', label: 'Specialists' }
  ];

  const serviceOptions = [
    { value: 'all', label: 'All Services' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'diagnostic', label: 'Diagnostic Tests' },
    { value: 'medication', label: 'Medication' },
    { value: 'therapy', label: 'Therapy' },
    { value: 'emergency', label: 'Emergency Care' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Date (Newest First)' },
    { value: 'date-asc', label: 'Date (Oldest First)' },
    { value: 'amount-desc', label: 'Amount (High to Low)' },
    { value: 'amount-asc', label: 'Amount (Low to High)' },
    { value: 'status', label: 'Status' }
  ];

  return (
    <div className="bg-card rounded-xl border border-border shadow-elevation-1 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon name="Filter" size={20} color="var(--color-accent)" />
        </div>
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-semibold text-foreground">Filter & Search</h3>
          <p className="text-xs md:text-sm text-muted-foreground caption">Refine your bill list</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
      <div className="space-y-4">
        <Input
          type="search"
          placeholder="Search by provider, bill number, or service..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Select
            placeholder="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => onFilterChange('status', value)}
          />

          <Select
            placeholder="Provider Type"
            options={providerOptions}
            value={filters?.provider}
            onChange={(value) => onFilterChange('provider', value)}
          />

          <Select
            placeholder="Service Type"
            options={serviceOptions}
            value={filters?.service}
            onChange={(value) => onFilterChange('service', value)}
          />

          <Select
            placeholder="Sort By"
            options={sortOptions}
            value={filters?.sort}
            onChange={(value) => onFilterChange('sort', value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <Input
            label="From Date"
            type="date"
            value={filters?.dateFrom}
            onChange={(e) => onFilterChange('dateFrom', e?.target?.value)}
          />

          <Input
            label="To Date"
            type="date"
            value={filters?.dateTo}
            onChange={(e) => onFilterChange('dateTo', e?.target?.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <Input
            label="Min Amount"
            type="number"
            placeholder="0.00"
            value={filters?.minAmount}
            onChange={(e) => onFilterChange('minAmount', e?.target?.value)}
          />

          <Input
            label="Max Amount"
            type="number"
            placeholder="0.00"
            value={filters?.maxAmount}
            onChange={(e) => onFilterChange('maxAmount', e?.target?.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterControls;