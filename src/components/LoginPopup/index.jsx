// src/components/LoginPopup/index.jsx
/* eslint-disable */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
// import "./style.scss";

export default function LoginPopup({ onClose, onSuccess }) {
  const { loginPassword, loginSendOTP, loginVerifyOTP } = useAuth();
  const navigate = useNavigate();

  const [tab,        setTab]        = useState("password");
  const [identifier, setIdentifier] = useState("");
  const [password,   setPassword]   = useState("");
  const [otp,        setOtp]        = useState("");
  const [otpStep,    setOtpStep]    = useState("send");
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);

  async function handlePassword(e) {
    e.preventDefault(); setError("");
    setLoading(true);
    const res = await loginPassword(identifier, password);
    setLoading(false);
    if (res.success) { onSuccess?.(); onClose(); }
    else setError(res.message);
  }

  async function handleOTPSend(e) {
    e.preventDefault(); setError("");
    setLoading(true);
    const res = await loginSendOTP(identifier);
    setLoading(false);
    if (res.success) setOtpStep("verify");
    else setError(res.message);
  }

  async function handleOTPVerify(e) {
    e.preventDefault(); setError("");
    setLoading(true);
    const res = await loginVerifyOTP(identifier, otp);
    setLoading(false);
    if (res.success) { onSuccess?.(); onClose(); }
    else setError(res.message);
  }

  return (
    <div className="lpOverlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="lpCard">
        <button className="lpClose" onClick={onClose}>✕</button>

        <div className="lpHeader">
          <div className="lpIcon">🛒</div>
          <h2>Order karne ke liye login karo</h2>
          <p>Aapka cart save rahega!</p>
        </div>

        <div className="authTabs">
          <button className={`authTab ${tab==="password"?"authTabActive":""}`} onClick={() => { setTab("password"); setError(""); }}>🔒 Password</button>
          <button className={`authTab ${tab==="otp"?"authTabActive":""}`} onClick={() => { setTab("otp"); setError(""); setOtpStep("send"); }}>📱 OTP</button>
        </div>

        {error && <div className="authAlert authAlertError">❌ {error}</div>}

        {tab === "password" && (
          <form className="authForm" onSubmit={handlePassword}>
            <div className="authField">
              <label>📧 Email ya Phone</label>
              <input type="text" placeholder="Email ya phone" value={identifier} onChange={e=>setIdentifier(e.target.value)} required />
            </div>
            <div className="authField">
              <label>🔒 Password</label>
              <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="authBtn" disabled={loading}>{loading?"⏳ Login...":"🚀 Login Karo"}</button>
          </form>
        )}

        {tab === "otp" && otpStep === "send" && (
          <form className="authForm" onSubmit={handleOTPSend}>
            <div className="authField">
              <label>📧 Email ya Phone</label>
              <input type="text" placeholder="Email ya phone" value={identifier} onChange={e=>setIdentifier(e.target.value)} required />
            </div>
            <button type="submit" className="authBtn" disabled={loading}>{loading?"⏳ Bhej raha hai...":"📨 OTP Bhejo"}</button>
          </form>
        )}

        {tab === "otp" && otpStep === "verify" && (
          <form className="authForm" onSubmit={handleOTPVerify}>
            <div className="authField">
              <label>🔢 OTP</label>
              <input type="text" className="otpInput" placeholder="_ _ _ _ _ _" value={otp}
                onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} maxLength={6} autoFocus />
            </div>
            <button type="submit" className="authBtn" disabled={loading||otp.length!==6}>{loading?"⏳ Verify...":"✅ Verify Karo"}</button>
          </form>
        )}

        <div className="lpSignupRow">
          Account nahi hai?{" "}
          <button className="authLink" onClick={() => { onClose(); navigate("/signup"); }}>Signup karo</button>
        </div>
      </div>
    </div>
  );
}