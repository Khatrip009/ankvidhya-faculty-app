import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getLessonPlans } from "../../lib/lessonPlans.api";
import { Link } from "react-router-dom";

/* ------------------ Icons ------------------ */
const BookOpenIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 3.714a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" />
  </svg>
);

const ChapterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="h-5 w-5 animate-spin rounded-full border-3 border-solid border-blue-600 border-r-transparent"></div>
);

const EmptyIcon = () => (
  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

/* ------------------ Lesson Plan Card ------------------ */
function LessonPlanCard({ lessonPlan }) {
  return (
    <Link
      to={`/dashboard/faculty/lessonplans/${lessonPlan.lp_id}`}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {lessonPlan.title}
            </h3>
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <UsersIcon />
                <span>Std {lessonPlan.std_name}</span>
              </div>
              
              {lessonPlan.created_date && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <CalendarIcon />
                  <span>
                    {new Date(lessonPlan.created_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <BookOpenIcon className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Book & Chapter */}
          {(lessonPlan.book_name || lessonPlan.chapter_name) && (
            <div className="flex items-center gap-2">
              <ChapterIcon className="text-gray-500" />
              <span className="text-sm text-gray-700">
                {lessonPlan.book_name && lessonPlan.chapter_name 
                  ? `${lessonPlan.book_name} • ${lessonPlan.chapter_name}`
                  : lessonPlan.book_name || lessonPlan.chapter_name}
              </span>
            </div>
          )}
          
          {/* Description */}
          {lessonPlan.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {lessonPlan.description}
            </p>
          )}
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {lessonPlan.subject_name && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold rounded-full">
                {lessonPlan.subject_name}
              </span>
            )}
            
            {lessonPlan.duration && (
              <span className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 text-xs font-semibold rounded-full">
                {lessonPlan.duration} min
              </span>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">
            View Details
          </span>
          <ArrowRightIcon className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}

/* ------------------ Loading Skeletons ------------------ */
function LessonPlanSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 animate-pulse">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gray-200"></div>
        </div>
        
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Empty State ------------------ */
function EmptyState() {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200 p-12 text-center">
      <div className="flex flex-col items-center justify-center">
        <EmptyIcon />
        <h3 className="text-xl font-semibold text-gray-700 mt-6">No Lesson Plans</h3>
        <p className="text-gray-500 mt-2 max-w-md">
          You haven't created any lesson plans yet. Start by creating your first lesson plan to organize your teaching materials.
        </p>
        <Link
          to="/dashboard/faculty/lessonplans/create"
          className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          Create Lesson Plan
        </Link>
      </div>
    </div>
  );
}

/* ------------------ Stats Card ------------------ */
function StatsCard({ title, value, icon: Icon, color = "blue" }) {
  const colorClasses = {
    blue: "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200",
    green: "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200",
    indigo: "bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200",
    purple: "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200",
  };

  const iconColorClasses = {
    blue: "bg-gradient-to-r from-blue-500 to-blue-600",
    green: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    indigo: "bg-gradient-to-r from-indigo-500 to-indigo-600",
    purple: "bg-gradient-to-r from-purple-500 to-purple-600",
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-lg ${iconColorClasses[color]} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

/* ------------------ Main Component ------------------ */
export default function LessonPlans() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    recent: 0,
    byStd: {},
    bySubject: {},
  });

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await getLessonPlans();
        if (!alive) return;
        
        const lessonPlans = res.data || [];
        setData(lessonPlans);

        // Calculate stats
        const total = lessonPlans.length;
        const recent = lessonPlans.filter(lp => {
          const createdDate = new Date(lp.created_date || lp.updated_at || Date.now());
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return createdDate > thirtyDaysAgo;
        }).length;

        const byStd = {};
        const bySubject = {};

        lessonPlans.forEach(lp => {
          if (lp.std_name) {
            byStd[lp.std_name] = (byStd[lp.std_name] || 0) + 1;
          }
          if (lp.subject_name) {
            bySubject[lp.subject_name] = (bySubject[lp.subject_name] || 0) + 1;
          }
        });

        setStats({
          total,
          recent,
          byStd,
          bySubject,
        });

      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError("Failed to load lesson plans. Please try again.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => (alive = false);
  }, []);

  // Filter and search lesson plans
  const filteredData = data.filter(lessonPlan => {
    const matchesSearch = searchTerm === "" || 
      lessonPlan.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lessonPlan.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lessonPlan.book_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lessonPlan.chapter_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || 
      (filter === "recent" && lessonPlan.created_date) ||
      (filter === "std" && lessonPlan.std_name);

    return matchesSearch && matchesFilter;
  });

  // Get unique standards for filter
  const uniqueStandards = [...new Set(data.map(lp => lp.std_name).filter(Boolean))];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <BookOpenIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Lesson Plans</h1>
            </div>
            <p className="text-gray-600">
              Manage and organize your teaching materials and lesson plans
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/faculty/lessonplans/create"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              Create New
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Plans"
            value={stats.total}
            icon={BookOpenIcon}
            color="blue"
          />
          <StatsCard
            title="Last 30 Days"
            value={stats.recent}
            icon={CalendarIcon}
            color="green"
          />
          <StatsCard
            title="Standards"
            value={Object.keys(stats.byStd).length}
            icon={UsersIcon}
            color="indigo"
          />
          <StatsCard
            title="Subjects"
            value={Object.keys(stats.bySubject).length}
            icon={ChapterIcon}
            color="purple"
          />
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search lesson plans by title, description, book, or chapter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-3">
              <FilterIcon className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Lesson Plans</option>
                <option value="recent">Recent (Last 30 Days)</option>
                {uniqueStandards.map(std => (
                  <option key={std} value={`std-${std}`}>
                    Standard {std}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filter !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredData.length} of {data.length} lesson plans
                {searchTerm && (
                  <span className="font-medium"> for "{searchTerm}"</span>
                )}
              </div>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <LessonPlanSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Lesson Plans</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Retry Loading
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredData.length === 0 && data.length === 0 && (
          <EmptyState />
        )}

        {/* No Results State */}
        {!loading && !error && data.length > 0 && filteredData.length === 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <svg className="w-16 h-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mt-6">No Matching Lesson Plans</h3>
              <p className="text-gray-500 mt-2 max-w-md">
                No lesson plans match your search criteria. Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Clear Search & Filters
              </button>
            </div>
          </div>
        )}

        {/* Lesson Plans Grid */}
        {!loading && !error && filteredData.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map(lessonPlan => (
                <LessonPlanCard key={lessonPlan.lp_id} lessonPlan={lessonPlan} />
              ))}
            </div>

            {/* Pagination Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
              <div className="text-sm text-gray-600">
                Showing <span className="font-bold">{filteredData.length}</span> lesson plans
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  Sorted by: <span className="font-medium">Recently Updated</span>
                </div>
                
                {filteredData.length > 12 && (
                  <div className="flex items-center gap-2">
                    <button className="h-10 w-10 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-300 hover:shadow-md transition-all duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="text-sm font-medium text-gray-700">
                      Page 1 of {Math.ceil(filteredData.length / 12)}
                    </div>
                    <button className="h-10 w-10 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-300 hover:shadow-md transition-all duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Quick Actions */}
        {!loading && data.length > 0 && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/dashboard/faculty/lessonplans/create"
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-left text-white hover:bg-white/30 transition-all duration-200 active:scale-95"
              >
                <div className="font-semibold">Create New Plan</div>
                <div className="text-sm opacity-90 mt-1">Start a fresh lesson plan</div>
              </Link>
              
              <button
                onClick={() => setFilter("recent")}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-left text-white hover:bg-white/30 transition-all duration-200 active:scale-95"
              >
                <div className="font-semibold">View Recent</div>
                <div className="text-sm opacity-90 mt-1">See recently updated plans</div>
              </button>
              
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-left text-white hover:bg-white/30 transition-all duration-200 active:scale-95"
              >
                <div className="font-semibold">Back to Top</div>
                <div className="text-sm opacity-90 mt-1">Return to the beginning</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}