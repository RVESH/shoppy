// ─── SHoppy api.js ───────────────────────────────────────────
const BASE_URL = "https://shoppy.page.gd/shoppy_backend/api";

// ════════════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════════════

export async function fetchProducts({ category, search, sort } = {}) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.append("category", category);
  if (search) params.append("search", search);
  if (sort && sort !== "default") params.append("sort", sort);
  const query = params.toString();
  const url = query ? `${BASE_URL}/products.php?${query}` : `${BASE_URL}/products.php`;
  const res  = await fetch(url);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function fetchProductById(id) {
  const res  = await fetch(`${BASE_URL}/products.php?id=${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function fetchCategories() {
  const res  = await fetch(`${BASE_URL}/categories.php`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// ════════════════════════════════════════════════
// ADMIN API — Token based (localStorage)
// ════════════════════════════════════════════════

export async function adminLogin(username, password) {
  const res  = await fetch(`${BASE_URL}/admin_login.php`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  if (data.token) localStorage.setItem("adminToken", data.token);
  return data;
}

export async function checkAdminSession() {
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) return false;
    const res  = await fetch(`${BASE_URL}/admin_login.php`, {
      headers: { "X-Admin-Token": token },
    });
    const data = await res.json();
    return data.loggedIn === true;
  } catch {
    return false;
  }
}

export async function adminLogout() {
  localStorage.removeItem("adminToken");
  await fetch(`${BASE_URL}/admin_logout.php`, { method: "POST" });
}

export async function adminFetchProducts() {
  const token = localStorage.getItem("adminToken");
  const res   = await fetch(`${BASE_URL}/admin.php`, {
    headers: { "X-Admin-Token": token },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function addProduct(product) {
  const token = localStorage.getItem("adminToken");
  const res   = await fetch(`${BASE_URL}/admin.php`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Token": token },
    body:    JSON.stringify(product),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

export async function updateProduct(product) {
  const token = localStorage.getItem("adminToken");
  const res   = await fetch(`${BASE_URL}/admin.php`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json", "X-Admin-Token": token },
    body:    JSON.stringify(product),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

export async function deleteProduct(id) {
  const token = localStorage.getItem("adminToken");
  const res   = await fetch(`${BASE_URL}/admin.php?id=${id}`, {
    method:  "DELETE",
    headers: { "X-Admin-Token": token },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}