// src/lib/emp-attendance.api.js

import api from "./api";

/**
 * List employee attendance
 * Filters:
 *  - page, pageSize
 *  - search
 *  - employee_name
 *  - school_name
 *  - status
 *  - date
 *  - date_from, date_to
 */
export async function listAttendance(params = {}) {
  return api.get("/api/employees-attendance", { query: params });
}

/**
 * Get a single attendance record by ID
 */
export async function getAttendance(attendanceId) {
  return api.get(`/api/employees-attendance/${attendanceId}`);
}

/**
 * Create a new attendance record
 * body:
 *  - employee_id | employee_name
 *  - school_id | school_name | school_medium_id
 *  - date (YYYY-MM-DD) OR punched_at (ISO)
 *  - status (present | absent | leave | holiday | halfday)
 */
export async function createAttendance(data) {
  return api.post("/api/employees-attendance", data);
}

/**
 * Update an attendance record
 * body:
 *  - employee_id | employee_name (optional)
 *  - school_id | school_name (optional)
 *  - date (optional)
 *  - status (optional)
 */
export async function updateAttendance(attendanceId, data) {
  return api.put(`/api/employees-attendance/${attendanceId}`, data);
}

/**
 * Delete an attendance record
 */
export async function deleteAttendance(attendanceId) {
  return api.delete(`/api/employees-attendance/${attendanceId}`);
}

/**
 * Bulk insert attendance records
 * body: [
 *   {
 *     employee_id | employee_name,
 *     school_id | school_name,
 *     date,
 *     status?
 *   }
 * ]
 */
export async function bulkInsertAttendance(items = []) {
  return api.post("/api/employees-attendance/bulk-insert", items);
}

/**
 * Export attendance as CSV
 * Same filters as listAttendance
 */
export async function exportAttendanceCSV(params = {}) {
  return api.download(
    "/api/employees-attendance/export/csv",
    {
      query: params,
      filename: "employee_attendance.csv",
    }
  );
}

/**
 * Monthly attendance report
 * Either:
 *  - year & month
 * OR
 *  - date_from & date_to
 */
export async function monthlyAttendanceReport(params = {}) {
  return api.get(
    "/api/employees-attendance/report/monthly",
    { query: params }
  );
}

export default {
  listAttendance,
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  bulkInsertAttendance,
  exportAttendanceCSV,
  monthlyAttendanceReport,
};
