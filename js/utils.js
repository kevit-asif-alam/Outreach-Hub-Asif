// utils.js
const API = 'http://localhost:3000';

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export function redirectToLogin() {
  window.location.href = 'login.html';
}

export async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: 'Bearer ' + token } : {})
  };
  const res = await fetch(API + endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
      redirectToLogin();
      return;
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'API Error');
  }
  return res.status !== 204 ? res.json() : {};
}
