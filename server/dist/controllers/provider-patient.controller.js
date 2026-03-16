"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatientHistory = exports.getPatients = exports.updatePatient = exports.getPatient = exports.createPatient = void 0;
const patient_service_1 = require("../services/patient.service");
/**
 * Create a new patient
 * POST /api/patients
 */
const createPatient = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const { firstName, lastName, dateOfBirth, gender, email, phone, address, city, state, zipCode, insuranceProvider, insurancePolicyNumber, insuranceGroupNumber, insuranceStatus, medicalHistoryEncrypted, allergiesEncrypted, relationshipStartDate, referralSource, } = req.body;
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
        const patient = await patient_service_1.PatientService.createPatient({
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
        }, req.user.id);
        res.status(201).json({
            message: 'Patient created successfully',
            patient,
        });
    }
    catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({
            error: 'Failed to create patient',
            details: error.message,
        });
    }
};
exports.createPatient = createPatient;
/**
 * Get patient by ID
 * GET /api/patients/:id
 */
const getPatient = async (req, res) => {
    try {
        const id = req.params.id;
        const patient = await patient_service_1.PatientService.getPatientById(id);
        res.json({
            patient,
        });
    }
    catch (error) {
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
exports.getPatient = getPatient;
/**
 * Update patient information
 * PUT /api/patients/:id
 */
const updatePatient = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const id = req.params.id;
        const { firstName, lastName, dateOfBirth, gender, email, phone, address, city, state, zipCode, insuranceProvider, insurancePolicyNumber, insuranceGroupNumber, insuranceStatus, insuranceVerifiedAt, medicalHistoryEncrypted, allergiesEncrypted, referralSource, } = req.body;
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
        const updateData = {};
        if (firstName !== undefined)
            updateData.firstName = firstName;
        if (lastName !== undefined)
            updateData.lastName = lastName;
        if (dateOfBirth !== undefined)
            updateData.dateOfBirth = new Date(dateOfBirth);
        if (gender !== undefined)
            updateData.gender = gender;
        if (email !== undefined)
            updateData.email = email;
        if (phone !== undefined)
            updateData.phone = phone;
        if (address !== undefined)
            updateData.address = address;
        if (city !== undefined)
            updateData.city = city;
        if (state !== undefined)
            updateData.state = state;
        if (zipCode !== undefined)
            updateData.zipCode = zipCode;
        if (insuranceProvider !== undefined)
            updateData.insuranceProvider = insuranceProvider;
        if (insurancePolicyNumber !== undefined)
            updateData.insurancePolicyNumber = insurancePolicyNumber;
        if (insuranceGroupNumber !== undefined)
            updateData.insuranceGroupNumber = insuranceGroupNumber;
        if (insuranceStatus !== undefined)
            updateData.insuranceStatus = insuranceStatus;
        if (insuranceVerifiedAt !== undefined)
            updateData.insuranceVerifiedAt = new Date(insuranceVerifiedAt);
        if (medicalHistoryEncrypted !== undefined)
            updateData.medicalHistoryEncrypted = medicalHistoryEncrypted;
        if (allergiesEncrypted !== undefined)
            updateData.allergiesEncrypted = allergiesEncrypted;
        if (referralSource !== undefined)
            updateData.referralSource = referralSource;
        const patient = await patient_service_1.PatientService.updatePatient(id, updateData, req.user.id);
        res.json({
            message: 'Patient updated successfully',
            patient,
        });
    }
    catch (error) {
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
exports.updatePatient = updatePatient;
/**
 * Get patients with pagination and filtering
 * GET /api/patients
 */
const getPatients = async (req, res) => {
    try {
        const { search, insuranceStatus, city, state, page, limit, sortBy, sortOrder, } = req.query;
        const filters = {
            search: search,
            insuranceStatus: insuranceStatus,
            city: city,
            state: state,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            sortBy: sortBy,
            sortOrder: sortOrder,
        };
        const result = await patient_service_1.PatientService.getPatients(filters);
        res.json(result);
    }
    catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({
            error: 'Failed to fetch patients',
            details: error.message,
        });
    }
};
exports.getPatients = getPatients;
/**
 * Get patient version history
 * GET /api/patients/:id/history
 */
const getPatientHistory = async (req, res) => {
    try {
        const id = req.params.id;
        const history = await patient_service_1.PatientService.getPatientHistory(id);
        res.json({
            history,
        });
    }
    catch (error) {
        console.error('Error fetching patient history:', error);
        res.status(500).json({
            error: 'Failed to fetch patient history',
            details: error.message,
        });
    }
};
exports.getPatientHistory = getPatientHistory;
