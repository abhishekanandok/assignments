const { v4: uuidv4 } = require("uuid");
const { Session, Submission } = require("../models");
const { extractText } = require("../services/extractText");
const { generateQuestionsFromSyllabus } = require("../services/aiService");

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
    } else if (req.body.questionPaperText) {
      questionPaperText = req.body.questionPaperText;
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

exports.generateQuestions = async (req, res) => {
  try {
    const settings = req.body.settings ? JSON.parse(req.body.settings) : {};

    if (!req.files?.syllabusFile?.[0]) {
      return res.status(400).json({ success: false, message: "Syllabus file is required." });
    }

    const syllabusPath = req.files.syllabusFile[0].path;
    const syllabusText = await extractText(syllabusPath);

    if (!syllabusText || syllabusText.trim().length < 20) {
      return res.status(400).json({ success: false, message: "Could not extract sufficient text from the syllabus file." });
    }

    const generatedQuestions = await generateQuestionsFromSyllabus(syllabusText, settings);

    res.json({
      success: true,
      generatedQuestions
    });

  } catch (err) {
    console.error("Generate questions error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to generate questions" });
  }
};

/**
 * Get a single submission with full details for teacher review
 */
exports.getSubmissionDetails = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found." });
    }

    // Verify the teacher owns the session
    const session = await Session.findOne({ sessionId: submission.sessionId });
    if (!session || session.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized access." });
    }

    res.json({ success: true, submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Approve or reject a submission with optional teacher modifications
 */
exports.reviewSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { action, modifiedResult, teacherFeedback } = req.body;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found." });
    }

    // Verify the teacher owns the session
    const session = await Session.findOne({ sessionId: submission.sessionId });
    if (!session || session.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized access." });
    }

    if (action === "approve") {
      submission.teacherApproved = true;
      submission.publishedToStudent = true;
      submission.approvedAt = new Date();
      submission.teacherFeedback = teacherFeedback || "";
      
      // If teacher provided modifications, save them
      if (modifiedResult && Object.keys(modifiedResult).length > 0) {
        submission.teacherModifiedResult = modifiedResult;
      }
      
      await submission.save();
      res.json({ success: true, message: "Submission approved and published to student." });
    } else if (action === "reject") {
      submission.teacherApproved = false;
      submission.publishedToStudent = false;
      submission.teacherFeedback = teacherFeedback || "";
      await submission.save();
      res.json({ success: true, message: "Submission rejected. Student will not see results." });
    } else {
      res.status(400).json({ success: false, message: "Invalid action. Use 'approve' or 'reject'." });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Publish approved results to students
 */
exports.publishResults = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await Session.findOne({ sessionId });
    if (!session || session.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized access." });
    }

    // Publish all approved submissions for this session
    const result = await Submission.updateMany(
      { sessionId, teacherApproved: true },
      { publishedToStudent: true }
    );

    res.json({ 
      success: true, 
      message: `Published ${result.modifiedCount} approved results to students.` 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
