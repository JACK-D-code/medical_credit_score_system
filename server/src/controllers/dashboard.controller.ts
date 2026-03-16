import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const getDashboardMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const patientProfile = await prisma.patientProfile.findUnique({
            where: { userId },
            include: {
                creditScores: {
                    orderBy: { calculatedAt: 'desc' },
                    take: 7
                },
                billingRecords: {
                    where: { status: { in: ['pending', 'overdue'] } },
                    orderBy: { dueDate: 'asc' }
                },
                timelineEvents: {
                    orderBy: { date: 'desc' },
                    take: 5
                },
                notifications: {
                    where: { read: false },
                    orderBy: { createdAt: 'desc' },
                    take: 3
                },
                financialProfile: true
            }
        });

        if (!patientProfile) {
            res.status(404).json({ error: 'Patient profile not found' });
            return;
        }

        // Calculate aggregate metrics
        const totalMedicalBills = await prisma.billingRecord.aggregate({
            where: { patientId: patientProfile.id },
            _sum: { billAmount: true }
        });

        const outstandingDues = await prisma.billingRecord.aggregate({
            where: { patientId: patientProfile.id, status: { in: ['pending', 'overdue'] } },
            _sum: { outstanding: true }
        });

        const totalVisitsCount = await prisma.timelineEvent.count({
            where: { patientId: patientProfile.id, type: 'visit' }
        });

        const currentScore = patientProfile.creditScores.length > 0
            ? patientProfile.creditScores[0]
            : { scoreValue: 0, healthComponentScore: 0, financialComponentScore: 0 };

        const scoreHistory = patientProfile.creditScores.map(score => ({
            date: score.calculatedAt.toISOString().split('T')[0],
            score: score.scoreValue
        })).reverse(); // Oldest to newest for chart

        res.json({
            currentScore: {
                score: currentScore.scoreValue,
                trend: 'up', // Simplified for prototype, would normally compare against previous
                change: 15
            },
            scoreHistory: scoreHistory.length > 0 ? scoreHistory : [{ date: new Date().toISOString().split('T')[0], score: 0 }],
            metrics: {
                totalMedicalBills: totalMedicalBills._sum.billAmount || 0,
                outstandingDues: outstandingDues._sum.outstanding || 0,
                paymentHistoryPercent: 92, // Placeholder, would require deeper calculation
                hospitalVisits: totalVisitsCount
            },
            recentActivity: patientProfile.timelineEvents.map((event: any) => ({
                id: event.id,
                type: event.type,
                title: event.title,
                date: event.date,
                amount: event.impact
            })),
            alerts: patientProfile.notifications.map((n: any) => ({
                ...n,
                timestamp: n.createdAt // Frontend expects 'timestamp'
            })),
            eligibility: {
                medicalLoan: currentScore.scoreValue >= 650,
                cashlessTreatment: currentScore.scoreValue >= 700,
                discountEligible: currentScore.scoreValue >= 750,
                discountPercentage: currentScore.scoreValue >= 750 ? 15 : 0,
                loanAmount: (patientProfile.financialProfile?.annualIncome || 500000) * 0.5
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        res.status(500).json({ error: 'Internal server error fetching dashboard' });
    }
};
