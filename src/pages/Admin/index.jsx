import { useState, useEffect, useCallback } from "react";
import {
  adminLogin, checkSession, adminLogout,
  fetchAllProducts, addProduct, updateProduct, deleteProduct
} from "./adminApi";
import LoginPage     from "./components/LoginPage";
import Sidebar       from "./components/Sidebar";
import StatsBar      from "./components/StatsBar";
import ProductsTable from "./components/ProductsTable";
import ProductModal  from "./components/ProductModal";
import ConfirmModal  from "./components/ConfirmModal";
import Toast         from "./components/Toast";
import "./style.scss";

export default function Admin() {
  const [loggedIn, setLoggedIn]     = useState(false);
  const [checking, setChecking]     = useState(true);
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [modal, setModal]           = useState(null);
  const [confirm, setConfirm]       = useState(null);
  const [toast, setToast]           = useState(null);



  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (err) {
      if (err.message === "UNAUTHORIZED") { setLoggedIn(false); return; }
      showToast("Products load nahi hue: " + err.message, "error");
    }
    setLoading(false);
  }, []);

    // Session check
  useEffect(() => {
    checkSession().then(ok => {
      setLoggedIn(ok);
      setChecking(false);
      if (ok) loadProducts();
    });
  }, [loadProducts]);
  
  async function handleLogin(username, password) {
    await adminLogin(username, password);
    setLoggedIn(true);
    loadProducts();
  }

  async function handleLogout() {
    await adminLogout();
    setLoggedIn(false);
    setProducts([]);
  }

  function showToast(msg, type = "success") { setToast({ msg, type }); }

  async function handleSave(payload, mode) {
    if (mode === "edit") {
      await updateProduct(payload);
      showToast("Product update ho gaya! ✅");
    } else {
      await addProduct(payload);
      showToast("Naya product add ho gaya! ✅");
    }
    setModal(null);
    loadProducts();
  }

  async function handleDeleteConfirm() {
    try {
      await deleteProduct(confirm.product.id);
      showToast(`"${confirm.product.name}" delete ho gaya! 🗑️`);
      setConfirm(null);
      loadProducts();
    } catch (err) {
      showToast("Delete fail hua: " + err.message, "error");
      setConfirm(null);
    }
  }

  function handleNav(view) {
    if (view === "add") { setModal({ mode: "add", product: null }); return; }
    setActiveView(view);
  }

  if (checking) {
    return (
      <div className="admin-load-screen">
        <div className="admin-spinner">🛒</div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!loggedIn) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="admin-layout">
      <Sidebar
        active={activeView}
        onNav={handleNav}
        onLogout={handleLogout}
        productCount={products.length}
      />

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="admin-page-title">
              {activeView === "dashboard" ? "📊 Dashboard" : "📦 Products"}
            </h1>
            <p className="admin-page-sub">
              {activeView === "dashboard"
                ? "Apne store ka overview"
                : `${products.length} total products`}
            </p>
          </div>
          <div className="admin-header-right">
            <button className="admin-refresh-btn" onClick={loadProducts} disabled={loading}>
              {loading ? "⏳" : "🔄"} Refresh
            </button>
            <button className="admin-add-btn" onClick={() => setModal({ mode: "add", product: null })}>
              ➕ Add Product
            </button>
          </div>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="admin-loading">⏳ Loading products...</div>
          ) : activeView === "dashboard" ? (
            <StatsBar products={products} />
          ) : (
            <ProductsTable
              products={products}
              onEdit={p => setModal({ mode: "edit", product: p })}
              onDelete={p => setConfirm({ product: p })}
            />
          )}
        </div>
      </main>

      {modal && (
        <ProductModal
          mode={modal.mode}
          product={modal.product}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && (
        <ConfirmModal
          msg={`"${confirm.product.name}" ko permanently delete karna chahte ho?`}
          onConfirm={handleDeleteConfirm}
          onClose={() => setConfirm(null)}
        />
      )}

      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}