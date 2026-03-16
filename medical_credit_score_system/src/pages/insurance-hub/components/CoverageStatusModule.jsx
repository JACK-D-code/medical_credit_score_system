import React from 'react';
import Icon from '../../../components/AppIcon';

const CoverageStatusModule = ({ linkedPolicies, formatINR }) => {
    return (
        <div className="bg-card rounded-2xl shadow-elevation-2 border border-border p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold flex items-center">
                    <Icon name="ShieldCheck" size={24} className="text-success mr-3" />
                    Active Coverage
                </h3>
                {linkedPolicies.length > 0 && (
                    <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full">
                        Protected
                    </span>
                )}
            </div>

            {linkedPolicies.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-2xl bg-muted/20">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                        <Icon name="SearchX" size={32} />
                    </div>
                    <h4 className="text-lg font-medium text-foreground mb-2">No Policies Linked</h4>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        You haven't linked any health insurance policies yet. Use the form to connect your provider and boost your profile.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {linkedPolicies.map((policy) => (
                        <div key={policy.id} className="relative overflow-hidden bg-gradient-to-br from-card to-muted border border-border rounded-2xl p-6 hover-lift transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-bl-[100px] -z-10"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-1">{policy.provider}</p>
                                    <h4 className="text-xl font-heading font-bold text-foreground font-mono">{policy.policyNumber}</h4>
                                </div>
                                <div className="bg-success/20 p-2 rounded-xl text-success">
                                    <Icon name="Heart" size={20} />
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-border/50">
                                <p className="text-sm text-muted-foreground mb-1">Total Coverage Sum</p>
                                <p className="text-2xl font-bold text-foreground tracking-tight">{formatINR(policy.coverageAmount)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoverageStatusModule;
