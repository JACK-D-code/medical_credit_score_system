import { useState, useEffect } from 'react';
import api from '../lib/api';
import Icon from '../components/AppIcon';

export default function ClaimApprovals() {
    const [claims, setClaims] = useState<any[]>([]);
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [reviewMode, setReviewMode] = useState<{ type: 'claim' | 'offer', item: any } | null>(null);
    const [pointsToAward, setPointsToAward] = useState<number>(0);
    const [adminNotes, setAdminNotes] = useState('');

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const res = await api.get('/claims/pending');
            setClaims(res.data.claims || []);
            setOffers(res.data.offers || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveClaim = async () => {
        if (!reviewMode) return;
        try {
            await api.put(`/claims/claim/${reviewMode.item.id}/review`, {
                status: 'approved',
                pointsAwarded: pointsToAward,
                adminNotes
            });
            setReviewMode(null);
            fetchPendingRequests();
        } catch (err) {
            console.error(err);
            alert("Failed to review claim");
        }
    };

    const handleRejectClaim = async () => {
        if (!reviewMode) return;
        try {
            await api.put(`/claims/claim/${reviewMode.item.id}/review`, {
                status: 'rejected',
                pointsAwarded: 0,
                adminNotes
            });
            setReviewMode(null);
            fetchPendingRequests();
        } catch (err) {
            console.error(err);
            alert("Failed to reject claim");
        }
    };

    const handleApproveOffer = async () => {
        if (!reviewMode) return;
        try {
            await api.put(`/claims/offer/${reviewMode.item.id}/review`, {
                status: 'approved',
                rejectionReason: adminNotes
            });
            setReviewMode(null);
            fetchPendingRequests();
        } catch (err) {
            console.error(err);
            alert("Failed to review offer");
        }
    };

    const handleRejectOffer = async () => {
        if (!reviewMode) return;
        try {
            await api.put(`/claims/offer/${reviewMode.item.id}/review`, {
                status: 'rejected',
                rejectionReason: adminNotes
            });
            setReviewMode(null);
            fetchPendingRequests();
        } catch (err) {
            console.error(err);
            alert("Failed to reject offer");
        }
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
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3 flex items-center gap-3">
                    <span className="p-2 bg-primary/10 rounded-xl">
                        <Icon name="CheckSquare" size={32} className="text-primary" />
                    </span>
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Pending Claim Reviews
                    </span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-3xl">
                    Verify patient credit claims and grant offer applications to maintain system integrity.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Claims Column */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Icon name="FileText" size={20} className="text-primary" />
                            Credit Claims ({claims.length})
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {claims.length === 0 ? (
                            <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
                                <p className="text-muted-foreground">No pending credit claims to review.</p>
                            </div>
                        ) : claims.map(claim => (
                            <div key={claim.id} className="bg-card border border-border p-6 rounded-2xl shadow-elevation-1 hover:shadow-elevation-2 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">{claim.claimType}</span>
                                    <span className="text-muted-foreground text-xs font-mono">{new Date(claim.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="mb-4">
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Patient Identity</p>
                                    <p className="font-mono text-foreground bg-muted px-3 py-1 rounded inline-block border border-border">PH-ID: {claim.patient?.healthId || 'Unknown'}</p>
                                </div>
                                <p className="text-foreground text-sm line-clamp-3 mb-6 bg-muted/30 p-3 rounded-lg border border-border/50">{claim.description}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                                    <Icon name="Link" size={14} />
                                    <span className="truncate">Proof: {claim.documentUrl}</span>
                                </div>
                                <button 
                                    onClick={() => { setReviewMode({ type: 'claim', item: claim }); setPointsToAward(50); setAdminNotes(''); }}
                                    className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all font-bold shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                                >
                                    <Icon name="Search" size={16} />
                                    Review Claim
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Offers Column */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Icon name="Zap" size={20} className="text-accent" />
                            Offer Applications ({offers.length})
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {offers.length === 0 ? (
                            <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
                                <p className="text-muted-foreground">No pending offer applications to review.</p>
                            </div>
                        ) : offers.map(offer => (
                            <div key={offer.id} className="bg-card border border-border p-6 rounded-2xl shadow-elevation-1 hover:shadow-elevation-2 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full uppercase tracking-wider">{offer.offerType}</span>
                                    <span className="text-muted-foreground text-xs font-mono">{new Date(offer.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="mb-4">
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Patient Identity</p>
                                    <p className="font-mono text-foreground bg-muted px-3 py-1 rounded inline-block border border-border">PH-ID: {offer.patient?.healthId || 'Unknown'}</p>
                                </div>
                                {offer.amount && (
                                    <div className="mb-4">
                                        <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Requested Capital</p>
                                        <p className="text-xl font-black text-foreground">₹{offer.amount.toLocaleString()}</p>
                                    </div>
                                )}
                                <p className="text-foreground text-sm line-clamp-3 mb-6 bg-muted/30 p-3 rounded-lg border border-border/50">{offer.description}</p>
                                <button 
                                    onClick={() => { setReviewMode({ type: 'offer', item: offer }); setAdminNotes(''); }}
                                    className="w-full py-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl transition-all font-bold shadow-lg shadow-accent/10 flex items-center justify-center gap-2"
                                >
                                    <Icon name="Search" size={16} />
                                    Review Application
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {reviewMode && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-card border border-border shadow-elevation-4 overflow-hidden rounded-2xl max-w-lg w-full scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-foreground">
                                Review {reviewMode.type === 'claim' ? 'Credit Claim' : 'Offer Application'}
                            </h3>
                            <button onClick={() => setReviewMode(null)} className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-lg">
                                <Icon name="X" size={24} />
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            {reviewMode.type === 'claim' && (
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">Incentive Allocation (Credit Points)</label>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="number" 
                                            value={pointsToAward} 
                                            onChange={(e) => setPointsToAward(parseInt(e.target.value) || 0)}
                                            className="flex-1 bg-background border border-border rounded-xl px-4 py-4 text-2xl font-mono font-bold text-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        />
                                        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg border border-border max-w-[200px]">
                                            <Icon name="Info" size={14} className="mb-1 text-primary" />
                                            These points will instantly reflect on the patient's Live Medical Credit Score.
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">Administrative Review Notes</label>
                                <textarea 
                                    value={adminNotes} 
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    className="w-full bg-background border border-border rounded-xl px-4 py-4 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all min-h-[120px] resize-none"
                                    placeholder="Enter decision rationale or rejection reasons here..."
                                ></textarea>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={reviewMode.type === 'claim' ? handleRejectClaim : handleRejectOffer} 
                                    className="flex-1 py-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl hover:bg-destructive/20 transition-all font-bold flex items-center justify-center gap-2"
                                >
                                    <Icon name="ThumbsDown" size={20} />
                                    Decline Request
                                </button>
                                <button 
                                    onClick={reviewMode.type === 'claim' ? handleApproveClaim : handleApproveOffer} 
                                    className={`flex-1 py-4 text-white rounded-xl transition-all font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 ${reviewMode.type === 'claim' ? 'bg-primary shadow-primary/20' : 'bg-accent shadow-accent/20'}`}
                                >
                                    <Icon name="ThumbsUp" size={20} />
                                    Confirm Approval
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
