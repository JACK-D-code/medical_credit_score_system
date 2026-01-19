import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BillingTable = ({ records, onViewDetails, onPayment, onDispute }) => {
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

  if (records?.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-elevation-2 border border-border p-12 text-center">
        <Icon name="FileText" size={64} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
        <h3 className="font-heading font-semibold text-xl text-foreground mb-2">No Records Found</h3>
        <p className="text-muted-foreground">No billing records match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-caption font-semibold text-foreground uppercase tracking-wider">
                Hospital & Treatment
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-caption font-semibold text-foreground uppercase tracking-wider">
                Bill Date
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-caption font-semibold text-foreground uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-caption font-semibold text-foreground uppercase tracking-wider">
                Outstanding
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-caption font-semibold text-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-caption font-semibold text-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records?.map((record) => {
              const treatmentIcon = getTreatmentIcon(record?.treatmentType);
              return (
                <tr key={record?.id} className="hover:bg-muted/50 transition-smooth">
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Icon name={treatmentIcon?.name} size={20} color={treatmentIcon?.color} />
                      <div>
                        <p className="font-medium text-sm text-foreground">{record?.hospitalName}</p>
                        <p className="text-xs text-muted-foreground capitalize">{record?.treatmentType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="text-sm text-muted-foreground">{formatDate(record?.billDate)}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="font-mono font-semibold text-sm text-foreground">
                      {formatINR(record?.billAmount)}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="font-mono font-semibold text-sm text-error">
                      {formatINR(record?.outstanding)}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-caption font-medium ${getStatusColor(record?.status)}`}>
                      {record?.status?.charAt(0)?.toUpperCase() + record?.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        iconSize={16}
                        onClick={() => onViewDetails(record)}
                      />
                      {record?.outstanding > 0 && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="CreditCard"
                            iconSize={16}
                            onClick={() => onPayment(record)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="AlertCircle"
                            iconSize={16}
                            onClick={() => onDispute(record)}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingTable;