import { Link, useLocation } from "react-router";
import LogoIcon from "@/components/LogoIcon";

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const location = useLocation();

  // Compute breadcrumb trail from pathname
  const currentPath = location.pathname;
  let pageTitle = "Dashboard";
  if (currentPath.startsWith("/users")) pageTitle = "Users Directory";
  else if (currentPath.startsWith("/posts")) pageTitle = "Posts Registry";
  else if (currentPath.startsWith("/comments")) pageTitle = "Comments Moderation";
  else if (currentPath.startsWith("/todos")) pageTitle = "Task Engine";
  else if (currentPath.startsWith("/media")) pageTitle = "Vector Media Studio";
  else if (currentPath.startsWith("/auth")) pageTitle = "Authentication Hub";
  else if (currentPath.startsWith("/products")) pageTitle = "E-Commerce Catalog";
  else if (currentPath.startsWith("/cart")) pageTitle = "Shopping Cart";
  else if (currentPath.startsWith("/wishlist")) pageTitle = "Saved Wishlist";

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0f172a]/95 backdrop-blur-md border-b border-[#1e293b] shadow-xs transition-all">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Breadcrumb */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Mobile Sidebar Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-[#1e293b] text-slate-300 hover:text-white hover:bg-[#283852] border border-[#283852] lg:hidden transition-colors cursor-pointer"
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Logo & Workspace Title */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <LogoIcon
              size={36}
              className="group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  Directory Studio
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Enterprise Mock Console
              </span>
            </div>
          </Link>

          {/* Divider */}
          <span className="hidden md:inline-block w-px h-6 bg-[#1e293b]" />

          {/* Breadcrumb Path */}
          <nav
            aria-label="Breadcrumb"
            className="hidden md:flex items-center gap-2 text-xs text-slate-400"
          >
            <span className="text-slate-500">Console</span>
            <span>/</span>
            <span className="text-amber-400/90 font-medium">{pageTitle}</span>
          </nav>
        </div>

        {/* Right: Live Sandbox Status & Links */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Sandbox Status Pill */}
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#080e1a] border border-[#1e293b] text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Sandbox Active
            </span>
            <span className="text-slate-400 text-[10px] hidden lg:inline">
              · Session Isolated
            </span>
          </div>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/nileshcodehub/playground_api"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1e293b] hover:bg-[#283852] border border-[#283852] text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-all"
            title="GitHub Repository"
          >
            <svg
              className="w-4 h-4 text-slate-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span className="hidden md:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
export default Header;
