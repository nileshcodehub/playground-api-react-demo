import { NavLink } from 'react-router';

const navItems = [
  {
    category: 'Overview',
    links: [
      {
        label: 'Dashboard',
        path: '/',
        badge: 'Main',
        icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
    ],
  },
  {
    category: 'API Collections',
    links: [
      {
        label: 'Users',
        path: '/users',
        badge: '25 items',
        icon: (
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
      // {
      //   label: 'Posts',
      //   path: '/posts',
      //   badge: '100 items',
      //   icon: (
      //     <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      //       <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      //     </svg>
      //   ),
      // },
      // {
      //   label: 'Comments',
      //   path: '/comments',
      //   badge: '300 items',
      //   icon: (
      //     <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      //       <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      //     </svg>
      //   ),
      // },
      // {
      //   label: 'Todos',
      //   path: '/todos',
      //   badge: '125 items',
      //   icon: (
      //     <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      //       <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      //     </svg>
      //   ),
      // },
    ],
  },
];


const Sidebar = ({ onCloseMobile, className = '' }) => {
  return (
    <aside
      className={`w-64 bg-[#111827] border-r border-[#1f2937] flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 select-none ${className}`}
    >
      <div className="space-y-6">
        {navItems.map((group) => (
          <div key={group.category} className="space-y-2">
            <div className="px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
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
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-400 font-semibold border-l-3 border-indigo-500 shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-[#1f2937]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {link.icon}
                    <span className="truncate">{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1f2937] text-gray-400 border border-[#374151]">
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
      <div className="mt-auto pt-6 border-t border-[#1f2937]">
        <div className="p-3 rounded-lg bg-[#0b0f19]/60 border border-[#1f2937] text-xs text-gray-400 space-y-1">
          <div className="font-semibold text-gray-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Sandbox Mode
          </div>
          <p className="text-[11px] leading-relaxed text-gray-400">
            Mutations are persisted per session token and isolated from global seeds.
          </p>
        </div>
      </div>
    </aside>
  );
}
export default Sidebar;