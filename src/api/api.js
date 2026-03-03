// ============================================================
// SHoppy — api.js
// ============================================================

const BASE_URL = "https://shoppy.page.gd/shoppy_backend/api";
//const BASE_URL = "/shoppy_backend/api"; // ← yeh karo
// const BASE_URL = "https://corsproxy.io/?https://shoppy.page.gd/shoppy_backend/api";
// ════════════════════════════════════════════════════════════
// PUBLIC API — Products & Categories
// ════════════════════════════════════════════════════════════

// ─── Sab Products Fetch ───────────────────────────────────────
export async function fetchProducts({ category, search, sort } = {}) {
  const params = new URLSearchParams();

  if (category && category !== "all") params.append("category", category);
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);

  const query = params.toString();
  const url = query
    ? `${BASE_URL}/products.php?${query}`
    : `${BASE_URL}/products.php`;

const res = await fetch(url);

  const data = await res.json();
  if (!data.success) throw new Error(data.message);

  return data.data;
}

// ─── Single Product ───────────────────────────────────────────
export async function fetchProductById(id) {
  const res = await fetch(`${BASE_URL}/products.php?id=${id}`,);

  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}
// ─── Categories ───────────────────────────────────────────────
export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories.php`);

  const data = await res.json();
  if (!data.success) throw new Error(data.message);

  return data.data;
}
// ════════════════════════════════════════════════════════════
// ADMIN API — Session based (key kabhi URL mein nahi)
// credentials: "include" → session cookie automatically jaati hai
// ════════════════════════════════════════════════════════════

// ─── Login ────────────────────────────────────────────────────
export async function adminLogin(username, password) {
  const res  = await fetch(`${BASE_URL}/admin_login.php`, {
    method:      "POST",
    credentials: "include",
    headers:     { "Content-Type": "application/json" },
    body:        JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

// ─── Session Check (page reload pe) ──────────────────────────
export async function checkAdminSession() {
  const res  = await fetch(`${BASE_URL}/admin_login.php`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.loggedIn === true;
}

// ─── Logout ───────────────────────────────────────────────────
export async function adminLogout() {
  await fetch(`${BASE_URL}/admin_logout.php`, {
    method:      "POST",
    credentials: "include",
  });
}

// ─── Admin: Sab Products ──────────────────────────────────────
export async function adminFetchProducts() {
  const res  = await fetch(`${BASE_URL}/admin.php`, {
    credentials: "include",
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// ─── Admin: Product Add ───────────────────────────────────────
export async function addProduct(product) {
  const res  = await fetch(`${BASE_URL}/admin.php`, {
    method:      "POST",
    credentials: "include",
    headers:     { "Content-Type": "application/json" },
    body:        JSON.stringify(product),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

// ─── Admin: Product Update ────────────────────────────────────
export async function updateProduct(product) {
  const res  = await fetch(`${BASE_URL}/admin.php`, {
    method:      "PUT",
    credentials: "include",
    headers:     { "Content-Type": "application/json" },
    body:        JSON.stringify(product),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

// ─── Admin: Product Delete ────────────────────────────────────
export async function deleteProduct(id) {
  const res  = await fetch(`${BASE_URL}/admin.php?id=${id}`, {
    method:      "DELETE",
    credentials: "include",
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}