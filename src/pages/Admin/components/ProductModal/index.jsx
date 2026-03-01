import { useState, useEffect } from "react";
import { CATEGORIES, EMPTY_PRODUCT, calcDiscount } from "../../constants";
import "./style.scss";

export default function ProductModal({ product, mode, onSave, onClose }) {
  const [form, setForm]       = useState(EMPTY_PRODUCT);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (mode === "edit" && product) {
      setForm({
        ...EMPTY_PRODUCT, ...product,
        price:  product.price?.toString()  || "",
        mrp:    product.mrp?.toString()    || "",
        stock:  product.stock?.toString()  || "",
        rating: product.rating?.toString() || "4.5",
        tags:   Array.isArray(product.tags) ? product.tags.join(", ") : (product.tags || ""),
      });
    } else {
      setForm({ ...EMPTY_PRODUCT, id: "p_" + Date.now() });
    }
  }, [mode, product]);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      setError("Name, price aur category zaroori hai!"); return;
    }
    setLoading(true); setError("");
    const price = parseFloat(form.price) || 0;
    const mrp   = parseFloat(form.mrp)   || price;
    const payload = {
      ...form, price, mrp,
      stock:           parseInt(form.stock)    || 0,
      rating:          parseFloat(form.rating) || 4.5,
      discountPercent: calcDiscount(price, mrp),
      tags: typeof form.tags === "string"
        ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
        : (form.tags || []),
    };
    try   { await onSave(payload, mode); }
    catch (err) { setError(err.message || "Error aaya!"); setLoading(false); }
  }

  const disc = calcDiscount(parseFloat(form.price), parseFloat(form.mrp));

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-modal" onClick={e => e.stopPropagation()}>
        <div className="pm-head">
          <h2>{mode === "edit" ? "✏️ Product Edit Karo" : "➕ Naya Product Add Karo"}</h2>
          <button className="pm-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="pm-form">
          <div className="pm-row2">
            <div className="pm-field">
              <label>Product ID *</label>
              <input value={form.id} onChange={e => set("id", e.target.value)}
                placeholder="p_001" disabled={mode === "edit"} />
            </div>
            <div className="pm-field">
              <label>Category *</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="pm-field">
            <label>Product Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Product ka naam" />
          </div>

          <div className="pm-row2">
            <div className="pm-field">
              <label>Brand</label>
              <input value={form.brand} onChange={e => set("brand", e.target.value)} placeholder="Brand naam" />
            </div>
            <div className="pm-field">
              <label>Sub Category</label>
              <input value={form.subCategory} onChange={e => set("subCategory", e.target.value)} placeholder="e.g. Cosmetics" />
            </div>
          </div>

          <div className="pm-row3">
            <div className="pm-field">
              <label>Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0" min="0" />
            </div>
            <div className="pm-field">
              <label>MRP (₹) {disc > 0 && <span className="pm-disc">{disc}% off</span>}</label>
              <input type="number" value={form.mrp} onChange={e => set("mrp", e.target.value)} placeholder="0" min="0" />
            </div>
            <div className="pm-field">
              <label>Stock</label>
              <input type="number" value={form.stock} onChange={e => set("stock", e.target.value)} placeholder="0" min="0" />
            </div>
          </div>

          <div className="pm-row2">
            <div className="pm-field">
              <label>Rating (0–5)</label>
              <input type="number" value={form.rating} onChange={e => set("rating", e.target.value)} placeholder="4.5" min="0" max="5" step="0.1" />
            </div>
            <div className="pm-field">
              <label>Image URL</label>
              <input value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div className="pm-field">
            <label>Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="Product ki description..." rows={3} />
          </div>

          <div className="pm-field">
            <label>Tags (comma se alag karo)</label>
            <input value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="tag1, tag2, tag3" />
          </div>

          <div className="pm-checks">
            <label className="pm-check">
              <input type="checkbox" checked={form.isService} onChange={e => set("isService", e.target.checked)} />
              <span>Yeh ek Service hai 🛠️</span>
            </label>
            <label className="pm-check">
              <input type="checkbox" checked={form.deliveryAvailable} onChange={e => set("deliveryAvailable", e.target.checked)} />
              <span>Delivery Available 🚚</span>
            </label>
          </div>

          {form.isService && (
            <div className="pm-row2">
              <div className="pm-field">
                <label>Price Type</label>
                <select value={form.priceType} onChange={e => set("priceType", e.target.value)}>
                  <option value="fixed">Fixed</option>
                  <option value="variable">Variable (onwards)</option>
                </select>
              </div>
              <div className="pm-field">
                <label>Processing Time</label>
                <input value={form.processingTime} onChange={e => set("processingTime", e.target.value)} placeholder="e.g. Same day" />
              </div>
            </div>
          )}

          {error && <div className="pm-error">⚠️ {error}</div>}

          <div className="pm-footer">
            <button type="button" className="pm-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="pm-save" disabled={loading}>
              {loading ? "⏳ Saving..." : mode === "edit" ? "✅ Update Karo" : "➕ Add Karo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}