// src/pages/Login/index.jsx
/* eslint-disable */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import "./style.scss";

export default function Login() {
  const { loginPassword, loginSendOTP, loginVerifyOTP } = useAuth();
  const navigate = useNavigate();

  const [tab,        setTab]        = useState("password"); // password | otp
  const [identifier, setIdentifier] = useState("");
  const [password,   setPassword]   = useState("");
  const [otp,        setOtp]        = useState("");
  const [otpStep,    setOtpStep]    = useState("send");     // send | verify
  const [waLink,     setWaLink]     = useState("");
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [loading,    setLoading]    = useState(false);
  const [showPass,   setShowPass]   = useState(false);
  const [timer,      setTimer]      = useState(0);

  function reset() { setError(""); setSuccess(""); }

  // ── Password Login ───────────────────────────────────────
  async function handlePasswordLogin(e) {
    e.preventDefault(); reset();
    if (!identifier || !password) return setError("Sabhi fields required hain");
    setLoading(true);
    const res = await loginPassword(identifier, password);
    setLoading(false);
    res.success ? navigate("/dashboard") : setError(res.message);
  }

  // ── OTP: Send ────────────────────────────────────────────
  async function handleOTPSend(e) {
    e.preventDefault(); reset();
    if (!identifier) return setError("Email ya phone daalo");
    setLoading(true);
    const res = await loginSendOTP(identifier);
    setLoading(false);
    if (res.success) {
      setOtpStep("verify");
      setSuccess(res.method === "email" ? "OTP email pe bhej diya 📧" : "WhatsApp pe OTP bhejo");
      if (res.wa_link) setWaLink(res.wa_link);
      startTimer();
    } else {
      setError(res.message);
    }
  }

  // ── OTP: Verify ──────────────────────────────────────────
  async function handleOTPVerify(e) {
    e.preventDefault(); reset();
    if (otp.length !== 6) return setError("6 digit OTP daalo");
    setLoading(true);
    const res = await loginVerifyOTP(identifier, otp);
    setLoading(false);
    res.success ? navigate("/dashboard") : setError(res.message);
  }

  function startTimer() {
    setTimer(60);
    const iv = setInterval(() => setTimer(t => { if(t<=1){clearInterval(iv);return 0;} return t-1; }), 1000);
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <div className="authLogo">🛒</div>
          <h1 className="authTitle">SL Cart</h1>
          <p className="authSubtitle">Apne account mein login karo</p>
        </div>

        {/* ── Tabs ───────────────────────────────────────── */}
        <div className="authTabs">
          <button className={`authTab ${tab==="password"?"authTabActive":""}`} onClick={() => { setTab("password"); reset(); setOtpStep("send"); }}>
            🔒 Password se
          </button>
          <button className={`authTab ${tab==="otp"?"authTabActive":""}`} onClick={() => { setTab("otp"); reset(); setOtpStep("send"); }}>
            📱 OTP se
          </button>
        </div>

        {error   && <div className="authAlert authAlertError">❌ {error}</div>}
        {success && <div className="authAlert authAlertSuccess">✅ {success}</div>}

        {/* ── PASSWORD TAB ────────────────────────────────── */}
        {tab === "password" && (
          <form className="authForm" onSubmit={handlePasswordLogin}>
            <div className="authField">
              <label>📧 Email ya Phone</label>
              <input type="text" placeholder="Email ya 10-digit phone" value={identifier}
                onChange={e => setIdentifier(e.target.value)} required />
            </div>
            <div className="authField">
              <label>🔒 Password</label>
              <div className="authPassRow">
                <input type={showPass?"text":"password"} placeholder="Password daalo"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" className="authPassToggle" onClick={() => setShowPass(p=>!p)}>
                  {showPass?"🙈":"👁️"}
                </button>
              </div>
            </div>
            <div className="authForgot">
              <Link to="/forgot-password" className="authLink">🔑 Password bhool gaye?</Link>
            </div>
            <button type="submit" className="authBtn" disabled={loading}>
              {loading ? "⏳ Login ho raha hai..." : "🚀 Login Karo"}
            </button>
          </form>
        )}

        {/* ── OTP TAB ─────────────────────────────────────── */}
        {tab === "otp" && otpStep === "send" && (
          <form className="authForm" onSubmit={handleOTPSend}>
            <div className="authField">
              <label>📧 Email ya Phone</label>
              <input type="text" placeholder="Email ya 10-digit phone" value={identifier}
                onChange={e => setIdentifier(e.target.value)} required />
            </div>
            <button type="submit" className="authBtn" disabled={loading}>
              {loading ? "⏳ OTP bhej raha hai..." : "📨 OTP Bhejo"}
            </button>
          </form>
        )}

        {tab === "otp" && otpStep === "verify" && (
          <form className="authForm" onSubmit={handleOTPVerify}>
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="waOtpBtn">
                💬 WhatsApp pe OTP lena hai? Click karo
              </a>
            )}
            <div className="authField">
              <label>🔢 6-Digit OTP</label>
              <input type="text" className="otpInput" placeholder="_ _ _ _ _ _"
                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                maxLength={6} required autoFocus />
            </div>
            <button type="submit" className="authBtn" disabled={loading || otp.length!==6}>
              {loading ? "⏳ Verify ho raha hai..." : "✅ OTP Verify Karo"}
            </button>
            <div className="otpResend">
              {timer > 0 ? <span>Dobara ke liye {timer}s</span> : (
                <button type="button" className="authLink otpResendBtn" onClick={handleOTPSend} disabled={loading}>
                  📨 OTP Dobara Bhejo
                </button>
              )}
            </div>
            <button type="button" className="authBackBtn" onClick={() => { setOtpStep("send"); reset(); }}>
              ← Wapas Jao
            </button>
          </form>
        )}

        <div className="authFooter">
          Account nahi hai? <Link to="/signup" className="authLink">Abhi banao</Link>
        </div>
      </div>
    </div>
  );
}