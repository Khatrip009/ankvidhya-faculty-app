// src/lib/empVideoProgress.api.js
import api from "./apiClient";

/**
 * Track / update video progress (UPSERT)
 * Backend guarantees:
 * - faculty only tracks self
 * - progress only increases (unless force=true)
 */
export async function trackVideoProgress({
  video_id,
  watched_seconds,
  duration_seconds,
  force = false,
}) {
  if (!video_id) throw new Error("video_id required");

  const res = await api.post("/api/emp-video-progress/track", {
    video_id,
    watched_seconds,
    duration_seconds,
    force,
  });

  return res.data;
}

/**
 * Get current user's progress list (calendar / dashboard usage)
 */
export async function getMyVideoProgress(params = {}) {
  const res = await api.get("/api/emp-video-progress", { params });
  return res.data;
}

/**
 * Get progress for a single video (resume support)
 */
export async function getVideoProgressByVideo(video_id) {
  if (!video_id) throw new Error("video_id required");

  const res = await api.get("/api/emp-video-progress", {
    params: { video_id },
  });

  return res.data;
}

export default {
  trackVideoProgress,
  getMyVideoProgress,
  getVideoProgressByVideo,
};
