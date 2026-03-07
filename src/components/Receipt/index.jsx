// src/components/Receipt/index.jsx
// Order ke baad dikhne wali receipt — print + WhatsApp
import "./style.scss";

const WHATSAPP = "919999999999"; // ← apna number daalo

export default function Receipt({ order, onClose }) {
  if (!order) return null;

  const { orderId, customer, items, totalPrice, totalSaved, createdAt } = order;

  const date = new Date(createdAt).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  function handlePrint() {
    window.print();
  }

  function handleWhatsApp() {
    const lines = [
      `🧾 *ORDER RECEIPT — SL Cart*`,
      ``,
      `📦 Order ID: *${orderId}*`,
      `📅 Date: ${date}`,
      ``,
      `👤 *Customer Details*`,
      `Name: ${customer.name}`,
      `Phone: ${customer.phone}`,
      `Address: ${customer.address}`,
      customer.note ? `Note: ${customer.note}` : "",
      ``,
      `*── Order Items ──*`,
      ...items.map((item, i) => {
        const v = Object.entries(item.variants || {}).filter(([,val]) => val).map(([k,v]) => `${k}: ${v}`).join(", ");
        return `${i+1}. ${item.name}${v ? ` (${v})` : ""}\n   Qty: ${item.quantity}  ×  ₹${item.price} = *₹${(item.price * item.quantity).toLocaleString()}*`;
      }),
      ``,
      totalSaved > 0 ? `💰 Discount Saved: ₹${totalSaved.toLocaleString()}` : "",
      `✅ *Total Amount: ₹${totalPrice.toLocaleString()}*`,
      `🚚 Delivery: FREE`,
      ``,
      `_Thank you for ordering from SL Cart! 🛍️_`,
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`, "_blank");
  }

  return (
    <>
      <div className="rcBackdrop" onClick={onClose} />
      <div className="rcModal" id="receipt-print">

        {/* Header */}
        <div className="rcHeader">
          <div className="rcLogo">🛍️ SL Cart</div>
          <div className="rcHeaderRight">
            <span className="rcStatus">✓ Order Placed</span>
            <button className="rcClose noPrint" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Order ID + Date */}
        <div className="rcOrderMeta">
          <div className="rcOrderId">{orderId}</div>
          <div className="rcOrderDate">{date}</div>
        </div>

        {/* Customer */}
        <div className="rcSection">
          <div className="rcSectionTitle">👤 Customer Details</div>
          <div className="rcCustomerGrid">
            <div><span>Name</span><strong>{customer.name}</strong></div>
            <div><span>Phone</span><strong>{customer.phone}</strong></div>
            <div className="rcFull"><span>Address</span><strong>{customer.address}</strong></div>
            {customer.note && <div className="rcFull"><span>Note</span><strong>{customer.note}</strong></div>}
          </div>
        </div>

        {/* Items */}
        <div className="rcSection">
          <div className="rcSectionTitle">🛒 Order Items</div>
          <div className="rcItemsList">
            {items.map((item, i) => {
              const v = Object.entries(item.variants || {}).filter(([,val]) => val).map(([k,v]) => `${k}: ${v}`).join(", ");
              const lineTotal = item.price * item.quantity;
              return (
                <div key={i} className="rcItem">
                  <div className="rcItemLeft">
                    <span className="rcItemNum">{i+1}</span>
                    <div>
                      <div className="rcItemName">{item.name}</div>
                      {v && <div className="rcItemVariant">{v}</div>}
                      <div className="rcItemQty">Qty: {item.quantity} × ₹{item.price}</div>
                    </div>
                  </div>
                  <div className="rcItemTotal">₹{lineTotal.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Summary */}
        <div className="rcSummary">
          {totalSaved > 0 && (
            <div className="rcSummaryRow rcSummaryGreen">
              <span>Discount Saved</span>
              <span>−₹{totalSaved.toLocaleString()}</span>
            </div>
          )}
          <div className="rcSummaryRow">
            <span>Delivery</span>
            <span className="rcFreeTag">FREE</span>
          </div>
          <div className="rcSummaryDivider" />
          <div className="rcSummaryRow rcSummaryTotal">
            <span>Total Amount</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Savings strip */}
        {totalSaved > 0 && (
          <div className="rcSavingsStrip">
            🎉 Aapne ₹{totalSaved.toLocaleString()} bachaye is order mein!
          </div>
        )}

        {/* Action Buttons */}
        <div className="rcActions noPrint">
          <button className="rcPrintBtn" onClick={handlePrint}>
            🖨️ Print Receipt
          </button>
          <button className="rcWaBtn" onClick={handleWhatsApp}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Receipt WhatsApp pe Bhejo
          </button>
        </div>

        <div className="rcFooter">
          Thank you for shopping with SL Cart! 🛍️
        </div>

      </div>
    </>
  );
}