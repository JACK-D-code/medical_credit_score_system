import { Router } from 'express';
import {
  createPatient,
  getPatient,
  updatePatient,
  getPatients,
  getPatientHistory,
} from '../controllers/provider-patient.controller';
import { authenticateToken } from '../middleware/auth';
import { requirePermission, Permission } from '../middleware/rbac';

const router = Router();

/**
 * @route   POST /api/provider/patients
 * @desc    Create a new patient
 * @access  Provider, Super Admin
 */
router.post(
  '/',
  authenticateToken,
  requirePermission(Permission.CREATE_PATIENTS),
  createPatient
);

/**
 * @route   GET /api/provider/patients
 * @desc    Get all patients with pagination and filtering
 * @access  Provider, Financial Admin, Billing Staff, Super Admin
 */
router.get(
  '/',
  authenticateToken,
  requirePermission(Permission.VIEW_PATIENTS),
  getPatients
);

/**
 * @route   GET /api/provider/patients/:id
 * @desc    Get patient by ID
 * @access  Provider, Financial Admin, Billing Staff, Super Admin
 */
router.get(
  '/:id',
  authenticateToken,
  requirePermission(Permission.VIEW_PATIENTS),
  getPatient
);

/**
 * @route   PUT /api/provider/patients/:id
 * @desc    Update patient information
 * @access  Provider, Super Admin
 */
router.put(
  '/:id',
  authenticateToken,
  requirePermission(Permission.UPDATE_PATIENTS),
  updatePatient
);

/**
 * @route   GET /api/provider/patients/:id/history
 * @desc    Get patient version history
 * @access  Provider, Financial Admin, Super Admin
 */
router.get(
  '/:id/history',
  authenticateToken,
  requirePermission(Permission.VIEW_PATIENTS),
  getPatientHistory
);

export default router;
