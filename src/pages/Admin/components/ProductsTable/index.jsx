import { useState } from "react";
import { CATEGORIES } from "../../constants";
import "./style.scss";

export default function ProductsTable({ products, onEdit, onDelete }) {
  const [search, setSearch]     = useState("");
  const [catFilter, setCat]     = useState("all");
  const [typeFilter, setType]   = useState("all");

  const filtered = products.filter(p => {
    const matchSearch = !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.id?.toLowerCase().includes(search.toLowerCase());
    const matchCat  = catFilter === "all" || p.category === catFilter;
    const matchType = typeFilter === "all" ||
      (typeFilter === "service" && p.isService) ||
      (typeFilter === "product" && !p.isService);
    return matchSearch && matchCat && matchType;
  });

  return (
    <div className="pt">
      <div className="pt__filters">
        <input className="pt__search" type="text"
          placeholder="🔍 Name, brand, ID se dhundo..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="pt__select" value={catFilter} onChange={e => setCat(e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
        </select>
        <select className="pt__select" value={typeFilter} onChange={e => setType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="product">Products Only</option>
          <option value="service">Services Only</option>
        </select>
        <span className="pt__count">{filtered.length} items</span>
      </div>

      <div className="pt__wrap">
        <table className="pt__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>MRP</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="pt__empty">Koi product nahi mila 🔍</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="pt__row">
                <td><code className="pt__id">{p.id}</code></td>
                <td>
                  <div className="pt__name-cell">
                    <span className="pt__pname">{p.name}</span>
                    <span className="pt__brand">{p.brand}</span>
                  </div>
                </td>
                <td><span className="pt__cat-tag">{CATEGORIES.find(c => c.slug === p.category)?.icon} {p.category}</span></td>
                <td className="pt__price">₹{p.price}</td>
                <td className="pt__mrp">₹{p.mrp}</td>
                <td>
                  <span className={p.isService ? "pt__inf" : p.stock > 20 ? "pt__in-stock" : "pt__low-stock"}>
                    {p.isService ? "∞" : p.stock}
                  </span>
                </td>
                <td><span className="pt__rating">⭐ {p.rating}</span></td>
                <td>
                  <span className={p.isService ? "pt__tag-service" : "pt__tag-product"}>
                    {p.isService ? "Service" : "Product"}
                  </span>
                </td>
                <td>
                  <div className="pt__actions">
                    <button className="pt__edit-btn" onClick={() => onEdit(p)}>✏️</button>
                    <button className="pt__del-btn"  onClick={() => onDelete(p)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}