const { v4: uuidv4 } = require("uuid");
const { Session } = require("../models");
const { extractText } = require("../services/extractText");

exports.createSession = async (req, res) => {
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
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ createdBy: req.user.id }).sort({ createdAt: -1 }).select("-questionPaperText -modelAnswerText");
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ success: false, message: "Session not found." });
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
