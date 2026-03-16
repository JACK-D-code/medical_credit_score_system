import { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import Icon from '../components/AppIcon';

interface Patient {
    id: string;
    phid: string;
    phidRequestStatus: string;
    name: string;
    score: number | string;
    status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'HIGH_RISK' | 'Pending';
    lastUpdate: string;
}

export default function ProviderDashboard() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [patientDetails, setPatientDetails] = useState<any>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [showBillForm, setShowBillForm] = useState(false);
    const [billData, setBillData] = useState({ treatmentType: '', amount: '' });
    const [billLoading, setBillLoading] = useState(false);

    const [showEvalForm, setShowEvalForm] = useState(false);
    const [evalData, setEvalData] = useState({ rating: 'Excellent', points: 30, notes: '' });
    const [evalLoading, setEvalLoading] = useState(false);

    const handleIssueBill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatientId || !patientDetails) return;
        setBillLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            let providerName = 'Network Hospital';
            if (userStr) {
                const parsed = JSON.parse(userStr);
                providerName = parsed.email.split('@')[0].toUpperCase() + ' Hospital';
            }

            await api.post('/providers/issue-bill', {
                patientUserId: selectedPatientId,
                treatmentType: billData.treatmentType,
                billAmount: Number(billData.amount),
                hospitalName: providerName
            });
            alert('Outstanding Bill successfully registered! The Patient\'s credit engine is now calculating the impact.');
            setShowBillForm(false);
            setBillData({ treatmentType: '', amount: '' });
            fetchPatients();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to issue bill');
        } finally {
            setBillLoading(false);
        }
    };

    const handleEvaluatePatient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatientId || !patientDetails) return;
        setEvalLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            let providerName = 'Network Hospital';
            if (userStr) {
                const parsed = JSON.parse(userStr);
                providerName = parsed.email.split('@')[0].toUpperCase() + ' Hospital';
            }

            await api.post('/providers/evaluate-patient', {
                patientUserId: selectedPatientId,
                rating: evalData.rating,
                points: evalData.points,
                notes: evalData.notes,
                hospitalName: providerName
            });
            alert(`Evaluation submitted! The patient was rewarded with +${evalData.points} loyalty points.`);
            setShowEvalForm(false);
            setEvalData({ rating: 'Excellent', points: 30, notes: '' });
            fetchPatients();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to submit evaluation');
        } finally {
            setEvalLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/provider-login');
    };

    useEffect(() => {
        if (!selectedPatientId) {
            setPatientDetails(null);
            return;
        }
        const fetchDetails = async () => {
            setModalLoading(true);
            try {
                const res = await api.get(`/patients/${selectedPatientId}`);
                setPatientDetails(res.data);
            } catch (err: any) {
                alert('Could not fetch patient clinical details.');
            } finally {
                setModalLoading(false);
            }
        };
        fetchDetails();
    }, [selectedPatientId]);

    const fetchPatients = async () => {
        try {
            const res = await api.get('/providers/patients');
            setPatients(res.data);
        } catch (err: any) {
            setError('Failed to load patient data or unauthorized.');
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/provider-login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [navigate]);

    const getStatusIcon = (status: Patient['status']) => {
        switch (status) {
            case 'EXCELLENT':
            case 'GOOD':
                return <CheckCircle className="w-4 h-4 text-success" />;
            case 'FAIR':
                return <Clock className="w-4 h-4 text-warning" />;
            case 'HIGH_RISK':
                return <AlertTriangle className="w-4 h-4 text-destructive" />;
            default:
                return <Clock className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const getStatusClass = (status: Patient['status']) => {
        switch (status) {
            case 'EXCELLENT':
            case 'GOOD':
                return 'bg-success/10 text-success border-success/20';
            case 'FAIR':
                return 'bg-warning/10 text-warning border-warning/20';
            case 'HIGH_RISK':
                return 'bg-destructive/10 text-destructive border-destructive/20';
            default:
                return 'bg-muted text-muted-foreground border-border';
        }
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const averageScore = patients.length > 0
        ? Math.round(patients.reduce((sum, p) => sum + (typeof p.score === 'number' ? p.score : 0), 0) / patients.length)
        : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                <p className="text-lg text-destructive text-center max-w-md">{error}</p>
                <button onClick={handleLogout} className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90">
                    Return to Login
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 w-full p-4 md:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">Provider Dashboard</h1>
                        <p className="text-sm md:text-base text-muted-foreground">Welcome back, Dr. Smith. Here is your patient risk portfolio.</p>
                    </div>
                    <div className="flex flex-col items-start md:items-end bg-card p-4 rounded-xl border border-border shadow-elevation-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Portfolio Avg Health Score</p>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold font-mono text-primary">{averageScore}</span>
                            <Icon name="Activity" size={24} color="var(--color-primary)" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mb-4">
                    <button 
                        onClick={() => navigate('/claim-approvals')}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition shadow-lg flex items-center gap-2"
                    >
                        Review Pending Requests (Claims & Offers)
                    </button>
                </div>

                {/* Main Table Panel */}
                <div className="bg-card rounded-xl shadow-elevation-2 border border-border overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30">
                        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">Active Patient Assessments</h3>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search patients by name or ID..."
                                    className="w-full sm:w-[260px] pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                                onClick={() => alert("Assessment request notification sent to portal.")}
                            >
                                Request Assessment
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Patient Name & PH-ID</th>
                                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Last Update</th>
                                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">MediScore</th>
                                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Risk Status</th>
                                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient) => (
                                        <tr key={patient.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="p-4 align-middle">
                                                <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{patient.name}</div>
                                                <div className="text-xs font-mono mt-1.5 flex items-center gap-2">
                                                    <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{patient.phid}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-sm text-muted-foreground">
                                                {new Date(patient.lastUpdate).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className="font-mono font-semibold text-foreground">{patient.score}</span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center inline-flex gap-1.5 w-fit border ${getStatusClass(patient.status)}`}>
                                                    {getStatusIcon(patient.status)}
                                                    {patient.status === 'EXCELLENT' && 'Excellent'}
                                                    {patient.status === 'GOOD' && 'Good'}
                                                    {patient.status === 'FAIR' && 'Fair'}
                                                    {patient.status === 'HIGH_RISK' && 'High Risk'}
                                                    {patient.status === 'Pending' && 'Pending'}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <button
                                                    className="inline-flex items-center justify-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-colors"
                                                    onClick={() => setSelectedPatientId(patient.id)}
                                                >
                                                    View Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
                                            No patients found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Patient Details Modal */}
            {selectedPatientId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-elevation-3 border border-border relative flex flex-col animate-in zoom-in-95 duration-200">

                        <div className="sticky top-0 z-10 flex justify-between items-center p-4 md:p-6 border-b border-border bg-card">
                            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">
                                {patientDetails ? `${patientDetails.firstName} ${patientDetails.lastName}` : 'Loading...'}
                            </h2>
                            <button
                                onClick={() => setSelectedPatientId(null)}
                                className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 md:p-6 flex-1">
                            {modalLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-muted-foreground">Loading clinical data...</p>
                                </div>
                            ) : patientDetails ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-1 bg-muted rounded text-xs font-mono font-medium text-muted-foreground">ID: {patientDetails.userId}</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Clinical Vitals Card */}
                                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Icon name="Activity" size={18} color="var(--color-primary)" />
                                                <h4 className="text-primary text-sm font-semibold uppercase tracking-wider">Clinical Vitals</h4>
                                            </div>
                                            <ul className="space-y-2.5 text-sm text-foreground">
                                                <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">Age</span> <span className="font-medium">{patientDetails.age}</span></li>
                                                <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">BMI</span> <span className="font-medium">{patientDetails.bmi}</span></li>
                                                <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">Blood Pressure</span> <span className="font-medium">{patientDetails.bloodPressureSys}/{patientDetails.bloodPressureDia}</span></li>
                                                <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">Cholesterol</span> <span className="font-medium">{patientDetails.cholesterol} mg/dL</span></li>
                                                <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">Smoker</span> <span className="font-medium">{patientDetails.smoking ? 'Yes' : 'No'}</span></li>
                                                <li className="flex justify-between pb-1"><span className="text-muted-foreground">Exercise</span> <span className="font-medium">{patientDetails.exerciseHours} hrs/wk</span></li>
                                            </ul>
                                        </div>

                                        {/* Financial Standing Card */}
                                        <div className="p-4 bg-muted/50 rounded-xl border border-border">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Icon name="CreditCard" size={18} className="text-foreground opacity-70" />
                                                <h4 className="text-foreground text-sm font-semibold uppercase tracking-wider">Financial Profile</h4>
                                            </div>
                                            <ul className="space-y-2.5 text-sm text-foreground">
                                                {patientDetails.financialProfile ? (
                                                    <>
                                                        <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">Annual Income</span> <span className="font-medium font-mono">₹{patientDetails.financialProfile.annualIncome.toLocaleString()}</span></li>
                                                        <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">Credit History</span> <span className="font-medium">{patientDetails.financialProfile.creditHistory}</span></li>
                                                        <li className="flex justify-between pb-1"><span className="text-muted-foreground">Medical Debt</span> <span className="font-medium font-mono text-destructive">₹{patientDetails.financialProfile.existingMedicalDebt.toLocaleString()}</span></li>
                                                    </>
                                                ) : (
                                                    <li className="text-muted-foreground italic flex items-center justify-center h-[120px]">No linked financial data</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Action Section */}
                                    {showBillForm ? (
                                        <div className="mt-8 bg-card border border-primary/20 rounded-xl shadow-elevation-2 overflow-hidden animate-in slide-in-from-bottom-2">
                                            <div className="bg-gradient-to-r from-primary/10 to-transparent px-5 py-4 border-b border-primary/10 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/20 rounded-lg">
                                                        <Icon name="Receipt" size={20} color="var(--color-primary)" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-primary font-bold text-lg">Generate Medical Invoice</h4>
                                                        <p className="text-xs text-muted-foreground mt-0.5">Submit treatment costs to the FinTech credit engine</p>
                                                    </div>
                                                </div>
                                                <div className="text-right hidden sm:block">
                                                    <span className="text-xs text-muted-foreground font-mono bg-background px-2 py-1 rounded border border-border">INV-{(Math.random() * 100000).toFixed(0).padStart(6, '0')}</span>
                                                </div>
                                            </div>
                                            <form onSubmit={handleIssueBill} className="p-5 md:p-6 bg-gradient-to-b from-background to-muted/20">
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                                                    <div className="md:col-span-7">
                                                        <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                                            <Icon name="Stethoscope" size={16} className="text-muted-foreground" opacity={0.7} />
                                                            Clinical Treatment / Diagnosis
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={billData.treatmentType}
                                                            onChange={e => setBillData({ ...billData, treatmentType: e.target.value })}
                                                            placeholder="e.g. Major Cardiac Surgery, MRI Scan"
                                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-5">
                                                        <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                                            <Icon name="Banknote" size={16} className="text-muted-foreground" opacity={0.7} />
                                                            Invoice Amount (₹)
                                                        </label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                                <span className="text-lg font-mono text-muted-foreground">₹</span>
                                                            </div>
                                                            <input
                                                                type="number"
                                                                required
                                                                value={billData.amount}
                                                                onChange={e => setBillData({ ...billData, amount: e.target.value })}
                                                                placeholder="150000"
                                                                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm font-mono"
                                                            />
                                                        </div>
                                                        {/* Quick amount presets */}
                                                        <div className="flex gap-2 mt-3">
                                                            <button type="button" onClick={() => setBillData({ ...billData, amount: '50000' })} className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-md transition-colors font-mono tracking-tighter border border-border">₹50k</button>
                                                            <button type="button" onClick={() => setBillData({ ...billData, amount: '150000' })} className="px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-md transition-colors font-mono tracking-tighter shadow-sm font-bold">₹1.5L Preset</button>
                                                            <button type="button" onClick={() => setBillData({ ...billData, amount: '500000' })} className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 text-muted-foreground rounded-md transition-colors font-mono tracking-tighter border border-border">₹5L</button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6 flex items-start gap-3">
                                                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-warning-foreground mb-1">Real-Time Risk Engine Trigger</p>
                                                        <p className="text-xs text-warning-foreground/80 leading-relaxed">
                                                            Submitting a high-value invoice directly impacts the patient's organic Medical Credit Score. They will instantly be notified to "Apply for Medical Credit" in their app.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowBillForm(false)}
                                                        className="px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={billLoading}
                                                        className="px-6 py-2.5 bg-gradient-to-r from-primary to-[#8b5cf6] hover:opacity-90 text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center min-w-[200px] gap-2"
                                                    >
                                                        {billLoading ? (
                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <>
                                                                Submit Invoice to Engine
                                                                <Icon name="ArrowRight" size={16} />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="mt-8 bg-card border border-border p-6 rounded-xl flex items-center justify-between shadow-sm hover:border-primary/50 transition-colors">
                                            <div>
                                                <h4 className="text-foreground font-bold text-lg">Post Treatment Invoice</h4>
                                                <p className="text-sm text-muted-foreground mt-1">Issue a new medical bill to calculate patient credit impact</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setShowEvalForm(false);
                                                    setShowBillForm(true);
                                                    setBillData({ treatmentType: 'Major Cardiac Surgery', amount: '150000' });
                                                }}
                                                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-elevation-1 transition-all active:scale-95 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)]"
                                            >
                                                <Icon name="FilePlus2" size={18} /> Generate Surgery Bill
                                            </button>
                                        </div>
                                    )}

                                    {/* Evaluation Form Option */}
                                    {showEvalForm && !showBillForm ? (
                                        <div className="mt-4 bg-card border border-emerald-500/30 rounded-xl shadow-elevation-2 overflow-hidden animate-in slide-in-from-bottom-2">
                                            <div className="bg-gradient-to-r from-emerald-500/10 to-transparent px-5 py-4 border-b border-emerald-500/20 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                                        <Icon name="Award" size={20} className="text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-emerald-400 font-bold text-lg">Provider Evaluation</h4>
                                                        <p className="text-xs text-muted-foreground mt-0.5">Reward compliant patients with loyalty points</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <form onSubmit={handleEvaluatePatient} className="p-5 md:p-6 bg-gradient-to-b from-background to-muted/20">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                                            Evaluation Rating
                                                        </label>
                                                        <select
                                                            required
                                                            value={`${evalData.rating}|${evalData.points}`}
                                                            onChange={e => {
                                                                const [rating, points] = e.target.value.split('|');
                                                                setEvalData({ ...evalData, rating, points: Number(points) });
                                                            }}
                                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                                        >
                                                            <option value="Excellent|30">Excellent Adherence (+30 pts)</option>
                                                            <option value="Good|15">Good Adherence (+15 pts)</option>
                                                            <option value="Fair|5">Fair Adherence (+5 pts)</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                                            Clinical Notes
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={evalData.notes}
                                                            onChange={e => setEvalData({ ...evalData, notes: e.target.value })}
                                                            placeholder="Patient followed all instructions..."
                                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowEvalForm(false)}
                                                        className="px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={evalLoading}
                                                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                                                    >
                                                        {evalLoading ? 'Submitting...' : 'Award Points'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : !showBillForm && (
                                        <div className="mt-4 bg-card border border-border p-6 rounded-xl flex items-center justify-between shadow-sm hover:border-emerald-500/30 transition-colors">
                                            <div>
                                                <h4 className="text-foreground font-bold text-lg">Evaluate Patient History</h4>
                                                <p className="text-sm text-muted-foreground mt-1">Reward cooperative patients with direct score bonuses</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setShowBillForm(false);
                                                    setShowEvalForm(true);
                                                }}
                                                className="px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-bold border border-emerald-500/20 rounded-xl transition-all active:scale-95 flex items-center gap-2"
                                            >
                                                <Icon name="Award" size={18} /> Provider Evaluation
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-center">
                                    <AlertTriangle className="w-12 h-12 text-destructive mb-3 opacity-80" />
                                    <p className="text-foreground font-medium">Data Unavailable</p>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-xs text-balance">The clinical profile for this patient could not be retrieved from the server.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
