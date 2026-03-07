// src/components/OrderModal/index.jsx
/* eslint-disable */
import { useState } from "react";
import { useCart } from "../CartContext";
import { useOrders, generateOrderId } from "../OrderHistory";
import OrderReceipt from "../Receipt";
import "./style.scss";

const WHATSAPP = "916206869543";

export default function OrderModal({ onClose }) {
  const { items, totalPrice, totalMrp, totalSaved, clearCart } = useCart();
  const { saveOrder } = useOrders();

  const [form,    setForm]    = useState({ name:"", phone:"", address:"", note:"" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  function validate() {
    if (!form.name.trim())                 return "Naam zaroori hai";
    if (!/^[6-9]\d{9}$/.test(form.phone)) return "Valid 10-digit mobile number daalo";
    if (!form.address.trim())              return "Address zaroori hai";
    return "";
  }

  function handleSubmit() {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);

    const orderData = {
      orderId:  generateOrderId(),
      customer: { ...form },
      items: items.map(i => ({
        id: i.id, name: i.name, brand: i.brand,
        price: i.price, mrp: i.mrp || i.price,
        quantity: i.quantity, variants: i.variants || {},
        category: i.category,
      })),
      totalMrp, totalSaved, totalPrice,
    };

    const saved = saveOrder(orderData);

    // ── WhatsApp message — simple aur clear format ──────────
    const itemLines = items.map(item => {
      const v = Object.entries(item.variants || {})
        .filter(([, val]) => val)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      const qty  = item.quantity > 1 ? ` (×${item.quantity})` : "";
      const vars = v ? ` [${v}]` : "";
      return `• ${item.name}${vars}${qty} - Rs.${(item.price * item.quantity).toLocaleString()}`;
    }).join("\n");

    const lines = [
      `Hi! Mujhe ye items order karne hain:`,
      ``,
      itemLines,
      ``,
      totalSaved > 0
        ? `Total: Rs.${totalPrice.toLocaleString()} (Rs.${totalSaved.toLocaleString()} ki bachat!)`
        : `Total: Rs.${totalPrice.toLocaleString()}`,
      `Delivery: FREE 🚚`,
      ``,
      `*Mera Details:*`,
      `Naam: ${form.name}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address}`,
      form.note ? `Note: ${form.note}` : "",
      ``,
      `Order ID: ${saved.orderId}`,
    ].filter(line => line !== undefined && line !== null && !(line === "" && lines && lines[lines.length-1] === ""))
     .join("\n");

    setTimeout(() => {
      setLoading(false);
      clearCart();
      setReceipt(saved);
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`, "_blank");
    }, 800);
  }

  if (receipt) return <OrderReceipt order={receipt} onClose={onClose} />;

  return (
    <>
      <div className="omBackdrop" onClick={onClose} />
      <div className="omModal">

        <div className="omHeader">
          <span className="omTitle">📋 Order Details</span>
          <button className="omClose" onClick={onClose}>✕</button>
        </div>

        <div className="omBody">

          {/* Items Summary */}
          <div className="omSummary">
            <div className="omSummaryTitle">
              🛍️ {items.length} item{items.length > 1 ? "s" : ""} · ₹{totalPrice.toLocaleString()}
            </div>
            {items.map((item, i) => {
              const v = Object.entries(item.variants || {})
                .filter(([, val]) => val)
                .map(([k, v]) => `${k}: ${v}`).join(", ");
              return (
                <div key={i} className="omSummaryItem">
                  <span>{item.name}{v ? ` (${v})` : ""} ×{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              );
            })}
            {totalSaved > 0 && (
              <div className="omSavings">🎉 ₹{totalSaved.toLocaleString()} ki bachat!</div>
            )}
          </div>

          {/* Form Fields */}
          <div className="omFields">
            <div className="omField">
              <label>Aapka Naam *</label>
              <input name="name" placeholder="Full name likhein"
                value={form.name} onChange={handleChange} />
            </div>
            <div className="omField">
              <label>Phone Number *</label>
              <input name="phone" type="tel" placeholder="10-digit mobile"
                value={form.phone} onChange={handleChange} maxLength={10} />
            </div>
            <div className="omField">
              <label>Delivery Address *</label>
              <textarea name="address" placeholder="Pura address likhein..."
                rows={3} value={form.address} onChange={handleChange} />
            </div>
            <div className="omField">
              <label>Note (optional)</label>
              <input name="note" placeholder="Koi special instruction..."
                value={form.note} onChange={handleChange} />
            </div>
          </div>

          {error && <div className="omError">⚠️ {error}</div>}
        </div>

        <div className="omFooter">
          <button className="omCancel" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="omSubmit" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="omSpinner" /> : "📲 WhatsApp Pe Order Karo"}
          </button>
        </div>

      </div>
    </>
  );
}