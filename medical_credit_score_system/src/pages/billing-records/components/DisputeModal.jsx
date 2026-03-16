import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const DisputeModal = ({ isOpen, onClose, record, onSubmit }) => {
  const [disputeReason, setDisputeReason] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen || !record) return null;

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const disputeReasonOptions = [
    { value: 'incorrect_amount', label: 'Incorrect Bill Amount' },
    { value: 'duplicate_charge', label: 'Duplicate Charge' },
    { value: 'service_not_received', label: 'Service Not Received' },
    { value: 'insurance_coverage', label: 'Insurance Coverage Issue' },
    { value: 'other', label: 'Other Reason' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit({
      recordId: record?.id,
      reason: disputeReason,
      description
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-elevation-5 border border-border w-full max-w-lg overflow-hidden spring-bounce">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading font-semibold text-xl text-foreground">Dispute Billing Record</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} color="currentColor" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hospital</span>
                <span className="font-medium text-foreground">{record?.hospitalName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bill Amount</span>
                <span className="font-mono font-semibold text-foreground">
                  {formatINR(record?.billAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Treatment Type</span>
                <span className="font-medium text-foreground capitalize">{record?.treatmentType}</span>
              </div>
            </div>

            <div className="bg-warning/10 rounded-md p-4 flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Please provide detailed information about your dispute. Our team will review and respond within 5-7 business days.
              </p>
            </div>

            <Select
              label="Dispute Reason"
              description="Select the primary reason for your dispute"
              options={disputeReasonOptions}
              value={disputeReason}
              onChange={setDisputeReason}
              required
            />

            <div>
              <label className="block text-sm font-caption font-medium text-foreground mb-2">
                Detailed Description
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none"
                rows="4"
                placeholder="Provide detailed information about your dispute..."
                value={description}
                onChange={(e) => setDescription(e?.target?.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-2">
                Include any relevant details, dates, or documentation references
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Send"
              iconPosition="left"
            >
              Submit Dispute
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisputeModal;