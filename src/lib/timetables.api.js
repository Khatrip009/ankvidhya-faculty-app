// src/lib/timetables.api.js
import api from "./api";

/**
 * Faculty READ-ONLY timetable APIs
 * Backend RLS ensures faculty sees only assigned rows
 */

/**
 * List timetables
 * Supported query params:
 * - page, pageSize
 * - search
 * - school_name
 * - medium_name
 * - std_name
 * - division_name
 * - employee_name
 * - day_of_week
 * - period_no / period_from / period_to
 */
export async function listTimetables(params = {}) {
  return api.get("/api/timetables", {
    query: params,
  });
}

/**
 * Get single timetable row
 */
export async function getTimetable(timetableId) {
  return api.get(`/api/timetables/${timetableId}`);
}

/**
 * CSV export (faculty allowed – read only)
 */
export async function exportTimetablesCSV(params = {}) {
  return api.download("/api/timetables/export/csv", {
    query: params,
    filename: "timetables.csv",
  });
}

export default {
  listTimetables,
  getTimetable,
  exportTimetablesCSV,
};
