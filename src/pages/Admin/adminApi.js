const ADMIN_API = "https://corsproxy.io/?https://shoppy.page.gd/shoppy_backend/api";

// Token localStorage mein store hoga
function getToken() {
  return localStorage.getItem("shoppy_admin_token") || "";
}

function setToken(token) {
  localStorage.setItem("shoppy_admin_token", token);
}

function clearToken() {
  localStorage.removeItem("shoppy_admin_token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Admin-Token": getToken(),
  };
}

// ── Login ─────────────────────────────────────────────────────
export async function adminLogin(username, password) {
  const res = await fetch(`${ADMIN_API}/admin_login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Login failed");
  setToken(data.token);
  return data;
}

// ── Session Check ─────────────────────────────────────────────
export async function checkSession() {
  const token = getToken();
  if (!token) return false;
  try {
    const res  = await fetch(`${ADMIN_API}/admin_login.php`, {
      headers: { "X-Admin-Token": token },
    });
    const data = await res.json();
    return data.loggedIn === true;
  } catch { return false; }
}

// ── Logout ────────────────────────────────────────────────────
export async function adminLogout() {
  clearToken();
}

// ── Fetch All Products ────────────────────────────────────────
export async function fetchAllProducts() {
  const res = await fetch(`${ADMIN_API}/admin.php`, {
    headers: authHeaders(),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// ── Add Product ───────────────────────────────────────────────
export async function addProduct(product) {
  const res = await fetch(`${ADMIN_API}/admin.php`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

// ── Update Product ────────────────────────────────────────────
export async function updateProduct(product) {
  const res = await fetch(`${ADMIN_API}/admin.php`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

// ── Delete Product ────────────────────────────────────────────
export async function deleteProduct(id) {
  const res = await fetch(`${ADMIN_API}/admin.php?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}