import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
// @ts-ignore
import Icon from '../../components/AppIcon';
// @ts-ignore
import Header from '../../components/ui/Header';
// @ts-ignore
import MobileBottomNav from '../../components/ui/MobileBottomNav';
// @ts-ignore
import Button from '../../components/ui/Button';

export default function ClaimCreditPoints() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        phid: '',
        claimType: 'HOSPITAL_VISIT',
        description: '',
        documentUrl: 'health_report_2024_A.pdf'
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.phid) {
            setFormData(prev => ({ ...prev, phid: user.phid }));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/claims/claim', formData);
            setSuccess(true);
            setTimeout(() => navigate('/medical-credit-dashboard'), 2500);
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to submit claim. Please try again.");
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/patient-login');
    };

    return (
        <div className="min-h-screen bg-background pb-20 lg:pb-0">
            <Header onLogout={handleLogout} />

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-12">
                <div className="flex items-center gap-6 mb-10">
                    <button 
                        onClick={() => navigate('/medical-credit-dashboard')} 
                        className="p-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl transition-all shadow-elevation-1"
                    >
                        <Icon name="ArrowLeft" size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                            Claim Bonus Points
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">Enhance your live score with verified health milestones.</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl shadow-elevation-2 overflow-hidden">
                    <div className="p-1 bg-gradient-to-r from-success/40 to-primary/40"></div>
                    
                    <div className="p-6 md:p-10">
                        {success ? (
                            <div className="py-12 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
                                    <Icon name="CheckCircle" size={48} color="var(--color-success)" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-3">Claim Successfully Logged!</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    Our credit engine is verifying your activity. Your dashboard will reflect the updated score shortly.
                                </p>
                                <div className="mt-8">
                                    <Icon name="Loader2" size={24} className="animate-spin text-muted-foreground" />
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Activity Category</label>
                                        <div className="relative group">
                                            <select 
                                                className="w-full bg-muted/30 border border-border text-foreground p-4 pr-10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer group-hover:bg-muted/50"
                                                value={formData.claimType}
                                                onChange={(e) => setFormData({...formData, claimType: e.target.value})}
                                            >
                                                <option value="HOSPITAL_VISIT">Annual Checkup / Wellness Visit</option>
                                                <option value="PAST_PAYMENT">Previous Hospital Dues Clearance</option>
                                                <option value="HEALTH_ACTIVITY">Fitness Milestone / Lab Result</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                <Icon name="ChevronDown" size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Verified PH-ID</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                                                <Icon name="Shield" size={18} />
                                            </div>
                                            <input 
                                                type="text"
                                                readOnly
                                                className="w-full bg-muted/10 border border-border text-foreground p-4 pl-12 rounded-xl font-mono tracking-widest uppercase opacity-70 cursor-not-allowed"
                                                value={formData.phid || "LINK REQUIRED"}
                                            />
                                        </div>
                                        {!formData.phid && (
                                            <p className="text-xs text-error font-medium">Please link your PH-ID in Profile Management first.</p>
                                        )}
                                    </div>
                                </section>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Activity Details</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        placeholder="Describe your recent health activity or hospital engagement..."
                                        className="w-full bg-muted/30 border border-border text-foreground p-5 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none placeholder:text-muted-foreground/50"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    ></textarea>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Attached Evidence (Auto-generated)</label>
                                    <div className="border border-border bg-muted/20 rounded-xl p-6 flex items-center justify-between group hover:bg-muted/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                <Icon name="FileText" size={24} />
                                            </div>
                                            <div>
                                                <p className="font-heading font-semibold text-foreground">{formData.documentUrl}</p>
                                                <p className="text-xs text-muted-foreground">PDF Document • 2.4 MB</p>
                                            </div>
                                        </div>
                                        <Icon name="Eye" size={20} className="text-muted-foreground group-hover:text-primary transition-all cursor-pointer" />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button 
                                        type="submit"
                                        disabled={loading || !formData.phid}
                                        variant="default"
                                        className="w-full py-6 rounded-xl font-bold text-xl shadow-elevation-2"
                                        iconName={loading ? "Loader2" : "ArrowUpRight"}
                                        iconPosition="right"
                                    >
                                        {loading ? 'Processing Claim...' : 'Publish Verification Claim'}
                                    </Button>
                                    <p className="text-center text-xs text-muted-foreground mt-4 italic">
                                        Submitting false information may lead to a permanent scoring penalty.
                                    </p>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <MobileBottomNav />
        </div>
    );
}
