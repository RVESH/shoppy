// src/components/AuthContext/index.jsx
/* eslint-disable */
import { createContext, useContext, useState, useEffect } from "react";

const API = "https://shoppy-api.rishabh-gaurav-verma.workers.dev/api";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const s = localStorage.getItem("slcart_user");
      if (s) setUser(JSON.parse(s));
    } catch {}
    setLoading(false);
  }, []);

  // ── Signup Step 1: Send OTP ──────────────────────────────
  async function signupSendOTP(name, email, phone, password) {
    const res  = await fetch(`${API}/signup.php`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step:"send_otp", name, email, phone, password })
    });
    return await res.json();
  }

  // ── Signup Step 2: Verify OTP ────────────────────────────
  async function signupVerifyOTP(name, email, phone, password, otp) {
    const res  = await fetch(`${API}/signup.php`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step:"verify_otp", name, email, phone, password, otp })
    });
    const data = await res.json();
    if (data.success) _saveUser(data);
    return data;
  }

  // ── Login: Password ──────────────────────────────────────
  async function loginPassword(identifier, password) {
    const res  = await fetch(`${API}/login.php`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method:"password", identifier, password })
    });
    const data = await res.json();
    if (data.success) _saveUser(data);
    return data;
  }

  // ── Login: Send OTP ──────────────────────────────────────
  async function loginSendOTP(identifier) {
    const res  = await fetch(`${API}/login.php`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method:"otp_send", identifier })
    });
    return await res.json();
  }

  // ── Login: Verify OTP ────────────────────────────────────
  async function loginVerifyOTP(identifier, otp) {
    const res  = await fetch(`${API}/login.php`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method:"otp_verify", identifier, otp })
    });
    const data = await res.json();
    if (data.success) _saveUser(data);
    return data;
  }

  // ── Logout ───────────────────────────────────────────────
  function logout() {
    localStorage.removeItem("slcart_user");
    setUser(null);
  }

  function _saveUser(data) {
    const u = { user_id:data.user_id, name:data.name, email:data.email, phone:data.phone, token:data.token };
    localStorage.setItem("slcart_user", JSON.stringify(u));
    setUser(u);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signupSendOTP, signupVerifyOTP, loginPassword, loginSendOTP, loginVerifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }