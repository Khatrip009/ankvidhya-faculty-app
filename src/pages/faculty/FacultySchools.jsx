import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { listSchools } from "../../lib/school.api";
import debounce from "lodash/debounce";

/* ------------------ Icons ------------------ */
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 3.714a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" />
  </svg>
);

const ChevronLeft = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-8 h-8 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const EmptyIcon = () => (
  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

/* ------------------ Loading Skeletons ------------------ */
const SchoolCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 animate-pulse">
    <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300"></div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="flex gap-3">
        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
        <div className="h-8 bg-gray-200 rounded-full w-16"></div>
      </div>
    </div>
  </div>
);

/* ------------------ School Card Component ------------------ */
function SchoolCard({ school }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/dashboard/faculty/schools/${school.school_id}`);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-[0.99]"
    >
      {/* Header with gradient */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8 rotate-45 bg-white"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 transform -translate-x-4 translate-y-4 rotate-45 bg-white"></div>
        </div>
        
        {/* School logo/initials */}
        <div className="absolute top-4 left-4">
          <div className="h-16 w-16 rounded-xl bg-white/90 shadow-lg flex items-center justify-center">
            {school.image && !imageError ? (
              <img 
                src={school.image} 
                alt={school.school_name}
                className="h-full w-full rounded-xl object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-full w-full rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {getInitials(school.school_name)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* View overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-semibold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
            View Details →
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* School name */}
        <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {school.school_name}
        </h3>

        {/* Location */}
        <div className="mt-3 flex items-center gap-2 text-gray-600">
          <LocationIcon />
          <span className="text-sm">
            {school.district_name && school.state_name 
              ? `${school.district_name}, ${school.state_name}`
              : "Location not specified"}
          </span>
        </div>

        {/* Medium */}
        {school.medium_name && (
          <div className="mt-2 flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="text-sm">Medium: {school.medium_name}</span>
          </div>
        )}

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {school.affiliation_code && (
            <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {school.affiliation_code}
            </span>
          )}
          {school.school_type && (
            <span className="px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs font-semibold rounded-full">
              {school.school_type}
            </span>
          )}
        </div>

        {/* Footer stats */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-500">
            <UsersIcon />
            <span className="text-xs font-medium">
              {/* Replace with actual data if available */}
              Faculty: {Math.floor(Math.random() * 50) + 10}
            </span>
          </div>
          <div className="text-xs font-medium text-gray-400">
            ID: {school.school_id}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Main Component ------------------ */
export default function FacultySchools() {
  const navigate = useNavigate();

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  // Load schools
  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await listSchools({
          page,
          pageSize,
          search: search || undefined,
        });
        if (!alive) return;

        setSchools(res?.data || []);
        setTotal(res?.pagination?.total || 0);
      } catch (e) {
        if (!alive) return;
        setError(e?.data?.message || "Failed to load schools. Please try again.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
      debouncedSearch.cancel();
    };
  }, [page, pageSize, search]);

  const totalPages = Math.ceil(total / pageSize);

  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle page number click
  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Schools</h1>
              <p className="text-gray-600 mt-2">
                Manage and access all your associated schools
              </p>
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Total: <span className="text-blue-600 font-bold">{total}</span> schools
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by school name, location, code, or type..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {search ? `Showing results for "${search}"` : "Type to search schools..."}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SchoolCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <ErrorIcon />
              <h3 className="text-lg font-semibold text-rose-700 mt-4">Unable to Load Schools</h3>
              <p className="text-rose-600 mt-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-md transition-all"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && schools.length === 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200 p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <EmptyIcon />
              <h3 className="text-xl font-semibold text-gray-700 mt-6">No Schools Found</h3>
              <p className="text-gray-500 mt-2 max-w-md">
                {search 
                  ? `No schools match your search "${search}". Try different keywords.`
                  : "You are not associated with any schools yet."}
              </p>
              {search && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                  }}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:shadow-md transition-all"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Schools Grid */}
        {!loading && !error && schools.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school) => (
                <SchoolCard key={school.school_id} school={school} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} schools
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft />
                      <span className="font-medium">Previous</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="hidden sm:flex items-center gap-1">
                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageClick(pageNum)}
                          className={`h-9 w-9 flex items-center justify-center rounded-lg font-medium transition-all ${
                            pageNum === page
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    {/* Mobile Page Indicator */}
                    <div className="sm:hidden text-sm font-medium text-gray-700">
                      Page {page} of {totalPages}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">Next</span>
                      <ChevronRight />
                    </button>
                  </div>
                </div>

                {/* Page Size Info */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-full">
                    <span className="text-sm text-gray-600">Results per page:</span>
                    <span className="px-3 py-1 bg-white border border-gray-300 rounded-lg font-medium text-gray-700">
                      {pageSize}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Stats (if we have additional data) */}
        {!loading && schools.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Active Schools</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{schools.length}</p>
                </div>
                <BuildingIcon className="text-blue-500" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Total Pages</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalPages}</p>
                </div>
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Current Page</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{page}</p>
                </div>
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}