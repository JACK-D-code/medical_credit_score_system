"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const provider_service_1 = require("../services/provider.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const role_middleware_2 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
const providerService = new provider_service_1.ProviderService();
/**
 * @route   GET /api/providers/stats
 * @desc    Get provider dashboard statistics
 * @access  Private (Provider)
 */
router.get('/stats', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['PROVIDER']), async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const stats = await providerService.getProviderStats(providerId);
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   GET /api/providers/profile
 * @desc    Get provider profile
 * @access  Private (Provider)
 */
router.get('/profile', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['PROVIDER']), async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const profile = await providerService.getProviderProfile(providerId);
        res.json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   PUT /api/providers/profile
 * @desc    Update provider profile
 * @access  Private (Provider)
 */
router.put('/profile', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['PROVIDER']), async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const profileData = req.body;
        const updatedProfile = await providerService.updateProviderProfile(providerId, profileData);
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   GET /api/providers/patients
 * @desc    Get provider's patients
 * @access  Private (Provider)
 */
router.get('/patients', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['PROVIDER']), async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const filters = {
            search: req.query.search,
            loyaltyLevel: req.query.loyaltyLevel,
            status: req.query.status,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20
        };
        const patients = await providerService.getPatients(providerId, filters);
        res.json({
            success: true,
            data: patients
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   GET /api/providers/patients/:patientId
 * @desc    Get specific patient details
 * @access  Private (Provider)
 */
router.get('/patients/:patientId', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['PROVIDER']), role_middleware_2.canAccessPatientData, async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const patient = await providerService.getPatientById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                error: 'Patient not found'
            });
        }
        res.json({
            success: true,
            data: patient
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   POST /api/providers/patients
 * @desc    Add new patient
 * @access  Private (Provider)
 */
router.post('/patients', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['PROVIDER']), async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const patientData = {
            ...req.body,
            providerId
        };
        const patient = await providerService.addPatient(patientData);
        res.status(201).json({
            success: true,
            message: 'Patient added successfully',
            data: patient
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   GET /api/providers/appointments/today
 * @desc    Get today's appointments
 * @access  Private (Provider)
 */
router.get('/appointments/today', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['PROVIDER']), async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const appointments = await providerService.getTodayAppointments(providerId);
        res.json({
            success: true,
            data: appointments
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   POST /api/providers/evaluations
 * @desc    Submit new evaluation
 * @access  Private (Provider)
 */
router.post('/evaluations', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['PROVIDER']), async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const evaluationData = {
            ...req.body,
            providerId
        };
        const evaluation = await providerService.submitEvaluation(evaluationData);
        res.status(201).json({
            success: true,
            message: 'Evaluation submitted successfully',
            data: evaluation
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   GET /api/providers/analytics/revenue
 * @desc    Get revenue analytics
 * @access  Private (Provider)
 */
router.get('/analytics/revenue', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['PROVIDER']), async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const period = req.query.period || 'monthly';
        const analytics = await providerService.getRevenueAnalytics(providerId, period);
        res.json({
            success: true,
            data: analytics
        });
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
