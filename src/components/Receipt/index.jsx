/* eslint-disable */
import { useRef } from "react";
import "./style.scss";

const WHATSAPP = "916206869543";

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const WaSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Receipt({ order, onClose }) {
  const printRef = useRef(null);
  if (!order) return null;

  const { orderId, customer, items, totalPrice, totalSaved, createdAt } = order;
  const totalMrp = totalPrice + (totalSaved || 0);

  function handlePrint() { window.print(); }

  function handleWhatsApp() {
    const lines = [
      `🧾 *ORDER RECEIPT — SL Cart*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📦 Order ID: *${orderId}*`,
      `📅 ${formatDate(createdAt)}`,
      ``,
      `👤 *${customer.name}*`,
      `📞 ${customer.phone}`,
      `📍 ${customer.address}`,
      customer.note ? `📝 ${customer.note}` : "",
      ``,
      `*Items:*`,
      ...items.map((item, i) => {
        const v = Object.entries(item.variants || {}).filter(([,val]) => val).map(([k,v]) => `${k}: ${v}`).join(", ");
        return `${i+1}. ${item.name}${v ? ` (${v})` : ""} ×${item.quantity} = ₹${(item.price * item.quantity).toLocaleString()}`;
      }),
      ``,
      totalSaved > 0 ? `💰 Discount: -₹${totalSaved.toLocaleString()}` : "",
      `✅ *Total: ₹${totalPrice.toLocaleString()}*`,
      `🚚 Delivery: FREE`,
      ``,
      `SL Cart — Your Local Store! 🛍️`,
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`, "_blank");
  }

  return (
    <>
      <div className="rcBackdrop noPrint" onClick={onClose} />

      <div className="rcSheet" ref={printRef}>

        {/* ── Close button ── */}
        <button className="rcCloseBtn noPrint" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* ── Receipt paper ── */}
        <div className="rcPaper">

          {/* Header */}
          <div className="rcTop">
            <div className="rcStoreBadge">🛍️</div>
            <div className="rcStoreName">SL Cart</div>
            <div className="rcStoreTag">Your Local Store</div>
            <div className="rcTopDivider">
              <span/><span>ORDER RECEIPT</span><span/>
            </div>
          </div>

          {/* Order meta */}
          <div className="rcMeta">
            <div className="rcMetaItem">
              <span className="rcMetaLabel">Order ID</span>
              <span className="rcMetaVal rcOrderId">{orderId}</span>
            </div>
            <div className="rcMetaItem">
              <span className="rcMetaLabel">Date & Time</span>
              <span className="rcMetaVal">{formatDate(createdAt)}</span>
            </div>
            <div className="rcMetaItem">
              <span className="rcMetaLabel">Status</span>
              <span className="rcMetaVal rcStatusBadge">✓ Confirmed</span>
            </div>
          </div>

          <div className="rcDash" />

          {/* Customer */}
          <div className="rcSection">
            <div className="rcSectionHead">
              <span className="rcSectionDot" />
              Customer Details
            </div>
            <div className="rcCustomerGrid">
              <div className="rcCustItem rcCustFull">
                <span className="rcCustIcon">👤</span>
                <div>
                  <div className="rcCustLabel">Name</div>
                  <div className="rcCustVal">{customer.name}</div>
                </div>
              </div>
              <div className="rcCustItem">
                <span className="rcCustIcon">📞</span>
                <div>
                  <div className="rcCustLabel">Phone</div>
                  <div className="rcCustVal">{customer.phone}</div>
                </div>
              </div>
              <div className="rcCustItem rcCustFull">
                <span className="rcCustIcon">📍</span>
                <div>
                  <div className="rcCustLabel">Address</div>
                  <div className="rcCustVal">{customer.address}</div>
                </div>
              </div>
              {customer.note && (
                <div className="rcCustItem rcCustFull">
                  <span className="rcCustIcon">📝</span>
                  <div>
                    <div className="rcCustLabel">Note</div>
                    <div className="rcCustVal">{customer.note}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rcDash" />

          {/* Items */}
          <div className="rcSection">
            <div className="rcSectionHead">
              <span className="rcSectionDot" />
              Items ({items.length})
            </div>
            <div className="rcItemList">
              {items.map((item, i) => {
                const v = Object.entries(item.variants || {}).filter(([,val]) => val).map(([k,v]) => `${k}: ${v}`).join(", ");
                const lineTotal = item.price * item.quantity;
                const lineMrp   = (item.mrp || item.price) * item.quantity;
                return (
                  <div key={i} className="rcItemRow">
                    <div className="rcItemIdx">{i + 1}</div>
                    <div className="rcItemInfo">
                      <div className="rcItemName">{item.name}</div>
                      {v && <div className="rcItemVariant">{v}</div>}
                      <div className="rcItemQtyLine">
                        ₹{item.price.toLocaleString()} × {item.quantity}
                        {lineMrp > lineTotal && (
                          <span className="rcItemSave"> · saved ₹{(lineMrp - lineTotal).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="rcItemAmt">₹{lineTotal.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rcDash" />

          {/* Totals */}
          <div className="rcTotals">
            {totalMrp > totalPrice && (
              <div className="rcTotalRow">
                <span>Subtotal (MRP)</span>
                <span>₹{totalMrp.toLocaleString()}</span>
              </div>
            )}
            {totalSaved > 0 && (
              <div className="rcTotalRow rcTotalSaving">
                <span>🎉 Total Discount</span>
                <span>−₹{totalSaved.toLocaleString()}</span>
              </div>
            )}
            <div className="rcTotalRow">
              <span>Delivery</span>
              <span className="rcFree">FREE 🚚</span>
            </div>
            <div className="rcGrandRow">
              <span>Grand Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Savings banner */}
          {totalSaved > 0 && (
            <div className="rcSaveBanner">
              🎉 You saved ₹{totalSaved.toLocaleString()}!
            </div>
          )}

          {/* Thank you */}
          <div className="rcThank">
            <div className="rcThankIcon">🙏</div>
            <div className="rcThankText">Thank you! Order placed successfully.</div>
            <div className="rcThankSub">We'll contact you soon.</div>
          </div>

          {/* Perforated edge */}
          <div className="rcPerf noPrint"><span/></div>

          {/* Actions */}
          <div className="rcActions noPrint">
            <button className="rcPrintBtn" onClick={handlePrint}>
              🖨️ Print
            </button>
            <button className="rcWaBtn" onClick={handleWhatsApp}>
              <WaSvg /> Share Receipt
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
