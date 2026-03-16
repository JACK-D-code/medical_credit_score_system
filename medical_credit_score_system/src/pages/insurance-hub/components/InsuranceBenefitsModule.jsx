import React from 'react';
import Icon from '../../../components/AppIcon';

const InsuranceBenefitsModule = () => {
    return (
        <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-background border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 shrink-0 bg-primary/20 rounded-2xl flex items-center justify-center text-primary rotate-3">
                <Icon name="TrendingUp" size={32} />
            </div>
            <div>
                <h4 className="text-lg font-bold text-foreground mb-2">Why link your insurance?</h4>
                <p className="text-sm text-muted-foreground">
                    Our credit engine factors in your insurance coverage as "Income Stability & Protection". Patients with verified insurance are heavily favored for immediate treatment EMI approvals and zero-interest medical loans because the insurance acts as a safety net.
                </p>
            </div>
        </div>
    );
};

export default InsuranceBenefitsModule;
