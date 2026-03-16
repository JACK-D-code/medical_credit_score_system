"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const router = (0, express_1.Router)();
/**
 * Example Protected Routes with RBAC
 *
 * This file demonstrates how to use the RBAC middleware to protect routes
 * based on user roles and permissions.
 */
// ============================================================================
// Patient Management Routes
// ============================================================================
/**
 * Create a new patient
 * Requires: CREATE_PATIENTS permission
 * Allowed roles: Super Admin, Provider
 */
router.post('/patients', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.CREATE_PATIENTS), (req, res) => {
    res.json({ message: 'Patient created successfully' });
});
/**
 * Get all patients
 * Requires: VIEW_PATIENTS permission
 * Allowed roles: All roles
 */
router.get('/patients', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.VIEW_PATIENTS), (req, res) => {
    res.json({ message: 'List of patients' });
});
/**
 * Update a patient
 * Requires: UPDATE_PATIENTS permission
 * Allowed roles: Super Admin, Provider
 */
router.put('/patients/:id', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.UPDATE_PATIENTS), (req, res) => {
    res.json({ message: 'Patient updated successfully' });
});
/**
 * Delete a patient
 * Requires: DELETE_PATIENTS permission
 * Allowed roles: Super Admin only
 */
router.delete('/patients/:id', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.DELETE_PATIENTS), (req, res) => {
    res.json({ message: 'Patient deleted successfully' });
});
// ============================================================================
// Bill Management Routes
// ============================================================================
/**
 * Create a new bill
 * Requires: CREATE_BILLS permission
 * Allowed roles: Super Admin, Provider
 */
router.post('/bills', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.CREATE_BILLS), (req, res) => {
    res.json({ message: 'Bill created successfully' });
});
/**
 * Get all bills
 * Requires: VIEW_BILLS permission
 * Allowed roles: All roles
 */
router.get('/bills', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.VIEW_BILLS), (req, res) => {
    res.json({ message: 'List of bills' });
});
/**
 * Update a bill
 * Requires: Both VIEW_BILLS and UPDATE_BILLS permissions
 * Allowed roles: Super Admin, Provider, Billing Staff
 */
router.put('/bills/:id', auth_1.authenticateToken, (0, rbac_1.requireAllPermissions)([rbac_1.Permission.VIEW_BILLS, rbac_1.Permission.UPDATE_BILLS]), (req, res) => {
    res.json({ message: 'Bill updated successfully' });
});
// ============================================================================
// Credit Scoring Routes
// ============================================================================
/**
 * Calculate credit score
 * Requires: CALCULATE_CREDIT_SCORE permission
 * Allowed roles: Super Admin, Financial Admin
 */
router.post('/credit-scores/calculate', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.CALCULATE_CREDIT_SCORE), (req, res) => {
    res.json({ message: 'Credit score calculated successfully' });
});
/**
 * View credit score
 * Requires: VIEW_CREDIT_SCORE permission
 * Allowed roles: Super Admin, Financial Admin, Provider
 */
router.get('/credit-scores/:id', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.VIEW_CREDIT_SCORE), (req, res) => {
    res.json({ message: 'Credit score details' });
});
// ============================================================================
// EMI Plan Routes
// ============================================================================
/**
 * Create EMI plan
 * Requires: CREATE_EMI_PLANS permission
 * Allowed roles: Super Admin, Financial Admin
 */
router.post('/emi-plans', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.CREATE_EMI_PLANS), (req, res) => {
    res.json({ message: 'EMI plan created successfully' });
});
/**
 * Approve EMI plan
 * Requires: APPROVE_EMI_PLANS permission
 * Allowed roles: Super Admin, Financial Admin
 *
 * Alternative approach using role-based guard:
 */
router.post('/emi-plans/:id/approve', auth_1.authenticateToken, (0, rbac_1.requireAnyRole)([rbac_1.UserRole.SUPER_ADMIN, rbac_1.UserRole.FINANCIAL_ADMIN]), (req, res) => {
    res.json({ message: 'EMI plan approved successfully' });
});
/**
 * View EMI plans
 * Requires: VIEW_EMI_PLANS permission
 * Allowed roles: All roles
 */
router.get('/emi-plans', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.VIEW_EMI_PLANS), (req, res) => {
    res.json({ message: 'List of EMI plans' });
});
// ============================================================================
// Payment Routes
// ============================================================================
/**
 * Record a payment
 * Requires: RECORD_PAYMENTS permission
 * Allowed roles: Super Admin, Billing Staff
 */
router.post('/payments', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.RECORD_PAYMENTS), (req, res) => {
    res.json({ message: 'Payment recorded successfully' });
});
/**
 * Process refund
 * Requires: PROCESS_REFUNDS permission
 * Allowed roles: Super Admin, Financial Admin
 */
router.post('/payments/:id/refund', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.PROCESS_REFUNDS), (req, res) => {
    res.json({ message: 'Refund processed successfully' });
});
// ============================================================================
// Admin Routes
// ============================================================================
/**
 * Manage users
 * Requires: MANAGE_USERS permission
 * Allowed roles: Super Admin only
 */
router.post('/users', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.MANAGE_USERS), (req, res) => {
    res.json({ message: 'User created successfully' });
});
/**
 * View audit logs
 * Requires: VIEW_AUDIT_LOGS permission
 * Allowed roles: Super Admin, Financial Admin
 */
router.get('/audit-logs', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.VIEW_AUDIT_LOGS), (req, res) => {
    res.json({ message: 'Audit logs' });
});
/**
 * View financial reports
 * Requires: Either VIEW_FINANCIAL_REPORTS or VIEW_DASHBOARD permission
 * Allowed roles: Super Admin, Financial Admin, Billing Staff
 */
router.get('/reports/financial', auth_1.authenticateToken, (0, rbac_1.requireAnyPermission)([
    rbac_1.Permission.VIEW_FINANCIAL_REPORTS,
    rbac_1.Permission.VIEW_DASHBOARD,
]), (req, res) => {
    res.json({ message: 'Financial reports' });
});
/**
 * System configuration
 * Requires: Super Admin role
 */
router.put('/system/config', auth_1.authenticateToken, (0, rbac_1.requireRole)(rbac_1.UserRole.SUPER_ADMIN), (req, res) => {
    res.json({ message: 'System configuration updated' });
});
// ============================================================================
// Dashboard Routes
// ============================================================================
/**
 * View dashboard
 * Requires: VIEW_DASHBOARD permission
 * Allowed roles: All roles
 */
router.get('/dashboard', auth_1.authenticateToken, (0, rbac_1.requirePermission)(rbac_1.Permission.VIEW_DASHBOARD), (req, res) => {
    res.json({ message: 'Dashboard data' });
});
exports.default = router;
