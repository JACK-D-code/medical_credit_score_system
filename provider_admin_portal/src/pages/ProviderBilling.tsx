import { useState, useEffect } from 'react';
import { Receipt, Search, DollarSign, Wallet, FileText, CheckCircle2, Clock, XCircle, Download } from 'lucide-react';
import api from '../lib/api';

export default function ProviderBilling() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [billingLedger, setBillingLedger] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Invoice Modal State
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [patientIdInput, setPatientIdInput] = useState('');
    const [verifyingPatient, setVerifyingPatient] = useState(false);
    const [verifiedPatient, setVerifiedPatient] = useState<any>(null);
    const [treatmentType, setTreatmentType] = useState('');
    const [billAmount, setBillAmount] = useState('');
    const [isIssuing, setIsIssuing] = useState(false);

    const fetchLedger = async () => {
        try {
            const res = await api.get('/providers/billing');
            // Map the backend data to match the UI shape expected by the frontend
            const formattedData = res.data.map((bill: any) => ({
                id: bill.billNumber.substring(0, 10).toUpperCase(),
                patient: `${bill.patient?.firstName} ${bill.patient?.lastName}`,
                patientId: bill.patientId,
                date: bill.billDate,
                treatment: bill.treatmentType || 'Medical Service',
                amount: bill.billAmount,
                outstanding: bill.outstanding,
                // Transform backend status into frontend UI status labels for FinTech metrics
                status: bill.status === 'paid' ? 'PAID'
                    : bill.outstanding < bill.billAmount ? 'FINTECH_APPROVED'
                        : 'AWAITING_PAYMENT'
            }));
            setBillingLedger(formattedData);
        } catch (err) {
            console.error("Failed to load billing ledger:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLedger();
    }, []);

    const handleVerifyPatient = async () => {
        if (!patientIdInput) return;
        setVerifyingPatient(true);
        setVerifiedPatient(null);
        try {
            const res = await api.get(`/providers/patients/${patientIdInput}`);
            setVerifiedPatient(res.data);
        } catch (err: any) {
            alert(err.response?.data?.error || 'Patient not found');
        } finally {
            setVerifyingPatient(false);
        }
    };

    const handleIssueBill = async () => {
        if (!verifiedPatient || !treatmentType || !billAmount) return;
        setIsIssuing(true);
        try {
            await api.post('/providers/issue-bill', {
                patientUserId: verifiedPatient.userId,
                treatmentType,
                billAmount: Number(billAmount),
                hospitalName: 'Apollo Global Hospitals'
            });
            alert('Invoice generated successfully! Discount rules applied by the systemic engine if eligible.');
            setIsInvoiceModalOpen(false);
            setPatientIdInput('');
            setVerifiedPatient(null);
            setTreatmentType('');
            setBillAmount('');
            fetchLedger();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to issue bill');
        } finally {
            setIsIssuing(false);
        }
    };

    // Derived Metrics
    const totalCapitalIssued = billingLedger.reduce((sum, bill) => sum + bill.amount, 0);
    const totalFinTechSettlements = billingLedger.reduce((sum, bill) => sum + (bill.amount - bill.outstanding), 0);
    const awaitingUnderwriting = billingLedger.reduce((sum, bill) => sum + bill.outstanding, 0);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return <span className="px-2.5 py-1 bg-success/10 text-success border border-success/20 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap"><CheckCircle2 size={12} /> PATIENT PAID</span>;
            case 'FINTECH_APPROVED':
                return <span className="px-2.5 py-1 bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap"><CheckCircle2 size={12} /> FINTECH SETTLED</span>;
            case 'FINTECH_PENDING':
                return <span className="px-2.5 py-1 bg-warning/10 text-warning border border-warning/20 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap"><Clock size={12} /> EMI UNDERWRITING</span>;
            case 'AWAITING_PAYMENT':
                return <span className="px-2.5 py-1 bg-muted/50 text-muted-foreground border border-border rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap"><Clock size={12} /> PENDING DUES</span>;
            case 'DECLINED':
                return <span className="px-2.5 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap"><XCircle size={12} /> FINTECH DECLINED</span>;
            default:
                return null;
        }
    };

    const filteredLedger = billingLedger.filter(bill => {
        const matchesSearch = bill.patient.toLowerCase().includes(searchTerm.toLowerCase()) || bill.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'ALL' || bill.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="w-full h-full p-4 md:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight mb-2">Revenue & Billing Hub</h1>
                    <p className="text-muted-foreground font-medium">Track your hospital's financial settlements and automated FinTech payouts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-background border border-border hover:bg-muted text-foreground font-semibold rounded-lg transition-colors shadow-sm text-sm flex items-center gap-2">
                        <Download size={16} className="text-muted-foreground" />
                        Export Ledger (.csv)
                    </button>
                    <button 
                        onClick={() => setIsInvoiceModalOpen(true)}
                        className="px-6 py-2 bg-gradient-to-r from-primary to-[#8b5cf6] hover:opacity-90 text-white font-bold rounded-lg shadow-[0_4px_14px_rgba(139,92,246,0.3)] transition-all active:scale-95 text-sm flex items-center gap-2"
                    >
                        <Receipt size={18} />
                        New Invoice
                    </button>
                </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors"></div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Capital Issued</p>
                    <div className="flex items-end gap-3">
                        <h2 className="text-3xl font-black text-foreground font-mono">₹{totalCapitalIssued.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-[#8b5cf6]/5 rounded-bl-[100px] -z-10 group-hover:bg-[#8b5cf6]/10 transition-colors"></div>
                    <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center mb-4">
                        <Wallet className="w-6 h-6 text-[#8b5cf6]" />
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">FinTech Settlements</p>
                    <div className="flex items-end gap-3">
                        <h2 className="text-3xl font-black text-foreground font-mono">₹{totalFinTechSettlements.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-shadow relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-warning/5 rounded-bl-[100px] -z-10 group-hover:bg-warning/10 transition-colors"></div>
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4">
                        <Clock className="w-6 h-6 text-warning" />
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Awaiting Underwriting</p>
                    <div className="flex items-end gap-3">
                        <h2 className="text-3xl font-black text-foreground font-mono">₹{awaitingUnderwriting.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            {/* Main Ledger Wrapper */}
            <div className="bg-card border border-border rounded-2xl shadow-elevation-2 flex flex-col min-h-[500px] overflow-hidden">

                {/* Advanced Filter Toolbar */}
                <div className="p-4 md:p-5 border-b border-border bg-muted/20 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-[350px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by Invoice ID or Patient..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm font-mono"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        <div className="flex bg-background border border-border rounded-lg p-1 shadow-sm">
                            <button
                                onClick={() => setFilterStatus('ALL')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${filterStatus === 'ALL' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                All Invoices
                            </button>
                            <button
                                onClick={() => setFilterStatus('FINTECH_APPROVED')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${filterStatus === 'FINTECH_APPROVED' ? 'bg-[#8b5cf6]/10 text-[#8b5cf6]' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                FinTech Settled
                            </button>
                            <button
                                onClick={() => setFilterStatus('AWAITING_PAYMENT')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${filterStatus === 'AWAITING_PAYMENT' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Outstanding
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Grid */}
                <div className="flex-1 overflow-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full py-20">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-muted-foreground mt-4 font-medium animate-pulse">Syncing blockchain ledger...</p>
                        </div>
                    ) : filteredLedger.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 text-center px-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Receipt className="w-8 h-8 text-muted-foreground" opacity={0.5} />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">No invoices matched your criteria</h3>
                            <p className="text-muted-foreground max-w-sm mt-1">Try adjusting your filters or search term to locate the billing record.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead className="bg-background sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Invoice Details</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Billed To</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Clinical Segment</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Capital Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right text-muted-foreground border-b border-border">Settlement Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredLedger.map((bill) => (
                                    <tr key={bill.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border border-border">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground font-mono">{bill.id}</p>
                                                    <p className="text-xs text-muted-foreground font-medium">{new Date(bill.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-foreground">{bill.patient}</p>
                                            <p className="text-xs text-muted-foreground font-mono">ID: {bill.patientId ? bill.patientId.substring(0, 8).toUpperCase() : Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-foreground">{bill.treatment}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-base font-bold text-foreground">₹{bill.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {getStatusBadge(bill.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-border bg-background flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Showing <span className="text-foreground font-bold">{filteredLedger.length}</span> invoices</span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>

            </div>

            {/* New Invoice Modal */}
            {isInvoiceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
                        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-background">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Receipt className="text-primary" size={24} /> 
                                Issue Patient Invoice
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2">Create a new billing record. The Philanthropic Engine will automatically scan the patient's Medical Credit Score to apply applicable sponsorships instantly.</p>
                        </div>
                        <div className="p-6 space-y-5">
                            {!verifiedPatient ? (
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold">Verify Patient (User ID)</label>
                                    <div className="flex gap-2">
                                        <input 
                                           type="text" 
                                           value={patientIdInput}
                                           onChange={e => setPatientIdInput(e.target.value)}
                                           placeholder="Enter Patient User ID (e.g. u_uid...)"
                                           className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm shadow-sm"
                                        />
                                        <button 
                                            onClick={handleVerifyPatient}
                                            disabled={verifyingPatient || !patientIdInput}
                                            className="px-5 font-bold bg-primary hover:bg-primary/90 text-white rounded-xl disabled:opacity-50 transition-all"
                                        >
                                            {verifyingPatient ? '...' : 'Verify'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="bg-muted/30 p-4 border border-border rounded-xl flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold border border-primary/20">
                                            {verifiedPatient.firstName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground text-lg">{verifiedPatient.firstName} {verifiedPatient.lastName}</p>
                                            
                                            {/* Philanthropic Engine Discount Logic UI */}
                                            {(() => {
                                                const score = verifiedPatient.creditScores?.[0]?.scoreValue || 0;
                                                if (score >= 800) {
                                                    return <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-md inline-block mt-1">✨ 100% SPONSORED (Excellent Score: {score})</span>;
                                                } else if (score >= 650) {
                                                    return <span className="text-xs font-bold text-[#8b5cf6] bg-[#8b5cf6]/10 px-2 py-0.5 rounded-md inline-block mt-1">✨ 50% DISCOUNT (Good Score: {score})</span>;
                                                } else if (score >= 500) {
                                                    return <span className="text-xs font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-md inline-block mt-1">⚡ 0% EMI ELIGIBLE (Fair Score: {score})</span>;
                                                } else {
                                                    return <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-md inline-block mt-1">⚠️ High Risk (Score: {score}) - Standard Billing</span>;
                                                }
                                            })()}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Clinical Segment / Treatment</label>
                                        <input 
                                           type="text" 
                                           value={treatmentType}
                                           onChange={e => setTreatmentType(e.target.value)}
                                           placeholder="e.g. Advanced Orthopedic Surgery"
                                           className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Base Treatment Cost (₹)</label>
                                        <input 
                                           type="number" 
                                           value={billAmount}
                                           onChange={e => setBillAmount(e.target.value)}
                                           placeholder="250000"
                                           className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 transition-all shadow-sm font-mono text-lg"
                                        />
                                        <p className="text-xs text-muted-foreground mt-2 inline-flex items-center gap-1"><CheckCircle2 size={12} className="text-success" /> Discounts will be programmatically subtracted before issuing.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-5 bg-muted/40 border-t border-border flex justify-end gap-3">
                            <button onClick={() => { setIsInvoiceModalOpen(false); setVerifiedPatient(null); setPatientIdInput(''); }} className="px-5 py-2.5 font-medium text-muted-foreground bg-background hover:bg-muted border border-border rounded-xl transition-colors">Cancel</button>
                            <button 
                                onClick={handleIssueBill}
                                disabled={isIssuing || !verifiedPatient || !treatmentType || !billAmount}
                                className="px-5 py-2.5 font-bold bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                            >
                                {isIssuing ? 'Processing...' : 'Issue Official Invoice'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
