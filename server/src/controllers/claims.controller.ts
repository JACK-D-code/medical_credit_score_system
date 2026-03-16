import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { calculateScoreLogic } from './score.controller';
import { io } from '../index';

export const submitCreditClaim = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { claimType, description, documentUrl, phid } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!phid) {
            res.status(400).json({ error: 'PH-ID Account verification is strictly required to submit claims.' });
            return;
        }

        const profile = await prisma.patientProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            res.status(404).json({ error: 'Patient profile not found' });
            return;
        }

        if (profile.healthId !== phid) {
            res.status(403).json({ error: 'Unauthorized: The provided PH-ID does not match your active account.' });
            return;
        }

        const claim = await prisma.creditClaimRequest.create({
            data: {
                patientId: profile.id,
                claimType,
                description,
                documentUrl,
                status: 'pending'
            }
        });

        res.status(201).json(claim);
    } catch (error) {
        console.error('Error submitting credit claim:', error);
        res.status(500).json({ error: 'Failed to submit credit claim' });
    }
};

export const submitOfferApplication = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { offerType, amount, description, phid } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!phid) {
            res.status(400).json({ error: 'PH-ID Account verification is strictly required to apply for offers/EMIs.' });
            return;
        }

        const profile = await prisma.patientProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            res.status(404).json({ error: 'Patient profile not found' });
            return;
        }

        if (profile.healthId !== phid) {
            res.status(403).json({ error: 'Unauthorized: The provided PH-ID does not match your active account.' });
            return;
        }

        const application = await prisma.offerApplication.create({
            data: {
                patientId: profile.id,
                offerType,
                amount,
                description,
                status: 'pending'
            }
        });

        res.status(201).json(application);
    } catch (error) {
        console.error('Error submitting offer application:', error);
        res.status(500).json({ error: 'Failed to submit offer application' });
    }
};

export const getMyClaimsAndOffers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const profile = await prisma.patientProfile.findUnique({
            where: { userId }
        });

        if (!profile) {
            res.status(404).json({ error: 'Patient profile not found' });
            return;
        }

        const claims = await prisma.creditClaimRequest.findMany({
            where: { patientId: profile.id },
            orderBy: { createdAt: 'desc' }
        });

        const offers = await prisma.offerApplication.findMany({
            where: { patientId: profile.id },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ claims, offers });
    } catch (error) {
        console.error('Error fetching claims and offers:', error);
        res.status(500).json({ error: 'Failed to fetch claims and offers' });
    }
};

// Admin Endpoints
export const getAllPendingRequests = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Ensure user is Provider or Admin
        if (req.user?.role !== 'PROVIDER' && req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        const claims = await prisma.creditClaimRequest.findMany({
            where: { status: 'pending' },
            include: {
                patient: {
                    select: { firstName: true, lastName: true, healthId: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const offers = await prisma.offerApplication.findMany({
            where: { status: 'pending' },
            include: {
                patient: {
                    select: { firstName: true, lastName: true, healthId: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ claims, offers });
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ error: 'Failed to fetch pending requests' });
    }
};

export const reviewCreditClaim = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, pointsAwarded, adminNotes } = req.body;
        const approverId = req.user?.id;

        if (req.user?.role !== 'PROVIDER' && req.user?.role !== 'ADMIN') {
             res.status(403).json({ error: 'Forbidden' });
             return;
        }

        const claim = await prisma.creditClaimRequest.update({
            where: { id: id as string },
            data: {
                status,
                pointsAwarded: pointsAwarded || 0,
                adminNotes,
                approvedBy: approverId
            },
            include: { patient: true }
        });

        if (status === 'approved' && pointsAwarded > 0) {
            // Update patient's providerGrantedPoints
            await prisma.patientProfile.update({
                where: { id: claim.patientId },
                data: {
                    providerGrantedPoints: {
                        increment: pointsAwarded
                    }
                }
            });
            
            // Also fetch the patient explicitly, because the return type of Prisma update seems not to infer `include: { patient: true }` correctly without typing.
            const patientRecord = await prisma.patientProfile.findUnique({
                where: { id: claim.patientId }
            });
            
            if (patientRecord) {
                 try {
                      await calculateScoreLogic(patientRecord.userId);
                      // Push real-time event to explicitly the patient who owns this PH-ID
                      io.to(`room_${patientRecord.healthId}`).emit('scoreUpdated', { 
                          message: 'Your Provider granted you points. Score updated!' 
                      });
                 } catch (e) {
                      console.error("Score recalculation failed after claim approval", e);
                 }
            }
        }

        res.json(claim);
    } catch (error) {
        console.error('Error reviewing credit claim:', error);
        res.status(500).json({ error: 'Failed to review credit claim' });
    }
};

export const reviewOfferApplication = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;
        const approverId = req.user?.id;

        if (req.user?.role !== 'PROVIDER' && req.user?.role !== 'ADMIN') {
             res.status(403).json({ error: 'Forbidden' });
             return;
        }

        const offer = await prisma.offerApplication.update({
            where: { id: id as string },
            data: {
                status,
                rejectionReason,
                approvedBy: approverId
            }
        });

        res.json(offer);
    } catch (error) {
        console.error('Error reviewing offer application:', error);
        res.status(500).json({ error: 'Failed to review offer application' });
    }
};
