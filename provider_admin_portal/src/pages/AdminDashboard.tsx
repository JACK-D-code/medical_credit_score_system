import { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, Clock, X, ShieldCheck } from 'lucide-react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import SessionSecurityHeader from '../components/ui/SessionSecurityHeader';
// @ts-ignore
import Icon from '../components/AppIcon';

interface Patient {
    id: string;
    name: string;
    score: number | string;
    status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'HIGH_RISK' | 'Pending';
    lastUpdate: string;
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [patientDetails, setPatientDetails] = useState<any>(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [showVerifyKYCForm, setShowVerifyKYCForm] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);

    const handleVerifyKYC = async () => {
        setVerifyLoading(true);
        // Simulate an external FinTech API check
        setTimeout(() => {
            alert('KYC Verified successfully! FinTech identity matches Aadhaar / PAN database.');
            setVerifyLoading(false);
            setShowVerifyKYCForm(false);
        }, 1200);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin-login');
    };

    useEffect(() => {
        if (!selectedPatientId) {
            setPatientDetails(null);
            return;
        }
        const fetchDetails = async () => {
            setModalLoading(true);
            try {
                const res = await api.get(`/admin/patients/${selectedPatientId}`);
                setPatientDetails(res.data);
            } catch (err: any) {
                alert('Could not fetch patient clinical details.');
            } finally {
                setModalLoading(false);
            }
        };
        fetchDetails();
    }, [selectedPatientId]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get('/providers/patients');
                setPatients(res.data);
            } catch (err: any) {
                setError('Failed to load active FinTech portfolio data or session expired.');
                if (err.response?.status === 401 || err.response?.status === 403) {
                    navigate('/admin-login');
                }
            } finally {
                setLoading(false);
            }
        };

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
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground font-medium">Securing connection to Bank Admin servers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <ShieldCheck className="w-16 h-16 text-destructive mb-4 opacity-80" />
                <p className="text-xl font-semibold mb-2 text-foreground">Access Restricted</p>
                <p className="text-muted-foreground text-center max-w-md">{error}</p>
                <button onClick={handleLogout} className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg shadow-elevation-1 transition-all hover:bg-primary/90">
                    Return to SSO
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SessionSecurityHeader
                sessionTimeout={1800000}
                onLogout={handleLogout}
            />

            <main className="flex-1 mx-auto w-full px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10 space-y-8 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">Insurance & Underwriting</h1>
                        </div>
                        <p className="text-sm md:text-base text-muted-foreground">Welcome back, Admin. Here is the active patient risk portfolio.</p>
                    </div>
                    <div className="flex flex-col items-start md:items-end bg-card p-4 rounded-xl border border-border shadow-elevation-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Global Underwriting Score</p>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold font-mono text-primary">{averageScore}</span>
                            <Icon name="Activity" size={24} color="var(--color-primary)" />
                        </div>
                    </div>
                </div>

                {/* Main Table Panel */}
                <div className="bg-card rounded-xl shadow-elevation-2 border border-border overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30">
                        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">Active FinTech Profiles</h3>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search portfolios by ID..."
                                    className="w-full sm:w-[280px] pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                className="px-5 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                                onClick={() => alert("Assessment request notification sent to portal.")}
                            >
                                Request Bulk Sync
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Entity Name</th>
                                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Synced On</th>
                                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">MediScore</th>
                                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Coverage Risk</th>
                                    <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-right">Data File</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient) => (
                                        <tr key={patient.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="p-4 align-middle">
                                                <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{patient.name}</div>
                                                <div className="text-xs text-muted-foreground font-mono mt-1">ID: {patient.id.substring(0, 8)}</div>
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
                                                    Audit Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
                                            No portfolios found matching your search matrix.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Patient Details Modal */}
            {selectedPatientId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-elevation-3 border border-border relative flex flex-col animate-in zoom-in-95 duration-200">

                        <div className="sticky top-0 z-10 flex justify-between items-center p-4 md:p-6 border-b border-border bg-card">
                            <div className="flex flex-col">
                                <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">
                                    {patientDetails ? `${patientDetails.firstName} ${patientDetails.lastName}` : 'Auditing Dataset...'}
                                </h2>
                                {patientDetails && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-2 py-0.5 bg-muted rounded text-xs font-mono font-medium text-muted-foreground">ID: {patientDetails.userId}</span>
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">Secured Node</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedPatientId(null)}
                                className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary self-start"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 md:p-6 flex-1">
                            {modalLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-muted-foreground">Pulling isolated data streams...</p>
                                </div>
                            ) : patientDetails ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Clinical Vitals Card */}
                                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Icon name="Activity" size={18} color="var(--color-primary)" />
                                                <h4 className="text-primary text-sm font-semibold uppercase tracking-wider">Clinical Core Data</h4>
                                            </div>
                                            <ul className="space-y-2.5 text-sm text-foreground">
                                                <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">Age</span> <span className="font-medium">{patientDetails.age}</span></li>
                                                <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">BMI Index</span> <span className="font-medium">{patientDetails.bmi}</span></li>
                                                <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">Blood Pressure</span> <span className="font-medium">{patientDetails.bloodPressureSys}/{patientDetails.bloodPressureDia}</span></li>
                                                <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">Total Cholesterol</span> <span className="font-medium">{patientDetails.cholesterol} mg/dL</span></li>
                                                <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">Nicotine Intake</span> <span className="font-medium">{patientDetails.smoking ? 'Active' : 'Negative'}</span></li>
                                                <li className="flex justify-between pb-1"><span className="text-muted-foreground">Physical Exercise</span> <span className="font-medium">{patientDetails.exerciseHours} hrs/wk</span></li>
                                            </ul>
                                        </div>

                                        {/* Financial Standing Card */}
                                        <div className="p-4 bg-muted/50 rounded-xl border border-border flex flex-col">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Icon name="CreditCard" size={18} className="text-foreground opacity-70" />
                                                <h4 className="text-foreground text-sm font-semibold uppercase tracking-wider">Underwriting Metrics</h4>
                                            </div>
                                            {patientDetails.financialProfile ? (
                                                <ul className="space-y-2.5 text-sm text-foreground flex-1">
                                                    <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">Declared Income</span> <span className="font-medium font-mono">₹{patientDetails.financialProfile.annualIncome.toLocaleString()}</span></li>
                                                    <li className="flex justify-between border-b border-border/50 pb-1"><span className="text-muted-foreground">CIBIL Bracket</span> <span className="font-medium">{patientDetails.financialProfile.creditHistory}</span></li>
                                                    <li className="flex justify-between pb-1"><span className="text-muted-foreground">Open Med Deficits</span> <span className="font-medium font-mono text-destructive">₹{patientDetails.financialProfile.existingMedicalDebt.toLocaleString()}</span></li>
                                                </ul>
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center justify-center opacity-60 py-4">
                                                    <AlertTriangle className="w-8 h-8 text-warning mb-2" />
                                                    <span className="text-sm">No connected identity assets</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Section -> KYC Verification */}
                                    {showVerifyKYCForm ? (
                                        <div className="mt-8 bg-card border border-primary/20 rounded-xl shadow-elevation-1 overflow-hidden animate-in slide-in-from-bottom-2">
                                            <div className="bg-primary/5 px-4 py-3 border-b border-primary/10 flex items-center gap-2">
                                                <ShieldCheck className="w-5 h-5 text-primary" />
                                                <h4 className="text-primary font-semibold">Execute Database Ping</h4>
                                            </div>
                                            <div className="p-5">
                                                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                                    This operation triggers an instant identity API check traversing Aadhaar / PAN networks to explicitly tie this FinTech dataset with physical national registries.
                                                </p>
                                                <div className="flex justify-end gap-3 border-t border-border pt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowVerifyKYCForm(false)}
                                                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                                                    >
                                                        Abort
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleVerifyKYC}
                                                        disabled={verifyLoading}
                                                        className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center min-w-[200px]"
                                                    >
                                                        {verifyLoading ? (
                                                            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            'Confirm & Authorize Ping'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-8 flex justify-end">
                                            <button
                                                onClick={() => setShowVerifyKYCForm(true)}
                                                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-elevation-1 transition-all active:scale-95 flex items-center gap-2"
                                            >
                                                <ShieldCheck className="w-[18px] h-[18px]" /> Request Live KYC Verify
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-center">
                                    <AlertTriangle className="w-12 h-12 text-destructive mb-3 opacity-80" />
                                    <p className="text-foreground font-medium">Dataset Curtailed</p>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-xs text-balance">The requested financial entity graph is locked or no longer responding to SQL calls.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
