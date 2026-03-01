import { useEffect } from "react";
import "./style.scss";

export default function Toast({ msg, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, [onClose]);
  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  return (
    <div className={`toast toast--${type}`}>
      <span>{icons[type]}</span>
      <span className="toast__msg">{msg}</span>
      <button onClick={onClose}>✕</button>
    </div>
  );
}