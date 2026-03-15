// src/pages/ForgotPassword/index.jsx
/* eslint-disable */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "https://slcart.rishabh-gaurav-verma.workers.dev/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step,       setStep]       = useState("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp,        setOtp]        = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPass,    setNewPass]    = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [loading,    setLoading]    = useState(false);
  const [timer,      setTimer]      = useState(0);

  function startTimer() {
    setTimer(60);
    const iv = setInterval(() => setTimer(t => { if(t<=1){clearInterval(iv);return 0;} return t-1; }),1000);
  }

  async function handleSendOTP(e) {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res = await fetch(`${API}/forgot-password.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "send_otp", identifier })
      }).then(r => r.json());

      if (res.success) {
        setStep("otp");
        setSuccess("OTP email pe bhej diya ✉️");
        startTimer();
      } else {
        setError(res.message);
      }
    } catch(e) {
      setError("Network error: " + e.message);
    }
    setLoading(false);
  }

  async function handleVerifyOTP(e) {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) return setError("6 digit OTP daalo");
    setLoading(true);
    try {
      const res = await fetch(`${API}/forgot-password.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "verify_otp", identifier, otp })
      }).then(r => r.json());

      console.log("OTP verify response:", res); // Debug

      if (res.success && res.reset_token) {
        setResetToken(res.reset_token);
        setStep("password");
        setSuccess("OTP verified! ✅ Naya password set karo");
      } else {
        setError(res.message || "Kuch galat hua");
      }
    } catch(e) {
      setError("Network error: " + e.message);
    }
    setLoading(false);
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");
    if (newPass !== confirm) return setError("Passwords match nahi kar rahe");
    if (newPass.length < 6)  return setError("Password kam se kam 6 characters");
    if (!resetToken)         return setError("Reset token missing — dobara OTP lo");

    setLoading(true);
    try {
      console.log("Sending reset token:", resetToken); // Debug

      const res = await fetch(`${API}/reset-password.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset_token: resetToken, password: newPass })
      }).then(r => r.json());

      console.log("Reset response:", res); // Debug

      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(res.message);
      }
    } catch(e) {
      setError("Network error: " + e.message);
    }
    setLoading(false);
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <div className="authLogo">
            {step === "password" ? "🔐" : step === "otp" ? "📧" : "🔑"}
          </div>
          <h1 className="authTitle">
            {step === "identifier" ? "Password Reset" : step === "otp" ? "OTP Verify Karo" : "Naya Password"}
          </h1>
          <div className="authSteps">
            {["identifier","otp","password"].map((s,i) => {
              const idx = ["identifier","otp","password"].indexOf(step);
              return (
                <div key={s} className={`authStep ${step===s?"authStepActive":idx>i?"authStepDone":""}`}>
                  {idx > i ? "✓" : i+1}
                </div>
              );
            })}
          </div>
        </div>

        {error   && <div className="authAlert authAlertError">❌ {error}</div>}
        {success && <div className="authAlert authAlertSuccess">✅ {success}</div>}

        {step === "identifier" && (
          <form className="authForm" onSubmit={handleSendOTP}>
            <div className="authField">
              <label>📧 Email ya Phone Number</label>
              <input type="text" placeholder="Registered email ya phone"
                value={identifier} onChange={e => setIdentifier(e.target.value)} required />
            </div>
            <button type="submit" className="authBtn" disabled={loading}>
              {loading ? "⏳ Bhej raha hai..." : "📨 OTP Bhejo"}
            </button>
            <div className="authFooter">
              <Link to="/login" className="authLink">← Wapas Login pe Jao</Link>
            </div>
          </form>
        )}

        {step === "otp" && (
          <form className="authForm" onSubmit={handleVerifyOTP}>
            <div className="authField">
              <label>📧 OTP bheja gaya: {identifier}</label>
            </div>
            <div className="authField">
              <label>🔢 6-Digit OTP</label>
              <input type="text" className="otpInput" placeholder="_ _ _ _ _ _"
                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                maxLength={6} required autoFocus />
            </div>
            <button type="submit" className="authBtn" disabled={loading || otp.length !== 6}>
              {loading ? "⏳ Verify ho raha hai..." : "✅ OTP Verify Karo"}
            </button>
            <div className="otpResend">
              {timer > 0 ? (
                <span>Dobara bhejne ke liye {timer}s wait karo</span>
              ) : (
                <button type="button" className="authLink otpResendBtn"
                  onClick={handleSendOTP} disabled={loading}>
                  📨 OTP Dobara Bhejo
                </button>
              )}
            </div>
            <div className="authFooter">
              <button type="button" className="authLink" onClick={() => setStep("identifier")}>
                ← Wapas Jao
              </button>
            </div>
          </form>
        )}

        {step === "password" && (
          <form className="authForm" onSubmit={handleResetPassword}>
            <div className="authField">
              <label>🔒 Naya Password</label>
              <input type="password" placeholder="Min 6 characters"
                value={newPass} onChange={e => setNewPass(e.target.value)} required />
            </div>
            <div className="authField">
              <label>🔒 Confirm Password</label>
              <input type="password" placeholder="Dobara daalo"
                value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            <button type="submit" className="authBtn" disabled={loading}>
              {loading ? "⏳ Save ho raha hai..." : "💾 Password Save Karo"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}