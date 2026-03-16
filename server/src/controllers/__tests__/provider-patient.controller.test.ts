import request from 'supertest';
import express, { Express } from 'express';
import providerPatientRoutes from '../../routes/provider-patient.routes';
import { PatientService } from '../../services/patient.service';
import { AuthService } from '../../services/auth.service';

// Mock services
jest.mock('../../services/patient.service');
jest.mock('../../services/auth.service');

const app: Express = express();
app.use(express.json());
app.use('/api/provider/patients', providerPatientRoutes);

describe('Provider Patient Controller', () => {
  let mockToken: string;
  let mockUserId: string;

  beforeEach(() => {
    jest.clearAllMocks();
    mockToken = 'mock-jwt-token';
    mockUserId = 'user-123';

    // Mock authentication
    (AuthService.verifyToken as jest.Mock).mockReturnValue({
      id: mockUserId,
      email: 'provider@example.com',
      role: 'provider',
    });
    (AuthService.validateSession as jest.Mock).mockResolvedValue(true);
  });

  describe('POST /api/provider/patients', () => {
    it('should create a new patient with required fields', async () => {
      const mockPatient = {
        id: 'patient-123',
        patientId: 'PAT12345678901',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        phone: '555-0100',
        email: 'john.doe@example.com',
        createdBy: mockUserId,
        bills: [],
        creditScores: [],
      };

      (PatientService.createPatient as jest.Mock).mockResolvedValue(mockPatient);

      const response = await request(app)
        .post('/api/provider/patients')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phone: '555-0100',
          email: 'john.doe@example.com',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Patient created successfully');
      expect(response.body.patient).toEqual(mockPatient);
      expect(PatientService.createPatient).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          phone: '555-0100',
          email: 'john.doe@example.com',
        }),
        mockUserId
      );
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/provider/patients')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          firstName: 'John',
          // Missing lastName, dateOfBirth, phone
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');
    });

    it('should return 400 for invalid insurance status', async () => {
      const response = await request(app)
        .post('/api/provider/patients')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phone: '555-0100',
          insuranceStatus: 'invalid-status',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid insurance status');
    });

    it('should return 401 if not authenticated', async () => {
      (AuthService.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid or expired token');
      });

      const response = await request(app)
        .post('/api/provider/patients')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          phone: '555-0100',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/provider/patients/:id', () => {
    it('should return patient by ID', async () => {
      const mockPatient = {
        id: 'patient-123',
        patientId: 'PAT12345678901',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        phone: '555-0100',
        bills: [],
        creditScores: [],
        emiPlans: [],
        payments: [],
      };

      (PatientService.getPatientById as jest.Mock).mockResolvedValue(mockPatient);

      const response = await request(app)
        .get('/api/provider/patients/patient-123')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.patient).toEqual(mockPatient);
      expect(PatientService.getPatientById).toHaveBeenCalledWith('patient-123');
    });

    it('should return 404 if patient not found', async () => {
      (PatientService.getPatientById as jest.Mock).mockRejectedValue(
        new Error('Patient not found')
      );

      const response = await request(app)
        .get('/api/provider/patients/nonexistent')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Patient not found');
    });
  });

  describe('PUT /api/provider/patients/:id', () => {
    it('should update patient information', async () => {
      const mockUpdatedPatient = {
        id: 'patient-123',
        patientId: 'PAT12345678901',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-0200',
        bills: [],
        creditScores: [],
      };

      (PatientService.updatePatient as jest.Mock).mockResolvedValue(mockUpdatedPatient);

      const response = await request(app)
        .put('/api/provider/patients/patient-123')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          phone: '555-0200',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Patient updated successfully');
      expect(response.body.patient.phone).toBe('555-0200');
      expect(PatientService.updatePatient).toHaveBeenCalledWith(
        'patient-123',
        expect.objectContaining({ phone: '555-0200' }),
        mockUserId
      );
    });

    it('should return 400 for invalid insurance status', async () => {
      const response = await request(app)
        .put('/api/provider/patients/patient-123')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          insuranceStatus: 'invalid-status',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid insurance status');
    });

    it('should return 404 if patient not found', async () => {
      (PatientService.updatePatient as jest.Mock).mockRejectedValue(
        new Error('Patient not found')
      );

      const response = await request(app)
        .put('/api/provider/patients/nonexistent')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          phone: '555-0200',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Patient not found');
    });
  });

  describe('GET /api/provider/patients', () => {
    it('should return paginated patients', async () => {
      const mockResult = {
        patients: [
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
        ],
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      };

      (PatientService.getPatients as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .get('/api/provider/patients')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.patients).toHaveLength(2);
      expect(response.body.total).toBe(2);
      expect(response.body.page).toBe(1);
    });

    it('should filter patients by search term', async () => {
      const mockResult = {
        patients: [
          {
            id: 'patient-1',
            patientId: 'PAT001',
            firstName: 'John',
            lastName: 'Doe',
            creditScores: [],
            bills: [],
            emiPlans: [],
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };

      (PatientService.getPatients as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .get('/api/provider/patients?search=John')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(PatientService.getPatients).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'John',
        })
      );
    });

    it('should filter patients by insurance status', async () => {
      const mockResult = {
        patients: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      };

      (PatientService.getPatients as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .get('/api/provider/patients?insuranceStatus=active')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(PatientService.getPatients).toHaveBeenCalledWith(
        expect.objectContaining({
          insuranceStatus: 'active',
        })
      );
    });
  });

  describe('GET /api/provider/patients/:id/history', () => {
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
      ];

      (PatientService.getPatientHistory as jest.Mock).mockResolvedValue(mockHistory);

      const response = await request(app)
        .get('/api/provider/patients/patient-123/history')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.history).toHaveLength(1);
      expect(response.body.history[0].action).toBe('update');
      expect(PatientService.getPatientHistory).toHaveBeenCalledWith('patient-123');
    });
  });
});
