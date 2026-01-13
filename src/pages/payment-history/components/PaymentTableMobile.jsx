import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentTableMobile = ({ transactions, onViewDetails, onDownloadReceipt, onInitiateDispute }) => {
  const [expandedCards, setExpandedCards] = useState([]);

  const toggleCardExpansion = (id) => {
    setExpandedCards((prev) =>
      prev?.includes(id) ? prev?.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', icon: 'CheckCircle' },
      pending: { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: 'Clock' },
      failed: { bg: 'bg-red-500/10', text: 'text-red-600', icon: 'XCircle' },
      refunded: { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: 'RotateCcw' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        <Icon name={config?.icon} size={12} />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {transactions?.map((transaction) => (
        <div
          key={transaction?.id}
          className="bg-card rounded-xl shadow-elevation-2 overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {transaction?.provider}
                </h3>
                <p className="text-sm text-muted-foreground caption">{transaction?.treatment}</p>
              </div>
              {getStatusBadge(transaction?.status)}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-muted-foreground caption mb-1">Amount</p>
                <p className="text-lg font-semibold text-foreground data-text">
                  ${transaction?.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground caption mb-1">Date</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(transaction.date)?.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Icon name={transaction?.methodIcon} size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{transaction?.method}</span>
              </div>
              <button
                onClick={() => toggleCardExpansion(transaction?.id)}
                className="flex items-center gap-1 text-sm font-medium text-primary"
              >
                {expandedCards?.includes(transaction?.id) ? 'Less' : 'More'}
                <Icon
                  name={expandedCards?.includes(transaction?.id) ? 'ChevronUp' : 'ChevronDown'}
                  size={16}
                />
              </button>
            </div>
          </div>

          {expandedCards?.includes(transaction?.id) && (
            <div className="px-4 pb-4 pt-2 bg-muted/30 border-t border-border">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Bill Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Consultation:</span>
                      <span className="font-medium text-foreground data-text">
                        ${transaction?.breakdown?.consultation?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Treatment:</span>
                      <span className="font-medium text-foreground data-text">
                        ${transaction?.breakdown?.treatment?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Medication:</span>
                      <span className="font-medium text-foreground data-text">
                        ${transaction?.breakdown?.medication?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-border">
                      <span className="text-muted-foreground">Insurance:</span>
                      <span className="font-medium text-emerald-600 data-text">
                        -${transaction?.breakdown?.insurance?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Payment Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Plan:</span>
                      <span className="font-medium text-foreground">{transaction?.paymentPlan}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Installments:</span>
                      <span className="font-medium text-foreground">{transaction?.installments}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Next Due:</span>
                      <span className="font-medium text-foreground">{transaction?.nextDueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                    fullWidth
                    onClick={() => onDownloadReceipt(transaction?.id)}
                  >
                    Download Receipt
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="FileText"
                      iconPosition="left"
                      onClick={() => onViewDetails(transaction?.id)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="AlertCircle"
                      iconPosition="left"
                      onClick={() => onInitiateDispute(transaction?.id)}
                    >
                      Dispute
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentTableMobile;