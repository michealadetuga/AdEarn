// ─── Shared Constants ─────────────────────────────────────────────────────────
// Constants shared between frontend and backend.

export const APP_NAME = "AdEarn";
export const APP_VERSION = "0.1.0";

export const API_ROUTES = {
  HEALTH: "/api/health",
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;
