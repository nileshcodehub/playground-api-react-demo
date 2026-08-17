import { NavLink } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export function Sidebar({ onCloseMobile, className = "" }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();

  const navGroups = [
    {
      title: "Navigation",
      items: [
        {
          label: "Overview Map",
          path: "/",
          icon: "⚡",
        },
      ],
    },
    {
      title: "Sandbox Modules",
      items: [
        {
          label: "Store & Products",
          path: "/products",
          icon: "🛍️",
        },
        {
          label: "Shopping Cart",
          path: "/cart",
          icon: "🛒",
          badge: totalItems > 0 ? `${totalItems}` : undefined,
        },
        {
          label: "Saved Wishlist",
          path: "/wishlist",
          icon: "❤️",
          badge: totalWishlistItems > 0 ? `${totalWishlistItems}` : undefined,
        },
        {
          label: "Discussions Feed",
          path: "/posts",
          icon: "💬",
        },
        {
          label: "Team Directory",
          path: "/users",
          icon: "👥",
        },
        {
          label: "Task Board",
          path: "/todos",
          icon: "✅",
        },
        {
          label: "Media Studio",
          path: "/media",
          icon: "🎨",
        },
      ],
    },
    {
      title: "Security",
      items: [
        {
          label: "JWT Auth Hub",
          path: "/auth",
          icon: "🔐",
          badge: isAuthenticated ? "Active" : undefined,
        },
      ],
    },
  ];

  return (
    <aside
      className={`w-64 shrink-0 bg-[#090a0f] border-r border-white/10 flex flex-col justify-between p-4 overflow-y-auto ${className}`}
    >
      <div className="space-y-6">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-xs font-bold"
                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-sm shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Auth Status Widget */}
      <div className="pt-4 border-t border-white/10 mt-6">
        {isAuthenticated && user ? (
          <div className="p-3 rounded-2xl bg-white/3 border border-white/10 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                {user.username?.substring(0, 2) || "US"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {user.username || "User"}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono">
                  JWT Authenticated
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full py-1.5 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer border border-rose-500/20"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <NavLink
            to="/auth"
            onClick={onCloseMobile}
            className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 transition-colors"
          >
            <span>🔐</span>
            <span>Simulate JWT Login</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
