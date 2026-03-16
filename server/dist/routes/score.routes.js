"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const score_controller_1 = require("../controllers/score.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes for the Score Engine
router.post('/calculate/:patientId', auth_1.authenticateToken, score_controller_1.calculateScore);
router.get('/history/:patientId', auth_1.authenticateToken, score_controller_1.getScoreHistory);
router.get('/details', auth_1.authenticateToken, score_controller_1.getScoreDetails);
exports.default = router;
