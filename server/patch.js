const fs = require('fs');
const filepath = 'C:/Users/acer/Desktop/Project/server/src/controllers/provider.controller.ts';

let code = fs.readFileSync(filepath, 'utf8');

const newFunction = `export const issueBill = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'PROVIDER' && req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }
        const { patientUserId, treatmentType, billAmount, hospitalName } = req.body;

        const patient = await prisma.patientProfile.findUnique({ where: { userId: patientUserId } });
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }

        const newBill = await prisma.$transaction(async (tx: any) => {
            const latestScore = await tx.medicalCreditScore.findFirst({
                where: { patientId: patient.id },
                orderBy: { calculatedAt: 'desc' }
            });

            const scoreValue = latestScore ? latestScore.scoreValue : 0;
            let discountPercent = 0;
            let discountReason = '';

            if (scoreValue >= 800) {
                discountPercent = 100;
                discountReason = "100% Sponsored (Excellent Medical Credit Score)";
            } else if (scoreValue >= 650) {
                discountPercent = 50;
                discountReason = "50% Discount (Good Medical Credit Score)";
            } else if (scoreValue >= 500) {
                discountReason = "0% EMI Eligible (Fair Medical Credit Score)";
            }

            const discountAmount = Math.floor((billAmount * discountPercent) / 100);
            const finalAmount = billAmount - discountAmount;
            const displayTreatmentType = discountReason ? \`\${treatmentType} - \${discountReason}\` : treatmentType;

            const bill = await tx.billingRecord.create({
                data: {
                    patientId: patient.id,
                    hospitalName,
                    treatmentType: displayTreatmentType,
                    billAmount: finalAmount,
                    outstanding: finalAmount,
                    status: finalAmount === 0 ? 'paid' : 'pending',
                    billDate: new Date(),
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                    creditImpact: finalAmount === 0 ? 0 : -Math.floor(finalAmount / 1000)
                }
            });

            await tx.timelineEvent.create({
                data: {
                    patientId: patient.id,
                    type: 'bill',
                    title: discountPercent > 0 ? 'Philanthropic Support Applied!' : 'New Hospital Bill Issued',
                    description: \`\${hospitalName} - \${displayTreatmentType} (Cost: ₹\${finalAmount.toLocaleString()})\`,
                    impact: finalAmount === 0 ? 10 : -Math.floor(finalAmount / 1000)
                }
            });

            if (latestScore && finalAmount > 0) {
                const penalty = Math.min(60, Math.floor(finalAmount / 1000));
                await tx.medicalCreditScore.create({
                    data: {
                        patientId: patient.id,
                        scoreValue: Math.max(300, latestScore.scoreValue - penalty),
                        paymentHistoryScore: latestScore.paymentHistoryScore,
                        incomeStabilityScore: latestScore.incomeStabilityScore,
                        medicalDebtScore: latestScore.medicalDebtScore,
                        insuranceCoverageScore: latestScore.insuranceCoverageScore,
                        riskLevel: (latestScore.scoreValue - penalty) < 600 ? 'HIGH_RISK' : 'FAIR',
                        recommendation: latestScore.recommendation,
                        factorBreakdown: latestScore.factorBreakdown,
                        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    }
                });
            }

            return bill;
        });

        res.json({ message: 'Bill issued successfully', bill: newBill });
    } catch (error) {
        res.status(500).json({ error: 'Error issuing bill' });
    }
};`;

const regex = /export const issueBill = async \(req: AuthRequest, res: Response\): Promise<void> => \{[\s\S]*?(?=\nexport const getPatientByIdForAdmin)/m;

let newCode = code.replace(regex, newFunction);
fs.writeFileSync(filepath, newCode, 'utf8');
console.log('Patch applied successfully.');
