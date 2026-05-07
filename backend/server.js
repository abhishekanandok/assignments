require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");

const facultyRoutes = require("./routes/faculty");
const studentRoutes = require("./routes/student");
const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

// Rate limiting - prevent abuse
const evaluationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: "Too many evaluation requests. Please wait 15 minutes." },
});

app.use("/api/student/evaluate", evaluationLimiter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    aiProvider: "openai",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Connect to MongoDB and start server
async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
🚀 AI Assignment Evaluator Backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Server:      http://localhost:${PORT}
Health:      http://localhost:${PORT}/health
AI Provider: openai
Environment: ${process.env.NODE_ENV || "development"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  });
}

start();
