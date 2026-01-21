// =====================================================
// src/lib/profile.js
// Self-service Profile API (RLS-safe)
// =====================================================

import api from "./api";

/* ---------------------------
   Helpers
--------------------------- */

function extract(res) {
  if (!res) return null;
  if (res.data) return res.data;
  return res;
}

/* =====================================================
   PROFILE (ME)
===================================================== */

/**
 * Get current logged-in user's profile
 * Backend:
 *   GET /api/auth/me
 */
export async function getMyProfile() {
  const res = await api.get("/api/auth/me");
  return extract(res);
}

/**
 * Update profile (username / email)
 * Backend:
 *   PUT /api/users/me
 *
 * body = { username?, email? }
 */
export async function updateMyProfile(body) {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid profile update payload");
  }

  const res = await api.put("/api/users/me", body);
  return extract(res);
}

/**
 * Change own password
 * Backend:
 *   PUT /api/users/me
 *
 * body = {
 *   current_password,
 *   new_password
 * }
 */
export async function changeMyPassword({ current_password, new_password }) {
  if (!current_password || !new_password) {
    throw new Error("current_password and new_password are required");
  }

  const res = await api.put("/api/users/me", {
    current_password,
    new_password,
  });

  return extract(res);
}

/* =====================================================
   OPTIONAL: Profile Image Upload (future ready)
   (if you later add image upload to users/me)
===================================================== */

/**
 * Upload profile image
 * (Only works if backend supports multipart on /api/users/me)
 */
export async function uploadMyProfileImage(file) {
  if (!file) throw new Error("File required");

  const fd = new FormData();
  fd.append("image_file", file);

  const res = await api.put("/api/users/me", fd, {
    headers: {}, // let browser set multipart boundary
  });

  return extract(res);
}

/* =====================================================
   EXPORT DEFAULT
===================================================== */

export default {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  uploadMyProfileImage,
};
