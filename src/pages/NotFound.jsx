// src/pages/NotFound.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthed } from "../lib/auth";

const QUOTES = [
  { q: "Mathematics is the language with which God has written the universe.", a: "Galileo Galilei" },
  { q: "Education is not the learning of facts, but the training of the mind to think.", a: "Albert Einstein" },
  { q: "The only limit to our realization of tomorrow is our doubts of today.", a: "F. D. Roosevelt" },
  { q: "An investment in knowledge pays the best interest.", a: "Benjamin Franklin" },
  { q: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", a: "Benjamin Franklin" },
  { q: "The beautiful thing about learning is that no one can take it away from you.", a: "B. B. King" },
  { q: "Pure mathematics is, in its way, the poetry of logical ideas.", a: "Albert Einstein" },
  { q: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", a: "Malcolm X" },
  { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
  { q: "The expert in anything was once a beginner.", a: "Helen Hayes" },
];

function decideDashboardByRole(roleRaw = "") {
  const role = (roleRaw || "").toString().toLowerCase();
  if (!role) return "/dashboard";
  // admin-like
  if (role.includes("admin") || role.includes("super") || role.includes("manager") || role.includes("owner")) return "/dashboard/admin";
  // faculty / teacher
  if (role.includes("faculty") || role.includes("teacher") || role.includes("instructor")) return "/dashboard/faculty";
  // school / school_admin
  if (role.includes("school") || role.includes("school_admin") || role.includes("schooladmin")) return "/dashboard/school";
  // default
  return "/dashboard";
}

export default function NotFound() {
  const navigate = useNavigate();

  // Get current path for logging/reporting
  useEffect(() => {
    console.warn(`404 - Page not found: ${window.location.pathname}`);
  }, []);

  const handleGoHome = () => {
    if (isAuthed()) {
      // Get user role from localStorage to decide where to go
      const role = localStorage.getItem("role") || "";
      const target = decideDashboardByRole(role);
      navigate(target);
    } else {
      navigate("/login");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // doodles positions
  const doodles = [
    { char: "π", x: "6%", y: "8%", size: "text-2xl", delay: "delay-0" },
    { char: "∞", x: "18%", y: "22%", size: "text-3xl", delay: "delay-200" },
    { char: "Σ", x: "32%", y: "6%", size: "text-2xl", delay: "delay-400" },
    { char: "√", x: "70%", y: "12%", size: "text-2xl", delay: "delay-600" },
    { char: "Δ", x: "82%", y: "32%", size: "text-3xl", delay: "delay-800" },
    { char: "∫", x: "56%", y: "40%", size: "text-2xl", delay: "delay-1000" },
    { char: "∮", x: "12%", y: "62%", size: "text-2xl", delay: "delay-1200" },
    { char: "Δ", x: "44%", y: "74%", size: "text-2xl", delay: "delay-1400" },
    { char: "∂", x: "74%", y: "66%", size: "text-2xl", delay: "delay-1600" },
    { char: "≈", x: "82%", y: "78%", size: "text-2xl", delay: "delay-1800" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-5xl w-full shadow-2xl rounded-2xl overflow-hidden bg-white grid grid-cols-1 md:grid-cols-2">
        {/* LEFT: 404 Content */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="inline-block mb-6 p-4 bg-red-50 rounded-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 text-red-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.226 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            
            <h1 className="text-8xl font-bold text-slate-800 mb-4">
              404
            </h1>
            
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">
              Page Not Found
            </h2>
            
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Oops! The page you're looking for seems to have wandered off into the mathematical unknown. 
              Don't worry, even the greatest minds get lost sometimes.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoHome}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
              {isAuthed() ? "Go to Dashboard" : "Go to Login"}
            </button>

            <button
              onClick={handleGoBack}
              className="w-full py-3 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              Go Back
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            <p>Need help? Contact support@ankvidhya.com</p>
            <p className="mt-1">Or call us at +91 12345 67890</p>
          </div>
        </div>

        {/* RIGHT: Quotes / Art Panel */}
        <div className="relative hidden md:flex flex-col justify-center items-center text-white p-8 md:p-12 bg-gradient-to-br from-indigo-700 via-fuchsia-700 to-rose-600 overflow-hidden">
          {/* floating doodles */}
          {doodles.map((d, i) => (
            <span
              key={i}
              aria-hidden
              style={{ left: d.x, top: d.y, transitionDelay: `${i * 120}ms` }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 opacity-80 ${d.size} animate-[float_6s_ease-in-out_infinite]`}
            >
              {d.char}
            </span>
          ))}

          {/* dark overlay (soft) */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

          <div className="relative z-10 w-full max-w-md text-center">
            {/* Logo */}
            <img 
              src="/images/Ank_Logo.png" 
              alt="AnkVidhya Logo" 
              className="mx-auto mb-6 h-20 opacity-90"
            />

            {/* quote icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.17 6A5 5 0 107 16H9a3 3 0 013-3V6H7.17zM17.17 6A5 5 0 1017 16h2a3 3 0 00-3-3V6h1.17z" />
            </svg>

            <div className="mb-6">
              <p className="text-lg font-medium leading-relaxed">
                "Not all those who wander are lost, but sometimes they land on 404 pages."
              </p>
              <p className="mt-2 text-sm opacity-80">— AnkVidhya Support Team</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold mb-2">Common Destinations</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {isAuthed() ? (
                  <>
                    <button 
                      onClick={() => navigate("/dashboard/faculty")}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded transition text-left"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => navigate("/dashboard/profile")}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded transition text-left"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => navigate("/dashboard/faculty/calendar")}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded transition text-left"
                    >
                      Calendar
                    </button>
                    <button 
                      onClick={() => navigate("/dashboard/faculty/schools")}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded transition text-left"
                    >
                      Schools
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => navigate("/login")}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded transition text-left"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => navigate("/forgot-password")}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded transition text-left"
                    >
                      Reset Password
                    </button>
                    <button 
                      onClick={() => navigate("/register")}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded transition text-left"
                    >
                      Register
                    </button>
                    <button 
                      onClick={() => navigate("/contact")}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded transition text-left"
                    >
                      Contact Us
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm opacity-80">
              Error Code: 404 • {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Tiny inline style for float animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(-8px) translateX(6px) rotate(4deg); }
          100% { transform: translateY(0) translateX(0) rotate(0deg); }
        }
        .animate-[float_6s_ease-in-out_infinite] {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}