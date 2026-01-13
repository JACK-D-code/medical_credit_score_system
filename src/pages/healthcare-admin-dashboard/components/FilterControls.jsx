import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FilterControls = ({ filters, onFilterChange, onSearch, onReset }) => {
  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-elevation-1 border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="search"
          placeholder="Search by name or ID..."
          value={filters?.search}
          onChange={(e) => onSearch(e?.target?.value)}
          className="w-full"
        />
        
        <Select
          placeholder="Credit Score Range"
          options={[
            { value: 'all', label: 'All Scores' },
            { value: 'excellent', label: 'Excellent (750-850)' },
            { value: 'good', label: 'Good (650-749)' },
            { value: 'fair', label: 'Fair (550-649)' },
            { value: 'poor', label: 'Poor (300-549)' }
          ]}
          value={filters?.scoreRange}
          onChange={(value) => onFilterChange('scoreRange', value)}
        />
        
        <Select
          placeholder="Payment Status"
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'current', label: 'Current' },
            { value: 'overdue', label: 'Overdue' },
            { value: 'paid', label: 'Paid in Full' }
          ]}
          value={filters?.paymentStatus}
          onChange={(value) => onFilterChange('paymentStatus', value)}
        />
        
        <Select
          placeholder="Treatment Type"
          options={[
            { value: 'all', label: 'All Treatments' },
            { value: 'emergency', label: 'Emergency' },
            { value: 'surgery', label: 'Surgery' },
            { value: 'consultation', label: 'Consultation' },
            { value: 'diagnostic', label: 'Diagnostic' }
          ]}
          value={filters?.treatmentType}
          onChange={(value) => onFilterChange('treatmentType', value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <Button
          variant="outline"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onReset}
        >
          Reset Filters
        </Button>
        <div className="text-sm text-muted-foreground caption ml-auto">
          Showing {filters?.resultCount} patients
        </div>
      </div>
    </div>
  );
};

export default FilterControls;