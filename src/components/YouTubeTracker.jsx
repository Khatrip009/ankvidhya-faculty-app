import { useEffect, useRef } from "react";
import { trackVideoProgress } from "../lib/empVideoProgress.api";

/* =========================================
   Load YouTube IFrame API (singleton)
========================================= */
let ytApiPromise;

function loadYouTubeAPI() {
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    window.onYouTubeIframeAPIReady = () => resolve();
    document.body.appendChild(tag);
  });

  return ytApiPromise;
}

/* =========================================
   Extract YouTube VIDEO ID safely
========================================= */
function getYouTubeId(url) {
  try {
    const u = new URL(url);
    return (
      u.searchParams.get("v") ||
      (u.hostname.includes("youtu.be") && u.pathname.slice(1)) ||
      (u.pathname.startsWith("/embed/") && u.pathname.split("/embed/")[1])
    );
  } catch {
    return null;
  }
}

/* =========================================
   Component
========================================= */
export default function YouTubeTracker({ dbVideoId, videoUrl }) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const lastSentRef = useRef(0);
  const domIdRef = useRef(`yt-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    let destroyed = false;

    async function init() {
      await loadYouTubeAPI();
      if (destroyed) return;

      const ytId = getYouTubeId(videoUrl);
      if (!ytId) {
        console.error("❌ Invalid YouTube URL:", videoUrl);
        return;
      }

      playerRef.current = new window.YT.Player(domIdRef.current, {
        videoId: ytId,
        playerVars: { controls: 1, rel: 0 },
        events: {
          onStateChange: onStateChange,
        },
      });
    }

    init();

    return () => {
      destroyed = true;
      flush(true);
      stopTracking();
      playerRef.current?.destroy();
    };
  }, [videoUrl]);

  function onStateChange(e) {
    if (e.data === window.YT.PlayerState.PLAYING) {
      startTracking();
    }

    if (
      e.data === window.YT.PlayerState.PAUSED ||
      e.data === window.YT.PlayerState.ENDED
    ) {
      flush(true);
      stopTracking();
    }
  }

  function startTracking() {
    stopTracking();

    intervalRef.current = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;

      const current = Math.floor(p.getCurrentTime());
      const duration = Math.floor(p.getDuration());

      if (current <= lastSentRef.current) return;
      lastSentRef.current = current;

      console.log("📤 POST progress:", current);

      trackVideoProgress({
        video_id: Number(dbVideoId), // ✅ DB ID
        watched_seconds: current,
        duration_seconds: duration,
      });
    }, 10000);
  }

  function stopTracking() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  function flush(force) {
    const p = playerRef.current;
    if (!p) return;

    trackVideoProgress({
      video_id: Number(dbVideoId),
      watched_seconds: Math.floor(p.getCurrentTime()),
      duration_seconds: Math.floor(p.getDuration()),
      force,
    });
  }

  return (
    <div
      id={domIdRef.current}
      className="w-full aspect-video rounded"
    />
  );
}
