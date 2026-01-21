// src/lib/books.api.js
import api from "./apiClient";

/* ======================================================
   Books API
   Base route: /api/books
====================================================== */

/* -----------------------------
   LIST books (filters + pagination)
----------------------------- */
export async function listBooks(params = {}) {
  const res = await api.get("/api/books", {
    params,
  });
  return res.data;
}

/* -----------------------------
   GET single book
----------------------------- */
export async function getBook(id) {
  if (!id) throw new Error("book_id required");
  const res = await api.get(`/api/books/${id}`);
  return res.data;
}

/* -----------------------------
   CREATE book
----------------------------- */
export async function createBook(payload) {
  const res = await api.post("/api/books", payload);
  return res.data;
}

/* -----------------------------
   UPDATE book
----------------------------- */
export async function updateBook(id, payload) {
  if (!id) throw new Error("book_id required");
  const res = await api.put(`/api/books/${id}`, payload);
  return res.data;
}

/* -----------------------------
   DELETE book
----------------------------- */
export async function deleteBook(id) {
  if (!id) throw new Error("book_id required");
  const res = await api.delete(`/api/books/${id}`);
  return res.data;
}

/* -----------------------------
   EXPORT (optional – if added later)
----------------------------- */
// export async function exportBooksCSV(params = {}) {
//   const res = await api.get("/api/books/export/csv", {
//     params,
//     responseType: "blob",
//   });
//   return res;
// }

export default {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
