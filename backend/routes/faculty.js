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
 * POST /api/faculty/generate-questions
 * Generate questions from a syllabus file
 */
router.post(
  "/generate-questions",
  authMiddleware,
  restrictTo("teacher"),
  uploadCloud.fields([
    { name: "syllabusFile", maxCount: 1 }
  ]),
  facultyController.generateQuestions
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

/**
 * GET /api/faculty/submission/:submissionId
 * Get a single submission with full details for teacher review
 */
router.get("/submission/:submissionId", authMiddleware, restrictTo("teacher"), facultyController.getSubmissionDetails);

/**
 * POST /api/faculty/submission/:submissionId/review
 * Approve or reject a submission with optional modifications
 */
router.post("/submission/:submissionId/review", authMiddleware, restrictTo("teacher"), facultyController.reviewSubmission);

/**
 * POST /api/faculty/session/:sessionId/publish
 * Publish all approved results to students
 */
router.post("/session/:sessionId/publish", authMiddleware, restrictTo("teacher"), facultyController.publishResults);

module.exports = router;
