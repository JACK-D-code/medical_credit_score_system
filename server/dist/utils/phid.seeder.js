"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMockEcosystemForPHID = void 0;
const prisma_1 = __importDefault(require("./prisma"));
// A utility to dynamically populate a brand new PH-ID account with varied medical metrics and history
const generateMockEcosystemForPHID = async (patientId, healthId) => {
    try {
        console.log(`[Seeder] Generating rich ecosystem data for new PH-ID: ${healthId}`);
        // 1. Generate a varied Financial Profile
        const annualIncome = Math.floor(Math.random() * 1500000) + 300000; // 3L to 18L
        const creditHistory = Math.floor(Math.random() * 300) + 500; // 500 to 800
        const medicalDebt = Math.floor(Math.random() * 100000); // 0 to 1L
        await prisma_1.default.financialProfile.update({
            where: { patientId },
            data: {
                annualIncome,
                creditHistory,
                existingMedicalDebt: medicalDebt,
                employmentStatus: Math.random() > 0.5 ? 'Employed' : 'Self-Employed',
                employer: 'MockCorp Solutions'
            }
        });
        // 2. Generate a base Medical Credit Score so the dashboard isn't blank
        const baseScore = Math.floor(Math.random() * 400) + 350; // Initial score between 350 to 750
        const paymentHistory = Math.floor(Math.random() * 80) + 20;
        const treatmentAdherence = Math.floor(Math.random() * 80) + 20;
        await prisma_1.default.dynamicCreditScore.create({
            data: {
                patientId,
                totalScore: baseScore,
                activityPoints: Math.floor(baseScore * 0.7),
                bonusPoints: Math.floor(baseScore * 0.3),
                penaltyPoints: 0,
                category: baseScore >= 700 ? 'EXCELLENT' : (baseScore >= 550 ? 'GOOD' : 'FAIR'),
                calculatedAt: new Date(),
                expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Expires in 1 month
                scoreBreakdown: {
                    paymentHistoryScore: paymentHistory,
                    treatmentAdherenceScore: treatmentAdherence,
                    preventiveCareScore: 50,
                    insuranceStabilityScore: 60,
                    healthMetricsScore: 40
                }
            }
        });
        // 3. Generate randomized past/pending claims indicating active use of the PHID
        const numClaims = Math.floor(Math.random() * 3) + 1; // 1 to 3 claims
        const claimTypes = ['HOSPITAL_VISIT', 'PAST_PAYMENT', 'HEALTH_ACTIVITY'];
        for (let i = 0; i < numClaims; i++) {
            const isApproved = Math.random() > 0.6; // 40% chance to be approved already
            await prisma_1.default.creditClaimRequest.create({
                data: {
                    patientId,
                    claimType: claimTypes[Math.floor(Math.random() * claimTypes.length)],
                    description: `Historical auto-seeded claim for ${healthId} (Mock entry ${i + 1})`,
                    documentUrl: 'mock_historical_doc.pdf',
                    status: isApproved ? 'approved' : 'pending',
                    pointsAwarded: isApproved ? Math.floor(Math.random() * 30) + 10 : undefined,
                    adminNotes: isApproved ? 'Automatically approved during account initialization.' : undefined
                }
            });
        }
        // 4. Randomly generate 0-2 pending Offer/Loan Applications
        const numOffers = Math.floor(Math.random() * 3); // 0 to 2 offers
        const offerTypes = ['EMI', 'LOAN', 'DISCOUNT'];
        for (let i = 0; i < numOffers; i++) {
            const offerType = offerTypes[Math.floor(Math.random() * offerTypes.length)];
            await prisma_1.default.offerApplication.create({
                data: {
                    patientId,
                    offerType,
                    amount: offerType !== 'DISCOUNT' ? Math.floor(Math.random() * 50000) + 10000 : undefined,
                    description: `Pre-existing ${offerType} application mapped to ${healthId}`,
                    status: 'pending'
                }
            });
        }
        // 5. Generate Billing Records
        const numBills = Math.floor(Math.random() * 3) + 2; // 2 to 4 bills
        const treatmentTypes = ['General Checkup', 'Blood Test', 'MRI Scan', 'Dental Cleaning', 'Emergency Room Visit'];
        const hospitals = ['City General Hospital', 'Apollo Care', 'Fortis Medical Center', 'Max Healthcare', 'Care Hospitals'];
        for (let i = 0; i < numBills; i++) {
            const status = Math.random() > 0.4 ? 'paid' : 'pending';
            const billAmount = Math.floor(Math.random() * 15000) + 1000;
            const billDate = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000);
            const dueDate = new Date(billDate.getTime() + 30 * 24 * 60 * 60 * 1000);
            await prisma_1.default.billingRecord.create({
                data: {
                    patientId,
                    hospitalName: hospitals[Math.floor(Math.random() * hospitals.length)],
                    treatmentType: treatmentTypes[Math.floor(Math.random() * treatmentTypes.length)],
                    subtotal: billAmount * 0.9,
                    taxAmount: billAmount * 0.1,
                    billAmount: billAmount,
                    patientResponsibility: billAmount,
                    outstanding: status === 'paid' ? 0 : billAmount,
                    paidAmount: status === 'paid' ? billAmount : 0,
                    status: status,
                    billDate: billDate,
                    dueDate: dueDate,
                    insuranceClaimed: false
                }
            });
        }
        // 6. Generate Patient Documents & Insurance Verification
        const docTypes = ['Insurance Policy', 'Lab Report', 'Prescription', 'Medical Imaging'];
        await prisma_1.default.patientDocument.create({
            data: {
                patientId,
                type: docTypes[0], // Force an insurance doc
                name: 'Allianz Comprehensive Health Coverage',
                status: 'verified',
                uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000)
            }
        });
        await prisma_1.default.insuranceVerification.create({
            data: {
                patientId,
                policyNumber: 'POL' + Math.floor(Math.random() * 100000000),
                provider: 'Allianz Insurance Group',
                coverageType: 'Comprehensive Family',
                coverageLimit: Math.floor(Math.random() * 1000000) + 500000,
                deductible: 5000,
                copay: 500,
                isActive: true
            }
        });
        // 7. Generate User Activities and Timeline Events
        await prisma_1.default.timelineEvent.create({
            data: {
                patientId,
                type: 'visit',
                title: 'Routine Health Checkup',
                description: 'Completed annual health evaluation at City General Hospital.',
                impact: 15,
                date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
        });
        await prisma_1.default.userActivity.create({
            data: {
                patientId,
                type: 'profile_creation',
                title: 'Patient Account Initialized',
                description: `PH-ID ${healthId} was successfully generated and seeded.`,
                device: 'System',
                location: 'System'
            }
        });
        // 8. Generate Unread Notifications
        await prisma_1.default.notification.create({
            data: {
                patientId,
                type: 'SYSTEM_ALERT',
                title: 'Welcome to your FinTech Health Dashboard',
                message: `Your dynamic Patient Health ID (${healthId}) is ready. Explore your pre-approved limits.`,
                read: false
            }
        });
        console.log(`[Seeder] Successfully seeded data for ${healthId}`);
    }
    catch (error) {
        console.error(`[Seeder] Error populating ecosystem for ${healthId}:`, error);
        // We don't throw here to avoid failing the auth flow if seeding merely fails
    }
};
exports.generateMockEcosystemForPHID = generateMockEcosystemForPHID;
