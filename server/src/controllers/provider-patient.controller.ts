import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PatientService } from '../services/patient.service';

/**
 * Create a new patient
 * POST /api/patients
 */
export const createPatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      insuranceProvider,
      insurancePolicyNumber,
      insuranceGroupNumber,
      insuranceStatus,
      medicalHistoryEncrypted,
      allergiesEncrypted,
      relationshipStartDate,
      referralSource,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !phone) {
      res.status(400).json({
        error: 'Missing required fields',
        required: ['firstName', 'lastName', 'dateOfBirth', 'phone'],
      });
      return;
    }

    // Validate date of birth
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      res.status(400).json({ error: 'Invalid date of birth' });
      return;
    }

    // Validate insurance status if provided
    const validInsuranceStatuses = ['active', 'inactive', 'pending', 'expired'];
    if (insuranceStatus && !validInsuranceStatuses.includes(insuranceStatus)) {
      res.status(400).json({
        error: 'Invalid insurance status',
        validValues: validInsuranceStatuses,
      });
      return;
    }

    const patient = await PatientService.createPatient(
      {
        firstName,
        lastName,
        dateOfBirth: dob,
        gender,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        insuranceProvider,
        insurancePolicyNumber,
        insuranceGroupNumber,
        insuranceStatus,
        medicalHistoryEncrypted,
        allergiesEncrypted,
        relationshipStartDate: relationshipStartDate ? new Date(relationshipStartDate) : undefined,
        referralSource,
      },
      req.user.id
    );

    res.status(201).json({
      message: 'Patient created successfully',
      patient,
    });
  } catch (error: any) {
    console.error('Error creating patient:', error);
    res.status(500).json({
      error: 'Failed to create patient',
      details: error.message,
    });
  }
};

/**
 * Get patient by ID
 * GET /api/patients/:id
 */
export const getPatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const patient = await PatientService.getPatientById(id);

    res.json({
      patient,
    });
  } catch (error: any) {
    if (error.message === 'Patient not found') {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    console.error('Error fetching patient:', error);
    res.status(500).json({
      error: 'Failed to fetch patient',
      details: error.message,
    });
  }
};

/**
 * Update patient information
 * PUT /api/patients/:id
 */
export const updatePatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const id = req.params.id as string;
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      insuranceProvider,
      insurancePolicyNumber,
      insuranceGroupNumber,
      insuranceStatus,
      insuranceVerifiedAt,
      medicalHistoryEncrypted,
      allergiesEncrypted,
      referralSource,
    } = req.body;

    // Validate insurance status if provided
    const validInsuranceStatuses = ['active', 'inactive', 'pending', 'expired'];
    if (insuranceStatus && !validInsuranceStatuses.includes(insuranceStatus)) {
      res.status(400).json({
        error: 'Invalid insurance status',
        validValues: validInsuranceStatuses,
      });
      return;
    }

    // Build update data object
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = new Date(dateOfBirth);
    if (gender !== undefined) updateData.gender = gender;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (insuranceProvider !== undefined) updateData.insuranceProvider = insuranceProvider;
    if (insurancePolicyNumber !== undefined) updateData.insurancePolicyNumber = insurancePolicyNumber;
    if (insuranceGroupNumber !== undefined) updateData.insuranceGroupNumber = insuranceGroupNumber;
    if (insuranceStatus !== undefined) updateData.insuranceStatus = insuranceStatus;
    if (insuranceVerifiedAt !== undefined) updateData.insuranceVerifiedAt = new Date(insuranceVerifiedAt);
    if (medicalHistoryEncrypted !== undefined) updateData.medicalHistoryEncrypted = medicalHistoryEncrypted;
    if (allergiesEncrypted !== undefined) updateData.allergiesEncrypted = allergiesEncrypted;
    if (referralSource !== undefined) updateData.referralSource = referralSource;

    const patient = await PatientService.updatePatient(id, updateData, req.user.id);

    res.json({
      message: 'Patient updated successfully',
      patient,
    });
  } catch (error: any) {
    if (error.message === 'Patient not found') {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    console.error('Error updating patient:', error);
    res.status(500).json({
      error: 'Failed to update patient',
      details: error.message,
    });
  }
};

/**
 * Get patients with pagination and filtering
 * GET /api/patients
 */
export const getPatients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      search,
      insuranceStatus,
      city,
      state,
      page,
      limit,
      sortBy,
      sortOrder,
    } = req.query;

    const filters = {
      search: search as string,
      insuranceStatus: insuranceStatus as string,
      city: city as string,
      state: state as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    };

    const result = await PatientService.getPatients(filters);

    res.json(result);
  } catch (error: any) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      error: 'Failed to fetch patients',
      details: error.message,
    });
  }
};

/**
 * Get patient version history
 * GET /api/patients/:id/history
 */
export const getPatientHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const history = await PatientService.getPatientHistory(id);

    res.json({
      history,
    });
  } catch (error: any) {
    console.error('Error fetching patient history:', error);
    res.status(500).json({
      error: 'Failed to fetch patient history',
      details: error.message,
    });
  }
};
