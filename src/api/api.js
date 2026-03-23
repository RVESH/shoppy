// ─── Products Fetch ─────────────────────────
export async function fetchProducts({ category, search, sort } = {}) {
  const params = new URLSearchParams();

  if (category && category !== "all") params.append("category", category);
  if (search) params.append("search", search);
  if (sort) params.append("sort", sort);

  const query = params.toString();
  const url = query
    ? `/products?${query}`
    : `/products`;

  const data = await apiFetch(url);
  return data.data;
}

// ─── Single Product ─────────────────────────
export async function fetchProductById(id) {
  const data = await apiFetch(`/products?id=${id}`);
  return data.data;
}

// ─── Categories ─────────────────────────────
export async function fetchCategories() {
  const data = await apiFetch(`/categories`);
  return data.data;
}


const BASE_URL = "https://slcart.rishabh-gaurav-verma.workers.dev/api";

// 🔹 Handle response (error fix)
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

// 🔹 Get token
function getToken() {
  return localStorage.getItem("token");
}

// 🔹 Universal API fetch
async function apiFetch(url, options = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options,
  });

  return handleResponse(res);
};



// Signup
export const signupSendOTP = (name, email, phone, password) =>
  apiFetch("/signup.php", {
    method: "POST",
    body: JSON.stringify({ step: "send_otp", name, email, phone, password })
  });

export const signupVerifyOTP = (name, email, phone, password, otp) =>
  apiFetch("/signup.php", {
    method: "POST",
    body: JSON.stringify({ step: "verify_otp", name, email, phone, password, otp })
  });

// Login
export async function loginWithPassword(identifier, password) {
  const data = await apiFetch("/login.php", {
    method: "POST",
    body: JSON.stringify({ method: "password", identifier, password })
  });

  // ✅ Save JWT
  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
}

// OTP Login
export const loginSendOTP = (identifier) =>
  apiFetch("/login.php", {
    method: "POST",
    body: JSON.stringify({ method: "otp_send", identifier })
  });

export const loginVerifyOTP = async (identifier, otp) => {
  const data = await apiFetch("/login.php", {
    method: "POST",
    body: JSON.stringify({ method: "otp_verify", identifier, otp })
  });

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};

// Logout
export function logout() {
  localStorage.removeItem("token");
};

export const forgotSendOTP = (identifier) =>
  apiFetch("/forgot-password.php", {
    method: "POST",
    body: JSON.stringify({ step: "send_otp", identifier })
  });

export async function forgotVerifyOTP(identifier, otp) {
  const data = await apiFetch("/forgot-password.php", {
    method: "POST",
    body: JSON.stringify({ step: "verify_otp", identifier, otp })
  });

  // ✅ IMPORTANT FIX
  if (data.reset_token) {
    localStorage.setItem("reset_token", data.reset_token);
  }

  return data;
}

export async function resetPassword(password) {
  const token = localStorage.getItem("reset_token");

  if (!token) throw new Error("Reset token missing");

  const data = await apiFetch("/reset-password.php", {
    method: "POST",
    body: JSON.stringify({ reset_token: token, password })
  });

  // ✅ cleanup
  localStorage.removeItem("reset_token");

  return data;
};


export const saveOrder = (orderData) =>
  apiFetch("/orders.php", {
    method: "POST",
    body: JSON.stringify(orderData)
  });

export const fetchUserOrders = () =>
  apiFetch("/orders.php");

export const fetchProfile = () =>
  apiFetch("/profile.php");

export const updateProfile = (data) =>
  apiFetch("/profile.php", {
    method: "PUT",
    body: JSON.stringify(data)
  });







  