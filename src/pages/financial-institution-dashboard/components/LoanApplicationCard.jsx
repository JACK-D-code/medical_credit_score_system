import React from 'react';

import Button from '../../../components/ui/Button';

const LoanApplicationCard = ({ application, onViewDetails, onApprove, onReject }) => {
  const getRiskColor = (score) => {
    if (score >= 750) return 'text-success';
    if (score >= 650) return 'text-warning';
    return 'text-error';
  };

  const getRiskBadge = (score) => {
    if (score >= 750) return { label: 'Low Risk', color: 'bg-success/10 text-success' };
    if (score >= 650) return { label: 'Medium Risk', color: 'bg-warning/10 text-warning' };
    return { label: 'High Risk', color: 'bg-error/10 text-error' };
  };

  const risk = getRiskBadge(application?.creditScore);

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 hover:shadow-elevation-2 transition-smooth">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-semibold text-primary">{application?.initials}</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">{application?.patientName}</h3>
            <p className="text-sm text-muted-foreground caption">ID: {application?.patientId}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${risk?.color} whitespace-nowrap`}>
          {risk?.label}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground caption mb-1">Credit Score</p>
          <p className={`text-lg md:text-xl font-semibold data-text ${getRiskColor(application?.creditScore)}`}>
            {application?.creditScore}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground caption mb-1">Loan Amount</p>
          <p className="text-lg md:text-xl font-semibold text-foreground data-text">
            ${application?.loanAmount?.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground caption mb-1">Loan Type</p>
          <p className="text-sm text-foreground">{application?.loanType}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground caption mb-1">Applied On</p>
          <p className="text-sm text-foreground">{application?.appliedDate}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-3 bg-muted rounded-lg">
        <div>
          <p className="text-xs text-muted-foreground caption mb-1">Payment History</p>
          <p className="text-sm font-medium text-foreground">{application?.paymentHistory}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground caption mb-1">Outstanding Dues</p>
          <p className="text-sm font-medium text-foreground data-text">${application?.outstandingDues?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground caption mb-1">Default Rate</p>
          <p className="text-sm font-medium text-foreground">{application?.defaultRate}%</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          iconName="FileText"
          iconPosition="left"
          onClick={() => onViewDetails(application)}
          fullWidth
        >
          View Details
        </Button>
        <Button
          variant="success"
          size="sm"
          iconName="Check"
          iconPosition="left"
          onClick={() => onApprove(application)}
          fullWidth
        >
          Approve
        </Button>
        <Button
          variant="destructive"
          size="sm"
          iconName="X"
          iconPosition="left"
          onClick={() => onReject(application)}
          fullWidth
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default LoanApplicationCard;