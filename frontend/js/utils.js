// Commented for typescript conflict
// const API = "http://localhost:3000";

// export function getToken() {
//   return localStorage.getItem("token");
// }

// export function setToken(token) {
//   localStorage.setItem("token", token);
// }

// export function clearToken() {
//   localStorage.removeItem("token");
// }

// export function redirectToLogin() {
//   window.location.href = "login.html";
// }

// export async function apiRequest(endpoint, method = "GET", body = null) {
//   const token = getToken();
//   const headers = {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: "Bearer " + token } : {}),
//   };
//   const res = await fetch(API + endpoint, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : null,
//   });
//   if (!res.ok) {
//     if (res.status === 401) {
//       clearToken();
//       redirectToLogin();
//       return;
//     }
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || "API Error");
//   }
//   // Handle empty responses (204 No Content or 200 with empty body)
//   if (res.status === 204) {
//     return {};
//   }
  
//   // Check if response has content
//   const contentLength = res.headers.get('content-length');
//   if (contentLength === '0') {
//     return {};
//   }
  
//   // Try to parse JSON, return empty object if parsing fails
//   try {
//     const text = await res.text();
//     return text ? JSON.parse(text) : {};
//   } catch (error) {
//     console.warn('Failed to parse response as JSON:', error);
//     return {};
//   }
// }
