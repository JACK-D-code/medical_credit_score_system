import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OutstandingDuesCard = ({ dues, onPayNow }) => {
  const totalDue = dues?.reduce((sum, due) => sum + due?.amount, 0);
  const overdueCount = dues?.filter(due => new Date(due.dueDate) < new Date())?.length;

  return (
    <div className="bg-card rounded-xl p-6 md:p-8 shadow-elevation-2">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            Outstanding Dues
          </h2>
          <p className="text-sm text-muted-foreground caption">
            {dues?.length} pending payment{dues?.length !== 1 ? 's' : ''}
          </p>
        </div>
        {overdueCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-error/10 text-error">
            <Icon name="AlertCircle" size={16} />
            <span className="text-sm font-semibold">{overdueCount} Overdue</span>
          </div>
        )}
      </div>
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground caption">Total Amount Due</span>
          <Icon name="DollarSign" size={20} className="text-primary" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-heading font-bold text-foreground data-text">
            ${totalDue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {dues?.map((due) => {
          const isOverdue = new Date(due.dueDate) < new Date();
          const daysUntilDue = Math.ceil((new Date(due.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

          return (
            <div
              key={due?.id}
              className={`p-4 rounded-lg border-2 transition-all duration-250 ${
                isOverdue
                  ? 'border-error/20 bg-error/5' :'border-border bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-1 truncate">
                    {due?.description}
                  </h3>
                  <p className="text-xs text-muted-foreground caption">
                    Bill #{due?.billNumber}
                  </p>
                </div>
                <span className="text-lg font-heading font-bold text-foreground data-text whitespace-nowrap">
                  ${due?.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    name={isOverdue ? 'AlertCircle' : 'Calendar'}
                    size={14}
                    className={isOverdue ? 'text-error' : 'text-muted-foreground'}
                  />
                  <span className={`text-xs caption ${isOverdue ? 'text-error font-semibold' : 'text-muted-foreground'}`}>
                    {isOverdue
                      ? `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`
                      : `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground caption">
                  {new Date(due.dueDate)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="default"
          fullWidth
          iconName="CreditCard"
          iconPosition="left"
          onClick={onPayNow}
        >
          Pay Now
        </Button>
        <Button
          variant="outline"
          fullWidth
          iconName="FileText"
          iconPosition="left"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default OutstandingDuesCard;