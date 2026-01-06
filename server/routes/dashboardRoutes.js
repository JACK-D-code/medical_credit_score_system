import express from "express";
import { adminDashboard } from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.get("/admin", protect(["ADMIN"]), adminDashboard);

export default router;
