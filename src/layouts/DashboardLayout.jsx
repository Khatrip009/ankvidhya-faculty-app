import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "../components/Breadcrumbs";
import useAuthExpired from "../hooks/useAuthExpired";

export default function DashboardLayout({ children }) {
  // Global auth expiry handling
  useAuthExpired();

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* Top */}
      <TopBar />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
