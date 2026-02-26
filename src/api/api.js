// ─── API Base URL ─────────────────────────────────────────────
// Development mein apna localhost daalo
// Production mein apna PHP server ka URL daalo
const BASE_URL = "https://shoppy.page.gd/shoppy_backend/api";
// ─── Sab Products Fetch ───────────────────────────────────────
export async function fetchProducts({ category, search, sort } = {}) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.append("category", category);
  if (search)   params.append("search", search);
  if (sort)     params.append("sort", sort);

  const url = `${BASE_URL}/products.php?${params.toString()}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.success) throw new Error(data.message);
  return data.data; // array of products
}

// ─── Single Product Fetch ─────────────────────────────────────
export async function fetchProductById(id) {
  const res  = await fetch(`${BASE_URL}/products.php?id=${id}`);
  const data = await res.json();

  if (!data.success) throw new Error(data.message);
  return data.data; // single product object
}

// ─── Categories Fetch ─────────────────────────────────────────
export async function fetchCategories() {
  const res  = await fetch(`${BASE_URL}/categories.php`);
  const data = await res.json();

  if (!data.success) throw new Error(data.message);
  return data.data;
}

// ─── ADMIN — Naya Product Add ─────────────────────────────────
export async function addProduct(product, adminKey) {
  const res = await fetch(`${BASE_URL}/admin.php?key=${adminKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(product),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

// ─── ADMIN — Product Update ───────────────────────────────────
export async function updateProduct(product, adminKey) {
  const res = await fetch(`${BASE_URL}/admin.php?key=${adminKey}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(product),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

// ─── ADMIN — Product Delete ───────────────────────────────────
export async function deleteProduct(id, category, adminKey) {
  const res = await fetch(
    `${BASE_URL}/admin.php?key=${adminKey}&id=${id}&category=${category}`,
    { method: "DELETE" }
  );
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}
