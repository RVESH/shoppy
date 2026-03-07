// src/components/Receipt/index.jsx
/* eslint-disable no-unused-vars */
import { useRef } from "react";
import "./style.scss";

const WHATSAPP = "6206869543"; // ← apna number daalo

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function Receipt({ order, onClose }) {
  const printRef = useRef(null);
  if (!order) return null;

  const { orderId, customer, items, totalPrice, totalSaved, createdAt } = order;

  function handlePrint() { window.print(); }

  function handleWhatsApp() {
    const lines = [
      `🧾 *ORDER RECEIPT — SL Cart*`,
      `━━━━━━━━━━━━━━━━━━`,
      `📦 Order ID: *${orderId}*`,
      `📅 Date: ${formatDate(createdAt)}`,
      ``,
      `*Customer Details:*`,
      `👤 Name: ${customer.name}`,
      `📞 Phone: ${customer.phone}`,
      `📍 Address: ${customer.address}`,
      customer.note ? `📝 Note: ${customer.note}` : "",
      ``,
      `*Order Items:*`,
      ...items.map((item, i) => {
        const v = Object.entries(item.variants || {}).filter(([,val]) => val).map(([k,v]) => `${k}:${v}`).join(", ");
        return `${i+1}. ${item.name}${v ? ` (${v})` : ""} ×${item.quantity} = ₹${(item.price * item.quantity).toLocaleString()}`;
      }),
      ``,
      totalSaved > 0 ? `💰 Discount: -₹${totalSaved.toLocaleString()}` : "",
      `✅ *Total: ₹${totalPrice.toLocaleString()}*`,
      `🚚 Delivery: FREE`,
      ``,
      `SL Cart — Apna Local Store! 🛍️`,
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`, "_blank");
  }

  return (
    <>
      <div className="rcBackdrop noPrint" onClick={onClose} />
      <div className="rcModal" ref={printRef}>

        <div className="rcHeader noPrint">
          <span className="rcHeaderTitle">🧾 Order Receipt</span>
          <button className="rcClose" onClick={onClose}>✕</button>
        </div>

        <div className="rcBody">
          <div className="rcBrand">
            <div className="rcBrandIcon">🛍️</div>
            <div className="rcBrandName">SL Cart</div>
            <div className="rcBrandSub">Apna Local Store</div>
          </div>

          <div className="rcOrderMeta">
            <div className="rcMetaRow">
              <span>Order ID</span>
              <span className="rcOrderId">{orderId}</span>
            </div>
            <div className="rcMetaRow">
              <span>Date</span>
              <span>{formatDate(createdAt)}</span>
            </div>
            <div className="rcMetaRow">
              <span>Status</span>
              <span className="rcStatus">✓ Placed</span>
            </div>
          </div>

          <div className="rcDivider" />

          <div className="rcSection">
            <div className="rcSectionTitle">Customer Details</div>
            <div className="rcCustomer">
              <div>👤 {customer.name}</div>
              <div>📞 {customer.phone}</div>
              <div>📍 {customer.address}</div>
              {customer.note && <div>📝 {customer.note}</div>}
            </div>
          </div>

          <div className="rcDivider" />

          <div className="rcSection">
            <div className="rcSectionTitle">Items ({items.length})</div>
            <div className="rcItems">
              {items.map((item, i) => {
                const v = Object.entries(item.variants || {}).filter(([,val]) => val).map(([k,v]) => `${k}: ${v}`).join(", ");
                return (
                  <div key={i} className="rcItem">
                    <div className="rcItemLeft">
                      <span className="rcItemNum">{i+1}</span>
                      <div>
                        <div className="rcItemName">{item.name}</div>
                        {v && <div className="rcItemVariant">{v}</div>}
                        <div className="rcItemQty">×{item.quantity}</div>
                      </div>
                    </div>
                    <div className="rcItemPrice">₹{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rcDivider" />

          <div className="rcTotals">
            {totalSaved > 0 && (
              <div className="rcTotalRow rcSaving">
                <span>💰 Discount</span>
                <span>−₹{totalSaved.toLocaleString()}</span>
              </div>
            )}
            <div className="rcTotalRow">
              <span>Delivery</span>
              <span className="rcFree">FREE</span>
            </div>
            <div className="rcTotalRow rcGrand">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="rcThankYou">
            🙏 Shukriya! Aapka order place ho gaya hai.
          </div>
        </div>

        <div className="rcFooter noPrint">
          <button className="rcPrintBtn" onClick={handlePrint}>🖨️ Print Receipt</button>
          <button className="rcWaBtn" onClick={handleWhatsApp}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp pe Bhejein...
          </button>
        </div>

      </div>
    </>
  );
}