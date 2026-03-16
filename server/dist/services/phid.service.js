"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHIDService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
class PHIDService {
    static instance;
    prisma;
    constructor() {
        this.prisma = prisma_1.default;
    }
    static getInstance() {
        if (!PHIDService.instance) {
            PHIDService.instance = new PHIDService();
        }
        return PHIDService.instance;
    }
    // Create new PHID for patient
    async createPHID(patientData) {
        const phid = this.generatePHID();
        // Store PHID mapping with patient data
        await prisma_1.default.pHIDMapping.create({
            data: {
                phid,
                patientId: patientData.id,
                isActive: true,
                issuedBy: patientData.issuedBy || 'SYSTEM',
                issuedAt: new Date(),
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
                metadata: {
                    firstName: patientData.firstName,
                    lastName: patientData.lastName,
                    dateOfBirth: patientData.dateOfBirth,
                    bloodGroup: patientData.bloodGroup,
                    phone: patientData.phone,
                    address: patientData.address,
                    emergencyContact: patientData.emergencyContact
                }
            }
        });
        return phid;
    }
    // Get patient data by PHID
    async getPatientByPHID(phid) {
        const mapping = await prisma_1.default.pHIDMapping.findUnique({
            where: { phid, isActive: true },
            include: {
                patient: {
                    include: {
                        creditScores: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        },
                        medicalActivities: {
                            orderBy: { createdAt: 'desc' },
                            take: 10
                        },
                        healthTasks: {
                            where: { status: 'PENDING' },
                            take: 5
                        },
                        appointments: {
                            where: {
                                scheduledFor: {
                                    gte: new Date()
                                }
                            },
                            orderBy: { scheduledFor: 'asc' },
                            take: 5
                        },
                        billingRecords: {
                            where: { status: 'PENDING' },
                            orderBy: { billDate: 'desc' },
                            take: 3
                        },
                        emiPlans: {
                            where: { status: 'ACTIVE' },
                            take: 3
                        }
                    }
                }
            }
        });
        if (!mapping) {
            throw new Error('Invalid or inactive PHID');
        }
        // Check if PHID is expired
        if (mapping.expiresAt && new Date() > mapping.expiresAt) {
            throw new Error('PHID has expired');
        }
        return this.formatPatientData(mapping.patient, mapping);
    }
    // Generate unique PHID
    generatePHID() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `PHID-${timestamp}-${random}`.toUpperCase();
    }
    // Format patient data for frontend
    formatPatientData(patient, mapping) {
        const currentScore = patient.creditScores[0] || { score: 650 };
        const totalPoints = patient.medicalActivities.reduce((sum, activity) => sum + activity.points, 0);
        const completedTasks = patient.healthTasks.filter((task) => task.status === 'COMPLETED').length;
        return {
            // Basic Info
            id: patient.id,
            phid: mapping.phid,
            name: `${patient.firstName} ${patient.lastName}`,
            age: this.calculateAge(patient.dateOfBirth),
            bloodGroup: patient.bloodGroup,
            phone: patient.phone,
            address: patient.address,
            emergencyContact: patient.emergencyContact,
            // Credit & Scores
            creditScore: currentScore.score,
            loyaltyLevel: this.getLoyaltyLevel(currentScore.score),
            trustScore: Math.min(100, 80 + completedTasks * 2),
            adherenceScore: Math.min(100, (completedTasks / Math.max(1, patient.healthTasks.length)) * 100),
            totalPoints: totalPoints,
            // Activity Data
            todayActivities: patient.medicalActivities.filter((activity) => new Date(activity.createdAt).toDateString() === new Date().toDateString()),
            recentActivities: patient.medicalActivities.slice(0, 5),
            // Health Tasks
            healthTasks: patient.healthTasks,
            pendingTasks: patient.healthTasks.filter((task) => task.status === 'PENDING'),
            // Appointments
            appointments: patient.appointments,
            todayAppointments: patient.appointments.filter((apt) => new Date(apt.scheduledFor).toDateString() === new Date().toDateString()).length,
            // Billing & EMI
            pendingBills: patient.billingRecords.length,
            activeEMI: patient.emiPlans.length,
            emiPlans: patient.emiPlans,
            // PHID Info
            phidInfo: {
                issuedAt: mapping.issuedAt,
                expiresAt: mapping.expiresAt,
                issuedBy: mapping.issuedBy,
                isActive: mapping.isActive
            }
        };
    }
    // Calculate age from date of birth
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
    // Get loyalty level based on credit score
    getLoyaltyLevel(score) {
        if (score >= 800)
            return 'Platinum';
        if (score >= 750)
            return 'Gold';
        if (score >= 650)
            return 'Silver';
        return 'Bronze';
    }
    // Update PHID status
    async updatePHIDStatus(phid, isActive) {
        await prisma_1.default.pHIDMapping.update({
            where: { phid },
            data: {
                isActive,
                updatedAt: new Date()
            }
        });
    }
    // Get all PHIDs for admin
    async getAllPHIDs() {
        return await prisma_1.default.pHIDMapping.findMany({
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        dateOfBirth: true,
                        bloodGroup: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    // Deactivate PHID
    async deactivatePHID(phid) {
        await prisma_1.default.pHIDMapping.update({
            where: { phid },
            data: {
                isActive: false,
                updatedAt: new Date()
            }
        });
    }
}
exports.PHIDService = PHIDService;
exports.default = PHIDService.getInstance();
