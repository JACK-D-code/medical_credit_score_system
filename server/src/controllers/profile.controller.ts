import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';
import { calculateScoreLogic } from './score.controller';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                patientProfile: {
                    include: {
                        documents: true,
                        creditScores: {
                            orderBy: { calculatedAt: 'desc' },
                            take: 1
                        },
                        activities: {
                            orderBy: { createdAt: 'desc' },
                            take: 10
                        },
                        notifications: {
                            orderBy: { createdAt: 'desc' },
                            take: 5
                        }
                    }
                }
            }
        });

        if (!user || !user.patientProfile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }

        res.json({
            personalInfo: {
                fullName: `${user.patientProfile.firstName} ${user.patientProfile.lastName}`,
                aadhaarId: user.patientProfile.aadhaarId || '',
                dateOfBirth: user.patientProfile.dateOfBirth ? user.patientProfile.dateOfBirth.toISOString().split('T')[0] : '',
                gender: user.patientProfile.gender || ''
            },
            contactInfo: {
                mobileNumber: user.patientProfile.mobileNumber || '',
                email: user.email,
                address: user.patientProfile.address || '',
                city: user.patientProfile.city || '',
                state: user.patientProfile.state || '',
                pincode: user.patientProfile.pincode || ''
            },
            securityInfo: {
                // Fields removed as they don't exist on User model
            },
            privacySettings: {
                shareWithHospitals: user.patientProfile.shareWithHospitals,
                shareWithFinancial: user.patientProfile.shareWithFinancial,
                marketingEmails: user.patientProfile.marketingEmails,
                dataAnalytics: user.patientProfile.dataAnalytics
            },
            medicalInfo: {
                medicalHistory: user.patientProfile.medicalHistory || '',
                allergies: user.patientProfile.allergies || '',
                chronicConditions: user.patientProfile.chronicConditions || ''
            },
            documents: user.patientProfile.documents.map((doc: any) => ({
                id: doc.id,
                type: doc.type,
                name: doc.name,
                uploadDate: doc.uploadedAt,
                status: doc.status
            })),
            activities: user.patientProfile.activities.map((act: any) => ({
                id: act.id,
                type: act.type,
                title: act.title,
                description: act.description,
                timestamp: act.createdAt,
                metadata: { device: act.device, location: act.location }
            })),
            notifications: user.patientProfile.notifications,
            creditScore: user.patientProfile.creditScores[0]?.scoreValue || 0,
            creditRiskLevel: user.patientProfile.creditScores[0]?.riskLevel || 'UNRATED'
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'Server configuration failure' });
    }
};

export const updatePersonalInfo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { fullName, aadhaarId, dateOfBirth, gender, phid } = req.body;
        const [firstName, ...rest] = fullName.split(' ');
        const lastName = rest.join(' ');

        const profile = await prisma.patientProfile.update({
            where: { userId },
            data: {
                firstName,
                lastName,
                aadhaarId,
                healthId: phid,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                gender,
                activities: {
                    create: {
                        type: 'profile_update',
                        title: 'Personal Information Updated',
                        description: 'Personal details were successfully modified',
                        device: req.headers['user-agent']?.substring(0, 50) || 'Unknown Device',
                        location: 'System'
                    }
                }
            }
        });
        res.json({ message: 'Personal info updated' });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};

export const updateContactInfo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { mobileNumber, address, city, state, pincode } = req.body;

        await prisma.patientProfile.update({
            where: { userId },
            data: {
                mobileNumber, address, city, state, pincode,
                activities: {
                    create: {
                        type: 'profile_update',
                        title: 'Contact Information Updated',
                        description: 'Contact details were successfully modified',
                        device: req.headers['user-agent']?.substring(0, 50) || 'Unknown Device',
                        location: 'System'
                    }
                }
            }
        });
        res.json({ message: 'Contact info updated' });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};

export const updateMedicalInfo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { medicalHistory, allergies, chronicConditions } = req.body;

        await prisma.patientProfile.update({
            where: { userId },
            data: {
                medicalHistory, allergies, chronicConditions,
                activities: {
                    create: {
                        type: 'profile_update',
                        title: 'Medical Information Updated',
                        description: 'Medical history and conditions were successfully modified',
                        device: req.headers['user-agent']?.substring(0, 50) || 'Unknown Device',
                        location: 'System'
                    }
                }
            }
        });
        res.json({ message: 'Medical info updated' });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};

export const updateSecurityInfo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { mfaEnabled, type } = req.body;

        if (!userId) return;

        const patient = await prisma.patientProfile.findUnique({ where: { userId } });
        if (!patient) return;

        if (type === 'password') {
            await prisma.userActivity.create({
                data: { patientId: patient.id, type: 'security', title: 'Password Changed', description: 'Account password was successfully updated', location: 'System', device: 'System' }
            });
        } else if (type === 'mfa') {
            await prisma.userActivity.create({
                data: { patientId: patient.id, type: 'security', title: mfaEnabled ? 'Two-Factor Authentication Enabled' : 'Two-Factor Auth Disabled', description: 'MFA toggled', location: 'System', device: 'System' }
            });
        }
        res.json({ message: 'Security info updated' });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};

export const updatePrivacyInfo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { shareWithHospitals, shareWithFinancial, marketingEmails, dataAnalytics } = req.body;

        await prisma.patientProfile.update({
            where: { userId },
            data: {
                shareWithHospitals, shareWithFinancial, marketingEmails, dataAnalytics,
                activities: {
                    create: {
                        type: 'profile_update',
                        title: 'Privacy Settings Updated',
                        description: 'Data sharing preferences were modified',
                        device: 'System', location: 'System'
                    }
                }
            }
        });
        res.json({ message: 'Privacy info updated' });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { type, name } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const patient = await prisma.patientProfile.findUnique({ where: { userId } });
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }

        // Mock saving the document
        const document = await prisma.patientDocument.create({
            data: {
                patientId: patient.id,
                type,
                name,
                status: 'verified' // Auto verify for demo
            }
        });

        // Add a timeline event
        await prisma.timelineEvent.create({
            data: {
                patientId: patient.id,
                type: 'document_upload',
                title: 'Document Verified',
                description: `${name} was successfully uploaded and verified.`,
                impact: 5,
                date: new Date()
            }
        });

        // Trigger real-time dynamic score recalculation
        try {
            await calculateScoreLogic(userId);
        } catch (e) {
            console.error('Score recalculation failed:', e);
        }

        res.json({ message: 'Document uploaded successfully', document });
    } catch (err) {
        console.error('Error uploading document:', err);
        res.status(500).json({ error: 'Failed to upload document' });
    }
};

export const reportVisit = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { hospitalName, date, type, description } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const patient = await prisma.patientProfile.findUnique({ where: { userId } });
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }

        // Add a timeline event
        const newEvent = await prisma.timelineEvent.create({
            data: {
                patientId: patient.id,
                type: 'visit',
                title: `${type} at ${hospitalName}`,
                description: description || `Reported a ${type.toLowerCase()} visit.`,
                impact: 20,
                date: new Date(date)
            }
        });

        // Trigger real-time score calculation based on this new timeline event
        try {
            await calculateScoreLogic(userId);
        } catch (e) {
            console.error('Score recalculation failed:', e);
        }

        res.json({ message: 'Visit reported successfully', event: newEvent });
    } catch (err) {
        console.error('Error reporting visit:', err);
        res.status(500).json({ error: 'Failed to report visit' });
    }
};

export const completeTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { taskId, points, type, description, title } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const patient = await prisma.patientProfile.findUnique({ where: { userId } });
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }

        // Add a timeline event for the completed task
        const newEvent = await prisma.timelineEvent.create({
            data: {
                patientId: patient.id,
                type: 'task',
                title: title || 'Task Completed',
                description: description || `Completed an online task.`,
                impact: points || 20,
                date: new Date()
            }
        });

        // Trigger real-time dynamic score recalculation with the new timeline event in DB
        try {
            await calculateScoreLogic(userId);
        } catch (e) {
            console.error('Score recalculation failed:', e);
        }

        res.json({ message: 'Task completed successfully', event: newEvent });
    } catch (err) {
        console.error('Error completing task:', err);
        res.status(500).json({ error: 'Failed to complete task' });
    }
};

export const getAvailableActivities = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const patient = await prisma.patientProfile.findUnique({ where: { userId } });
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        
        const activities = [
            { id: 1, title: 'Weekly Health Quiz', description: 'Answer 5 questions about nutrition to earn points.', points: 15, type: 'QUIZ', category: 'Quizzes', icon: '📝' },
            { id: 2, title: 'Sync Daily Steps', description: 'Connect your health app and log 10,000 steps.', points: 10, type: 'SYNC', category: 'Wearables', icon: '🏃' },
            { id: 3, title: 'Upload Vaccination Record', description: 'Securely upload your latest flu shot records.', points: 25, type: 'UPLOAD', category: 'Documents', icon: '💉' },
            { id: 4, title: 'Connect Smart Watch', description: 'Link your Apple Watch, Fitbit or Garmin.', points: 20, type: 'SYNC', category: 'Wearables', icon: '⌚' },
            { id: 5, title: 'Annual Eye Exam', description: 'Verify your recent optical checkup.', points: 30, type: 'VERIFY', category: 'Checkups', icon: '👁️' },
            { id: 6, title: 'Upload Lab Results', description: 'Submit recent comprehensive blood work analysis.', points: 40, type: 'UPLOAD', category: 'Documents', icon: '📄' }
        ];

        res.json(activities);
    } catch (err) {
        console.error('Error fetching activities:', err);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
};
