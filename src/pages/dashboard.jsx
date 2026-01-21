import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { loadMe, isAuthed } from "../lib/auth";
import {
  listClassSessions,
  downloadFacultyICS
} from "../lib/classSessions.api";
import { listTimetables } from "../lib/timetables.api";
import { listDailyProgress } from "../lib/dailyProgress.api";
import { listMyAssignedSchools } from "../lib/faculty-assignments.api";
import { getLessonPlans } from "../lib/lessonPlans.api";
import { getMyVideoProgress } from "../lib/empVideoProgress.api";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  School,
  BookOpen,
  Video,
  TrendingUp,
  AlertCircle,
  Loader2,
  Calendar,
  FileText,
  User,
  ChevronRight,
  WifiOff
} from "lucide-react";

/* ---------------------------------------------------
   Helper Functions
--------------------------------------------------- */
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getTodayDayOfWeek() {
  const day = new Date().getDay();
  // Adjust: Monday = 1, Sunday = 7 for backend
  return day === 0 ? 7 : day;
}

function formatTime(timeString) {
  if (!timeString) return '';
  return timeString.substring(0, 5);
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

/* ---------------------------------------------------
   Stat Card Component
--------------------------------------------------- */
function StatCard({ title, value, icon: Icon, color, subtitle }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   Data Card Component
--------------------------------------------------- */
function DataCard({ title, children, viewAllLink, icon: Icon, navigate }) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            {Icon && <Icon className="h-5 w-5 mr-2" />}
            {title}
          </h2>
          {viewAllLink && (
            <button
              onClick={() => navigate(viewAllLink)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   Main Component
--------------------------------------------------- */
export default function FacultyHome() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState({
    classSessions: true,
    facultyAssignments: true,
    dailyProgress: true,
    timetables: true,
    lessonPlans: true,
    videoProgress: true
  });

  const [stats, setStats] = useState({
    todayClasses: 0,
    upcomingClasses: 0,
    assignedSchools: 0,
    todayProgress: 0,
    videoProgress: 0,
    pendingLessonPlans: 0
  });

  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [todayTimetable, setTodayTimetable] = useState([]);
  const [recentProgress, setRecentProgress] = useState([]);
  const [assignedSchools, setAssignedSchools] = useState([]);

  /* ---------------- Safe API Call Wrapper ---------------- */
  const safeApiCall = useCallback(async (apiCall, apiName) => {
    try {
      const result = await apiCall();
      setApiStatus(prev => ({ ...prev, [apiName]: true }));
      return result;
    } catch (err) {
      console.warn(`API ${apiName} failed:`, err);
      setApiStatus(prev => ({ ...prev, [apiName]: false }));
      return null;
    }
  }, []);

  /* ---------------- Load logged-in user ---------------- */
  useEffect(() => {
    if (!isAuthed()) {
      navigate('/login');
      return;
    }

    loadMe()
      .then(userData => {
        setMe(userData);
      })
      .catch((err) => {
        console.error("Failed to load user:", err);
        setError("Failed to load user data");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  /* ---------------- Load dashboard data ---------------- */
  const loadData = useCallback(async () => {
    if (!me?.employee_id) return;

    try {
      setLoading(true);
      setError(null);

      const today = todayISO();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().slice(0, 10);
      const dayOfWeek = getTodayDayOfWeek();

      // Prepare API calls
      const apiCalls = [];

      // Class Sessions
      apiCalls.push(
        safeApiCall(
          () => listClassSessions({
            employee_id: me.employee_id,
            from: today,
            to: tomorrowStr,
            pageSize: 10
          }),
          'classSessions'
        )
      );

      // Assigned Schools
      apiCalls.push(
        safeApiCall(
          () => listMyAssignedSchools(),
          'facultyAssignments'
        )
      );

      // Daily Progress
      apiCalls.push(
        safeApiCall(
          () => listDailyProgress({ date: today, pageSize: 5 }),
          'dailyProgress'
        )
      );

      // Timetable
      apiCalls.push(
        safeApiCall(
          () => listTimetables({ 
            employee_id: me.employee_id,
            day_of_week: dayOfWeek,
            pageSize: 8 
          }),
          'timetables'
        )
      );

      // Lesson Plans
      apiCalls.push(
        safeApiCall(
          () => getLessonPlans({ 
            employee_id: me.employee_id,
            pageSize: 5 
          }),
          'lessonPlans'
        )
      );

      // Video Progress
      apiCalls.push(
        safeApiCall(
          () => getMyVideoProgress({ 
            employee_id: me.employee_id,
            pageSize: 50 
          }),
          'videoProgress'
        )
      );

      // Execute all API calls
      const results = await Promise.all(apiCalls);

      // Process results
      const [
        classSessionsRes,
        schoolsRes,
        progressRes,
        timetableRes,
        lessonPlansRes,
        videoRes
      ] = results;

      /* -------- Class Sessions -------- */
      if (classSessionsRes) {
        const sessions = classSessionsRes?.data || classSessionsRes || [];
        const todaySessions = sessions.filter(s => 
          s.session_date === today || 
          (s.session_date && s.session_date.startsWith(today))
        );
        const upcomingSessions = sessions.filter(s => 
          s.session_date === tomorrowStr || 
          (s.session_date && s.session_date.startsWith(tomorrowStr))
        );
        
        setUpcomingClasses(sessions.slice(0, 5));
        setStats(prev => ({
          ...prev,
          todayClasses: todaySessions.length,
          upcomingClasses: upcomingSessions.length
        }));
      }

      /* -------- Assigned Schools -------- */
      if (schoolsRes) {
        const schools = schoolsRes?.data || schoolsRes || [];
        const uniqueSchools = [...new Map(schools.map(s => [s.school_id, s])).values()];
        
        setAssignedSchools(uniqueSchools.slice(0, 3));
        setStats(prev => ({
          ...prev,
          assignedSchools: uniqueSchools.length
        }));
      }

      /* -------- Daily Progress -------- */
      if (progressRes) {
        const progress = progressRes?.data || progressRes || [];
        setRecentProgress(progress.slice(0, 3));
        setStats(prev => ({
          ...prev,
          todayProgress: progress.length
        }));
      }

      /* -------- Timetable -------- */
      if (timetableRes) {
        const timetable = timetableRes?.data || timetableRes || [];
        setTodayTimetable(timetable.slice(0, 4));
      }

      /* -------- Lesson Plans -------- */
      if (lessonPlansRes) {
        const lessonPlans = lessonPlansRes?.data || lessonPlansRes || [];
        const pending = lessonPlans.filter(lp => 
          !lp.status || lp.status.toLowerCase() === 'pending'
        ).length;
        setStats(prev => ({
          ...prev,
          pendingLessonPlans: pending
        }));
      }

      /* -------- Video Progress -------- */
      if (videoRes) {
        const videos = videoRes?.data || videoRes || [];
        const completed = videos.filter(v =>
          v.watched_seconds && v.duration_seconds &&
          v.watched_seconds >= v.duration_seconds * 0.9
        ).length;

        setStats(prev => ({
          ...prev,
          videoProgress: videos.length > 0
            ? Math.round((completed / videos.length) * 100)
            : 0
        }));
      }

    } catch (e) {
      console.error("Dashboard load error:", e);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [me, safeApiCall]);

  /* ---------------- Run dashboard load AFTER auth ---------------- */
  useEffect(() => {
    if (me) {
      loadData();
    }
  }, [me, loadData]);

  /* ---------------- Quick Actions Handlers ---------------- */
  const handleQuickAction = (action) => {
    switch (action) {
      case 'mark-attendance':
        navigate('/dashboard/faculty/attendance');
        break;
      case 'add-progress':
        // Navigate to daily progress list (create functionality should be there)
        navigate('/dashboard/faculty/daily-progress');
        break;
      case 'view-timetable':
        navigate('/dashboard/faculty/calendar');
        break;
      case 'download-schedule':
        if (me?.employee_id) {
          downloadFacultyICS({ employee_id: me.employee_id });
        } else {
          alert("Unable to download schedule: User ID not found");
        }
        break;
      case 'view-profile':
        navigate('/dashboard/profile');
        break;
      case 'manage-schools':
        navigate('/dashboard/faculty/schools');
        break;
      case 'view-lesson-plans':
        navigate('/dashboard/faculty/lessonplans');
        break;
      default:
        break;
    }
  };

  /* ---------------- Count unavailable APIs ---------------- */
  const unavailableApis = Object.values(apiStatus).filter(status => !status).length;

  /* ---------------- Loading UI ---------------- */
  if (loading && !me) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <main className="p-4 md:p-6 bg-gray-50 min-h-screen">
        {/* API Status Warning */}
        {unavailableApis > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <WifiOff className="h-5 w-5 mr-2" />
              <span>
                {unavailableApis === 1 ? '1 service is' : `${unavailableApis} services are`} temporarily unavailable. 
                Some data may not be displayed.
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Welcome, {me?.employee_name || me?.username || 'User'}!
              </h1>
              <p className="mt-2 text-gray-600">
                Here's your dashboard for {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
              <button
                onClick={() => handleQuickAction('view-profile')}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Profile</span>
              </button>
            </div>
          </div>

          {/* Role Badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {me?.role_name && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {me.role_name}
              </span>
            )}
            {me?.employee_id && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ID: {me.employee_id}
              </span>
            )}
            {me?.school_name && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {me.school_name}
              </span>
            )}
          </div>
        </div>

        {/* ---------------- Stats Grid ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Today's Classes"
            value={stats.todayClasses}
            subtitle={`${stats.upcomingClasses} upcoming`}
            icon={CalendarDays}
            color="blue"
          />
          <StatCard
            title="Assigned Schools"
            value={stats.assignedSchools}
            subtitle={`${assignedSchools.length} active`}
            icon={School}
            color="green"
          />
          <StatCard
            title="Today's Progress"
            value={stats.todayProgress}
            subtitle="entries recorded"
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            title="Video Progress"
            value={`${stats.videoProgress}%`}
            subtitle="training completion"
            icon={Video}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Classes */}
            <DataCard 
              title="Upcoming Classes" 
              icon={Calendar}
              viewAllLink="/dashboard/faculty/calendar"
              navigate={navigate}
            >
              {apiStatus.classSessions && upcomingClasses.length > 0 ? (
                <div className="space-y-4">
                  {upcomingClasses.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {session.subject_name || 'Class Session'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {session.school_name} • {session.std_name} {session.division_name}
                        </p>
                        {session.session_time && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(session.session_time)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {formatDate(session.session_date) || 'TBA'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  {apiStatus.classSessions ? (
                    <>
                      <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No upcoming classes scheduled</p>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-12 w-12 text-yellow-300 mx-auto mb-3" />
                      <p className="text-gray-500">Class sessions service is unavailable</p>
                    </>
                  )}
                </div>
              )}
            </DataCard>

            {/* Today's Schedule */}
            <DataCard 
              title="Today's Schedule" 
              icon={Clock}
              viewAllLink="/dashboard/faculty/calendar"
              navigate={navigate}
            >
              {apiStatus.timetables && todayTimetable.length > 0 ? (
                <div className="space-y-3">
                  {todayTimetable.map((slot, index) => (
                    <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0 w-16">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 rounded-lg font-bold">
                          {slot.period_no || index + 1}
                        </span>
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-gray-800">{slot.subject_name || 'Class'}</h4>
                        <p className="text-sm text-gray-600">
                          {slot.school_name} • {slot.std_name} {slot.division_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">
                          {slot.period_from && formatTime(slot.period_from)} - {slot.period_to && formatTime(slot.period_to)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  {apiStatus.timetables ? (
                    <>
                      <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No classes scheduled for today</p>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-12 w-12 text-yellow-300 mx-auto mb-3" />
                      <p className="text-gray-500">Timetable service is unavailable</p>
                    </>
                  )}
                </div>
              )}
            </DataCard>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <DataCard title="Quick Actions">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleQuickAction('mark-attendance')}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition flex flex-col items-center justify-center"
                >
                  <CheckCircle className="h-6 w-6 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-blue-800">Attendance</span>
                </button>
                <button
                  onClick={() => handleQuickAction('add-progress')}
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition flex flex-col items-center justify-center"
                >
                  <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-800">Add Progress</span>
                </button>
                <button
                  onClick={() => handleQuickAction('view-timetable')}
                  className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition flex flex-col items-center justify-center"
                >
                  <Calendar className="h-6 w-6 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-purple-800">Calendar</span>
                </button>
                <button
                  onClick={() => handleQuickAction('download-schedule')}
                  className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition flex flex-col items-center justify-center"
                >
                  <FileText className="h-6 w-6 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-orange-800">Download</span>
                </button>
                <button
                  onClick={() => handleQuickAction('view-profile')}
                  className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-center transition flex flex-col items-center justify-center"
                >
                  <User className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-indigo-800">Profile</span>
                </button>
                <button
                  onClick={() => handleQuickAction('manage-schools')}
                  className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-center transition flex flex-col items-center justify-center"
                >
                  <School className="h-6 w-6 text-red-600 mb-2" />
                  <span className="text-sm font-medium text-red-800">Schools</span>
                </button>
              </div>
            </DataCard>

            {/* Recent Progress */}
            <DataCard 
              title="Recent Progress" 
              icon={BookOpen}
              viewAllLink="/dashboard/faculty/daily-progress"
              navigate={navigate}
            >
              {apiStatus.dailyProgress && recentProgress.length > 0 ? (
                <div className="space-y-4">
                  {recentProgress.map((progress, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-gray-800">
                          {progress.school_name || 'School'}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {progress.subject_name || progress.work_details || 'Progress recorded'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {progress.date || 'Today'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  {apiStatus.dailyProgress ? (
                    <>
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No progress recorded today</p>
                      <button
                        onClick={() => handleQuickAction('add-progress')}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Add your first entry
                      </button>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-12 w-12 text-yellow-300 mx-auto mb-3" />
                      <p className="text-gray-500">Progress service is unavailable</p>
                    </>
                  )}
                </div>
              )}
            </DataCard>

            {/* Assigned Schools */}
            <DataCard 
              title="Assigned Schools" 
              icon={School}
              viewAllLink="/dashboard/faculty/schools"
              navigate={navigate}
            >
              {apiStatus.facultyAssignments && assignedSchools.length > 0 ? (
                <div className="space-y-4">
                  {assignedSchools.slice(0, 3).map((school, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <School className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-800">{school.school_name}</h4>
                        <p className="text-sm text-gray-600">
                          {school.medium_name && `${school.medium_name} • `}
                          {school.std_name} {school.division_name}
                        </p>
                      </div>
                    </div>
                  ))}
                  {stats.assignedSchools > 3 && (
                    <button
                      onClick={() => handleQuickAction('manage-schools')}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
                    >
                      + {stats.assignedSchools - 3} more schools
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  {apiStatus.facultyAssignments ? (
                    <>
                      <School className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No schools assigned</p>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-12 w-12 text-yellow-300 mx-auto mb-3" />
                      <p className="text-gray-500">School assignment service is unavailable</p>
                    </>
                  )}
                </div>
              )}
            </DataCard>
          </div>
        </div>

        {/* API Status Summary */}
        {unavailableApis > 0 && (
          <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Service Status</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(apiStatus).map(([service, status]) => (
                <div key={service} className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${status ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm text-gray-600 capitalize">
                    {service.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}