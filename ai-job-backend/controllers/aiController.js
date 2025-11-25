const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const pdfParse = require("pdf-parse");

// GEMINI
const GEMINI_MODEL = "models/gemini-2.5-flash";

const GEMINI_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;


// ------------------------------------------------
// GEMINI HELPERS
// ------------------------------------------------
async function callGeminiText(prompt) {
  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();

  if (!response.ok)
    throw new Error(data.error?.message || "Gemini API Error");

  return (
    data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || ""
  );
}

async function callGeminiJSON(prompt) {
  const strict = `
Return ONLY valid JSON. Do NOT include markdown. Do NOT explain.

${prompt}
`;

  const text = await callGeminiText(strict);

  try {
    return { json: JSON.parse(text), raw: text };
  } catch {
    return { json: null, raw: text };
  }
}



// ------------------------------------------------
// PDF TEXT EXTRACTOR (Correct pdf-parse usage)
// ------------------------------------------------
async function extractPDF(buffer) {
  const data = await pdfParse(buffer);
  return data.text || "";
}



// ------------------------------------------------
// 1️⃣ Resume TEXT
// ------------------------------------------------
exports.analyzeResume = async (req, res) => {
  try {
    const { text } = req.body;

    const prompt = `
Analyze this resume:

${text}

Provide:
- Key Skills
- Experience Summary
- Missing Keywords
- Improvement Suggestions
`;

    const output = await callGeminiText(prompt);
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ------------------------------------------------
// 2️⃣ Resume PDF
// ------------------------------------------------
exports.analyzeResumePDF = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No PDF uploaded" });

    const extractedText = await extractPDF(req.file.buffer);

    const prompt = `
Analyze this resume extracted from PDF:

${extractedText}

Provide:
- Key Skills
- Experience Summary
- Missing Keywords
- Improvement Suggestions
`;

    const output = await callGeminiText(prompt);

    res.json({ extractedText, output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ------------------------------------------------
// 3️⃣ JD TEXT
// ------------------------------------------------
exports.analyzeJD = async (req, res) => {
  try {
    const { text } = req.body;

    const prompt = `
Analyze this Job Description:

${text}

Provide:
- Required Skills
- Preferred Skills
- Responsibilities
- Ideal Candidate Summary
`;

    const output = await callGeminiText(prompt);

    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ------------------------------------------------
// 4️⃣ JD PDF
// ------------------------------------------------
exports.analyzeJDPDF = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No PDF uploaded" });

    const extractedText = await extractPDF(req.file.buffer);

    const prompt = `
Analyze this Job Description extracted from PDF:

${extractedText}

Provide:
- Required Skills
- Preferred Skills
- Responsibilities
- Ideal Candidate Summary
`;

    const output = await callGeminiText(prompt);

    res.json({ extractedText, output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ------------------------------------------------
// 5️⃣ Resume ↔ JD Match (TEXT)
// ------------------------------------------------
exports.matchResumeJD = async (req, res) => {
  try {
    const { resumeText, jdText } = req.body;

    const prompt = `
Compare the resume with the job description.

Return ONLY JSON:

{
  "fitScore": number,
  "strengths": [],
  "gaps": [],
  "recommendedKeywords": [],
  "summary": ""
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}
`;

    const { json, raw } = await callGeminiJSON(prompt);

    if (!json)
      return res.json({ warning: "Invalid JSON", raw });

    res.json(json);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ------------------------------------------------
// 6️⃣ Resume ↔ JD Match (PDF → PDF)
// ------------------------------------------------
exports.matchResumeJDPDF = async (req, res) => {
  try {
    const resumeFile = req.files?.resume?.[0];
    const jdFile = req.files?.jd?.[0];

    if (!resumeFile || !jdFile)
      return res.status(400).json({ error: "Upload both Resume & JD" });

    const resumeText = await extractPDF(resumeFile.buffer);
    const jdText = await extractPDF(jdFile.buffer);

    const prompt = `
Compare resume and job PDF content.

Return ONLY JSON:

{
  "fitScore": number,
  "strengths": [],
  "gaps": [],
  "recommendedKeywords": [],
  "summary": ""
}

RESUME (PDF):
${resumeText}

JOB DESCRIPTION (PDF):
${jdText}
`;

    const { json, raw } = await callGeminiJSON(prompt);

    if (!json)
      return res.json({ warning: "Invalid JSON", raw });

    res.json(json);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ------------------------------------------------
// 7️⃣ Bullet Generator (TEXT)
// ------------------------------------------------
exports.generateBullets = async (req, res) => {
  try {
    const { text } = req.body;

    const prompt = `
Write 5 ATS-optimized resume bullet points for:

${text}

Format:
- Bullet 1
- Bullet 2
- Bullet 3
- Bullet 4
- Bullet 5
`;

    const output = await callGeminiText(prompt);

    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ------------------------------------------------
// 8️⃣ Bullet Generator (PDF)
// ------------------------------------------------
exports.generateBulletsPDF = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No PDF uploaded" });

    const extractedText = await extractPDF(req.file.buffer);

    const prompt = `
Write 5 ATS-ready resume bullet points for this PDF content:

${extractedText}

Format:
- Bullet 1
- Bullet 2
- Bullet 3
- Bullet 4
- Bullet 5
`;

    const output = await callGeminiText(prompt);

    res.json({ extractedText, output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
