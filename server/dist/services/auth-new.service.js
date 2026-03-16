"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const websocket_service_1 = require("./websocket.service");
const prisma = new client_1.PrismaClient();
class AuthService {
    websocketService;
    JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    JWT_EXPIRES_IN = '15m';
    REFRESH_TOKEN_EXPIRES_IN = '7d';
    constructor() {
        this.websocketService = new websocket_service_1.WebSocketService();
    }
    /**
     * Register a new user
     */
    async register(userData) {
        try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email }
            });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
            // Hash password
            const saltRounds = 12;
            const passwordHash = await bcryptjs_1.default.hash(userData.password, saltRounds);
            // Create user
            const user = await prisma.user.create({
                data: {
                    email: userData.email,
                    password: passwordHash,
                    role: userData.role
                }
            });
            // Create role-specific profile
            let profileData = {};
            if (userData.role === 'PATIENT') {
                profileData = await this.createPatientProfile(user.id, userData);
            }
            else if (userData.role === 'PROVIDER') {
                profileData = await this.createProviderProfile(user.id, userData);
            }
            else if (userData.role === 'ADMIN') {
                profileData = await this.createAdminProfile(user.id, userData);
            }
            // Generate tokens
            const tokens = this.generateTokens(user);
            // Update last login
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() }
            });
            // Send welcome notification
            await this.websocketService.sendNotification(user.id, {
                title: 'Welcome to Medical Credit System',
                message: `Your account has been successfully created as a ${userData.role.toLowerCase()}.`,
                type: 'SYSTEM_ANNOUNCEMENT'
            });
            return {
                user: { ...user, ...profileData },
                ...tokens
            };
        }
        catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
    /**
     * Login user
     */
    async login(credentials) {
        try {
            // Find user
            const user = await prisma.user.findUnique({
                where: { email: credentials.email }
            });
            if (!user) {
                throw new Error('Invalid email or password');
            }
            // Check if user is active
            if (!user.isActive) {
                throw new Error('Account is deactivated');
            }
            // Verify password
            const isPasswordValid = await bcryptjs_1.default.compare(credentials.password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }
            // Generate tokens
            const tokens = this.generateTokens(user);
            // Update last login
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() }
            });
            return {
                user,
                ...tokens
            };
        }
        catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
    /**
     * Create patient profile
     */
    async createPatientProfile(userId, userData) {
        return await prisma.patient.create({
            data: {
                userId,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                dateOfBirth: userData.dateOfBirth || new Date(),
                phone: userData.phone,
                address: userData.address
            }
        });
    }
    /**
     * Create provider profile
     */
    async createProviderProfile(userId, userData) {
        return await prisma.provider.create({
            data: {
                userId,
                hospitalName: userData.hospitalName || '',
                specialization: userData.specialization,
                licenseNumber: userData.licenseNumber
            }
        });
    }
    /**
     * Create admin profile
     */
    async createAdminProfile(userId, userData) {
        return await prisma.admin.create({
            data: {
                userId,
                level: 'ADMIN'
            }
        });
    }
    /**
     * Generate JWT tokens
     */
    generateTokens(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };
        // Generate access token
        const accessToken = jsonwebtoken_1.default.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN
        });
        // Generate refresh token
        const refreshToken = jsonwebtoken_1.default.sign(payload, this.JWT_SECRET, {
            expiresIn: this.REFRESH_TOKEN_EXPIRES_IN
        });
        // Calculate expiration time in seconds
        const expiresIn = 15 * 60; // 15 minutes
        return {
            accessToken,
            refreshToken,
            expiresIn
        };
    }
    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
}
exports.AuthService = AuthService;
