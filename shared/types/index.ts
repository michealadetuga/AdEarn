// ─── Shared Types ────────────────────────────────────────────────────────────
// These types are shared between the frontend (client) and backend (server).

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthCheck {
  status: "ok" | "error";
  timestamp: string;
  uptime: number;
  environment: string;
}
