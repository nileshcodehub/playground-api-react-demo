import { Link } from 'react-router';

const Main = () => {
  const metrics = [
    { label: 'Registered Schemas', value: '4 Resources', sub: 'Users, Posts, Comments, Todos', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { label: 'Global Seed Data', value: '550 Records', sub: 'Pristine base dataset', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
    { label: 'Mutation Isolation', value: 'Per Session', sub: 'Zero shared data leaks', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { label: 'Sync Response', value: '< 35ms', sub: 'Edge cache ready', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  ];

  const modules = [
    {
      title: 'Users Directory',
      path: '/users',
      count: '25 Records',
      desc: 'Corporate user directory with avatars, contact channels, geolocation, and company intelligence.',
      badge: 'Active Module',
      primary: true,
    },
    {
      title: 'Articles & Posts',
      path: '/users',
      count: '100 Records',
      desc: 'Relational editorial items linked with user author IDs, tags, and body content payloads.',
      badge: 'Relational',
      primary: false,
    },
    {
      title: 'Comments Moderation',
      path: '/users',
      count: '300 Records',
      desc: 'Feedback entries and conversational threads tied directly to parent publication records.',
      badge: 'Relational',
      primary: false,
    },
    {
      title: 'Task & Todo Engine',
      path: '/users',
      count: '125 Records',
      desc: 'Task assignment records with binary completion flags, user ownership, and category tags.',
      badge: 'Stateful',
      primary: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Executive Header Banner ── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-xl relative overflow-hidden">
        {/* Subtle accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-sky-500 to-amber-500 opacity-80" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Executive Directory & Data Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Enterprise React Client Workspace
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              A high-precision client implementation demonstrating stateful CRUD operations, 
              live search filtering, relational lookups, and session sandbox mutations against Playground API.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/users"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-amber-500/10 flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Users Studio</span>
              <span>→</span>
            </Link>
            <a
              href="https://github.com/nileshcodehub/playground_api"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#1e293b] hover:bg-[#283852] border border-[#283852] text-slate-200 text-sm font-semibold transition-colors"
            >
              API Reference
            </a>
          </div>
        </div>
      </div>

      {/* ── Executive Metric Tiles ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">{m.label}</span>
              <svg className="w-4 h-4 text-amber-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
              </svg>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">{m.value}</div>
            <div className="text-[11px] text-slate-400">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Active Modules Grid ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Data Collections & Modules
          </h2>
          <span className="text-xs text-slate-400 font-mono">REST v1 Schema</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`p-6 rounded-2xl bg-[#0f172a] border transition-all group block shadow-md ${
                item.primary
                  ? 'border-amber-500/40 hover:border-amber-500 hover:bg-[#131d33]'
                  : 'border-[#1e293b] hover:border-slate-600 hover:bg-[#131d33]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#080e1a] text-slate-300 border border-[#1e293b]">
                    {item.count}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/25">
                  {item.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Architecture & Integration Code ── */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Zero-Config Client Integration
          </h2>
          <span className="text-xs text-slate-400 font-mono">React 19 / Vite</span>
        </div>

        <div className="p-4 rounded-xl bg-[#080e1a] border border-[#1e293b] font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
          <pre>{`// Seamless REST Integration with Stateful Overlay Persistence
import { useEffect, useState } from 'react';
import { usersApi } from '@/api/users';

export function UserDirectory() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Automatically inherits browser session sandbox token
    usersApi.list({ page: 1, limit: 10, _sort: 'name', _order: 'asc' })
      .then((res) => setUsers(res.data));
  }, []);

  return <div>{users.map(u => <div key={u.id}>{u.name} ({u.email})</div>)}</div>;
}`}</pre>
        </div>
      </div>
    </div>
  );
};
export default Main;