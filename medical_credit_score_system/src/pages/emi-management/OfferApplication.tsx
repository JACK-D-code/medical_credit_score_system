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

export default function OfferApplication() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        phid: '',
        offerType: 'EMI',
        amount: '',
        description: ''
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
            await api.post('/claims/offer', {
                ...formData,
                amount: formData.amount ? parseFloat(formData.amount) : null
            });
            setSuccess(true);
            setTimeout(() => navigate('/medical-credit-dashboard'), 2500);
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to apply for offer. Please try again.");
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
                            Medical Financing Hub
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">Unlock exclusive EMI plans and medical loans via your credit score.</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl shadow-elevation-2 overflow-hidden">
                    <div className="p-1 bg-gradient-to-r from-primary/40 to-secondary/40"></div>
                    
                    <div className="p-6 md:p-10">
                        {success ? (
                            <div className="py-12 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                    <Icon name="PartyPopper" size={48} color="var(--color-primary)" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-3">Application Submitted!</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    Our finance partners are reviewing your proposal. You will receive a notification once the approval is finalized.
                                </p>
                                <div className="mt-8">
                                    <Icon name="Loader2" size={24} className="animate-spin text-muted-foreground" />
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Financial Product</label>
                                        <div className="relative group">
                                            <select 
                                                className="w-full bg-muted/30 border border-border text-foreground p-4 pr-10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer group-hover:bg-muted/50"
                                                value={formData.offerType}
                                                onChange={(e) => setFormData({...formData, offerType: e.target.value})}
                                            >
                                                <option value="EMI">Zero-Interest EMI Plan (12 Months)</option>
                                                <option value="LOAN">Instant Medical Loan (Up to ₹5L)</option>
                                                <option value="DISCOUNT">Direct Hospital Service Discount</option>
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
                                    </div>
                                </section>

                                {formData.offerType !== 'DISCOUNT' && (
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Requested Capital (₹)</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">₹</div>
                                            <input 
                                                type="number"
                                                required
                                                min="1000"
                                                placeholder="e.g. 75000"
                                                className="w-full bg-muted/30 border border-border text-foreground p-4 pl-10 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Medical Necessity / Description</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        placeholder="Explain the medical situation requiring this support (e.g. Diagnostic surgery at City Hospital)..."
                                        className="w-full bg-muted/30 border border-border text-foreground p-5 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none placeholder:text-muted-foreground/50"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <Button 
                                        type="submit"
                                        disabled={loading || !formData.phid}
                                        variant="default"
                                        className="w-full py-6 rounded-xl font-bold text-xl shadow-elevation-2"
                                        iconName={loading ? "Loader2" : "CheckSquare"}
                                        iconPosition="right"
                                    >
                                        {loading ? 'Evaluating Proposal...' : 'Register Application'}
                                    </Button>
                                    <p className="text-center text-xs text-muted-foreground mt-4 italic">
                                        Calculated eligibility is based on your live credit score of 720+
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
