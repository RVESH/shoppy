// src/components/OrderModal/index.jsx
import { useState } from "react";
import { useCart } from "../CartContext";
import { useOrders, generateOrderId } from "../OrderHistory";  // ← updated
import OrderReceipt from "../Receipt";                     // ← updated
import "./style.scss";

const WHATSAPP = "919999999999"; // ← apna number daalo

export default function OrderModal({ onClose }) {
  const { items, totalPrice, totalMrp, totalSaved, clearCart } = useCart();
  const { saveOrder } = useOrders();

  const [form, setForm]       = useState({ name:"", phone:"", address:"", note:"" });
  const [error, setError]     = useState("");
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

    const lines = [
      `🛒 *New Order — SL Cart*`,
      `📦 Order ID: *${saved.orderId}*`,
      `📅 ${new Date().toLocaleString("en-IN")}`,
      ``,
      `👤 *${form.name}*`,
      `📞 ${form.phone}`,
      `📍 ${form.address}`,
      form.note ? `📝 ${form.note}` : "",
      ``,
      `*Items:*`,
      ...items.map((item, i) => {
        const v = Object.entries(item.variants||{}).filter(([,val])=>val).map(([k,v])=>`${k}:${v}`).join(", ");
        return `${i+1}. ${item.name}${v?` (${v})`:""} ×${item.quantity} = ₹${(item.price*item.quantity).toLocaleString()}`;
      }),
      ``,
      totalSaved > 0 ? `💰 Discount: -₹${totalSaved.toLocaleString()}` : "",
      `✅ *Total: ₹${totalPrice.toLocaleString()}*`,
      `🚚 Delivery: FREE`,
    ].filter(Boolean).join("\n");

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
          <div className="omSummary">
            <div className="omSummaryTitle">🛍️ {items.length} item(s) · ₹{totalPrice.toLocaleString()}</div>
            {items.map((item,i) => {
              const v = Object.entries(item.variants||{}).filter(([,val])=>val).map(([k,v])=>`${k}:${v}`).join(", ");
              return (
                <div key={i} className="omSummaryItem">
                  <span>{item.name}{v?` (${v})`:""} ×{item.quantity}</span>
                  <span>₹{(item.price*item.quantity).toLocaleString()}</span>
                </div>
              );
            })}
            {totalSaved > 0 && <div className="omSavings">🎉 ₹{totalSaved.toLocaleString()} ki bachat!</div>}
          </div>

          <div className="omFields">
            <div className="omField">
              <label>Aapka Naam *</label>
              <input name="name" placeholder="Full name likhein" value={form.name} onChange={handleChange} />
            </div>
            <div className="omField">
              <label>Phone Number *</label>
              <input name="phone" type="tel" placeholder="10-digit mobile" value={form.phone} onChange={handleChange} maxLength={10} />
            </div>
            <div className="omField">
              <label>Delivery Address *</label>
              <textarea name="address" placeholder="Pura address likhein..." rows={3} value={form.address} onChange={handleChange} />
            </div>
            <div className="omField">
              <label>Note (optional)</label>
              <input name="note" placeholder="Koi special instruction..." value={form.note} onChange={handleChange} />
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