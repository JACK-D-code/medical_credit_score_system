import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PolicySearchModule = ({ formData, handleChange, handleLinkPolicy, isLinking }) => {
    return (
        <div className="bg-card rounded-2xl shadow-elevation-2 border border-border p-6 relative overflow-hidden group">
            {/* Decorative background blur */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500"></div>

            <h3 className="text-xl font-semibold mb-6 flex items-center relative z-10">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary">
                    <Icon name="ShieldPlus" size={18} />
                </div>
                Link New Policy
            </h3>

            <form onSubmit={handleLinkPolicy} className="relative z-10 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Insurance Provider</label>
                    <select
                        name="provider"
                        value={formData.provider}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 text-foreground appearance-none"
                    >
                        <option value="HDFC Ergo Health">HDFC Ergo Health</option>
                        <option value="Star Health">Star Health and Allied Insurance</option>
                        <option value="Niva Bupa">Niva Bupa Health</option>
                        <option value="Care Health">Care Health Insurance</option>
                        <option value="ICICI Lombard">ICICI Lombard</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Policy Number / Member ID</label>
                    <input
                        type="text"
                        name="policyNumber"
                        value={formData.policyNumber}
                        onChange={handleChange}
                        placeholder="e.g. POL-12345678"
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 text-foreground"
                        required
                    />
                </div>

                <Button
                    type="submit"
                    fullWidth
                    loading={isLinking}
                    iconName="Link"
                    className="mt-4 shadow-lg shadow-primary/20"
                >
                    Verify & Link Policy
                </Button>
            </form>

            <div className="mt-6 flex items-start gap-3 p-3 bg-muted/50 rounded-xl border border-border/50 text-xs text-muted-foreground relative z-10">
                <Icon name="Info" size={16} className="text-primary shrink-0 mt-0.5" />
                <p>Adding verified insurance coverage substantially lowers your risk level calculation in our credit engine.</p>
            </div>
        </div>
    );
};

export default PolicySearchModule;
