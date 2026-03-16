import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function PatientDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [animatedScore, setAnimatedScore] = useState<number>(0);
    const [emis, setEmis] = useState<any[]>([]);
    const [patientActivities, setPatientActivities] = useState<any[]>([]);
    const [realTimeScore, setRealTimeScore] = useState<number>(750);

    // The state was passed from Onboarding.tsx or Login.tsx
    const scoreData = (location.state as any)?.scoreData;

    // Initialize real-time score system
    useEffect(() => {
        // Load saved score from localStorage or use initial score
        const savedScore = localStorage.getItem('patientCreditScore');
        const savedActivities = localStorage.getItem('patientActivities');
        
        if (savedScore) {
            setRealTimeScore(parseInt(savedScore));
        } else if (scoreData?.score?.scoreValue) {
            setRealTimeScore(scoreData.score.scoreValue);
            localStorage.setItem('patientCreditScore', scoreData.score.scoreValue.toString());
        }

        if (savedActivities) {
            setPatientActivities(JSON.parse(savedActivities));
        }

        // Listen for score updates from other modules
        const handleScoreUpdate = (event: CustomEvent) => {
            const { newScore, activity } = event.detail;
            updateScore(newScore, activity);
        };

        window.addEventListener('scoreUpdate', handleScoreUpdate as EventListener);
        
        return () => {
            window.removeEventListener('scoreUpdate', handleScoreUpdate as EventListener);
        };
    }, [scoreData]);

    // Load EMI data
    useEffect(() => {
        api.get('/billing/emi-schedules')
            .then(res => setEmis(res.data))
            .catch(err => console.error(err));
    }, []);

    // Update score with animation
    const updateScore = (newScore: number, activity?: any) => {
        setRealTimeScore(newScore);
        localStorage.setItem('patientCreditScore', newScore.toString());
        
        // Add activity to history
        if (activity) {
            const newActivity = {
                id: Date.now(),
                type: activity.type || 'GENERAL',
                title: activity.title || 'Activity Completed',
                points: activity.points || 0,
                timestamp: new Date().toISOString(),
                scoreChange: newScore - realTimeScore
            };
            
            const updatedActivities = [newActivity, ...patientActivities];
            setPatientActivities(updatedActivities);
            localStorage.setItem('patientActivities', JSON.stringify(updatedActivities));
        }
    };

    // Simulate patient activities and score changes
    const simulateActivity = (type: string, points: number) => {
        const newScore = Math.min(1000, Math.max(0, realTimeScore + points));
        const activity = {
            type: type,
            title: `${type} Activity`,
            points: points
        };
        
        // Dispatch score update event
        window.dispatchEvent(new CustomEvent('scoreUpdate', {
            detail: { newScore, activity }
        }));
    };

    // Animate score changes
    useEffect(() => {
        const finalScore = realTimeScore;

        // Animate to new score
        let current = animatedScore;
        const step = (finalScore - current) / 30;

        const interval = setInterval(() => {
            current += step;
            if ((step > 0 && current >= finalScore) || (step < 0 && current <= finalScore)) {
                clearInterval(interval);
                setAnimatedScore(finalScore);
            } else {
                setAnimatedScore(Math.round(current));
            }
        }, 20);

        return () => clearInterval(interval);
    }, [realTimeScore]);

    // Update CSS Variable for conic gradient
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
                <h2 className="text-xl font-medium text-gray-400 mb-2">Your Medical Credit Score</h2>
                {scoreData?.patientData?.patientId && (
                    <div className="inline-block px-3 py-1 mb-6 mt-2 rounded bg-[rgba(0,242,254,0.1)] border border-[#00f2fe]/30 text-[#00f2fe] text-xs font-mono font-bold">
                        PH ID: {scoreData.patientData.patientId}
                    </div>
                )}

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

                {/* Activity Simulation Buttons */}
                <div className="flex flex-col gap-3 mt-10 w-full px-6">
                    <div className="text-xs text-gray-500 text-center mb-2">Simulate Activities (For Testing)</div>
                    <button
                        onClick={() => simulateActivity('MEDICINE', 10)}
                        className="w-full px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 text-green-400 font-medium transition text-sm"
                    >
                        💊 Take Medicine (+10)
                    </button>
                    <button
                        onClick={() => simulateActivity('EXERCISE', 15)}
                        className="w-full px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-400 font-medium transition text-sm"
                    >
                        🏃 Exercise (+15)
                    </button>
                    <button
                        onClick={() => simulateActivity('APPOINTMENT', 20)}
                        className="w-full px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-400 font-medium transition text-sm"
                    >
                        🏥 Appointment (+20)
                    </button>
                    <button
                        onClick={() => simulateActivity('MISSED_DOSE', -5)}
                        className="w-full px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 font-medium transition text-sm"
                    >
                        ❌ Missed Dose (-5)
                    </button>
                </div>

                <div className="flex flex-col gap-3 mt-6 w-full px-6">
                    <button
                        onClick={() => navigate('/claim-credit')}
                        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-400 font-medium transition text-sm flex items-center justify-center gap-2"
                    >
                        <span>⭐</span> Claim Extra Credit
                    </button>
                    <button
                        onClick={() => navigate('/offers')}
                        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-400 font-medium transition text-sm flex items-center justify-center gap-2"
                    >
                        <span>🎁</span> Apply for Offers
                    </button>
                </div>
            </div>

            {/* Middle Column: Details & Actions */}
            <div className="lg:col-span-2 space-y-6">
                {/* Recent Activities */}
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>📊</span> Recent Activities
                    </h3>
                    <div className="space-y-3">
                        {patientActivities.slice(0, 5).map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        activity.scoreChange > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                                    }`}>
                                        <span className="text-sm">{activity.scoreChange > 0 ? '↑' : '↓'}</span>
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{activity.title}</div>
                                        <div className="text-gray-400 text-xs">{activity.type}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-bold ${activity.scoreChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {activity.scoreChange > 0 ? '+' : ''}{activity.scoreChange}
                                    </div>
                                    <div className="text-gray-400 text-xs">
                                        {new Date(activity.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {patientActivities.length === 0 && (
                            <div className="text-center text-gray-400 py-8">
                                No activities yet. Start by completing health activities!
                            </div>
                        )}
                    </div>
                </div>

                {/* Credit Factors */}
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>🎯</span> Credit Factors
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="text-gray-400 text-sm mb-1">Payment History</div>
                            <div className="text-white font-bold">95%</div>
                            <div className="text-green-400 text-xs">Excellent</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="text-gray-400 text-sm mb-1">Health Adherence</div>
                            <div className="text-white font-bold">88%</div>
                            <div className="text-blue-400 text-xs">Good</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="text-gray-400 text-sm mb-1">Activity Level</div>
                            <div className="text-white font-bold">High</div>
                            <div className="text-purple-400 text-xs">Active</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="text-gray-400 text-sm mb-1">Trust Score</div>
                            <div className="text-white font-bold">{Math.round(realTimeScore / 10)}%</div>
                            <div className="text-yellow-400 text-xs">Building</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>⚡</span> Quick Actions
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => navigate('/billing-records')}
                            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition text-center"
                        >
                            <div className="text-2xl mb-2">💳</div>
                            <div className="text-white text-sm">Billing</div>
                        </button>
                        <button
                            onClick={() => navigate('/activity-reports')}
                            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition text-center"
                        >
                            <div className="text-2xl mb-2">📈</div>
                            <div className="text-white text-sm">Reports</div>
                        </button>
                        <button
                            onClick={() => navigate('/profile-management')}
                            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition text-center"
                        >
                            <div className="text-2xl mb-2">👤</div>
                            <div className="text-white text-sm">Profile</div>
                        </button>
                    </div>
                </div>

                {/* EMI Information */}
                {emis.length > 0 && (
                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>📅</span> Active EMIs
                        </h3>
                        <div className="space-y-3">
                            {emis.slice(0, 3).map((emi) => (
                                <div key={emi.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                    <div>
                                        <div className="text-white font-medium">{emi.description}</div>
                                        <div className="text-gray-400 text-sm">Monthly: ₹{emi.monthlyAmount}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-bold">₹{emi.remainingAmount}</div>
                                        <div className="text-gray-400 text-xs">{emi.remainingMonths} months left</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
