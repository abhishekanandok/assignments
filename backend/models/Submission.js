const mongoose = require("mongoose");

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
    scores: [{
      parameter: String,
      score: Number,
      maxScore: Number,
      feedback: String,
      status: String,
    }],
    improvements: [String],
    strengths: [String],
  },
  evaluatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", submissionSchema);
