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

export const apiRegister = async (name, email, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
};

export const apiLogin = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const apiGetMe = async (token) => {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch user");
  return data;
};

export const apiGetCustomers = async (token) => {
  const res = await fetch(`${API_BASE_URL}/customers`, {
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch customers");
  return data;
};

export const apiAddCustomer = async (token, name) => {
  const res = await fetch(`${API_BASE_URL}/customers`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ name })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add customer");
  return data;
};

export const apiDeleteCustomer = async (token, customerId) => {
  const res = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
    method: "DELETE",
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete customer");
  return data;
};

export const apiAddTransaction = async (token, customerId, entry) => {
  const res = await fetch(`${API_BASE_URL}/customers/${customerId}/transactions`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(entry)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add transaction");
  return data;
};

export const apiDeleteTransaction = async (token, transactionId) => {
  const res = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
    method: "DELETE",
    headers: getHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete transaction");
  return data;
};
