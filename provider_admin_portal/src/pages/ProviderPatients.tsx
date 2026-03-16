import { useState, useEffect } from 'react';
import { Users, Search, Filter, HeartPulse, Activity, ChevronRight, AlertTriangle, CheckCircle, Award, KeyRound } from 'lucide-react';
import api from '../lib/api';

interface Patient {
    id: string;
    name: string;
    score: number | string;
    status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'HIGH_RISK' | 'Pending';
    lastUpdate: string;
    department?: string;
    assignedDoctor?: string;
    phid?: string;
}

export default function ProviderPatients() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
    const [evaluatingPatient, setEvaluatingPatient] = useState<Patient | null>(null);
    const [evalReason, setEvalReason] = useState('');
    const [evalPoints, setEvalPoints] = useState(10);
    const [isSubmittingEval, setIsSubmittingEval] = useState(false);
    const [generatingPhidFor, setGeneratingPhidFor] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                // In a real app we would pass filters to backend, here we fetch all and filter frontend
                const res = await api.get('/providers/patients');

                // Enhance the data with deterministic departments based on ID for the CRM feel without flickering
                const enhancedData = res.data.map((p: any) => {
                    const idSum = p.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                    const departments = ['Cardiology', 'Neurology', 'General Practice', 'Orthopedics', 'Pediatrics'];
                    const doctors = ['Dr. Smith', 'Dr. Patel', 'Dr. Wong', 'Dr. Reynolds', 'Dr. Gupta'];

                    return {
                        ...p,
                        department: departments[idSum % departments.length],
                        assignedDoctor: doctors[idSum % doctors.length]
                    };
                });

                setPatients(enhancedData);
            } catch (err: any) {
                console.error("Failed to load patient data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const handleApprove = async (patientId: string) => {
        setApprovingId(patientId);
        try {
            const res = await api.post(`/providers/approve/${patientId}`);
            alert(res.data.message || 'Treatment Approved Successfully!');
            setApprovedIds(prev => new Set(prev).add(patientId));
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to approve treatment');
        } finally {
            setApprovingId(null);
        }
    };

    const handleEvaluateSubmit = async () => {
        if (!evaluatingPatient) return;
        setIsSubmittingEval(true);
        try {
            await api.post(`/providers/patients/${evaluatingPatient.id}/evaluate`, {
                bonusPoints: evalPoints,
                reason: evalReason
            });
            alert(`Successfully granted ${evalPoints} points to ${evaluatingPatient.name}`);
            setEvaluatingPatient(null);
            setEvalReason('');
            setEvalPoints(10);
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to grant points');
        } finally {
            setIsSubmittingEval(false);
        }
    };

    const handleGeneratePhid = async (patientId: string) => {
        setGeneratingPhidFor(patientId);
        try {
            const res = await api.post(`/providers/patients/${patientId}/send-phid`);
            alert(res.data.message || 'PH-ID successfully generated and assigned.');
            
            // Refresh patient data to reflect the new PH-ID immediately
            const updatedRes = await api.get('/providers/patients');
            setPatients(patients.map(p => {
                const updatedPatient = updatedRes.data.find((up: any) => up.id === p.id);
                return updatedPatient ? { ...p, phid: updatedPatient.phid } : p;
            }));
            
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to generate PH-ID');
        } finally {
            setGeneratingPhidFor(null);
        }
    };

    const getStatusIcon = (status: Patient['status']) => {
        switch (status) {
            case 'EXCELLENT':
            case 'GOOD': return <CheckCircle className="w-4 h-4 text-success" />;
            case 'FAIR': return <Activity className="w-4 h-4 text-warning" />;
            case 'HIGH_RISK': return <AlertTriangle className="w-4 h-4 text-destructive" />;
            default: return <Activity className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const getStatusStyle = (status: Patient['status']) => {
        switch (status) {
            case 'EXCELLENT':
            case 'GOOD': return 'bg-success/10 text-success border-success/20';
            case 'FAIR': return 'bg-warning/10 text-warning border-warning/20';
            case 'HIGH_RISK': return 'bg-destructive/10 text-destructive border-destructive/20';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'ALL' || p.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="w-full h-full p-4 md:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight mb-2">Patient Registry</h1>
                    <p className="text-muted-foreground font-medium">Enterprise clinical and financial risk database.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-background border border-border hover:bg-muted text-foreground font-semibold rounded-xl transition-colors shadow-sm text-sm flex items-center gap-2">
                        <Users size={18} className="text-primary" />
                        Network Directory
                    </button>
                    <button className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-[0_4px_14px_rgba(var(--color-primary-rgb),0.3)] transition-all active:scale-95 text-sm flex items-center gap-2">
                        <HeartPulse size={18} />
                        New Patient Record
                    </button>
                </div>
            </div>

            {/* Main CRM Wrapper */}
            <div className="bg-card border border-border rounded-2xl shadow-elevation-2 overflow-hidden flex flex-col min-h-[600px]">

                {/* Advanced Filter Toolbar */}
                <div className="p-4 md:p-5 border-b border-border bg-muted/20 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-[350px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by Patient Name, ID, or FinTech Record..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
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
                                All Active
                            </button>
                            <button
                                onClick={() => setFilterStatus('HIGH_RISK')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${filterStatus === 'HIGH_RISK' ? 'bg-destructive/10 text-destructive' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                High Risk
                            </button>
                            <button
                                onClick={() => setFilterStatus('GOOD')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${filterStatus === 'GOOD' ? 'bg-success/10 text-success' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Excellent
                            </button>
                        </div>

                        <button className="p-2 border border-border bg-background rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-sm flex items-center justify-center">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Data Grid */}
                <div className="flex-1 overflow-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full py-20">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-muted-foreground mt-4 font-medium animate-pulse">Running advanced network query...</p>
                        </div>
                    ) : filteredPatients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 text-center px-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" opacity={0.5} />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">No records matched your criteria</h3>
                            <p className="text-muted-foreground max-w-sm mt-1">Try adjusting your filters or search term to locate the patient.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead className="bg-background sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Patient Profile</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">FinTech MedScore</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Risk Engine Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Hospital Dept.</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Last Modified</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right text-muted-foreground border-b border-border">Controls</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                                    {patient.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{patient.name}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">
                                                        {patient.phid && patient.phid !== 'Pending' ? (
                                                            <span className="text-primary font-bold">{patient.phid}</span>
                                                        ) : (
                                                            `ID: ${patient.id.substring(0, 8)}`
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-lg font-bold text-foreground">{patient.score}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Credit Node</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-2 border ${getStatusStyle(patient.status)}`}>
                                                {getStatusIcon(patient.status)}
                                                {patient.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-foreground">{patient.department}</p>
                                            <p className="text-xs text-muted-foreground">{patient.assignedDoctor}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                                            {new Date(patient.lastUpdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEvaluatingPatient(patient)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 font-bold text-[#b45309] bg-[#fef3c7] hover:bg-[#fde68a] rounded-lg transition-colors text-xs uppercase tracking-wide border border-[#f59e0b]/20 whitespace-nowrap"
                                                >
                                                    <Award size={14} className="text-[#d97706]" /> Grant Merit
                                                </button>
                                                
                                                {(!patient.phid || patient.phid === 'Pending') && (
                                                    <button
                                                        onClick={() => handleGeneratePhid(patient.id)}
                                                        disabled={generatingPhidFor === patient.id}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 font-bold text-[#4f46e5] bg-[#e0e7ff] hover:bg-[#c7d2fe] rounded-lg transition-colors text-xs uppercase tracking-wide border border-[#4f46e5]/20 disabled:opacity-50 whitespace-nowrap"
                                                    >
                                                        {generatingPhidFor === patient.id ? (
                                                            <><div className="w-3 h-3 border-2 border-[#4f46e5]/40 border-t-[#4f46e5] rounded-full animate-spin" /> Generating...</>
                                                        ) : (
                                                            <><KeyRound size={14} /> Send PH-ID</>
                                                        )}
                                                    </button>
                                                )}

                                                {approvedIds.has(patient.id) ? (
                                                    <button disabled className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-success bg-success/10 rounded-lg transition-colors text-xs uppercase tracking-wide whitespace-nowrap">
                                                        <CheckCircle size={14} /> Approved
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleApprove(patient.id)}
                                                        disabled={approvingId === patient.id || patient.score === 'Pending' || (typeof patient.score === 'number' && patient.score < 600)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-xs uppercase tracking-wide border border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary/10 whitespace-nowrap"
                                                    >
                                                        {approvingId === patient.id ? 'Approving...' : 'Approve Tx'}
                                                        <ChevronRight size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-border bg-background flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Showing <span className="text-foreground font-bold">{filteredPatients.length}</span> patient profiles</span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Next</button>
                    </div>
                </div>

            </div>
            
            {/* Evaluation Modal */}
            {evaluatingPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
                        <div className="p-6 border-b border-border bg-gradient-to-r from-muted/30 to-background">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Award className="text-warning" size={24} /> 
                                Grant Merit Points
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2">Evaluate <strong>{evaluatingPatient.name}</strong> and award bonus credit score points for excellent health discipline or observed financial hardship.</p>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Merit Points to Award (Max 100)</label>
                                <input 
                                   type="number" 
                                   value={evalPoints} 
                                   onChange={e => setEvalPoints(Math.min(100, Math.max(0, Number(e.target.value))))}
                                   className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-warning/50 focus:border-warning/50 font-mono text-lg font-bold transition-all shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Reason for Merit Evaluation</label>
                                <textarea 
                                   value={evalReason}
                                   onChange={e => setEvalReason(e.target.value)}
                                   placeholder="e.g., Loyal patient facing financial hardship..."
                                   className="w-full px-4 py-3 bg-background border border-border rounded-xl h-28 resize-none focus:ring-2 focus:ring-primary/50 text-sm transition-all shadow-sm leading-relaxed"
                                />
                            </div>
                        </div>
                        <div className="p-5 bg-muted/40 border-t border-border flex justify-end gap-3">
                            <button onClick={() => setEvaluatingPatient(null)} className="px-5 py-2.5 font-medium text-muted-foreground bg-background hover:bg-muted border border-border rounded-xl transition-colors">Cancel</button>
                            <button 
                                onClick={handleEvaluateSubmit}
                                disabled={isSubmittingEval || !evalPoints || evalPoints <= 0}
                                className="px-5 py-2.5 font-bold bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 shadow-md"
                            >
                                {isSubmittingEval ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Granting...</>
                                ) : (
                                    <><Award size={18} /> Confirm Grant</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
