"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Retrieve all top-level metrics for the dashboard view
router.get('/', auth_1.authenticateToken, dashboard_controller_1.getDashboardMetrics);
exports.default = router;
