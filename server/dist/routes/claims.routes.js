"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const claims_controller_1 = require("../controllers/claims.controller");
const router = (0, express_1.Router)();
// Patient routes
router.post('/claim', auth_1.authenticateToken, claims_controller_1.submitCreditClaim);
router.post('/offer', auth_1.authenticateToken, claims_controller_1.submitOfferApplication);
router.get('/my-requests', auth_1.authenticateToken, claims_controller_1.getMyClaimsAndOffers);
// Admin/Provider routes
router.get('/pending', auth_1.authenticateToken, claims_controller_1.getAllPendingRequests);
router.put('/claim/:id/review', auth_1.authenticateToken, claims_controller_1.reviewCreditClaim);
router.put('/offer/:id/review', auth_1.authenticateToken, claims_controller_1.reviewOfferApplication);
exports.default = router;
