const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { getStats} = require("../controllers/dashboardController");

// Any authenticated user

router.get("/", authMiddleware, getStats);
module.exports = router;

