"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestPhid = exports.updatePatientProfile = exports.getPatientProfile = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getPatientProfile = async (req, res) => {
    try {
        const id = req.params.id;
        // Ensure users can only fetch their own profile unless they are a provider
        if (req.user?.role === 'PATIENT' && req.user.id !== id) {
            res.status(403).json({ error: 'Unauthorized to view this profile' });
            return;
        }
        const patient = await prisma_1.default.patientProfile.findUnique({
            where: { userId: id },
            include: {
                financialProfile: true,
                creditScores: {
                    orderBy: { calculatedAt: 'desc' },
                    take: 5
                }
            }
        });
        if (!patient) {
            res.status(404).json({ error: 'Patient profile not found' });
            return;
        }
        res.json(patient);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching patient profile' });
    }
};
exports.getPatientProfile = getPatientProfile;
const updatePatientProfile = async (req, res) => {
    try {
        const id = req.params.id;
        if (req.user?.role !== 'PATIENT' || req.user.id !== id) {
            res.status(403).json({ error: 'Unauthorized to update this profile' });
            return;
        }
        const { firstName, lastName, age, bmi, bloodPressureSys, bloodPressureDia, cholesterol, smoking, exerciseHours, annualIncome, creditHistory } = req.body;
        const updatedProfile = await prisma_1.default.$transaction(async (tx) => {
            const patient = await tx.patientProfile.update({
                where: { userId: id },
                data: {
                    firstName, lastName, age, bmi, bloodPressureSys, bloodPressureDia, cholesterol, smoking, exerciseHours
                }
            });
            // Upsert financial profile
            const financial = await tx.financialProfile.upsert({
                where: { patientId: patient.id },
                update: { annualIncome, creditHistory },
                create: { patientId: patient.id, annualIncome: annualIncome || 0, creditHistory: creditHistory || 300 }
            });
            return { patient, financial };
        });
        res.json(updatedProfile);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating profile data' });
    }
};
exports.updatePatientProfile = updatePatientProfile;
const requestPhid = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        await prisma_1.default.patientProfile.update({
            where: { userId },
            data: { phidRequestStatus: 'REQUESTED' }
        });
        res.json({ message: 'PH-ID access code requested successfully' });
    }
    catch (error) {
        console.error('Error requesting PHID:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.requestPhid = requestPhid;
