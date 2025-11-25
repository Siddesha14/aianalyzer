import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-main">
          <h1>Make your resume work as hard as you do.</h1>
          <p>
            Analyze your resume, understand job descriptions, and see how well
            you match a role. Powered by Gemini, built by Siddesh.
          </p>
          <div className="hero-actions">
            <Link to="/resume" className="btn btn-primary">
              Analyze my resume
            </Link>
            <Link to="/match" className="btn btn-outline">
              Try match score
            </Link>
          </div>
          <p className="hero-meta">
            No login · Local resume analysis · Perfect for internship/job hunt.
          </p>
        </div>

        <div className="hero-card">
          <h3>What this app can do</h3>
          <ul>
            <li>Break down your resume into skills, gaps, improvements.</li>
            <li>Analyze any job description in seconds.</li>
            <li>See a 0–100 match score between you and the role.</li>
            <li>Generate ATS-friendly bullet points.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Home;
