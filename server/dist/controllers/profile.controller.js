"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableActivities = exports.completeTask = exports.reportVisit = exports.uploadDocument = exports.updatePrivacyInfo = exports.updateSecurityInfo = exports.updateMedicalInfo = exports.updateContactInfo = exports.updatePersonalInfo = exports.getProfile = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const score_controller_1 = require("./score.controller");
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
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
            documents: user.patientProfile.documents.map((doc) => ({
                id: doc.id,
                type: doc.type,
                name: doc.name,
                uploadDate: doc.uploadedAt,
                status: doc.status
            })),
            activities: user.patientProfile.activities.map((act) => ({
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
    }
    catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: 'Server configuration failure' });
    }
};
exports.getProfile = getProfile;
const updatePersonalInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { fullName, aadhaarId, dateOfBirth, gender } = req.body;
        const [firstName, ...rest] = fullName.split(' ');
        const lastName = rest.join(' ');
        const profile = await prisma_1.default.patientProfile.update({
            where: { userId },
            data: {
                firstName,
                lastName,
                aadhaarId,
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
    }
    catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};
exports.updatePersonalInfo = updatePersonalInfo;
const updateContactInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { mobileNumber, address, city, state, pincode } = req.body;
        await prisma_1.default.patientProfile.update({
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
    }
    catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};
exports.updateContactInfo = updateContactInfo;
const updateMedicalInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { medicalHistory, allergies, chronicConditions } = req.body;
        await prisma_1.default.patientProfile.update({
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
    }
    catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};
exports.updateMedicalInfo = updateMedicalInfo;
const updateSecurityInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { mfaEnabled, type } = req.body;
        if (!userId)
            return;
        const patient = await prisma_1.default.patientProfile.findUnique({ where: { userId } });
        if (!patient)
            return;
        if (type === 'password') {
            await prisma_1.default.userActivity.create({
                data: { patientId: patient.id, type: 'security', title: 'Password Changed', description: 'Account password was successfully updated', location: 'System', device: 'System' }
            });
        }
        else if (type === 'mfa') {
            await prisma_1.default.userActivity.create({
                data: { patientId: patient.id, type: 'security', title: mfaEnabled ? 'Two-Factor Authentication Enabled' : 'Two-Factor Auth Disabled', description: 'MFA toggled', location: 'System', device: 'System' }
            });
        }
        res.json({ message: 'Security info updated' });
    }
    catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};
exports.updateSecurityInfo = updateSecurityInfo;
const updatePrivacyInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { shareWithHospitals, shareWithFinancial, marketingEmails, dataAnalytics } = req.body;
        await prisma_1.default.patientProfile.update({
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
    }
    catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};
exports.updatePrivacyInfo = updatePrivacyInfo;
const uploadDocument = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { type, name } = req.body;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const patient = await prisma_1.default.patientProfile.findUnique({ where: { userId } });
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        // Mock saving the document
        const document = await prisma_1.default.patientDocument.create({
            data: {
                patientId: patient.id,
                type,
                name,
                status: 'verified' // Auto verify for demo
            }
        });
        // Add a timeline event
        await prisma_1.default.timelineEvent.create({
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
            await (0, score_controller_1.calculateScoreLogic)(userId);
        }
        catch (e) {
            console.error('Score recalculation failed:', e);
        }
        res.json({ message: 'Document uploaded successfully', document });
    }
    catch (err) {
        console.error('Error uploading document:', err);
        res.status(500).json({ error: 'Failed to upload document' });
    }
};
exports.uploadDocument = uploadDocument;
const reportVisit = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { hospitalName, date, type, description } = req.body;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const patient = await prisma_1.default.patientProfile.findUnique({ where: { userId } });
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        // Add a timeline event
        const newEvent = await prisma_1.default.timelineEvent.create({
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
            await (0, score_controller_1.calculateScoreLogic)(userId);
        }
        catch (e) {
            console.error('Score recalculation failed:', e);
        }
        res.json({ message: 'Visit reported successfully', event: newEvent });
    }
    catch (err) {
        console.error('Error reporting visit:', err);
        res.status(500).json({ error: 'Failed to report visit' });
    }
};
exports.reportVisit = reportVisit;
const completeTask = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { taskId, points, type, description, title } = req.body;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const patient = await prisma_1.default.patientProfile.findUnique({ where: { userId } });
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        // Add a timeline event for the completed task
        const newEvent = await prisma_1.default.timelineEvent.create({
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
            await (0, score_controller_1.calculateScoreLogic)(userId);
        }
        catch (e) {
            console.error('Score recalculation failed:', e);
        }
        res.json({ message: 'Task completed successfully', event: newEvent });
    }
    catch (err) {
        console.error('Error completing task:', err);
        res.status(500).json({ error: 'Failed to complete task' });
    }
};
exports.completeTask = completeTask;
const getAvailableActivities = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const patient = await prisma_1.default.patientProfile.findUnique({ where: { userId } });
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
    }
    catch (err) {
        console.error('Error fetching activities:', err);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
};
exports.getAvailableActivities = getAvailableActivities;
