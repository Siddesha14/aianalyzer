import { useState } from "react";
import { api } from "../api";

function JDAnalyzer() {
  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleError = (err) => {
    console.error(err);
    alert(err?.response?.data?.error || "Something went wrong.");
  };

  const analyzeJD = async () => {
    if (!jdText.trim()) return alert("Paste a job description first.");

    try {
      setLoading(true);
      const res = await api.post("/jd", { text: jdText });
      setAnalysis(res.data.output || "");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeJDPDF = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("jd", file); // ✔ correct for route /jd/pdf

    try {
      setLoading(true);
      const res = await api.post("/jd/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setJdText(res.data.extractedText || "");
      setAnalysis(res.data.output || "");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h2>Job Description Analyzer</h2>
      </header>

      <div className="layout-2col">
        <section className="card">
          <textarea
            className="textarea"
            placeholder="Paste JD..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />

          <label className="file-input">
            <input type="file" accept="application/pdf"
              onChange={(e) => analyzeJDPDF(e.target.files[0])} />
            Upload JD PDF
          </label>

          <div className="card-footer">
            <button className="btn btn-primary"
              onClick={analyzeJD} disabled={loading}>
              {loading ? "Analyzing…" : "Analyze JD"}
            </button>
          </div>
          <p className="muted">
  Upload a Job Description PDF or paste a JD to see required skills,
  preferred skills, responsibilities, and a clear summary of what recruiters
  expect.  
  <br /><br />
  Tip: Use this before applying to know exactly what to highlight in your resume.
</p>

        </section>

        <section className="card">
          {analysis ? (
            <pre className="output-pre">{analysis}</pre>
          ) : (
            <p className="muted">Paste JD or upload PDF.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default JDAnalyzer;
