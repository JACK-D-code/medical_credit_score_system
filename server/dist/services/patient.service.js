"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
class PatientService {
    /**
     * Generate unique patient ID
     */
    static async generatePatientId() {
        const prefix = 'PAT';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${timestamp}${random}`;
    }
    /**
     * Create a new patient
     */
    static async createPatient(data, createdBy) {
        const patientId = await this.generatePatientId();
        const patient = await prisma_1.default.patient.create({
            data: {
                patientId,
                ...data,
                createdBy,
            },
            include: {
                bills: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
                creditScores: {
                    orderBy: { calculatedAt: 'desc' },
                    take: 1,
                },
            },
        });
        // Log version history
        await this.logPatientHistory(patient.id, 'CREATE', null, patient, createdBy);
        return patient;
    }
    /**
     * Get patient by ID
     */
    static async getPatientById(id) {
        const patient = await prisma_1.default.patient.findUnique({
            where: { id },
            include: {
                bills: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                creditScores: {
                    orderBy: { calculatedAt: 'desc' },
                    take: 5,
                },
                emiPlans: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
                payments: {
                    orderBy: { paymentDate: 'desc' },
                    take: 10,
                },
            },
        });
        if (!patient) {
            throw new Error('Patient not found');
        }
        return patient;
    }
    /**
     * Update patient information
     */
    static async updatePatient(id, data, updatedBy) {
        // Get old patient data for version history
        const oldPatient = await prisma_1.default.patient.findUnique({
            where: { id },
        });
        if (!oldPatient) {
            throw new Error('Patient not found');
        }
        const updatedPatient = await prisma_1.default.patient.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
            include: {
                bills: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
                creditScores: {
                    orderBy: { calculatedAt: 'desc' },
                    take: 1,
                },
            },
        });
        // Log version history
        await this.logPatientHistory(id, 'UPDATE', oldPatient, updatedPatient, updatedBy);
        return updatedPatient;
    }
    /**
     * Get patients with pagination and filtering
     */
    static async getPatients(filters) {
        const { search, insuranceStatus, city, state, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', } = filters;
        // Build where clause
        const where = {};
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
                { patientId: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (insuranceStatus) {
            where.insuranceStatus = insuranceStatus;
        }
        if (city) {
            where.city = { contains: city, mode: 'insensitive' };
        }
        if (state) {
            where.state = { contains: state, mode: 'insensitive' };
        }
        // Get total count
        const total = await prisma_1.default.patient.count({ where });
        // Get patients with pagination
        const patients = await prisma_1.default.patient.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                creditScores: {
                    orderBy: { calculatedAt: 'desc' },
                    take: 1,
                },
                bills: {
                    where: { status: { in: ['pending', 'overdue', 'partial'] } },
                    select: {
                        id: true,
                        billNumber: true,
                        totalAmount: true,
                        outstandingAmount: true,
                        status: true,
                    },
                },
                emiPlans: {
                    where: { status: 'active' },
                    select: {
                        id: true,
                        planNumber: true,
                        outstandingBalance: true,
                        nextDueDate: true,
                    },
                },
            },
        });
        return {
            patients,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    /**
     * Log patient version history in audit logs
     */
    static async logPatientHistory(patientId, action, oldData, newData, userId) {
        await prisma_1.default.auditLog.create({
            data: {
                userId,
                action: action.toLowerCase(),
                resourceType: 'patient',
                resourceId: patientId,
                beforeData: oldData ? JSON.stringify(oldData) : null,
                afterData: JSON.stringify(newData),
            },
        });
    }
    /**
     * Get patient version history
     */
    static async getPatientHistory(patientId) {
        const history = await prisma_1.default.auditLog.findMany({
            where: {
                resourceType: 'patient',
                resourceId: patientId,
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                },
            },
        });
        return history;
    }
}
exports.PatientService = PatientService;
