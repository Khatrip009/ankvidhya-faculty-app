import React, { useEffect, useState } from "react";
import { createAttendance, updateAttendance } from "../../lib/emp-attendance.api";
import api from "../../lib/api";

/* ------------------ Icons ------------------ */
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
);

const StatusIcon = ({ status }) => {
  const icons = {
    present: (
      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
        <CheckIcon className="h-3 w-3 text-emerald-600" />
      </div>
    ),
    absent: (
      <div className="h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center">
        <svg className="h-3 w-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
    leave: (
      <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
        <svg className="h-3 w-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
    ),
    holiday: (
      <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
        <svg className="h-3 w-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </div>
    ),
    halfday: (
      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
        <svg className="h-3 w-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    )
  };
  return icons[status] || icons.present;
};

const ErrorIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

/* ------------------ Status Options ------------------ */
const statusOptions = [
  {
    value: "present",
    label: "Present",
    description: "Full day attendance",
    color: "bg-gradient-to-r from-emerald-500 to-green-500",
    borderColor: "border-emerald-500",
    textColor: "text-emerald-700"
  },
  {
    value: "absent",
    label: "Absent",
    description: "Not present",
    color: "bg-gradient-to-r from-rose-500 to-red-500",
    borderColor: "border-rose-500",
    textColor: "text-rose-700"
  },
  {
    value: "leave",
    label: "On Leave",
    description: "Approved leave",
    color: "bg-gradient-to-r from-amber-500 to-orange-500",
    borderColor: "border-amber-500",
    textColor: "text-amber-700"
  },
  {
    value: "holiday",
    label: "Holiday",
    description: "Official holiday",
    color: "bg-gradient-to-r from-purple-500 to-violet-500",
    borderColor: "border-purple-500",
    textColor: "text-purple-700"
  },
  {
    value: "halfday",
    label: "Half Day",
    description: "Partial attendance",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    borderColor: "border-blue-500",
    textColor: "text-blue-700"
  }
];

/* ------------------ Main Component ------------------ */
export default function AttendanceModal({
  open,
  onClose,
  date,
  row,
  onSaved,
}) {
  const isEdit = Number.isInteger(row?.emp_att_id);

  const [status, setStatus] = useState("present");
  const [schoolId, setSchoolId] = useState("");
  const [schools, setSchools] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [loadingSchools, setLoadingSchools] = useState(false);

  /* ------------------------------------------------------------------
     Load schools (FACULTY SAFE with fallback)
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadSchools() {
      setLoadingSchools(true);
      setError(null);

      try {
        // 1️⃣ Try faculty assignments first
        const res = await api.get("/api/faculty-assignments", {
          query: { pageSize: 500 },
        });

        let rows =
          res?.data?.data ||
          res?.data ||
          [];

        // Normalize
        let list = [];
        const map = new Map();

        rows.forEach((r) => {
          if (r.school_id) {
            map.set(String(r.school_id), {
              school_id: String(r.school_id),
              school_name: r.school_name,
            });
          }
        });

        list = Array.from(map.values());

        // 2️⃣ FALLBACK: if no assignments returned
        if (list.length === 0) {
          const fallback = await api.get("/api/schools", {
            query: { pageSize: 500 },
          });

          const fbRows = fallback?.data?.data || [];
          list = fbRows.map((s) => ({
            school_id: String(s.school_id),
            school_name: s.school_name,
          }));
        }

        if (!cancelled) {
          setSchools(list);

          if (list.length === 1) {
            setSchoolId(list[0].school_id);
          }
        }
      } catch (e) {
        console.error("School load failed", e);
        if (!cancelled) {
          setError("No schools assigned to this user");
        }
      } finally {
        if (!cancelled) setLoadingSchools(false);
      }
    }

    loadSchools();
    return () => {
      cancelled = true;
    };
  }, [open]);

  /* ------------------------------------------------------------------
     Sync edit state
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!open) return;

    setStatus(row?.status ?? "present");
    setSchoolId(row?.school_id ? String(row.school_id) : "");
    setSaving(false);
    setError(null);
  }, [open, row]);

  /* ------------------------------------------------------------------
     Save function
  ------------------------------------------------------------------ */
  async function save() {
    if (!date) {
      setError("Invalid date");
      return;
    }

    if (!schoolId) {
      setError("Please select a school");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (isEdit) {
        await updateAttendance(row.emp_att_id, {
          status,
          school_id: Number(schoolId),
        });
      } else {
        await createAttendance({
          date: String(date),
          status,
          school_id: Number(schoolId),
        });
      }

      onSaved?.();
      onClose?.();
    } catch (e) {
      console.error("Attendance save error", e);
      setError(
        e?.response?.data?.message ||
        "Attendance already exists or permission denied. Please check if attendance is already marked for this date."
      );
    } finally {
      setSaving(false);
    }
  }


  /* ------------------------------------------------------------------
     Format date for display
  ------------------------------------------------------------------ */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  /* ------------------------------------------------------------------
     Handle key events (Escape to close)
  ------------------------------------------------------------------ */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !saving) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, saving]);

  /* ------------------------------------------------------------------
     Handle backdrop click
  ------------------------------------------------------------------ */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !saving) {
      onClose();
    }
  };
  if (!open) {
  return null;
}


  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        {/* Modal Container */}
        <div className="relative bg-gradient-to-br from-white to-gray-50 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 mx-4 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isEdit ? "Edit Attendance" : "Mark Attendance"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarIcon className="h-4 w-4 text-white/90" />
                  <p className="text-white/90 text-sm">
                    {formatDate(date)}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={saving}
                className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* School Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BuildingIcon />
                Select School
              </label>
              <div className="relative">
                <select
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  disabled={saving || loadingSchools}
                  className={`w-full rounded-xl border px-4 py-3.5 focus:outline-none focus:ring-2 transition-all appearance-none ${
                    loadingSchools 
                      ? "bg-gray-100 border-gray-300 text-gray-500" 
                      : "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  } ${error && !schoolId ? "border-rose-300 focus:ring-rose-500" : ""}`}
                >
                  <option value="" className="text-gray-500">
                    {loadingSchools ? "Loading schools..." : "Select a school"}
                  </option>
                  {schools.map((s) => (
                    <option key={s.school_id} value={s.school_id}>
                      {s.school_name}
                    </option>
                  ))}
                </select>
                {!loadingSchools && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </div>
              {schools.length === 0 && !loadingSchools && (
                <p className="text-xs text-amber-600">
                  No schools found. Please contact administrator to get assigned to a school.
                </p>
              )}
            </div>

            {/* Status Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Select Status
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStatus(option.value)}
                    disabled={saving}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                      status === option.value 
                        ? `${option.borderColor} border-2 bg-gradient-to-br ${option.color}/10 shadow-sm` 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="mb-2">
                      <StatusIcon status={option.value} />
                    </div>
                    <span className={`font-semibold text-sm ${status === option.value ? option.textColor : "text-gray-700"}`}>
                      {option.label}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">{option.description}</span>
                    {status === option.value && (
                      <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                        <CheckIcon className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <ErrorIcon className="text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-rose-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !schoolId || loadingSchools}
                className={`relative px-6 py-2.5 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 ${
                  saving || !schoolId || loadingSchools
                    ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-95"
                } text-white`}
              >
                {saving ? (
                  <>
                    <LoadingSpinner />
                    <span>Saving...</span>
                  </>
                ) : isEdit ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    <span>Update Attendance</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    <span>Mark Attendance</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Attendance once marked cannot be changed after 24 hours</p>
                <p>• Make sure to select the correct school before saving</p>
                {isEdit && (
                  <p className="text-amber-600">• Editing will update the existing attendance record</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
}