const Anthropic = require("@anthropic-ai/sdk");
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
${filePath ? "Part 1 of the prompt contains the student assignment file (PDF/Image)." : ""}

EVALUATION RUBRIC (Total: ${totalMaxMarks} marks):
${rubricStr}

INSTRUCTIONS:
1. CRITICAL: You must strictly correlate the student's assignment against the QUESTION PAPER and the MODEL ANSWER provided.
2. Do not grade the student's assignment in isolation. Check if their answers actually solve the exact questions asked in the Question Paper.
3. Compare their facts, formulas, and conceptual explanations directly against the Model Answer. Penalize hallucinated, irrelevant, or factually incorrect information that deviates from the Model Answer.
4. Carefully analyze the student's assignment (read the attached document if provided). It may contain handwritten text; do your best to transcribe it accurately.
5. Evaluate the student's assignment against each rubric parameter. Be highly accurate, objective, and reference where they succeeded or failed to match the Model Answer.
6. Award marks strictly within the max marks for each parameter based on this factual correlation.
7. Provide specific, constructive, and detailed feedback for each parameter specifically referencing how it compares to the model answer.
5. Detect similarity risk (low/medium/high) — check if the text looks AI-generated or copied.
6. List 3-5 specific strengths.
7. List 3-5 actionable improvement suggestions.
7. Write a brief overall comment (2-3 sentences)
8. Calculate grade: A+ (95-100%), A (85-94%), B+ (75-84%), B (65-74%), C (50-64%), D (35-49%), F (<35%)

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
 * Call Anthropic Claude API
 */
async function callAnthropicAPI(prompt) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });
  return message.content[0].text;
}

/**
 * Call OpenAI API
 */
async function callOpenAIAPI(prompt) {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert academic evaluator. Always respond in valid JSON format only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    },
    { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" } }
  );
  return response.data.choices[0].message.content;
}

/**
 * Call Google Gemini API
 */
async function callGeminiAPI(prompt, filePaths) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const parts = [];

  const addFilePart = async (fPath, mType) => {
    if (!fPath) return;
    const supportedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    let finalMimeType = mType || 'application/pdf'; // fallback default

    if (fPath.includes('.pdf')) finalMimeType = 'application/pdf';
    else if (fPath.match(/\.(jpeg|jpg|png|webp)$/i)) {
      if (fPath.includes('.png')) finalMimeType = 'image/png';
      else if (fPath.includes('.webp')) finalMimeType = 'image/webp';
      else finalMimeType = 'image/jpeg';
    }

    if (supportedMimes.includes(finalMimeType)) {
      let base64Data;
      try {
        if (fPath.startsWith('http')) {
          const response = await axios.get(fPath, { responseType: 'arraybuffer' });
          base64Data = Buffer.from(response.data).toString('base64');
        } else if (fs.existsSync(fPath)) {
          base64Data = fs.readFileSync(fPath).toString('base64');
        }
      } catch (e) {
        console.error("Error fetching file for Gemini:", fPath, e.message);
      }

      if (base64Data) {
        parts.push({
          inlineData: {
            mimeType: finalMimeType,
            data: base64Data
          }
        });
      }
    }
  };

  // 1. Add student assignment
  await addFilePart(filePaths.assignmentPath, filePaths.assignmentMimeType);
  // 2. Add question paper
  if (filePaths.questionPath) await addFilePart(filePaths.questionPath, null);
  // 3. Add model answer
  if (filePaths.modelAnswerPath) await addFilePart(filePaths.modelAnswerPath, null);

  parts.push({ text: prompt });

  const response = await axios.post(url, {
    contents: [{ role: "user", parts: parts }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 8192, responseMimeType: "application/json" },
  });
  return response.data.candidates[0].content.parts[0].text;
}

/**
 * Main evaluation function - tries configured provider, falls back gracefully
 */
async function evaluateAssignment(params) {
  const prompt = buildEvaluationPrompt(params);
  let rawResponse;

  const provider = process.env.AI_PROVIDER || "anthropic";

  try {
    if (provider === "openai" && process.env.OPENAI_API_KEY) {
      rawResponse = await callOpenAIAPI(prompt);
    } else if (provider === "gemini" && process.env.GEMINI_API_KEY) {
      rawResponse = await callGeminiAPI(prompt, {
        assignmentPath: params.filePath,
        assignmentMimeType: params.mimeType,
        questionPath: params.questionPath,
        modelAnswerPath: params.modelAnswerPath
      });
    } else if (process.env.ANTHROPIC_API_KEY) {
      rawResponse = await callAnthropicAPI(prompt);
    } else {
      throw new Error("No AI API key configured");
    }
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
