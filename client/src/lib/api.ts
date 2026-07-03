const BASE_URL = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

interface FetchOptions extends RequestInit {
  token?: string;
}

function getFingerprint() {
  const key = "adearn_device_fingerprint";
  let value = localStorage.getItem(key);
  if (!value) {
    value = `${crypto.randomUUID()}-${Date.now()}`;
    localStorage.setItem(key, value);
  }
  return value;
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...init } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Device-Fingerprint": getFingerprint(),
    ...(init.headers as Record<string, string>),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error ?? `HTTP error ${response.status}`);
  }
  return payload as T;
}

export const api = {
  get: <T>(path: string, options?: FetchOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body: unknown, options?: FetchOptions) => request<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown, options?: FetchOptions) => request<T>(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string, options?: FetchOptions) => request<T>(path, { ...options, method: "DELETE" }),
};
