import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";

/* Faculty pages */
import FacultyHome from "./pages/FacultyHome";
import FacultySchools from "./pages/faculty/FacultySchools";
import FacultySchoolDetails from "./pages/faculty/FacultySchoolDetails";
import FacultyCalendar from "./pages/faculty/FacultyCalendar";
import LessonPlans from "./pages/faculty/LessonPlans";
import LessonPlanDetails from "./pages/faculty/LessonPlanDetails";
import VideoPlayer from "./pages/faculty/VideoPlayer";
import EmployeeAttendancePage from "./pages/attendance/EmployeeAttendancePage";
import FacultyDailyProgress from "./pages/faculty/facultyDailyProgress";
import Profile from "./pages/Profile";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------- AUTH ---------- */}
        <Route path="/login" element={<Login />} />

        {/* ---------- FACULTY DASHBOARD ---------- */}
        <Route
          path="/dashboard/faculty"
          element={
            <ProtectedRoute>
              <FacultyHome />
            </ProtectedRoute>
          }
        />

        {/* ---------- FACULTY MODULES ---------- */}

        {/* Schools */}
        <Route
          path="/dashboard/faculty/schools"
          element={
            <ProtectedRoute>
              <FacultySchools />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/faculty/schools/:id"
          element={
            <ProtectedRoute>
              <FacultySchoolDetails />
            </ProtectedRoute>
          }
        />

        {/* Calendar (Timetable + Sessions) */}
        <Route
          path="/dashboard/faculty/calendar"
          element={
            <ProtectedRoute>
              <FacultyCalendar />
            </ProtectedRoute>
          }
        />

        {/* Attendance */}
        <Route
          path="/dashboard/faculty/attendance"
          element={
            <ProtectedRoute>
              <EmployeeAttendancePage />
            </ProtectedRoute>
          }
        />

        {/* Lesson Plans */}
        <Route
          path="/dashboard/faculty/lessonplans"
          element={
            <ProtectedRoute>
              <LessonPlans />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/faculty/lessonplans/:id"
          element={
            <ProtectedRoute>
              <LessonPlanDetails />
            </ProtectedRoute>
          }
        />

        {/* Daily Progress */}
        <Route
          path="/dashboard/faculty/daily-progress"
          element={
            <ProtectedRoute>
              <FacultyDailyProgress />
            </ProtectedRoute>
          }
        />

        {/* Videos */}
        <Route
          path="/dashboard/faculty/videos/:id"
          element={
            <ProtectedRoute>
              <VideoPlayer />
            </ProtectedRoute>
          }
        />

        {/* ---------- PROFILE ---------- */}
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* ---------- FALLBACKS ---------- */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
