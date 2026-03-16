"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class WebSocketService {
    io;
    connectedUsers = new Map(); // userId -> socketId
    constructor() {
        this.io = new socket_io_1.Server({
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:5173",
                methods: ["GET", "POST"]
            }
        });
    }
    /**
     * Initialize WebSocket server
     */
    initialize(server) {
        this.io.attach(server);
        // Authentication middleware
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    return next(new Error('Authentication error'));
                }
                const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
                const user = await prisma.user.findUnique({
                    where: { id: decoded.userId },
                    include: {
                        patient: true,
                        provider: true,
                        admin: true
                    }
                });
                if (!user) {
                    return next(new Error('User not found'));
                }
                socket.data.user = user;
                next();
            }
            catch (error) {
                next(new Error('Authentication error'));
            }
        });
        // Handle connections
        this.io.on('connection', (socket) => {
            const user = socket.data.user;
            console.log(`User connected: ${user.email} (${user.role})`);
            // Store connected user
            this.connectedUsers.set(user.id, socket.id);
            // Join user-specific rooms
            socket.join(`user-${user.id}`);
            // Join role-based rooms
            socket.join(`role-${user.role}`);
            // Join patient-specific room if user is a patient
            if (user.patient) {
                socket.join(`patient-${user.patient.id}`);
            }
            // Join provider-specific room if user is a provider
            if (user.provider) {
                socket.join(`provider-${user.provider.id}`);
            }
            // Handle joining specific patient room (for providers/admins)
            socket.on('join-patient-room', (patientId) => {
                if (user.role === 'PROVIDER' || user.role === 'ADMIN') {
                    socket.join(`patient-${patientId}`);
                    socket.emit('joined-patient-room', patientId);
                }
            });
            // Handle leaving patient room
            socket.on('leave-patient-room', (patientId) => {
                socket.leave(`patient-${patientId}`);
                socket.emit('left-patient-room', patientId);
            });
            // Handle real-time credit score requests
            socket.on('get-current-score', async (patientId) => {
                try {
                    const creditScore = await prisma.creditScore.findFirst({
                        where: { patientId },
                        orderBy: { calculatedAt: 'desc' }
                    });
                    socket.emit('current-score', {
                        patientId,
                        score: creditScore
                    });
                }
                catch (error) {
                    socket.emit('error', { message: 'Failed to get credit score' });
                }
            });
            // Handle real-time activity tracking
            socket.on('track-activity', async (activityData) => {
                try {
                    // This would be handled by the activity service
                    // For now, just acknowledge
                    socket.emit('activity-tracked', {
                        success: true,
                        activityId: activityData.id
                    });
                }
                catch (error) {
                    socket.emit('error', { message: 'Failed to track activity' });
                }
            });
            // Handle disconnection
            socket.on('disconnect', () => {
                console.log(`User disconnected: ${user.email} (${user.role})`);
                this.connectedUsers.delete(user.id);
            });
        });
        console.log('WebSocket server initialized');
    }
    /**
     * Broadcast credit score update to relevant users
     */
    async broadcastScoreUpdate(patientId, data) {
        try {
            // Send to patient
            this.io.to(`patient-${patientId}`).emit('score-update', {
                type: 'SCORE_UPDATE',
                patientId,
                ...data,
                timestamp: new Date()
            });
            // Send to all providers
            this.io.to('role-PROVIDER').emit('patient-score-update', {
                type: 'PATIENT_SCORE_UPDATE',
                patientId,
                ...data,
                timestamp: new Date()
            });
            // Send to all admins
            this.io.to('role-ADMIN').emit('patient-score-update', {
                type: 'PATIENT_SCORE_UPDATE',
                patientId,
                ...data,
                timestamp: new Date()
            });
            console.log(`Score update broadcasted for patient ${patientId}: ${data.newScore}`);
        }
        catch (error) {
            console.error('Error broadcasting score update:', error);
        }
    }
    /**
     * Broadcast activity update
     */
    async broadcastActivityUpdate(data) {
        try {
            // Send to patient
            this.io.to(`patient-${data.patientId}`).emit('activity-update', {
                type: 'ACTIVITY_UPDATE',
                ...data,
                timestamp: new Date()
            });
            // Send to providers
            this.io.to('role-PROVIDER').emit('patient-activity-update', {
                type: 'PATIENT_ACTIVITY_UPDATE',
                ...data,
                timestamp: new Date()
            });
            console.log(`Activity update broadcasted for patient ${data.patientId}`);
        }
        catch (error) {
            console.error('Error broadcasting activity update:', error);
        }
    }
    /**
     * Send notification to specific user
     */
    async sendNotification(userId, data) {
        try {
            this.io.to(`user-${userId}`).emit('notification', {
                ...data,
                timestamp: new Date()
            });
            // Save notification to database
            await prisma.notification.create({
                data: {
                    userId,
                    title: data.title,
                    message: data.message,
                    type: data.type,
                    metadata: data.metadata
                }
            });
            console.log(`Notification sent to user ${userId}: ${data.title}`);
        }
        catch (error) {
            console.error('Error sending notification:', error);
        }
    }
    /**
     * Broadcast payment update
     */
    async broadcastPaymentUpdate(data) {
        try {
            // Send to patient
            this.io.to(`patient-${data.patientId}`).emit('payment-update', {
                type: 'PAYMENT_UPDATE',
                ...data,
                timestamp: new Date()
            });
            // Send to finance providers
            this.io.to('role-PROVIDER').emit('payment-update', {
                type: 'PAYMENT_UPDATE',
                ...data,
                timestamp: new Date()
            });
            console.log(`Payment update broadcasted for patient ${data.patientId}`);
        }
        catch (error) {
            console.error('Error broadcasting payment update:', error);
        }
    }
    /**
     * Broadcast evaluation update
     */
    async broadcastEvaluationUpdate(data) {
        try {
            // Send to patient
            this.io.to(`patient-${data.patientId}`).emit('evaluation-update', {
                type: 'EVALUATION_UPDATE',
                ...data,
                timestamp: new Date()
            });
            // Send to providers
            this.io.to('role-PROVIDER').emit('evaluation-update', {
                type: 'EVALUATION_UPDATE',
                ...data,
                timestamp: new Date()
            });
            console.log(`Evaluation update broadcasted for patient ${data.patientId}`);
        }
        catch (error) {
            console.error('Error broadcasting evaluation update:', error);
        }
    }
    /**
     * Broadcast system announcement
     */
    async broadcastSystemAnnouncement(message, targetRole) {
        try {
            const announcementData = {
                type: 'SYSTEM_ANNOUNCEMENT',
                message,
                timestamp: new Date()
            };
            if (targetRole) {
                this.io.to(`role-${targetRole}`).emit('system-announcement', announcementData);
            }
            else {
                this.io.emit('system-announcement', announcementData);
            }
            console.log(`System announcement broadcasted: ${message}`);
        }
        catch (error) {
            console.error('Error broadcasting system announcement:', error);
        }
    }
    /**
     * Get connected users count
     */
    getConnectedUsersCount() {
        return this.connectedUsers.size;
    }
    /**
     * Get connected users by role
     */
    getConnectedUsersByRole() {
        const roleCounts = {};
        // This would require storing user roles in connectedUsers
        // For now, return empty object
        return roleCounts;
    }
    /**
     * Send real-time dashboard updates
     */
    async broadcastDashboardUpdate(role, data) {
        try {
            this.io.to(`role-${role}`).emit('dashboard-update', {
                type: 'DASHBOARD_UPDATE',
                ...data,
                timestamp: new Date()
            });
            console.log(`Dashboard update broadcasted for role ${role}`);
        }
        catch (error) {
            console.error('Error broadcasting dashboard update:', error);
        }
    }
    /**
     * Handle appointment reminders
     */
    async sendAppointmentReminder(patientId, appointmentData) {
        try {
            this.io.to(`patient-${patientId}`).emit('appointment-reminder', {
                type: 'APPOINTMENT_REMINDER',
                patientId,
                ...appointmentData,
                timestamp: new Date()
            });
            console.log(`Appointment reminder sent to patient ${patientId}`);
        }
        catch (error) {
            console.error('Error sending appointment reminder:', error);
        }
    }
    /**
     * Handle EMI payment reminders
     */
    async sendEMIPaymentReminder(patientId, emiData) {
        try {
            this.io.to(`patient-${patientId}`).emit('emi-reminder', {
                type: 'EMI_REMINDER',
                patientId,
                ...emiData,
                timestamp: new Date()
            });
            console.log(`EMI reminder sent to patient ${patientId}`);
        }
        catch (error) {
            console.error('Error sending EMI reminder:', error);
        }
    }
    /**
     * Broadcast charity request updates
     */
    async broadcastCharityUpdate(charityData) {
        try {
            // Send to patient
            this.io.to(`patient-${charityData.patientId}`).emit('charity-update', {
                type: 'CHARITY_UPDATE',
                ...charityData,
                timestamp: new Date()
            });
            // Send to admins
            this.io.to('role-ADMIN').emit('charity-request', {
                type: 'CHARITY_REQUEST',
                ...charityData,
                timestamp: new Date()
            });
            console.log(`Charity update broadcasted for patient ${charityData.patientId}`);
        }
        catch (error) {
            console.error('Error broadcasting charity update:', error);
        }
    }
    /**
     * Get socket instance
     */
    getIO() {
        return this.io;
    }
}
exports.WebSocketService = WebSocketService;
