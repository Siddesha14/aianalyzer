import { useState } from "react";
import { api } from "../api";

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [bullets, setBullets] = useState("");
  const [loading, setLoading] = useState(false);

  const handleError = (err) => {
    console.error(err);
    alert(err?.response?.data?.error || "Something went wrong.");
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) return alert("Paste your resume text first.");

    try {
      setLoading(true);
      const res = await api.post("/resume", { text: resumeText });
      setAnalysis(res.data.output || "");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeResumePDF = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // ✔ correct

    try {
      setLoading(true);
      const res = await api.post("/resume/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumeText(res.data.extractedText || "");
      setAnalysis(res.data.output || "");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const generateBullets = async () => {
    if (!resumeText.trim())
      return alert("Paste resume first.");

    try {
      setLoading(true);
      const res = await api.post("/bullets", { text: resumeText });
      setBullets(res.data.output || "");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="page">
      <header className="page-header">
        <h2>Resume Analyzer</h2>
      </header>

      <div className="layout-2col">
        <section className="card">
          <textarea
            className="textarea"
            placeholder="Paste resume text..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />

          <label className="file-input">
            <input type="file" accept="application/pdf"
              onChange={(e) => analyzeResumePDF(e.target.files[0])} />
            Upload PDF
          </label>

          <div className="button-row">
            <button className="btn btn-ghost"
              onClick={generateBullets} disabled={loading}>
              ✨ Generate bullets
            </button>

            <button className="btn btn-primary"
              onClick={analyzeResume} disabled={loading}>
              {loading ? "Analyzing…" : "Analyze resume"}
            </button>
          </div>
           <p className="muted">
  Upload your resume PDF or paste your text to see a detailed breakdown of
  your skills, experience summary, missing keywords, and suggestions to
  improve your ATS score.  
  <br /><br />
  Tip: PDF uploads work best with clean formatting. Avoid scanned images.
</p>

        </section>

        <section className="card">
          {analysis && (
            <>
              <h4>Resume Analysis</h4>
              <pre className="output-pre">{analysis}</pre>
            </>
          )}

          {bullets && (
            <>
              <h4>Generated Bullets</h4>
              <pre className="output-pre">{bullets}</pre>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
