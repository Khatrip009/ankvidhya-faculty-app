import React, { useEffect, useState } from "react";
import {
  listAttendance,
  deleteAttendance,
} from "../../lib/emp-attendance.api";

import AttendanceCalendar from "./AttendanceCalendar";
import AttendanceModal from "./AttendanceModal";
import AttendanceMonthlyChart from "./AttendanceMonthlyChart";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";

/* ------------------ Icons ------------------ */
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="h-5 w-5 animate-spin rounded-full border-3 border-solid border-blue-600 border-r-transparent"></div>
);

const SuccessIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

/* ------------------ Toast Component ------------------ */
function Toast({ toast, onClose }) {
  if (!toast) return null;

  const styles = {
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500",
    error: "bg-gradient-to-r from-rose-500 to-rose-600 border-rose-500",
    info: "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500",
  };

  const icons = {
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    info: <InfoIcon />,
  };

  // Auto-close after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right-6 fade-in duration-300">
      <div className={`relative min-w-80 max-w-md rounded-xl shadow-2xl ${styles[toast.type]} border text-white overflow-hidden`}>
        <div className="absolute top-0 left-0 w-1.5 h-full bg-white/30" />
        <div className="flex items-start p-4 gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {icons[toast.type]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white/80 hover:text-white text-lg leading-none p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full bg-black/10">
          <div className="h-full bg-white/30 animate-[shrink_5s_linear]" />
        </div>
      </div>
    </div>
  );
}

/* ------------------ Attendance Stats Card ------------------ */
function AttendanceStats({ rows }) {
  const total = rows.length;
  const present = rows.filter(r => r.status === 'present').length;
  const absent = rows.filter(r => r.status === 'absent').length;
  const leave = rows.filter(r => r.status === 'leave').length;
  const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Records</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
            <CalendarIcon className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Present</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{present}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Absent</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{absent}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-rose-500 to-red-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">On Leave</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{leave}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Loading Skeleton ------------------ */
function AttendanceTableSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="animate-pulse">
        <div className="h-14 bg-gradient-to-r from-gray-100 to-gray-200"></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 border-t border-gray-200">
            <div className="h-full px-6 flex items-center">
              <div className="flex-1 grid grid-cols-4 gap-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------ Main Component ------------------ */
export default function EmployeeAttendancePage() {
  /* ------------------------------------------------------------------
     AUTH
  ------------------------------------------------------------------ */
  const { user, loading: authLoading } = useAuth();

  /* ------------------------------------------------------------------
     STATE
  ------------------------------------------------------------------ */
  const [rows, setRows] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [view, setView] = useState("calendar");
  const [toast, setToast] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});

  // calendar view state
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  /* ------------------------------------------------------------------
     ROLE CHECK
  ------------------------------------------------------------------ */
  const role = (user?.role || user?.role_name || "faculty").toLowerCase();
  const canWrite = ["admin", "hr", "team_leader", "faculty"].includes(role);

  /* ------------------------------------------------------------------
     LOAD DATA
  ------------------------------------------------------------------ */
  async function load() {
    setDataLoading(true);
    try {
      const res = await listAttendance({ pageSize: 500 });
      setRows(res?.data ?? []);
    } catch (e) {
      console.error("Attendance load failed", e);
      setToast({
        type: "error",
        message: "Failed to load attendance data. Please try again."
      });
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      load();
    }
  }, [authLoading, user]);

  /* ------------------------------------------------------------------
     ACTIONS
  ------------------------------------------------------------------ */
  async function remove(id) {
    setDeleteLoading(prev => ({ ...prev, [id]: true }));
    try {
      await deleteAttendance(id);
      setRows(prev => prev.filter(row => row.emp_att_id !== id));
      setToast({
        type: "success",
        message: "Attendance record deleted successfully"
      });
    } catch (e) {
      console.error("Delete failed", e);
      setToast({
        type: "error",
        message: "Failed to delete attendance record. Please try again."
      });
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  }

  function openModal(date, row = null) {
    setSelectedDate(date);
    setSelectedRow(row);
    setModalOpen(true);
  }

  function changeMonth(delta) {
    setViewMonth((m) => {
      if (m + delta < 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      if (m + delta > 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + delta;
    });
  }

  /* ------------------------------------------------------------------
     STATUS BADGE COMPONENT
  ------------------------------------------------------------------ */
  function StatusBadge({ status }) {
    const config = {
      present: {
        bg: "bg-gradient-to-r from-emerald-500 to-green-500",
        text: "Present",
        icon: "✓"
      },
      absent: {
        bg: "bg-gradient-to-r from-rose-500 to-red-500",
        text: "Absent",
        icon: "✗"
      },
      leave: {
        bg: "bg-gradient-to-r from-amber-500 to-orange-500",
        text: "On Leave",
        icon: "L"
      }
    };

    const configItem = config[status?.toLowerCase()] || config.absent;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white ${configItem.bg}`}>
        <span className="text-xs">{configItem.icon}</span>
        <span>{configItem.text}</span>
      </span>
    );
  }

  /* ------------------------------------------------------------------
     GUARDS
  ------------------------------------------------------------------ */
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading authentication...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h3>
              <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
              <a
                href="/login"
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ------------------------------------------------------------------
     RENDER
  ------------------------------------------------------------------ */
  return (
    <DashboardLayout>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Add animation keyframes to global CSS */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Attendance</h1>
            </div>
            <p className="text-gray-600">
              Track and manage attendance records for all employees
            </p>
          </div>

          {/* View Toggle Buttons */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 p-1 rounded-xl">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                view === "list"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-300"
              }`}
            >
              <ListIcon />
              <span className="font-medium">List View</span>
            </button>

            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                view === "calendar"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-300"
              }`}
            >
              <CalendarIcon />
              <span className="font-medium">Calendar View</span>
            </button>
          </div>
        </div>

        {/* Attendance Stats */}
        <AttendanceStats rows={rows} />

        {/* Loading State */}
        {dataLoading && view === "list" && <AttendanceTableSkeleton />}

        {/* Empty State */}
        {!dataLoading && rows.length === 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200 p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <svg className="w-16 h-16 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Attendance Records</h3>
              <p className="text-gray-500 max-w-md">
                No attendance records found. Start by marking attendance for today.
              </p>
              <button
                onClick={() => openModal(new Date().toISOString().slice(0, 10))}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Mark Today's Attendance
              </button>
            </div>
          </div>
        )}

        {/* List View */}
        {!dataLoading && view === "list" && rows.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Attendance Records</h2>
                <div className="text-sm text-gray-600">
                  Total: <span className="font-bold text-blue-600">{rows.length}</span> records
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      School
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    {canWrite && (
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rows.map((r) => (
                    <tr key={r.emp_att_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{r.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{r.employee_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{r.school_name || "—"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={r.status} />
                      </td>
                      {canWrite && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => remove(r.emp_att_id)}
                            disabled={deleteLoading[r.emp_att_id]}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 hover:from-rose-100 hover:to-pink-100 rounded-lg border border-rose-200 transition-all duration-200 disabled:opacity-50"
                          >
                            {deleteLoading[r.emp_att_id] ? (
                              <LoadingSpinner />
                            ) : (
                              <DeleteIcon />
                            )}
                            <span>Delete</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {!dataLoading && view === "calendar" && rows.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Calendar View</h2>
            </div>
            <div className="p-6">
              <AttendanceCalendar
                rows={rows}
                year={viewYear}
                month={viewMonth}
                canWrite={canWrite}
                onSelectDate={(date) => openModal(date, null)}
                onChangeMonth={changeMonth}
              />
            </div>
          </div>
        )}

        {/* Monthly Chart */}
        {!dataLoading && rows.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Monthly Attendance Overview</h2>
            </div>
            <div className="p-6">
              <AttendanceMonthlyChart />
            </div>
          </div>
        )}

        {/* Modal */}
        <AttendanceModal
          open={modalOpen}
          date={selectedDate}
          row={selectedRow}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            load();
            setToast({
              type: "success",
              message: "Attendance saved successfully"
            });
          }}
        />

        {/* Quick Actions */}
        {canWrite && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => openModal(new Date().toISOString().slice(0, 10))}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-left text-white hover:bg-white/30 transition-all duration-200 active:scale-95"
              >
                <div className="font-semibold">Mark Today's Attendance</div>
                <div className="text-sm opacity-90 mt-1">Record attendance for today</div>
              </button>
              <button
                onClick={load}
                disabled={dataLoading}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-left text-white hover:bg-white/30 transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                <div className="font-semibold">Refresh Data</div>
                <div className="text-sm opacity-90 mt-1">Sync latest attendance records</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}