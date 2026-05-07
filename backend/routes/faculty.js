const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");
const { uploadCloud } = require("../utils/cloudinary");
const { authMiddleware, restrictTo } = require("../middleware/auth");

/**
 * POST /api/faculty/create-session
 * Create a new evaluation session
 */
router.post(
  "/create-session",
  authMiddleware,
  restrictTo("teacher"),
  uploadCloud.fields([
    { name: "questionPaper", maxCount: 1 },
    { name: "modelAnswer", maxCount: 1 },
    { name: "rubricFile", maxCount: 1 },
  ]),
  facultyController.createSession
);

/**
 * GET /api/faculty/sessions
 * Get all sessions (for faculty dashboard)
 */
router.get("/sessions", authMiddleware, restrictTo("teacher"), facultyController.getSessions);

/**
 * GET /api/faculty/session/:sessionId
 * Get a specific session details
 */
router.get("/session/:sessionId", authMiddleware, facultyController.getSession);

module.exports = router;
