import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentPlanCard = ({ bill, onCreatePlan, onCancel }) => {
  const [planData, setPlanData] = useState({
    duration: '6',
    frequency: 'monthly',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0],
    downPayment: ''
  });

  const durationOptions = [
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '12 Months' },
    { value: '18', label: '18 Months' },
    { value: '24', label: '24 Months' }
  ];

  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const calculateInstallment = () => {
    const totalAmount = bill?.patientResponsibility;
    const downPayment = parseFloat(planData?.downPayment) || 0;
    const remainingAmount = totalAmount - downPayment;
    
    let numberOfPayments;
    switch (planData?.frequency) {
      case 'weekly':
        numberOfPayments = parseInt(planData?.duration) * 4;
        break;
      case 'biweekly':
        numberOfPayments = parseInt(planData?.duration) * 2;
        break;
      case 'monthly':
      default:
        numberOfPayments = parseInt(planData?.duration);
    }

    return remainingAmount / numberOfPayments;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const installmentAmount = calculateInstallment();
    
    onCreatePlan({
      ...planData,
      billId: bill?.id,
      totalAmount: bill?.patientResponsibility,
      installmentAmount,
      remainingAmount: bill?.patientResponsibility - (parseFloat(planData?.downPayment) || 0)
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-elevation-2 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Icon name="Calendar" size={24} color="var(--color-secondary)" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-foreground">Create Payment Plan</h3>
          <p className="text-sm text-muted-foreground caption">Set up installment payments</p>
        </div>
      </div>
      <div className="bg-muted rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Bill Amount</span>
          <span className="text-lg font-semibold text-foreground data-text">
            {formatCurrency(bill?.patientResponsibility)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Provider</span>
          <span className="text-sm font-medium text-foreground">{bill?.providerName}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Down Payment (Optional)"
          type="number"
          placeholder="0.00"
          value={planData?.downPayment}
          onChange={(e) => setPlanData({ ...planData, downPayment: e?.target?.value })}
          description="Initial payment to reduce installment amount"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Plan Duration"
            options={durationOptions}
            value={planData?.duration}
            onChange={(value) => setPlanData({ ...planData, duration: value })}
            required
          />

          <Select
            label="Payment Frequency"
            options={frequencyOptions}
            value={planData?.frequency}
            onChange={(value) => setPlanData({ ...planData, frequency: value })}
            required
          />
        </div>

        <Input
          label="First Payment Date"
          type="date"
          value={planData?.startDate}
          onChange={(e) => setPlanData({ ...planData, startDate: e?.target?.value })}
          required
        />

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Payment Summary</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Down Payment</span>
              <span className="font-medium text-foreground data-text">
                {formatCurrency(parseFloat(planData?.downPayment) || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Remaining Amount</span>
              <span className="font-medium text-foreground data-text">
                {formatCurrency(bill?.patientResponsibility - (parseFloat(planData?.downPayment) || 0))}
              </span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {planData?.frequency?.charAt(0)?.toUpperCase() + planData?.frequency?.slice(1)} Payment
                </span>
                <span className="text-xl font-bold text-primary data-text">
                  {formatCurrency(calculateInstallment())}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            variant="default"
            iconName="Check"
            iconPosition="left"
            fullWidth
            className="sm:flex-1"
          >
            Create Payment Plan
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            fullWidth
            className="sm:flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPlanCard;