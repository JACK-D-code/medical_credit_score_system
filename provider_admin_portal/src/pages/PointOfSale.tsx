import React, { useState } from 'react';
import api from '../lib/api';
import Icon from '../components/AppIcon';

const PointOfSale = () => {
    const [phidInput, setPhidInput] = useState('');
    const [patientInfo, setPatientInfo] = useState<any>(null);
    const [billAmount, setBillAmount] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [billingDetails, setBillingDetails] = useState<any>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPatientInfo(null);
        setSuccessMessage('');
        setBillingDetails(null);
        
        try {
            const res = await api.post('/pos/verify', { phid: phidInput.trim().toUpperCase() });
            setPatientInfo(res.data.patient);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to verify PH-ID');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        if (!billAmount || billAmount <= 0) {
            setError("Please enter a valid bill amount.");
            return;
        }

        if (billAmount > patientInfo.preApprovedLimit) {
            setError("Bill Amount exceeds Pre-Approved Limit. Needs Supervisor override or Co-signer.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await api.post('/pos/checkout', {
                phid: patientInfo.phid,
                billAmount: Number(billAmount),
                description
            });
            setSuccessMessage(res.data.message);
            setTransactionId(res.data.transactionId);
            setBillingDetails(res.data.billingDetails);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to process checkout');
        } finally {
            setLoading(false);
        }
    };

    const isApprovable = billAmount !== '' && Number(billAmount) <= (patientInfo?.preApprovedLimit || 0);

    const getCheckoutActionText = () => {
        if (!patientInfo) return 'Pending Patient Scan';
        if (!isApprovable) return 'Exceeds Pre-Approved Limit';
        
        const score = patientInfo.score || 0;
        if (score >= 800) return 'Approve 100% Charity Sponsorship (Waive Bill)';
        if (score >= 650) return 'Approve 0% Interest EMI Medical Loan';
        if (score >= 500) return 'Apply 20% Credit Discount';
        return 'Process Standard Medical Bill';
    };

    return (
        <div className="flex-1 w-full p-4 md:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3 flex items-center gap-3">
                    <span className="p-2 bg-primary/10 rounded-xl">
                        <Icon name="Terminal" size={32} className="text-primary" />
                    </span>
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Hospital Point-of-Sale Terminal
                    </span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-3xl">
                    Scan a Patient Health ID to instantly retrieve medical credit limits and grant dynamic financial assistance.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Scanner & Patient Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card rounded-2xl shadow-elevation-2 border border-border p-6 relative overflow-hidden group">
                        <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
                        
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 relative z-10">
                            <Icon name="QrCode" size={20} className="text-primary" />
                            Scan PH-ID
                        </h3>
                        
                        <form onSubmit={handleVerify} className="relative z-10 space-y-4">
                            <input 
                                type="text" 
                                value={phidInput}
                                onChange={(e) => setPhidInput(e.target.value)}
                                placeholder="e.g. PH-1A2B3"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 font-mono text-lg uppercase focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                required
                            />
                            <button 
                                type="submit" 
                                disabled={loading || !phidInput}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : 'Verify Identity'}
                            </button>
                        </form>
                        {error && <p className="text-destructive text-sm mt-3 flex items-center gap-1"><Icon name="AlertTriangle" size={14} /> {error}</p>}
                    </div>

                    {patientInfo && (
                        <div className="bg-card border-2 border-primary/50 rounded-2xl p-6 shadow-elevation-3 animate-in slide-in-from-left duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
                            
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Identity Verified</p>
                                    <h2 className="text-2xl font-bold text-foreground">{patientInfo.name}</h2>
                                    <p className="font-mono text-muted-foreground mt-1 text-sm">{patientInfo.phid} • {patientInfo.tier}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Live Score</p>
                                    <p className="text-3xl font-black text-primary">{patientInfo.score}</p>
                                </div>
                            </div>
                            
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 text-center transition-transform hover:scale-[1.02]">
                                <p className="text-xs text-primary uppercase tracking-widest font-bold mb-1">Pre-Approved Medical Limit</p>
                                <p className="text-4xl font-black text-foreground">
                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(patientInfo.preApprovedLimit)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Center & Right: Checkout Console */}
                <div className={`lg:col-span-2 transition-all duration-500 ${patientInfo ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none scale-[0.98]'}`}>
                    <div className="bg-card rounded-2xl shadow-elevation-2 border border-border p-8 h-full flex flex-col relative overflow-hidden">
                        {patientInfo && !successMessage && (
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 rotate-12 pointer-events-none">
                                <Icon name="ShoppingCart" size={200} />
                            </div>
                        )}
                        
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                           <Icon name="CreditCard" size={24} className="text-accent" />
                           Transaction Console
                        </h2>

                        {successMessage ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-success/5 rounded-2xl border border-success/20 animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(var(--color-success-rgb),0.3)] animate-bounce">
                                    <Icon name="Check" size={40} className="text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-2">Transaction Authorized</h3>
                                <p className="text-muted-foreground text-lg mb-8">{successMessage}</p>
                                
                                {billingDetails && (
                                    <div className="w-full max-w-sm bg-background/50 backdrop-blur border border-border rounded-xl p-6 mb-8 text-left shadow-xl">
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>Base Amount</span>
                                                <span className="font-mono">₹{billingDetails.originalAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-success font-bold">
                                                <span>MediCredit Discount</span>
                                                <span className="font-mono">- ₹{billingDetails.discount.toLocaleString()}</span>
                                            </div>
                                            <div className="h-px bg-border my-4"></div>
                                            <div className="flex justify-between items-center font-bold text-2xl">
                                                <span>Final Due</span>
                                                <span className="text-foreground">₹{billingDetails.finalAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <p className="font-mono text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">TXN ID: {transactionId}</p>
                                <button 
                                    onClick={() => {
                                        setPatientInfo(null);
                                        setSuccessMessage('');
                                        setBillingDetails(null);
                                        setPhidInput('');
                                        setBillAmount('');
                                        setDescription('');
                                    }}
                                    className="mt-10 px-10 py-4 bg-primary text-primary-foreground rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                                >
                                    Process New Patient
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">Billing Details</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-2xl">₹</span>
                                            <input 
                                                type="number" 
                                                value={billAmount}
                                                onChange={(e) => setBillAmount(Number(e.target.value) || '')}
                                                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-5 text-3xl font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none transition-all placeholder:text-muted/30"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground px-1 italic">Enter the total hospital service cost before discounts.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">Procedure Summary</label>
                                        <textarea 
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-4 text-foreground focus:ring-2 focus:ring-accent/50 outline-none transition-all h-[92px] resize-none"
                                            placeholder="e.g. Specialized Cardiac Consultation and Diagnostic Lab Work"
                                        />
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 border-t border-border">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Available Credit Ceiling</p>
                                            <p className={`text-2xl font-bold ${isApprovable ? 'text-success' : 'text-destructive'}`}>
                                                ₹{(patientInfo?.preApprovedLimit || 0).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-sm text-muted-foreground">MediCredit Action Plan</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`w-3 h-3 rounded-full ${isApprovable ? 'bg-success animate-pulse' : 'bg-destructive'}`}></div>
                                                <p className="text-lg font-bold text-foreground">{getCheckoutActionText()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={handleCheckout}
                                        disabled={loading || !billAmount}
                                        className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 ${isApprovable 
                                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/30 hover:scale-[1.01] active:scale-95' 
                                            : 'bg-muted text-muted-foreground cursor-not-allowed grayscale'}`}
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Icon name="ShieldCheck" size={24} />
                                                Finalize Authorization
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PointOfSale;
