// src/lib/videos.api.js
import api from "./apiClient";

/**
 * List videos (filterable by course/book/chapter)
 */
export async function getVideos(params = {}) {
  const res = await api.get("/api/videos", { params });
  return res.data;
}

/**
 * Get single video
 */
export async function getVideo(id) {
  if (!id) throw new Error("video id required");
  const res = await api.get(`/api/videos/${id}`);
  return res.data;
}

export default {
  getVideos,
  getVideo,
};
