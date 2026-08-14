import { NavLink } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { mediaApi } from "@/api/media";

const Sidebar = ({ onCloseMobile, className = "" }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems, total } = useCart();
  const { totalWishlistItems } = useWishlist();

  const navItems = [
    {
      category: "Console Hub",
      links: [
        {
          label: "Workspace Overview",
          path: "/",
          badge: "Live",
          icon: (
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          ),
        },
        {
          label: "Authentication Hub",
          path: "/auth",
          badge: isAuthenticated ? "Signed In" : "JWT Gate",
          icon: (
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      category: "Data Management",
      links: [
        {
          label: "Users Directory",
          path: "/users",
          badge: "25 records",
          icon: (
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ),
        },
        {
          label: "Posts & Articles",
          path: "/posts",
          badge: "100 records",
          icon: (
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          ),
        },
        {
          label: "Task & Todo Engine",
          path: "/todos",
          badge: "125 records",
          icon: (
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          ),
        },
        {
          label: "Media & Avatar Studio",
          path: "/media",
          badge: "Dynamic SVG",
          icon: (
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ),
        },
      ],
    },
    // Conditionally show E-Commerce & Custom resources only when user is authenticated
    ...(isAuthenticated
      ? [
          {
            category: "E-Commerce & Custom (Protected)",
            links: [
              {
                label: "Products Catalog",
                path: "/products",
                badge: "Custom API",
                icon: (
                  <svg
                    className="w-4 h-4 shrink-0 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                ),
              },
              {
                label: "Shopping Cart",
                path: "/cart",
                badge: totalItems > 0 ? `${totalItems} items · $${total.toFixed(0)}` : "Empty",
                icon: (
                  <svg
                    className="w-4 h-4 shrink-0 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
              },
              {
                label: "Saved Wishlist",
                path: "/wishlist",
                badge: totalWishlistItems > 0 ? `${totalWishlistItems} saved` : "0 items",
                icon: (
                  <svg
                    className="w-4 h-4 shrink-0 text-rose-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                ),
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <aside
      className={`w-80 bg-[#0f172a] border-r border-[#1e293b] flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 select-none ${className}`}
    >
      {/* Workspace Selector Strip */}
      <div className="mb-6 px-3 py-2.5 rounded-xl bg-[#080e1a] border border-[#1e293b] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
            D
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate leading-tight">
              Default Sandbox
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              v1 / REST Gateway
            </p>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20 shrink-0" />
      </div>

      <div className="space-y-6">
        {navItems.map((group) => (
          <div key={group.category} className="space-y-2">
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {group.category}
            </div>
            <nav className="space-y-1">
              {group.links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-amber-500/10 text-amber-300 font-semibold border-l-3 border-amber-500 shadow-xs"
                        : "text-slate-300 hover:text-white hover:bg-[#1e293b]"
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {link.icon}
                    <span className="truncate">{link.label}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border ${
                        link.path === "/products"
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/30 font-bold"
                          : "bg-[#080e1a] text-slate-400 border-[#1e293b]"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* User Profile / Auth Status Strip */}
      {isAuthenticated && user ? (
        <div className="mt-6 p-3 rounded-2xl bg-[#080e1a] border border-emerald-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={mediaApi.getAvatarUrl(user.username || "user", { size: 36, rounded: true })}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-emerald-500/40 object-contain shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-emerald-400 font-mono truncate">@{user.username}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 border border-[#1e293b] text-xs transition-colors cursor-pointer shrink-0"
            title="Sign Out"
          >
            🚪
          </button>
        </div>
      ) : (
        <div className="mt-6 p-3 rounded-2xl bg-[#080e1a] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span>🔒</span>
            <span>Unauthenticated</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Sign in on the Auth Hub to unlock the E-Commerce Products catalog.
          </p>
          <NavLink
            to="/auth"
            className="block text-center py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
          >
            Sign In / Register →
          </NavLink>
        </div>
      )}

      {/* Sidebar Footer Info */}
      <div className="mt-auto pt-4 border-t border-[#1e293b]">
        <div className="p-3.5 rounded-xl bg-[#080e1a] border border-[#1e293b] text-xs text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Isolated State Engine
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Mutations are overlaid per browser session token. Seed records
            remain pristine.
          </p>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
