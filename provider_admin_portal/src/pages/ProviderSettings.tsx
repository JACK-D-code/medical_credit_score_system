import { useState } from 'react';
import { Building2, Server, Shield, Users, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProviderSettings() {
    const [activeTab, setActiveTab] = useState('facility');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1200);
    };

    return (
        <div className="w-full h-full p-4 md:p-6 lg:p-8 space-y-8 max-w-[1200px] mx-auto animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight mb-2">System Settings</h1>
                    <p className="text-muted-foreground font-medium">Configure hospital network parameters, API keys, and FinTech integrations.</p>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <div className="flex items-center gap-2 text-success animate-in fade-in slide-in-from-right-4 font-bold text-sm bg-success/10 px-3 py-1.5 rounded-lg border border-success/20">
                            <CheckCircle2 size={16} /> Saved Successfully
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-gradient-to-r from-primary to-[#8b5cf6] hover:opacity-90 text-white font-bold rounded-lg shadow-[0_4px_14px_rgba(139,92,246,0.3)] transition-all active:scale-95 text-sm flex items-center justify-center gap-2 min-w-[140px]"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Vertical Navigation Tabs */}
                <div className="md:col-span-3 space-y-2">
                    <button
                        onClick={() => setActiveTab('facility')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'facility' ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'}`}
                    >
                        <Building2 size={18} className={activeTab === 'facility' ? 'text-primary' : 'opacity-70'} />
                        Facility Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('api')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'api' ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'}`}
                    >
                        <Server size={18} className={activeTab === 'api' ? 'text-primary' : 'opacity-70'} />
                        API & Webhooks
                    </button>
                    <button
                        onClick={() => setActiveTab('underwriting')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'underwriting' ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'}`}
                    >
                        <Shield size={18} className={activeTab === 'underwriting' ? 'text-primary' : 'opacity-70'} />
                        Risk Engine Policy
                    </button>
                    <button
                        onClick={() => setActiveTab('staff')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'staff' ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent'}`}
                    >
                        <Users size={18} className={activeTab === 'staff' ? 'text-primary' : 'opacity-70'} />
                        Staff Roles (RBAC)
                    </button>
                </div>

                {/* Main Settings Content Area */}
                <div className="md:col-span-9 bg-card border border-border rounded-2xl shadow-elevation-2 flex-grow overflow-hidden">

                    {/* Facility Profile Tab */}
                    {activeTab === 'facility' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="p-6 border-b border-border bg-muted/20">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2 pr-2">
                                    <Building2 className="text-primary" size={20} /> Facility Information
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">Manage public hospital details displayed to patients during checkout.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">Hospital Legal Name</label>
                                        <input type="text" defaultValue="Apollo FinTech Memorial" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">Entity ID / Tax Code</label>
                                        <input type="text" defaultValue="HOS-IN-994191" disabled className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-muted-foreground opacity-70 cursor-not-allowed font-mono" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-foreground mb-2">Billing Address</label>
                                        <textarea defaultValue="Block 3, Health Tech Park, Sector 44, Gurugram" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm min-h-[100px] resize-none"></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">Primary Contact Phone</label>
                                        <input type="text" defaultValue="+91 800 555 1290" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">Patient Support Email</label>
                                        <input type="email" defaultValue="billing-support@apollo.dev" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* API & Integrations Tab */}
                    {activeTab === 'api' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="p-6 border-b border-border bg-muted/20 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2 pr-2">
                                        <Server className="text-primary" size={20} /> FinTech Credit API Integrations
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">Manage secure webhook endpoints and smart contract keys.</p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-success/10 text-success border border-success/20">API SECURE</span>
                            </div>
                            <div className="p-6 space-y-8">
                                <div>
                                    <label className="flex items-center justify-between text-sm font-semibold text-foreground mb-2">
                                        Production Secret Key
                                        <button className="text-primary text-xs hover:underline">Rotate Key</button>
                                    </label>
                                    <div className="flex gap-2">
                                        <input type="password" defaultValue="sk_live_94uXm2Lps01xYz" readOnly className="flex-1 bg-muted border border-border rounded-xl px-4 py-2.5 text-sm font-mono text-muted-foreground opacity-70 cursor-default" />
                                        <button className="px-4 py-2.5 bg-background border border-border hover:bg-muted text-foreground rounded-xl text-sm font-bold shadow-sm transition-colors">Copy</button>
                                    </div>
                                </div>

                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                                    <h3 className="font-bold text-foreground text-sm mb-3">Live Webhook Endpoints</h3>
                                    <div className="space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-background border border-border rounded-lg shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_5px_rgba(var(--color-success-rgb),0.8)]"></div>
                                                <span className="font-mono text-xs text-foreground font-semibold">https://api.hospital.com/webhooks/emi-cleared</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded">Receiving</span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-background border border-border rounded-lg shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_5px_rgba(var(--color-success-rgb),0.8)]"></div>
                                                <span className="font-mono text-xs text-foreground font-semibold">https://api.hospital.com/webhooks/default-alert</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded">Receiving</span>
                                        </div>
                                    </div>
                                    <button className="mt-4 text-sm font-bold text-primary hover:underline flex items-center gap-1">+ Add New Endpoint</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Risk Engine Policy Tab */}
                    {activeTab === 'underwriting' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="p-6 border-b border-border bg-muted/20">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2 pr-2">
                                    <Shield className="text-primary" size={20} /> Underwriting Engine Policy
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">Configure systemic risk tolerances for automatic EMI approval generation.</p>
                            </div>
                            <div className="p-6 space-y-6">

                                <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-start gap-3">
                                    <AlertCircle className="text-warning flex-shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-sm font-bold text-warning-foreground mb-1">Strict Liability Warning</p>
                                        <p className="text-xs text-warning-foreground/80 leading-relaxed">Lowering the automatic approval score threshold increases the hospital's systemic default exposure. Ensure adequate capital reserves before proceeding.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-background shadow-sm hover:border-primary/30 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-foreground text-sm">Auto-Approval Credit Score Threshold</h4>
                                            <p className="text-xs text-muted-foreground mt-0.5">Patients above this score bypass manual underwriting for standard treatments.</p>
                                        </div>
                                        <input type="number" defaultValue="680" className="w-24 bg-muted border border-border rounded-lg px-3 py-2 text-center text-sm font-bold font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-background shadow-sm hover:border-primary/30 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-foreground text-sm">Maximum Financed Liability Limit</h4>
                                            <p className="text-xs text-muted-foreground mt-0.5">The highest un-collateralized medical amount the engine will auto-approve.</p>
                                        </div>
                                        <div className="relative w-32">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono font-bold text-sm">₹</span>
                                            <input type="text" defaultValue="5,00,000" className="w-full bg-muted border border-border rounded-lg pl-7 pr-3 py-2 text-right text-sm font-bold font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-background shadow-sm hover:border-primary/30 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-foreground text-sm">0% EMI Marketing Toggle</h4>
                                            <p className="text-xs text-muted-foreground mt-0.5">Actively promote zero-interest loans to high-tier (Excellent/750+) patients.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Staff & RBAC Tab */}
                    {activeTab === 'staff' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="p-6 border-b border-border bg-muted/20">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2 pr-2">
                                    <Users className="text-primary" size={20} /> Staff Directory & Roles
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">Manage network access, clinical viewing rights, and internal administrative privileges.</p>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left">
                                    <thead className="bg-background border-b border-border">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">User Name</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        <tr className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-foreground text-sm">Dr. A. Smith</td>
                                            <td className="px-6 py-4"><span className="px-2.5 py-1 text-xs font-bold bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20 rounded-md">Super Admin</span></td>
                                            <td className="px-6 py-4"><span className="text-xs font-bold text-success flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-success rounded-full"></div> Active</span></td>
                                        </tr>
                                        <tr className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-foreground text-sm">V. Patel</td>
                                            <td className="px-6 py-4"><span className="px-2.5 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-md">Financial Underwriter</span></td>
                                            <td className="px-6 py-4"><span className="text-xs font-bold text-success flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-success rounded-full"></div> Active</span></td>
                                        </tr>
                                        <tr className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-foreground text-sm">J. Doe</td>
                                            <td className="px-6 py-4"><span className="px-2.5 py-1 text-xs font-bold bg-muted text-muted-foreground border border-border rounded-md">Billing Clerk</span></td>
                                            <td className="px-6 py-4"><span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div> Inactive</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="p-4 border-t border-border flex justify-center bg-background">
                                    <button className="text-sm font-bold text-primary hover:underline">+ Invite New Staff Member</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
