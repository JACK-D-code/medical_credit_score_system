import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportVisitModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        hospitalName: '',
        date: '',
        type: 'Consultation',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setFormData({ hospitalName: '', date: '', type: 'Consultation', description: '' });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm sm:p-6">
            <div
                className="relative w-full max-w-lg bg-card rounded-xl shadow-elevation-3 border border-border animate-in fade-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                    <div>
                        <h2 className="text-xl font-heading font-semibold text-foreground">Report Hospital Visit</h2>
                        <p className="text-sm text-muted-foreground mt-1">Log your medical interactions to build profile history.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                    >
                        <Icon name="X" size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <form id="visitForm" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Hospital / Clinic Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon name="Building2" size={18} className="text-muted-foreground" />
                                </div>
                                <input
                                    type="text"
                                    name="hospitalName"
                                    value={formData.hospitalName}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Apollo City Hospital"
                                    className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Date of Visit</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Icon name="Calendar" size={18} className="text-muted-foreground" />
                                    </div>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        max={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Visit Type</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Icon name="Activity" size={18} className="text-muted-foreground" />
                                    </div>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors appearance-none"
                                    >
                                        <option value="Consultation">Consultation</option>
                                        <option value="Emergency">Emergency</option>
                                        <option value="Surgery">Surgery</option>
                                        <option value="Checkup">Routine Checkup</option>
                                        <option value="Diagnostics">Diagnostics/Test</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Description (Optional)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Briefly describe the reason for your visit..."
                                rows={3}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                            />
                        </div>

                        <div className="bg-primary/5 rounded-lg p-3 flex gap-3 items-start border border-primary/10">
                            <Icon name="Info" size={18} className="text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground">
                                Reporting genuine visits helps build your medical history and positively influences your medical credit profile metrics over time.
                            </p>
                        </div>
                    </form>
                </div>

                <div className="px-6 py-4 flex justify-end space-x-3 border-t border-border bg-muted/10">
                    <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        type="submit"
                        form="visitForm"
                        loading={isSubmitting}
                        iconName="FilePlus"
                        iconPosition="left"
                    >
                        Submit Report
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ReportVisitModal;
