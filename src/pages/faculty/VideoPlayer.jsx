import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getVideo } from "../../lib/videos.api";
import {
  trackVideoProgress,
  getVideoProgressByVideo,
} from "../../lib/empVideoProgress.api";
import YouTubeTracker from "../../components/YouTubeTracker";
import WatchedVideoList from "../../components/WatchedVideoList";

/* ----------------------------------------------------
   Helpers
---------------------------------------------------- */
function isYouTube(url) {
  return /youtube\.com|youtu\.be/.test(url || "");
}

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return "0:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export default function VideoPlayer() {
  const { id } = useParams();
  const videoRef = useRef(null);
  const lastSentRef = useRef(0);
  const [video, setVideo] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [hasSeeked, setHasSeeked] = useState(false);

  /* ----------------------------------------------------
     Load video meta
  ---------------------------------------------------- */
  useEffect(() => {
    async function loadVideo() {
      try {
        setLoading(true);
        const res = await getVideo(id);
        if (res?.data?.data) {
          setVideo(res.data.data);
        } else if (res?.data) {
          setVideo(res.data);
        } else {
          setError("Video not found");
        }
      } catch (e) {
        console.error("Failed to load video", e);
        setError("Failed to load video details");
      } finally {
        setLoading(false);
      }
    }
    loadVideo();
  }, [id]);

  /* ----------------------------------------------------
     Load saved progress (resume)
  ---------------------------------------------------- */
  useEffect(() => {
    if (!id) return;

    async function loadProgress() {
      try {
        const res = await getVideoProgressByVideo(Number(id));
        const row = res?.data?.[0];
        if (row) {
          setProgressData(row);
          
          // Set resume time from watched_seconds
          if (row.watched_seconds !== undefined && row.watched_seconds !== null) {
            const seconds = Number(row.watched_seconds);
            
            // Calculate progress percentage
            if (row.watch_percentage !== undefined && row.watch_percentage !== null) {
              const percent = parseFloat(row.watch_percentage);
              setProgressPercent(Math.min(percent, 100));
            } else if (duration > 0) {
              const percent = (seconds / duration) * 100;
              setProgressPercent(Math.min(percent, 100));
            }
            
            console.log("Loaded progress from DB:", {
              watched_seconds: seconds,
              watch_percentage: row.watch_percentage,
              duration: duration
            });
          }
        }
      } catch (err) {
        console.log("No previous progress found or error loading:", err);
        /* first time watch – ignore */
      }
    }

    if (video) {
      loadProgress();
    }
  }, [id, video, duration]);

  /* ----------------------------------------------------
     HTML5 video: seek + enable tracking
  ---------------------------------------------------- */
  function handleLoadedMetadata() {
    const v = videoRef.current;
    if (!v) return;

    const dur = Math.floor(v.duration || 0);
    setDuration(dur);
    
    console.log("Video metadata loaded:", {
      duration: dur,
      progressData,
      hasSeeked
    });

    // Only auto-seek if we haven't manually seeked yet
    if (!hasSeeked && progressData?.watched_seconds !== undefined && progressData?.watched_seconds !== null) {
      const resumeSeconds = Number(progressData.watched_seconds);
      
      // Ensure resume position is within video duration
      if (resumeSeconds > 0 && resumeSeconds < dur - 1) {
        try {
          v.currentTime = resumeSeconds;
          setCurrentTime(resumeSeconds);
          
          // Calculate progress percentage
          if (progressData.watch_percentage !== undefined && progressData.watch_percentage !== null) {
            const percent = parseFloat(progressData.watch_percentage);
            setProgressPercent(Math.min(percent, 100));
          } else {
            setProgressPercent((resumeSeconds / dur) * 100);
          }
          
          console.log("Resumed video from:", resumeSeconds, "seconds");
        } catch (err) {
          console.error("Error seeking to resume position:", err);
        }
      } else if (resumeSeconds >= dur - 1) {
        // If we've watched almost the entire video, start from beginning
        v.currentTime = 0;
        setCurrentTime(0);
        setProgressPercent(0);
        console.log("Video previously completed, starting from beginning");
      }
    }

    lastSentRef.current = Math.floor(v.currentTime || 0);
    setReady(true);
  }

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    
    const current = Math.floor(v.currentTime || 0);
    setCurrentTime(current);
    setIsPlaying(!v.paused && !v.ended);
    
    // Update progress bar
    if (duration > 0) {
      const percent = (current / duration) * 100;
      setProgressPercent(Math.min(percent, 100));
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => {
    setIsPlaying(false);
    // When video ends, mark as 100% watched
    if (duration > 0) {
      setCurrentTime(duration);
      setProgressPercent(100);
      sendProgress(true); // Force save on end
    }
  };

  /* ----------------------------------------------------
     Send progress (HTML5 only)
  ---------------------------------------------------- */
  function sendProgress(force = false) {
    const v = videoRef.current;
    if (!v || !ready || !id) return;

    const current = Math.floor(v.currentTime || 0);
    const dur = Math.floor(v.duration || 0);

    if (!force && current <= lastSentRef.current && current > 0) return;
    
    // Calculate watch percentage
    const watchPercentage = dur > 0 ? (current / dur) * 100 : 0;
    
    console.log("Sending progress:", {
      video_id: Number(id),
      watched_seconds: current,
      duration_seconds: dur,
      watch_percentage: watchPercentage.toFixed(2),
      force
    });

    lastSentRef.current = current;

    trackVideoProgress({
      video_id: Number(id),
      watched_seconds: current,
      duration_seconds: dur,
      force,
    }).catch((err) => {
      console.error("Failed to track video progress:", err);
    });
  }

  /* ----------------------------------------------------
     Interval tracking (HTML5)
  ---------------------------------------------------- */
  useEffect(() => {
    if (!video || !videoRef.current || isYouTube(video.video_link)) return;

    const interval = setInterval(() => {
      const v = videoRef.current;
      if (!v || v.paused || v.ended || !ready) return;
      sendProgress(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [video, ready]);

  /* ----------------------------------------------------
     Flush on pause / end / unload
  ---------------------------------------------------- */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || isYouTube(video?.video_link)) return;

    const flush = () => sendProgress(true);

    v.addEventListener("pause", flush);
    v.addEventListener("ended", flush);
    window.addEventListener("beforeunload", flush);

    return () => {
      flush();
      v.removeEventListener("pause", flush);
      v.removeEventListener("ended", flush);
      window.removeEventListener("beforeunload", flush);
    };
  }, [video, ready]);

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const seekTime = percent * duration;
    
    v.currentTime = seekTime;
    setCurrentTime(seekTime);
    setProgressPercent(percent * 100);
    setHasSeeked(true);
    sendProgress(true); // Save immediately on seek
  };

  const handleProgressClick = (seconds) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    
    v.currentTime = seconds;
    setCurrentTime(seconds);
    setProgressPercent((seconds / duration) * 100);
    setHasSeeked(true);
    sendProgress(true);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Video Player</h1>
            <p className="text-gray-600">Watch and track your learning progress</p>
          </div>
          <Link
            to="/dashboard/faculty/videos"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ← Back to Videos
          </Link>
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="h-8 bg-slate-200 animate-pulse rounded w-2/3"></div>
          <div className="h-[480px] bg-slate-200 animate-pulse rounded"></div>
          <div className="h-32 bg-slate-200 animate-pulse rounded"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading video</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && video && (
        <div className="space-y-6">
          {/* Main Video Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
                {video.description && (
                  <p className="text-gray-600">{video.description}</p>
                )}
              </div>

              {/* Progress Status */}
              {progressData && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-blue-800">Resume Available</span>
                    </div>
                    <div className="text-sm text-blue-700">
                      Last watched: {formatTime(progressData.watched_seconds)} 
                      {progressData.watch_percentage && (
                        <span className="ml-2">
                          ({parseFloat(progressData.watch_percentage).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Video Player Container */}
              <div className="bg-black rounded-lg overflow-hidden mb-4">
                {/* ---------- Player ---------- */}
                {isYouTube(video.video_link) ? (
                  <YouTubeTracker
                    dbVideoId={id}
                    videoUrl={video.video_link}
                    initialProgress={progressData}
                  />
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      src={video.video_link}
                      controls
                      preload="metadata"
                      onLoadedMetadata={handleLoadedMetadata}
                      onTimeUpdate={handleTimeUpdate}
                      onPlay={handlePlay}
                      onPause={handlePause}
                      onEnded={handleEnded}
                      className="w-full"
                    />
                    
                    {/* Custom Progress Bar */}
                    {duration > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 px-4 pb-2">
                        <div 
                          className="h-2 bg-gray-700 rounded-full cursor-pointer group"
                          onClick={handleSeek}
                        >
                          <div 
                            className="h-full bg-red-600 rounded-full transition-all duration-150 relative"
                            style={{ width: `${progressPercent}%` }}
                          >
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border-2 border-white"></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-300 mt-1">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Resume Buttons */}
              {progressData?.watched_seconds && duration > 0 && (
                <div className="mb-4 flex space-x-3">
                  <button
                    onClick={() => handleProgressClick(0)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Start from Beginning
                  </button>
                  <button
                    onClick={() => handleProgressClick(Math.max(0, progressData.watched_seconds - 10))}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Resume -10s
                  </button>
                  <button
                    onClick={() => handleProgressClick(Number(progressData.watched_seconds))}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    Resume at {formatTime(progressData.watched_seconds)}
                  </button>
                </div>
              )}

              {/* Video Info & Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-6">
                  {!isYouTube(video.video_link) && duration > 0 && (
                    <>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isPlaying 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {isPlaying ? (
                            <>
                              <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                              Playing
                            </>
                          ) : (
                            <>
                              <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Paused
                            </>
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-2">Progress:</span>
                        <span className="text-sm text-gray-900">
                          {formatTime(currentTime)} / {formatTime(duration)} ({progressPercent.toFixed(1)}%)
                        </span>
                      </div>
                      
                      {progressData?.watched_seconds !== undefined && (
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700 mr-2">Saved:</span>
                          <span className="text-sm text-gray-900">{formatTime(progressData.watched_seconds)}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Progress auto-saves every 5 seconds</span>
                </div>
              </div>

              {/* Video Metadata */}
              {video.video_link && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Video Information</h3>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-32 text-sm text-gray-600">Source:</span>
                      <span className="text-sm text-gray-900">
                        {isYouTube(video.video_link) ? 'YouTube' : 'Direct URL'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-sm text-gray-600">URL:</span>
                      <a 
                        href={video.video_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline truncate"
                      >
                        {video.video_link}
                      </a>
                    </div>
                    {video.created_at && (
                      <div className="flex">
                        <span className="w-32 text-sm text-gray-600">Uploaded:</span>
                        <span className="text-sm text-gray-900">
                          {new Date(video.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Watched Videos Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Recently Watched Videos
              </h2>
              <p className="text-sm text-gray-600 mt-1">Your video watch history and progress</p>
            </div>
            <div className="p-6">
              <WatchedVideoList />
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Tracking Information</h3>
                <div className="mt-2 text-sm text-blue-700 space-y-1">
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Progress automatically saves every 5 seconds
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Resume from where you left off on next visit
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Progress stored per video per user
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
