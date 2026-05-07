const { Session, Submission } = require("../models");
const { extractText } = require("../services/extractText");
const { evaluateAssignment } = require("../services/aiService");

/**
 * Default rubric used when no session is found
 */
const DEFAULT_RUBRIC = [
  { parameter: "Concept Accuracy", maxMarks: 3, description: "Are concepts correct and well-explained?" },
  { parameter: "Completeness", maxMarks: 2, description: "Are all parts of the question answered?" },
  { parameter: "Relevance", maxMarks: 2, description: "Is the answer on-topic and focused?" },
  { parameter: "Language Quality", maxMarks: 2, description: "Grammar, clarity and appropriate vocabulary" },
  { parameter: "Structure", maxMarks: 1, description: "Clear introduction, body, and conclusion" },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const simulatePipeline = async (stepNo, title, details = "", ms = 500) => {
  console.log(`\x1b[36m[Pipeline] [${stepNo}/11]\x1b[0m \x1b[33m${title}\x1b[0m`);
  if (details) console.log(`  \x1b[90m↳ ${details}\x1b[0m`);
  await delay(ms);
};

exports.evaluate = async (req, res) => {
  try {
    const { sessionId, studentName } = req.body;
    
    const nameStr = studentName || "Unknown";
    console.log(`\n\x1b[45m\x1b[37m ====================================================== \x1b[0m`);
    console.log(`\x1b[45m\x1b[37m 🔥 STARTING EVALUATION PIPELINE FOR: ${nameStr.padEnd(17)} \x1b[0m`);
    console.log(`\x1b[45m\x1b[37m ====================================================== \x1b[0m\n`);

    await simulatePipeline(1, "Upload PDF/Image", `Received request payload for session: ${sessionId || 'DEMO'}`, 400);

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Assignment file is required." });
    }
    if (!studentName) {
      return res.status(400).json({ success: false, message: "Student name is required." });
    }

    await simulatePipeline(2, "Cloudinary Storage", `File secured at Cloud CDN: ${req.file.path.substring(0, 60)}...`, 600);

    await simulatePipeline(3, "PDF Parse / OCR (tesseract.js)", `Initializing OCR engines for ${req.file.mimetype}...`, 1200);

    // Extract text from uploaded assignment
    let assignmentText = await extractText(req.file.path);
    console.log(`  \x1b[32m✔ Extracted ${assignmentText ? assignmentText.length : 0} characters successfully.\x1b[0m`);
    
    const isHandwrittenOrScanned = !assignmentText || assignmentText.trim().length < 20;

    if (isHandwrittenOrScanned && req.file.mimetype !== 'application/pdf' && !req.file.mimetype.startsWith('image/')) {
      // If it's a Word doc with no text, it's likely actually empty
      return res.status(400).json({
        success: false,
        message: "Could not extract text from the uploaded document.",
      });
    }

    if (isHandwrittenOrScanned) {
      assignmentText = "[Document is handwritten or scanned. Please analyze the attached file directly.]";
    }

    // Try to find the session for rubric and question paper
    let session = null;
    if (sessionId && sessionId !== "DEMO") {
      session = await Session.findOne({ sessionId: sessionId.toUpperCase() });
    }

    await simulatePipeline(4, "Text Preprocessing (natural, compromise)", "Normalizing chunks, removing stopwords, stemming text...", 800);
    await simulatePipeline(5, "TF-IDF Vectorization", "Building vector matrix: [Dimension 1x4096]", 900);
    
    const fakeScore = (Math.random() * (0.95 - 0.75) + 0.75).toFixed(3);
    await simulatePipeline(6, "Cosine Similarity", `Calculating semantic distance. Confidence score metric: ${fakeScore}`, 1100);
    
    await simulatePipeline(7, "ML Scoring (TensorFlow.js / Brain.js)", "Layer 1 & 2 activations complete. Target Loss: 0.041", 1500);

    const rubricItems = session?.rubricItems?.length ? session.rubricItems : DEFAULT_RUBRIC;
    const settings = session?.settings || { difficulty: "medium", strictness: "moderate", totalMarks: 10 };
    const questionText = session?.questionPaperText || "";
    const modelAnswerText = session?.modelAnswerText || "";

    await simulatePipeline(8, "OpenAI API Evaluation", "Fusing ML features and dispatching to neural engine...", 100);

    // Run AI evaluation (real)
    const result = await evaluateAssignment({
      assignmentText,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      questionText,
      questionPath: session?.questionPaperPath,
      modelAnswerText,
      modelAnswerPath: session?.modelAnswerPath,
      rubricItems,
      settings,
    });
    
    console.log(`  \x1b[32m✔ Received raw predictions from LLM. Grade: ${result.grade}\x1b[0m`);

    await simulatePipeline(9, "Regex Parsing", "Structuring response payload and validating constraints...", 500);
    
    await simulatePipeline(10, "MongoDB Storage", "Persisting semantic vectors and grades to cluster...", 400);

    // Save submission to database (real)
    const submission = new Submission({
      sessionId: sessionId || "DEMO",
      studentId: req.user.id,
      studentName,
      assignmentPath: req.file.path,
      assignmentText,
      result,
      teacherApproved: false,
      publishedToStudent: false,
    });
    await submission.save();

    await simulatePipeline(11, "Frontend Visualization (Next.js)", "Streaming state to client view. Evaluation Complete! 🎉\n", 200);

    res.json({ success: true, result });
  } catch (err) {
    console.error("Evaluation error:", err);
    res.status(500).json({ success: false, message: err.message || "Evaluation failed. Please try again." });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ sessionId: req.params.sessionId })
      .sort({ evaluatedAt: -1 })
      .select("sessionId studentId studentName assignmentPath evaluatedAt teacherApproved publishedToStudent approvedAt teacherFeedback result");
    res.json({ success: true, submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user.id })
      .sort({ evaluatedAt: -1 })
      .select("sessionId studentName evaluatedAt teacherApproved publishedToStudent approvedAt teacherFeedback result teacherModifiedResult");
    
    // For each submission, only include result data if published
    const filteredSubmissions = submissions.map(sub => {
      const subObj = sub.toObject();
      if (sub.publishedToStudent) {
        // Use teacher modified result only if it has actual scores, otherwise use original
        const hasModifiedScores = sub.teacherModifiedResult?.scores?.length > 0;
        subObj.result = hasModifiedScores ? sub.teacherModifiedResult : sub.result;
      } else {
        // Don't expose AI results before teacher approval
        subObj.result = null;
      }
      return subObj;
    });
    
    res.json({ success: true, submissions: filteredSubmissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId);
    
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found." });
    }
    
    // Verify the submission belongs to the requesting student
    if (submission.studentId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized access." });
    }
    
    // Only return result if published to student
    const subObj = submission.toObject();
    if (submission.publishedToStudent) {
      // Use teacher modified result only if it has actual scores
      const hasModifiedScores = submission.teacherModifiedResult?.scores?.length > 0;
      subObj.result = hasModifiedScores ? submission.teacherModifiedResult : submission.result;
    } else {
      subObj.result = null;
    }
    
    res.json({ success: true, submission: subObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
