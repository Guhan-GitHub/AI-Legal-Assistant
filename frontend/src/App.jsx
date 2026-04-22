import React, { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

function LoginSection({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // "login" or "register"

  const validateLocally = () => {
    if (!username.trim() || !password) {
      return "Username and password are required.";
    }
    if (username.trim().length < 3) {
      return "Username must be at least 3 characters.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return "Password should contain at least one capital letter and one number.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const localError = validateLocally();
    if (localError) {
      setError(localError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/login" : "/register";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || (mode === "login" ? "Login failed" : "Registration failed"));
      }
      const data = await res.json();
      onLoginSuccess(data.username);
    } catch (err) {
      setError(err.message || (mode === "login" ? "Login failed" : "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app login-wrapper">
      <header className="header">
        <h1>AI-Powered Legal Assistant</h1>
        <p className="subtitle">
          Please log in or register a demo account to continue.
        </p>
      </header>
      <main className="login-layout">
        <section className="card">
          <h2>{mode === "login" ? "Login" : "Register"}</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading
                ? mode === "login"
                  ? "Signing in..."
                  : "Registering..."
                : mode === "login"
                ? "Login"
                : "Register"}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
          <div className="auth-switch">
            {mode === "login" ? (
              <p className="hint">
                New here?{" "}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => {
                    setError("");
                    setMode("register");
                  }}
                >
                  Register a new user
                </button>
              </p>
            ) : (
              <p className="hint">
                Already have an account?{" "}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => {
                    setError("");
                    setMode("login");
                  }}
                >
                  Back to login
                </button>
              </p>
            )}
            <p className="hint">
              Example demo: <strong>admin / Admin@1234</strong>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function UploadCaseSection({ onUploaded }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [court, setCourt] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/upload_case`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          text,
          jurisdiction: jurisdiction || null,
          court: court || null,
          year: year ? parseInt(year, 10) : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to upload case");
      const data = await res.json();
      onUploaded(data);
      setTitle("");
      setText("");
      setJurisdiction("");
      setCourt("");
      setYear("");
    } catch (err) {
      setError(err.message || "Error uploading case");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Upload Case</h2>
      <p className="hint">
        Paste judgment text here. The system will store it for semantic search.
      </p>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Case title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="grid">
          <input
            type="text"
            placeholder="Jurisdiction"
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
          />
          <input
            type="text"
            placeholder="Court"
            value={court}
            onChange={(e) => setCourt(e.target.value)}
          />
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <textarea
          rows={6}
          placeholder="Full case text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload & Summarize"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </section>
  );
}

function SearchSection({ results, setResults, onSelectCase }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, k: 5 }),
      });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || "Error searching cases");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Semantic Search</h2>
      <p className="hint">
        Ask in natural language (e.g. &quot;breach of fiduciary duty in
        mergers&quot;).
      </p>
      <form onSubmit={handleSearch} className="form">
        <input
          type="text"
          placeholder="Search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <div className="results">
        {results.map((r) => (
          <button
            type="button"
            key={r.id}
            className="result clickable"
            onClick={() => onSelectCase(r.id)}
          >
            <h3>{r.title}</h3>
            <p className="meta">
              {r.meta?.court || "Unknown court"} ·{" "}
              {r.meta?.jurisdiction || "Unknown jurisdiction"} ·{" "}
              {r.meta?.year || "Year n/a"}
            </p>
            <p>{r.snippet}...</p>
            <p className="score">Similarity score: {r.score.toFixed(3)}</p>
          </button>
        ))}
        {!results.length && <p className="hint">No results yet.</p>}
      </div>
    </section>
  );
}

function PrecedentSection({ precedents, setPrecedents, onSelectCase }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSuggest = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/precedents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matter_description: description, k: 5 }),
      });
      if (!res.ok) throw new Error("Failed to get precedents");
      const data = await res.json();
      setPrecedents(data.precedents || []);
    } catch (err) {
      setError(err.message || "Error suggesting precedents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Precedent Suggestions</h2>
      <p className="hint">
        Describe a new matter; the assistant will suggest similar cases. This is
        a research tool only, not legal advice.
      </p>
      <form onSubmit={handleSuggest} className="form">
        <textarea
          rows={4}
          placeholder="Matter description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Suggest Precedents"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      {precedents.length > 0 && (
        <div className="export-row">
          <button
            type="button"
            onClick={() => setPrecedents([])}
          >
            Clear suggestions
          </button>
        </div>
      )}
      <div className="results">
        {precedents.map((p) => (
          <button
            type="button"
            key={p.id}
            className="result clickable"
            onClick={() => onSelectCase(p.id)}
          >
            <h3>{p.title}</h3>
            <p className="meta">
              {p.meta?.court || "Unknown court"} ·{" "}
              {p.meta?.jurisdiction || "Unknown jurisdiction"} ·{" "}
              {p.meta?.year || "Year n/a"}
            </p>
            <p>{p.reason}</p>
            <p className="score">Similarity score: {p.score.toFixed(3)}</p>
          </button>
        ))}
        {!precedents.length && <p className="hint">No precedents yet.</p>}
      </div>
    </section>
  );
}

export default function App() {
  const [uploadedInfo, setUploadedInfo] = useState(null);
  const [results, setResults] = useState([]);
  const [precedents, setPrecedents] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseError, setCaseError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const handleSelectCase = async (caseId) => {
    setCaseError("");
    try {
      const res = await fetch(`${API_BASE}/case_details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case_id: caseId }),
      });
      if (!res.ok) throw new Error("Failed to load case details");
      const data = await res.json();
      setSelectedCase(data.case);
    } catch (err) {
      setCaseError(err.message || "Error loading case details");
    }
  };

  const handleExportSelectedCase = (format) => {
    if (!selectedCase) return;

    const filenameBase =
      (selectedCase.title || "case").replace(/[^a-z0-9\-]+/gi, "_") || "case";

    if (format === "json") {
      const payload = {
        id: selectedCase.id,
        title: selectedCase.title,
        text: selectedCase.text,
        meta: selectedCase.meta || {},
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filenameBase}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === "txt") {
      const headerLines = [
        selectedCase.title || "Untitled case",
        "",
        `Court: ${selectedCase.meta?.court || "Unknown"}`,
        `Jurisdiction: ${selectedCase.meta?.jurisdiction || "Unknown"}`,
        `Year: ${selectedCase.meta?.year || "N/A"}`,
        "",
      ].join("\n");
      const blob = new Blob([headerLines + selectedCase.text], {
        type: "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filenameBase}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (!currentUser) {
    return <LoginSection onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>AI-Powered Legal Assistant</h1>
        <p className="subtitle">
          Summarize case law and find semantically similar precedents. For
          research use only, not legal advice.
        </p>
        <p className="subtitle">
          Logged in as <strong>{currentUser}</strong>
        </p>
      </header>
      <main className="layout">
        <div className="left">
          <UploadCaseSection onUploaded={setUploadedInfo} />
          {uploadedInfo && (
            <section className="card">
              <h2>Last Uploaded Summary</h2>
              <p className="hint">
                This is a heuristic summary. Always verify against the full
                judgment.
              </p>
              <h3>Facts</h3>
              <p>{uploadedInfo.summary.facts}</p>
              <h3>Issues</h3>
              <p>{uploadedInfo.summary.issues}</p>
              <h3>Holding</h3>
              <p>{uploadedInfo.summary.holding}</p>
              <h3>Reasoning</h3>
              <p>{uploadedInfo.summary.reasoning}</p>
              <h3>Citations</h3>
              <p>{uploadedInfo.summary.citations}</p>
              <p className="disclaimer">{uploadedInfo.summary.disclaimer}</p>
            </section>
          )}
          {selectedCase && (
            <section className="card">
              <h2>Selected Case</h2>
              <div className="export-row">
                <button
                  type="button"
                  onClick={() => handleExportSelectedCase("json")}
                >
                  Export as JSON
                </button>
                <button
                  type="button"
                  onClick={() => handleExportSelectedCase("txt")}
                >
                  Export as .txt
                </button>
              </div>
              <p className="meta">
                {selectedCase.meta?.court || "Unknown court"} ·{" "}
                {selectedCase.meta?.jurisdiction || "Unknown jurisdiction"} ·{" "}
                {selectedCase.meta?.year || "Year n/a"}
              </p>
              <h3>{selectedCase.title}</h3>
              <pre className="case-text">{selectedCase.text}</pre>
            </section>
          )}
          {caseError && (
            <section className="card">
              <p className="error">{caseError}</p>
            </section>
          )}
        </div>
        <div className="right">
          <SearchSection
            results={results}
            setResults={setResults}
            onSelectCase={handleSelectCase}
          />
          <PrecedentSection
            precedents={precedents}
            setPrecedents={setPrecedents}
            onSelectCase={handleSelectCase}
          />
        </div>
      </main>
      <footer className="footer">
        <p>
          This tool is experimental and provided for educational and research
          purposes only. It does not constitute legal advice.
        </p>
      </footer>
    </div>
  );
}

