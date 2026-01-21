import React, { useEffect, useState, useCallback } from "react";
import {
  listDailyProgress,
  createDailyProgress,
  updateDailyProgress,
  deleteDailyProgress,
} from "../../lib/dailyProgress.api";

import { listSchools } from "../../lib/school.api";
import { listBooks } from "../../lib/books.api";
import { listChapters } from "../../lib/chapters.api";
import { getLessonPlans } from "../../lib/lessonPlans.api";
import DashboardLayout from "../../layouts/DashboardLayout";

/* ------------------ Icons ------------------ */
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const SchoolIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ChapterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const CancelIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

/* ------------------ Toast Component ------------------ */
function Toast({ toast, onClose }) {
  if (!toast) return null;

  const styles = {
    success: "bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-500",
    error: "bg-gradient-to-r from-rose-500 to-red-600 border-rose-500",
    info: "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500",
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
        <div className="h-1 w-full bg-black/10">
          <div className="h-full bg-white/30 animate-[shrink_5s_linear]" />
        </div>
      </div>
    </div>
  );
}

/* ------------------ Field Component ------------------ */
function Field({ label, children, icon: Icon, error }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {Icon && <Icon />}
        {label}
        {error && <span className="text-rose-600 text-xs">({error})</span>}
      </label>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

/* ------------------ Progress Stats Component ------------------ */
function ProgressStats({ rows }) {
  const totalLectures = rows.length;
  const totalNotebooks = rows.reduce((sum, row) => sum + (parseInt(row.notebooks_checked) || 0), 0);
  const totalDays = new Set(rows.map(row => row.date)).size;
  const thisMonth = new Date().getMonth();
  const thisMonthLectures = rows.filter(row => {
    const date = new Date(row.date);
    return date.getMonth() === thisMonth;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Lectures</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalLectures}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
            <BookIcon className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Notebooks Checked</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalNotebooks}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Teaching Days</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalDays}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
            <CalendarIcon className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{thisMonthLectures}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Empty State Component ------------------ */
function EmptyState({ onAddNew }) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200 p-12 text-center">
      <div className="flex flex-col items-center justify-center">
        <EmptyIcon />
        <h3 className="text-xl font-semibold text-gray-700 mt-6">No Lectures Logged</h3>
        <p className="text-gray-500 mt-2 max-w-md">
          Start tracking your teaching progress by logging your first lecture. This helps you keep a record of topics covered and student progress.
        </p>
        <button
          onClick={onAddNew}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          Log First Lecture
        </button>
      </div>
    </div>
  );
}

/* ------------------ Loading Skeleton ------------------ */
function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="animate-pulse">
        <div className="h-14 bg-gradient-to-r from-gray-100 to-gray-200"></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 border-t border-gray-200">
            <div className="h-full px-6 flex items-center">
              <div className="flex-1 grid grid-cols-5 gap-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================================================
   Faculty Daily Progress (Academic Log)
====================================================== */

const EMPTY_FORM = {
  date: "",
  school_id: "",
  book_id: "",
  chapter_id: "",
  lessonplan_id: "",
  lecture_no: "",
  topic_covered: "",
  homework_given: "",
  notebooks_checked: "",
  remarks: "",
};

export default function FacultyDailyProgress() {
  /* ---------- State ---------- */
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState({});
  const [toast, setToast] = useState(null);

  const [schools, setSchools] = useState([]);
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  /* ---------- Load Masters ---------- */
  useEffect(() => {
    let alive = true;

    async function loadMasters() {
      try {
        const s = await listSchools();
        if (alive) setSchools(s?.data || []);
      } catch (e) {
        console.error("Failed to load schools", e);
        if (alive) setSchools([]);
      }

      try {
        const b = await listBooks();
        if (alive) setBooks(b?.data || []);
      } catch (e) {
        console.error("Failed to load books", e);
        if (alive) setBooks([]);
      }

      try {
        const lp = await getLessonPlans();
        if (alive) setLessonPlans(lp?.data || []);
      } catch (e) {
        console.error("Failed to load lesson plans", e);
        if (alive) setLessonPlans([]);
      }
    }

    loadMasters();

    return () => {
      alive = false;
    };
  }, []);

  /* ---------- Load Chapters When Book Changes ---------- */
  useEffect(() => {
    let alive = true;

    if (!form.book_id) {
      setChapters([]);
      return;
    }

    async function loadChapters() {
      try {
        const res = await listChapters({ book_id: form.book_id });
        if (alive) setChapters(res?.data || []);
      } catch (e) {
        console.error("Failed to load chapters", e);
        if (alive) setChapters([]);
      }
    }

    loadChapters();

    return () => {
      alive = false;
    };
  }, [form.book_id]);

  /* ---------- Load Daily Progress ---------- */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listDailyProgress();
      setRows(res.data || []);
    } catch (e) {
      setToast({
        type: "error",
        message: e.message || "Failed to load daily progress. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---------- Form Handlers ---------- */
  function handleChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (formErrors[key]) {
      setFormErrors(prev => ({ ...prev, [key]: "" }));
    }
  }

  function openEdit(row) {
    setEditingId(row.fdp_id);
    setForm({
      date: row.date ?? "",
      school_id: row.school_id ?? "",
      book_id: row.book_id ?? "",
      chapter_id: row.chapter_id ?? "",
      lessonplan_id: row.lessonplan_id ?? "",
      lecture_no: row.lecture_no ?? "",
      topic_covered: row.topic_covered ?? "",
      homework_given: row.homework_given ?? "",
      notebooks_checked: row.notebooks_checked ?? "",
      remarks: row.remarks ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  }

  /* ---------- Validation ---------- */
  const validateForm = () => {
    const errors = {};
    
    if (!form.date) errors.date = "Date is required";
    if (!form.school_id) errors.school_id = "School is required";
    if (!form.book_id) errors.book_id = "Book is required";
    if (!form.chapter_id) errors.chapter_id = "Chapter is required";
    if (!form.lecture_no) errors.lecture_no = "Lecture number is required";
    if (!form.topic_covered?.trim()) errors.topic_covered = "Topic covered is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ---------- Submit Handler ---------- */
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      setToast({
        type: "error",
        message: "Please fill in all required fields"
      });
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateDailyProgress(editingId, form);
        setToast({
          type: "success",
          message: "Lecture updated successfully!"
        });
      } else {
        await createDailyProgress(form);
        setToast({
          type: "success",
          message: "Lecture logged successfully!"
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      loadData();
    } catch (e) {
      setToast({
        type: "error",
        message: e.message || "Failed to save lecture. Please try again."
      });
    } finally {
      setSaving(false);
    }
  }

  /* ---------- Delete Handler ---------- */
  async function handleDelete(id) {
    setDeleting(prev => ({ ...prev, [id]: true }));
    try {
      await deleteDailyProgress(id);
      setRows(prev => prev.filter(row => row.fdp_id !== id));
      setToast({
        type: "success",
        message: "Lecture deleted successfully"
      });
    } catch (e) {
      setToast({
        type: "error",
        message: e.message || "Failed to delete lecture. Please try again."
      });
    } finally {
      setDeleting(prev => ({ ...prev, [id]: false }));
    }
  }

  /* ---------- Render ---------- */
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
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <BookIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Faculty Daily Progress</h1>
            </div>
            <p className="text-gray-600">
              Track your teaching progress, lectures, and student notebooks
            </p>
          </div>
          
          <div className="text-sm text-gray-500">
            {rows.length} lectures logged • {new Set(rows.map(r => r.date)).size} teaching days
          </div>
        </div>

        {/* Stats */}
        <ProgressStats rows={rows} />

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              {editingId ? "Edit Lecture" : "Log New Lecture"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Top Row - Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="Date" icon={CalendarIcon} error={formErrors.date}>
                <input
                  type="date"
                  required
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                    formErrors.date 
                      ? "border-rose-300 focus:ring-rose-500" 
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  value={form.date}
                  onChange={e => handleChange("date", e.target.value)}
                />
              </Field>

              <Field label="School" icon={SchoolIcon} error={formErrors.school_id}>
                <select
                  required
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                    formErrors.school_id 
                      ? "border-rose-300 focus:ring-rose-500" 
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  value={form.school_id}
                  onChange={e => handleChange("school_id", e.target.value)}
                >
                  <option value="">Select School</option>
                  {schools.map(s => (
                    <option key={s.school_id} value={s.school_id}>
                      {s.school_name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Book" icon={BookIcon} error={formErrors.book_id}>
                <select
                  required
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                    formErrors.book_id 
                      ? "border-rose-300 focus:ring-rose-500" 
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  value={form.book_id}
                  onChange={e => handleChange("book_id", e.target.value)}
                >
                  <option value="">Select Book</option>
                  {books.map(b => (
                    <option key={b.book_id} value={b.book_id}>
                      {b.book_name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Chapter" icon={ChapterIcon} error={formErrors.chapter_id}>
                <select
                  required
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                    formErrors.chapter_id 
                      ? "border-rose-300 focus:ring-rose-500" 
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  value={form.chapter_id}
                  onChange={e => handleChange("chapter_id", e.target.value)}
                  disabled={!form.book_id || chapters.length === 0}
                >
                  <option value="">Select Chapter</option>
                  {chapters.map(c => (
                    <option key={c.chapter_id} value={c.chapter_id}>
                      {c.chapter_name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Second Row - Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Lesson Plan (Optional)">
                <select
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-all"
                  value={form.lessonplan_id}
                  onChange={e => handleChange("lessonplan_id", e.target.value)}
                >
                  <option value="">Select Lesson Plan</option>
                  {lessonPlans.map(lp => (
                    <option key={lp.lp_id} value={lp.lp_id}>
                      {lp.title}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Lecture Number" error={formErrors.lecture_no}>
                <input
                  type="number"
                  required
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                    formErrors.lecture_no 
                      ? "border-rose-300 focus:ring-rose-500" 
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="Lecture No."
                  min="1"
                  value={form.lecture_no}
                  onChange={e => handleChange("lecture_no", e.target.value)}
                />
              </Field>

              <Field label="Notebooks Checked">
                <input
                  type="number"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-all"
                  placeholder="Number of notebooks"
                  min="0"
                  value={form.notebooks_checked}
                  onChange={e => handleChange("notebooks_checked", e.target.value)}
                />
              </Field>
            </div>

            {/* Text Areas */}
            <Field label="Topic Covered *" error={formErrors.topic_covered}>
              <textarea
                required
                rows="3"
                className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all resize-none ${
                  formErrors.topic_covered 
                    ? "border-rose-300 focus:ring-rose-500" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="Describe the topic covered in this lecture..."
                value={form.topic_covered}
                onChange={e => handleChange("topic_covered", e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Homework Given">
                <textarea
                  rows="2"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Homework assigned to students..."
                  value={form.homework_given}
                  onChange={e => handleChange("homework_given", e.target.value)}
                />
              </Field>

              <Field label="Remarks">
                <textarea
                  rows="2"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Additional remarks or observations..."
                  value={form.remarks}
                  onChange={e => handleChange("remarks", e.target.value)}
                />
              </Field>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <CancelIcon />
                    Cancel Edit
                  </span>
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <LoadingSpinner />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    <span>{editingId ? "Update Lecture" : "Save Lecture"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Lectures Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Lecture History</h2>
            <div className="text-sm text-gray-500">
              Showing {rows.length} lectures
            </div>
          </div>

          {loading ? (
            <TableSkeleton />
          ) : rows.length === 0 ? (
            <EmptyState onAddNew={() => {
              setForm(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
              document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
            }} />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Recent Lectures</h3>
                  <div className="text-sm text-gray-600">
                    Last updated: {new Date().toLocaleDateString()}
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
                        Lecture
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Topic
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Notebooks
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        School
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rows.map(r => (
                      <tr key={r.fdp_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{r.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{r.lecture_no || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                            {r.topic_covered || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            r.notebooks_checked > 0 
                              ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800'
                              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700'
                          }`}>
                            {r.notebooks_checked || 0} checked
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {schools.find(s => s.school_id === r.school_id)?.school_name || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(r)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 rounded-lg border border-blue-200 transition-all duration-200"
                            >
                              <EditIcon />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(r.fdp_id)}
                              disabled={deleting[r.fdp_id]}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 hover:from-rose-100 hover:to-pink-100 rounded-lg border border-rose-200 transition-all duration-200 disabled:opacity-50"
                            >
                              {deleting[r.fdp_id] ? (
                                <LoadingSpinner />
                              ) : (
                                <DeleteIcon />
                              )}
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}