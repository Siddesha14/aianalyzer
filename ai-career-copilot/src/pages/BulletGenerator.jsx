import { useState } from "react";
import { api } from "../api";

function BulletGenerator() {
  const [text, setText] = useState("");
  const [bullets, setBullets] = useState("");
  const [loading, setLoading] = useState(false);

  const handleError = (err) => {
    console.error(err);
    alert(err?.response?.data?.error || "Something went wrong.");
  };

  const generateBullets = async () => {
    if (!text.trim())
      return alert("Paste some experience / project text first.");

    try {
      setLoading(true);
      const res = await api.post("/bullets", { text });
      setBullets(res.data.output || "");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadPDF = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // ✔ correct for bullets/pdf route

    try {
      setLoading(true);
      const res = await api.post("/bullets/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setText(res.data.extractedText || "");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h2>Bullet Point Generator</h2>
      </header>

      <div className="layout-2col">
        <section className="card">
          <textarea
            className="textarea"
            placeholder="Describe experience..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <label className="file-input">
            <input type="file" accept="application/pdf"
              onChange={(e) => uploadPDF(e.target.files[0])} />
            Upload PDF
          </label>

          <div className="card-footer">
            <button className="btn btn-primary"
              onClick={generateBullets} disabled={loading}>
              {loading ? "Generating…" : "Generate bullets"}
            </button>
          </div>
        </section>

        <section className="card">
          {bullets ? (
            <pre className="output-pre">{bullets}</pre>
          ) : (
            <p className="muted">Paste text or upload PDF.</p>
          )}
          <p className="muted">
  Paste your project or experience text or upload a PDF to auto-generate
  5 ATS-optimized bullet points that you can directly paste into your resume.
  <br /><br />
  Tip: Include impact metrics like "improved", "increased", "reduced", or numbers for better results.
</p>

        </section>
      </div>
    </div>
  );
}

export default BulletGenerator;
