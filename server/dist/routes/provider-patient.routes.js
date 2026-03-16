"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const provider_patient_controller_1 = require("../controllers/provider-patient.controller");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/provider/patients
 * @desc    Create a new patient
 * @access  Provider, Super Admin
 */
router.post('/', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.CREATE_PATIENTS), provider_patient_controller_1.createPatient);
/**
 * @route   GET /api/provider/patients
 * @desc    Get all patients with pagination and filtering
 * @access  Provider, Financial Admin, Billing Staff, Super Admin
 */
router.get('/', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.VIEW_PATIENTS), provider_patient_controller_1.getPatients);
/**
 * @route   GET /api/provider/patients/:id
 * @desc    Get patient by ID
 * @access  Provider, Financial Admin, Billing Staff, Super Admin
 */
router.get('/:id', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.VIEW_PATIENTS), provider_patient_controller_1.getPatient);
/**
 * @route   PUT /api/provider/patients/:id
 * @desc    Update patient information
 * @access  Provider, Super Admin
 */
router.put('/:id', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.UPDATE_PATIENTS), provider_patient_controller_1.updatePatient);
/**
 * @route   GET /api/provider/patients/:id/history
 * @desc    Get patient version history
 * @access  Provider, Financial Admin, Super Admin
 */
router.get('/:id/history', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.VIEW_PATIENTS), provider_patient_controller_1.getPatientHistory);
exports.default = router;
