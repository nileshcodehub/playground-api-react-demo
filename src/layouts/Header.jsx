import { Link } from "react-router";
import LogoIcon from "@/components/LogoIcon";

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#111827]/90 backdrop-blur-md border-b border-[#1f2937] transition-all">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title & Mobile Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Sidebar Toggle Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-[#1f2937] text-gray-300 hover:text-white hover:bg-[#374151] border border-[#374151] lg:hidden transition-colors cursor-pointer"
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
          {/* Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <LogoIcon
              size={34}
              className="group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                  Playground API
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono">
                  React Demo
                </span>
              </div>
              <span className="text-[11px] text-gray-400 hidden sm:inline">
                Stateful Mock REST & GraphQL Service
              </span>
            </div>
          </Link>
        </div>
        {/* Right: Quick Links & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* GitHub Repo Link */}
          <a
            href="https://github.com/nileshcodehub/playground_api"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1f2937] hover:bg-[#374151] border border-[#374151] text-gray-300 hover:text-white text-xs sm:text-sm font-medium transition-all"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
