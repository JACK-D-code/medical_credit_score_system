import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RecentTransactionsTable = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' }
  ];

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = transaction?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         transaction?.billNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesFilter = filterStatus === 'all' || transaction?.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      completed: { bg: 'bg-success/10', text: 'text-success', icon: 'CheckCircle', label: 'Completed' },
      pending: { bg: 'bg-warning/10', text: 'text-warning', icon: 'Clock', label: 'Pending' },
      failed: { bg: 'bg-error/10', text: 'text-error', icon: 'XCircle', label: 'Failed' }
    };
    return badges?.[status] || badges?.pending;
  };

  return (
    <div className="bg-card rounded-xl p-6 md:p-8 shadow-elevation-2">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
          Recent Transactions
        </h2>
        <p className="text-sm text-muted-foreground caption">
          Your latest payment activities
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by description or bill number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter by status"
          />
        </div>
      </div>
      <div className="overflow-x-auto -mx-6 md:-mx-8">
        <div className="inline-block min-w-full align-middle px-6 md:px-8">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Description</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Bill #</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Amount</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions?.length > 0 ? (
                filteredTransactions?.map((transaction) => {
                  const badge = getStatusBadge(transaction?.status);
                  return (
                    <tr key={transaction?.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-250">
                      <td className="py-4 px-4 text-sm text-muted-foreground caption whitespace-nowrap">
                        {new Date(transaction.date)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-4 text-sm text-foreground">
                        {transaction?.description}
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground data-text">
                        {transaction?.billNumber}
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-foreground text-right data-text whitespace-nowrap">
                        ${transaction?.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg ${badge?.bg} ${badge?.text}`}>
                            <Icon name={badge?.icon} size={14} />
                            <span className="text-xs font-semibold">{badge?.label}</span>
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No transactions found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {filteredTransactions?.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground caption">
            Showing {filteredTransactions?.length} of {transactions?.length} transaction{transactions?.length !== 1 ? 's' : ''}
          </p>
          <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-250">
            View All Transactions →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentTransactionsTable;