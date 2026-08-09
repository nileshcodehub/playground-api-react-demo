import { Link } from 'react-router';
const Main = () => {
  const collections = [
    {
      title: 'Users',
      path: '/users',
      count: '25 records',
      desc: 'User profiles with names, emails, avatars, and contact information.',
      badge: 'GET /users',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Posts',
      path: '/posts',
      count: '100 records',
      desc: 'Blog articles with titles, body content, and user relational IDs.',
      badge: 'GET /posts',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    },
    {
      title: 'Comments',
      path: '/comments',
      count: '300 records',
      desc: 'Feedback entries linked to blog posts and commentator details.',
      badge: 'GET /comments',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'Todos',
      path: '/todos',
      count: '125 records',
      desc: 'Task items with completion states, priorities, and assigned users.',
      badge: 'GET /todos',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    },
  ];
  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-r from-indigo-950/40 via-purple-950/20 to-[#111827] border border-[#1f2937] shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            React 19 + Vite Demo Client
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome to the{' '}
            <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Playground API
            </span>{' '}
            React Demo
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Experience stateful mock REST and GraphQL prototyping. Create, update, and delete
            records without losing your mutations or affecting other users.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/users"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-md hover:shadow-indigo-500/25 cursor-pointer"
            >
              Explore Users Collection →
            </Link>
            <a
              href="https://github.com/nileshcodehub/playground_api"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#1f2937] hover:bg-[#374151] border border-[#374151] text-gray-200 text-sm font-semibold transition-colors"
            >
              View API Docs
            </a>
          </div>
        </div>
      </div>
      {/* Collections Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Available Collections
          </h2>
          <span className="text-xs text-gray-400">4 mock resources ready</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collections.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="p-5 rounded-xl bg-[#111827] border border-[#1f2937] hover:border-indigo-500/50 hover:bg-[#161f30] transition-all group block shadow-md"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1f2937] text-gray-400 border border-[#374151]">
                    {item.count}
                  </span>
                </div>
                <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border bg-linear-to-r ${item.color}`}>
                  {item.badge}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
      {/* Code Example Card */}
      <div className="p-6 rounded-xl bg-[#111827] border border-[#1f2937] shadow-lg space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Quick Integration Example
        </h2>
        <div className="p-4 rounded-lg bg-[#030712] border border-[#1f2937] font-mono text-xs text-gray-300 overflow-x-auto">
          <pre>{`// Fetching data from Playground API in React
import { useEffect, useState } from 'react';
function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/v1/users')
      .then(res => res.json())
      .then(data => setUsers(data.data));
  }, []);
  return <div>{users.map(u => <div key={u.id}>{u.name}</div>)}</div>;
}`}</pre>
        </div>
      </div>
    </div>
  );
}
export default Main;