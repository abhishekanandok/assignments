const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  questionPaperPath: String, // Storing cloudinary URL
  questionPaperText: String,
  modelAnswerPath: String, // Storing cloudinary URL
  modelAnswerText: String,
  settings: {
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    strictness: { type: String, enum: ["lenient", "moderate", "strict"], default: "moderate" },
    totalMarks: { type: Number, default: 10 },
  },
  rubricItems: [{
    parameter: String,
    maxMarks: Number,
    description: String,
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", sessionSchema);
