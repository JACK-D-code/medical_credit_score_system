"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const pos_controller_1 = require("../controllers/pos.controller");
const router = (0, express_1.Router)();
// Provider POS routes
router.post('/verify', auth_1.authenticateToken, pos_controller_1.verifyPOS);
router.post('/checkout', auth_1.authenticateToken, pos_controller_1.checkoutPOS);
exports.default = router;
