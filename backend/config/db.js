const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ai-evaluator";

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.warn("⚠️  MongoDB connection failed:", err.message);
    console.warn("   Running without database (results won't be persisted)");
  }
}

module.exports = connectDB;
