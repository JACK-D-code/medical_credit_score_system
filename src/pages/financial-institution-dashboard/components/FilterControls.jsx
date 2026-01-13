import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FilterControls = ({ filters, onFilterChange, onReset, applicationCounts }) => {
  const creditScoreOptions = [
    { value: 'all', label: 'All Credit Scores' },
    { value: 'excellent', label: 'Excellent (750+)' },
    { value: 'good', label: 'Good (650-749)' },
    { value: 'fair', label: 'Fair (550-649)' },
    { value: 'poor', label: 'Poor (<550)' }
  ];

  const loanTypeOptions = [
    { value: 'all', label: 'All Loan Types' },
    { value: 'medical-procedure', label: 'Medical Procedure' },
    { value: 'emergency-care', label: 'Emergency Care' },
    { value: 'elective-surgery', label: 'Elective Surgery' },
    { value: 'dental-care', label: 'Dental Care' },
    { value: 'vision-care', label: 'Vision Care' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'under-review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-foreground">Filter Applications</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground caption">
          <span>Total Applications:</span>
          <span className="font-semibold text-foreground data-text">{applicationCounts?.total}</span>
          <span className="mx-2">|</span>
          <span>Pending:</span>
          <span className="font-semibold text-warning data-text">{applicationCounts?.pending}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Credit Score Range"
          options={creditScoreOptions}
          value={filters?.creditScore}
          onChange={(value) => onFilterChange('creditScore', value)}
        />

        <Select
          label="Loan Type"
          options={loanTypeOptions}
          value={filters?.loanType}
          onChange={(value) => onFilterChange('loanType', value)}
        />

        <Select
          label="Application Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        <Input
          label="Search Patient"
          type="search"
          placeholder="Name or ID..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Min Loan Amount"
          type="number"
          placeholder="0"
          value={filters?.minAmount}
          onChange={(e) => onFilterChange('minAmount', e?.target?.value)}
        />

        <Input
          label="Max Loan Amount"
          type="number"
          placeholder="100000"
          value={filters?.maxAmount}
          onChange={(e) => onFilterChange('maxAmount', e?.target?.value)}
        />

        <div className="flex items-end">
          <Button
            variant="outline"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={onReset}
            fullWidth
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;