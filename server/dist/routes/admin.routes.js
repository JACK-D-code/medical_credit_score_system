"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const provider_controller_1 = require("../controllers/provider.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/patients/:id', auth_1.authenticateToken, provider_controller_1.getPatientByIdForAdmin);
router.get('/charity/grants', auth_1.authenticateToken, provider_controller_1.getCharityGrants);
exports.default = router;
