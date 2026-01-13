import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentTable = ({ transactions, onViewDetails, onDownloadReceipt, onInitiateDispute }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState([]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) =>
      prev?.includes(id) ? prev?.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const sortedTransactions = [...transactions]?.sort((a, b) => {
    if (sortConfig?.key === 'date') {
      return sortConfig?.direction === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    if (sortConfig?.key === 'amount') {
      return sortConfig?.direction === 'asc' ? a?.amount - b?.amount : b?.amount - a?.amount;
    }
    return 0;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', icon: 'CheckCircle' },
      pending: { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: 'Clock' },
      failed: { bg: 'bg-red-500/10', text: 'text-red-600', icon: 'XCircle' },
      refunded: { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: 'RotateCcw' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        <Icon name={config?.icon} size={14} />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-card rounded-xl shadow-elevation-2 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Date
                  <Icon
                    name={sortConfig?.key === 'date' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                    size={16}
                  />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm font-semibold text-foreground">
                Provider
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm font-semibold text-foreground">
                Treatment
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Amount
                  <Icon
                    name={sortConfig?.key === 'amount' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                    size={16}
                  />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm font-semibold text-foreground">
                Status
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm font-semibold text-foreground">
                Method
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-center text-sm font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTransactions?.map((transaction) => (
              <React.Fragment key={transaction?.id}>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="text-sm font-medium text-foreground">
                      {new Date(transaction.date)?.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground caption">
                      {new Date(transaction.date)?.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="text-sm font-medium text-foreground">{transaction?.provider}</div>
                    <div className="text-xs text-muted-foreground caption">{transaction?.transactionId}</div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="text-sm text-foreground">{transaction?.treatment}</div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="text-sm font-semibold text-foreground data-text">
                      ${transaction?.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">{getStatusBadge(transaction?.status)}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-2">
                      <Icon name={transaction?.methodIcon} size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{transaction?.method}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => toggleRowExpansion(transaction?.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                        aria-label="Expand details"
                      >
                        <Icon
                          name={expandedRows?.includes(transaction?.id) ? 'ChevronUp' : 'ChevronDown'}
                          size={18}
                        />
                      </button>
                      <button
                        onClick={() => onDownloadReceipt(transaction?.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                        aria-label="Download receipt"
                      >
                        <Icon name="Download" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRows?.includes(transaction?.id) && (
                  <tr>
                    <td colSpan="7" className="px-4 md:px-6 py-4 bg-muted/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">Bill Breakdown</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Consultation Fee:</span>
                              <span className="font-medium text-foreground data-text">
                                ${transaction?.breakdown?.consultation?.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Treatment Cost:</span>
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
                              <span className="text-muted-foreground">Insurance Coverage:</span>
                              <span className="font-medium text-emerald-600 data-text">
                                -${transaction?.breakdown?.insurance?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">Payment Details</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Payment Plan:</span>
                              <span className="font-medium text-foreground">{transaction?.paymentPlan}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Installments:</span>
                              <span className="font-medium text-foreground">{transaction?.installments}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Next Due Date:</span>
                              <span className="font-medium text-foreground">{transaction?.nextDueDate}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              iconName="FileText"
                              iconPosition="left"
                              onClick={() => onViewDetails(transaction?.id)}
                            >
                              View Full Details
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
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;