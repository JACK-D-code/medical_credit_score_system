import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { z } from 'zod';
import crypto from 'crypto';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';
import axios from 'axios';
import { generateMockEcosystemForPHID } from '../utils/phid.seeder';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['PATIENT', 'PROVIDER', 'ADMIN']).default('PATIENT'),
    // Common fields for profile creation
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    hospitalName: z.string().optional(),
    mobileNumber: z.string().optional(),
});

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = registerSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email }
        });

        if (existingUser) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }

        // Hash password with bcrypt (salt rounds >= 12)
        const passwordHash = await AuthService.hashPassword(validatedData.password);

        // Create User and their respective Profile in a transaction
        const newUser = await prisma.$transaction(async (tx: any) => {
            const user = await tx.user.create({
                data: {
                    email: validatedData.email,
                    passwordHash,
                    role: validatedData.role,
                    firstName: validatedData.firstName || 'Unknown',
                    lastName: validatedData.lastName || 'User',
                }
            });

            if (validatedData.role === 'PATIENT') {
                const uniqueIdSegment = crypto.randomBytes(4).toString('hex').toUpperCase();
                const healthId = `PH-${uniqueIdSegment}`;
                const newPatientProfile = await tx.patientProfile.create({
                    data: {
                        userId: user.id,
                        firstName: validatedData.firstName || 'Unknown',
                        lastName: validatedData.lastName || 'Patient',
                        mobileNumber: validatedData.mobileNumber || '',
                        age: 0, bmi: 0, bloodPressureSys: 0, bloodPressureDia: 0, cholesterol: 0, smoking: false, exerciseHours: 0,
                        healthId,
                        healthIdGeneratedAt: new Date()
                    }
                });

                // Create default financial profile so the scoring engine doesn't fail with "Incomplete profile data"
                await tx.financialProfile.create({
                    data: {
                        patientId: newPatientProfile.id,
                        annualIncome: 0,
                        creditHistory: 0,
                        existingMedicalDebt: 0,
                    }
                });
            } else if (validatedData.role === 'PROVIDER' || validatedData.role === 'ADMIN') {
                await tx.providerProfile.create({
                    data: {
                        userId: user.id,
                        hospitalName: validatedData.hospitalName || 'Unknown Hospital',
                        specialization: validatedData.role === 'ADMIN' ? 'Hospital Administration' : 'General Practice',
                        licenseNumber: `${validatedData.role === 'ADMIN' ? 'ADM' : 'LIC'}-${Date.now()}` // Mock generation
                    }
                });
            }

            return user;
        });

        let registeredUser = newUser as any;
        if (validatedData.role === 'PATIENT') {
            const profile = await prisma.patientProfile.findUnique({ where: { userId: newUser.id } });
            if (profile && profile.healthId) {
                // Goal 3: Dynamically pre-populate the whole database ecosystem for this PHID
                await generateMockEcosystemForPHID(profile.id, profile.healthId);
                // Attach the profile back to the user object for the response
                registeredUser.patientProfile = profile;
            }
        } else if (validatedData.role === 'PROVIDER' || validatedData.role === 'ADMIN') {
            const profile = await prisma.providerProfile.findUnique({ where: { userId: newUser.id } });
            registeredUser.providerProfile = profile;
        }

        // Generate access and refresh tokens
        const tokenPair = AuthService.generateTokenPair({
            id: registeredUser.id,
            email: registeredUser.email,
            role: registeredUser.role,
        });

        // Create session
        await AuthService.createSession(
            registeredUser.id,
            registeredUser.email,
            registeredUser.role,
            tokenPair.accessToken,
            tokenPair.refreshToken,
            {
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                deviceType: 'web',
            }
        );

        res.status(201).json({
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
            user: {
                id: registeredUser.id,
                email: registeredUser.email,
                role: registeredUser.role,
                firstName: registeredUser.firstName,
                lastName: registeredUser.lastName,
                phid: registeredUser.patientProfile?.healthId || null,
                hospitalName: registeredUser.providerProfile?.hospitalName || null,
                specialization: registeredUser.providerProfile?.specialization || null,
            }
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: (error as any).errors });
        } else {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Server error during registration' });
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        let user;

        // Handle phone number login logic passed from frontend as "number@mediscore.local"
        if (email.endsWith('@mediscore.local')) {
            const mobileNumber = email.split('@')[0];
            const patientProfile = await prisma.patientProfile.findFirst({
                where: { mobileNumber },
                include: { user: { include: { patientProfile: true, providerProfile: true } } }
            });
            if (patientProfile && patientProfile.user) {
                user = patientProfile.user;
            }

            if (!user) {
                // Also check if any older users registered directly with this mock email
                user = await prisma.user.findUnique({
                    where: { email },
                    include: {
                        patientProfile: true,
                        providerProfile: true
                    }
                });
            }
        } else {
            user = await prisma.user.findUnique({
                where: { email },
                include: {
                    patientProfile: true,
                    providerProfile: true
                }
            });
        }

        if (!user) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }

        // Check if account is locked
        if (user.accountLockedUntil && new Date() < user.accountLockedUntil) {
            const minutesRemaining = Math.ceil(
                (user.accountLockedUntil.getTime() - Date.now()) / 60000
            );
            res.status(403).json({
                error: 'Account temporarily locked',
                message: `Account is locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minute(s).`,
                lockedUntil: user.accountLockedUntil,
            });
            return;
        }

        // Verify password using AuthService
        const isMatch = await AuthService.verifyPassword(password, user.passwordHash);
        if (!isMatch) {
            // Increment failed login attempts
            const failedAttempts = user.failedLoginAttempts + 1;
            const updateData: any = {
                failedLoginAttempts: failedAttempts,
                lastFailedLogin: new Date(),
            };

            // Lock account after 5 failed attempts
            if (failedAttempts >= 5) {
                const lockDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
                updateData.accountLockedUntil = new Date(Date.now() + lockDuration);
            }

            await prisma.user.update({
                where: { id: user.id },
                data: updateData,
            });

            if (failedAttempts >= 5) {
                res.status(403).json({
                    error: 'Account locked',
                    message: 'Account has been locked due to multiple failed login attempts. Please try again in 15 minutes.',
                });
            } else {
                res.status(400).json({
                    error: 'Invalid credentials',
                    attemptsRemaining: 5 - failedAttempts,
                });
            }
            return;
        }

        // Check if user is active
        if (!user.isActive) {
            res.status(403).json({ error: 'Account is inactive. Please contact support.' });
            return;
        }

        // Reset failed login attempts on successful login
        await prisma.user.update({
            where: { id: user.id },
            data: {
                failedLoginAttempts: 0,
                lastFailedLogin: null,
                accountLockedUntil: null,
                lastLogin: new Date(),
            },
        });

        // Generate access and refresh tokens
        const tokenPair = AuthService.generateTokenPair({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        // Create session
        await AuthService.createSession(
            user.id,
            user.email,
            user.role,
            tokenPair.accessToken,
            tokenPair.refreshToken,
            {
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                deviceType: 'web',
            }
        );

        res.json({
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                phid: user.patientProfile?.healthId || null,
                hospitalName: user.providerProfile?.hospitalName || null,
                specialization: user.providerProfile?.specialization || null,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                patientProfile: true,
                providerProfile: true
            }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Omit passwordHash from response
        const { passwordHash, ...userWithoutPassword } = user;
        const responseData = {
            ...userWithoutPassword,
            phid: user.patientProfile?.healthId || null,
            hospitalName: user.providerProfile?.hospitalName || null,
            specialization: user.providerProfile?.specialization || null,
        };
        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: 'Server error retrieving profile' });
    }
};

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { identifier } = req.body;
        if (!identifier) {
            res.status(400).json({ error: 'Email or Phone is required' });
            return;
        }

        // Generate a 6-digit random OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Expiration time set to 10 minutes from now
        const expiresAt = new Date(Date.now() + 10 * 60000);

        // Upsert OTP record for this identifier
        const existingOtp = await prisma.otpVerification.findFirst({
            where: { identifier }
        });

        if (existingOtp) {
            await prisma.otpVerification.update({
                where: { id: existingOtp.id },
                data: { otp, expiresAt }
            });
        } else {
            await prisma.otpVerification.create({
                data: { identifier, otp, expiresAt }
            });
        }

        // In production, you would use Twilio or SendGrid here.
        // For local dev, we print it to the server console.
        console.log(`\n\n[MOCK SMS/EMAIL] -> Code generated for ${identifier}: ${otp}\n\n`);

        // Send Real SMS via Fast2SMS
        const isMobileNumber = /^[6-9]\d{9}$/.test(identifier);

        if (isMobileNumber && process.env.FAST2SMS_API_KEY) {
            try {
                const response = await axios.post(
                    'https://www.fast2sms.com/dev/bulkV2',
                    {
                        route: 'q',
                        message: `Your MediCredit Verification Code is: ${otp}. Valid for 10 minutes.`,
                        language: 'english',
                        flash: 0,
                        numbers: identifier,
                    },
                    {
                        headers: {
                            'authorization': process.env.FAST2SMS_API_KEY,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log(`[Fast2SMS] Successfully triggered SMS to ${identifier}`, response.data);
            } catch (smsError: any) {
                console.error(`[Fast2SMS Error] Failed to send SMS to ${identifier}:`, smsError.response?.data || smsError.message);
                // We might still want to return success so the user can use the console OTP if the SMS gateway fails in dev,
                // but in production we'd return a 500 error here.
            }
        }

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Server error sending OTP' });
    }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { identifier, otp } = req.body;

        if (!identifier || !otp) {
            res.status(400).json({ error: 'Identifier and OTP are required' });
            return;
        }

        const otpRecord = await prisma.otpVerification.findFirst({
            where: { identifier }
        });

        if (!otpRecord) {
            res.status(400).json({ error: 'No OTP found for this identifier.' });
            return;
        }

        // Allow '000000' as a universal bypass in development environments for testing E2E flows
        const isDevBypass = process.env.NODE_ENV !== 'production' && otp === '000000';

        if (otpRecord.otp !== otp && !isDevBypass) {
            res.status(400).json({ error: 'Invalid OTP code.' });
            return;
        }

        if (new Date() > otpRecord.expiresAt && !isDevBypass) {
            res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
            return;
        }

        // Delete the OTP record as it's been consumed
        await prisma.otpVerification.delete({
            where: { id: otpRecord.id }
        });

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Server error verifying OTP' });
    }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).json({ error: 'Refresh token is required' });
            return;
        }

        // Generate new token pair first
        const newTokenPair = await AuthService.refreshAccessToken(refreshToken, '');

        if (!newTokenPair) {
            res.status(401).json({
                error: 'Invalid or expired refresh token',
                code: 'INVALID_REFRESH_TOKEN'
            });
            return;
        }

        // Now refresh with the actual new access token
        await AuthService.refreshAccessToken(refreshToken, newTokenPair.accessToken);

        res.json({
            accessToken: newTokenPair.accessToken,
            refreshToken: newTokenPair.refreshToken,
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ error: 'Server error refreshing token' });
    }
};

/**
 * Logout - invalidate current session
 */
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            await AuthService.invalidateSession(token);
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Server error during logout' });
    }
};

/**
 * Logout from all devices - invalidate all user sessions
 */
export const logoutAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        await AuthService.invalidateAllUserSessions(req.user.id);

        res.json({ message: 'Logged out from all devices successfully' });
    } catch (error) {
        console.error('Logout all error:', error);
        res.status(500).json({ error: 'Server error during logout' });
    }
};

/**
 * Get user's active sessions
 */
export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const sessions = await AuthService.getUserSessions(req.user.id);

        res.json({ sessions });
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ error: 'Server error retrieving sessions' });
    }
};
