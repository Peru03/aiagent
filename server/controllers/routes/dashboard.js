import express from "express";
import { getStats } from "../controllers/statsController.js";
import { authMiddleware } from "../middleware/auth.js"; // assuming you have auth

const router = express.Router();

// Protect route, pass req.user from auth
router.get("/", authMiddleware, getStats);

export default router;
