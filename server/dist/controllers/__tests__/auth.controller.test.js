"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../auth.controller");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const auth_service_1 = require("../../services/auth.service");
// Mock dependencies
jest.mock('../../utils/prisma', () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));
jest.mock('../../services/auth.service');
describe('Auth Controller - Login with Rate Limiting and Account Lockout', () => {
    let mockRequest;
    let mockResponse;
    let jsonMock;
    let statusMock;
    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockRequest = {
            body: {},
            ip: '127.0.0.1',
            headers: {},
        };
        mockResponse = {
            json: jsonMock,
            status: statusMock,
        };
        jest.clearAllMocks();
    });
    describe('Account Lockout', () => {
        it('should lock account after 5 failed login attempts', async () => {
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                passwordHash: 'hashed_password',
                firstName: 'Test',
                lastName: 'User',
                role: 'provider',
                isActive: true,
                failedLoginAttempts: 4,
                lastFailedLogin: new Date(),
                accountLockedUntil: null,
            };
            mockRequest.body = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };
            prisma_1.default.user.findUnique.mockResolvedValue(mockUser);
            auth_service_1.AuthService.verifyPassword.mockResolvedValue(false);
            prisma_1.default.user.update.mockResolvedValue({
                ...mockUser,
                failedLoginAttempts: 5,
                accountLockedUntil: new Date(Date.now() + 15 * 60 * 1000),
            });
            await (0, auth_controller_1.login)(mockRequest, mockResponse);
            expect(prisma_1.default.user.update).toHaveBeenCalledWith({
                where: { id: 'user-123' },
                data: expect.objectContaining({
                    failedLoginAttempts: 5,
                    accountLockedUntil: expect.any(Date),
                }),
            });
            expect(statusMock).toHaveBeenCalledWith(403);
            expect(jsonMock).toHaveBeenCalledWith({
                error: 'Account locked',
                message: expect.stringContaining('locked due to multiple failed login attempts'),
            });
        });
        it('should reject login when account is locked', async () => {
            const lockUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                passwordHash: 'hashed_password',
                firstName: 'Test',
                lastName: 'User',
                role: 'provider',
                isActive: true,
                failedLoginAttempts: 5,
                lastFailedLogin: new Date(),
                accountLockedUntil: lockUntil,
            };
            mockRequest.body = {
                email: 'test@example.com',
                password: 'correctpassword',
            };
            prisma_1.default.user.findUnique.mockResolvedValue(mockUser);
            await (0, auth_controller_1.login)(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(403);
            expect(jsonMock).toHaveBeenCalledWith({
                error: 'Account temporarily locked',
                message: expect.stringContaining('locked due to multiple failed login attempts'),
                lockedUntil: lockUntil,
            });
        });
        it('should increment failed attempts on wrong password', async () => {
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                passwordHash: 'hashed_password',
                firstName: 'Test',
                lastName: 'User',
                role: 'provider',
                isActive: true,
                failedLoginAttempts: 2,
                lastFailedLogin: new Date(),
                accountLockedUntil: null,
            };
            mockRequest.body = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };
            prisma_1.default.user.findUnique.mockResolvedValue(mockUser);
            auth_service_1.AuthService.verifyPassword.mockResolvedValue(false);
            prisma_1.default.user.update.mockResolvedValue({
                ...mockUser,
                failedLoginAttempts: 3,
            });
            await (0, auth_controller_1.login)(mockRequest, mockResponse);
            expect(prisma_1.default.user.update).toHaveBeenCalledWith({
                where: { id: 'user-123' },
                data: expect.objectContaining({
                    failedLoginAttempts: 3,
                    lastFailedLogin: expect.any(Date),
                }),
            });
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                error: 'Invalid credentials',
                attemptsRemaining: 2,
            });
        });
        it('should reset failed attempts on successful login', async () => {
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                passwordHash: 'hashed_password',
                firstName: 'Test',
                lastName: 'User',
                role: 'provider',
                isActive: true,
                failedLoginAttempts: 3,
                lastFailedLogin: new Date(),
                accountLockedUntil: null,
            };
            mockRequest.body = {
                email: 'test@example.com',
                password: 'correctpassword',
            };
            const mockTokenPair = {
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
            };
            prisma_1.default.user.findUnique.mockResolvedValue(mockUser);
            auth_service_1.AuthService.verifyPassword.mockResolvedValue(true);
            auth_service_1.AuthService.generateTokenPair.mockReturnValue(mockTokenPair);
            auth_service_1.AuthService.createSession.mockResolvedValue(undefined);
            prisma_1.default.user.update.mockResolvedValue({
                ...mockUser,
                failedLoginAttempts: 0,
                lastFailedLogin: null,
                accountLockedUntil: null,
            });
            await (0, auth_controller_1.login)(mockRequest, mockResponse);
            expect(prisma_1.default.user.update).toHaveBeenCalledWith({
                where: { id: 'user-123' },
                data: {
                    failedLoginAttempts: 0,
                    lastFailedLogin: null,
                    accountLockedUntil: null,
                    lastLogin: expect.any(Date),
                },
            });
            expect(jsonMock).toHaveBeenCalledWith({
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
                user: expect.objectContaining({
                    id: 'user-123',
                    email: 'test@example.com',
                }),
            });
        });
        it('should allow login after lock period expires', async () => {
            const expiredLockTime = new Date(Date.now() - 1000); // 1 second ago
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                passwordHash: 'hashed_password',
                firstName: 'Test',
                lastName: 'User',
                role: 'provider',
                isActive: true,
                failedLoginAttempts: 5,
                lastFailedLogin: new Date(),
                accountLockedUntil: expiredLockTime,
            };
            mockRequest.body = {
                email: 'test@example.com',
                password: 'correctpassword',
            };
            const mockTokenPair = {
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
            };
            prisma_1.default.user.findUnique.mockResolvedValue(mockUser);
            auth_service_1.AuthService.verifyPassword.mockResolvedValue(true);
            auth_service_1.AuthService.generateTokenPair.mockReturnValue(mockTokenPair);
            auth_service_1.AuthService.createSession.mockResolvedValue(undefined);
            prisma_1.default.user.update.mockResolvedValue({
                ...mockUser,
                failedLoginAttempts: 0,
                lastFailedLogin: null,
                accountLockedUntil: null,
            });
            await (0, auth_controller_1.login)(mockRequest, mockResponse);
            expect(jsonMock).toHaveBeenCalledWith({
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
                user: expect.objectContaining({
                    id: 'user-123',
                    email: 'test@example.com',
                }),
            });
        });
    });
    describe('Basic Login Validation', () => {
        it('should return error when email is missing', async () => {
            mockRequest.body = {
                password: 'password123',
            };
            await (0, auth_controller_1.login)(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                error: 'Email and password are required',
            });
        });
        it('should return error when password is missing', async () => {
            mockRequest.body = {
                email: 'test@example.com',
            };
            await (0, auth_controller_1.login)(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                error: 'Email and password are required',
            });
        });
        it('should return error when user does not exist', async () => {
            mockRequest.body = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };
            prisma_1.default.user.findUnique.mockResolvedValue(null);
            await (0, auth_controller_1.login)(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                error: 'Invalid credentials',
            });
        });
        it('should return error when account is inactive', async () => {
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                passwordHash: 'hashed_password',
                firstName: 'Test',
                lastName: 'User',
                role: 'provider',
                isActive: false,
                failedLoginAttempts: 0,
                lastFailedLogin: null,
                accountLockedUntil: null,
            };
            mockRequest.body = {
                email: 'test@example.com',
                password: 'correctpassword',
            };
            prisma_1.default.user.findUnique.mockResolvedValue(mockUser);
            auth_service_1.AuthService.verifyPassword.mockResolvedValue(true);
            await (0, auth_controller_1.login)(mockRequest, mockResponse);
            expect(statusMock).toHaveBeenCalledWith(403);
            expect(jsonMock).toHaveBeenCalledWith({
                error: 'Account is inactive. Please contact support.',
            });
        });
    });
});
