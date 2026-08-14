import { NavLink } from 'react-router';

const navItems = [
  {
    category: 'Console Hub',
    links: [
      {
        label: 'Workspace Overview',
        path: '/',
        badge: 'Live',
        icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
    ],
  },
  {
    category: 'Data Management',
    links: [
      {
        label: 'Users Directory',
        path: '/users',
        badge: '25 records',
        icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
      {
        label: 'Posts & Articles',
        path: '/posts',
        badge: '100 records',
        icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        ),
      },
    ],
  },
];

const Sidebar = ({ onCloseMobile, className = '' }) => {
  return (
    <aside
      className={`w-64 bg-[#0f172a] border-r border-[#1e293b] flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 select-none ${className}`}
    >
      {/* Workspace Selector Strip */}
      <div className="mb-6 px-3 py-2.5 rounded-xl bg-[#080e1a] border border-[#1e293b] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
            D
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate leading-tight">Default Sandbox</p>
            <p className="text-[10px] text-slate-400 font-mono truncate">v1 / REST Gateway</p>
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
                  end={link.path === '/'}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-300 font-semibold border-l-3 border-amber-500 shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-[#1e293b]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {link.icon}
                    <span className="truncate">{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#080e1a] text-slate-400 border border-[#1e293b]">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Info */}
      <div className="mt-auto pt-6 border-t border-[#1e293b]">
        <div className="p-3.5 rounded-xl bg-[#080e1a] border border-[#1e293b] text-xs text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Isolated State Engine
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Mutations are overlaid per browser session token. Seed records remain pristine.
          </p>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;