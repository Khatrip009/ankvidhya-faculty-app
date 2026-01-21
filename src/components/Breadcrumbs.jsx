import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  const crumbs = parts.map((part, idx) => {
    const path = "/" + parts.slice(0, idx + 1).join("/");
    return {
      label: part.replace(/-/g, " "),
      path,
    };
  });

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-semibold capitalize text-slate-800">
        {crumbs[crumbs.length - 1]?.label || "Dashboard"}
      </h1>

      <nav className="text-sm text-slate-500 mt-1">
        {crumbs.map((c, i) => (
          <span key={c.path}>
            {i > 0 && " / "}
            <Link
              to={c.path}
              className="hover:text-indigo-600 capitalize"
            >
              {c.label}
            </Link>
          </span>
        ))}
      </nav>
    </div>
  );
}
