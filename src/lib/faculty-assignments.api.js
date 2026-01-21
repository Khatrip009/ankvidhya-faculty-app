// src/lib/faculty-assignments.api.js
import api from "./api";

export async function listMyAssignedSchools() {
  return api.get("/api/faculty-assignments", {
    query: { pageSize: 500 }
  });
}
