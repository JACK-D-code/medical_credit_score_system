import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentModal = ({ isOpen, onClose, record, onSubmit }) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  if (!isOpen || !record) return null;

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const paymentMethodOptions = [
    { value: 'upi', label: 'UPI Payment' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'netbanking', label: 'Net Banking' },
    { value: 'wallet', label: 'Digital Wallet' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit({
      recordId: record?.id,
      amount: parseFloat(paymentAmount),
      method: paymentMethod
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-elevation-5 border border-border w-full max-w-lg overflow-hidden spring-bounce">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading font-semibold text-xl text-foreground">Make Payment</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-smooth press-scale"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} color="currentColor" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hospital</span>
                <span className="font-medium text-foreground">{record?.hospitalName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Bill Amount</span>
                <span className="font-mono font-semibold text-foreground">
                  {formatINR(record?.billAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-medium text-foreground">Outstanding Amount</span>
                <span className="font-mono font-bold text-xl text-error">
                  {formatINR(record?.outstanding)}
                </span>
              </div>
            </div>

            <Input
              type="number"
              label="Payment Amount"
              description={`Maximum: ${formatINR(record?.outstanding)}`}
              placeholder="Enter amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e?.target?.value)}
              required
              min="1"
              max={record?.outstanding}
            />

            <Select
              label="Payment Method"
              description="Choose your preferred payment method"
              options={paymentMethodOptions}
              value={paymentMethod}
              onChange={setPaymentMethod}
              required
            />

            <div className="bg-success/10 rounded-md p-4 flex items-start space-x-3">
              <Icon name="Shield" size={20} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-success mb-1">Secure Payment</p>
                <p className="text-xs text-muted-foreground">
                  Your payment is processed through secure, encrypted channels. This payment will positively impact your medical credit score.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="CreditCard"
              iconPosition="left"
            >
              Proceed to Pay
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;