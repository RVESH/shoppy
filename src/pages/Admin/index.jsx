import { useState, useEffect } from "react";
import "./style.scss";

// ============================================================
// CONFIG
// ============================================================
const ADMIN_KEY = "shoppy_secret_123";
const BASE_URL  = "https://corsproxy.io/?https://shoppy.page.gd/shoppy_backend/api";

// ============================================================
// CATEGORIES
// ============================================================
const CATEGORIES = [
  { name: "Women Essentials",   slug: "women-essentials",       icon: "👗" },
  { name: "Mobile Accessories", slug: "mobile-accessories",      icon: "📱" },
  { name: "Grocery & FMCG",     slug: "grocery-fmcg",            icon: "🛒" },
  { name: "Services",           slug: "service-hub",             icon: "🛠️" },
  { name: "Household",          slug: "household-essentials",    icon: "🏠" },
  { name: "Tailoring",          slug: "tailoring-accessories",   icon: "🧵" },
];

// ============================================================
// EMPTY PRODUCT TEMPLATE
// ============================================================
const emptyProduct = {
  id: "",
  name: "",
  category: "women-essentials",
  subCategory: "",
  brand: "",
  description: "",
  price: "",
  mrp: "",
  discountPercent: 0,
  stock: "",
  rating: 4.5,
  image: "https://placehold.co/400x400",
  variants: { size: [], color: [] },
  tags: [],
  isService: false,
  deliveryAvailable: true,
  processingTime: null,
  priceType: "fixed",
  documentsRequired: [],
};

// ============================================================
// UTILITY
// ============================================================
function calcDiscount(price, mrp) {
  if (!price || !mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

// ============================================================
// TOAST
// ============================================================
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  if (!msg) return null;
  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  return (
    <div className={`admin-toast admin-toast--${type}`}>
      {icons[type] || "📢"} {msg}
    </div>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage({ onLogin }) {
  const [key, setKey] = useState("");
  const [err, setErr] = useState("");

  function handleLogin() {
    if (key === ADMIN_KEY) onLogin();
    else setErr("❌ Galat admin key! Dobara try karo.");
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-icon">🔐</div>
        <div className="admin-login-title">SHoppy Admin</div>
        <div className="admin-login-sub">Admin key dalo aage badhne ke liye</div>
        <input
          type="password"
          placeholder="Admin Key"
          value={key}
          onChange={e => { setKey(e.target.value); setErr(""); }}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          className="admin-input admin-input--center"
        />
        {err && <div className="admin-login-err">{err}</div>}
        <button onClick={handleLogin} className="admin-btn admin-btn--primary admin-btn--full">
          🚀 Login Karo
        </button>
        <div className="admin-login-hint">
          Default key: <code>shoppy_secret_123</code>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCT FORM MODAL
// ============================================================
function ProductModal({ product, onSave, onClose, mode }) {
  const [form, setForm]             = useState(product || { ...emptyProduct });
  const [saving, setSaving]         = useState(false);
  const [sizeInput, setSizeInput]   = useState((product?.variants?.size  || []).join(", "));
  const [colorInput, setColorInput] = useState((product?.variants?.color || []).join(", "));
  const [tagInput, setTagInput]     = useState((product?.tags            || []).join(", "));
  const [docsInput, setDocsInput]   = useState((product?.documentsRequired || []).join(", "));
  const [imgPreview, setImgPreview] = useState(product?.image || "https://placehold.co/400x400");

  function setField(key, val) {
    setForm(f => {
      const updated = { ...f, [key]: val };
      if (key === "price" || key === "mrp") {
        updated.discountPercent = calcDiscount(
          key === "price" ? val : updated.price,
          key === "mrp"   ? val : updated.mrp
        );
      }
      return updated;
    });
  }

  function handleImageChange(e) {
    setField("image", e.target.value);
    setImgPreview(e.target.value || "https://placehold.co/400x400");
  }

  async function handleSave() {
    if (!form.id || !form.name || !form.price) {
      alert("ID, Naam aur Price zaroori hai!");
      return;
    }
    setSaving(true);
    const finalForm = {
      ...form,
      price:  Number(form.price),
      mrp:    Number(form.mrp || form.price),
      stock:  Number(form.stock  || 0),
      rating: Number(form.rating || 4.5),
      variants: {
        size:  sizeInput.split(",").map(s => s.trim()).filter(Boolean),
        color: colorInput.split(",").map(s => s.trim()).filter(Boolean),
      },
      tags:              tagInput.split(",").map(s => s.trim()).filter(Boolean),
      documentsRequired: docsInput.split(",").map(s => s.trim()).filter(Boolean),
    };
    await onSave(finalForm, mode);
    setSaving(false);
  }

  const isEdit = mode === "edit";

  return (
    <div className="admin-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">

        {/* Header */}
        <div className="admin-modal__header">
          <div>
            <div className="admin-modal__title">
              {isEdit ? "✏️ Product Edit Karo" : "➕ Naya Product Add Karo"}
            </div>
            <div className="admin-modal__sub">
              {isEdit ? `ID: ${form.id}` : "Sabhi zaroori fields baro"}
            </div>
          </div>
          <button onClick={onClose} className="admin-btn admin-btn--ghost admin-modal__close">✕</button>
        </div>

        {/* Body */}
        <div className="admin-modal__body">

          {/* Image */}
          <div className="admin-section-title">📸 Product Image</div>
          <img
            src={imgPreview}
            alt="preview"
            className="admin-img-preview"
            onError={() => setImgPreview("https://placehold.co/400x400")}
          />
          <div className="admin-form-group">
            <label className="admin-label">Image URL</label>
            <input className="admin-input" value={form.image} onChange={handleImageChange} placeholder="https://..." />
          </div>

          {/* Basic Info */}
          <div className="admin-section-title">📝 Basic Info</div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-label">Product ID *</label>
              <input
                className={`admin-input ${isEdit ? "admin-input--disabled" : ""}`}
                value={form.id}
                onChange={e => setField("id", e.target.value)}
                disabled={isEdit}
                placeholder="w_001"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Product Name *</label>
              <input className="admin-input" value={form.name} onChange={e => setField("name", e.target.value)} placeholder="Product ka naam" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Brand</label>
              <input className="admin-input" value={form.brand} onChange={e => setField("brand", e.target.value)} placeholder="Brand naam" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Sub Category</label>
              <input className="admin-input" value={form.subCategory} onChange={e => setField("subCategory", e.target.value)} placeholder="Jaise: Cosmetics" />
            </div>
          </div>
          <div className="admin-form-group admin-mt-12">
            <label className="admin-label">Description</label>
            <textarea className="admin-textarea" value={form.description} onChange={e => setField("description", e.target.value)} placeholder="Product ki detail..." />
          </div>

          {/* Category & Type */}
          <div className="admin-section-title">🗂️ Category & Type</div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-label">Category *</label>
              <select className="admin-select" value={form.category} onChange={e => setField("category", e.target.value)}>
                {CATEGORIES.map(c => (
                  <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Type</label>
              <div className="admin-radio-group">
                {[["Product", false], ["Service", true]].map(([label, val]) => (
                  <label key={label} className="admin-radio-label">
                    <input type="radio" checked={form.isService === val} onChange={() => setField("isService", val)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="admin-section-title">💰 Pricing & Stock</div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-label">Selling Price (₹) *</label>
              <input className="admin-input" type="number" value={form.price} onChange={e => setField("price", e.target.value)} placeholder="299" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">MRP (₹)</label>
              <input className="admin-input" type="number" value={form.mrp} onChange={e => setField("mrp", e.target.value)} placeholder="399" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Discount % (Auto)</label>
              <input className="admin-input admin-input--readonly" value={`${form.discountPercent}%`} readOnly />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Stock</label>
              <input className="admin-input" type="number" value={form.stock} onChange={e => setField("stock", e.target.value)} placeholder="50" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Rating (0–5)</label>
              <input className="admin-input" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setField("rating", e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Price Type</label>
              <select className="admin-select" value={form.priceType} onChange={e => setField("priceType", e.target.value)}>
                <option value="fixed">Fixed</option>
                <option value="negotiable">Negotiable</option>
                <option value="quote">Quote pe</option>
              </select>
            </div>
          </div>

          {/* Variants */}
          <div className="admin-section-title">🎨 Variants & Tags</div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-label">Sizes (comma separated)</label>
              <input className="admin-input" value={sizeInput} onChange={e => setSizeInput(e.target.value)} placeholder="S, M, L, XL" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Colors (comma separated)</label>
              <input className="admin-input" value={colorInput} onChange={e => setColorInput(e.target.value)} placeholder="Red, Blue, Green" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Tags (comma separated)</label>
              <input className="admin-input" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="sale, new, trending" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Delivery Available?</label>
              <div className="admin-radio-group">
                {[["Haan ✅", true], ["Nahi ❌", false]].map(([label, val]) => (
                  <label key={label} className="admin-radio-label">
                    <input type="radio" checked={form.deliveryAvailable === val} onChange={() => setField("deliveryAvailable", val)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Service only */}
          {form.isService && (
            <>
              <div className="admin-section-title">🛠️ Service Details</div>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Processing Time</label>
                  <input className="admin-input" value={form.processingTime || ""} onChange={e => setField("processingTime", e.target.value)} placeholder="1-2 working days" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Documents Required (comma separated)</label>
                  <input className="admin-input" value={docsInput} onChange={e => setDocsInput(e.target.value)} placeholder="Aadhaar, Photo" />
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="admin-modal__footer">
          <button onClick={onClose} className="admin-btn admin-btn--plain">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn--primary">
            {saving ? "⏳ Saving..." : isEdit ? "✅ Save Changes" : "➕ Add Product"}
          </button>
        </div>

      </div>
    </div>
  );
}

// ============================================================
// CONFIRM DELETE MODAL
// ============================================================
function ConfirmModal({ msg, onConfirm, onClose }) {
  return (
    <div className="admin-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-confirm-card">
        <div className="admin-confirm-icon">⚠️</div>
        <div className="admin-confirm-title">Pakka Delete Karna Hai?</div>
        <div className="admin-confirm-msg">{msg}</div>
        <div className="admin-confirm-btns">
          <button onClick={onClose} className="admin-btn admin-btn--plain">Nahi, Raho</button>
          <button onClick={onConfirm} className="admin-btn admin-btn--danger">🗑️ Haan, Delete Karo</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STATS DASHBOARD
// ============================================================
function StatsView({ products }) {
  const totalProducts = products.filter(p => !p.isService).length;
  const totalServices = products.filter(p =>  p.isService).length;
  const lowStock      = products.filter(p => !p.isService && p.stock > 0 && p.stock < 5).length;
  const outOfStock    = products.filter(p => p.stock === 0).length;

  const stats = [
    { label: "Total Products", val: totalProducts, mod: "orange" },
    { label: "Total Services", val: totalServices, mod: "blue"   },
    { label: "Low Stock (<5)", val: lowStock,       mod: "amber"  },
    { label: "Out of Stock",   val: outOfStock,     mod: "red"    },
  ];

  const catBreakdown = CATEGORIES.map(c => ({
    ...c,
    count: products.filter(p => p.category === c.slug).length,
  }));

  return (
    <div>
      <div className="admin-stat-grid">
        {stats.map(s => (
          <div key={s.label} className={`admin-stat-card admin-stat-card--${s.mod}`}>
            <div className="admin-stat-num">{s.val}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="admin-card admin-card--padded">
        <div className="admin-card-title">📊 Category Breakdown</div>
        <div className="admin-cat-grid">
          {catBreakdown.map(c => (
            <div key={c.slug} className="admin-cat-item">
              <span className="admin-cat-icon">{c.icon}</span>
              <div>
                <div className="admin-cat-count">{c.count}</div>
                <div className="admin-cat-name">{c.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCTS TABLE
// ============================================================
function ProductsView({ products, onEdit, onDelete, onAdd }) {
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter  === "all" || p.category === catFilter;
    const matchType   = typeFilter === "all" || (typeFilter === "service" ? p.isService : !p.isService);
    return matchSearch && matchCat && matchType;
  });

  return (
    <div className="admin-card">
      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-wrap">
          <span className="admin-search-icon">🔍</span>
          <input
            className="admin-search-input"
            placeholder="Name ya ID se dhundo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="admin-select admin-select--auto" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="all">Sab Categories</option>
          {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
        </select>
        <select className="admin-select admin-select--auto" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">Products + Services</option>
          <option value="product">Sirf Products</option>
          <option value="service">Sirf Services</option>
        </select>
        <button onClick={onAdd} className="admin-btn admin-btn--primary admin-btn--sm">➕ Add New</button>
      </div>

      <div className="admin-result-count">{filtered.length} results mil rahe hain</div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {["Image","ID","Name","Category","Price","MRP","Discount","Stock","Rating","Type","Actions"].map(h => (
                <th key={h} className="admin-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={11} className="admin-td admin-td--empty">😔 Koi product nahi mila</td>
              </tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="admin-tr">
                <td className="admin-td">
                  <img
                    src={p.image || "https://placehold.co/48x48"}
                    alt={p.name}
                    className="admin-product-img"
                    onError={e => e.target.src = "https://placehold.co/48x48"}
                  />
                </td>
                <td className="admin-td admin-td--id">{p.id}</td>
                <td className="admin-td">
                  <div className="admin-product-name">{p.name}</div>
                  {p.brand && <div className="admin-product-brand">{p.brand}</div>}
                </td>
                <td className="admin-td">
                  <span className="admin-cat-emoji">{CATEGORIES.find(c => c.slug === p.category)?.icon}</span>
                  <span className="admin-product-brand">{p.subCategory}</span>
                </td>
                <td className="admin-td admin-td--price">₹{p.price}</td>
                <td className="admin-td admin-td--mrp">₹{p.mrp}</td>
                <td className="admin-td">
                  {p.discountPercent > 0 && <span className="admin-badge admin-badge--green">{p.discountPercent}% OFF</span>}
                </td>
                <td className="admin-td admin-td--stock">
                  {p.isService    ? <span className="admin-badge admin-badge--orange">∞</span>
                  : p.stock === 0 ? <span className="admin-badge admin-badge--red">Out</span>
                  : p.stock < 5   ? <span className="admin-badge admin-badge--orange">{p.stock} ⚠️</span>
                  :                 <span className="admin-stock-num">{p.stock}</span>}
                </td>
                <td className="admin-td">⭐ {p.rating}</td>
                <td className="admin-td">
                  <span className={`admin-badge ${p.isService ? "admin-badge--orange" : "admin-badge--green"}`}>
                    {p.isService ? "🛠️ Service" : "📦 Product"}
                  </span>
                </td>
                <td className="admin-td">
                  <div className="admin-action-btns">
                    <button onClick={() => onEdit(p)}   className="admin-btn admin-btn--ghost  admin-btn--sm">✏️</button>
                    <button onClick={() => onDelete(p)} className="admin-btn admin-btn--danger admin-btn--sm">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// MAIN ADMIN PANEL  ←  export default yahan hai
// ============================================================
export default function Admin() {
  const [loggedIn,    setLoggedIn]   = useState(false);
  const [activeTab,   setActiveTab]  = useState("dashboard");
  const [products,    setProducts]   = useState([]);
  const [loading,     setLoading]    = useState(false);
  const [toast,       setToast]      = useState({ msg: "", type: "success" });
  const [modal,       setModal]      = useState({ open: false, mode: "add", product: null });
  const [confirmDel,  setConfirmDel] = useState({ open: false, product: null });

  // Google Fonts load
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@700;800;900&display=swap";
    link.rel  = "stylesheet";
    document.head.appendChild(link);
  }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/products.php`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
      else showToast("Products load nahi hue: " + data.message, "error");
    } catch {
      showToast("API offline — demo data dikh raha hai", "info");
      setProducts([
        { id:"w_001",  name:"Lakme Lip Gloss",    category:"women-essentials",    subCategory:"Cosmetics",    brand:"Lakme",  description:"Smooth lip gloss",  price:199, mrp:249, discountPercent:20, stock:30,  rating:4.5, image:"https://placehold.co/400x400/ffedd5/ea580c?text=Lip+Gloss", isService:false, deliveryAvailable:true,  priceType:"fixed", variants:{size:[],color:["Red","Pink"]}, tags:["cosmetics"], processingTime:null,       documentsRequired:[] },
        { id:"g_001",  name:"Maggi Noodles 12pk", category:"grocery-fmcg",        subCategory:"Instant Food", brand:"Nestle", description:"Classic Maggi",      price:144, mrp:168, discountPercent:14, stock:100, rating:4.8, image:"https://placehold.co/400x400/f0fdf4/16a34a?text=Maggi",     isService:false, deliveryAvailable:true,  priceType:"fixed", variants:{},                            tags:["grocery"],   processingTime:null,       documentsRequired:[] },
        { id:"sv_001", name:"PAN Card Apply",      category:"service-hub",         subCategory:"Govt Services",brand:"SHoppy", description:"PAN card service",   price:150, mrp:150, discountPercent:0,  stock:999, rating:4.9, image:"https://placehold.co/400x400/fff1f2/e11d48?text=PAN",       isService:true,  deliveryAvailable:false, priceType:"fixed", variants:{},                            tags:["govt"],      processingTime:"2-3 days", documentsRequired:["Aadhaar","Photo"] },
        { id:"m_001",  name:"USB-C Cable 2m",      category:"mobile-accessories",  subCategory:"Charging",     brand:"Baseus", description:"Fast charge cable",  price:299, mrp:499, discountPercent:40, stock:3,   rating:4.3, image:"https://placehold.co/400x400/fdf4ff/9333ea?text=Cable",    isService:false, deliveryAvailable:true,  priceType:"fixed", variants:{},                            tags:["mobile"],    processingTime:null,       documentsRequired:[] },
        { id:"h_001",  name:"Vim Dishwash Bar",    category:"household-essentials", subCategory:"Kitchen",      brand:"Vim",    description:"Grease cut formula", price:35,  mrp:40,  discountPercent:12, stock:0,   rating:4.2, image:"https://placehold.co/400x400/eff6ff/2563eb?text=Vim",      isService:false, deliveryAvailable:true,  priceType:"fixed", variants:{},                            tags:["kitchen"],   processingTime:null,       documentsRequired:[] },
      ]);
    }
    setLoading(false);
  }

  useEffect(() => { if (loggedIn) loadProducts(); }, [loggedIn]);

  async function handleSave(formData, mode) {
    try {
      const method = mode === "edit" ? "PUT" : "POST";
      const res  = await fetch(`${BASE_URL}/admin.php?key=${ADMIN_KEY}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showToast(mode === "edit" ? "✅ Update ho gaya!" : "✅ Add ho gaya!", "success");
        setModal({ open: false, mode: "add", product: null });
        loadProducts();
      } else {
        showToast("Error: " + (data.message || "Kuch gadbad"), "error");
      }
    } catch {
      if (mode === "edit") setProducts(ps => ps.map(p => p.id === formData.id ? formData : p));
      else                 setProducts(ps => [...ps, formData]);
      showToast(mode === "edit" ? "✅ Demo: Update ho gaya!" : "✅ Demo: Add ho gaya!", "success");
      setModal({ open: false, mode: "add", product: null });
    }
  }

  async function handleDelete(product) {
    try {
      const res  = await fetch(`${BASE_URL}/admin.php?key=${ADMIN_KEY}&id=${product.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { showToast("🗑️ Delete ho gaya!", "success"); loadProducts(); }
      else showToast("Delete error: " + data.message, "error");
    } catch {
      setProducts(ps => ps.filter(p => p.id !== product.id));
      showToast("🗑️ Demo: Delete ho gaya!", "success");
    }
    setConfirmDel({ open: false, product: null });
  }

  function openAdd()    { setModal({ open: true,  mode: "add",  product: null }); }
  function openEdit(p)  { setModal({ open: true,  mode: "edit", product: p    }); }
  function openDel(p)   { setConfirmDel({ open: true, product: p }); }
  function closeModal() { setModal({ open: false, mode: "add",  product: null }); }

  // Show login if not logged in
  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  const navItems = [
    { key: "dashboard", icon: "📊", label: "Dashboard"    },
    { key: "products",  icon: "📦", label: "All Products" },
  ];

  return (
    <div className="admin-app">

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <span className="admin-sidebar__logo-text">SHoppy</span>
          <span className="admin-sidebar__logo-sub">Admin Panel</span>
        </div>
        <nav className="admin-sidebar__nav">
          {navItems.map(item => (
            <div
              key={item.key}
              className={`admin-nav-item ${activeTab === item.key ? "admin-nav-item--active" : ""}`}
              onClick={() => setActiveTab(item.key)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <div className="admin-nav-item admin-nav-item--add" onClick={openAdd}>
            <span className="admin-nav-icon">➕</span>
            <span>Add Product</span>
          </div>
        </nav>
        <div className="admin-sidebar__footer">
          <button onClick={() => setLoggedIn(false)} className="admin-btn admin-btn--logout">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="admin-main">

        {/* Top Bar */}
        <div className="admin-topbar">
          <div>
            <div className="admin-page-title">
              {activeTab === "dashboard" ? "📊 Dashboard" : "📦 All Products"}
            </div>
            <div className="admin-page-sub">
              {activeTab === "dashboard"
                ? `${products.length} total items`
                : "Manage karo sab products aur services"}
            </div>
          </div>
          <div className="admin-topbar__actions">
            <button onClick={loadProducts} className="admin-btn admin-btn--plain admin-btn--sm">
              {loading ? "⏳" : "🔄"} Refresh
            </button>
            <button onClick={openAdd} className="admin-btn admin-btn--primary admin-btn--sm">
              ➕ Add Product
            </button>
          </div>
        </div>

        {/* Page Content */}
        {loading ? (
          <div className="admin-loading">⏳ Products load ho rahe hain...</div>
        ) : activeTab === "dashboard" ? (
          <>
            <StatsView products={products} />
            <div className="admin-recent-wrap">
              <div className="admin-card-title">🕐 Recent Products</div>
              <ProductsView
                products={[...products].reverse().slice(0, 5)}
                onEdit={openEdit}
                onDelete={openDel}
                onAdd={openAdd}
              />
            </div>
          </>
        ) : (
          <ProductsView
            products={products}
            onEdit={openEdit}
            onDelete={openDel}
            onAdd={openAdd}
          />
        )}

      </main>

      {/* ── Modals ── */}
      {modal.open && (
        <ProductModal
          product={modal.mode === "edit" ? modal.product : null}
          mode={modal.mode}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
      {confirmDel.open && (
        <ConfirmModal
          msg={`"${confirmDel.product?.name}" permanently delete ho jaega!`}
          onConfirm={() => handleDelete(confirmDel.product)}
          onClose={() => setConfirmDel({ open: false, product: null })}
        />
      )}

      {/* ── Toast ── */}
      {toast.msg && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast({ msg: "", type: "success" })}
        />
      )}

    </div>
  );
}