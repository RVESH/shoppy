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

  const [step,    setStep]    = useState("form");   // "form" | "receipt"
  const [form,    setForm]    = useState({ name:"", phone:"", address:"", note:"" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())                  e.name    = "Naam zaroori hai";
    if (!/^[6-9]\d{9}$/.test(form.phone))  e.phone   = "Valid 10-digit number daalo";
    if (!form.address.trim())               e.address = "Address zaroori hai";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
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

    // ── WhatsApp message ─────────────────────────────────────
    const itemLines = items.map(item => {
      const v = Object.entries(item.variants || {})
        .filter(([, val]) => val).map(([k, v]) => `${k}: ${v}`).join(", ");
      const qty  = item.quantity > 1 ? ` ×${item.quantity}` : "";
      const vars = v ? ` [${v}]` : "";
      return `• ${item.name}${vars}${qty} — Rs.${(item.price * item.quantity).toLocaleString()}`;
    }).join("\n");

    const msg = [
      `Hi! Mujhe ye items order karne hain:`,
      ``,
      itemLines,
      ``,
      totalSaved > 0
        ? `Total: Rs.${totalPrice.toLocaleString()} (Rs.${totalSaved.toLocaleString()} ki bachat! 🎉)`
        : `Total: Rs.${totalPrice.toLocaleString()}`,
      `Delivery: FREE 🚚`,
      ``,
      `Mera Details:`,
      `Naam: ${form.name}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address}`,
      form.note ? `Note: ${form.note}` : "",
      ``,
      `Order ID: ${saved.orderId}`,
    ].filter(l => l !== null && l !== undefined).join("\n");

    setTimeout(() => {
      setLoading(false);
      clearCart();
      setReceipt(saved);
      setStep("receipt");
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
    }, 700);
  }

  // ── Receipt screen ───────────────────────────────────────────
  if (step === "receipt" && receipt) {
    return <OrderReceipt order={receipt} onClose={onClose} />;
  }

  // ── Form screen ──────────────────────────────────────────────
  return (
    <>
      <div className="omBackdrop" onClick={onClose} />

      <div className="omModal">

        {/* Header */}
        <div className="omHeader">
          <div className="omHeaderLeft">
            <span className="omHeaderIcon">📋</span>
            <div>
              <div className="omTitle">Order Details Bharo</div>
              <div className="omSubtitle">{items.length} item{items.length>1?"s":""} · ₹{totalPrice.toLocaleString()}</div>
            </div>
          </div>
          <button className="omClose" onClick={onClose} aria-label="Band karo">✕</button>
        </div>

        <div className="omBody">

          {/* Items Summary */}
          <div className="omSummary">
            <div className="omSummaryHead">🛍️ Aapke Items</div>
            <div className="omSummaryList">
              {items.map((item, i) => {
                const v = Object.entries(item.variants || {})
                  .filter(([, val]) => val).map(([k, v]) => `${k}: ${v}`).join(", ");
                return (
                  <div key={i} className="omSummaryItem">
                    <div className="omSummaryItemLeft">
                      <span className="omSummaryNum">{i+1}</span>
                      <span className="omSummaryName">
                        {item.name}{v ? ` (${v})` : ""} ×{item.quantity}
                      </span>
                    </div>
                    <span className="omSummaryPrice">₹{(item.price*item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
            {totalSaved > 0 && (
              <div className="omSavings">🎉 ₹{totalSaved.toLocaleString()} ki bachat!</div>
            )}
            <div className="omSummaryTotal">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Form */}
          <div className="omFields">

            <div className="omField">
              <label className="omLabel">Aapka Naam *</label>
              <input
                name="name"
                placeholder="Poora naam likhein"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "omInput omInputErr" : "omInput"}
                autoComplete="name"
              />
              {errors.name && <span className="omErr">⚠ {errors.name}</span>}
            </div>

            <div className="omField">
              <label className="omLabel">Phone Number *</label>
              <div className="omPhoneWrap">
                <span className="omPhonePrefix">🇮🇳 +91</span>
                <input
                  name="phone"
                  type="tel"
                  placeholder="10-digit mobile"
                  value={form.phone}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g,"").slice(0,10);
                    setForm(f => ({...f, phone: v}));
                    setErrors(prev => ({...prev, phone:""}));
                  }}
                  className={errors.phone ? "omInput omInputPhone omInputErr" : "omInput omInputPhone"}
                  maxLength={10}
                />
              </div>
              {errors.phone && <span className="omErr">⚠ {errors.phone}</span>}
            </div>

            <div className="omField">
              <label className="omLabel">Delivery Address *</label>
              <textarea
                name="address"
                placeholder="Ghar ka pura address likhein..."
                rows={3}
                value={form.address}
                onChange={handleChange}
                className={errors.address ? "omInput omInputErr" : "omInput"}
                autoComplete="street-address"
              />
              {errors.address && <span className="omErr">⚠ {errors.address}</span>}
            </div>

            <div className="omField">
              <label className="omLabel">Note <span className="omOptional">(Optional)</span></label>
              <input
                name="note"
                placeholder="Koi special instruction ho toh likhein..."
                value={form.note}
                onChange={handleChange}
                className="omInput"
              />
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="omFooter">
          <button className="omCancel" onClick={onClose} disabled={loading}>
            Wapas Jao
          </button>
          <button className="omSubmit" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <><span className="omSpinner" /> Bhej rahe hain...</>
              : <><span>📲</span> WhatsApp Pe Order Karo</>
            }
          </button>
        </div>

      </div>
    </>
  );
}