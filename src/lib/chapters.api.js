// src/lib/chapters.api.js
import api from "./apiClient";

/* ======================================================
   Chapters API
   Base route: /api/chapters
====================================================== */

/* -----------------------------
   LIST chapters (filters + pagination)
----------------------------- */
export async function listChapters(params = {}) {
  const res = await api.get("/api/chapters", {
    params,
  });
  return res.data;
}

/* -----------------------------
   GET single chapter
----------------------------- */
export async function getChapter(id) {
  if (!id) throw new Error("chapter_id required");
  const res = await api.get(`/api/chapters/${id}`);
  return res.data;
}

/* -----------------------------
   CREATE chapter
----------------------------- */
export async function createChapter(payload) {
  const res = await api.post("/api/chapters", payload);
  return res.data;
}

/* -----------------------------
   UPDATE chapter
----------------------------- */
export async function updateChapter(id, payload) {
  if (!id) throw new Error("chapter_id required");
  const res = await api.put(`/api/chapters/${id}`, payload);
  return res.data;
}

/* -----------------------------
   DELETE chapter
----------------------------- */
export async function deleteChapter(id) {
  if (!id) throw new Error("chapter_id required");
  const res = await api.delete(`/api/chapters/${id}`);
  return res.data;
}

/* -----------------------------
   BULK INSERT
----------------------------- */
export async function bulkInsertChapters(items = []) {
  if (!Array.isArray(items) || !items.length) {
    throw new Error("Array of items required");
  }
  const res = await api.post("/api/chapters/bulk-insert", items);
  return res.data;
}

/* -----------------------------
   BULK UPSERT
----------------------------- */
export async function bulkUpsertChapters(items = []) {
  if (!Array.isArray(items) || !items.length) {
    throw new Error("Array of items required");
  }
  const res = await api.post("/api/chapters/bulk-upsert", items);
  return res.data;
}

/* -----------------------------
   EXPORT CSV
----------------------------- */
export async function exportChaptersCSV(params = {}) {
  const res = await api.get("/api/chapters/export/csv", {
    params,
    responseType: "blob",
  });
  return res;
}

/* -----------------------------
   IMPORT CSV
----------------------------- */
export async function importChaptersCSV(csvText) {
  if (!csvText) throw new Error("CSV text required");
  const res = await api.post("/api/chapters/import/csv", {
    csv: csvText,
  });
  return res.data;
}

export default {
  listChapters,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter,
  bulkInsertChapters,
  bulkUpsertChapters,
  exportChaptersCSV,
  importChaptersCSV,
};
