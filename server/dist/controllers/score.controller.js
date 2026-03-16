"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScoreDetails = exports.getScoreHistory = exports.calculateScore = exports.calculateScoreLogic = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const index_1 = require("../index"); // Import the global socket io instance
const calculateScoreLogic = async (patientId) => {
    const patient = await prisma_1.default.patientProfile.findUnique({
        where: { userId: patientId },
        include: { financialProfile: true }
    });
    const patAny = patient;
    if (!patient || !patAny.financialProfile) {
        throw new Error('Incomplete profile data');
    }
    // --- Core Activity-Based Scoring Algorithm ---
    // 1. Fetch patient timeline events to build the score fundamentally on actions.
    const timelineEvents = await prisma_1.default.timelineEvent.findMany({
        where: { patientId: patient.id }
    });
    // 2. Network Loyalty Factor (Hospital Visits)
    const visits = timelineEvents.filter(e => e.type === 'visit').length;
    const visitScore = Math.min(200, visits * 50);
    // 3. Health Discipline Factor (Online Tasks Completed)
    const tasks = timelineEvents.filter(e => e.type === 'task').length;
    const taskScore = Math.min(200, tasks * 20);
    // 4. Financial Risk Mitigation Factor (Insurance Linked)
    const hasInsurance = timelineEvents.some(e => e.type === 'milestone' && e.title.toLowerCase().includes('insurance'));
    const insuranceScore = hasInsurance ? 100 : 0;
    // Sum the activity-driven health profile
    let healthScore = visitScore + taskScore + insuranceScore;
    // 5. Baseline Financial Factor (Credit History & Medical Debt)
    const normalizedCredit = ((patAny.financialProfile.creditHistory - 300) / 550) * 400;
    let financialScore = Math.max(0, Math.min(400, normalizedCredit));
    if (patAny.financialProfile.existingMedicalDebt > 5000) {
        financialScore -= 50;
    }
    financialScore = Math.max(0, financialScore);
    // 6. Provider Bonus Points (The Human Element)
    const providerGrantedPoints = patient.providerGrantedPoints || 0;
    // Total MediScore (0 - 1000 bounds)
    let finalScore = Math.round(healthScore + financialScore + providerGrantedPoints);
    // Ensure bounds
    finalScore = Math.max(0, Math.min(1000, finalScore));
    // Determine Risk Level Enum
    let riskLevel = 'HIGH_RISK';
    if (finalScore >= 800)
        riskLevel = 'EXCELLENT';
    else if (finalScore >= 650)
        riskLevel = 'GOOD';
    else if (finalScore >= 500)
        riskLevel = 'FAIR';
    // Store the historical calculation in the database
    const newScoreRecord = await prisma_1.default.medicalCreditScore.create({
        data: {
            patientId: patient.id,
            scoreValue: finalScore,
            paymentHistoryScore: healthScore,
            incomeStabilityScore: financialScore,
            medicalDebtScore: Math.min(100, patient.financialProfile?.existingMedicalDebt === 0 ? 100 : 50),
            insuranceCoverageScore: 80,
            totalBonus: providerGrantedPoints,
            riskLevel: riskLevel,
            recommendation: riskLevel === 'EXCELLENT' ? 'standard_approval' : (riskLevel === 'GOOD' ? 'standard_approval' : 'co_signer'),
            factorBreakdown: JSON.stringify({ health: healthScore, finance: financialScore, providerBonus: providerGrantedPoints }),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
    });
    // --- REALI-TIME REACTIVE EMIT ---
    // Push the new score out to the specific patient's active listening socket immediately
    if (index_1.io) {
        index_1.io.to(`user_room_${patientId}`).emit('score_updated', {
            newScore: finalScore,
            category: riskLevel,
            timestamp: new Date().toISOString()
        });
        console.log(`[Socket] Pushed live score update (${finalScore}) to user_room_${patientId}`);
    }
    return {
        score: newScoreRecord,
        insights: [
            patient.smoking && "Quitting smoking dramatically improves health component points.",
            patient.bmi > 25 && "Lowering BMI to the 18.5-24.9 range optimizes clinical risk limits.",
            patAny.financialProfile.creditHistory < 650 && "Financial credit standing is capping maximum MediScore potential.",
        ].filter(Boolean)
    };
};
exports.calculateScoreLogic = calculateScoreLogic;
const calculateScore = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        if (req.user?.role === 'PATIENT' && req.user.id !== patientId) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }
        const result = await (0, exports.calculateScoreLogic)(patientId);
        res.json(result);
    }
    catch (error) {
        if (error.message === 'Incomplete profile data') {
            res.status(400).json({ error: 'Incomplete profile data. Please complete onboarding first.' });
            return;
        }
        res.status(500).json({ error: 'Failed to calculate medical credit score' });
    }
};
exports.calculateScore = calculateScore;
const getScoreHistory = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const patient = await prisma_1.default.patientProfile.findUnique({
            where: { userId: patientId }
        });
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        const history = await prisma_1.default.medicalCreditScore.findMany({
            where: { patientId: patient.id },
            orderBy: { calculatedAt: 'asc' }
        });
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching score history' });
    }
};
exports.getScoreHistory = getScoreHistory;
const getScoreDetails = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const profile = await prisma_1.default.patientProfile.findUnique({
            where: { userId },
            include: {
                timelineEvents: { orderBy: { date: 'desc' }, take: 10 },
                billingRecords: true,
                financialProfile: true,
                notifications: { orderBy: { createdAt: 'desc' }, take: 5 }
            }
        });
        if (!profile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }
        const scores = await prisma_1.default.medicalCreditScore.findMany({
            where: { patientId: profile.id },
            orderBy: { calculatedAt: 'asc' }
        });
        const currentScore = scores.length > 0 ? scores[scores.length - 1].scoreValue : 0;
        const trend = scores.length > 1 && currentScore > scores[scores.length - 2].scoreValue ? 'up' : 'down';
        const historyData = scores.map((s, idx) => ({
            date: s.calculatedAt.toISOString().slice(0, 7), // YYYY-MM
            score: s.scoreValue,
            event: idx === scores.length - 1 ? 'Current Evaluation' : `Rating: ${s.riskLevel}`
        }));
        const totalBills = profile.billingRecords.reduce((sum, b) => sum + b.billAmount, 0);
        const outstanding = profile.billingRecords.reduce((sum, b) => sum + (b.status !== 'paid' ? b.outstanding : 0), 0);
        const currentYear = new Date().getFullYear();
        const pointsThisYear = profile.timelineEvents
            .filter(e => e.date.getFullYear() === currentYear && e.impact > 0)
            .reduce((sum, e) => sum + e.impact, 0);
        const totalBillsCount = profile.billingRecords.length;
        const paidBillsCount = profile.billingRecords.filter(b => b.status === 'paid').length;
        const paymentRatio = totalBillsCount > 0 ? Math.round((paidBillsCount / totalBillsCount) * 100) : 100;
        const formatINR = (amount) => {
            if (amount >= 100000) {
                return `₹${(amount / 100000).toFixed(1)}L`;
            }
            else if (amount >= 1000) {
                return `₹${(amount / 1000).toFixed(1)}K`;
            }
            return `₹${amount}`;
        };
        const totalBillsFormatted = formatINR(totalBills);
        res.json({
            patientData: {
                name: `${profile.firstName} ${profile.lastName}`,
                patientId: `MCI-${profile.id.substring(0, 8).toUpperCase()}`,
                creditScore: currentScore,
                creditTrend: trend,
                validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                pointsThisYear,
                paymentRatio,
                totalBillsFormatted
            },
            historyData,
            timelineEvents: profile.timelineEvents.map(e => ({
                id: e.id,
                type: e.type,
                title: e.title,
                date: e.date.toISOString().split('T')[0],
                description: e.description,
                impact: e.impact
            })),
            notifications: profile.notifications,
            // Score components dynamically derived from DB primitives
            scoreBreakdown: [
                ...(profile.providerGrantedPoints > 0 ? [
                    {
                        factor: "Provider Merit Points",
                        score: profile.providerGrantedPoints,
                        maxScore: 100,
                        weight: 15,
                        trend: "up",
                        description: `You have been awarded ${profile.providerGrantedPoints} extra points by your healthcare provider for loyalty and disciplined care.`,
                        icon: "Award",
                        color: "#fbbf24"
                    }
                ] : []),
                {
                    factor: "Total Medical Bills",
                    score: Math.min(300, 100 + (totalBills / 1000)),
                    maxScore: 300,
                    weight: 30,
                    trend: "up",
                    description: `Your total medical expenditure of ₹${totalBills.toLocaleString()} demonstrates systematic healthcare engagement.`,
                    icon: "Receipt",
                    color: "var(--color-primary)"
                },
                {
                    factor: "Outstanding Dues",
                    score: outstanding === 0 ? 250 : Math.max(50, 250 - (outstanding / 100)),
                    maxScore: 250,
                    weight: 25,
                    trend: outstanding === 0 ? "stable" : "down",
                    description: `You have ₹${outstanding.toLocaleString()} in outstanding dues, showing ${outstanding === 0 ? 'excellent' : 'ongoing'} payment discipline.`,
                    icon: "AlertCircle",
                    color: "var(--color-success)"
                },
                {
                    factor: "Hospital Visit Frequency",
                    score: Math.min(100, profile.timelineEvents.filter(e => e.type === 'visit').length * 20),
                    maxScore: 100,
                    weight: 10,
                    trend: "up",
                    description: `You've made ${profile.timelineEvents.filter(e => e.type === 'visit').length} recent visits, indicating proactive health management.`,
                    icon: "Activity",
                    color: "var(--color-accent)"
                }
            ],
            recommendations: [
                {
                    title: "Clear Outstanding Balance",
                    description: outstanding > 0 ? `Paying off your remaining ₹${outstanding.toLocaleString()} outstanding dues will immediately boost your score.` : "Maintain your cleared balance by setting up auto-payment.",
                    impact: outstanding > 0 ? 35 : 5,
                    actionLabel: outstanding > 0 ? "View Payment Options" : "Set Auto-Pay",
                    priority: outstanding > 0 ? "high" : "low",
                    icon: "CreditCard"
                }
            ]
        });
    }
    catch (error) {
        console.error('Error fetching score details:', error);
        res.status(500).json({ error: 'Internal server error processing score details' });
    }
};
exports.getScoreDetails = getScoreDetails;
