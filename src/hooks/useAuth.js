import { useEffect, useState } from "react";

/**
 * useAuth
 * Reads authenticated user from localStorage
 * (populated by auth.api.js → loadMe())
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const role =
        localStorage.getItem("role") ||
        JSON.parse(raw || "{}")?.role ||
        JSON.parse(raw || "{}")?.role_name;

      if (raw) {
        const u = JSON.parse(raw);
        setUser({
          ...u,
          role: (role || "").toLowerCase(),
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
