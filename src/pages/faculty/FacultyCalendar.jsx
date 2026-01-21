import { useEffect, useState, useCallback, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

import DashboardLayout from "../../layouts/DashboardLayout";
import { listTimetables } from "../../lib/timetables.api";
import { listClassSessions, downloadFacultyICS } from "../../lib/classSessions.api";
import { getMe } from "../../lib/auth.api";
import clsx from "clsx";

/* ------------------ Icons ------------------ */
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 3.714a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="h-6 w-6 animate-spin rounded-full border-3 border-solid border-blue-600 border-r-transparent"></div>
);

/* ------------------ Helpers ------------------ */
function mapDow(d) {
  return d === 6 ? 0 : d + 1; // DB Mon=0 → FC Sun=0
}

function toTime(t) {
  if (!t) return "09:00";
  return t.length === 5 ? t : t.slice(0, 5);
}

function defaultRange() {
  const s = new Date();
  const e = new Date();
  e.setDate(s.getDate() + 7);
  return {
    start: s.toISOString().slice(0, 10),
    end: e.toISOString().slice(0, 10),
  };
}

function formatDuration(start, end) {
  const startTime = new Date(`2000-01-01T${start}`);
  const endTime = new Date(`2000-01-01T${end}`);
  const diffMs = endTime - startTime;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours === 0) return `${diffMinutes} min`;
  if (diffMinutes === 0) return `${diffHours} hr`;
  return `${diffHours} hr ${diffMinutes} min`;
}

/* ------------------ Stats Card ------------------ */
function StatsCard({ title, value, icon: Icon, color = "blue" }) {
  const colorClasses = {
    blue: "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200",
    green: "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200",
    indigo: "bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200",
    purple: "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200",
  };

  const iconColorClasses = {
    blue: "bg-gradient-to-r from-blue-500 to-blue-600",
    green: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    indigo: "bg-gradient-to-r from-indigo-500 to-indigo-600",
    purple: "bg-gradient-to-r from-purple-500 to-purple-600",
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-lg ${iconColorClasses[color]} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

/* ------------------ Upcoming Classes Component ------------------ */
function UpcomingClasses({ sessions, max = 5 }) {
  const upcoming = sessions
    .filter(s => new Date(`${s.session_date}T${toTime(s.end_time)}`) > new Date())
    .sort((a, b) => new Date(`${a.session_date}T${toTime(a.start_time)}`) - new Date(`${b.session_date}T${toTime(b.start_time)}`))
    .slice(0, max);

  if (upcoming.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50">
        <p className="text-sm text-gray-500 text-center">No upcoming classes scheduled</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {upcoming.map((session, index) => {
        const date = new Date(session.session_date);
        const isToday = date.toDateString() === new Date().toDateString();
        const isTomorrow = new Date(date.getTime() + 86400000).toDateString() === new Date().toDateString();

        return (
          <div key={session.cs_id || index} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                isToday ? "bg-gradient-to-r from-emerald-500 to-emerald-600" :
                isTomorrow ? "bg-gradient-to-r from-amber-500 to-amber-600" :
                "bg-gradient-to-r from-blue-500 to-indigo-600"
              }`}>
                <span className="text-xs font-bold text-white">
                  {isToday ? "NOW" : isTomorrow ? "TOM" : date.getDate().toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Std {session.std_name}{session.division_name ? ` / ${session.division_name}` : ""}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <ClockIcon className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-600">
                  {toTime(session.start_time)} - {toTime(session.end_time)}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {formatDuration(toTime(session.start_time), toTime(session.end_time))}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------ Main Component ------------------ */
export default function FacultyCalendar() {
  const [me, setMe] = useState(null);
  const [events, setEvents] = useState([]);
  const [classSessions, setClassSessions] = useState([]);
  const [range, setRange] = useState(defaultRange());
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalHours: 0,
    upcomingClasses: 0,
    uniqueSections: 0,
  });
  
  const calendarRef = useRef(null);
  const [calendarKey, setCalendarKey] = useState(Date.now());

  /* Load user data */
  useEffect(() => {
    getMe()
      .then(r => setMe(r.data.data))
      .catch(() => {});
  }, []);

  /* Load calendar data */
  const loadData = useCallback(async () => {
    if (!me?.employee_id || !range) return;

    setLoading(true);

    try {
      // Load timetables
      const tt = await listTimetables({
        employee_id: me.employee_id,
        pageSize: 1000,
      });

      const ttEvents = (tt.data || []).map(t => ({
        id: `tt-${t.timetable_id}`,
        title: `Std ${t.std_name}${t.division_name ? " / " + t.division_name : ""}`,
        daysOfWeek: [mapDow(Number(t.day_of_week))],
        startTime: toTime(t.start_time),
        endTime: toTime(t.end_time),
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        textColor: "#ffffff",
        extendedProps: {
          type: 'timetable',
          subject: t.subject_name,
          room: t.room_no,
          duration: formatDuration(toTime(t.start_time), toTime(t.end_time))
        }
      }));

      // Load class sessions
      const cs = await listClassSessions({
        employee_id: me.employee_id,
        from: range.start,
        to: range.end,
        pageSize: 1000,
      });

      const csData = cs.data || [];
      setClassSessions(csData);

      const csEvents = csData.map(s => ({
        id: `cs-${s.cs_id}`,
        title: `Std ${s.std_name}${s.division_name ? " / " + s.division_name : ""}`,
        start: `${s.session_date}T${toTime(s.start_time)}`,
        end: `${s.session_date}T${toTime(s.end_time)}`,
        backgroundColor: "#10b981",
        borderColor: "#059669",
        textColor: "#ffffff",
        extendedProps: {
          type: 'session',
          subject: s.subject_name,
          topic: s.topic_covered,
          attendance: s.attendance_taken,
          duration: formatDuration(toTime(s.start_time), toTime(s.end_time))
        }
      }));

      setEvents([...ttEvents, ...csEvents]);

      // Calculate stats
      const uniqueSections = new Set(
        [...tt.data || [], ...csData].map(item => `${item.std_id}-${item.division_id}`)
      ).size;

      const totalHours = [...ttEvents, ...csEvents].reduce((total, event) => {
        const start = new Date(`2000-01-01T${event.startTime || event.start.slice(11)}`);
        const end = new Date(`2000-01-01T${event.endTime || event.end.slice(11)}`);
        return total + (end - start) / (1000 * 60 * 60);
      }, 0);

      const upcomingClasses = csData.filter(s => 
        new Date(`${s.session_date}T${toTime(s.end_time)}`) > new Date()
      ).length;

      setStats({
        totalClasses: ttEvents.length + csEvents.length,
        totalHours: Math.round(totalHours * 10) / 10,
        upcomingClasses,
        uniqueSections,
      });

    } catch (error) {
      console.error("Failed to load calendar data:", error);
    } finally {
      setLoading(false);
    }
  }, [me, range]);

  /* Load data when dependencies change */
  useEffect(() => {
    loadData();
  }, [loadData]);

  /* Handle calendar export */
  const handleExport = async () => {
    if (!me?.employee_id) return;
    
    setExporting(true);
    try {
      await downloadFacultyICS({ employee_id: me.employee_id });
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  /* Refresh calendar */
  const handleRefresh = () => {
    setLoading(true);
    loadData();
    setCalendarKey(Date.now());
  };

  /* Handle event click */
  const handleEventClick = (info) => {
    const event = info.event;
    const props = event.extendedProps;
    
    let content = `
      <div class="p-2 space-y-2">
        <div class="font-bold text-lg">${event.title}</div>
        <div class="text-sm text-gray-600">
          ${event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
          ${event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
    `;
    
    if (props.type === 'timetable') {
      content += `
        <div class="text-sm"><strong>Type:</strong> Regular Timetable</div>
        ${props.subject ? `<div class="text-sm"><strong>Subject:</strong> ${props.subject}</div>` : ''}
        ${props.room ? `<div class="text-sm"><strong>Room:</strong> ${props.room}</div>` : ''}
      `;
    } else if (props.type === 'session') {
      content += `
        <div class="text-sm"><strong>Type:</strong> Scheduled Session</div>
        ${props.subject ? `<div class="text-sm"><strong>Subject:</strong> ${props.subject}</div>` : ''}
        ${props.topic ? `<div class="text-sm"><strong>Topic:</strong> ${props.topic}</div>` : ''}
        <div class="text-sm"><strong>Attendance:</strong> ${props.attendance ? 'Taken' : 'Pending'}</div>
      `;
    }
    
    content += `</div>`;
    
    // Create a custom modal or use browser alert (for simplicity, using alert)
    // In production, you might want to use a proper modal library
    alert(content.replace(/<[^>]*>/g, '')); // Strip HTML for alert
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Teaching Calendar</h1>
              </div>
              <p className="text-gray-600">
                Manage your class schedules, timetables, and sessions
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <RefreshIcon />
                )}
                <span>Refresh</span>
              </button>
              
              {me?.employee_id && (
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {exporting ? (
                    <LoadingSpinner />
                  ) : (
                    <DownloadIcon />
                  )}
                  <span>{exporting ? "Exporting..." : "Export Calendar"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Classes"
            value={stats.totalClasses}
            icon={ClockIcon}
            color="blue"
          />
          <StatsCard
            title="Total Hours"
            value={`${stats.totalHours} hrs`}
            icon={ClockIcon}
            color="green"
          />
          <StatsCard
            title="Upcoming"
            value={stats.upcomingClasses}
            icon={CalendarIcon}
            color="indigo"
          />
          <StatsCard
            title="Sections"
            value={stats.uniqueSections}
            icon={UsersIcon}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-lg font-bold text-gray-900">Schedule Overview</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
                        <span className="text-gray-600">Timetable</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-sm bg-emerald-500"></div>
                        <span className="text-gray-600">Sessions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="p-4">
                {loading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mx-auto"></div>
                      <p className="mt-4 text-gray-600 font-medium">Loading calendar...</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden border border-gray-300 relative">
                  {loading && (
                    <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
                    </div>
                  )}

                  <FullCalendar
                    ref={calendarRef}
                    plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin, listPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
                    }}
                    height="auto"
                    allDaySlot={false}
                    nowIndicator
                    slotMinTime="07:00:00"
                    slotMaxTime="20:00:00"
                    events={events}
                    eventClick={handleEventClick}
                    datesSet={(arg) => {
                      setRange(prev => {
                        const start = arg.startStr.slice(0, 10);
                        const end = arg.endStr.slice(0, 10);
                        if (prev.start === start && prev.end === end) return prev;
                        return { start, end };
                      });
                    }}
                  />
                </div>
                )}

                {/* Legend */}
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-blue-500"></div>
                    <span className="text-gray-700">Regular Timetable Classes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-emerald-500"></div>
                    <span className="text-gray-700">Scheduled Class Sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Upcoming Classes & Actions */}
          <div className="space-y-6">
            {/* Upcoming Classes Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Upcoming Classes</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                        <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <UpcomingClasses sessions={classSessions} />
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => calendarRef.current?.getApi().changeView('dayGridMonth')}
                  className="w-full bg-white/20 backdrop-blur-sm rounded-xl p-4 text-left text-white hover:bg-white/30 transition-all duration-200 active:scale-95"
                >
                  <div className="font-semibold">Monthly View</div>
                  <div className="text-sm opacity-90 mt-1">See your month at a glance</div>
                </button>
                <button
                  onClick={() => calendarRef.current?.getApi().changeView('timeGridWeek')}
                  className="w-full bg-white/20 backdrop-blur-sm rounded-xl p-4 text-left text-white hover:bg-white/30 transition-all duration-200 active:scale-95"
                >
                  <div className="font-semibold">Weekly Schedule</div>
                  <div className="text-sm opacity-90 mt-1">Detailed weekly timetable</div>
                </button>
                <button
                  onClick={() => calendarRef.current?.getApi().today()}
                  className="w-full bg-white/20 backdrop-blur-sm rounded-xl p-4 text-left text-white hover:bg-white/30 transition-all duration-200 active:scale-95"
                >
                  <div className="font-semibold">Go to Today</div>
                  <div className="text-sm opacity-90 mt-1">Jump to current date</div>
                </button>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Calendar Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mt-0.5">
                    ✓
                  </div>
                  <span>Click on any event to see details</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mt-0.5">
                    ✓
                  </div>
                  <span>Drag to navigate or use arrow keys</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mt-0.5">
                    ✓
                  </div>
                  <span>Export to sync with Google/Outlook Calendar</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}