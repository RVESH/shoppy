const ADMIN_API = "https://shoppy-api.rishabh-gaurav-verma.workers.dev/api";

function getToken()      { return localStorage.getItem("shoppy_admin_token") || ""; }
function setToken(t)     { localStorage.setItem("shoppy_admin_token", t); }
function clearToken()    { localStorage.removeItem("shoppy_admin_token"); }
function authHeaders()   { return { "Content-Type": "application/json", "X-Admin-Token": getToken() }; }

export async function adminLogin(username, password) {
  const res  = await fetch(`${ADMIN_API}/admin-login`, {
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
    const res  = await fetch(`${ADMIN_API}/admin-login`, {
      headers: { "X-Admin-Token": token },
    });
    const data = await res.json();
    return data.loggedIn === true;
  } catch { return false; }
}

export async function adminLogout() { clearToken(); }

export async function fetchAllProducts() {
  const res  = await fetch(`${ADMIN_API}/admin`, { headers: authHeaders() });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function addProduct(product) {
  const res  = await fetch(`${ADMIN_API}/admin`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(product),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

export async function updateProduct(product) {
  const res  = await fetch(`${ADMIN_API}/admin`, {
    method: "PUT", headers: authHeaders(), body: JSON.stringify(product),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

export async function deleteProduct(id) {
  const res  = await fetch(`${ADMIN_API}/admin?id=${encodeURIComponent(id)}`, {
    method: "DELETE", headers: authHeaders(),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}