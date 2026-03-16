"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncProvider = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const score_controller_1 = require("./score.controller");
const syncProvider = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { provider } = req.body;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const patient = await prisma_1.default.patientProfile.findUnique({
            where: { userId },
            include: { timelineEvents: true, billingRecords: true }
        });
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        // Check if already synced
        const hasSynced = patient.timelineEvents.some((e) => e.type === 'metadata' && e.title === `Synced ${provider}`);
        if (hasSynced) {
            res.status(400).json({ error: `You have already synced data from ${provider}.` });
            return;
        }
        // Generate historic data
        const hospitals = ['Apollo Hospital', 'Fortis Healthcare', 'Max Super Speciality', 'Local Poly Clinic'];
        const treatments = ['General Checkup', 'Blood Test', 'Dental Scaling', 'Orthopedic Consult', 'MRI Scan', 'Cardiology Consult'];
        await prisma_1.default.$transaction(async (tx) => {
            // Generate 8-15 random visits/bills over the last 24 months
            const numRecords = Math.floor(Math.random() * 8) + 8;
            const now = new Date();
            for (let i = 0; i < numRecords; i++) {
                // Random date in last 24 months
                const dateOffset = Math.floor(Math.random() * 730);
                const recordDate = new Date(now.getTime() - dateOffset * 24 * 60 * 60 * 1000);
                const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
                const treatment = treatments[Math.floor(Math.random() * treatments.length)];
                const amount = Math.floor(Math.random() * 50000) + 1500;
                // 85% chance fully paid
                const isPaid = Math.random() < 0.85;
                const status = isPaid ? 'paid' : 'pending';
                const outstanding = isPaid ? 0 : amount;
                // Create billing record
                const bill = await tx.billingRecord.create({
                    data: {
                        patientId: patient.id,
                        hospitalName: hospital,
                        treatmentType: treatment,
                        billAmount: amount,
                        outstanding: outstanding,
                        status: status,
                        billDate: recordDate,
                        dueDate: new Date(recordDate.getTime() + 30 * 24 * 60 * 60 * 1000),
                        creditImpact: isPaid ? 10 : -5
                    }
                });
                if (isPaid) {
                    await tx.paymentHistory.create({
                        data: {
                            billingRecordId: bill.id,
                            amount: amount,
                            paymentDate: new Date(recordDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000), // Paid within 10 days
                            paymentMethod: 'system'
                        }
                    });
                }
                // Create timeline visit
                await tx.timelineEvent.create({
                    data: {
                        patientId: patient.id,
                        type: 'visit',
                        title: `${treatment} at ${hospital}`,
                        description: `Imported via ${provider}`,
                        impact: 5,
                        date: recordDate
                    }
                });
            }
            // Also add some 'tasks' mapped over
            await tx.timelineEvent.create({
                data: {
                    patientId: patient.id,
                    type: 'task',
                    title: `Health Profile Imported`,
                    description: `Historical data synchronized from ${provider}.`,
                    impact: 20,
                    date: now
                }
            });
            // Mark as synced
            await tx.timelineEvent.create({
                data: {
                    patientId: patient.id,
                    type: 'metadata',
                    title: `Synced ${provider}`,
                    description: 'System record of sync.',
                    impact: 0,
                    date: now
                }
            });
            // Add a milestone for insurance if they imported from an insurance provider
            if (provider.toLowerCase().includes('insurance') || provider.toLowerCase().includes('abha')) {
                await tx.timelineEvent.create({
                    data: {
                        patientId: patient.id,
                        type: 'milestone',
                        title: 'Health Insurance Identified',
                        description: `Active coverage verified via ${provider}.`,
                        impact: 50,
                        date: now
                    }
                });
            }
        });
        // Recalculate score massive jump
        await (0, score_controller_1.calculateScoreLogic)(userId);
        res.json({ message: `Successfully synchronized data from ${provider}. Your Medical Credit Score has been updated.` });
    }
    catch (err) {
        console.error('Provider sync error:', err);
        res.status(500).json({ error: 'Data synchronization failed.' });
    }
};
exports.syncProvider = syncProvider;
