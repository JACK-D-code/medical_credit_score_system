import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export const getPatientProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;

        // Ensure users can only fetch their own profile unless they are a provider
        if (req.user?.role === 'PATIENT' && req.user.id !== id) {
            res.status(403).json({ error: 'Unauthorized to view this profile' });
            return;
        }

        const patient = await prisma.patientProfile.findUnique({
            where: { userId: id },
            include: {
                financialProfile: true,
                creditScores: {
                    orderBy: { calculatedAt: 'desc' },
                    take: 5
                }
            }
        });

        if (!patient) {
            res.status(404).json({ error: 'Patient profile not found' });
            return;
        }

        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching patient profile' });
    }
};

export const updatePatientProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;

        if (req.user?.role !== 'PATIENT' || req.user.id !== id) {
            res.status(403).json({ error: 'Unauthorized to update this profile' });
            return;
        }

        const {
            firstName, lastName, age, bmi, bloodPressureSys, bloodPressureDia, cholesterol, smoking, exerciseHours,
            annualIncome, creditHistory
        } = req.body;

        const updatedProfile = await prisma.$transaction(async (tx: any) => {
            const patient = await tx.patientProfile.update({
                where: { userId: id },
                data: {
                    firstName, lastName, age, bmi, bloodPressureSys, bloodPressureDia, cholesterol, smoking, exerciseHours
                }
            });

            // Upsert financial profile
            const financial = await tx.financialProfile.upsert({
                where: { patientId: patient.id },
                update: { annualIncome, creditHistory },
                create: { patientId: patient.id, annualIncome: annualIncome || 0, creditHistory: creditHistory || 300 }
            });

            return { patient, financial };
        });

        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile data' });
    }
};

export const requestPhid = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) { 
            res.status(401).json({ error: 'Unauthorized' }); 
            return; 
        }

        await prisma.patientProfile.update({
            where: { userId },
            data: { phidRequestStatus: 'REQUESTED' } as any
        });

        res.json({ message: 'PH-ID access code requested successfully' });
    } catch (error) {
        console.error('Error requesting PHID:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
