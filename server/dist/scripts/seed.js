"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting seed process...');
    // Find or create a user "rajesh@example.com"
    const email = 'rajesh.sharma@email.com';
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        const passwordHash = await bcryptjs_1.default.hash('password123', 10);
        user = await prisma.user.create({
            data: {
                email,
                firstName: 'Rajesh',
                lastName: 'Sharma',
                passwordHash,
                role: 'PATIENT',
                patientProfile: {
                    create: {
                        firstName: 'Rajesh',
                        lastName: 'Sharma',
                        age: 45,
                        bmi: 24.5,
                        bloodPressureSys: 120,
                        bloodPressureDia: 80,
                        cholesterol: 180,
                        smoking: false,
                        exerciseHours: 3,
                        mobileNumber: '9876543210',
                        address: 'Flat 301, Sunrise Apartments',
                        city: 'Mumbai',
                        state: 'Maharashtra',
                        pincode: '400001',
                        aadhaarId: '2345 6789 0123',
                        dateOfBirth: new Date('1979-05-15'),
                        gender: 'Male',
                    }
                }
            }
        });
        console.log('Created base user and profile');
    }
    const profile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
    if (!profile)
        return;
    // Clear existing mocked data to prevent duplicates during multiple seeds
    await prisma.medicalCreditScore.deleteMany({ where: { patientId: profile.id } });
    await prisma.billingRecord.deleteMany({ where: { patientId: profile.id } });
    await prisma.timelineEvent.deleteMany({ where: { patientId: profile.id } });
    await prisma.notification.deleteMany({ where: { patientId: profile.id } });
    // Seed Scores (Trend over last 6 months)
    const baseDate = new Date();
    for (let i = 0; i < 6; i++) {
        const d = new Date(baseDate);
        d.setMonth(d.getMonth() - (5 - i));
        await prisma.medicalCreditScore.create({
            data: {
                patientId: profile.id,
                scoreValue: 650 + (i * 15) + Math.floor(Math.random() * 20 - 10),
                paymentHistoryScore: 320 + (i * 5),
                incomeStabilityScore: 330 + (i * 10),
                medicalDebtScore: 80,
                insuranceCoverageScore: 90,
                riskLevel: 'LOW',
                recommendation: 'standard_approval',
                factorBreakdown: JSON.stringify({ historical: true }),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                calculatedAt: d
            }
        });
    }
    // Seed FinancialProfile
    await prisma.financialProfile.upsert({
        where: { patientId: profile.id },
        update: {},
        create: {
            patientId: profile.id,
            annualIncome: 1200000,
            creditHistory: 8,
            existingMedicalDebt: 15000
        }
    });
    // Seed Billing Records
    await prisma.billingRecord.create({
        data: {
            patientId: profile.id,
            hospitalName: 'Apollo Hospitals',
            treatmentType: 'Cardiac Consultation',
            subtotal: 15000,
            billAmount: 15000,
            outstanding: 15000,
            patientResponsibility: 15000,
            status: 'pending',
            billDate: new Date(Date.now() - 5 * 86400000),
            dueDate: new Date(Date.now() + 10 * 86400000),
            creditImpact: -5,
            itemizedCharges: {
                create: [
                    { description: 'Consultation Fee', amount: 2000, unitPrice: 2000 },
                    { description: 'ECG & Stress Test', amount: 8000, unitPrice: 8000 },
                    { description: 'Medications', amount: 5000, unitPrice: 5000 }
                ]
            }
        }
    });
    await prisma.billingRecord.create({
        data: {
            patientId: profile.id,
            hospitalName: 'Fortis Healthcare',
            treatmentType: 'General Checkup',
            subtotal: 5000,
            billAmount: 5000,
            outstanding: 0,
            patientResponsibility: 5000,
            status: 'paid',
            billDate: new Date(Date.now() - 45 * 86400000),
            dueDate: new Date(Date.now() - 30 * 86400000),
            creditImpact: 15,
            itemizedCharges: {
                create: [
                    { description: 'Consultation', amount: 1500, unitPrice: 1500 },
                    { description: 'Blood Panel', amount: 3500, unitPrice: 3500 }
                ]
            },
            paymentHistory: {
                create: [
                    { amount: 5000, date: new Date(Date.now() - 32 * 86400000), paymentMethod: 'Card' }
                ]
            }
        }
    });
    // Seed Timeline Events
    await prisma.timelineEvent.createMany({
        data: [
            { patientId: profile.id, type: 'visit', title: 'Cardiology Checkup', description: 'Apollo Hospitals', date: new Date(Date.now() - 5 * 86400000), impact: 2 },
            { patientId: profile.id, type: 'payment', title: 'Bill Paid in Full', description: 'Fortis Healthcare', date: new Date(Date.now() - 32 * 86400000), impact: 15 },
        ]
    });
    // Seed Notifications
    await prisma.notification.createMany({
        data: [
            { patientId: profile.id, type: 'payment_due', title: 'Payment Reminder', message: 'Outstanding bill of ₹15,000 is due soon', read: false },
            { patientId: profile.id, type: 'eligibility', title: 'New Benefit Unlocked', message: 'You are now eligible for cashless treatment', read: false }
        ]
    });
    console.log('Seeding completed successfully!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
