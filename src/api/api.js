// ============================================================
// SHoppy — api.js
// ============================================================

//const BASE_URL = "https://shoppy.page.gd/shoppy_backend/api";
//const BASE_URL = "/shoppy_backend/api"; // ← yeh karo
// const BASE_URL = "https://shoppy-api.rishabh-gaurav-verma.workers.dev/api"// PUBLIC API — Products & Categories
const BASE_URL = "https://shoppy-api.rishabh-gaurav-verma.workers.dev";
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

  const res  = await fetch(url);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// ─── Single Product ───────────────────────────────────────────
export async function fetchProductById(id) {
  const res  = await fetch(`${BASE_URL}/products.php?id=${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// ─── Categories ───────────────────────────────────────────────
export async function fetchCategories() {
  const res  = await fetch(`${BASE_URL}/categories.php`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// ════════════════════════════════════════════════════════════
// ADMIN API — Session based
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

// ─── Session Check ────────────────────────────────────────────
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

// ════════════════════════════════════════════════════════════
// USER AUTH API — JWT Token based
// ════════════════════════════════════════════════════════════

// ─── Helper: token header ─────────────────────────────────────
function authHeader(token) {
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

// ─── Signup: OTP Bhejo ────────────────────────────────────────
export async function signupSendOTP(name, email, phone, password) {
  const res  = await fetch(`${BASE_URL}/signup.php`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ step: "send_otp", name, email, phone, password }),
  });
  return await res.json();
}

// ─── Signup: OTP Verify + Account Banao ──────────────────────
export async function signupVerifyOTP(name, email, phone, password, otp) {
  const res  = await fetch(`${BASE_URL}/signup.php`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ step: "verify_otp", name, email, phone, password, otp }),
  });
  return await res.json();
}

// ─── Login: Password se ───────────────────────────────────────
export async function loginWithPassword(identifier, password) {
  const res  = await fetch(`${BASE_URL}/login.php`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ method: "password", identifier, password }),
  });
  return await res.json();
}

// ─── Login: OTP Bhejo ─────────────────────────────────────────
export async function loginSendOTP(identifier) {
  const res  = await fetch(`${BASE_URL}/login.php`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ method: "otp_send", identifier }),
  });
  return await res.json();
}

// ─── Login: OTP Verify ────────────────────────────────────────
export async function loginVerifyOTP(identifier, otp) {
  const res  = await fetch(`${BASE_URL}/login.php`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ method: "otp_verify", identifier, otp }),
  });
  return await res.json();
}

// ─── Forgot Password: OTP Bhejo ───────────────────────────────
export async function forgotSendOTP(identifier) {
  const res  = await fetch(`${BASE_URL}/forgot-password.php`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ step: "send_otp", identifier }),
  });
  return await res.json();
}

// ─── Forgot Password: OTP Verify ──────────────────────────────
export async function forgotVerifyOTP(identifier, otp) {
  const res  = await fetch(`${BASE_URL}/forgot-password.php`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ step: "verify_otp", identifier, otp }),
  });
  return await res.json();
}

// ─── Reset Password ───────────────────────────────────────────
export async function resetPassword(resetToken, password) {
  const res  = await fetch(`${BASE_URL}/reset-password.php`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ reset_token: resetToken, password }),
  });
  return await res.json();
}

// ─── Orders: Save ─────────────────────────────────────────────
export async function saveOrder(orderData, token) {
  const res = await fetch(`${BASE_URL}/orders.php?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify(orderData),
  });
  return await res.json();
}

// ─── Orders: Fetch (user ke saare orders) ────────────────────
export async function fetchUserOrders(token) {
  const res = await fetch(`${BASE_URL}/orders.php?token=${token}`, {
    headers: { ...authHeader(token) },
  });
  return await res.json();
}

// ─── Profile: Fetch ───────────────────────────────────────────
export async function fetchProfile(token) {
  const res = await fetch(`${BASE_URL}/profile.php?token=${token}`, {
    headers: { ...authHeader(token) },
  });
  return await res.json();
}

// ─── Profile: Update ──────────────────────────────────────────
export async function updateProfile(data, token) {
  const res = await fetch(`${BASE_URL}/profile.php?token=${token}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify(data),
  });
  return await res.json();
}