const API: string = "http://localhost:3000";

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function clearToken(): void {
  localStorage.removeItem("token");
}

export function redirectToLogin(): void {
  window.location.href = "login.html";
}

export async function apiRequest<T>(endpoint: string, method: string = "GET", body: any = null): Promise<T> {
  const token: string | null = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res: Response = await fetch(API + endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
      redirectToLogin();
      throw new Error("Unauthorized");
    }
    const err: any = await res.json().catch(() => ({}));
    throw new Error(err.message || "API Error");
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return {} as T;
  }
  
  try {
    const text: string = await res.text();
    return text ? JSON.parse(text) : {} as T;
  } catch (error) {
    console.warn('Failed to parse response as JSON:', error);
    return {} as T;
  }
}