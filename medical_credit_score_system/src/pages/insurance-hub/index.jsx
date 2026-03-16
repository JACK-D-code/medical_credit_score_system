import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import api from '../../lib/api';
import { io } from 'socket.io-client';

// Modular Components
import PolicySearchModule from './components/PolicySearchModule';
import CoverageStatusModule from './components/CoverageStatusModule';
import InsuranceBenefitsModule from './components/InsuranceBenefitsModule';

const InsuranceHub = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        provider: 'HDFC Ergo Health',
        policyNumber: '',
    });
    const [isLinking, setIsLinking] = useState(false);
    const [linkedPolicies, setLinkedPolicies] = useState([]);
    const [creditScore, setCreditScore] = useState(0);
    const [creditTrend, setCreditTrend] = useState('stable');

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const res = await api.get('/dashboard');
                const score = res.data?.currentScore?.score || 0;
                setCreditScore(score);
                setCreditTrend(res.data?.currentScore?.trend || 'stable');
            } catch (err) {
                console.error(err);
            }
        };
        fetchScore();

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const phid = user?.phid;

        if (phid) {
            const socket = io('http://localhost:5000', {
                withCredentials: true,
            });

            socket.on('connect', () => {
                console.log('[socket] Insurance Hub Connected to Live Engine');
                socket.emit('join_phid_room', phid);
            });

            socket.on('scoreUpdated', () => {
                console.log("Real-time Score Update Received in Insurance Hub");
                fetchScore();
            });

            return () => {
                socket.disconnect();
            };
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLinkPolicy = async (e) => {
        e.preventDefault();
        if (!formData.policyNumber) return;

        setIsLinking(true);
        try {
            // Simulate verifying insurance with provider
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Post to complete-task to increase score instantly
            await api.post('/profile/complete-task', {
                taskId: `ins_${Math.random().toString(36).substr(2, 9)}`,
                points: 100,
                type: 'milestone',
                title: 'Insurance Linked',
                description: `Verified and linked ${formData.provider} health insurance policy.`
            });

            setLinkedPolicies(prev => [...prev, {
                id: Math.random().toString(36).substr(2, 9),
                provider: formData.provider,
                policyNumber: formData.policyNumber,
                coverageAmount: 500000,
                status: 'Active',
                linkedDate: new Date().toLocaleDateString()
            }]);

            setFormData({ provider: 'HDFC Ergo Health', policyNumber: '' });
            alert('Policy linked successfully! Your Medical Credit Score has been positively impacted.');
        } catch (error) {
            console.error(error);
            alert('Failed to link policy. Please try again.');
        } finally {
            setIsLinking(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/patient-login');
    };

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <>
            <Helmet>
                <title>Health Insurance Hub - MediCredit</title>
            </Helmet>

            <div className="min-h-screen bg-background flex flex-col">
                <Header onLogout={handleLogout} />
                <QuickActionsToolbar />

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-24 lg:pb-12">
                    {/* Header Section */}
                    <div className="mb-8 md:mb-10">
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3 flex items-center">
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Insurance Hub
                            </span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-3xl">
                            Connect your health insurance policies to instantly strengthen your medical creditworthiness and unlock better healthcare financing options.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Link Policy Form */}
                        <div className="lg:col-span-1 space-y-6">
                            <PolicySearchModule 
                                formData={formData} 
                                handleChange={handleChange} 
                                handleLinkPolicy={handleLinkPolicy} 
                                isLinking={isLinking} 
                            />
                        </div>

                        {/* Right Column: Linked Policies & Insights */}
                        <div className="lg:col-span-2 space-y-6">
                            <CoverageStatusModule 
                                linkedPolicies={linkedPolicies} 
                                formatINR={formatINR} 
                            />

                            <InsuranceBenefitsModule />
                        </div>
                    </div>
                </main>

                <MobileBottomNav creditScore={creditScore} creditTrend={creditTrend} />
            </div>
        </>
    );
};

export default InsuranceHub;
