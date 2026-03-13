// src/admin/pages/AdminOrders/index.jsx
/* eslint-disable */
import { useState, useEffect } from "react";
import {
  fetchAllOrders,
  updateOrderStatus,
  verifyDeliveryOTP,
  ORDER_STATUSES,
  STATUS_STYLE,
} from "../Admin/adminApi";
  import "./style.scss";

export default function AdminOrders() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");
  const [selected, setSelected] = useState(null); // selected order for detail modal
  const [otpModal, setOtpModal] = useState(null); // { orderId, waUrl, otp }
  const [otpInput, setOtpInput] = useState("");
  const [otpMsg,   setOtpMsg]   = useState({ type: "", text: "" });
  const [updating, setUpdating] = useState(false);
  const [estTime,  setEstTime]  = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch(e) {
      console.error(e);
    } finally { setLoading(false); }
  }

  async function handleStatusUpdate(orderId, newStatus) {
    setUpdating(true);
    try {
      const res = await updateOrderStatus(orderId, newStatus, estTime || null);
      if (newStatus === "Out for Delivery" && res.otp) {
        setOtpModal({ orderId, otp: res.otp, waUrl: res.whatsapp_url });
      }
      await load();
      setSelected(prev => prev?.order_id === orderId
        ? { ...prev, status: newStatus }
        : prev
      );
    } catch(e) {
      alert("Error: " + e.message);
    } finally { setUpdating(false); }
  }

  async function handleVerifyOTP() {
    if (!otpInput || otpInput.length !== 6) return setOtpMsg({ type: "error", text: "6 digit OTP daalo" });
    setOtpMsg({ type: "", text: "" });
    const res = await verifyDeliveryOTP(otpModal.orderId, otpInput);
    setOtpMsg({ type: res.success ? "success" : "error", text: res.message });
    if (res.success) { setTimeout(() => { setOtpModal(null); setOtpInput(""); load(); }, 1200); }
  }

  // Filter + search
  const visible = orders.filter(o => {
    const matchFilter = filter === "all" || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.order_id?.toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.phone?.includes(q);
    return matchFilter && matchSearch;
  });

  // Counts for tabs
  const counts = ORDER_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  const nextStatus = (current) => {
    const idx = ORDER_STATUSES.indexOf(current);
    if (idx === -1 || idx >= ORDER_STATUSES.length - 2) return null; // Delivered/Cancelled → no next
    return ORDER_STATUSES[idx + 1];
  };

  return (
    <div className="aoPage">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="aoHeader">
        <h1 className="aoTitle">📦 Orders Management</h1>
        <button className="aoRefresh" onClick={load}>🔄 Refresh</button>
      </div>

      {/* ── Status Filter Tabs ──────────────────────────────── */}
      <div className="aoTabs">
        <button className={`aoTab ${filter==="all"?"aoTabActive":""}`} onClick={() => setFilter("all")}>
          All <span className="aoTabCount">{orders.length}</span>
        </button>
        {ORDER_STATUSES.map(s => {
          const st = STATUS_STYLE[s];
          return (
            <button key={s} className={`aoTab ${filter===s?"aoTabActive":""}`} onClick={() => setFilter(s)}>
              {st.icon} {s} {counts[s] > 0 && <span className="aoTabCount">{counts[s]}</span>}
            </button>
          );
        })}
      </div>

      {/* ── Search ─────────────────────────────────────────── */}
      <div className="aoSearch">
        <input
          placeholder="🔍 Order ID, naam, ya phone search karo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="aoSearchInput"
        />
      </div>

      {/* ── Orders Table ────────────────────────────────────── */}
      {loading ? (
        <div className="aoLoading">⏳ Orders load ho rahe hain...</div>
      ) : visible.length === 0 ? (
        <div className="aoEmpty">📭 Koi order nahi mila</div>
      ) : (
        <div className="aoTable">
          <div className="aoTableHead">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
            <span>Date</span>
            <span>Action</span>
          </div>
          {visible.map(order => {
            const st   = STATUS_STYLE[order.status] || STATUS_STYLE["Pending"];
            const next = nextStatus(order.status);
            return (
              <div key={order.order_id} className="aoRow" onClick={() => setSelected(order)}>
                <span className="aoOrderId">#{order.order_id}</span>
                <span>
                  <div className="aoCustomerName">{order.customer_name}</div>
                  <div className="aoCustomerPhone">📱 {order.phone}</div>
                </span>
                <span className="aoItemCount">{order.items?.length || 0} item(s)</span>
                <span className="aoTotal">₹{parseFloat(order.total_price).toFixed(0)}</span>
                <span>
                  <span className="aoStatus" style={{ background: st.bg, color: st.color }}>
                    {st.icon} {order.status}
                  </span>
                </span>
                <span className="aoDate">
                  {new Date(order.created_at).toLocaleDateString("hi-IN", { day: "2-digit", month: "short" })}
                </span>
                <span onClick={e => e.stopPropagation()}>
                  {next && order.status !== "Cancelled" && (
                    <button
                      className="aoNextBtn"
                      disabled={updating}
                      onClick={() => handleStatusUpdate(order.order_id, next)}
                    >
                      {next === "Out for Delivery" ? "🚚 Dispatch" : `→ ${next}`}
                    </button>
                  )}
                  {order.status === "Out for Delivery" && (
                    <button
                      className="aoOtpBtn"
                      onClick={() => { setOtpModal({ orderId: order.order_id }); setOtpInput(""); setOtpMsg({ type:"",text:"" }); }}
                    >
                      🔐 Verify OTP
                    </button>
                  )}
                  {order.status !== "Cancelled" && order.status !== "Delivered" && (
                    <button
                      className="aoCancelBtn"
                      disabled={updating}
                      onClick={() => { if(window.confirm("Cancel karna hai?")) handleStatusUpdate(order.order_id, "Cancelled"); }}
                    >
                      ✕
                    </button>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Order Detail Modal ──────────────────────────────── */}
      {selected && (
        <div className="aoModalBackdrop" onClick={() => setSelected(null)}>
          <div className="aoModal" onClick={e => e.stopPropagation()}>
            <div className="aoModalHeader">
              <div>
                <div className="aoModalTitle">Order #{selected.order_id}</div>
                <div className="aoModalDate">{new Date(selected.created_at).toLocaleString("hi-IN")}</div>
              </div>
              <button className="aoModalClose" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="aoModalBody">
              {/* Status badge */}
              {(() => { const st = STATUS_STYLE[selected.status] || STATUS_STYLE["Pending"]; return (
                <div className="aoModalStatus" style={{ background: st.bg, color: st.color }}>
                  {st.icon} {selected.status}
                </div>
              ); })()}

              {/* Customer info */}
              <div className="aoModalSection">
                <div className="aoModalSectionTitle">👤 Customer</div>
                <div className="aoModalInfo"><span>Naam:</span> {selected.customer_name}</div>
                <div className="aoModalInfo"><span>Phone:</span> {selected.phone}</div>
                <div className="aoModalInfo"><span>Address:</span> {selected.address}</div>
                {selected.note && <div className="aoModalInfo"><span>Note:</span> {selected.note}</div>}
              </div>

              {/* Items */}
              <div className="aoModalSection">
                <div className="aoModalSectionTitle">🛍️ Items</div>
                {(selected.items || []).map((item, i) => (
                  <div key={i} className="aoModalItem">
                    <span>{item.name}</span>
                    <span>×{item.quantity}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
                <div className="aoModalTotal">
                  <span>Total:</span>
                  <span>₹{parseFloat(selected.total_price).toFixed(0)}</span>
                </div>
              </div>

              {/* Estimated delivery */}
              {selected.status !== "Delivered" && selected.status !== "Cancelled" && (
                <div className="aoModalSection">
                  <div className="aoModalSectionTitle">⏰ Estimated Delivery</div>
                  <input
                    className="aoEstInput"
                    placeholder="e.g. Aaj 6 PM, Kal dopahar"
                    value={estTime}
                    onChange={e => setEstTime(e.target.value)}
                  />
                </div>
              )}
              {selected.estimated_delivery && (
                <div className="aoModalInfo"><span>📅 Delivery time:</span> {selected.estimated_delivery}</div>
              )}

              {/* Status update buttons */}
              {selected.status !== "Delivered" && selected.status !== "Cancelled" && (
                <div className="aoModalSection">
                  <div className="aoModalSectionTitle">🔄 Status Update Karo</div>
                  <div className="aoStatusBtns">
                    {ORDER_STATUSES.filter(s => s !== "Pending" && s !== selected.status).map(s => (
                      <button
                        key={s}
                        className="aoStatusBtn"
                        style={{ background: STATUS_STYLE[s]?.bg, color: STATUS_STYLE[s]?.color }}
                        disabled={updating}
                        onClick={() => handleStatusUpdate(selected.order_id, s)}
                      >
                        {STATUS_STYLE[s]?.icon} {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* OTP verify (if Out for Delivery) */}
              {selected.status === "Out for Delivery" && (
                <div className="aoModalSection">
                  <div className="aoModalSectionTitle">🔐 Delivery OTP Verify</div>
                  <div className="aoOtpRow">
                    <input
                      className="aoOtpInput"
                      placeholder="6-digit OTP"
                      maxLength={6}
                      value={otpInput}
                      onChange={e => setOtpInput(e.target.value.replace(/\D/g,"").slice(0,6))}
                    />
                    <button className="aoOtpVerifyBtn" onClick={handleVerifyOTP}>✅ Verify</button>
                  </div>
                  {otpMsg.text && (
                    <div className={`aoOtpMsg ${otpMsg.type === "success" ? "aoOtpSuccess" : "aoOtpError"}`}>
                      {otpMsg.text}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── OTP Sent Modal (after dispatch) ─────────────────── */}
      {otpModal?.otp && (
        <div className="aoModalBackdrop" onClick={() => setOtpModal(null)}>
          <div className="aoModal aoOtpSentModal" onClick={e => e.stopPropagation()}>
            <div className="aoModalHeader">
              <div className="aoModalTitle">🚚 Order Dispatched!</div>
              <button className="aoModalClose" onClick={() => setOtpModal(null)}>✕</button>
            </div>
            <div className="aoModalBody" style={{ textAlign: "center" }}>
              <p>Customer ko OTP bhej diya gaya hai (Email + WhatsApp)</p>
              <div className="aoOtpDisplay">{otpModal.otp}</div>
              <p style={{ color: "#78716c", fontSize: "0.85rem" }}>Ye OTP 15 min mein expire hoga</p>
              {otpModal.waUrl && (
                <a href={otpModal.waUrl} target="_blank" rel="noreferrer" className="aoWaBtn">
                  📲 WhatsApp pe bhi bhejo
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}