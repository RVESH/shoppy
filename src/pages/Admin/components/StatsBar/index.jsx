import { CATEGORIES } from "../../constants";
import "./style.scss";

export default function StatsBar({ products }) {
  const total    = products.length;
  const services = products.filter(p => p.isService).length;
  const physical = total - services;
  const avgRating = total
    ? (products.reduce((s, p) => s + (p.rating || 0), 0) / total).toFixed(1)
    : "0.0";

  const stats = [
    { label: "Total Products", value: total,     icon: "📦", color: "#3b82f6" },
    { label: "Physical",       value: physical,  icon: "🛍️", color: "#10b981" },
    { label: "Services",       value: services,  icon: "🛠️", color: "#f59e0b" },
    { label: "Avg Rating",     value: avgRating, icon: "⭐", color: "#a855f7" },
  ];

  return (
    <div className="sb2">
      <div className="sb2__stats">
        {stats.map(s => (
          <div key={s.label} className="sb2__card" style={{ "--accent": s.color }}>
            <div className="sb2__card-icon">{s.icon}</div>
            <div className="sb2__card-val">{s.value}</div>
            <div className="sb2__card-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="sb2__cats">
        {CATEGORIES.map(cat => {
          const count = products.filter(p => p.category === cat.slug).length;
          return (
            <div key={cat.slug} className="sb2__cat">
              <span>{cat.icon}</span>
              <span className="sb2__cat-name">{cat.name}</span>
              <span className="sb2__cat-count">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}