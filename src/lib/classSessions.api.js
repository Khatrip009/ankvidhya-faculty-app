// src/lib/classSessions.api.js
import api from "./api";

/**
 * Faculty READ-ONLY APIs for class sessions
 * Backend RLS will enforce access safety
 */

/**
 * List class sessions
 * Filters supported:
 * - from, to
 * - session_date
 * - school_id, std_id, div_id
 * - page, pageSize
 */
export async function listClassSessions(params = {}) {
  return api.get("/api/class-sessions", {
    query: params,
  });
}

/**
 * Download ICS calendar (faculty schedule)
 * Requires employee_id (usually from /me)
 */
export function downloadFacultyICS(params = {}) {
  const q = new URLSearchParams(params).toString();
  const base = "/api/class-sessions/ics";
  window.open(q ? `${base}?${q}` : base, "_blank");
}

export default {
  listClassSessions,
  downloadFacultyICS,
};
