import express from "express";
import { getPatientCredit } from "../controllers/creditController.js";

const router = express.Router();
router.get("/:id", getPatientCredit);

export default router;
