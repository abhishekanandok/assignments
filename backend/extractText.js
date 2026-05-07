const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function getBuffer(filePath) {
  if (filePath.startsWith('http')) {
    const response = await axios.get(filePath, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  }
  return fs.readFileSync(filePath);
}

/**
 * Extract text from PDF or DOCX file
 */
async function extractText(filePath) {
  // Try to determine extension from the URL if it's a URL
  let ext = path.extname(filePath.split('?')[0]).toLowerCase();

  // Cloudinary sometimes drops extensions or uses different formats, so we default to checking the url string
  if (!ext || ext === '') {
    if (filePath.includes('.pdf')) ext = '.pdf';
    else if (filePath.includes('.docx')) ext = '.docx';
    else if (filePath.includes('.doc')) ext = '.doc';
    else if (filePath.includes('.txt')) ext = '.txt';
  }

  if (ext === ".pdf") {
    try {
      const pdfParse = require("pdf-parse");
      const buffer = await getBuffer(filePath);
      const data = await pdfParse(buffer);
      return data.text.trim();
    } catch (err) {
      console.error("PDF parse error:", err.message);
      return "";
    }
  }

  if (ext === ".doc" || ext === ".docx") {
    try {
      const mammoth = require("mammoth");
      const buffer = await getBuffer(filePath);
      const result = await mammoth.extractRawText({ buffer: buffer });
      return result.value.trim();
    } catch (err) {
      console.error("DOCX parse error:", err.message);
      return "";
    }
  }

  // Plain text fallback
  if (ext === ".txt") {
    const buffer = await getBuffer(filePath);
    return buffer.toString("utf-8").trim();
  }

  // If we can't determine it, just return empty so Gemini visual takes over
  return "";
}

module.exports = { extractText };
