"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const credit_score_service_1 = require("../services/credit-score.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
const creditScoreService = new credit_score_service_1.CreditScoreService();
/**
 * @route   GET /api/credit-scores/patient/:patientId
 * @desc    Get current credit score for a patient
 * @access  Private (Patient, Provider, Admin)
 */
router.get('/patient/:patientId', auth_middleware_1.authMiddleware, async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const currentScore = await creditScoreService.getCurrentCreditScore(patientId);
        if (!currentScore) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Credit score not found for this patient'
            });
        }
        res.json({
            success: true,
            data: currentScore
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   GET /api/credit-scores/patient/:patientId/history
 * @desc    Get credit score history for a patient
 * @access  Private (Patient, Provider, Admin)
 */
router.get('/patient/:patientId/history', auth_middleware_1.authMiddleware, async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const { limit = 12 } = req.query;
        const history = await creditScoreService.getCreditScoreHistory(patientId, parseInt(limit));
        res.json({
            success: true,
            data: history
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   POST /api/credit-scores/calculate/:patientId
 * @desc    Calculate credit score for a patient
 * @access  Private (Provider, Admin)
 */
router.post('/calculate/:patientId', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['PROVIDER', 'ADMIN']), async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const calculation = await creditScoreService.calculateCreditScore(patientId);
        res.json({
            success: true,
            message: 'Credit score calculated successfully',
            data: calculation
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   GET /api/credit-scores/patient/:patientId/factors
 * @desc    Get score factors for a patient
 * @access  Private (Patient, Provider, Admin)
 */
router.get('/patient/:patientId/factors', auth_middleware_1.authMiddleware, async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const factors = await creditScoreService.getScoreFactors(patientId);
        res.json({
            success: true,
            data: factors
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   GET /api/credit-scores/patient/:patientId/suggestions
 * @desc    Get score improvement suggestions for a patient
 * @access  Private (Patient, Provider, Admin)
 */
router.get('/patient/:patientId/suggestions', auth_middleware_1.authMiddleware, async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const suggestions = await creditScoreService.getScoreImprovementSuggestions(patientId);
        res.json({
            success: true,
            data: suggestions
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   GET /api/credit-scores/distribution
 * @desc    Get credit score distribution across all patients
 * @access  Private (Admin)
 */
router.get('/distribution', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['ADMIN']), async (req, res, next) => {
    try {
        const distribution = await creditScoreService.getCreditScoreDistribution();
        res.json({
            success: true,
            data: distribution
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   GET /api/credit-scores/analytics
 * @desc    Get credit score analytics
 * @access  Private (Admin)
 */
router.get('/analytics', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['ADMIN']), async (req, res, next) => {
    try {
        // This would include more detailed analytics
        // For now, return basic distribution
        const distribution = await creditScoreService.getCreditScoreDistribution();
        const analytics = {
            distribution,
            totalPatients: distribution.reduce((sum, item) => sum + item.count, 0),
            averageScore: 0, // Would calculate from database
            scoreRanges: {
                excellent: distribution.find(d => d.category === 'EXCELLENT')?.count || 0,
                good: distribution.find(d => d.category === 'GOOD')?.count || 0,
                average: distribution.find(d => d.category === 'AVERAGE')?.count || 0,
                low: distribution.find(d => d.category === 'LOW')?.count || 0
            }
        };
        res.json({
            success: true,
            data: analytics
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   POST /api/credit-scores/bulk-calculate
 * @desc    Calculate credit scores for multiple patients
 * @access  Private (Admin)
 */
router.post('/bulk-calculate', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['ADMIN']), async (req, res, next) => {
    try {
        const { patientIds } = req.body;
        if (!Array.isArray(patientIds) || patientIds.length === 0) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Patient IDs array is required'
            });
        }
        const results = [];
        for (const patientId of patientIds) {
            try {
                const calculation = await creditScoreService.calculateCreditScore(patientId);
                results.push({
                    patientId,
                    success: true,
                    data: calculation
                });
            }
            catch (error) {
                results.push({
                    patientId,
                    success: false,
                    error: error.message
                });
            }
        }
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        res.json({
            success: true,
            message: `Processed ${patientIds.length} patients. Success: ${successful}, Failed: ${failed}`,
            data: results
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   GET /api/credit-scores/category/:category
 * @desc    Get patients by credit score category
 * @access  Private (Provider, Admin)
 */
router.get('/category/:category', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['PROVIDER', 'ADMIN']), async (req, res, next) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 20 } = req.query;
        // This would query the database for patients by score category
        // For now, return mock data
        const patients = {
            patients: [],
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: 0,
                pages: 0
            }
        };
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
 * @route   POST /api/credit-scores/update-from-activity
 * @desc    Update credit score based on new activity
 * @access  Private (System)
 */
router.post('/update-from-activity', async (req, res, next) => {
    try {
        const activity = req.body;
        await creditScoreService.updateScoreFromActivity(activity);
        res.json({
            success: true,
            message: 'Credit score updated from activity'
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * @route   GET /api/credit-scores/summary
 * @desc    Get credit score summary for dashboard
 * @access  Private (Admin)
 */
router.get('/summary', auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(['ADMIN']), async (req, res, next) => {
    try {
        const distribution = await creditScoreService.getCreditScoreDistribution();
        const summary = {
            totalPatients: distribution.reduce((sum, item) => sum + item.count, 0),
            averageScore: 0, // Would calculate from database
            scoreDistribution: distribution,
            recentCalculations: 0, // Would get from database
            pendingEvaluations: 0 // Would get from database
        };
        res.json({
            success: true,
            data: summary
        });
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
