const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getHeaders = (token) => {
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  } catch (err) {
    if (err.name === "TypeError" || err.message.includes("Failed to fetch")) {
      throw new Error(
        "Cannot connect to backend server. Please make sure your backend is running (`cd server` -> `npm start`)."
      );
    }
    throw err;
  }
};

export const apiRegister = async (name, email, password) => {
  return handleFetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password })
  });
};

export const apiLogin = async (email, password) => {
  return handleFetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  });
};

export const apiGetMe = async (token) => {
  return handleFetch(`${API_BASE_URL}/auth/me`, {
    headers: getHeaders(token)
  });
};

export const apiGetCustomers = async (token) => {
  return handleFetch(`${API_BASE_URL}/customers`, {
    headers: getHeaders(token)
  });
};

export const apiAddCustomer = async (token, name) => {
  return handleFetch(`${API_BASE_URL}/customers`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ name })
  });
};

export const apiDeleteCustomer = async (token, customerId) => {
  return handleFetch(`${API_BASE_URL}/customers/${customerId}`, {
    method: "DELETE",
    headers: getHeaders(token)
  });
};

export const apiAddTransaction = async (token, customerId, entry) => {
  return handleFetch(`${API_BASE_URL}/customers/${customerId}/transactions`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(entry)
  });
};

export const apiDeleteTransaction = async (token, transactionId) => {
  return handleFetch(`${API_BASE_URL}/transactions/${transactionId}`, {
    method: "DELETE",
    headers: getHeaders(token)
  });
};
