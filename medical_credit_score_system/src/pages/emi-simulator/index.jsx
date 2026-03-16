import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import api from '../../lib/api';
import { io } from 'socket.io-client';

const EmiSimulator = () => {
    const navigate = useNavigate();
    const [creditScore, setCreditScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [loanAmount, setLoanAmount] = useState(100000);
    const [tenure, setTenure] = useState(12);
    const [treatmentType, setTreatmentType] = useState('Surgery');

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const res = await api.get('/dashboard');
                const score = res.data?.currentScore?.score || 0;
                setCreditScore(score);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
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
                console.log('[socket] EMI Simulator Connected to Live Engine');
                socket.emit('join_phid_room', phid);
            });

            socket.on('scoreUpdated', () => {
                console.log("Real-time Score Update Received in EMI Simulator");
                fetchScore();
            });

            return () => {
                socket.disconnect();
            };
        }
    }, []);

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

    // Dynamic Interest Calculation Sub-routine
    const getInterestRate = () => {
        if (creditScore >= 800) return 0; // 0% EMI for excellent scores
        if (creditScore >= 700) return 4.5;
        if (creditScore >= 600) return 8.0;
        return 12.0;
    };

    const getApprovalChance = () => {
        if (creditScore >= 750) return 99;
        if (creditScore >= 650) return 85;
        if (creditScore >= 550) return 50;
        return 20;
    };

    const interestRate = getInterestRate();
    const approvalChance = getApprovalChance();

    // Basic EMI Formula
    const calculateEMI = () => {
        const P = loanAmount;
        const R = (interestRate / 12) / 100;
        const N = tenure;

        if (R === 0) return Math.round(P / N);

        const emi = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
        return Math.round(emi);
    };

    const monthlyEMI = calculateEMI();
    const totalPayment = monthlyEMI * tenure;
    const totalInterest = Math.max(0, totalPayment - loanAmount);

    return (
        <>
            <Helmet>
                <title>Treatment EMI Simulator - MediCredit</title>
            </Helmet>

            <div className="min-h-screen bg-background flex flex-col">
                <Header onLogout={handleLogout} />
                <QuickActionsToolbar />

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-24 lg:pb-12">
                    <div className="mb-8 md:mb-10">
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3 flex items-center">
                            Treatment EMI <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ml-2">Simulator</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-3xl">
                            Plan your healthcare expenses. Your personalized simulator uses your live Medical Credit Score to predict financing costs and approval chances.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Controls Column */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="bg-card rounded-2xl shadow-elevation-2 border border-border p-6 md:p-8">
                                    <h3 className="text-xl font-semibold mb-6 flex items-center text-foreground">
                                        <Icon name="Sliders" size={20} className="mr-3 text-primary" />
                                        Configure Financing
                                    </h3>

                                    <div className="space-y-8">
                                        {/* Treatment Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Treatment Category</label>
                                            <select
                                                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 text-foreground appearance-none"
                                                value={treatmentType}
                                                onChange={(e) => setTreatmentType(e.target.value)}
                                            >
                                                <option value="Surgery">General Surgery</option>
                                                <option value="Dental">Dental Care</option>
                                                <option value="Maternity">Maternity & Childcare</option>
                                                <option value="Diagnostic">Advanced Diagnostics (MRI/CT)</option>
                                                <option value="Oncology">Oncology Treatments</option>
                                            </select>
                                        </div>

                                        {/* Loan Amount Slider */}
                                        <div>
                                            <div className="flex justify-between items-end mb-4">
                                                <label className="block text-sm font-medium text-foreground">Estimated Cost</label>
                                                <span className="text-2xl font-bold font-mono text-primary">{formatINR(loanAmount)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="10000"
                                                max="1000000"
                                                step="10000"
                                                value={loanAmount}
                                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                                <span>₹10K</span>
                                                <span>₹10L+</span>
                                            </div>
                                        </div>

                                        {/* Tenure Slider */}
                                        <div>
                                            <div className="flex justify-between items-end mb-4">
                                                <label className="block text-sm font-medium text-foreground">Repayment Tenure</label>
                                                <span className="text-2xl font-bold font-mono text-primary">{tenure} <span className="text-sm font-normal text-muted-foreground">Months</span></span>
                                            </div>
                                            <input
                                                type="range"
                                                min="3"
                                                max="60"
                                                step="3"
                                                value={tenure}
                                                onChange={(e) => setTenure(Number(e.target.value))}
                                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                                <span>3 Mos</span>
                                                <span>60 Mos</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0 mt-1">
                                        <Icon name="Info" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-1">Impact of Medical Credit Score</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Because your live score is <strong className="text-foreground">{creditScore}</strong>, you qualify for an estimated interest rate of <strong className="text-foreground">{interestRate}% p.a.</strong> Maintain scores above 800 to qualify for 0% Interest EMI programs at partner hospitals.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Breakdown Column */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="bg-card rounded-2xl shadow-elevation-2 border border-border p-6 md:p-8 relative overflow-hidden">
                                    {/* Decorative blur */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl z-0"></div>

                                    <h3 className="text-lg font-medium text-muted-foreground relative z-10">Estimated EMI</h3>
                                    <div className="flex flex-wrap items-baseline gap-2 mb-8 relative z-10">
                                        <span className="text-4xl md:text-5xl font-mono font-bold text-foreground">{formatINR(monthlyEMI)}</span>
                                        <span className="text-muted-foreground">/mo</span>
                                    </div>

                                    <div className="space-y-4 relative z-10 mb-8">
                                        <div className="flex justify-between p-4 bg-muted/40 rounded-xl border border-border">
                                            <div className="flex items-center text-muted-foreground">
                                                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                                                Principal
                                            </div>
                                            <span className="font-mono font-medium text-foreground">{formatINR(loanAmount)}</span>
                                        </div>

                                        <div className="flex justify-between p-4 bg-muted/40 rounded-xl border border-border">
                                            <div className="flex items-center text-muted-foreground">
                                                <div className="w-2 h-2 rounded-full bg-accent mr-2"></div>
                                                Total Interest <span className="ml-2 text-xs font-bold text-accent bg-accent/10 px-2 rounded-full">@{interestRate}%</span>
                                            </div>
                                            <span className="font-mono font-medium text-foreground">{formatINR(totalInterest)}</span>
                                        </div>

                                        <div className="flex justify-between p-4 bg-muted border border-border rounded-xl">
                                            <div className="font-medium text-foreground font-heading">Total Payable</div>
                                            <span className="font-mono font-bold text-foreground">{formatINR(totalPayment)}</span>
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="mb-2 flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Approval Probability</span>
                                            <span className={`font-bold ${approvalChance > 70 ? 'text-success' : approvalChance > 40 ? 'text-warning' : 'text-error'}`}>
                                                {approvalChance}% Chance
                                            </span>
                                        </div>
                                        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${approvalChance > 70 ? 'bg-success' : approvalChance > 40 ? 'bg-warning' : 'bg-error'} transition-all duration-1000 ease-out`}
                                                style={{ width: `${approvalChance}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="mt-8 relative z-10">
                                        <Button
                                            fullWidth
                                            size="lg"
                                            onClick={() => alert('Loan Application Process Initiated! Approvals are finalized with provider verification.')}
                                            className="shadow-xl shadow-primary/20"
                                        >
                                            Pre-Qualify Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <MobileBottomNav creditScore={creditScore} creditTrend="up" />
            </div>
        </>
    );
};

export default EmiSimulator;
