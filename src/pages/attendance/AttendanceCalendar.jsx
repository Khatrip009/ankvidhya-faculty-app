import React, { useMemo, useState } from "react";

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

const TodayIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A6.5 6.5 0 1114.98 6.5M5 12h.01M12 12h.01M19 12h.01M5.5 12a.5.5 0 11-1 0 .5.5 0 011 0zm12 0a.5.5 0 11-1 0 .5.5 0 011 0zm-6 0a.5.5 0 11-1 0 .5.5 0 011 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 3.714a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/* ------------------ Status Config ------------------ */
const STATUS_CONFIG = {
  present: {
    bg: "bg-gradient-to-br from-emerald-500 to-green-500",
    border: "border-emerald-500",
    text: "text-emerald-700",
    label: "Present",
    icon: "P"
  },
  absent: {
    bg: "bg-gradient-to-br from-rose-500 to-red-500",
    border: "border-rose-500",
    text: "text-rose-700",
    label: "Absent",
    icon: "A"
  },
  leave: {
    bg: "bg-gradient-to-br from-amber-500 to-orange-500",
    border: "border-amber-500",
    text: "text-amber-700",
    label: "Leave",
    icon: "L"
  },
  holiday: {
    bg: "bg-gradient-to-br from-purple-500 to-violet-500",
    border: "border-purple-500",
    text: "text-purple-700",
    label: "Holiday",
    icon: "H"
  },
  halfday: {
    bg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    border: "border-blue-500",
    text: "text-blue-700",
    label: "Half Day",
    icon: "½"
  }
};

/* ------------------ Helpers ------------------ */
function isoDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isToday(year, month, day) {
  const t = new Date();
  return (
    t.getFullYear() === year &&
    t.getMonth() === month &&
    t.getDate() === day
  );
}

function isFuture(year, month, day) {
  const today = new Date();
  const d = new Date(year, month, day);
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d > today;
}

function getMonthName(month, year) {
  return new Date(year, month).toLocaleString("default", { 
    month: "long",
    year: "numeric"
  });
}

function getWeekdayHeaders() {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}

/* ------------------ Calendar Day Component ------------------ */
function CalendarDay({ 
  date, 
  day, 
  year, 
  month, 
  rowsForDate, 
  disabled, 
  onSelectDate,
  isToday
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      onSelectDate?.(date, rowsForDate);
    }
  };

  const handleMouseEnter = () => {
    if (rowsForDate.length > 0) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleTouchStart = () => {
    if (rowsForDate.length > 0) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }
  };

  const statusCounts = useMemo(() => {
    const counts = {};
    rowsForDate.forEach(r => {
      const status = r.status?.toLowerCase() || 'absent';
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [rowsForDate]);

  const hasMultipleStatuses = Object.keys(statusCounts).length > 1;
  const primaryStatus = rowsForDate[0]?.status?.toLowerCase() || null;

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          w-full h-32 rounded-xl border p-3 text-left transition-all duration-200
          ${disabled 
            ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 cursor-not-allowed opacity-80' 
            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
          }
          ${isToday 
            ? 'border-2 border-blue-500 shadow-md ring-2 ring-blue-500/20' 
            : ''
          }
          ${rowsForDate.length > 0 ? 'cursor-pointer' : ''}
        `}
        aria-label={`${date} - ${rowsForDate.length} attendance records`}
      >
        {/* Day Number */}
        <div className="flex items-center justify-between mb-2">
          <span className={`
            font-bold text-lg
            ${disabled ? 'text-gray-400' : 'text-gray-900'}
            ${isToday ? 'text-blue-600' : ''}
          `}>
            {day}
          </span>
          
          {rowsForDate.length > 0 && (
            <div className="flex items-center gap-1 text-xs font-medium">
              <UsersIcon className="text-gray-500" />
              <span className={disabled ? 'text-gray-400' : 'text-gray-600'}>
                {rowsForDate.length}
              </span>
            </div>
          )}
        </div>

        {/* Status Indicators */}
        <div className="space-y-2">
          {hasMultipleStatuses ? (
            // Multiple statuses for the day
            <div className="flex flex-wrap gap-1">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div 
                  key={status} 
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${STATUS_CONFIG[status]?.bg?.split(' ')[2]}20, ${STATUS_CONFIG[status]?.bg?.split(' ')[5]}20)`,
                    color: STATUS_CONFIG[status]?.text?.replace('text-', ''),
                    border: `1px solid ${STATUS_CONFIG[status]?.border?.replace('border-', '')}40`
                  }}
                >
                  <span className="text-xs">{STATUS_CONFIG[status]?.icon || status[0].toUpperCase()}</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          ) : primaryStatus ? (
            // Single status for the day
            <div className="flex items-center justify-center">
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold w-full"
                style={{
                  background: `linear-gradient(135deg, ${STATUS_CONFIG[primaryStatus]?.bg?.split(' ')[2]}20, ${STATUS_CONFIG[primaryStatus]?.bg?.split(' ')[5]}20)`,
                  color: STATUS_CONFIG[primaryStatus]?.text?.replace('text-', ''),
                  border: `1px solid ${STATUS_CONFIG[primaryStatus]?.border?.replace('border-', '')}40`
                }}
              >
                <span className="text-xs">{STATUS_CONFIG[primaryStatus]?.icon || primaryStatus[0].toUpperCase()}</span>
                <span className="flex-1 text-left">{STATUS_CONFIG[primaryStatus]?.label}</span>
                <span className="text-xs opacity-80">{rowsForDate.length}</span>
              </div>
            </div>
          ) : (
            // No attendance records
            <div className="text-center py-4">
              <div className="text-xs text-gray-400 font-medium">
                No records
              </div>
            </div>
          )}
        </div>

        {/* Today Indicator */}
        {isToday && (
          <div className="absolute bottom-2 right-2">
            <TodayIcon className="text-blue-500" />
          </div>
        )}

        {/* Future Date Indicator */}
        {disabled && !isToday && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-gray-50/50" />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && rowsForDate.length > 0 && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-3 min-w-48 max-w-64">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-300">{date}</span>
              <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
                {rowsForDate.length} record{rowsForDate.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {rowsForDate.map((record, idx) => (
                <div key={idx} className="text-xs space-y-1 pb-2 border-b border-gray-700 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate max-w-[120px]">
                      {record.employee_name}
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${STATUS_CONFIG[record.status?.toLowerCase()]?.bg?.split(' ')[2]}, ${STATUS_CONFIG[record.status?.toLowerCase()]?.bg?.split(' ')[5]})`
                      }}
                    >
                      {record.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-gray-400 truncate">
                    {record.school_name}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700 text-center">
              <span className="text-[10px] text-gray-400">Click to view/edit</span>
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------ Main Component ------------------ */
export default function AttendanceCalendar({
  rows = [],
  year,
  month,
  onSelectDate,
  onChangeMonth,
  canWrite = false,
}) {
  /* --------------------------------------------------------------
     Group attendance by date
  -------------------------------------------------------------- */
  const byDate = useMemo(() => {
    const map = {};
    for (const r of rows) {
      if (!r?.date) continue;
      if (!map[r.date]) map[r.date] = [];
      map[r.date].push(r);
    }
    return map;
  }, [rows]);

  /* --------------------------------------------------------------
     Month calculations
  -------------------------------------------------------------- */
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // Generate empty cells for days before the first day of month
  const emptyCells = Array.from({ length: firstDayOfMonth }).map((_, i) => (
    <div key={`empty-${i}`} className="h-32 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200"></div>
  ));

  /* --------------------------------------------------------------
     Current month/year for display
  -------------------------------------------------------------- */
  const currentMonthYear = getMonthName(month, year);

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              {currentMonthYear}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TodayIcon className="h-4 w-4" />
              <span>Today: {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeMonth?.(-1)}
              className="h-10 w-10 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-300 hover:shadow-md transition-all duration-200 active:scale-95"
              aria-label="Previous month"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() => {
                const today = new Date();
                onChangeMonth?.(today.getMonth() - month + (today.getFullYear() - year) * 12);
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              Today
            </button>

            <button
              onClick={() => onChangeMonth?.(1)}
              className="h-10 w-10 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-300 hover:shadow-md transition-all duration-200 active:scale-95"
              aria-label="Next month"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 px-2">
        {getWeekdayHeaders().map((day) => (
          <div 
            key={day} 
            className="text-center text-sm font-semibold text-gray-600 py-2 uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {emptyCells}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = isoDate(year, month, day);
          const rowsForDate = byDate[date] || [];
          const disabled = !canWrite || isFuture(year, month, day);
          const today = isToday(year, month, day);

          return (
            <CalendarDay
              key={date}
              date={date}
              day={day}
              year={year}
              month={month}
              rowsForDate={rowsForDate}
              disabled={disabled}
              onSelectDate={onSelectDate}
              isToday={today}
            />
          );
        })}
      </div>

      {/* Legend & Stats */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Legend */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <InfoIcon />
              Status Legend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div 
                    className="h-4 w-4 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${config.bg.split(' ')[2]}, ${config.bg.split(' ')[5]})`
                    }}
                  >
                    {config.icon}
                  </div>
                  <span className="text-sm text-gray-700 capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Month Summary</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-900">
                  {Object.keys(byDate).length}
                </div>
                <div className="text-xs text-gray-500">Days with records</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-900">
                  {rows.length}
                </div>
                <div className="text-xs text-gray-500">Total records</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-900">
                  {daysInMonth}
                </div>
                <div className="text-xs text-gray-500">Total days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            {canWrite 
              ? "Click on any day to mark or edit attendance. Future dates are disabled."
              : "View only mode. Contact administrator for editing permissions."
            }
          </p>
        </div>
      </div>
    </div>
  );
}