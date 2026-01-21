import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getLessonPlan } from "../../lib/lessonPlans.api";

export default function LessonPlanDetails() {
  const { id } = useParams();
  const [lp, setLp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await getLessonPlan(id);
        if (!alive) return;
        if (res.data) {
          setLp(res.data);
        } else {
          setError("Lesson plan not found");
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load lesson plan");
      } finally {
        alive && setLoading(false);
      }
    }

    load();
    return () => (alive = false);
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderDetail = (label, value, link = null) => {
    if (!value || value === "null") return null;
    
    return (
      <div className="mb-3">
        <span className="font-medium text-slate-700">{label}: </span>
        {link ? (
          <Link to={link} className="text-indigo-600 hover:text-indigo-800 hover:underline">
            {value}
          </Link>
        ) : (
          <span className="text-slate-900">{value}</span>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lesson Plan Details</h1>
        <p className="text-gray-600">View detailed information about the lesson plan</p>
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="h-10 bg-slate-200 animate-pulse rounded w-1/3"></div>
          <div className="h-32 bg-slate-200 animate-pulse rounded"></div>
          <div className="h-40 bg-slate-200 animate-pulse rounded"></div>
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
              <h3 className="text-sm font-medium text-red-800">Error loading lesson plan</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && lp && (
        <div className="space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{lp.title}</h1>
                  {lp.description && (
                    <p className="text-lg text-gray-700 mb-4">{lp.description}</p>
                  )}
                </div>
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded">
                  ID: {lp.lp_id}
                </div>
              </div>

              {/* Explanation Section */}
              {lp.explanation && (
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Detailed Explanation
                  </h3>
                  <p className="text-gray-800 whitespace-pre-wrap">{lp.explanation}</p>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Educational Context
                  </h3>
                  
                  {renderDetail("Medium", lp.medium_name)}
                  {renderDetail("Standard", lp.std_name)}
                  {renderDetail("Book", lp.book_name)}
                  {renderDetail("Chapter", lp.chapter_name)}
                  
                  {lp.video_link && (
                    <div className="mb-3">
                      <span className="font-medium text-slate-700">Video: </span>
                      <a 
                        href={lp.video_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        Watch on External Platform
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Plan Information
                  </h3>
                  
                  <div className="mb-3">
                    <span className="font-medium text-slate-700">Created: </span>
                    <span className="text-slate-900">{formatDate(lp.created_at)}</span>
                  </div>
                  
                  <div className="mb-3">
                    <span className="font-medium text-slate-700">Total Topics: </span>
                    <span className="text-slate-900">{lp.topics?.length || 0}</span>
                  </div>
                  
                  <div className="mb-3">
                    <span className="font-medium text-slate-700">Total Activities: </span>
                    <span className="text-slate-900">{lp.activities?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Topics and Activities Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Topics Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                <h3 className="text-xl font-semibold text-indigo-900 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  Topics ({lp.topics?.length || 0})
                </h3>
              </div>
              
              <div className="p-6">
                {lp.topics && lp.topics.length > 0 ? (
                  <ol className="space-y-3">
                    {lp.topics
                      .sort((a, b) => (a.sequence_no || 0) - (b.sequence_no || 0))
                      .map((topic) => (
                        <li 
                          key={topic.lp_topic_id} 
                          className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center mr-3 font-semibold">
                            {topic.sequence_no || "•"}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{topic.topic_name}</h4>
                            {topic.topic_id && (
                              <p className="text-xs text-gray-500 mt-1">Topic ID: {topic.topic_id}</p>
                            )}
                          </div>
                        </li>
                      ))}
                  </ol>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2">No topics added to this lesson plan</p>
                  </div>
                )}
              </div>
            </div>

            {/* Activities Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                <h3 className="text-xl font-semibold text-green-900 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Activities ({lp.activities?.length || 0})
                </h3>
              </div>
              
              <div className="p-6">
                {lp.activities && lp.activities.length > 0 ? (
                  <ol className="space-y-3">
                    {lp.activities
                      .sort((a, b) => (a.sequence_no || 0) - (b.sequence_no || 0))
                      .map((activity) => (
                        <li 
                          key={activity.lp_activity_id} 
                          className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center mr-3 font-semibold">
                            {activity.sequence_no || "•"}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{activity.activity_name}</h4>
                            {activity.activity_id && (
                              <p className="text-xs text-gray-500 mt-1">Activity ID: {activity.activity_id}</p>
                            )}
                          </div>
                        </li>
                      ))}
                  </ol>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    <p className="mt-2">No activities added to this lesson plan</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <Link
              to="/dashboard/faculty/lesson-plans"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ← Back to Lesson Plans
            </Link>

            <div className="flex space-x-3">
              {lp.video_id && (
                <Link
                  to={`/dashboard/faculty/videos/${lp.video_id}`}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Video
                </Link>
              )}
              
              <Link
                to={`/dashboard/faculty/lesson-plans/edit/${lp.lp_id}`}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Lesson Plan
              </Link>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}