/* eslint-disable */
import { useState } from "react";
import { useCart } from "../CartContext";
import { useOrders, generateOrderId } from "../OrderHistory";
import OrderReceipt from "../Receipt";
import "./style.scss";
import { useAuth } from "../AuthContext";
import LoginPopup  from "../LoginPopup";

const WHATSAPP = "916206869543";
const API = "https://slcart.rishabh-gaurav-verma.workers.dev";

export default function OrderModal({ onClose }) {
  const { items, totalPrice, totalMrp, totalSaved, clearCart } = useCart();
  const { saveOrder } = useOrders();
  const { user } = useAuth();

  const [step,      setStep]      = useState("form");
  const [form,      setForm]      = useState({ name:"", phone:"", address:"", note:"" });
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [receipt,   setReceipt]   = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [dbOrderId, setDbOrderId] = useState(null); // DB se aaya order_id

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())                 e.name    = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone   = "Enter valid 10-digit number";
    if (!form.address.trim())              e.address = "Address is required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) { setShowLogin(true); return; }
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setLoading(true);

    // ── DB mein save karo ────────────────────────────────
    let serverOrderId = null;
    try {
      const dbRes = await fetch(`${API}/api/orders.php?token=${user.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          phone:         form.phone,
          address:       form.address,
          note:          form.note || "",
          total_price:   totalPrice,
          items: items.map(i => ({
            product_id: i.id || 0,
            name:       i.name,
            price:      i.price,
            quantity:   i.quantity,
          }))
        })
      }).then(r => r.json());

      if (dbRes.success) {
        serverOrderId = dbRes.order_id;
        console.log("✅ DB Order saved:", serverOrderId);
      } else {
        console.error("❌ DB save failed:", dbRes.message);
      }
    } catch(err) {
      console.error("❌ DB error:", err);
    }

    // localStorage mein bhi save karo
    const localOrderData = {
      orderId: serverOrderId || generateOrderId(),
      customer: { ...form },
      items: items.map(i => ({
        id: i.id, name: i.name, brand: i.brand,
        price: i.price, mrp: i.mrp || i.price,
        quantity: i.quantity, variants: i.variants || {},
        category: i.category,
      })),
      totalMrp, totalSaved, totalPrice,
    };
    const saved = saveOrder(localOrderData);

    // ── WhatsApp message ─────────────────────────────────
    const itemLines = items.map(item => {
      const v = Object.entries(item.variants || {})
        .filter(([, val]) => val).map(([k, v]) => `${k}: ${v}`).join(", ");
      const qty  = item.quantity > 1 ? ` ×${item.quantity}` : "";
      const vars = v ? ` [${v}]` : "";
      return `• ${item.name}${vars}${qty} — Rs.${(item.price * item.quantity).toLocaleString()}`;
    }).join("\n");

    const msg = [
      `Hi! I want to order:`, ``,
      itemLines, ``,
      totalSaved > 0
        ? `Total: Rs.${totalPrice.toLocaleString()} (Saved Rs.${totalSaved.toLocaleString()}! 🎉)`
        : `Total: Rs.${totalPrice.toLocaleString()}`,
      `Delivery: FREE 🚚`, ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address}`,
      form.note ? `Note: ${form.note}` : "",
      ``, `Order ID: ${serverOrderId || saved.orderId}`,
    ].filter(l => l !== null && l !== undefined).join("\n");

    const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

    setLoading(false);
    clearCart();

    // ── Receipt dikhao — WhatsApp automatically open karo ──
    // Bug fix: Receipt pehle dikhao, WhatsApp baad mein
    setReceipt({ ...saved, orderId: serverOrderId || saved.orderId });
    setStep("receipt");

    // WhatsApp new tab mein open karo
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 300);
  }

  if (step === "receipt" && receipt)
    return <OrderReceipt order={receipt} onClose={onClose} />;

  return (
    <>
      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onSuccess={() => setShowLogin(false)}
        />
      )}
      <div className="omBackdrop" onClick={onClose} />
      <div className="omModal">
        <div className="omHeader">
          <div className="omHeaderLeft">
            <span className="omHeaderIcon">📋</span>
            <div>
              <div className="omTitle">Fill Order Details</div>
              <div className="omSubtitle">{items.length} item{items.length>1?"s":""} · ₹{totalPrice.toLocaleString()}</div>
            </div>
          </div>
          <button className="omClose" onClick={onClose}>✕</button>
        </div>

        <div className="omBody">
          <div className="omSummary">
            <div className="omSummaryHead">🛍️ Your Items</div>
            <div className="omSummaryList">
              {items.map((item, i) => {
                const v = Object.entries(item.variants || {})
                  .filter(([, val]) => val).map(([k, v]) => `${k}: ${v}`).join(", ");
                return (
                  <div key={i} className="omSummaryItem">
                    <div className="omSummaryItemLeft">
                      <span className="omSummaryNum">{i+1}</span>
                      <span className="omSummaryName">{item.name}{v ? ` (${v})` : ""} ×{item.quantity}</span>
                    </div>
                    <span className="omSummaryPrice">₹{(item.price*item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
            {totalSaved > 0 && <div className="omSavings">🎉 Saved ₹{totalSaved.toLocaleString()}!</div>}
            <div className="omSummaryTotal"><span>Total</span><span>₹{totalPrice.toLocaleString()}</span></div>
          </div>

          <div className="omFields">
            <div className="omField">
              <label className="omLabel">Your Name *</label>
              <input name="name" placeholder="Enter full name" value={form.name}
                onChange={handleChange} className={errors.name ? "omInput omInputErr" : "omInput"} autoComplete="name" />
              {errors.name && <span className="omErr">⚠ {errors.name}</span>}
            </div>
            <div className="omField">
              <label className="omLabel">Phone Number *</label>
              <div className="omPhoneWrap">
                <span className="omPhonePrefix">🇮🇳 +91</span>
                <input name="phone" type="tel" placeholder="10-digit mobile" value={form.phone}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g,"").slice(0,10);
                    setForm(f => ({...f, phone: v}));
                    setErrors(prev => ({...prev, phone:""}));
                  }}
                  className={errors.phone ? "omInput omInputPhone omInputErr" : "omInput omInputPhone"} maxLength={10} />
              </div>
              {errors.phone && <span className="omErr">⚠ {errors.phone}</span>}
            </div>
            <div className="omField">
              <label className="omLabel">Delivery Address *</label>
              <textarea name="address" placeholder="Enter your full address..." rows={3}
                value={form.address} onChange={handleChange}
                className={errors.address ? "omInput omInputErr" : "omInput"} autoComplete="street-address" />
              {errors.address && <span className="omErr">⚠ {errors.address}</span>}
            </div>
            <div className="omField">
              <label className="omLabel">Note <span className="omOptional">(Optional)</span></label>
              <input name="note" placeholder="Any special instructions..." value={form.note}
                onChange={handleChange} className="omInput" />
            </div>
          </div>
        </div>

        <div className="omFooter">
          <button className="omCancel" onClick={onClose} disabled={loading}>Go Back</button>
          <button className="omSubmit" onClick={handleSubmit} disabled={loading}>
            {loading ? (<><span className="omSpinner" /> Saving...</>) : (<><span>📲</span> Order on WhatsApp</>)}
          </button>
        </div>
      </div>
    </>
  );
}