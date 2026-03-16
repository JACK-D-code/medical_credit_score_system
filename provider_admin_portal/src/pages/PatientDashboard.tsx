import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function PatientDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [animatedScore, setAnimatedScore] = useState<number>(0);
    const [emis, setEmis] = useState<any[]>([]);

    // The state was passed from Onboarding.tsx or Login.tsx
    const scoreData = (location.state as any)?.scoreData;

    useEffect(() => {
        api.get('/billing/emi-schedules')
            .then(res => setEmis(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (!scoreData || !scoreData.score) return;

        const finalScore = scoreData.score.scoreValue;

        // Animate to new score
        let current = 0;
        const step = finalScore / 30;

        const interval = setInterval(() => {
            current += step;
            if (current >= finalScore) {
                clearInterval(interval);
                setAnimatedScore(finalScore);
            } else {
                setAnimatedScore(Math.round(current));
            }
        }, 20);

        return () => clearInterval(interval);
    }, [scoreData]);

    // Update CSS Variable for the conic gradient
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--score-pct', `${(animatedScore / 1000) * 100}%`);
    }, [animatedScore]);

    if (!scoreData) {
        return <Navigate to="/onboarding" replace />;
    }

    const getStatus = (s: number) => {
        if (s >= 800) return { label: 'Excellent', class: 'status-excellent', desc: 'Prime rates approved for medical loans.' };
        if (s >= 650) return { label: 'Good', class: 'status-good', desc: 'Standard rates approved for most procedures.' };
        if (s >= 500) return { label: 'Fair', class: 'status-fair', desc: 'May require co-signer for large medical lines of credit.' };
        return { label: 'High Risk', class: 'status-poor', desc: 'High-risk profile. Additional assessment needed.' };
    };

    const status = getStatus(animatedScore);

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Score Visualization */}
            <div className="glass-panel lg:col-span-1 score-display justify-start py-10">
                <h2 className="text-xl font-medium text-gray-400 mb-8">Your Medical Credit Score</h2>

                <div className="score-circle">
                    <div className="score-content">
                        <div className="score-value">{animatedScore}</div>
                        <div className="score-label">out of 1000</div>
                    </div>
                </div>

                <div className={`status-badge ${status.class} mt-4 mb-6`}>
                    {status.label}
                </div>

                <p className="text-center text-gray-300 text-sm px-4">
                    {status.desc}
                </p>

                <button
                    onClick={() => navigate('/onboarding')}
                    className="mt-10 px-6 py-2 rounded-full border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] transition text-sm"
                >
                    Retake Assessment
                </button>
            </div>

            {/* Right Column: Breakdown & Charts */}
            <div className="lg:col-span-2 flex flex-col gap-8">

                <div className="glass-panel p-6">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span className="text-[#00f2fe]">Score Breakdown</span>
                    </h3>

                    <div className="metrics-grid">
                        <div className="metric-card">
                            <div className="metric-label">Health Base Component</div>
                            <div className="metric-value">{scoreData.score.healthComponentScore.toFixed(0)} <span className="text-xs text-gray-500 font-normal">/ 600</span></div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-label">Financial Component</div>
                            <div className="metric-value">{scoreData.score.financialComponentScore.toFixed(0)} <span className="text-xs text-gray-500 font-normal">/ 400</span></div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-label">Calculated Risk Level</div>
                            <div className={`metric-value ${scoreData.score.riskLevel === 'HIGH_RISK' ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
                                {scoreData.score.riskLevel.replace('_', ' ')}
                            </div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-label">Approval Probability</div>
                            <div className="metric-value text-[#10b981]">
                                {Math.min(99, (scoreData.score.scoreValue / 10)).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 flex-1">
                    <h3 className="text-xl font-semibold mb-4 text-[#8b5cf6]">Improvement Factors</h3>
                    <ul className="space-y-4">
                        {scoreData.insights && scoreData.insights.length > 0 ? (
                            scoreData.insights.map((insight: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)]">
                                    <div className="text-[#f59e0b] mt-0.5">💡</div>
                                    <div>
                                        <p className="font-medium text-[#f59e0b]">Insight</p>
                                        <p className="text-sm text-gray-300">{insight}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)]">
                                <div className="text-[#10b981] mt-0.5">⭐</div>
                                <div>
                                    <p className="font-medium text-[#10b981]">Optimal Profile</p>
                                    <p className="text-sm text-gray-300">You are maintaining an excellent balance of clinical and financial health.</p>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Bottom Row: Active EMIs & Medical Loans */}
            {emis.length > 0 && (
                <div className="glass-panel lg:col-span-3 p-6">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span className="text-white">Active Medical Loans & EMIs</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {emis.map((app, idx) => (
                            <div key={app.id} className="p-5 border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.2)] rounded-xl">
                                <div className="flex justify-between items-start mb-4 border-b border-[rgba(255,255,255,0.05)] pb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-white">Loan #{idx + 1}</h4>
                                        <p className="text-sm text-gray-400 mt-1">{app.billingRecord?.hospitalName} - {app.billingRecord?.treatmentType}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Principal</p>
                                        <p className="font-mono font-bold text-[#00f2fe]">₹{app.requestedAmount}</p>
                                    </div>
                                </div>

                                <h5 className="text-sm font-semibold text-gray-300 mb-3">Installment Schedule</h5>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {app.emiSchedules?.map((emi: any) => (
                                        <div key={emi.id} className="flex justify-between items-center text-sm p-2 bg-[rgba(255,255,255,0.02)] rounded">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 w-4 text-center">{emi.installmentNumber}</span>
                                                <span className={emi.status === 'paid' ? 'text-gray-500 line-through' : 'text-gray-200'}>
                                                    {new Date(emi.dueDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-mono text-[#10b981]">₹{emi.amountDue}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${emi.status === 'paid' ? 'bg-[rgba(16,185,129,0.1)] text-[#10b981]' :
                                                        emi.status === 'overdue' ? 'bg-[rgba(239,68,68,0.1)] text-[#ef4444]' :
                                                            'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]'
                                                    }`}>
                                                    {emi.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
