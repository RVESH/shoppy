// src/pages/UserDashboard/index.jsx
/* eslint-disable */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import "./style.scss";

const API = "https://shoppy-api.rishabh-gaurav-verma.workers.dev/api";

const STATUS_STEPS = ["Pending","Confirmed","Packed","Out for Delivery","Delivered"];
const STATUS_STYLE = {
  "Pending"          : { bg:"#fef3c7", color:"#92400e", icon:"⏳" },
  "Confirmed"        : { bg:"#dbeafe", color:"#1e40af", icon:"✅" },
  "Packed"           : { bg:"#ede9fe", color:"#5b21b6", icon:"📦" },
  "Out for Delivery" : { bg:"#d1fae5", color:"#065f46", icon:"🚚" },
  "Delivered"        : { bg:"#dcfce7", color:"#14532d", icon:"🎉" },
  "Cancelled"        : { bg:"#fee2e2", color:"#991b1b", icon:"❌" },
};

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab,      setTab]      = useState("orders");
  const [orders,   setOrders]   = useState([]);
  const [profile,  setProfile]  = useState(null);
  const [addresses,setAddresses]= useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading,  setLoading]  = useState(true);

  // Edit profile state
  const [editName,  setEditName]  = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [oldPass,   setOldPass]   = useState("");
  const [newPass,   setNewPass]   = useState("");
  const [confPass,  setConfPass]  = useState("");
  const [msg,       setMsg]       = useState({type:"",text:""});

  // New address state
  const [newAddr,   setNewAddr]   = useState({ label:"Home", address:"", city:"", pincode:"", is_default:false });
  const [showAddrForm, setShowAddrForm] = useState(false);

  useEffect(() => { if (!user) navigate("/login"); }, [user]);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchOrders(), fetchProfile()]);
  }, [user]);

  async function fetchOrders() {
    try {
      const res  = await fetch(`${API}/orders.php`, { headers: { "Authorization": `Bearer ${user.token}` } });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch {} finally { setLoading(false); }
  }

  async function fetchProfile() {
    try {
      const res  = await fetch(`${API}/profile.php`, { headers: { "Authorization": `Bearer ${user.token}` } });
      const data = await res.json();
      if (data.success) {
        setProfile(data.user); setAddresses(data.addresses);
        setEditName(data.user.name); setEditPhone(data.user.phone);
      }
    } catch {}
  }

  async function saveProfile(e) {
    e.preventDefault(); setMsg({type:"",text:""});
    const res = await fetch(`${API}/profile.php`, {
      method:"PUT", headers:{"Content-Type":"application/json","Authorization":`Bearer ${user.token}`},
      body: JSON.stringify({action:"profile", name:editName, phone:editPhone})
    }).then(r=>r.json());
    setMsg({ type: res.success?"success":"error", text: res.message });
  }

  async function changePassword(e) {
    e.preventDefault(); setMsg({type:"",text:""});
    if (newPass !== confPass) return setMsg({type:"error",text:"Passwords match nahi kar rahe"});
    const res = await fetch(`${API}/profile.php`, {
      method:"PUT", headers:{"Content-Type":"application/json","Authorization":`Bearer ${user.token}`},
      body: JSON.stringify({action:"password", old_password:oldPass, new_password:newPass})
    }).then(r=>r.json());
    setMsg({ type: res.success?"success":"error", text: res.message });
    if (res.success) { setOldPass(""); setNewPass(""); setConfPass(""); }
  }

  async function addAddress(e) {
    e.preventDefault();
    const res = await fetch(`${API}/profile.php`, {
      method:"PUT", headers:{"Content-Type":"application/json","Authorization":`Bearer ${user.token}`},
      body: JSON.stringify({action:"add_address", ...newAddr})
    }).then(r=>r.json());
    if (res.success) { setShowAddrForm(false); setNewAddr({label:"Home",address:"",city:"",pincode:"",is_default:false}); fetchProfile(); }
  }

  async function deleteAddress(id) {
    if (!window.confirm("Address delete karna hai?")) return;
    await fetch(`${API}/profile.php`, {
      method:"PUT", headers:{"Content-Type":"application/json","Authorization":`Bearer ${user.token}`},
      body: JSON.stringify({action:"delete_address", address_id:id})
    });
    fetchProfile();
  }

  if (!user) return null;

  return (
    <div className="dashPage">
      <aside className="dashSidebar">
        <div className="dashUserCard">
          <div className="dashAvatar">{user.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="dashUserName">{user.name}</div>
            <div className="dashUserEmail">{user.email}</div>
          </div>
        </div>
        <nav className="dashNav">
          {[["orders","📦","Mere Orders"],["profile","👤","Profile"],["addresses","📍","Addresses"],["settings","⚙️","Settings"]].map(([key,icon,label]) => (
            <button key={key} className={`dashNavItem ${tab===key?"dashNavActive":""}`} onClick={() => { setTab(key); setMsg({type:"",text:""}); }}>
              {icon} {label}
            </button>
          ))}
          <button className="dashNavItem dashNavLogout" onClick={() => { logout(); navigate("/"); }}>🚪 Logout</button>
        </nav>
      </aside>

      <main className="dashMain">

        {/* ══ ORDERS ══════════════════════════════════ */}
        {tab === "orders" && (
          <div className="dashSection">
            <h2 className="dashSectionTitle">📦 Mere Orders</h2>
            {loading ? <div className="dashLoading">⏳ Load ho raha hai...</div>
            : orders.length === 0 ? (
              <div className="dashEmpty">
                <div style={{fontSize:"3rem"}}>🛒</div>
                <p>Abhi koi order nahi hai</p>
                <button className="dashShopBtn" onClick={() => navigate("/products")}>🛍️ Shopping Karo</button>
              </div>
            ) : (
              <div className="dashOrders">
                {orders.map(order => {
                  const st = STATUS_STYLE[order.status] || STATUS_STYLE["Pending"];
                  const isOpen = expanded === order.order_id;
                  const stepIdx = STATUS_STEPS.indexOf(order.status);
                  return (
                    <div key={order.order_id} className="dashOrderCard">
                      <div className="dashOrderHeader" onClick={() => setExpanded(isOpen?null:order.order_id)}>
                        <div className="dashOrderLeft">
                          <div className="dashOrderId">#{order.order_id}</div>
                          <div className="dashOrderDate">{new Date(order.created_at).toLocaleDateString('hi-IN',{day:"2-digit",month:"short",year:"numeric"})}</div>
                        </div>
                        <div className="dashOrderRight">
                          <strong>₹{parseFloat(order.total_price).toFixed(0)}</strong>
                          <span className="dashOrderStatus" style={{background:st.bg,color:st.color}}>{st.icon} {order.status}</span>
                        </div>
                        <span className="dashOrderArrow">{isOpen?"▲":"▼"}</span>
                      </div>

                      {isOpen && (
                        <div className="dashOrderBody">
                          {/* Timeline */}
                          {order.status !== "Cancelled" && (
                            <div className="dashTimeline">
                              {STATUS_STEPS.map((s,i) => (
                                <div key={s} className={`dashTimelineStep ${i<=stepIdx?"dashTimelineDone":""}`}>
                                  <div className="dashTimelineDot">{i<stepIdx?"✓":i===stepIdx?st.icon:""}</div>
                                  <div className="dashTimelineLabel">{s}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Items */}
                          <div className="dashItemsList">
                            {(order.items||[]).map((item,i) => (
                              <div key={i} className="dashItem">
                                <span className="dashItemName">{item.name}</span>
                                <span className="dashItemQty">×{item.quantity}</span>
                                <span className="dashItemPrice">₹{item.price}</span>
                              </div>
                            ))}
                          </div>
                          <div className="dashDelivery">
                            <div>📍 {order.address}</div>
                            <div>📱 {order.phone}</div>
                            {order.note && <div>📝 {order.note}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ PROFILE ═════════════════════════════════ */}
        {tab === "profile" && (
          <div className="dashSection">
            <h2 className="dashSectionTitle">👤 Meri Profile</h2>
            {msg.text && <div className={`authAlert authAlert${msg.type==="success"?"Success":"Error"}`}>{msg.text}</div>}
            <div className="dashCard">
              <form className="dashForm" onSubmit={saveProfile}>
                <div className="authField"><label>👤 Naam</label><input value={editName} onChange={e=>setEditName(e.target.value)} required /></div>
                <div className="authField"><label>📧 Email</label><input value={profile?.email||""} disabled /></div>
                <div className="authField"><label>📱 Phone</label><input value={editPhone} onChange={e=>setEditPhone(e.target.value)} /></div>
                <button type="submit" className="authBtn">💾 Profile Save Karo</button>
              </form>
            </div>
          </div>
        )}

        {/* ══ ADDRESSES ═══════════════════════════════ */}
        {tab === "addresses" && (
          <div className="dashSection">
            <div className="dashSectionHeader">
              <h2 className="dashSectionTitle">📍 Saved Addresses</h2>
              <button className="dashAddBtn" onClick={() => setShowAddrForm(s=>!s)}>+ Address Add Karo</button>
            </div>

            {showAddrForm && (
              <div className="dashCard" style={{marginBottom:16}}>
                <form className="dashForm" onSubmit={addAddress}>
                  <div className="dashFormRow">
                    <div className="authField"><label>🏷️ Label</label>
                      <select value={newAddr.label} onChange={e=>setNewAddr(a=>({...a,label:e.target.value}))} className="dashSelect">
                        <option>Home</option><option>Work</option><option>Other</option>
                      </select>
                    </div>
                    <div className="authField" style={{flex:1}}><label>📍 Address</label><input value={newAddr.address} onChange={e=>setNewAddr(a=>({...a,address:e.target.value}))} required /></div>
                  </div>
                  <div className="dashFormRow">
                    <div className="authField"><label>🏙️ City</label><input value={newAddr.city} onChange={e=>setNewAddr(a=>({...a,city:e.target.value}))} required /></div>
                    <div className="authField"><label>📮 Pincode</label><input value={newAddr.pincode} onChange={e=>setNewAddr(a=>({...a,pincode:e.target.value}))} required maxLength={6} /></div>
                  </div>
                  <label className="dashCheckbox"><input type="checkbox" checked={newAddr.is_default} onChange={e=>setNewAddr(a=>({...a,is_default:e.target.checked}))} /> Default address set karo</label>
                  <button type="submit" className="authBtn">✅ Address Save Karo</button>
                </form>
              </div>
            )}

            <div className="dashAddressList">
              {addresses.length === 0 ? <p style={{color:"#78716c"}}>Koi saved address nahi hai</p>
              : addresses.map(addr => (
                <div key={addr.id} className="dashAddressCard">
                  <div className="dashAddressTop">
                    <span className="dashAddrLabel">{addr.label === "Home" ? "🏠" : addr.label === "Work" ? "💼" : "📍"} {addr.label}</span>
                    {addr.is_default==1 && <span className="dashAddrDefault">Default</span>}
                  </div>
                  <div className="dashAddrText">{addr.address}, {addr.city} — {addr.pincode}</div>
                  <button className="dashAddrDel" onClick={() => deleteAddress(addr.id)}>🗑️ Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ SETTINGS ════════════════════════════════ */}
        {tab === "settings" && (
          <div className="dashSection">
            <h2 className="dashSectionTitle">⚙️ Settings</h2>
            {msg.text && <div className={`authAlert authAlert${msg.type==="success"?"Success":"Error"}`}>{msg.text}</div>}
            <div className="dashCard">
              <h3 style={{marginBottom:16,fontWeight:800}}>🔒 Password Change Karo</h3>
              <form className="dashForm" onSubmit={changePassword}>
                <div className="authField"><label>Purana Password</label><input type="password" value={oldPass} onChange={e=>setOldPass(e.target.value)} required /></div>
                <div className="authField"><label>Naya Password</label><input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} required /></div>
                <div className="authField"><label>Confirm Password</label><input type="password" value={confPass} onChange={e=>setConfPass(e.target.value)} required /></div>
                <button type="submit" className="authBtn">🔐 Password Change Karo</button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}