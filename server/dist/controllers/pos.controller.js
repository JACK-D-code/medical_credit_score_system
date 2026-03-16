"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutPOS = exports.verifyPOS = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const verifyPOS = async (req, res) => {
    try {
        const { phid } = req.body;
        // Ensure user is Provider or Admin
        if (req.user?.role !== 'PROVIDER' && req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Forbidden. Only Providers can access the POS terminal.' });
            return;
        }
        if (!phid) {
            res.status(400).json({ error: 'PH-ID is required for scanning.' });
            return;
        }
        // Find the patient profile
        const profile = await prisma_1.default.patientProfile.findUnique({
            where: { healthId: phid },
            include: { user: true }
        });
        if (!profile) {
            res.status(404).json({ error: 'Invalid PH-ID. No patient record found.' });
            return;
        }
        // Get their latest score
        const latestScore = await prisma_1.default.medicalCreditScore.findFirst({
            where: { patientId: profile.id },
            orderBy: { calculatedAt: 'desc' }
        });
        // If they don't have a score generated yet, they don't have a limit.
        if (!latestScore) {
            res.status(400).json({ error: 'Patient has no medical credit score generated yet.' });
            return;
        }
        const score = latestScore.scoreValue;
        // Exact same logic from frontend VirtualCreditCard: Pre-Approved Limit = Score * 500
        const preApprovedLimit = score * 500;
        res.json({
            valid: true,
            patient: {
                name: `${profile.user.firstName} ${profile.user.lastName}`,
                phid: profile.healthId,
                tier: score >= 700 ? 'Gold Tier' : score >= 500 ? 'Silver Tier' : 'Standard Tier',
                score: score,
                preApprovedLimit: preApprovedLimit
            }
        });
    }
    catch (error) {
        console.error('Error verifying POS:', error);
        res.status(500).json({ error: 'Failed to verify PH-ID' });
    }
};
exports.verifyPOS = verifyPOS;
const checkoutPOS = async (req, res) => {
    try {
        const { phid, billAmount, description } = req.body;
        if (req.user?.role !== 'PROVIDER' && req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        // Extremely simplified "checkout" for demo purposes.
        // Real logic would calculate limits, insert a transaction, and apply EMI logic.
        const profile = await prisma_1.default.patientProfile.findUnique({
            where: { healthId: phid }
        });
        if (!profile) {
            res.status(404).json({ error: 'Invalid PH-ID.' });
            return;
        }
        const latestScore = await prisma_1.default.medicalCreditScore.findFirst({
            where: { patientId: profile.id },
            orderBy: { calculatedAt: 'desc' }
        });
        const scoreValue = latestScore ? latestScore.scoreValue : 0;
        let appliedDiscount = 0;
        let finalAmount = billAmount;
        let billingType = 'STANDARD';
        let approvalMessage = 'Bill processed successfully.';
        // Module 6 & 7 Logic
        if (scoreValue >= 800) {
            billingType = 'CHARITY_GRANT';
            appliedDiscount = billAmount;
            finalAmount = 0;
            approvalMessage = '100% Charity Sponsorship Approved! Bill completely waived.';
        }
        else if (scoreValue >= 650) {
            billingType = 'ZERO_INTEREST_EMI';
            approvalMessage = '0% Interest EMI Medical Loan successfully granted via POS checkout.';
        }
        else if (scoreValue >= 500) {
            billingType = 'DISCOUNTED';
            appliedDiscount = billAmount * 0.20;
            finalAmount = billAmount - appliedDiscount;
            approvalMessage = '20% Credit Discount applied to the final bill.';
        }
        // Fast-track a Bill record
        const bill = await prisma_1.default.billingRecord.create({
            data: {
                patientId: profile.id,
                billAmount: billAmount,
                status: finalAmount === 0 ? 'paid' : 'pending',
                billDate: new Date(),
                dueDate: new Date(),
                hospitalName: 'Demo Hospital',
                treatmentType: 'General Treatment',
                subtotal: billAmount,
                patientResponsibility: finalAmount,
                outstanding: finalAmount,
                createdBy: req.user.id
            }
        });
        // Fast-track Offer record to show in Patient Dashboard
        const offer = await prisma_1.default.offerApplication.create({
            data: {
                patientId: profile.id,
                offerType: billingType,
                amount: finalAmount,
                description: `POS Checkout Application against Bill #${bill.id}`,
                status: 'approved',
                approvedBy: req.user.id
            }
        });
        res.json({
            success: true,
            transactionId: offer.id,
            message: approvalMessage,
            billingDetails: {
                originalAmount: billAmount,
                discount: appliedDiscount,
                finalAmount: finalAmount,
                type: billingType
            }
        });
    }
    catch (error) {
        console.error('Error processing POS checkout:', error);
        res.status(500).json({ error: 'Failed to process POS checkout' });
    }
};
exports.checkoutPOS = checkoutPOS;
