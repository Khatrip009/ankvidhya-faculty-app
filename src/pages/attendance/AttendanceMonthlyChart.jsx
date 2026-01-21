import React, { useEffect, useMemo, useState } from "react";
import { monthlyAttendanceReport } from "../../lib/emp-attendance.api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

/* ------------------ Icons ------------------ */
const ChevronLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 3.714a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="h-5 w-5 animate-spin rounded-full border-3 border-solid border-blue-600 border-r-transparent"></div>
);

const ErrorIcon = () => (
  <svg className="w-8 h-8 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

/* ------------------ Helpers ------------------ */
function formatMonth(year, month) {
  return new Date(year, month - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
}

function formatShortMonth(year, month) {
  return new Date(year, month - 1).toLocaleString("default", {
    month: "short",
    year: "numeric",
  });
}

function downloadCSV(rows, filename) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/* ------------------ Custom Tooltip ------------------ */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
    
    return (
      <div className="bg-gray-900 text-white rounded-xl shadow-2xl p-4 min-w-48">
        <div className="text-sm font-semibold mb-2 border-b border-gray-700 pb-2">
          {label}
        </div>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-medium">{entry.dataKey}</span>
              </div>
              <span className="font-bold">{entry.value || 0}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>Total</span>
            <span className="text-blue-300">{total}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

/* ------------------ Loading Skeleton ------------------ */
function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-64 mb-6"></div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-80 bg-gray-100 rounded-lg"></div>
        <div className="mt-4 grid grid-cols-5 gap-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Color Palette ------------------ */
const CHART_COLORS = [
  'linear-gradient(135deg, #3b82f6, #2563eb)', // Blue
  'linear-gradient(135deg, #10b981, #059669)', // Green
  'linear-gradient(135deg, #f59e0b, #d97706)', // Amber
  'linear-gradient(135deg, #8b5cf6, #7c3aed)', // Purple
  'linear-gradient(135deg, #ef4444, #dc2626)', // Red
  'linear-gradient(135deg, #06b6d4, #0891b2)', // Cyan
  'linear-gradient(135deg, #ec4899, #db2777)', // Pink
  'linear-gradient(135deg, #84cc16, #65a30d)', // Lime
];

const STATIC_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#84cc16', // Lime
];

/* ------------------ Main Component ------------------ */
export default function AttendanceMonthlyChart() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  /* --------------------------------------------------------------
     Month navigation
  -------------------------------------------------------------- */
  function changeMonth(delta) {
    setMonth((m) => {
      const next = m + delta;

      if (next < 1) {
        setYear((y) => y - 1);
        return 12;
      }
      if (next > 12) {
        setYear((y) => y + 1);
        return 1;
      }
      return next;
    });
  }

  const isFuture =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth() + 1);

  /* --------------------------------------------------------------
     Load monthly report
  -------------------------------------------------------------- */
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setRefreshing(true);

      const res = await monthlyAttendanceReport({ year, month });
      setData(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error("Monthly attendance load failed", e);
      setError(
        e?.response?.data?.message ||
          "Failed to load monthly attendance report. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [year, month]);

  /* --------------------------------------------------------------
     Transform → school-wise stacked format
  -------------------------------------------------------------- */
  const { chartData, schools, summaryStats } = useMemo(() => {
    const schoolSet = new Set();
    const map = {};
    let totalAttendance = 0;
    let totalEmployees = 0;

    for (const r of data) {
      const key = r.employee_name || `Employee_${r.employee_id}`;
      if (!map[key]) {
        map[key] = { employee_name: key };
        totalEmployees++;
      }

      const school = r.school_name || "Unassigned";
      schoolSet.add(school);

      const presentCount = Number(r.present_count || 0);
      map[key][school] = (map[key][school] || 0) + presentCount;
      totalAttendance += presentCount;
    }

    const schoolArray = Array.from(schoolSet);
    
    // Calculate average attendance per employee
    const averageAttendance = totalEmployees > 0 
      ? Math.round((totalAttendance / totalEmployees) * 10) / 10 
      : 0;

    return {
      chartData: Object.values(map),
      schools: schoolArray,
      summaryStats: {
        totalAttendance,
        totalEmployees,
        averageAttendance,
        totalSchools: schoolArray.length,
        monthYear: formatMonth(year, month),
      }
    };
  }, [data, year, month]);

  /* --------------------------------------------------------------
     Handle refresh
  -------------------------------------------------------------- */
  const handleRefresh = () => {
    loadData();
  };

  /* --------------------------------------------------------------
     Handle CSV export
  -------------------------------------------------------------- */
  const handleExport = () => {
    if (data.length === 0) return;
    
    const formattedDate = `${year}_${String(month).padStart(2, "0")}`;
    const filename = `attendance_report_${formattedDate}.csv`;
    downloadCSV(data, filename);
  };

  /* --------------------------------------------------------------
     Loading state
  -------------------------------------------------------------- */
  if (loading && !refreshing) {
    return <ChartSkeleton />;
  }

  /* --------------------------------------------------------------
     Error state
  -------------------------------------------------------------- */
  if (error) {
    return (
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <ErrorIcon />
          <h3 className="text-lg font-semibold text-rose-700 mt-4">Unable to Load Report</h3>
          <p className="text-rose-600 mt-2">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-md transition-all flex items-center gap-2"
          >
            <RefreshIcon />
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------
     Empty state
  -------------------------------------------------------------- */
  if (!chartData.length && !loading) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <CalendarIcon className="w-16 h-16 text-gray-300 mb-6" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Attendance Data</h3>
          <p className="text-gray-500 max-w-md mb-6">
            No attendance records found for {formatMonth(year, month)}. 
            Attendance data will appear here once records are added.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const today = new Date();
                setYear(today.getFullYear());
                setMonth(today.getMonth() + 1);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:shadow-md transition-all"
            >
              View Current Month
            </button>
            <button
              onClick={handleRefresh}
              className="px-6 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-xl hover:shadow transition-all"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------------
     Render
  -------------------------------------------------------------- */
  return (
    <div className="w-full space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm p-6 border border-blue-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Monthly Attendance Analytics</h2>
            </div>
            <p className="text-gray-600">
              Visual breakdown of attendance by employee and school
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => changeMonth(-1)}
              className="h-10 w-10 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-300 hover:shadow-md transition-all duration-200"
              aria-label="Previous month"
            >
              <ChevronLeft />
            </button>

            <div className="text-center min-w-48">
              <div className="text-lg font-bold text-gray-900">{summaryStats.monthYear}</div>
              <div className="text-sm text-gray-600">
                {chartData.length} employees, {summaryStats.totalSchools} schools
              </div>
            </div>

            <button
              onClick={() => changeMonth(1)}
              disabled={isFuture}
              className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isFuture
                  ? "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-700 hover:bg-gray-300 hover:shadow-md"
              }`}
              aria-label="Next month"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Attendance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summaryStats.totalAttendance}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
              <UsersIcon className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summaryStats.totalEmployees}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <UsersIcon className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Employee</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summaryStats.averageAttendance}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Schools</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summaryStats.totalSchools}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900">Attendance Distribution</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-xl hover:shadow transition-all duration-200 disabled:opacity-50"
              >
                {refreshing ? <LoadingSpinner /> : <RefreshIcon />}
                <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
              </button>
              
              <button
                onClick={handleExport}
                disabled={data.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                <DownloadIcon />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                barSize={40}
                barGap={4}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb" 
                  vertical={false}
                />
                <XAxis
                  dataKey="employee_name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11, fill: '#4b5563' }}
                  interval={0}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#4b5563' }}
                  label={{ 
                    value: 'Attendance Days', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: -10,
                    style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 12 }
                  }}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconSize={12}
                  iconType="circle"
                  wrapperStyle={{ 
                    fontSize: '12px',
                    paddingBottom: '20px'
                  }}
                />
                
                {schools.map((school, idx) => (
                  <Bar
                    key={school}
                    dataKey={school}
                    stackId="school"
                    name={school}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATIC_COLORS[idx % STATIC_COLORS.length]}
                      />
                    ))}
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {schools.map((school, idx) => (
                <div key={school} className="flex items-center gap-2">
                  <div 
                    className="h-4 w-4 rounded-sm"
                    style={{ backgroundColor: STATIC_COLORS[idx % STATIC_COLORS.length] }}
                  />
                  <span className="text-sm text-gray-700 truncate max-w-[120px]">{school}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights Card */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="font-medium">Highest Attendance:</span>
            </div>
            <p className="text-gray-500">
              {chartData.length > 0 
                ? `${
                    chartData.reduce((max, emp) => {
                      const total = Object.values(emp).reduce((sum, val) => 
                        typeof val === 'number' ? sum + val : sum, 0
                      );
                      return total > max.total ? { name: emp.employee_name, total } : max;
                    }, { name: '', total: 0 }).name
                  } has the highest attendance this month.`
                : 'No data available'
              }
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="font-medium">School Distribution:</span>
            </div>
            <p className="text-gray-500">
              Attendance data is distributed across {summaryStats.totalSchools} schools.
              Each color in the chart represents a different school.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <span className="font-medium">Data Export:</span>
            </div>
            <p className="text-gray-500">
              Export the complete attendance data as CSV for further analysis in 
              spreadsheet software or external reporting tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}