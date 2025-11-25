import { useState } from "react";
import { api } from "../api";

function MatchTool() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleError = (err) => {
    console.error(err);
    alert(err?.response?.data?.error || "Something went wrong.");
  };

  // Upload both PDFs together
  const uploadBothPDFs = async (resumeFile, jdFile) => {
    if (!resumeFile || !jdFile)
      return alert("Upload BOTH Resume.pdf and JD.pdf");

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jd", jdFile);

    try {
      setLoading(true);
      const res = await api.post("/match/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResumeText(res.data.resumeText || "");
      setJdText(res.data.jdText || "");
      setResult(res.data);

    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const runMatch = async () => {
    if (!resumeText.trim() || !jdText.trim())
      return alert("Paste resume and JD first.");

    try {
      setLoading(true);
      const res = await api.post("/match", { resumeText, jdText });
      setResult(res.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h2>Resume ↔ JD Match</h2>
        <p>
          Check how well your resume aligns with the job description.
        </p>
      </header>

      <div className="layout-2col">
        <section className="card">
          <div className="stack">
            <div>
              <label className="label">Upload BOTH PDFs</label>
              <input
                type="file"
                accept="application/pdf"
                id="resumePDF"
              />
              <input
                type="file"
                accept="application/pdf"
                id="jdPDF"
              />
              <button
                className="btn btn-outline"
                disabled={loading}
                onClick={() =>
                  uploadBothPDFs(
                    document.getElementById("resumePDF").files[0],
                    document.getElementById("jdPDF").files[0]
                  )
                }
              >
                Upload Both PDFs
              </button>
            </div>

            <div>
              <label className="label">OR paste manually</label>
              <textarea
                className="textarea"
                placeholder="Resume text..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <textarea
                className="textarea"
                placeholder="JD text..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary"
              disabled={loading}
              onClick={runMatch}
            >
              {loading ? "Matching…" : "Run match"}
            </button>
          </div>
        </section>

        <section className="card">
          <h3>Result</h3>

          {!result && (
            <p className="muted">Run a match to see the result.</p>
          )}

          {result && (
            <div className="match-layout">
              <div className="match-score-card">
                <p className="label">Fit Score</p>
                <div className="score-circle">
                  {result.fitScore ?? "?"}
                </div>
                <p className="muted-small">/ 100</p>
              </div>

              <div className="match-columns">
                <div className="match-section">
                  <h4>Summary</h4>
                  <p>{result.summary}</p>
                </div>

                <div className="match-section">
                  <h4>Strengths</h4>
                  <ul>
                    {result.strengths?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="match-section">
                  <h4>Gaps</h4>
                  <ul>
                    {result.gaps?.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>

                <div className="match-section">
                  <h4>Recommended Keywords</h4>
                  <div className="chip-row">
                    {result.recommendedKeywords?.map((k, i) => (
                      <span key={i} className="chip">{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <p className="muted">
  Paste your resume and job description or upload PDFs to generate a Fit 
  Score (0–100), along with strengths, gaps, and recommended keywords.
  <br /><br />
  Tip: A score above 70 is considered a strong match. You can improve your score by adding missing keywords.
</p>

        </section>
      </div>
    </div>
  );
}

export default MatchTool;
