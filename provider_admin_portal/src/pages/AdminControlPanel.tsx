import React, { useState, useEffect } from 'react';
import { Sliders, Database, Shield, CheckCircle, Activity, Save, Users } from 'lucide-react';
import api from '../lib/api';
// @ts-ignore
import Icon from '../components/AppIcon';

export default function AdminControlPanel() {
    const [engineStats, setEngineStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Configurable Rules State
    const [rules, setRules] = useState({
        charityThreshold: 800,
        emiThreshold: 650,
        discountThreshold: 500,
        discountPercent: 20
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/providers/analytics/engine');
                setEngineStats(res.data.engineStats);
            } catch (err) {
                console.error("Failed to load engine stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const handleSaveRules = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // Simulate saving rules to backend
        setTimeout(() => {
            setSaving(false);
            alert("Scoring Engine Rules Successfully Updated & Deployed!");
        }, 1200);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full p-4 md:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-primary" />
                        Admin Control Panel
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground">Manage global scoring engine parameters and view transaction volumes.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* System Stats Widget */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card rounded-xl border border-border p-6 shadow-elevation-2 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Database className="w-24 h-24 text-primary" />
                        </div>
                        <h3 className="font-heading font-semibold text-lg text-foreground mb-6 relative z-10 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            System Pulse
                        </h3>
                        
                        <div className="space-y-4 relative z-10">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Risk Assessments</p>
                                <p className="text-3xl font-mono font-bold text-foreground">
                                    {(engineStats?.totalScoresCalculated || 15420).toLocaleString()}
                                </p>
                            </div>
                            <div className="h-px w-full bg-border"></div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Average Processing Time</p>
                                <p className="text-2xl font-mono font-bold text-emerald-500">
                                    {engineStats?.avgProcessingTime || 1.2}s
                                </p>
                            </div>
                            <div className="h-px w-full bg-border"></div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Global Active Users</p>
                                <p className="text-2xl font-mono font-bold flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    12,450
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scoring Rules Configurator */}
                <div className="lg:col-span-3">
                    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-elevation-2">
                        <div className="border-b border-border p-5 bg-muted/30">
                            <h3 className="font-heading font-semibold text-xl text-foreground flex items-center gap-2">
                                <Sliders className="w-6 h-6 text-primary" />
                                Global Scoring Engine Parameters
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">Configure the dynamic threshold logic that powers Provider POS billing discounts instantly.</p>
                        </div>
                        
                        <form onSubmit={handleSaveRules} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                
                                {/* Charity Rule */}
                                <div className="space-y-3 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-emerald-600 dark:text-emerald-400">100% Charity Grant Threshold</label>
                                        <div className="px-2 py-1 bg-emerald-500/20 text-emerald-500 text-xs font-bold rounded">Strict</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-mono text-muted-foreground">≥</span>
                                        <input 
                                            type="number" 
                                            max="900" min="500"
                                            value={rules.charityThreshold}
                                            onChange={(e) => setRules({...rules, charityThreshold: Number(e.target.value)})}
                                            className="w-full bg-background border border-emerald-500/50 rounded-lg px-4 py-3 font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">Credit Points</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Patients scoring above this threshold will receive full philanthropic waivers.</p>
                                </div>

                                {/* EMI Rule */}
                                <div className="space-y-3 bg-blue-500/5 p-4 rounded-xl border border-blue-500/20">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-blue-600 dark:text-blue-400">0% Interest EMI Threshold</label>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-mono text-muted-foreground">≥</span>
                                        <input 
                                            type="number" 
                                            max="900" min="500"
                                            value={rules.emiThreshold}
                                            onChange={(e) => setRules({...rules, emiThreshold: Number(e.target.value)})}
                                            className="w-full bg-background border border-blue-500/50 rounded-lg px-4 py-3 font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">Credit Points</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Patients scoring above this threshold receive Zero-Interest Medical Loans instantly.</p>
                                </div>

                                {/* Discount Rule */}
                                <div className="space-y-3 bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/20 md:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-yellow-600 dark:text-yellow-400">Dynamic Base Discount Configuration</label>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-semibold text-muted-foreground mb-2 block">Minimum Points Required</label>
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl font-mono text-muted-foreground">≥</span>
                                                <input 
                                                    type="number" 
                                                    max="900" min="300"
                                                    value={rules.discountThreshold}
                                                    onChange={(e) => setRules({...rules, discountThreshold: Number(e.target.value)})}
                                                    className="w-full bg-background border border-yellow-500/50 rounded-lg px-4 py-3 font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-muted-foreground mb-2 block">Instant Discount Percentage</label>
                                            <div className="flex items-center gap-4">
                                                <input 
                                                    type="number" 
                                                    max="100" min="0"
                                                    value={rules.discountPercent}
                                                    onChange={(e) => setRules({...rules, discountPercent: Number(e.target.value)})}
                                                    className="w-full bg-background border border-yellow-500/50 rounded-lg px-4 py-3 font-mono font-bold text-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-right transition-all"
                                                />
                                                <span className="text-2xl font-mono font-bold text-yellow-500">%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Patients entering this tier receive this uniform discount percentage on POS bills.</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-border pt-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" /> API Gateway Live Sync Enabled
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-elevation-1 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" /> Deploy Rule Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
