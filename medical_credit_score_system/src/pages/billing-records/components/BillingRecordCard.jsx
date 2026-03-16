import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BillingRecordCard = ({ record, onExpand, onPayment, onDispute, onApplyCredit, isExpanded }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'overdue':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTreatmentIcon = (type) => {
    switch (type) {
      case 'emergency':
        return { name: 'AlertCircle', color: 'var(--color-error)' };
      case 'surgery':
        return { name: 'Activity', color: 'var(--color-warning)' };
      default:
        return { name: 'Stethoscope', color: 'var(--color-primary)' };
    }
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const treatmentIcon = getTreatmentIcon(record?.treatmentType);

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 border border-border overflow-hidden transition-smooth hover-lift">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-1">
              <Icon name={treatmentIcon?.name} size={24} color={treatmentIcon?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-base md:text-lg text-foreground mb-1 truncate">
                {record?.hospitalName}
              </h3>
              <p className="text-sm text-muted-foreground capitalize">
                {record?.treatmentType} Treatment
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-md text-xs font-caption font-medium whitespace-nowrap ${getStatusColor(record?.status)}`}>
            {record?.status?.charAt(0)?.toUpperCase() + record?.status?.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Bill Amount</p>
            <p className="font-mono font-semibold text-lg md:text-xl text-foreground">
              {formatINR(record?.billAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Outstanding</p>
            <p className="font-mono font-semibold text-lg md:text-xl text-error">
              {formatINR(record?.outstanding)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
            <span className="text-muted-foreground">Bill Date: {formatDate(record?.billDate)}</span>
          </div>
          {record?.dueDate && (
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} color="var(--color-muted-foreground)" />
              <span className="text-muted-foreground">Due: {formatDate(record?.dueDate)}</span>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="border-t border-border pt-4 mt-4 space-y-4">
            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">Itemized Charges</h4>
              <div className="space-y-2">
                {record?.itemizedCharges?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item?.description}</span>
                    <span className="font-mono font-medium">{formatINR(item?.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-sm mb-3">Payment History</h4>
              <div className="space-y-2">
                {record?.paymentHistory?.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                      <span className="text-muted-foreground">{formatDate(payment?.date)}</span>
                    </div>
                    <span className="font-mono font-medium text-success">{formatINR(payment?.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 rounded-md p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-caption text-muted-foreground">Credit Score Impact</span>
                <div className="flex items-center space-x-2">
                  <Icon
                    name={record?.creditImpact > 0 ? 'TrendingUp' : 'TrendingDown'}
                    size={16}
                    color={record?.creditImpact > 0 ? 'var(--color-success)' : 'var(--color-error)'}
                  />
                  <span className={`font-mono font-semibold ${record?.creditImpact > 0 ? 'text-success' : 'text-error'}`}>
                    {record?.creditImpact > 0 ? '+' : ''}{record?.creditImpact} points
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
            onClick={() => onExpand(record?.id)}
            className="flex-1"
          >
            {isExpanded ? 'Show Less' : 'View Details'}
          </Button>
          {record?.outstanding > 0 && (
            <>
              <Button
                variant="default"
                size="sm"
                iconName="CreditCard"
                iconPosition="left"
                onClick={() => onPayment(record)}
                className="flex-1"
              >
                Pay Now
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="AlertCircle"
                iconPosition="left"
                onClick={() => onDispute(record)}
                className="flex-1"
              >
                Dispute
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Percent"
                iconPosition="left"
                onClick={() => onApplyCredit(record)}
                className="flex-1 border-primary text-primary hover:bg-primary/5"
              >
                EMI
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingRecordCard;