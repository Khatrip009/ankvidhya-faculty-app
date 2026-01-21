// src/useVideoProgress.js
import { useRef } from "react";
import api from "@/lib/api";

export default function useVideoProgress(videoId, durationSeconds) {
  const lastSent = useRef(0);

  async function track(currentSeconds, force = false) {
    // send only every 10 seconds or on force
    if (!force && currentSeconds - lastSent.current < 10) return;

    lastSent.current = currentSeconds;

    try {
      await api.post("/api/emp-video-progress/track", {
        video_id: videoId,
        watched_seconds: Math.floor(currentSeconds),
        duration_seconds: Math.floor(durationSeconds),
        force
      });
    } catch (e) {
      // silent fail — retry on next tick
    }
  }

  return { track };
}
