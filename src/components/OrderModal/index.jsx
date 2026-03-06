// src/components/OrderModal/index.jsx
// Order form → PHP backend pe save → WhatsApp pe msg
import { useState } from "react";
import { useCart } from "../CartContext";
import "./style.scss";

const WHATSAPP = "9798855030"; // ← apna number daalo
const ORDER_API = "https://shoppy.page.gd/shoppy_backend/api/save_order.php";

// Order number generator: SLC-YYYYMMDD-XXXX
function generateOrderId() {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SLC-${date}-${rand}`;
}

export default function OrderModal({ onClose }) {
  const { items, totalPrice, totalMrp, totalSaved, clearCart } = useCart();

  const [form, setForm] = useState({ name:"", phone:"", address:"", note:"" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [orderId, setOrderId] = useState("");

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  function validate() {
    if (!form.name.trim())              return "Naam zaroori hai";
    if (!/^[6-9]\d{9}$/.test(form.phone)) return "Valid 10-digit mobile number daalo";
    if (!form.address.trim())           return "Address zaroori hai";
    return "";
  }

  async function handleSubmit() {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    const oid = generateOrderId();

    const orderData = {
      orderId: oid,
      customer: { name: form.name, phone: form.phone, address: form.address, note: form.note },
      items: items.map(i => ({
        id: i.id, name: i.name, brand: i.brand,
        price: i.price, mrp: i.mrp || i.price,
        quantity: i.quantity,
        variants: i.variants || {},
        category: i.category,
      })),
      totalMrp, totalSaved, totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Save to PHP backend
    try {
      await fetch(ORDER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
    } catch(e) {
      // Even if save fails, WhatsApp pe toh bhejo
      console.warn("Order save failed:", e);
    }

    // WhatsApp message
    const lines = [
      `🛒 *New Order — SL Cart*`,
      `📦 Order ID: *${oid}*`,
      ``,
      `👤 *${form.name}*`,
      `📞 ${form.phone}`,
      `📍 ${form.address}`,
      form.note ? `📝 Note: ${form.note}` : "",
      ``,
      `*Items:*`,
      ...items.map((item,i) => {
        const v = Object.entries(item.variants||{}).filter(([,val])=>val).map(([k,v])=>`${k}:${v}`).join(", ");
        return `${i+1}. ${item.name}${v?` (${v})`:""}  ×${item.quantity}  ₹${(item.price*item.quantity).toLocaleString()}`;
      }),
      ``,
      totalSaved > 0 ? `💰 Discount: -₹${totalSaved.toLocaleString()}` : "",
      `✅ *Total: ₹${totalPrice.toLocaleString()}*`,
      `🚚 Delivery: FREE`,
    ].filter(Boolean).join("\n");

    setOrderId(oid);
    setLoading(false);
    setDone(true);

    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`, "_blank");
      clearCart();
      onClose();
    }, 1800);
  }

  return (
    <>
      <div className="omBackdrop" onClick={onClose} />
      <div className="omModal">

        <div className="omHeader">
          <span className="omTitle">📋 Order Details</span>
          <button className="omClose" onClick={onClose}>✕</button>
        </div>

        {done ? (
          // Success screen
          <div className="omSuccess">
            <div className="omSuccessIcon">🎉</div>
            <div className="omSuccessTitle">Order Ready!</div>
            <div className="omOrderId">{orderId}</div>
            <div className="omSuccessMsg">WhatsApp pe redirect ho raha hai...</div>
          </div>
        ) : (
          <div className="omBody">
            {/* Summary */}
            <div className="omSummary">
              <div className="omSummaryTitle">🛍️ {items.length} item(s) · ₹{totalPrice.toLocaleString()}</div>
              {items.map((item,i) => {
                const v = Object.entries(item.variants||{}).filter(([,val])=>val).map(([k,v])=>`${k}:${v}`).join(", ");
                return (
                  <div key={i} className="omSummaryItem">
                    <span>{item.name}{v ? ` (${v})` : ""} ×{item.quantity}</span>
                    <span>₹{(item.price*item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
              {totalSaved > 0 && (
                <div className="omSavings">🎉 ₹{totalSaved.toLocaleString()} ki bachat!</div>
              )}
            </div>

            {/* Form */}
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
                  value={form.address} onChange={handleChange} rows={3} />
              </div>
              <div className="omField">
                <label>Note (optional)</label>
                <input name="note" placeholder="Koi special instruction..."
                  value={form.note} onChange={handleChange} />
              </div>
            </div>

            {error && <div className="omError">⚠️ {error}</div>}
          </div>
        )}

        {!done && (
          <div className="omFooter">
            <button className="omCancel" onClick={onClose} disabled={loading}>Cancel</button>
            <button className="omSubmit" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <span className="omSpinner" />
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Pe Order Karo
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}