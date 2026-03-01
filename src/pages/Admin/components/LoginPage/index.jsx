import { useState } from "react";
import "./style.scss";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) { setError("Dono fields bharo!"); return; }
    setLoading(true); setError("");
    try { await onLogin(username, password); }
    catch (err) { setError(err.message || "Login fail hua!"); }
    setLoading(false);
  }

  return (
    <div className="lp-wrap">
      <div className="lp-card">
        <div className="lp-logo">🛒</div>
        <h1 className="lp-title">SHoppy Admin</h1>
        <p className="lp-sub">Secure login — sirf admin ke liye</p>
        <form onSubmit={handleSubmit} className="lp-form">
          <div className="lp-field">
            <label>Username</label>
            <input type="text" value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="shoppy_admin" autoComplete="username" />
          </div>
          <div className="lp-field">
            <label>Password</label>
            <div className="lp-pass-wrap">
              <input type={showPass ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPass(p => !p)}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          {error && <div className="lp-error">⚠️ {error}</div>}
          <button type="submit" className="lp-btn" disabled={loading}>
            {loading ? "⏳ Wait karo..." : "🔐 Login Karo"}
          </button>
        </form>
      </div>
    </div>
  );
}