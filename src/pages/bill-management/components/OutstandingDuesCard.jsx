import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OutstandingDuesCard = ({ totalDue, overdueCount, upcomingCount, onPayAll, onViewDetails }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-error/10 via-warning/10 to-error/5 rounded-xl border border-error/20 shadow-elevation-2 p-4 md:p-6">
      <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-error/20 flex items-center justify-center flex-shrink-0">
          <Icon name="AlertTriangle" size={28} color="var(--color-error)" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-1">Outstanding Dues</h2>
          <p className="text-sm text-muted-foreground caption">Total amount pending payment</p>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 md:p-6 mb-4 md:mb-6">
        <div className="text-center mb-4 md:mb-6">
          <p className="text-sm text-muted-foreground caption mb-2">Total Outstanding</p>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-error data-text">
            {formatCurrency(totalDue)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="bg-error/5 rounded-lg p-3 md:p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="AlertCircle" size={18} color="var(--color-error)" />
              <p className="text-xs md:text-sm font-medium text-error">Overdue</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-foreground data-text">{overdueCount}</p>
            <p className="text-xs text-muted-foreground caption">Bills</p>
          </div>

          <div className="bg-warning/5 rounded-lg p-3 md:p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon name="Clock" size={18} color="var(--color-warning)" />
              <p className="text-xs md:text-sm font-medium text-warning">Upcoming</p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-foreground data-text">{upcomingCount}</p>
            <p className="text-xs text-muted-foreground caption">Bills</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="default"
          size="lg"
          iconName="CreditCard"
          iconPosition="left"
          onClick={onPayAll}
          fullWidth
        >
          Pay All Outstanding
        </Button>
        <Button
          variant="outline"
          size="default"
          iconName="Eye"
          iconPosition="left"
          onClick={onViewDetails}
          fullWidth
        >
          View Detailed Breakdown
        </Button>
      </div>

      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={18} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-muted-foreground">
            Paying your bills on time helps maintain a good medical credit score and may qualify you for better payment terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OutstandingDuesCard;