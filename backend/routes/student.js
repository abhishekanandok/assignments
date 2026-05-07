const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { uploadCloud } = require("../utils/cloudinary");
const { authMiddleware, restrictTo } = require("../middleware/auth");

/**
 * POST /api/student/evaluate
 * Submit assignment for AI evaluation
 */
router.post("/evaluate", authMiddleware, restrictTo("student", "teacher"), uploadCloud.single("assignment"), studentController.evaluate);

/**
 * GET /api/student/submissions/:sessionId
 * Get all submissions for a session (faculty view)
 */
router.get("/submissions/:sessionId", authMiddleware, restrictTo("teacher"), studentController.getSubmissions);

/**
 * GET /api/student/my-submissions
 * Get all submissions for the currently logged-in student
 */
router.get("/my-submissions", authMiddleware, restrictTo("student"), studentController.getMySubmissions);

module.exports = router;
