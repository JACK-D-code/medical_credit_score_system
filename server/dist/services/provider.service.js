"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderService = void 0;
const client_1 = require("@prisma/client");
const websocket_service_1 = require("./websocket.service");
const prisma = new client_1.PrismaClient();
class ProviderService {
    websocketService;
    constructor() {
        this.websocketService = new websocket_service_1.WebSocketService();
    }
    /**
     * Get provider dashboard statistics
     */
    async getProviderStats(providerId) {
        try {
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            // Get total patients
            const totalPatients = await prisma.patient.count({
                where: {
                // In a real implementation, this would filter by provider
                // For now, we'll get all patients
                }
            });
            // Get today's appointments
            const todayAppointments = await prisma.appointment.count({
                where: {
                    scheduledFor: {
                        gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                        lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
                    }
                }
            });
            // Get evaluations
            const pendingEvaluations = await prisma.providerEvaluation.count({
                where: {
                    providerId,
                    status: 'PENDING'
                }
            });
            const completedEvaluations = await prisma.providerEvaluation.count({
                where: {
                    providerId,
                    status: 'APPROVED'
                }
            });
            // Get average credit score of provider's patients
            const patientCreditScores = await prisma.creditScore.groupBy({
                by: ['patientId'],
                _avg: {
                    score: true
                }
            });
            const averageCreditScore = patientCreditScores.length > 0
                ? Math.round(patientCreditScores.reduce((sum, item) => sum + item._avg.score, 0) / patientCreditScores.length)
                : 0;
            // Get total bonus points awarded
            const totalBonusPoints = await prisma.providerEvaluation.aggregate({
                where: {
                    providerId,
                    status: 'APPROVED'
                },
                _sum: {
                    bonusPoints: true
                }
            });
            // Get monthly revenue (mock calculation)
            const monthlyRevenue = todayAppointments * 2500; // Average appointment cost
            // Get active EMI plans
            const activeEMIPlans = await prisma.eMIPlan.count({
                where: {
                    status: 'ACTIVE'
                }
            });
            return {
                totalPatients,
                todayAppointments,
                pendingEvaluations,
                completedEvaluations,
                averageCreditScore,
                totalBonusPoints: totalBonusPoints._sum.bonusPoints || 0,
                monthlyRevenue,
                activeEMIPlans
            };
        }
        catch (error) {
            console.error('Error fetching provider stats:', error);
            throw error;
        }
    }
    /**
     * Get provider profile
     */
    async getProviderProfile(providerId) {
        try {
            const provider = await prisma.user.findUnique({
                where: { id: providerId },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isActive: true,
                    lastLogin: true,
                    createdAt: true
                }
            });
            if (!provider) {
                throw new Error('Provider not found');
            }
            return provider;
        }
        catch (error) {
            console.error('Error fetching provider profile:', error);
            throw error;
        }
    }
    /**
     * Update provider profile
     */
    async updateProviderProfile(providerId, profileData) {
        try {
            const updatedProvider = await prisma.user.update({
                where: { id: providerId },
                data: {
                    email: profileData.email,
                    lastLogin: new Date()
                }
            });
            // Send notification
            await this.websocketService.sendNotification(providerId, {
                title: 'Profile Updated',
                message: 'Your profile has been successfully updated.',
                type: 'SYSTEM_ANNOUNCEMENT'
            });
            return updatedProvider;
        }
        catch (error) {
            console.error('Error updating provider profile:', error);
            throw error;
        }
    }
    /**
     * Get patients with filters
     */
    async getPatients(providerId, filters) {
        try {
            const where = {};
            // Search filter
            if (filters.search) {
                where.OR = [
                    {
                        patient: {
                            firstName: { contains: filters.search, mode: 'insensitive' }
                        }
                    },
                    {
                        patient: {
                            lastName: { contains: filters.search, mode: 'insensitive' }
                        }
                    }
                ];
            }
            // Loyalty level filter
            if (filters.loyaltyLevel) {
                // This would be calculated based on credit score
                // For now, we'll implement a basic filter
                where.patient = {
                    ...where.patient,
                    creditScores: {
                        some: {
                            scoreCategory: filters.loyaltyLevel.toUpperCase()
                        }
                    }
                };
            }
            // Pagination
            const skip = ((filters.page || 1) - 1) * (filters.limit || 20);
            const [patients, total] = await Promise.all([
                prisma.patient.findMany({
                    where,
                    include: {
                        creditScores: {
                            orderBy: { calculatedAt: 'desc' },
                            take: 1
                        },
                        _count: {
                            select: {
                                appointments: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: filters.limit || 20
                }),
                prisma.patient.count({ where })
            ]);
            const totalPages = Math.ceil(total / (filters.limit || 20));
            return {
                patients,
                total,
                page: filters.page || 1,
                totalPages
            };
        }
        catch (error) {
            console.error('Error fetching patients:', error);
            throw error;
        }
    }
    /**
     * Get patient by ID
     */
    async getPatientById(patientId) {
        try {
            const patient = await prisma.patient.findUnique({
                where: { id: patientId },
                include: {
                    user: {
                        select: {
                            email: true
                        }
                    },
                    creditScores: {
                        orderBy: { calculatedAt: 'desc' },
                        take: 1
                    },
                    medicalActivities: {
                        orderBy: { completedAt: 'desc' },
                        take: 10
                    },
                    evaluations: {
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    },
                    appointments: {
                        orderBy: { scheduledFor: 'desc' },
                        take: 5
                    },
                    _count: {
                        select: {
                            appointments: true
                        }
                    }
                }
            });
            if (!patient) {
                throw new Error('Patient not found');
            }
            return patient;
        }
        catch (error) {
            console.error('Error fetching patient:', error);
            throw error;
        }
    }
    /**
     * Add new patient
     */
    async addPatient(patientData) {
        try {
            const patient = await prisma.patient.create({
                data: {
                    firstName: patientData.firstName,
                    lastName: patientData.lastName,
                    dateOfBirth: patientData.dateOfBirth,
                    phone: patientData.phone,
                    address: patientData.address,
                    bloodGroup: patientData.bloodGroup,
                    emergencyContact: patientData.emergencyContact
                }
            });
            // Send notification
            await this.websocketService.sendNotification(patientData.providerId, {
                title: 'New Patient Added',
                message: `${patient.firstName} ${patient.lastName} has been added to your patient list.`,
                type: 'SYSTEM_ANNOUNCEMENT'
            });
            return patient;
        }
        catch (error) {
            console.error('Error adding patient:', error);
            throw error;
        }
    }
    /**
     * Update patient
     */
    async updatePatient(patientId, updateData) {
        try {
            const updatedPatient = await prisma.patient.update({
                where: { id: patientId },
                data: {
                    firstName: updateData.firstName,
                    lastName: updateData.lastName,
                    phone: updateData.phone,
                    address: updateData.address,
                    bloodGroup: updateData.bloodGroup,
                    emergencyContact: updateData.emergencyContact
                }
            });
            return updatedPatient;
        }
        catch (error) {
            console.error('Error updating patient:', error);
            throw error;
        }
    }
    /**
     * Get today's appointments
     */
    async getTodayAppointments(providerId) {
        try {
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
            const appointments = await prisma.appointment.findMany({
                where: {
                    scheduledFor: {
                        gte: startOfDay,
                        lt: endOfDay
                    }
                },
                include: {
                    patient: {
                        select: {
                            firstName: true,
                            lastName: true,
                            creditScores: {
                                orderBy: { calculatedAt: 'desc' },
                                take: 1
                            }
                        }
                    }
                },
                orderBy: { scheduledFor: 'asc' }
            });
            return appointments.map(apt => ({
                ...apt,
                patientName: `${apt.patient.firstName} ${apt.patient.lastName}`,
                creditScore: apt.patient.creditScores[0]?.score || 0
            }));
        }
        catch (error) {
            console.error('Error fetching today appointments:', error);
            throw error;
        }
    }
    /**
     * Get upcoming appointments
     */
    async getUpcomingAppointments(providerId, days = 7) {
        try {
            const today = new Date();
            const endDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
            const appointments = await prisma.appointment.findMany({
                where: {
                    scheduledFor: {
                        gte: today,
                        lte: endDate
                    }
                },
                include: {
                    patient: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                },
                orderBy: { scheduledFor: 'asc' }
            });
            return appointments.map(apt => ({
                ...apt,
                patientName: `${apt.patient.firstName} ${apt.patient.lastName}`
            }));
        }
        catch (error) {
            console.error('Error fetching upcoming appointments:', error);
            throw error;
        }
    }
    /**
     * Submit evaluation
     */
    async submitEvaluation(evaluationData) {
        try {
            const evaluation = await prisma.providerEvaluation.create({
                data: {
                    patientId: evaluationData.patientId,
                    providerId: evaluationData.providerId,
                    evaluationType: evaluationData.evaluationType,
                    bonusPoints: evaluationData.bonusPoints,
                    reason: evaluationData.reason,
                    comments: evaluationData.comments,
                    status: 'PENDING'
                }
            });
            // Send notification to patient
            await this.websocketService.sendNotification(evaluationData.patientId, {
                title: 'Evaluation Submitted',
                message: `Your provider has submitted an evaluation for ${evaluationData.bonusPoints} bonus points.`,
                type: 'EVALUATION_UPDATE'
            });
            // Send notification to admin
            await this.websocketService.broadcastSystemAnnouncement(`New evaluation submitted by provider for ${evaluationData.bonusPoints} bonus points.`, 'ADMIN');
            return evaluation;
        }
        catch (error) {
            console.error('Error submitting evaluation:', error);
            throw error;
        }
    }
    /**
     * Get evaluations
     */
    async getEvaluations(providerId, filters) {
        try {
            const where = {
                providerId
            };
            if (filters.patientId) {
                where.patientId = filters.patientId;
            }
            if (filters.status) {
                where.status = filters.status;
            }
            const skip = ((filters.page || 1) - 1) * (filters.limit || 20);
            const [evaluations, total] = await Promise.all([
                prisma.providerEvaluation.findMany({
                    where,
                    include: {
                        patient: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: filters.limit || 20
                }),
                prisma.providerEvaluation.count({ where })
            ]);
            const totalPages = Math.ceil(total / (filters.limit || 20));
            return {
                evaluations,
                total,
                page: filters.page || 1,
                totalPages
            };
        }
        catch (error) {
            console.error('Error fetching evaluations:', error);
            throw error;
        }
    }
    /**
     * Get evaluation by ID
     */
    async getEvaluationById(evaluationId) {
        try {
            const evaluation = await prisma.providerEvaluation.findUnique({
                where: { id: evaluationId },
                include: {
                    patient: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });
            if (!evaluation) {
                throw new Error('Evaluation not found');
            }
            return evaluation;
        }
        catch (error) {
            console.error('Error fetching evaluation:', error);
            throw error;
        }
    }
    /**
     * Get revenue analytics
     */
    async getRevenueAnalytics(providerId, period = 'monthly') {
        try {
            const today = new Date();
            let startDate;
            switch (period) {
                case 'daily':
                    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    break;
                case 'weekly':
                    startDate = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
                    break;
                case 'monthly':
                    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                    break;
                case 'yearly':
                    startDate = new Date(today.getFullYear(), 0, 1);
                    break;
                default:
                    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            }
            // Mock revenue data - in real implementation, this would come from billing data
            const revenueData = [
                { date: startDate, revenue: 45000, patients: 18 },
                { date: new Date(startDate.getTime() + 24 * 60 * 60 * 1000), revenue: 48000, patients: 20 },
                { date: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), revenue: 52000, patients: 22 }
            ];
            return {
                period,
                startDate,
                endDate: today,
                totalRevenue: revenueData.reduce((sum, item) => sum + item.revenue, 0),
                totalPatients: revenueData.reduce((sum, item) => sum + item.patients, 0),
                averageRevenuePerDay: revenueData.reduce((sum, item) => sum + item.revenue, 0) / revenueData.length,
                data: revenueData
            };
        }
        catch (error) {
            console.error('Error fetching revenue analytics:', error);
            throw error;
        }
    }
    /**
     * Generate patient report
     */
    async generatePatientReport(providerId, filters) {
        try {
            // In a real implementation, this would generate a PDF report
            // For now, we'll return a mock buffer
            const reportData = {
                title: 'Patient Report',
                generatedAt: new Date(),
                providerId,
                filters,
                patients: [] // Would fetch actual patient data
            };
            // Mock PDF buffer
            const pdfContent = JSON.stringify(reportData, null, 2);
            return Buffer.from(pdfContent);
        }
        catch (error) {
            console.error('Error generating patient report:', error);
            throw error;
        }
    }
    /**
     * Generate evaluation report
     */
    async generateEvaluationReport(providerId, filters) {
        try {
            // In a real implementation, this would generate a PDF report
            const reportData = {
                title: 'Evaluation Report',
                generatedAt: new Date(),
                providerId,
                filters,
                evaluations: [] // Would fetch actual evaluation data
            };
            // Mock PDF buffer
            const pdfContent = JSON.stringify(reportData, null, 2);
            return Buffer.from(pdfContent);
        }
        catch (error) {
            console.error('Error generating evaluation report:', error);
            throw error;
        }
    }
    /**
     * Generate revenue report
     */
    async generateRevenueReport(providerId, filters) {
        try {
            // In a real implementation, this would generate a PDF report
            const reportData = {
                title: 'Revenue Report',
                generatedAt: new Date(),
                providerId,
                filters,
                revenue: [] // Would fetch actual revenue data
            };
            // Mock PDF buffer
            const pdfContent = JSON.stringify(reportData, null, 2);
            return Buffer.from(pdfContent);
        }
        catch (error) {
            console.error('Error generating revenue report:', error);
            throw error;
        }
    }
    /**
     * Get evaluation types
     */
    async getEvaluationTypes() {
        return [
            { value: 'Loyalty Bonus', label: 'Loyalty Bonus', maxPoints: 50, description: 'Regular visits and long-term relationship' },
            { value: 'Trust Recognition', label: 'Trust Recognition', maxPoints: 75, description: 'Building trust and rapport' },
            { value: 'Treatment Adherence', label: 'Treatment Adherence', maxPoints: 40, description: 'Following treatment plans consistently' },
            { value: 'Emergency Response', label: 'Emergency Response', maxPoints: 60, description: 'Quick response to emergency situations' },
            { value: 'Referral Bonus', label: 'Referral Bonus', maxPoints: 30, description: 'Referring new patients to the hospital' },
            { value: 'Special Recognition', label: 'Special Recognition', maxPoints: 100, description: 'Exceptional circumstances or contributions' }
        ];
    }
}
exports.ProviderService = ProviderService;
