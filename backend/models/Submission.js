const mongoose = require("mongoose");

const scoreItemSchema = new mongoose.Schema({
  parameter: String,
  score: Number,
  maxScore: Number,
  feedback: String,
  status: String,
});

const submissionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  assignmentPath: String,
  assignmentText: String,
  result: {
    totalMarks: Number,
    maxMarks: Number,
    percentage: Number,
    grade: String,
    similarityRisk: String,
    aiComment: String,
    scores: [scoreItemSchema],
    improvements: [String],
    strengths: [String],
  },
  // Teacher approval workflow fields
  teacherApproved: { type: Boolean, default: false },
  publishedToStudent: { type: Boolean, default: false },
  teacherModifiedResult: {
    totalMarks: Number,
    maxMarks: Number,
    percentage: Number,
    grade: String,
    similarityRisk: String,
    aiComment: String,
    scores: [scoreItemSchema],
    improvements: [String],
    strengths: [String],
  },
  teacherFeedback: { type: String, default: "" },
  approvedAt: { type: Date },
  evaluatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", submissionSchema);
