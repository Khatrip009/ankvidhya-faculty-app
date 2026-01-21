import { useEffect, useState } from "react";
import { getMyVideoProgress } from "../lib/empVideoProgress.api";

export default function WatchedVideoList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getMyVideoProgress();

        /**
         * Normalize response:
         * - array
         * - { data: [] }
         * - { rows: [] }
         */
        let list = [];

        if (Array.isArray(res)) {
          list = res;
        } else if (Array.isArray(res?.data)) {
          list = res.data;
        } else if (Array.isArray(res?.rows)) {
          list = res.rows;
        }

        setVideos(list);
      } catch (err) {
        console.error("Failed to load watched videos", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 text-sm text-slate-400">
        Loading watched videos…
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="mt-6 text-sm text-slate-400">
        No videos watched yet.
      </div>
    );
  }

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-lg font-semibold mb-3">
        📊 Watched Videos
      </h2>

      <ul className="space-y-3">
        {videos.map((v) => (
          <li
            key={`${v.video_id}-${v.employee_id}`}
            className="p-3 rounded border bg-slate-50"
          >
            <div className="flex justify-between items-center">
              <div className="font-medium text-slate-800">
                {v.title || `Video #${v.video_id}`}
              </div>

              <div className="text-sm font-semibold text-blue-600">
                {Number(v.watch_percentage || 0).toFixed(1)}%
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2 w-full bg-slate-200 rounded h-2">
              <div
                className="h-2 rounded bg-blue-500 transition-all"
                style={{ width: `${v.watch_percentage || 0}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
