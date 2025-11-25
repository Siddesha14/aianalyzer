import { Link, NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JDAnalyzer from "./pages/JDAnalyzer";
import MatchTool from "./pages/MatchTool";
import BulletGenerator from "./pages/BulletGenerator";

function App() {
  return (
    <div className="app-root">
      <header className="top-nav">
        <div className="top-nav-left">
          <Link to="/" className="brand">
            <span className="brand-dot" />
            <span className="brand-text">AI Career Copilot</span>
          </Link>
        </div>
        <nav className="top-nav-links">
          <NavLink to="/resume" className="nav-link">
            Resume
          </NavLink>
          <NavLink to="/job-description" className="nav-link">
            Job Description
          </NavLink>
          <NavLink to="/match" className="nav-link">
            Match
          </NavLink>
          <NavLink to="/bullets" className="nav-link">
            Bullets
          </NavLink>
        </nav>
        <div className="top-nav-right">
          <span className="pill">Gemini 2.5 Flash</span>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume" element={<ResumeAnalyzer />} />
          <Route path="/job-description" element={<JDAnalyzer />} />
          <Route path="/match" element={<MatchTool />} />
          <Route path="/bullets" element={<BulletGenerator />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <span>Built by you · AI Resume & JD Copilot</span>
      </footer>
    </div>
  );
}

export default App;
