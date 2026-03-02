import { useState } from "react";
import "./style.scss";

const NAV = [
  { id: "dashboard", label: "Dashboard",   icon: "📊" },
  { id: "products",  label: "Products",    icon: "📦" },
  { id: "add",       label: "Add Product", icon: "➕" },
];

export default function Sidebar({ active, onNav, onLogout, productCount }) {
  const [open, setOpen] = useState(false);

  function handleNav(id) {
    onNav(id);
    setOpen(false);
  }

  return (
    <>
      {/* Hamburger - mobile only */}
      <button className="sb__hamburger" onClick={() => setOpen(o => !o)}>
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="4" y1="4" x2="16" y2="16" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="4" x2="4" y2="16" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="3" y1="5"  x2="17" y2="5"  stroke="#f8fafc" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="10" x2="17" y2="10" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="15" x2="17" y2="15" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Overlay */}
      <div
        className={`sb__overlay${open ? " sb__overlay--visible" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sb${open ? " sb--open" : ""}`}>
        <div className="sb__brand">
          <span className="sb__brand-icon">🛒</span>
          <div>
            <div className="sb__brand-name">SHoppy</div>
            <div className="sb__brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="sb__nav">
          {NAV.map(item => (
            <button key={item.id}
              className={`sb__nav-btn${active === item.id ? " sb__nav-btn--active" : ""}`}
              onClick={() => handleNav(item.id)}>
              <span className="sb__nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === "products" && (
                <span className="sb__badge">{productCount}</span>
              )}
            </button>
          ))}
        </nav>

        <button className="sb__logout" onClick={onLogout}>🚪 Logout</button>
      </aside>
    </>
  );
}