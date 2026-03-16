import { useState } from 'react';

interface VirtualCreditCardProps {
    phid: string;
    patientName: string;
    creditScore: number;
}

const VirtualCreditCard = ({ phid, patientName, creditScore }: VirtualCreditCardProps) => {
    const [isObscured, setIsObscured] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);

    // Dynamic Purchasing Power logic. E.g. Score * ₹500
    const rawLimit = creditScore * 500; 
    // Format to Indian Rupees loosely
    const formattedLimit = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(rawLimit);

    // Match project theme styling
    let statusColor = 'text-primary';
    if (creditScore >= 700) statusColor = 'text-success';
    else if (creditScore < 500) statusColor = 'text-error';

    const formatPHID = (id: string, obscure: boolean) => {
        if (!obscure) return id;
        return id.replace(/.(?=.{4})/g, '•'); // Mask all but last 4
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
            {/* The Physical Card Container */}
            <div className="relative w-full lg:w-[450px] aspect-[1.6/1] shrink-0">
                <div 
                    className={`h-full w-full bg-card rounded-2xl border border-border shadow-elevation-2 overflow-hidden flex flex-col`}
                >
                    {/* Top Section */}
                    <div className="p-6 flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-lg text-foreground leading-none">Medical CareCard</h3>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Digital Identity</p>
                            </div>
                        </div>
                        <div className="px-3 py-1 bg-muted rounded-full text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                            Secure Token
                        </div>
                    </div>

                    {/* Middle Section - PHID */}
                    <div className="px-6 flex-1 flex flex-col justify-center">
                        <label className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Hospital Access ID</label>
                        <div 
                            onClick={() => setIsObscured(!isObscured)}
                            className="flex items-center gap-4 cursor-pointer group hover:bg-muted/50 p-2 -ml-2 rounded-lg transition-colors"
                        >
                            <span className="text-2xl md:text-3xl font-mono font-bold tracking-[0.2em] text-foreground">
                                {formatPHID(phid, isObscured)}
                            </span>
                            <button className="text-muted-foreground group-hover:text-primary transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isObscured ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                                    {isObscured && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="p-6 bg-muted/30 border-t border-border flex justify-between items-end">
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Card Holder</p>
                            <p className="font-heading font-semibold text-foreground">{patientName}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Buying Power</p>
                            <p className="text-lg font-bold text-primary">{formattedLimit}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Insight Panel */}
            <div className="flex-1 bg-card rounded-2xl border border-border p-6 shadow-elevation-2 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 text-success mb-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-bold text-sm uppercase tracking-wider">Credit Active</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">Live Buying Power</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Based on your real-time Medical Credit Score of <span className={`font-bold ${statusColor}`}>{creditScore}</span>, you are eligible for pre-approved hospital coverage and interest-free EMIs up to {formattedLimit}.
                    </p>
                </div>

                <div className="flex gap-3 mt-6">
                    <button className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-sm shadow-elevation-1">
                        View Details
                    </button>
                    <button 
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="flex-1 px-4 py-2.5 bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition-all text-sm border border-border"
                    >
                        {isFlipped ? 'Show Front' : 'Scan Card'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VirtualCreditCard;
