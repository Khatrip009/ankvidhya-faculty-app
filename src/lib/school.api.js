// src/lib/school.api.js

import api from "./api";

export async function listSchools(params = {}) {
  return api.get("/api/schools/schools", { query: params });
}

export async function getSchool(schoolId) {
  return api.get(`/api/schools/schools/${schoolId}`);
}

export async function listSchoolMediums(schoolId) {
  return api.get("/api/schools/schools/school-mediums", {
    query: schoolId ? { school_id: schoolId } : {},
  });
}

export async function exportSchoolsCSV() {
  return api.download("/api/schools/schools/export/csv", {
    filename: "schools.csv",
  });
}

export async function exportSchoolsExcel() {
  return api.download("/api/schools/schools/export/xlsx", {
    filename: "schools.xlsx",
  });
}

export default {
  listSchools,
  getSchool,
  listSchoolMediums,
  exportSchoolsCSV,
  exportSchoolsExcel,
};
