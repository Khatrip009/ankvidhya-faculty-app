// src/lib/dailyProgress.api.js
import api from "./apiClient";

/* ======================================================
   Faculty Daily Progress – API layer
   Base path:
   /api/faculty-daily-progress
====================================================== */

/* -----------------------------
   LIST (filters + pagination)
----------------------------- */
export async function listDailyProgress(params = {}) {
  const res = await api.get("/api/faculty-daily-progress", {
    params
  });
  return res.data;
}

/* -----------------------------
   GET single by ID
----------------------------- */
export async function getDailyProgress(id) {
  if (!id) throw new Error("fpd_id required");
  const res = await api.get(`/api/faculty-daily-progress/${id}`);
  return res.data;
}

/* -----------------------------
   CREATE
----------------------------- */
export async function createDailyProgress(payload) {
  if (!payload) throw new Error("Payload required");
  const res = await api.post("/api/faculty-daily-progress", payload);
  return res.data;
}

/* -----------------------------
   UPDATE
----------------------------- */
export async function updateDailyProgress(id, payload) {
  if (!id) throw new Error("fpd_id required");
  if (!payload) throw new Error("Payload required");

  const res = await api.put(
    `/api/faculty-daily-progress/${id}`,
    payload
  );
  return res.data;
}

/* -----------------------------
   DELETE
----------------------------- */
export async function deleteDailyProgress(id) {
  if (!id) throw new Error("fpd_id required");
  const res = await api.delete(`/api/faculty-daily-progress/${id}`);
  return res.data;
}

/* -----------------------------
   BULK INSERT
----------------------------- */
export async function bulkInsertDailyProgress(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Array of items required");
  }

  const res = await api.post(
    "/api/faculty-daily-progress/bulk-insert",
    items
  );
  return res.data;
}

/* -----------------------------
   BULK UPSERT
----------------------------- */
export async function bulkUpsertDailyProgress(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Array of items required");
  }

  const res = await api.post(
    "/api/faculty-daily-progress/bulk-upsert",
    items
  );
  return res.data;
}

/* -----------------------------
   EXPORT CSV (Axios-safe)
----------------------------- */
export async function exportDailyProgressCSV(params = {}) {
  const res = await api.get(
    "/api/faculty-daily-progress/export/csv",
    {
      params,
      responseType: "blob"
    }
  );

  const blob = new Blob([res.data], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "faculty_daily_progress.csv";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/* -----------------------------
   IMPORT CSV
----------------------------- */
export async function importDailyProgressCSV(csvText) {
  if (!csvText) throw new Error("CSV text required");

  const res = await api.post(
    "/api/faculty-daily-progress/import/csv",
    { csv: csvText }
  );
  return res.data;
}

/* -----------------------------
   DEFAULT EXPORT
----------------------------- */
export default {
  listDailyProgress,
  getDailyProgress,
  createDailyProgress,
  updateDailyProgress,
  deleteDailyProgress,
  bulkInsertDailyProgress,
  bulkUpsertDailyProgress,
  exportDailyProgressCSV,
  importDailyProgressCSV
};
