import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ApplicationTable = ({ applications, onSort, sortConfig, onViewDetails, onApprove, onReject }) => {
  const [selectedApplications, setSelectedApplications] = useState([]);

  const handleSort = (key) => {
    onSort(key);
  };

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      setSelectedApplications(applications?.map(app => app?.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (id) => {
    setSelectedApplications(prev =>
      prev?.includes(id) ? prev?.filter(appId => appId !== id) : [...prev, id]
    );
  };

  const getRiskColor = (score) => {
    if (score >= 750) return 'text-success';
    if (score >= 650) return 'text-warning';
    return 'text-error';
  };

  const getRiskBadge = (score) => {
    if (score >= 750) return { label: 'Low', color: 'bg-success/10 text-success' };
    if (score >= 650) return { label: 'Medium', color: 'bg-warning/10 text-warning' };
    return { label: 'High', color: 'bg-error/10 text-error' };
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ChevronsUpDown';
    return sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown';
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedApplications?.length === applications?.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-border"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('patientName')}
                  className="flex items-center gap-2 text-xs font-semibold text-foreground caption hover:text-primary transition-colors"
                >
                  Patient
                  <Icon name={getSortIcon('patientName')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('creditScore')}
                  className="flex items-center gap-2 text-xs font-semibold text-foreground caption hover:text-primary transition-colors"
                >
                  Credit Score
                  <Icon name={getSortIcon('creditScore')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('loanAmount')}
                  className="flex items-center gap-2 text-xs font-semibold text-foreground caption hover:text-primary transition-colors"
                >
                  Loan Amount
                  <Icon name={getSortIcon('loanAmount')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-foreground caption">Loan Type</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-foreground caption">Risk Level</span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('appliedDate')}
                  className="flex items-center gap-2 text-xs font-semibold text-foreground caption hover:text-primary transition-colors"
                >
                  Applied Date
                  <Icon name={getSortIcon('appliedDate')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs font-semibold text-foreground caption">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {applications?.map((app) => {
              const risk = getRiskBadge(app?.creditScore);
              return (
                <tr key={app?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedApplications?.includes(app?.id)}
                      onChange={() => handleSelectApplication(app?.id)}
                      className="w-4 h-4 rounded border-border"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-primary">{app?.initials}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{app?.patientName}</p>
                        <p className="text-xs text-muted-foreground caption">{app?.patientId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-base font-semibold data-text ${getRiskColor(app?.creditScore)}`}>
                      {app?.creditScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-foreground data-text">
                      ${app?.loanAmount?.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{app?.loanType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${risk?.color}`}>
                      {risk?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{app?.appliedDate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onViewDetails(app)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        aria-label="View details"
                      >
                        <Icon name="Eye" size={16} color="var(--color-primary)" />
                      </button>
                      <button
                        onClick={() => onApprove(app)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        aria-label="Approve"
                      >
                        <Icon name="Check" size={16} color="var(--color-success)" />
                      </button>
                      <button
                        onClick={() => onReject(app)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        aria-label="Reject"
                      >
                        <Icon name="X" size={16} color="var(--color-error)" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedApplications?.length > 0 && (
        <div className="px-4 py-3 bg-muted border-t border-border flex items-center justify-between">
          <span className="text-sm text-foreground">
            {selectedApplications?.length} application(s) selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="success"
              size="sm"
              iconName="Check"
              iconPosition="left"
            >
              Bulk Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              iconName="X"
              iconPosition="left"
            >
              Bulk Reject
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTable;