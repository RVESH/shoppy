// src/pages/Admin/adminApi.js
const BASE = "https://slcart.rishabh-gaurav-verma.workers.dev/api";
const ADMIN_KEY = "slcart_admin_2025";

function getToken()   { return localStorage.getItem("shoppy_admin_token") || ""; }
function setToken(t)  { localStorage.setItem("shoppy_admin_token", t); }
function clearToken() { localStorage.removeItem("shoppy_admin_token"); }

function authHeaders() {
  return { "Content-Type": "application/json", "X-Admin-Token": getToken() };
}
function adminKeyHeaders() {
  return { "Content-Type": "application/json", "X-Admin-Key": ADMIN_KEY };
}

export const ADMIN_API = BASE;

// ══ AUTH ══════════════════════════════════════════════════════
export async function adminLogin(username, password) {
  const res  = await fetch(`${BASE}/admin-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Login failed");
  setToken(data.token);
  return data;
}

export async function checkSession() {
  const token = getToken();
  if (!token) return false;
  try {
    const res  = await fetch(`${BASE}/admin-login`, {
      headers: { "X-Admin-Token": token }
    });
    const data = await res.json();
    return data.loggedIn === true;
  } catch { return false; }
}

export async function adminLogout() { clearToken(); }

// ══ PRODUCTS ══════════════════════════════════════════════════
export async function fetchAllProducts() {
  const res  = await fetch(`${BASE}/admin/products`, { headers: authHeaders() });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function addProduct(product) {
  const res  = await fetch(`${BASE}/admin/products`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(product),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

export async function updateProduct(product) {
  const res  = await fetch(`${BASE}/admin/products`, {
    method: "PUT", headers: authHeaders(), body: JSON.stringify(product),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

export async function deleteProduct(id) {
  const res  = await fetch(`${BASE}/admin/products?id=${encodeURIComponent(id)}`, {
    method: "DELETE", headers: authHeaders(),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

// ══ ORDERS ════════════════════════════════════════════════════
export async function fetchAllOrders() {
  const res  = await fetch(`${BASE}/admin/orders.php`, { headers: adminKeyHeaders() });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.orders;
}

export async function updateOrderStatus(orderId, status, estimatedDelivery = null) {
  const res  = await fetch(`${BASE}/orders.php`, {
    method: "PUT",
    headers: adminKeyHeaders(),
    body: JSON.stringify({ order_id: orderId, status, estimated_delivery: estimatedDelivery }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

export async function verifyDeliveryOTP(orderId, otp) {
  const res  = await fetch(`${BASE}/verify-delivery-otp.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: orderId, otp }),
  });
  return await res.json();
}

// ══ CONSTANTS ═════════════════════════════════════════════════
export const CATEGORIES = [
  { slug: "women-essentials",      name: "Women Essentials",   icon: "👗" },
  { slug: "mobile-accessories",    name: "Mobile Accessories", icon: "📱" },
  { slug: "grocery-fmcg",          name: "Grocery & FMCG",     icon: "🛒" },
  { slug: "service-hub",           name: "Services",           icon: "🛠️" },
  { slug: "household-essentials",  name: "Household",          icon: "🏠" },
  { slug: "tailoring-accessories", name: "Tailoring",          icon: "🧵" },
];

export const EMPTY_PRODUCT = {
  id: "", name: "", category: "women-essentials", subCategory: "",
  brand: "", description: "", price: "", mrp: "", stock: "", rating: "4.5",
  image: "", isService: false, deliveryAvailable: true, priceType: "fixed",
  processingTime: "", tags: "", variants: {}, documentsRequired: [],
};

export const ORDER_STATUSES = [
  "Pending", "Confirmed", "Packed", "Dispatched", "Out for Delivery", "Delivered", "Cancelled"
];

export const STATUS_STYLE = {
  "Pending"          : { bg: "#fef3c7", color: "#92400e", icon: "⏳" },
  "Confirmed"        : { bg: "#dbeafe", color: "#1e40af", icon: "✅" },
  "Packed"           : { bg: "#ede9fe", color: "#5b21b6", icon: "📦" },
  "Dispatched"       : { bg: "#fce7f3", color: "#9d174d", icon: "🚀" },
  "Out for Delivery" : { bg: "#d1fae5", color: "#065f46", icon: "🚚" },
  "Delivered"        : { bg: "#dcfce7", color: "#14532d", icon: "🎉" },
  "Cancelled"        : { bg: "#fee2e2", color: "#991b1b", icon: "❌" },
};

export const calcDiscount = (price, mrp) =>
  mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;