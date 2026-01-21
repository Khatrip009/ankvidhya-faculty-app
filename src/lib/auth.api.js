// src/lib/auth.api.js
import api from "./apiClient";

/**
 * Named export — REQUIRED by FacultyCalendar.jsx
 * Usage:
 *   import { getMe } from "@/lib/auth.api";
 */
export async function getMe() {
  const res = await api.get("/api/auth/me");
  return res;
}

/**
 * Auth helper (backward compatible)
 */
const auth = {
  setToken(token) {
    if (token) localStorage.setItem("token", token);
  },

  clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("permissions");
  },

  async loadMe() {
    const res = await api.get("/api/auth/me");

    const me = res?.data || null;
    if (!me) throw new Error("Session not available");

    try {
      localStorage.setItem("user", JSON.stringify(me));
      localStorage.setItem(
        "role",
        (me.role_name || me.role || "").toString().toLowerCase()
      );
      if (me.permissions) {
        localStorage.setItem("permissions", JSON.stringify(me.permissions));
      }
    } catch {}

    return me;
  },
};

export default auth;
