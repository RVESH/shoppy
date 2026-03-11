// src/pages/Signup/index.jsx
/* eslint-disable */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
// import "./style.scss";

export default function Signup() {
  const { signupSendOTP, signupVerifyOTP } = useAuth();
  const navigate = useNavigate();

  const [step,     setStep]     = useState("form");  // form | otp
  const [form,     setForm]     = useState({ name:"", email:"", phone:"", password:"", confirm:"" });
  const [otp,      setOtp]      = useState("");
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [timer,    setTimer]    = useState(0);

  function onChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  // ── Step 1: Send OTP ────────────────────────────────────
  async function handleSendOTP(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) return setError("Dono passwords match nahi kar rahe");
    if (form.password.length < 6)       return setError("Password kam se kam 6 characters");
    if (!/^[6-9]\d{9}$/.test(form.phone)) return setError("Valid 10-digit phone daalo");

    setLoading(true);
    const res = await signupSendOTP(form.name, form.email, form.phone, form.password);
    setLoading(false);

    if (res.success) {
      setStep("otp");
      setSuccess(`OTP bhej diya! ${form.email} check karo 📧`);
      startTimer();
    } else {
      setError(res.message);
    }
  }

  // ── Step 2: Verify OTP ──────────────────────────────────
  async function handleVerifyOTP(e) {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) return setError("6 digit OTP daalo");

    setLoading(true);
    const res = await signupVerifyOTP(form.name, form.email, form.phone, form.password, otp);
    setLoading(false);

    if (res.success) {
      setSuccess("Account ban gaya! 🎉");
      setTimeout(() => navigate("/dashboard"), 1200);
    } else {
      setError(res.message);
    }
  }

  // ── Resend OTP ──────────────────────────────────────────
  async function handleResend() {
    setError(""); setSuccess("");
    setLoading(true);
    const res = await signupSendOTP(form.name, form.email, form.phone, form.password);
    setLoading(false);
    if (res.success) { setSuccess("OTP dobara bhej diya! 📧"); startTimer(); }
    else setError(res.message);
  }

  function startTimer() {
    setTimer(60);
    const iv = setInterval(() => {
      setTimer(t => { if (t <= 1) { clearInterval(iv); return 0; } return t-1; });
    }, 1000);
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <div className="authLogo">🛒</div>
          <h1 className="authTitle">SL Cart</h1>
          <p className="authSubtitle">
            {step === "form" ? "Naya account banao" : "Email OTP verify karo"}
          </p>
        </div>

        {error   && <div className="authAlert authAlertError">❌ {error}</div>}
        {success && <div className="authAlert authAlertSuccess">✅ {success}</div>}

        {/* ── FORM STEP ─────────────────────────────────── */}
        {step === "form" && (
          <form className="authForm" onSubmit={handleSendOTP}>
            <div className="authField">
              <label>👤 Poora Naam</label>
              <input name="name" type="text" placeholder="Apna naam" value={form.name} onChange={onChange} required />
            </div>
            <div className="authField">
              <label>📧 Email</label>
              <input name="email" type="email" placeholder="example@gmail.com" value={form.email} onChange={onChange} required />
            </div>
            <div className="authField">
              <label>📱 Phone Number</label>
              <div className="authPhoneRow">
                <span className="authPhonePrefix">+91</span>
                <input name="phone" type="tel" placeholder="10 digit number" value={form.phone} onChange={onChange} required maxLength={10} />
              </div>
            </div>
            <div className="authField">
              <label>🔒 Password</label>
              <div className="authPassRow">
                <input name="password" type={showPass?"text":"password"} placeholder="Min 6 characters" value={form.password} onChange={onChange} required />
                <button type="button" className="authPassToggle" onClick={() => setShowPass(p=>!p)}>{showPass?"🙈":"👁️"}</button>
              </div>
            </div>
            <div className="authField">
              <label>🔒 Confirm Password</label>
              <input name="confirm" type={showPass?"text":"password"} placeholder="Password dobara daalo" value={form.confirm} onChange={onChange} required />
            </div>
            <button type="submit" className="authBtn" disabled={loading}>
              {loading ? "⏳ OTP bhej raha hai..." : "📧 OTP Bhejo"}
            </button>
          </form>
        )}

        {/* ── OTP STEP ──────────────────────────────────── */}
        {step === "otp" && (
          <form className="authForm" onSubmit={handleVerifyOTP}>
            <div className="otpInfo">
              <div className="otpInfoIcon">📧</div>
              <p>OTP bheja gaya hai:<br/><strong>{form.email}</strong></p>
            </div>
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
              {timer > 0 ? (
                <span>Dobara bhejne ke liye {timer}s wait karo</span>
              ) : (
                <button type="button" className="authLink otpResendBtn" onClick={handleResend} disabled={loading}>
                  📨 OTP Dobara Bhejo
                </button>
              )}
            </div>
            <button type="button" className="authBackBtn" onClick={() => { setStep("form"); setError(""); setSuccess(""); }}>
              ← Wapas Jao
            </button>
          </form>
        )}

        <div className="authFooter">
          Pehle se account hai? <Link to="/login" className="authLink">Login karo</Link>
        </div>
      </div>
    </div>
  );
}