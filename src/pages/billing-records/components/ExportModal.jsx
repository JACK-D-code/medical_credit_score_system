import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportModal = ({ isOpen, onClose, onExport }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('all');

  if (!isOpen) return null;

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'csv', label: 'CSV Spreadsheet' },
    { value: 'excel', label: 'Excel Workbook' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Records' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'last_6_months', label: 'Last 6 Months' },
    { value: 'last_year', label: 'Last Year' }
  ];

  const handleExport = () => {
    onExport({ format: exportFormat, dateRange });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-elevation-5 border border-border w-full max-w-md overflow-hidden spring-bounce">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading font-semibold text-xl text-foreground">Export Records</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} color="currentColor" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-primary/5 rounded-md p-4 flex items-start space-x-3">
            <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Export your billing records for personal records or sharing with financial institutions.
            </p>
          </div>

          <Select
            label="Export Format"
            description="Choose the file format for your export"
            options={formatOptions}
            value={exportFormat}
            onChange={setExportFormat}
          />

          <Select
            label="Date Range"
            description="Select the time period for records"
            options={dateRangeOptions}
            value={dateRange}
            onChange={setDateRange}
          />
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/50">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
            onClick={handleExport}
          >
            Export Records
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;