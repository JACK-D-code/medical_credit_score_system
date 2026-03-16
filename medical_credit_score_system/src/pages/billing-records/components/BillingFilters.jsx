import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const BillingFilters = ({ filters, onFilterChange, onReset, onApply }) => {
  const hospitalOptions = [
    { value: 'all', label: 'All Hospitals' },
    { value: 'apollo', label: 'Apollo Hospital' },
    { value: 'fortis', label: 'Fortis Healthcare' },
    { value: 'max', label: 'Max Healthcare' },
    { value: 'aiims', label: 'AIIMS Delhi' },
    { value: 'manipal', label: 'Manipal Hospital' }
  ];

  const treatmentOptions = [
    { value: 'all', label: 'All Treatments' },
    { value: 'normal', label: 'Normal Treatment' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'surgery', label: 'Surgery' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' }
  ];

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 border border-border p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg text-foreground">Filter Records</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          type="date"
          label="From Date"
          value={filters?.fromDate}
          onChange={(e) => onFilterChange('fromDate', e?.target?.value)}
        />

        <Input
          type="date"
          label="To Date"
          value={filters?.toDate}
          onChange={(e) => onFilterChange('toDate', e?.target?.value)}
        />

        <Select
          label="Hospital"
          options={hospitalOptions}
          value={filters?.hospital}
          onChange={(value) => onFilterChange('hospital', value)}
        />

        <Select
          label="Treatment Type"
          options={treatmentOptions}
          value={filters?.treatmentType}
          onChange={(value) => onFilterChange('treatmentType', value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Select
          label="Payment Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        <div className="flex items-end">
          <Button
            variant="default"
            size="default"
            iconName="Search"
            iconPosition="left"
            onClick={onApply}
            fullWidth
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillingFilters;