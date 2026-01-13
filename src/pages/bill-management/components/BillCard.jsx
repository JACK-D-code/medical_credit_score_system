import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';

const BillCard = ({ bill, onPayment, onViewDetails, onDispute }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      overdue: 'bg-error/10 text-error border-error/20',
      partial: 'bg-accent/10 text-accent border-accent/20'
    };
    return colors?.[status] || colors?.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      paid: 'CheckCircle2',
      pending: 'Clock',
      overdue: 'AlertCircle',
      partial: 'TrendingUp'
    };
    return icons?.[status] || 'Clock';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(bill?.dueDate);
  const isOverdue = daysUntilDue < 0;

  return (
    <div className="bg-card rounded-xl border border-border shadow-elevation-1 hover:shadow-elevation-2 transition-smooth overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4 mb-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon name="FileText" size={24} color="var(--color-primary)" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 truncate">
                  {bill?.providerName}
                </h3>
                <p className="text-sm text-muted-foreground caption">
                  {bill?.serviceType}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium border flex items-center gap-1.5 whitespace-nowrap ${getStatusColor(bill?.status)}`}>
                <Icon name={getStatusIcon(bill?.status)} size={14} />
                {bill?.status?.charAt(0)?.toUpperCase() + bill?.status?.slice(1)}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground caption">
              <span className="flex items-center gap-1.5">
                <Icon name="Calendar" size={14} />
                {formatDate(bill?.serviceDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="Hash" size={14} />
                {bill?.billNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-3 md:p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <p className="text-xs text-muted-foreground caption mb-1">Total Amount</p>
              <p className="text-lg md:text-xl font-semibold text-foreground data-text">
                {formatCurrency(bill?.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground caption mb-1">Insurance Covered</p>
              <p className="text-lg md:text-xl font-semibold text-success data-text">
                {formatCurrency(bill?.insuranceCovered)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground caption mb-1">Your Responsibility</p>
              <p className="text-lg md:text-xl font-semibold text-primary data-text">
                {formatCurrency(bill?.patientResponsibility)}
              </p>
            </div>
          </div>
        </div>

        {bill?.status !== 'paid' && (
          <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${isOverdue ? 'bg-error/10 border border-error/20' : 'bg-warning/10 border border-warning/20'}`}>
            <Icon name={isOverdue ? 'AlertTriangle' : 'Clock'} size={18} color={isOverdue ? 'var(--color-error)' : 'var(--color-warning)'} />
            <p className="text-sm font-medium" style={{ color: isOverdue ? 'var(--color-error)' : 'var(--color-warning)' }}>
              {isOverdue 
                ? `Overdue by ${Math.abs(daysUntilDue)} days` 
                : `Due in ${daysUntilDue} days (${formatDate(bill?.dueDate)})`}
            </p>
          </div>
        )}

        {isExpanded && (
          <div className="border-t border-border pt-4 mb-4 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Bill Breakdown</h4>
              <div className="space-y-2">
                {bill?.breakdown?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item?.description}</span>
                    <span className="font-medium text-foreground data-text">{formatCurrency(item?.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {bill?.paymentHistory && bill?.paymentHistory?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Payment History</h4>
                <div className="space-y-2">
                  {bill?.paymentHistory?.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon name="CheckCircle2" size={16} color="var(--color-success)" />
                        <span className="text-muted-foreground">{formatDate(payment?.date)}</span>
                      </div>
                      <span className="font-medium text-foreground data-text">{formatCurrency(payment?.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bill?.notes && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground">{bill?.notes}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <Button
            variant="outline"
            size="sm"
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
            onClick={() => setIsExpanded(!isExpanded)}
            fullWidth
            className="sm:flex-1"
          >
            {isExpanded ? 'Show Less' : 'View Details'}
          </Button>
          
          {bill?.status !== 'paid' && (
            <Button
              variant="default"
              size="sm"
              iconName="CreditCard"
              iconPosition="left"
              onClick={() => onPayment(bill)}
              fullWidth
              className="sm:flex-1"
            >
              Make Payment
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            iconName="AlertCircle"
            onClick={() => onDispute(bill)}
            className="sm:w-auto"
          >
            Dispute
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillCard;