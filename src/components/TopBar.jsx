import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../lib/auth";

// Icons import (you can use react-icons or any icon library)
import { 
  FiCalendar, 
  FiBell, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiChevronDown,
  FiMenu,
  FiX
} from "react-icons/fi";
import { HiOutlineCalendar, HiOutlineBell } from "react-icons/hi2";

export default function TopBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Load user + listen to auth changes
  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    } catch {}

    function onAuthChanged(e) {
      setUser(e.detail?.user || null);
    }

    window.addEventListener("auth:changed", onAuthChanged);
    return () => window.removeEventListener("auth:changed", onAuthChanged);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Handle escape key to close dropdowns
  useEffect(() => {
    function handleEscapeKey(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        setNotificationsOpen(false);
      }
    }
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  function logout() {
    auth.logout();
    navigate("/login", { replace: true });
  }

  const displayName =
    user?.username ||
    user?.employee_name ||
    user?.student_name ||
    "User";

  const role =
    user?.role_name ||
    user?.role ||
    "";

  // Mock notifications data - replace with real data
  const notifications = [
    { id: 1, title: "New assignment posted", time: "10 min ago", read: false },
    { id: 2, title: "Meeting at 2 PM", time: "1 hour ago", read: true },
    { id: 3, title: "System maintenance tonight", time: "2 hours ago", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <header className="sticky top-0 z-50 h-16 w-full flex items-center justify-between px-4 lg:px-6 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm backdrop-filter bg-white/95">
        
        {/* LEFT SIDE - Logo & Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FiX className="h-5 w-5 text-gray-700" />
            ) : (
              <FiMenu className="h-5 w-5 text-gray-700" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/images/Ank_Logo.png" 
              alt="AnkVidhya" 
              className="h-8 w-auto"
              onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextElementSibling) {
                e.target.nextElementSibling.style.display = 'flex';
              }
            }}

            />
<div className="h-8 w-8 rounded-lg bg-blue-600 ">
  <span className="text-white font-bold text-sm">AV</span>
</div>

            <span className="font-bold text-gray-900 text-lg tracking-tight hidden sm:inline">
              AnkVidhya <span className="font-medium text-gray-600">ERP</span>
            </span>
          </div>
        </div>

        {/* RIGHT SIDE - Actions & Profile */}
        <div className="flex items-center gap-2 lg:gap-4">
          
          {/* Calendar Button */}
          <button
            title="Calendar"
            className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-all duration-200 hover:text-blue-600 active:scale-95"
            onClick={() => navigate("/dashboard/faculty/calendar")}
            aria-label="Open calendar"
          >
            <HiOutlineCalendar className="h-5 w-5" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-all duration-200 hover:text-blue-600 active:scale-95"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <HiOutlineBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-5">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Mark all as read
                    </button>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 h-2 w-2 rounded-full ${
                          !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate("/dashboard/notifications");
                    }}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 p-1.5 pl-3 pr-3 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
              aria-expanded={open}
              aria-label="User menu"
            >
              {/* Avatar with gradient based on user role */}
              <div className={`h-9 w-9 rounded-full flex items-center justify-center font-semibold text-white
                ${role.toLowerCase().includes('admin') ? 'bg-gradient-to-br from-purple-600 to-pink-600' :
                  role.toLowerCase().includes('faculty') ? 'bg-gradient-to-br from-blue-600 to-cyan-500' :
                  role.toLowerCase().includes('student') ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                  'bg-gradient-to-br from-gray-600 to-gray-800'}`}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
              
              {/* User info - hidden on mobile */}
              <div className="hidden lg:block text-left">
                <div className="text-sm font-semibold text-gray-900 leading-tight">
                  {displayName}
                </div>
                <div className="text-xs text-gray-500 capitalize flex items-center gap-1">
                  {role}
                  <FiChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-5">
                {/* User Info Section */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-white
                      ${role.toLowerCase().includes('admin') ? 'bg-gradient-to-br from-purple-600 to-pink-600' :
                        role.toLowerCase().includes('faculty') ? 'bg-gradient-to-br from-blue-600 to-cyan-500' :
                        role.toLowerCase().includes('student') ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                        'bg-gradient-to-br from-gray-600 to-gray-800'}`}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm truncate">
                        {displayName}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard/profile");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiUser className="h-4 w-4 text-gray-500" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard/settings");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiSettings className="h-4 w-4 text-gray-500" />
                    <span>Settings</span>
                  </button>
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-100 pt-2 pb-2">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 hidden items-center justify-center">
            <span className="text-white font-bold text-sm">AV</span>
          </div>

            <span className="font-bold text-gray-900">AnkVidhya ERP</span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center font-semibold text-white
                ${role.toLowerCase().includes('admin') ? 'bg-gradient-to-br from-purple-600 to-pink-600' :
                  role.toLowerCase().includes('faculty') ? 'bg-gradient-to-br from-blue-600 to-cyan-500' :
                  role.toLowerCase().includes('student') ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                  'bg-gradient-to-br from-gray-600 to-gray-800'}`}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{displayName}</div>
                <div className="text-sm text-gray-500 capitalize">{role}</div>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/dashboard/profile");
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <FiUser className="h-5 w-5" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/dashboard/faculty/calendar");
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <FiCalendar className="h-5 w-5" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/dashboard/notifications");
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <FiBell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-auto h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/dashboard/settings");
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <FiSettings className="h-5 w-5" />
              <span>Settings</span>
            </button>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}