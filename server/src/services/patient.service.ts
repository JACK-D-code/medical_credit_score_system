import prisma from '../utils/prisma';
import { Prisma } from '@prisma/client';

export interface CreatePatientInput {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender?: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceGroupNumber?: string;
  insuranceStatus?: string;
  medicalHistoryEncrypted?: string;
  allergiesEncrypted?: string;
  relationshipStartDate?: Date;
  referralSource?: string;
}

export interface UpdatePatientInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceGroupNumber?: string;
  insuranceStatus?: string;
  insuranceVerifiedAt?: Date;
  medicalHistoryEncrypted?: string;
  allergiesEncrypted?: string;
  referralSource?: string;
}

export interface PatientFilters {
  search?: string;
  insuranceStatus?: string;
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class PatientService {
  /**
   * Generate unique patient ID
   */
  private static async generatePatientId(): Promise<string> {
    const prefix = 'PAT';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Create a new patient
   */
  static async createPatient(
    data: CreatePatientInput,
    createdBy: string
  ): Promise<any> {
    const patientId = await this.generatePatientId();

    const patient = await prisma.patient.create({
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
  static async getPatientById(id: string): Promise<any> {
    const patient = await prisma.patient.findUnique({
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
  static async updatePatient(
    id: string,
    data: UpdatePatientInput,
    updatedBy: string
  ): Promise<any> {
    // Get old patient data for version history
    const oldPatient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!oldPatient) {
      throw new Error('Patient not found');
    }

    const updatedPatient = await prisma.patient.update({
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
  static async getPatients(filters: PatientFilters): Promise<{
    patients: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      search,
      insuranceStatus,
      city,
      state,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    // Build where clause
    const where: Prisma.PatientWhereInput = {};

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
    const total = await prisma.patient.count({ where });

    // Get patients with pagination
    const patients = await prisma.patient.findMany({
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
  private static async logPatientHistory(
    patientId: string,
    action: 'CREATE' | 'UPDATE',
    oldData: any,
    newData: any,
    userId: string
  ): Promise<void> {
    await prisma.auditLog.create({
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
  static async getPatientHistory(patientId: string): Promise<any[]> {
    const history = await prisma.auditLog.findMany({
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
