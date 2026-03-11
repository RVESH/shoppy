// src/pages/ForgotPassword/index.jsx
/* eslint-disable */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
const API = "https://shoppy-api.rishabh-gaurav-verma.workers.dev/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step,       setStep]       = useState("identifier"); // identifier | otp | password
  const [identifier, setIdentifier] = useState("");
  const [otp,        setOtp]        = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPass,    setNewPass]    = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [waLink,     setWaLink]     = useState("");
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [loading,    setLoading]    = useState(false);
  const [timer,      setTimer]      = useState(0);

  function startTimer() {
    setTimer(60);
    const iv = setInterval(() => setTimer(t => { if(t<=1){clearInterval(iv);return 0;} return t-1; }),1000);
  }

  async function handleSendOTP(e) {
    e.preventDefault(); setError(""); setSuccess("");
    setLoading(true);
    const res = await fetch(`${API}/forgot-password.php`,{
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({step:"send_otp", identifier})
    }).then(r=>r.json());
    setLoading(false);
    if (res.success) {
      setStep("otp");
      setSuccess(res.wa_link ? "WhatsApp pe OTP bhejo" : "OTP email pe bhej diya ✉️");
      if (res.wa_link) setWaLink(res.wa_link);
      startTimer();
    } else { setError(res.message); }
  }

  async function handleVerifyOTP(e) {
    e.preventDefault(); setError("");
    if (otp.length !== 6) return setError("6 digit OTP daalo");
    setLoading(true);
    const res = await fetch(`${API}/forgot-password.php`,{
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({step:"verify_otp", identifier, otp})
    }).then(r=>r.json());
    setLoading(false);
    if (res.success) { setResetToken(res.reset_token); setStep("password"); setSuccess("OTP verified! ✅ Naya password set karo"); }
    else { setError(res.message); }
  }

  async function handleResetPassword(e) {
    e.preventDefault(); setError("");
    if (newPass !== confirm) return setError("Passwords match nahi kar rahe");
    if (newPass.length < 6) return setError("Password kam se kam 6 characters");
    setLoading(true);
    const res = await fetch(`${API}/reset-password.php`,{
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({reset_token: resetToken, password: newPass})
    }).then(r=>r.json());
    setLoading(false);
    if (res.success) { setSuccess(res.message); setTimeout(() => navigate("/login"), 2000); }
    else { setError(res.message); }
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <div className="authLogo">{step==="password"?"🔐":step==="otp"?"📧":"🔑"}</div>
          <h1 className="authTitle">
            {step==="identifier"?"Password Reset":step==="otp"?"OTP Verify Karo":"Naya Password"}
          </h1>
          <div className="authSteps">
            {["identifier","otp","password"].map((s,i) => (
              <div key={s} className={`authStep ${step===s?"authStepActive":["identifier","otp","password"].indexOf(step)>i?"authStepDone":""}`}>
                {["identifier","otp","password"].indexOf(step)>i ? "✓" : i+1}
              </div>
            ))}
          </div>
        </div>

        {error   && <div className="authAlert authAlertError">❌ {error}</div>}
        {success && <div className="authAlert authAlertSuccess">✅ {success}</div>}

        {step === "identifier" && (
          <form className="authForm" onSubmit={handleSendOTP}>
            <div className="authField">
              <label>📧 Email ya Phone Number</label>
              <input type="text" placeholder="Registered email ya phone" value={identifier}
                onChange={e=>setIdentifier(e.target.value)} required />
            </div>
            <button type="submit" className="authBtn" disabled={loading}>
              {loading?"⏳ Bhej raha hai...":"📨 OTP Bhejo"}
            </button>
            <div className="authFooter"><Link to="/login" className="authLink">← Wapas Login pe Jao</Link></div>
          </form>
        )}

        {step === "otp" && (
          <form className="authForm" onSubmit={handleVerifyOTP}>
            {waLink && <a href={waLink} target="_blank" rel="noreferrer" className="waOtpBtn">💬 WhatsApp pe OTP lena hai?</a>}
            <div className="authField">
              <label>🔢 6-Digit OTP</label>
              <input type="text" className="otpInput" placeholder="_ _ _ _ _ _"
                value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                maxLength={6} required autoFocus />
            </div>
            <button type="submit" className="authBtn" disabled={loading||otp.length!==6}>
              {loading?"⏳ Verify ho raha hai...":"✅ OTP Verify Karo"}
            </button>
            <div className="otpResend">
              {timer>0 ? <span>Dobara ke liye {timer}s</span> : (
                <button type="button" className="authLink otpResendBtn" onClick={handleSendOTP} disabled={loading}>📨 OTP Dobara Bhejo</button>
              )}
            </div>
          </form>
        )}

        {step === "password" && (
          <form className="authForm" onSubmit={handleResetPassword}>
            <div className="authField">
              <label>🔒 Naya Password</label>
              <input type="password" placeholder="Min 6 characters" value={newPass}
                onChange={e=>setNewPass(e.target.value)} required />
            </div>
            <div className="authField">
              <label>🔒 Confirm Password</label>
              <input type="password" placeholder="Dobara daalo" value={confirm}
                onChange={e=>setConfirm(e.target.value)} required />
            </div>
            <button type="submit" className="authBtn" disabled={loading}>
              {loading?"⏳ Save ho raha hai...":"💾 Password Save Karo"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}