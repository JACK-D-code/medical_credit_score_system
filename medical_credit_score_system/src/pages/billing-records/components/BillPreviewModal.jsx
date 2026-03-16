import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BillPreviewModal = ({ isOpen, onClose, record }) => {
    if (!isOpen || !record) return null;

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        })?.format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString)?.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Extract Philanthropic Discount logic from the treatment string pushed by Backend
    const hasDiscount = record.treatmentType?.includes('Discount') || record.treatmentType?.includes('Sponsored') || record.treatmentType?.includes('EMI Eligible');
    const [baseTreatment, ...discountParts] = record.treatmentType?.includes(' - ') 
        ? record.treatmentType.split(' - ') 
        : [record.treatmentType];
    const discountNote = discountParts.join(' - ');

    // Mock breakdown items based on total amount
    const breakdownAmount = record.billAmount;
    const items = [
        { desc: `${baseTreatment} Service Charge`, cost: breakdownAmount * 0.4 },
        { desc: 'Room & Nursing Charges', cost: breakdownAmount * 0.2 },
        { desc: 'Medication & Pharmacy', cost: breakdownAmount * 0.15 },
        { desc: 'Diagnostic & Lab Tests', cost: breakdownAmount * 0.15 },
        { desc: 'Taxes & Other Fees', cost: breakdownAmount * 0.1 },
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm sm:p-6 print:p-0 print:bg-white print:items-start overflow-y-auto">
            <div
                className="relative w-full max-w-2xl my-auto bg-card rounded-xl shadow-elevation-3 border border-border animate-in fade-in zoom-in-95 print:shadow-none print:border-none print:w-full print:max-w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 print:hidden">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon name="FileText" size={20} className="text-primary" />
                        </div>
                        <h2 className="text-xl font-heading font-semibold text-foreground">Treatment Bill Preview</h2>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handlePrint}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                            title="Print Invoice"
                        >
                            <Icon name="Printer" size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                        >
                            <Icon name="X" size={20} />
                        </button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div id="invoice-printable-area" className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between mb-8 border-b border-border pb-6 gap-6">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Icon name="Activity" size={28} className="text-primary" />
                                <span className="text-2xl font-bold font-heading tracking-tight text-primary">MediCredit</span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">{record.hospitalName}</h3>
                            <p className="text-sm text-muted-foreground capitalize">Department of {baseTreatment}</p>
                            <p className="text-sm text-muted-foreground mt-2">123 Health Avenue, Medical District<br />Cityville, State 12345</p>
                        </div>

                        <div className="md:text-right">
                            <h2 className="text-2xl font-heading font-bold text-foreground mb-4 uppercase tracking-wider text-muted-foreground/30">Invoice</h2>
                            <div className="space-y-1">
                                <p className="text-sm"><span className="text-muted-foreground mr-2">Invoice No:</span> <span className="font-medium font-mono text-foreground">INV-{record.id.substring(0, 8).toUpperCase()}</span></p>
                                <p className="text-sm"><span className="text-muted-foreground mr-2">Bill Date:</span> <span className="font-medium text-foreground">{formatDate(record.billDate)}</span></p>
                                <div className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize bg-muted text-muted-foreground">
                                    Status: {record.status}
                                </div>
                            </div>
                        </div>
                    </div>

                    {hasDiscount && (
                        <div className="mb-8 p-5 bg-gradient-to-r from-success/10 to-[#8b5cf6]/10 rounded-xl border border-success/30 shadow-sm relative overflow-hidden print:bg-white print:border-gray-300">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-success/10 rounded-full blur-2xl print:hidden"></div>
                            <div className="flex gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center shrink-0 print:border print:border-gray-200 print:bg-gray-100">
                                    <Icon name="Award" className="text-success print:text-gray-800" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-foreground mb-1">Philanthropic Sponsorship Applied!</h4>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Congratulations! The system automatically recognized your excellent health loyalty profile. You received a <strong>{discountNote}</strong>!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-8 p-4 bg-muted/30 rounded-lg border border-border">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Billed To:</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Patient Reference</p>
                                <p className="font-medium text-foreground">PID-{record.patientId.substring(0, 8).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    <table className="w-full mb-8">
                        <thead className="bg-muted text-left border-y border-border">
                            <tr>
                                <th className="py-3 px-4 text-xs font-semibold text-foreground uppercase tracking-wider">Description</th>
                                <th className="py-3 px-4 text-right text-xs font-semibold text-foreground uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-4 text-sm text-foreground">{item.desc}</td>
                                    <td className="py-4 px-4 text-sm text-foreground text-right font-mono">{formatINR(item.cost)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end border-t-2 border-border pt-6">
                        <div className="w-full md:w-1/2 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="text-foreground font-mono">{formatINR(record.billAmount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Insurance Coverage</span>
                                <span className="text-success font-mono">-{formatINR(0)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold bg-muted/50 p-3 rounded-lg border border-border">
                                <span className="text-foreground">Total Billed</span>
                                <span className="text-foreground font-mono">{formatINR(record.billAmount)}</span>
                            </div>

                            <div className="flex justify-between text-lg font-bold text-error mt-4">
                                <span>Total Outstanding</span>
                                <span className="font-mono">{formatINR(record.outstanding)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center text-xs text-muted-foreground border-t border-border pt-6 print:hidden">
                        <p>This is a computer generated document. No signature is required.</p>
                        <p className="mt-1">For any disputes regarding this invoice, please use the Dispute action in your dashboard.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillPreviewModal;
