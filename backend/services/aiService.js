const axios = require("axios");
const fs = require("fs");

/**
 * Builds the evaluation prompt using rubric-based controlled prompting
 * to reduce hallucination and ensure consistent scoring.
 */
function buildEvaluationPrompt({ assignmentText, questionText, modelAnswerText, rubricItems, settings, filePath }) {
  const rubricStr = rubricItems
    .map((r, i) => `${i + 1}. ${r.parameter} (max ${r.maxMarks} marks): ${r.description}`)
    .join("\n");

  const totalMaxMarks = rubricItems.reduce((sum, r) => sum + r.maxMarks, 0);

  const strictnessInstructions = {
    lenient: "Be lenient - focus on core understanding, award partial marks generously if the concept is grasped.",
    moderate: "Be balanced - award full marks only if the answer is complete and accurate, partial marks for partial understanding.",
    strict: "Be strict - deduct marks for any inaccuracies, incomplete explanations, or poor language.",
  };

  const difficultyContext = {
    easy: "This is a beginner-level assignment. Expect basic conceptual answers.",
    medium: "This is an intermediate-level assignment. Expect clear explanations with examples.",
    hard: "This is an advanced-level assignment. Expect in-depth analysis, edge cases, and critical thinking.",
  };

  return `You are an expert academic evaluator with 15+ years of experience in ${settings.difficulty || "medium"} level education.

DIFFICULTY CONTEXT: ${difficultyContext[settings.difficulty] || difficultyContext.medium}
STRICTNESS LEVEL: ${strictnessInstructions[settings.strictness] || strictnessInstructions.moderate}

${questionText ? `QUESTION PAPER:\n${questionText}\n` : ""}

${modelAnswerText ? `MODEL ANSWER (use as reference, not as exact match requirement):\n${modelAnswerText}\n` : ""}

STUDENT ASSIGNMENT TO EVALUATE:
${assignmentText ? `Text Extracted from Assignment:\n${assignmentText}\n` : ""}
${filePath ? "Part of the prompt contains the student assignment file (PDF/Image). If text extraction was provided above, use it as the primary text, but you can also look at the images if needed." : ""}

EVALUATION RUBRIC (Total: ${totalMaxMarks} marks):
${rubricStr}

INSTRUCTIONS:
1. CRITICAL: You must strictly correlate the student's assignment against the QUESTION PAPER and the MODEL ANSWER provided.
2. Do not grade the student's assignment in isolation. Check if their answers actually solve the exact questions asked in the Question Paper.
3. Compare their facts, formulas, and conceptual explanations directly against the Model Answer. Penalize hallucinated, irrelevant, or factually incorrect information that deviates from the Model Answer.
4. Carefully analyze the student's assignment (read the attached document images if provided). It may contain handwritten text; do your best to transcribe it accurately.
5. Evaluate the student's assignment against each rubric parameter. Be highly accurate, objective, and reference where they succeeded or failed to match the Model Answer.
6. Award marks strictly within the max marks for each parameter based on this factual correlation.
7. Provide specific, constructive, and detailed feedback for each parameter specifically referencing how it compares to the model answer.
8. Detect similarity risk (low/medium/high) — check if the text looks AI-generated or copied.
9. List 3-5 specific strengths.
10. List 3-5 actionable improvement suggestions.
11. Write a brief overall comment (2-3 sentences)
12. Calculate grade: A+ (95-100%), A (85-94%), B+ (75-84%), B (65-74%), C (50-64%), D (35-49%), F (<35%)

YOU MUST RESPOND IN VALID JSON FORMAT ONLY. No markdown, no explanation outside JSON.

{
  "scores": [
    {
      "parameter": "parameter name",
      "score": <number within max>,
      "maxScore": <max marks>,
      "feedback": "specific detailed feedback",
      "status": "good|partial|poor"
    }
  ],
  "totalMarks": <sum of scores>,
  "maxMarks": ${totalMaxMarks},
  "percentage": <totalMarks/maxMarks * 100>,
  "grade": "A+|A|B+|B|C|D|F",
  "similarityRisk": "low|medium|high",
  "aiComment": "overall 2-3 sentence assessment",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3", "improvement4", "improvement5"]
}`;
}

/**
 * Call OpenAI API supporting image base64 and PDF conversion
 */
async function callOpenAIAPI(prompt, filePaths) {
  const parts = [];

  // 1. Add prompt text
  parts.push({ type: "text", text: prompt });

  const addFilePart = async (fPath, mType) => {
    if (!fPath) return;

    if (fPath.includes('.pdf') || (mType && mType === 'application/pdf')) {
      console.warn(`PDF-to-image conversion is temporarily disabled because canvas failed to build on Windows.`);
      // We will rely on the text extraction instead for PDFs.
    } else {
      let finalMimeType = mType || 'image/jpeg'; // fallback default
      if (fPath.match(/\.(jpeg|jpg|png|webp)$/i)) {
        if (fPath.includes('.png')) finalMimeType = 'image/png';
        else if (fPath.includes('.webp')) finalMimeType = 'image/webp';
        else finalMimeType = 'image/jpeg';
      }

      let base64Data;
      try {
        if (fPath.startsWith('http')) {
          const response = await axios.get(fPath, { responseType: 'arraybuffer' });
          base64Data = Buffer.from(response.data).toString('base64');
        } else if (fs.existsSync(fPath)) {
          base64Data = fs.readFileSync(fPath).toString('base64');
        }
      } catch (e) {
        console.error("Error fetching image for OpenAI:", fPath, e.message);
      }

      if (base64Data) {
        parts.push({
          type: "image_url",
          image_url: { url: `data:${finalMimeType};base64,${base64Data}` }
        });
      }
    }
  };

  // Add files
  await addFilePart(filePaths.assignmentPath, filePaths.assignmentMimeType);
  if (filePaths.questionPath) await addFilePart(filePaths.questionPath, null);
  if (filePaths.modelAnswerPath) await addFilePart(filePaths.modelAnswerPath, null);

  const requestPayload = {
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an expert academic evaluator. Always respond in valid JSON format only." },
      { role: "user", content: parts },
    ],
    temperature: 0.3,
    max_tokens: 2000,
  };

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    requestPayload,
    { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" } }
  );

  return response.data.choices[0].message.content;
}

/**
 * Main evaluation function - exclusively uses OpenAI
 */
async function evaluateAssignment(params) {
  const prompt = buildEvaluationPrompt(params);
  let rawResponse;

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }
    rawResponse = await callOpenAIAPI(prompt, {
      assignmentPath: params.filePath,
      assignmentMimeType: params.mimeType,
      questionPath: params.questionPath,
      modelAnswerPath: params.modelAnswerPath
    });
  } catch (err) {
    console.error("AI API error:", err.response ? JSON.stringify(err.response.data) : err.message);
    throw new Error(`AI evaluation failed: ${err.message}`);
  }

  // Parse and clean JSON response
  try {
    let jsonStr = rawResponse;
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const result = JSON.parse(jsonStr);
    // Validate required fields
    if (!result.scores || !Array.isArray(result.scores)) {
      throw new Error("Invalid response structure");
    }
    return result;
  } catch (parseErr) {
    console.error("JSON parse error:", parseErr.message, "\nRaw:", rawResponse.substring(0, 500));
    throw new Error("Failed to parse AI evaluation response");
  }
}

module.exports = { evaluateAssignment };
