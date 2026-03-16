import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientDataService from '../services/PatientDataService';

export default function ProviderDashboard() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<any[]>([]);
    const [averageScore, setAverageScore] = useState(0);
    const [scoreDistribution, setScoreDistribution] = useState<any>({});
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const patientService = PatientDataService.getInstance();
        
        // Load initial data
        const loadData = () => {
            const allPatients = patientService.getAllPatients();
            setPatients(allPatients);
            setAverageScore(patientService.getAverageScore());
            setScoreDistribution(patientService.getScoreDistribution());
            setRecentActivities(patientService.getRecentActivities());
            setLoading(false);
        };

        loadData();

        // Subscribe to updates
        const unsubscribe = patientService.subscribe((updatedPatients) => {
            const patientArray = Array.from(updatedPatients.values());
            setPatients(patientArray);
            setAverageScore(patientService.getAverageScore());
            setScoreDistribution(patientService.getScoreDistribution());
            setRecentActivities(patientService.getRecentActivities());
        });

        return unsubscribe;
    }, []);

    const getScoreColor = (score: number) => {
        if (score >= 800) return 'text-green-400';
        if (score >= 650) return 'text-blue-400';
        if (score >= 500) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBadge = (score: number) => {
        if (score >= 800) return 'bg-green-500/20 text-green-400 border-green-500/30';
        if (score >= 650) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        if (score >= 500) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading patient data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
                    <p className="text-gray-400">Real-time patient analytics and monitoring</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Total Patients</span>
                            <span className="text-2xl">👥</span>
                        </div>
                        <div className="text-3xl font-bold">{patients.length}</div>
                        <div className="text-green-400 text-sm">Active</div>
                    </div>

                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Average Score</span>
                            <span className="text-2xl">📊</span>
                        </div>
                        <div className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
                            {Math.round(averageScore)}
                        </div>
                        <div className="text-gray-400 text-sm">Medical Credit</div>
                    </div>

                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Excellent Scores</span>
                            <span className="text-2xl">⭐</span>
                        </div>
                        <div className="text-3xl font-bold text-green-400">{scoreDistribution.excellent || 0}</div>
                        <div className="text-gray-400 text-sm">800+ points</div>
                    </div>

                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400">Recent Activity</span>
                            <span className="text-2xl">🔄</span>
                        </div>
                        <div className="text-3xl font-bold">{recentActivities.length}</div>
                        <div className="text-gray-400 text-sm">Last 24h</div>
                    </div>
                </div>

                {/* Score Distribution */}
                <div className="glass-panel p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Score Distribution</h2>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                <span className="text-green-400 font-bold">{scoreDistribution.excellent || 0}</span>
                            </div>
                            <div className="text-sm text-gray-400">Excellent</div>
                            <div className="text-xs text-gray-500">800+</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                <span className="text-blue-400 font-bold">{scoreDistribution.good || 0}</span>
                            </div>
                            <div className="text-sm text-gray-400">Good</div>
                            <div className="text-xs text-gray-500">650-799</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                                <span className="text-yellow-400 font-bold">{scoreDistribution.fair || 0}</span>
                            </div>
                            <div className="text-sm text-gray-400">Fair</div>
                            <div className="text-xs text-gray-500">500-649</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                                <span className="text-red-400 font-bold">{scoreDistribution.poor || 0}</span>
                            </div>
                            <div className="text-sm text-gray-400">Poor</div>
                            <div className="text-xs text-gray-500">&lt;500</div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="glass-panel p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Recent Patient Activities</h2>
                    <div className="space-y-3">
                        {recentActivities.map((activity) => (
                            <div key={`${activity.patientId}-${activity.id}`} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        activity.scoreChange > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                                    }`}>
                                        <span className="text-sm">{activity.scoreChange > 0 ? '↑' : '↓'}</span>
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{activity.title}</div>
                                        <div className="text-gray-400 text-sm">{activity.patientName} • {activity.type}</div>
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
                        {recentActivities.length === 0 && (
                            <div className="text-center text-gray-400 py-8">
                                No recent activities. Patients need to complete health activities!
                            </div>
                        )}
                    </div>
                </div>

                {/* Patient List */}
                <div className="glass-panel p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Patient Overview</h2>
                        <button
                            onClick={() => navigate('/patients')}
                            className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition text-blue-400"
                        >
                            View All Patients
                        </button>
                    </div>
                    <div className="space-y-3">
                        {patients.map((patient) => (
                            <div key={patient.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold">
                                            {patient.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{patient.name}</div>
                                        <div className="text-gray-400 text-sm">{patient.id}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className={`font-bold ${getScoreColor(patient.score)}`}>
                                            {patient.score}
                                        </div>
                                        <div className="text-gray-400 text-xs">Credit Score</div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getScoreBadge(patient.score)}`}>
                                        {patient.score >= 800 ? 'Excellent' :
                                         patient.score >= 650 ? 'Good' :
                                         patient.score >= 500 ? 'Fair' : 'Poor'}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
                                        {patient.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <button
                        onClick={() => navigate('/billing')}
                        className="glass-panel p-6 hover:bg-white/10 transition text-center"
                    >
                        <div className="text-3xl mb-2">💳</div>
                        <div className="text-white font-medium">Billing</div>
                        <div className="text-gray-400 text-sm">Manage patient billing</div>
                    </button>
                    <button
                        onClick={() => navigate('/analytics')}
                        className="glass-panel p-6 hover:bg-white/10 transition text-center"
                    >
                        <div className="text-3xl mb-2">📈</div>
                        <div className="text-white font-medium">Analytics</div>
                        <div className="text-gray-400 text-sm">View detailed analytics</div>
                    </button>
                    <button
                        onClick={() => navigate('/settings')}
                        className="glass-panel p-6 hover:bg-white/10 transition text-center"
                    >
                        <div className="text-3xl mb-2">⚙️</div>
                        <div className="text-white font-medium">Settings</div>
                        <div className="text-gray-400 text-sm">Provider settings</div>
                    </button>
                </div>
            </div>
        </div>
    );
}
