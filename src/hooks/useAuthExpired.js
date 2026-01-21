// src/hooks/useAuthExpired.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuthExpired() {
  const navigate = useNavigate();

  useEffect(() => {
    function onExpired(e) {
      console.warn("Auth expired:", e?.detail?.message);
      navigate("/login", { replace: true });
    }

    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [navigate]);
}
