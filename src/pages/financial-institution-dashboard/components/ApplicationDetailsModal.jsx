import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ApplicationDetailsModal = ({ application, onClose, onApprove, onReject }) => {
  if (!application) return null;

  const getRiskColor = (score) => {
    if (score >= 750) return 'text-success';
    if (score >= 650) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4">
      <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Application Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-semibold text-primary">{application?.initials}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-1">{application?.patientName}</h3>
              <p className="text-sm text-muted-foreground caption mb-2">Patient ID: {application?.patientId}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {application?.loanType}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                  Applied: {application?.appliedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground caption mb-2">Credit Score</p>
              <p className={`text-3xl font-semibold data-text ${getRiskColor(application?.creditScore)}`}>
                {application?.creditScore}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground caption mb-2">Loan Amount</p>
              <p className="text-3xl font-semibold text-foreground data-text">
                ${application?.loanAmount?.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground caption mb-2">Outstanding Dues</p>
              <p className="text-3xl font-semibold text-foreground data-text">
                ${application?.outstandingDues?.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-base font-semibold text-foreground mb-3">Financial Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="TrendingUp" size={18} color="var(--color-primary)" />
                  <p className="text-sm font-medium text-foreground">Payment History</p>
                </div>
                <p className="text-sm text-muted-foreground">{application?.paymentHistory}</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="AlertTriangle" size={18} color="var(--color-warning)" />
                  <p className="text-sm font-medium text-foreground">Default Rate</p>
                </div>
                <p className="text-sm text-muted-foreground">{application?.defaultRate}%</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Calendar" size={18} color="var(--color-secondary)" />
                  <p className="text-sm font-medium text-foreground">Account Age</p>
                </div>
                <p className="text-sm text-muted-foreground">{application?.accountAge}</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Activity" size={18} color="var(--color-accent)" />
                  <p className="text-sm font-medium text-foreground">Visit Frequency</p>
                </div>
                <p className="text-sm text-muted-foreground">{application?.visitFrequency}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-base font-semibold text-foreground mb-3">Credit Score Trend</h4>
            <div className="w-full h-64 bg-muted rounded-lg p-4" aria-label="Credit Score Trend Line Chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={application?.creditTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-popover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    name="Credit Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-base font-semibold text-foreground mb-3">Risk Assessment</h4>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">{application?.riskAssessment}</p>
              <div className="flex flex-wrap gap-2">
                {application?.riskFactors?.map((factor, index) => (
                  <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="success"
              iconName="Check"
              iconPosition="left"
              onClick={() => {
                onApprove(application);
                onClose();
              }}
              fullWidth
            >
              Approve Application
            </Button>
            <Button
              variant="destructive"
              iconName="X"
              iconPosition="left"
              onClick={() => {
                onReject(application);
                onClose();
              }}
              fullWidth
            >
              Reject Application
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;