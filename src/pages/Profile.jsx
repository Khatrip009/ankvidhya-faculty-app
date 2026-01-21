import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import auth from "../lib/auth";

import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  uploadMyProfileImage,
} from "../lib/profile";

import {
  getEmployeeProfile,
  updateEmployeeProfile,
} from "../lib/employeeProfile";

/* ------------------ Icons ------------------ */
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SuccessIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

/* ------------------ Toast Component ------------------ */
function Toast({ toast, onClose }) {
  if (!toast) return null;

  const styles = {
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500",
    error: "bg-gradient-to-r from-rose-500 to-rose-600 border-rose-500",
    info: "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500",
  };

  const icons = {
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    info: <InfoIcon />,
  };

  // Auto-close after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right-6 fade-in duration-300">
      <div className={`relative min-w-80 max-w-md rounded-xl shadow-2xl ${styles[toast.type]} border text-white overflow-hidden`}>
        <div className="absolute top-0 left-0 w-1.5 h-full bg-white/30" />
        <div className="flex items-start p-4 gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {icons[toast.type]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white/80 hover:text-white text-lg leading-none p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full bg-black/10">
          <div className="h-full bg-white/30 animate-[shrink_5s_linear]" />
        </div>
      </div>
    </div>
  );
}

/* ------------------ Field Component ------------------ */
function Field({ label, children, icon, error }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {icon && <span className="text-gray-500">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        {children}
        {error && (
          <p className="absolute -bottom-5 left-0 text-xs text-rose-600 font-medium">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------ Helper Functions ------------------ */
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

function toDateInputValue(value) {
  if (!value) return "";
  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

/* ------------------ Main Profile Page ------------------ */
export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);

  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    contact: "",
    address: "",
    dob: "",
  });

  const [pwd, setPwd] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [pwdErrors, setPwdErrors] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  /* ------------------ Load Data ------------------ */
  useEffect(() => {
    async function load() {
      try {
        const me = await getMyProfile();
        setUser(me);

        if (me.employee_id) {
          const emp = await getEmployeeProfile(me.employee_id);
          setEmployee(emp);

          setForm({
            full_name: emp.full_name || "",
            email: emp.email || me.email || "",
            contact: emp.contact || "",
            address: emp.address || "",
            dob: toDateInputValue(emp.dob),
          });

          if (emp.image) {
            // Check if it's already a data URL or needs a path
            if (emp.image.startsWith("data:image")) {
              setImagePreview(emp.image);
            } else {
              setImagePreview(`/uploads/employees/${emp.image}`);
            }
          }
        }
      } catch (e) {
        setToast({ 
          type: "error", 
          message: e.message || "Failed to load profile. Please try again." 
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ------------------ Form Handlers ------------------ */
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const onPwdChange = (e) => {
    setPwd({ ...pwd, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (pwdErrors[e.target.name]) {
      setPwdErrors({ ...pwdErrors, [e.target.name]: "" });
    }
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setToast({ 
        type: "error", 
        message: "Image size must be less than 2MB" 
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setToast({ 
        type: "error", 
        message: "Please select a valid image file" 
      });
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  /* ------------------ Validation ------------------ */
  const validateForm = () => {
    const errors = {};
    
    if (!form.full_name.trim()) {
      errors.full_name = "Full name is required";
    }
    
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (form.contact && !/^[\+]?[1-9][\d]{0,15}$/.test(form.contact.replace(/\s/g, ''))) {
      errors.contact = "Please enter a valid phone number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!pwd.current_password) {
      errors.current_password = "Current password is required";
    }
    
    if (!pwd.new_password) {
      errors.new_password = "New password is required";
    } else if (!PASSWORD_REGEX.test(pwd.new_password)) {
      errors.new_password = "Password must be 8+ chars with uppercase and special character";
    }
    
    if (pwd.new_password !== pwd.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }
    
    setPwdErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ------------------ Save Profile ------------------ */
  async function saveProfile() {
    if (!employee) return;
    
    if (!validateForm()) {
      setToast({
        type: "error",
        message: "Please fix the errors in the form"
      });
      return;
    }
    
    setSaving(true);

    try {
      await updateEmployeeProfile(employee.employee_id, {
        full_name: form.full_name,
        email: form.email,
        contact: form.contact,
        address: form.address,
        dob: form.dob || null,
      });

      const updatedUser = await updateMyProfile({
        email: form.email,
      });

      if (imageFile) {
        await uploadMyProfileImage(imageFile);
      }

      auth.setSession(updatedUser);

      setToast({ 
        type: "success", 
        message: "Profile updated successfully!" 
      });
    } catch (e) {
      setToast({ 
        type: "error", 
        message: e.message || "Failed to update profile. Please try again." 
      });
    } finally {
      setSaving(false);
    }
  }

  /* ------------------ Save Password ------------------ */
  async function savePassword() {
    if (!validatePassword()) {
      return;
    }

    setSaving(true);
    try {
      await changeMyPassword({
        current_password: pwd.current_password,
        new_password: pwd.new_password,
      });

      setPwd({ 
        current_password: "", 
        new_password: "", 
        confirm_password: "" 
      });
      setPwdErrors({});
      
      setToast({ 
        type: "success", 
        message: "Password updated successfully!" 
      });
    } catch (e) {
      setToast({ 
        type: "error", 
        message: e.message || "Failed to update password. Please check your current password." 
      });
    } finally {
      setSaving(false);
    }
  }

  /* ------------------ Loading State ------------------ */
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Add animation keyframes to global CSS */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm p-6 border border-blue-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full">
                  {employee?.designation_name || "Faculty"}
                </span>
                <span className="text-sm text-gray-600">
                  {employee?.department_name || "Department"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="text-lg font-mono font-bold text-gray-800">
                {employee?.employee_id || user?.employee_id || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Picture Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="h-40 w-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-blue-100 to-indigo-100">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-blue-600">
                        {form.full_name?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  
                  {/* Camera Overlay Button */}
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Change profile picture"
                  >
                    <CameraIcon />
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                  />
                </div>

                <div className="mt-6 text-center">
                  <h2 className="text-xl font-bold text-gray-900">{form.full_name || "User"}</h2>
                  <p className="text-gray-600 mt-1">{user?.role_name || "Role"}</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span>Joined:</span>
                    <span className="font-medium">
                      {new Date(user?.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* File Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">Profile Image</span>
                  <span className="text-gray-500">Max 2MB</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Supported: JPG, PNG, WebP
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Username</span>
                  <span className="font-medium text-gray-900">{user?.username}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-900 truncate ml-2">{form.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Account Status</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-semibold rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
                    <UserIcon className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field 
                    label="Full Name" 
                    icon={<UserIcon />}
                    error={formErrors.full_name}
                  >
                    <input
                      name="full_name"
                      value={form.full_name}
                      onChange={onChange}
                      className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                        formErrors.full_name 
                          ? "border-rose-300 focus:ring-rose-500" 
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="Enter your full name"
                    />
                  </Field>

                  <Field 
                    label="Email Address"
                    error={formErrors.email}
                  >
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                        formErrors.email 
                          ? "border-rose-300 focus:ring-rose-500" 
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="Enter your email"
                    />
                  </Field>

                  <Field 
                    label="Contact Number"
                    error={formErrors.contact}
                  >
                    <input
                      name="contact"
                      value={form.contact}
                      onChange={onChange}
                      className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                        formErrors.contact 
                          ? "border-rose-300 focus:ring-rose-500" 
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </Field>

                  <Field label="Date of Birth">
                    <input
                      type="date"
                      value={form.dob || ""}
                      onChange={(e) => setForm({ ...form, dob: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-all"
                    />
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Address">
                      <textarea
                        name="address"
                        rows="3"
                        value={form.address}
                        onChange={onChange}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition-all resize-none"
                        placeholder="Enter your full address"
                      />
                    </Field>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Change Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500">
                    <LockIcon className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field 
                    label="Current Password"
                    icon={<LockIcon />}
                    error={pwdErrors.current_password}
                  >
                    <input
                      type="password"
                      name="current_password"
                      value={pwd.current_password}
                      onChange={onPwdChange}
                      className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                        pwdErrors.current_password 
                          ? "border-rose-300 focus:ring-rose-500" 
                          : "border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                      }`}
                      placeholder="Enter current password"
                    />
                  </Field>

                  <Field 
                    label="New Password"
                    error={pwdErrors.new_password}
                  >
                    <input
                      type="password"
                      name="new_password"
                      value={pwd.new_password}
                      onChange={onPwdChange}
                      className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                        pwdErrors.new_password 
                          ? "border-rose-300 focus:ring-rose-500" 
                          : "border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                      }`}
                      placeholder="Enter new password"
                    />
                  </Field>

                  <div className="md:col-span-2">
                    <Field 
                      label="Confirm New Password"
                      error={pwdErrors.confirm_password}
                    >
                      <input
                        type="password"
                        name="confirm_password"
                        value={pwd.confirm_password}
                        onChange={onPwdChange}
                        className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                          pwdErrors.confirm_password 
                            ? "border-rose-300 focus:ring-rose-500" 
                            : "border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                        }`}
                        placeholder="Confirm new password"
                      />
                    </Field>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Password Requirements</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${/^.{8,}$/.test(pwd.new_password) ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                      At least 8 characters long
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(pwd.new_password) ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                      One uppercase letter (A-Z)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${/[^A-Za-z0-9]/.test(pwd.new_password) ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                      One special character (!@#$% etc.)
                    </li>
                  </ul>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={savePassword}
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                        Updating...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}