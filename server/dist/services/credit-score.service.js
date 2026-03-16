"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditScoreService = void 0;
const client_1 = require("@prisma/client");
const websocket_service_1 = require("./websocket.service");
const prisma = new client_1.PrismaClient();
class CreditScoreService {
    websocketService;
    constructor() {
        this.websocketService = new websocket_service_1.WebSocketService();
    }
    /**
     * Calculate credit score for a patient
     */
    async calculateCreditScore(patientId) {
        try {
            // Get patient data
            const patient = await prisma.patient.findUnique({
                where: { id: patientId },
                include: {
                    medicalActivities: true,
                    evaluations: true,
                    creditScores: {
                        orderBy: { calculatedAt: 'desc' },
                        take: 1
                    }
                }
            });
            if (!patient) {
                throw new Error('Patient not found');
            }
            // Calculate individual factors
            const paymentHistoryScore = await this.calculatePaymentHistoryScore(patient);
            const insuranceScore = await this.calculateInsuranceScore(patient);
            const incomeScore = await this.calculateIncomeScore(patient);
            const medicalRiskScore = await this.calculateMedicalRiskScore(patient);
            const bonusPoints = await this.calculateBonusPoints(patient);
            // Calculate final score
            const baseScore = 300; // Minimum score
            const weightedScore = (paymentHistoryScore * 0.40) + // 40% weight
                (insuranceScore * 0.25) + // 25% weight
                (incomeScore * 0.20) + // 20% weight
                (medicalRiskScore * 0.15); // 15% weight
            const finalScore = Math.min(850, Math.max(300, Math.round(baseScore + weightedScore + bonusPoints)));
            const scoreCategory = this.getScoreCategory(finalScore);
            // Save to database
            const creditScore = await prisma.creditScore.create({
                data: {
                    patientId,
                    score: finalScore,
                    scoreCategory,
                    paymentHistoryScore,
                    insuranceScore,
                    incomeScore,
                    medicalRiskScore,
                    bonusPoints,
                    calculatedAt: new Date()
                }
            });
            // Broadcast real-time update
            await this.websocketService.broadcastScoreUpdate(patientId, {
                newScore: finalScore,
                scoreCategory,
                factors: {
                    paymentHistoryScore,
                    insuranceScore,
                    incomeScore,
                    medicalRiskScore,
                    bonusPoints
                }
            });
            return {
                paymentHistoryScore,
                insuranceScore,
                incomeScore,
                medicalRiskScore,
                bonusPoints,
                finalScore,
                scoreCategory
            };
        }
        catch (error) {
            console.error('Error calculating credit score:', error);
            throw error;
        }
    }
    /**
     * Calculate payment history score (40% weight)
     */
    async calculatePaymentHistoryScore(patient) {
        const activities = patient.medicalActivities || [];
        let score = 50; // Base score
        // On-time payments
        const onTimePayments = activities.filter(a => a.activityType === 'CHECKUP' || a.activityType === 'APPOINTMENT').length;
        score += onTimePayments * 2;
        // Consistency bonus
        if (onTimePayments >= 12)
            score += 20;
        else if (onTimePayments >= 6)
            score += 10;
        else if (onTimePayments >= 3)
            score += 5;
        // Penalties for missed activities
        const missedDays = this.calculateMissedActivities(activities);
        score -= missedDays * 5;
        return Math.min(100, Math.max(0, score));
    }
    /**
     * Calculate insurance score (25% weight)
     */
    async calculateInsuranceScore(patient) {
        let score = 30; // Base score
        // Has valid insurance (assuming from patient profile)
        score += 25;
        // Coverage amount (mock calculation)
        const coverageAmount = 500000; // Default coverage
        if (coverageAmount >= 1000000)
            score += 25;
        else if (coverageAmount >= 500000)
            score += 15;
        else if (coverageAmount >= 200000)
            score += 10;
        // Insurance type bonus
        score += 10; // Comprehensive insurance bonus
        // Claim history penalty (mock)
        const claimHistory = 0; // No claims
        score -= claimHistory * 10;
        return Math.min(100, Math.max(0, score));
    }
    /**
     * Calculate income score (20% weight)
     */
    async calculateIncomeScore(patient) {
        let score = 40; // Base score
        // Employment stability (mock)
        score += 20; // Stable employment
        // Income level (mock)
        const incomeLevel = 50000; // Annual income
        if (incomeLevel >= 100000)
            score += 20;
        else if (incomeLevel >= 50000)
            score += 15;
        else if (incomeLevel >= 30000)
            score += 10;
        // Credit history (mock)
        score += 5; // Good credit history
        return Math.min(100, Math.max(0, score));
    }
    /**
     * Calculate medical risk score (15% weight)
     */
    async calculateMedicalRiskScore(patient) {
        let score = 50; // Base score
        // Age factor
        const age = this.calculateAge(patient.dateOfBirth);
        if (age >= 65)
            score -= 10;
        else if (age >= 45)
            score -= 5;
        else if (age >= 25)
            score += 5;
        else
            score += 10;
        // Chronic conditions (mock)
        const chronicConditions = 1; // Hypertension
        score -= chronicConditions * 15;
        // Lifestyle factors (mock)
        score += 10; // Good lifestyle
        // Family history (mock)
        score -= 5; // Some family history
        return Math.min(100, Math.max(0, score));
    }
    /**
     * Calculate bonus points from provider evaluations
     */
    async calculateBonusPoints(patient) {
        const evaluations = patient.evaluations || [];
        const approvedEvaluations = evaluations.filter(e => e.status === 'APPROVED');
        return approvedEvaluations.reduce((total, evaluation) => {
            return total + evaluation.bonusPoints;
        }, 0);
    }
    /**
     * Get score category based on score value
     */
    getScoreCategory(score) {
        if (score >= 800)
            return 'EXCELLENT';
        if (score >= 650)
            return 'GOOD';
        if (score >= 500)
            return 'AVERAGE';
        return 'LOW';
    }
    /**
     * Get patient's credit score history
     */
    async getCreditScoreHistory(patientId, limit = 12) {
        return await prisma.creditScore.findMany({
            where: { patientId },
            orderBy: { calculatedAt: 'desc' },
            take: limit
        });
    }
    /**
     * Get current credit score for a patient
     */
    async getCurrentCreditScore(patientId) {
        return await prisma.creditScore.findFirst({
            where: { patientId },
            orderBy: { calculatedAt: 'desc' }
        });
    }
    /**
     * Get credit score distribution across all patients
     */
    async getCreditScoreDistribution() {
        const scores = await prisma.creditScore.groupBy({
            by: ['scoreCategory'],
            _count: {
                scoreCategory: true
            }
        });
        return scores.map(score => ({
            category: score.scoreCategory,
            count: score._count.scoreCategory
        }));
    }
    /**
     * Get score factors for a patient
     */
    async getScoreFactors(patientId) {
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
            include: {
                medicalActivities: true,
                evaluations: true
            }
        });
        if (!patient) {
            throw new Error('Patient not found');
        }
        return {
            paymentHistory: {
                onTimePayments: patient.medicalActivities.filter(a => a.activityType === 'CHECKUP' || a.activityType === 'APPOINTMENT').length,
                latePayments: 0,
                missedPayments: 0,
                consistency: 85
            },
            insurance: {
                hasValidInsurance: true,
                coverageAmount: 500000,
                insuranceType: 'Comprehensive',
                claimHistory: 0
            },
            income: {
                stability: 85,
                level: 70,
                employmentStatus: 'Full-time',
                creditHistory: 75
            },
            medicalRisk: {
                age: this.calculateAge(patient.dateOfBirth),
                chronicConditions: 1,
                lifestyleFactors: 80,
                familyHistory: 75
            }
        };
    }
    /**
     * Calculate age from date of birth
     */
    calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    /**
     * Calculate missed activities
     */
    calculateMissedActivities(activities) {
        // Mock calculation - in real implementation, this would check scheduled vs completed activities
        return Math.max(0, activities.length - 10);
    }
    /**
     * Update credit score based on new activity
     */
    async updateScoreFromActivity(activity) {
        const calculation = await this.calculateCreditScore(activity.patientId);
        // Send notification if score category changed
        await this.websocketService.broadcastActivityUpdate({
            patientId: activity.patientId,
            activityId: activity.id,
            newScore: calculation.finalScore,
            pointsEarned: activity.pointsEarned
        });
    }
    /**
     * Get score improvement suggestions
     */
    async getScoreImprovementSuggestions(patientId) {
        const currentScore = await this.getCurrentCreditScore(patientId);
        const factors = await this.getScoreFactors(patientId);
        const suggestions = [];
        if (factors.paymentHistory.onTimePayments < 12) {
            suggestions.push({
                category: 'Payment History',
                suggestion: 'Maintain consistent appointment attendance',
                potentialIncrease: 20,
                priority: 'HIGH'
            });
        }
        if (factors.insurance.coverageAmount < 500000) {
            suggestions.push({
                category: 'Insurance',
                suggestion: 'Increase insurance coverage',
                potentialIncrease: 15,
                priority: 'MEDIUM'
            });
        }
        if (factors.medicalRisk.age > 50) {
            suggestions.push({
                category: 'Medical Risk',
                suggestion: 'Regular health checkups and preventive care',
                potentialIncrease: 10,
                priority: 'MEDIUM'
            });
        }
        return suggestions.sort((a, b) => b.potentialIncrease - a.potentialIncrease);
    }
}
exports.CreditScoreService = CreditScoreService;
