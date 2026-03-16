"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_middleware_1 = require("../middleware/role.middleware");
const phid_service_1 = __importDefault(require("../services/phid.service"));
const router = (0, express_1.Router)();
// Create new PHID (Admin/Provider only)
router.post('/create', async (req, res) => {
    try {
        // Ensure user is Provider or Admin
        if (req.user?.role !== 'PROVIDER' && req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Forbidden. Only Providers and Admins can create PHIDs.' });
            return;
        }
        const { patientId, firstName, lastName, dateOfBirth, bloodGroup, phone, address, emergencyContact } = req.body;
        if (!patientId || !firstName || !lastName || !dateOfBirth) {
            res.status(400).json({ error: 'Missing required patient information' });
            return;
        }
        const patientData = {
            id: patientId,
            firstName,
            lastName,
            dateOfBirth: new Date(dateOfBirth),
            bloodGroup,
            phone,
            address,
            emergencyContact,
            issuedBy: req.user.id
        };
        const phid = await phid_service_1.default.createPHID(patientData);
        res.json({
            success: true,
            phid,
            message: 'PHID created successfully'
        });
    }
    catch (error) {
        console.error('Error creating PHID:', error);
        res.status(500).json({ error: 'Failed to create PHID' });
    }
});
// Get patient data by PHID
router.get('/lookup/:phid', async (req, res) => {
    try {
        const { phid } = req.params;
        if (!phid) {
            res.status(400).json({ error: 'PHID is required' });
            return;
        }
        const patientData = await phid_service_1.default.getPatientByPHID(phid);
        res.json({
            success: true,
            patientData,
            message: 'Patient data loaded successfully'
        });
    }
    catch (error) {
        console.error('Error looking up PHID:', error);
        if (error.message.includes('Invalid or inactive PHID')) {
            res.status(404).json({ error: 'Invalid or inactive PHID' });
        }
        else if (error.message.includes('expired')) {
            res.status(400).json({ error: 'PHID has expired' });
        }
        else {
            res.status(500).json({ error: 'Failed to lookup PHID' });
        }
    }
});
// Get all PHIDs (Admin only)
router.get('/all', (0, role_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const phids = await phid_service_1.default.getAllPHIDs();
        res.json({
            success: true,
            phids,
            count: phids.length
        });
    }
    catch (error) {
        console.error('Error fetching PHIDs:', error);
        res.status(500).json({ error: 'Failed to fetch PHIDs' });
    }
});
// Update PHID status (Admin only)
router.patch('/:phid/status', (0, role_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const { phid } = req.params;
        const { isActive } = req.body;
        if (typeof isActive !== 'boolean') {
            res.status(400).json({ error: 'isActive must be a boolean' });
            return;
        }
        await phid_service_1.default.updatePHIDStatus(phid, isActive);
        res.json({
            success: true,
            message: `PHID ${isActive ? 'activated' : 'deactivated'} successfully`
        });
    }
    catch (error) {
        console.error('Error updating PHID status:', error);
        res.status(500).json({ error: 'Failed to update PHID status' });
    }
});
// Deactivate PHID (Admin only)
router.delete('/:phid', (0, role_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const { phid } = req.params;
        await phid_service_1.default.deactivatePHID(phid);
        res.json({
            success: true,
            message: 'PHID deactivated successfully'
        });
    }
    catch (error) {
        console.error('Error deactivating PHID:', error);
        res.status(500).json({ error: 'Failed to deactivate PHID' });
    }
});
exports.default = router;
