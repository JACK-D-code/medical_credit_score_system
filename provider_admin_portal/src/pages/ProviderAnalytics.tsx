import { useState, useEffect } from 'react';
import { Activity, BrainCircuit, AlertTriangle, TrendingUp, ShieldCheck, Download, ChevronRight } from 'lucide-react';
import api from '../lib/api';

export default function ProviderAnalytics() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/providers/analytics');
                setAnalytics(res.data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground font-medium">Computing Risk Aggregations...</p>
            </div>
        );
    }

    const { distribution, capitalProtected, threats } = analytics || {
        distribution: { excellent: 0, good: 0, fair: 0, highRisk: 0 },
        capitalProtected: 0,
        threats: []
    };

    return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight mb-2">Portfolio Risk & AI Analytics</h1>
                <p className="text-muted-foreground font-medium">Predictive FinTech credit mapping and global hospital default analysis.</p>
            </div>
            <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-background border border-border hover:bg-muted text-foreground font-semibold rounded-lg transition-colors shadow-sm text-sm flex items-center gap-2">
                    <Download size={16} className="text-muted-foreground" />
                    Export Report
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-primary to-[#8b5cf6] hover:opacity-90 text-white font-bold rounded-lg shadow-[0_4px_14px_rgba(139,92,246,0.3)] transition-all active:scale-95 text-sm flex items-center gap-2">
                    <BrainCircuit size={18} />
                    Run AI Inference
                </button>
            </div>
        </div>

        {/* AI Top Insight Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-[#8b5cf6]/10 to-transparent border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12 -translate-x-10"></div>

            <div className="w-14 h-14 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)]">
                <BrainCircuit size={28} className="text-primary animate-pulse" />
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    AI Inference Complete <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">High Confidence</span>
                </h3>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                    The neural network predicts a <span className="font-bold text-foreground">22% reduction in debt default</span> over the next 90 days. The recent deployment of dynamic 0% EMI schedules to Fair-Risk patients has successfully decentralized credit strain.
                </p>
            </div>
            <button className="px-5 py-2.5 bg-background border border-border hover:bg-muted font-bold text-sm text-foreground rounded-xl transition-colors shadow-sm whitespace-nowrap hidden lg:block">
                View Network Weights
            </button>
        </div>

        {/* Grid Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Global Risk Distribution Card */}
            <div className="bg-card border border-border rounded-2xl shadow-elevation-1 p-6 lg:col-span-2 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2 pr-2">
                            <Activity className="text-primary" size={20} /> Macro Risk Distribution
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Hospital-wide patient credit density (Trailing 30 Days).</p>
                    </div>
                    <select className="bg-background border border-border text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm hidden md:block">
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>YTD</option>
                    </select>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-8">
                    {/* Custom Bar Graphs simulating Recharts aesthetics */}

                    {/* Row 1 */}
                    <div className="space-y-2 group">
                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-success flex items-center gap-1.5"><ShieldCheck size={16} /> Excellent Range (750-850)</span>
                            <span className="text-foreground">{distribution?.excellent || 0}%</span>
                        </div>
                        <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden flex">
                            <div className="h-full bg-gradient-to-r from-success/80 to-success transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(var(--color-success-rgb),0.5)]" style={{ width: `${distribution?.excellent || 0}%` }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Auto-Approved for 24-Mo 0% EMI Options.</p>
                    </div>

                    {/* Row 2 */}
                    <div className="space-y-2 group">
                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-[#8b5cf6] flex items-center gap-1.5"><TrendingUp size={16} /> Good Range (680-749)</span>
                            <span className="text-foreground">{distribution?.good || 0}%</span>
                        </div>
                        <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden flex">
                            <div className="h-full bg-gradient-to-r from-[#8b5cf6]/80 to-[#8b5cf6] transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" style={{ width: `${distribution?.good || 0}%` }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Standard API Underwriting Parameters Apply.</p>
                    </div>

                    {/* Row 3 */}
                    <div className="space-y-2 group">
                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-warning flex items-center gap-1.5"><Activity size={16} /> Fair Range (600-679)</span>
                            <span className="text-foreground">{distribution?.fair || 0}%</span>
                        </div>
                        <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden flex">
                            <div className="h-full bg-gradient-to-r from-warning/80 to-warning transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(var(--color-warning-rgb),0.5)]" style={{ width: `${distribution?.fair || 0}%` }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Requires Manual Underwriter Review.</p>
                    </div>

                    {/* Row 4 */}
                    <div className="space-y-2 group">
                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-destructive flex items-center gap-1.5"><AlertTriangle size={16} /> High Risk (300-599)</span>
                            <span className="text-foreground">{distribution?.highRisk || 0}%</span>
                        </div>
                        <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden flex">
                            <div className="h-full bg-gradient-to-r from-destructive/80 to-destructive transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(var(--color-destructive-rgb),0.5)]" style={{ width: `${distribution?.highRisk || 0}%` }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Declined strictly by FinTech Smart Contract.</p>
                    </div>

                </div>
            </div>

            {/* Right Analytics Sidebar Panel */}
            <div className="space-y-6 flex flex-col">

                {/* Predictive Recovery Metric */}
                <div className="bg-card border border-border rounded-2xl shadow-elevation-1 p-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-success/5 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-success/10 rounded-full"></div>
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Capital Protected by Engine</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                        <h2 className="text-4xl font-black text-foreground font-mono">₹{(capitalProtected / 100000).toFixed(2)}L</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Total value of medical capital secured by our predictive EMI risk engine instead of resulting in outright bad-debt.
                    </p>
                </div>

                {/* Threat / Default Alert List */}
                <div className="bg-card border border-border rounded-2xl shadow-elevation-1 flex-1 flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-border bg-muted/20">
                        <h3 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                            <AlertTriangle size={16} className="text-warning" /> Active Default Threats
                        </h3>
                    </div>
                    <div className="p-0 overflow-y-auto">
                        {threats && threats.length > 0 ? threats.map((alert: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group">
                                <div>
                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{alert.id}</p>
                                    <p className="text-xs text-muted-foreground font-medium">{alert.dep} • {alert.amt}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-destructive/10 text-destructive mb-1">
                                        {alert.prob} PROBABILITY
                                    </span>
                                    <div className="flex justify-end">
                                        <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-6 text-center text-sm font-medium text-muted-foreground">
                                No active default threats detected crossing systemic thresholds.
                            </div>
                        )}
                    </div>
                    <div className="p-3 bg-muted/20 border-t border-border mt-auto">
                        <button className="w-full text-xs font-bold text-muted-foreground hover:text-foreground transition-colors text-center py-1">View Full Threat Matrix</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
    );
}
