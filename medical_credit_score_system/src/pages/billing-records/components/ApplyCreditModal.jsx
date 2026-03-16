import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ApplyCreditModal = ({ isOpen, onClose, record, onSubmit }) => {
    const [months, setMonths] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !record) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!months || months < 1) return;
        setIsSubmitting(true);
        await onSubmit({ months: parseInt(months) });
        setIsSubmitting(false);
    };

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-xl shadow-elevation-4 border border-border overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="CreditCard" size={20} color="var(--color-primary)" />
                        </div>
                        <div>
                            <h2 className="text-lg font-heading font-semibold text-foreground">Apply for Medical Credit</h2>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                Instant Processing
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-smooth p-2 rounded-full hover:bg-muted"
                    >
                        <Icon name="X" size={20} />
                    </button>
                </div>

                <div className="p-4 md:p-6 bg-muted/30">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Outstanding Balance</span>
                        <span className="font-mono font-bold text-xl text-foreground">
                            {formatINR(record.outstanding)}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground pb-4 border-b border-border">
                        {record.hospitalName} - {record.treatmentType}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Select EMI Term (Months)
                            </label>
                            <select
                                value={months}
                                onChange={(e) => setMonths(e.target.value)}
                                required
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="" disabled>Choose Installment Period</option>
                                <option value="3">3 Months (0% Interest for Avg Scores)</option>
                                <option value="6">6 Months</option>
                                <option value="12">12 Months</option>
                                <option value="24">24 Months</option>
                            </select>
                        </div>

                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                            <div className="flex items-start space-x-3">
                                <Icon name="ShieldCheck" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground">
                                    By applying, you authorize the Medical Credit Engine to evaluate your real-time health and financial profile to determine eligibility and interest rates.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-4 border-t border-border">
                        <Button
                            type="button"
                            variant="outline"
                            fullWidth
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="default"
                            fullWidth
                            loading={isSubmitting}
                            iconName="ArrowRight"
                            iconPosition="right"
                            iconSize={18}
                        >
                            Verify Eligibility
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyCreditModal;
