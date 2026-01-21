import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getSchool } from "../../lib/school.api";

/* ------------------ Icons ------------------ */
const MapPinIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
  </div>
);

/* ------------------ Field Component ------------------ */
function Field({ label, value, icon: Icon, full = false }) {
  return (
    <div className={`space-y-1.5 ${full ? "md:col-span-2" : ""}`}>
      <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {Icon && <Icon />}
        {label}
      </label>
      <div className={`text-gray-900 font-medium break-words ${
        !value && "text-gray-400 italic"
      }`}>
        {value || "Not specified"}
      </div>
    </div>
  );
}

/* ------------------ Google Map Component ------------------ */
function GoogleMap({ lat, lng, name }) {
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <iframe
      title={`Map - ${name}`}
      src={src}
      className="w-full h-full border-0 rounded-xl"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}

/* ------------------ Open in Maps Button ------------------ */
function OpenInMapsButton({ school }) {
  const url = school.latitude && school.longitude
    ? `https://www.google.com/maps?q=${school.latitude},${school.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${school.school_name}, ${school.address || ""}`
      )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
    >
      <span>Open in Google Maps</span>
      <ExternalLinkIcon />
    </a>
  );
}

/* ------------------ Loading Skeleton ------------------ */
function SchoolDetailsSkeleton() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-8 animate-pulse">
        <div className="h-8 w-64 bg-gray-300 rounded-lg mb-4"></div>
        <div className="h-4 w-48 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="h-6 w-32 bg-gray-300 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-full bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="h-6 w-40 bg-gray-300 rounded-lg mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Error State ------------------ */
function ErrorState({ error, onRetry }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load School</h3>
          <p className="text-gray-600 mb-6 max-w-md">{error}</p>
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Main Component ------------------ */
export default function FacultySchoolDetails() {
  const { id } = useParams();

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hasMap = useMemo(() => {
    return (
      school &&
      Number.isFinite(Number(school.latitude)) &&
      Number.isFinite(Number(school.longitude))
    );
  }, [school]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const res = await getSchool(id);
        if (!alive) return;

        if (!res?.data) {
          throw new Error("School not found");
        }

        setSchool(res.data);
      } catch (err) {
        if (!alive) return;
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load school details. Please try again."
        );
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <SchoolDetailsSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorState error={error} onRetry={handleRetry} />
      </DashboardLayout>
    );
  }

  if (!school) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">School Not Found</h3>
              <p className="text-gray-600 mb-6">The school you're looking for doesn't exist or has been removed.</p>
              <a
                href="/dashboard/faculty/schools"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Back to Schools
              </a>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm p-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {school.school_name?.[0]?.toUpperCase() || "S"}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{school.school_name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full">
                      School ID: {school.school_id}
                    </span>
                    {school.medium_name && (
                      <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                        {school.medium_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4 text-gray-600">
                {school.district_name && school.state_name && (
                  <div className="flex items-center gap-2">
                    <MapPinIcon />
                    <span className="font-medium">{school.district_name}, {school.state_name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:text-right">
              <OpenInMapsButton school={school} />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - School Information */}
          <div className="space-y-6">
            {/* Contact Information Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
                    <BuildingIcon className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">School Information</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field 
                    label="Contact Person" 
                    value={school.contact_person}
                    icon={UserIcon}
                  />
                  <Field 
                    label="Phone Number" 
                    value={school.contact_no}
                    icon={PhoneIcon}
                  />
                  <Field 
                    label="Email Address" 
                    value={school.email}
                    icon={MailIcon}
                  />
                  <Field 
                    label="District" 
                    value={school.district_name}
                    icon={MapPinIcon}
                  />
                  <Field 
                    label="State" 
                    value={school.state_name}
                    icon={GlobeIcon}
                  />
                  <Field 
                    label="Medium" 
                    value={school.medium_name}
                    icon={GlobeIcon}
                  />
                  <Field 
                    label="Full Address" 
                    value={school.address}
                    icon={MapPinIcon}
                    full
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Card (if needed) */}
            {school.affiliation_code && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Additional Details</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Affiliation Code
                      </label>
                      <div className="px-3 py-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg text-emerald-800 font-bold">
                        {school.affiliation_code}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Map Section */}
          <div className="space-y-6">
            {/* Map Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 h-full">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500">
                      <MapIcon className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">School Location</h2>
                  </div>
                  <OpenInMapsButton school={school} />
                </div>
              </div>

              <div className="p-6">
                {hasMap ? (
                  <div className="h-96 rounded-xl overflow-hidden border border-gray-300">
                    <GoogleMap
                      lat={Number(school.latitude)}
                      lng={Number(school.longitude)}
                      name={school.school_name}
                    />
                  </div>
                ) : (
                  <div className="h-96 rounded-xl overflow-hidden border border-gray-300 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-8">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center mb-6">
                        <MapPinIcon className="h-10 w-10 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Location Not Pinned
                      </h3>
                      <p className="text-gray-600 text-center max-w-md mb-6">
                        This school's location hasn't been pinned on the map yet.
                        You can still view the approximate location using the address.
                      </p>
                      <OpenInMapsButton school={school} />
                    </div>
                  </div>
                )}

                {/* Coordinates Display */}
                {hasMap && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Coordinates</div>
                        <div className="font-mono text-sm text-gray-800">
                          {school.latitude}, {school.longitude}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Drag the map marker to update coordinates
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={`tel:${school.contact_no}`}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center text-white hover:bg-white/30 transition-all duration-200 active:scale-95"
                >
                  <PhoneIcon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Call School</div>
                </a>
                <a
                  href={`mailto:${school.email}`}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center text-white hover:bg-white/30 transition-all duration-200 active:scale-95"
                >
                  <MailIcon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Send Email</div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <a
            href="/dashboard/faculty/schools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Schools
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}