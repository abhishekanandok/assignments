const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { Session } = require("../models");
const { extractText } = require("../extractText");
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
  async (req, res) => {
    try {
      const settings = req.body.settings ? JSON.parse(req.body.settings) : {};
      const rubricItems = req.body.rubricItems ? JSON.parse(req.body.rubricItems) : [];

      // Validate required fields
      if (!settings.title || !settings.subject) {
        return res.status(400).json({ success: false, message: "Assignment title and subject are required." });
      }

      // Generate unique session ID
      const sessionId = uuidv4().substring(0, 8).toUpperCase();

      // Extract text from uploaded files
      let questionPaperText = "";
      let modelAnswerText = "";
      let questionPaperPath = "";
      let modelAnswerPath = "";

      if (req.files?.questionPaper?.[0]) {
        questionPaperPath = req.files.questionPaper[0].path;
        questionPaperText = await extractText(questionPaperPath);
      }

      if (req.files?.modelAnswer?.[0]) {
        modelAnswerPath = req.files.modelAnswer[0].path;
        modelAnswerText = await extractText(modelAnswerPath);
      }

      // Save session to database
      const session = new Session({
        sessionId,
        createdBy: req.user.id,
        title: settings.title,
        subject: settings.subject,
        questionPaperPath,
        questionPaperText,
        modelAnswerPath,
        modelAnswerText,
        settings: {
          difficulty: settings.difficulty || "medium",
          strictness: settings.strictness || "moderate",
          totalMarks: Number(settings.totalMarks) || 10,
        },
        rubricItems,
      });

      await session.save();

      res.json({
        success: true,
        sessionId,
        message: "Evaluation session created successfully.",
      });
    } catch (err) {
      console.error("Create session error:", err);
      res.status(500).json({ success: false, message: err.message || "Internal server error" });
    }
  }
);

/**
 * GET /api/faculty/sessions
 * Get all sessions (for faculty dashboard)
 */
router.get("/sessions", authMiddleware, restrictTo("teacher"), async (req, res) => {
  try {
    const sessions = await Session.find({ createdBy: req.user.id }).sort({ createdAt: -1 }).select("-questionPaperText -modelAnswerText");
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/faculty/session/:sessionId
 * Get a specific session details
 */
router.get("/session/:sessionId", authMiddleware, async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ success: false, message: "Session not found." });
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
