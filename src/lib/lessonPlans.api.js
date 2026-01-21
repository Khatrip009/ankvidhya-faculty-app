// src/lib/lessonPlans.api.js
import api from "./apiClient";

/**
 * List lesson plans (faculty-safe, RLS applied)
 */
export async function getLessonPlans(params = {}) {
  const res = await api.get("/api/lesson-plans/lesson-plans", { params });
  return res.data;
}

/**
 * Get single lesson plan by ID
 */
export async function getLessonPlan(id) {
  if (!id) throw new Error("lesson plan id required");
  const res = await api.get(`/api/lesson-plans/lesson-plans/${id}`);
  return res.data;
}

export default {
  getLessonPlans,
  getLessonPlan,
};
