import { PatientService } from '../patient.service';
import prisma from '../../utils/prisma';

// Mock Prisma client
jest.mock('../../utils/prisma', () => ({
  __esModule: true,
  default: {
    patient: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('PatientService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPatient', () => {
    it('should create a patient with required fields', async () => {
      const mockPatient = {
        id: 'patient-123',
        patientId: 'PAT12345678901',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        phone: '555-0100',
        email: 'john.doe@example.com',
        createdBy: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        bills: [],
        creditScores: [],
      };

      (prisma.patient.create as jest.Mock).mockResolvedValue(mockPatient);
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await PatientService.createPatient(
        {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date('1990-01-01'),
          phone: '555-0100',
          email: 'john.doe@example.com',
        },
        'user-123'
      );

      expect(prisma.patient.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            phone: '555-0100',
            email: 'john.doe@example.com',
            createdBy: 'user-123',
          }),
          include: expect.any(Object),
        })
      );

      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'create',
            resourceType: 'patient',
            resourceId: mockPatient.id,
            userId: 'user-123',
          }),
        })
      );

      expect(result).toEqual(mockPatient);
    });

    it('should create a patient with insurance information', async () => {
      const mockPatient = {
        id: 'patient-123',
        patientId: 'PAT12345678901',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: new Date('1985-05-15'),
        phone: '555-0200',
        insuranceProvider: 'Blue Cross',
        insurancePolicyNumber: 'BC123456',
        insuranceStatus: 'active',
        createdBy: 'user-123',
        bills: [],
        creditScores: [],
      };

      (prisma.patient.create as jest.Mock).mockResolvedValue(mockPatient);
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await PatientService.createPatient(
        {
          firstName: 'Jane',
          lastName: 'Smith',
          dateOfBirth: new Date('1985-05-15'),
          phone: '555-0200',
          insuranceProvider: 'Blue Cross',
          insurancePolicyNumber: 'BC123456',
          insuranceStatus: 'active',
        },
        'user-123'
      );

      expect(result.insuranceProvider).toBe('Blue Cross');
      expect(result.insurancePolicyNumber).toBe('BC123456');
      expect(result.insuranceStatus).toBe('active');
    });
  });

  describe('getPatientById', () => {
    it('should return patient with related data', async () => {
      const mockPatient = {
        id: 'patient-123',
        patientId: 'PAT12345678901',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        phone: '555-0100',
        bills: [
          {
            id: 'bill-1',
            billNumber: 'BILL001',
            totalAmount: 1000,
            status: 'pending',
          },
        ],
        creditScores: [
          {
            id: 'score-1',
            score: 720,
            riskLevel: 'low',
          },
        ],
        emiPlans: [],
        payments: [],
      };

      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(mockPatient);

      const result = await PatientService.getPatientById('patient-123');

      expect(prisma.patient.findUnique).toHaveBeenCalledWith({
        where: { id: 'patient-123' },
        include: expect.objectContaining({
          bills: expect.any(Object),
          creditScores: expect.any(Object),
          emiPlans: expect.any(Object),
          payments: expect.any(Object),
        }),
      });

      expect(result).toEqual(mockPatient);
    });

    it('should throw error if patient not found', async () => {
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(PatientService.getPatientById('nonexistent')).rejects.toThrow(
        'Patient not found'
      );
    });
  });

  describe('updatePatient', () => {
    it('should update patient and log version history', async () => {
      const oldPatient = {
        id: 'patient-123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-0100',
      };

      const updatedPatient = {
        id: 'patient-123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-0200',
        bills: [],
        creditScores: [],
      };

      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(oldPatient);
      (prisma.patient.update as jest.Mock).mockResolvedValue(updatedPatient);
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await PatientService.updatePatient(
        'patient-123',
        { phone: '555-0200' },
        'user-123'
      );

      expect(prisma.patient.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'patient-123' },
          data: expect.objectContaining({
            phone: '555-0200',
          }),
        })
      );

      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'update',
            resourceType: 'patient',
            resourceId: 'patient-123',
            userId: 'user-123',
            beforeData: JSON.stringify(oldPatient),
            afterData: JSON.stringify(updatedPatient),
          }),
        })
      );

      expect(result).toEqual(updatedPatient);
    });

    it('should throw error if patient not found', async () => {
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        PatientService.updatePatient('nonexistent', { phone: '555-0200' }, 'user-123')
      ).rejects.toThrow('Patient not found');
    });
  });

  describe('getPatients', () => {
    it('should return paginated patients', async () => {
      const mockPatients = [
        {
          id: 'patient-1',
          patientId: 'PAT001',
          firstName: 'John',
          lastName: 'Doe',
          creditScores: [],
          bills: [],
          emiPlans: [],
        },
        {
          id: 'patient-2',
          patientId: 'PAT002',
          firstName: 'Jane',
          lastName: 'Smith',
          creditScores: [],
          bills: [],
          emiPlans: [],
        },
      ];

      (prisma.patient.count as jest.Mock).mockResolvedValue(2);
      (prisma.patient.findMany as jest.Mock).mockResolvedValue(mockPatients);

      const result = await PatientService.getPatients({
        page: 1,
        limit: 20,
      });

      expect(result).toEqual({
        patients: mockPatients,
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should filter patients by search term', async () => {
      const mockPatients = [
        {
          id: 'patient-1',
          patientId: 'PAT001',
          firstName: 'John',
          lastName: 'Doe',
          creditScores: [],
          bills: [],
          emiPlans: [],
        },
      ];

      (prisma.patient.count as jest.Mock).mockResolvedValue(1);
      (prisma.patient.findMany as jest.Mock).mockResolvedValue(mockPatients);

      await PatientService.getPatients({
        search: 'John',
        page: 1,
        limit: 20,
      });

      expect(prisma.patient.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { firstName: { contains: 'John', mode: 'insensitive' } },
              { lastName: { contains: 'John', mode: 'insensitive' } },
            ]),
          }),
        })
      );
    });

    it('should filter patients by insurance status', async () => {
      (prisma.patient.count as jest.Mock).mockResolvedValue(1);
      (prisma.patient.findMany as jest.Mock).mockResolvedValue([]);

      await PatientService.getPatients({
        insuranceStatus: 'active',
        page: 1,
        limit: 20,
      });

      expect(prisma.patient.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            insuranceStatus: 'active',
          }),
        })
      );
    });

    it('should sort patients by specified field', async () => {
      (prisma.patient.count as jest.Mock).mockResolvedValue(2);
      (prisma.patient.findMany as jest.Mock).mockResolvedValue([]);

      await PatientService.getPatients({
        sortBy: 'lastName',
        sortOrder: 'asc',
        page: 1,
        limit: 20,
      });

      expect(prisma.patient.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { lastName: 'asc' },
        })
      );
    });
  });

  describe('getPatientHistory', () => {
    it('should return patient version history', async () => {
      const mockHistory = [
        {
          id: 'log-1',
          action: 'update',
          resourceType: 'patient',
          resourceId: 'patient-123',
          beforeData: JSON.stringify({ phone: '555-0100' }),
          afterData: JSON.stringify({ phone: '555-0200' }),
          createdAt: new Date(),
          user: {
            id: 'user-123',
            email: 'provider@example.com',
            firstName: 'Dr.',
            lastName: 'Smith',
            role: 'provider',
          },
        },
        {
          id: 'log-2',
          action: 'create',
          resourceType: 'patient',
          resourceId: 'patient-123',
          beforeData: null,
          afterData: JSON.stringify({ firstName: 'John', lastName: 'Doe' }),
          createdAt: new Date(),
          user: {
            id: 'user-123',
            email: 'provider@example.com',
            firstName: 'Dr.',
            lastName: 'Smith',
            role: 'provider',
          },
        },
      ];

      (prisma.auditLog.findMany as jest.Mock).mockResolvedValue(mockHistory);

      const result = await PatientService.getPatientHistory('patient-123');

      expect(prisma.auditLog.findMany).toHaveBeenCalledWith({
        where: {
          resourceType: 'patient',
          resourceId: 'patient-123',
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

      expect(result).toEqual(mockHistory);
      expect(result).toHaveLength(2);
    });
  });
});
