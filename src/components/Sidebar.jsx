import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, memo } from "react";

// Icon components (using inline SVGs for no dependencies)

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const SchoolIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const TeachingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ProgressIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const LearningIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const LessonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ChevronDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

/* ================= SECTION ================= */

const Section = memo(function Section({ title, children, defaultOpen = false, icon: Icon }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="group">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${open ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white" : "bg-gray-100 text-gray-600"}`}>
            <Icon />
          </div>
          {title}
        </div>
        <ChevronDown />
      </button>

      {open && (
        <div className="ml-12 mt-2 space-y-1 pl-2 border-l border-gray-200/50">
          {children}
        </div>
      )}
    </div>
  );
});

const Item = memo(function Item({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 font-semibold border-l-4 border-blue-500 shadow-sm"
            : "text-gray-700 hover:bg-gray-50/80 hover:pl-5 hover:border-l-2 hover:border-blue-300/50"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <div
              className={`p-1.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <Icon />
            </div>
          )}
          <span className="text-sm font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
});


/* ================= SIDEBAR ================= */

export default function Sidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    } catch {}

    const h = (e) => setUser(e.detail?.user || null);
    window.addEventListener("auth:changed", h);
    return () => window.removeEventListener("auth:changed", h);
  }, []);

  const name =
    user?.full_name ||
    user?.employee_name ||
    user?.student_name ||
    user?.username ||
    "User";

  const role = user?.role_name || user?.role || "Faculty";

  return (
<>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-lg"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-full w-72 bg-white border-r shadow-lg
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-lg font-bold">AnkVidhya</h1>
          <p className="text-xs text-gray-600">Faculty Portal</p>
        </div>


      <nav className="p-5 space-y-1">
        {/* Dashboard */}
        <NavLink
          to="/dashboard/faculty"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-4 ${
              isActive
                ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 font-semibold border-l-4 border-blue-500"
                : "text-gray-700 hover:bg-gray-50/80"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <DashboardIcon />
              </div>
              <span className="text-sm font-semibold">Dashboard</span>
            </>
          )}
        </NavLink>


        {/* Schools */}
        <Section
          title="Schools"
          defaultOpen={pathname.includes("/schools")}
          icon={SchoolIcon}
        >
          <Item to="/dashboard/faculty/schools" label="My Schools" />
        </Section>

        {/* Teaching */}
        <Section
          title="Teaching"
          defaultOpen={pathname.startsWith("/dashboard/faculty/calendar")}
          icon={TeachingIcon}
        >
          <Item
            to="/dashboard/faculty/calendar"
            label="My Timetable & Classes"
            icon={CalendarIcon}
          />
        </Section>

        {/* Daily Progress */}
        <Section
          title="Daily Progress"
          defaultOpen={
            pathname.includes("/daily-progress") ||
            pathname.includes("/attendance")
          }
          icon={ProgressIcon}
        >
          <Item
            to="/dashboard/faculty/daily-progress"
            label="Faculty Daily Progress"
          />
          <Item
            to="/dashboard/faculty/attendance"
            label="Attendance"
          />
        </Section>

        {/* Learnings */}
        <Section
          title="Learnings"
          defaultOpen={
            pathname.includes("/lessonplans") ||
            pathname.includes("/videos")
          }
          icon={LearningIcon}
        >
          <Item 
            to="/dashboard/faculty/lessonplans" 
            label="Lesson Plans" 
            icon={LessonIcon}
          />
          
        </Section>
      </nav>

      {/* Footer with user info */}
        <div className="p-5 border-t">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold">{name}</div>
            <div className="text-xs text-gray-600">{role}</div>
          </div>
        </div>
      </div>
    </aside>
       </>
  );
}