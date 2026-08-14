/**
 * Reusable Skeleton Loaders matching exact page limits to eliminate layout shifts
 */

/**
 * Shimmer rows for DataTable matching column definitions and count
 */
export function TableSkeletonRows({ columns = [], rows = 10 }) {
  const gridTemplate = columns.map((c) => c.width ?? "1fr").join(" ");

  return (
    <ul className="divide-y divide-[#1e293b] select-none" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="px-5 py-4 hover:bg-[#131d33]/50 transition-colors">
          {/* Desktop Grid Skeleton */}
          <div
            className="hidden md:grid gap-x-4 items-center animate-pulse"
            style={{ display: "grid", gridTemplateColumns: gridTemplate }}
          >
            {columns.map((col, j) => (
              <div key={col.key || j} className="flex items-center gap-3 min-w-0">
                {j === 0 && (
                  <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/30 shrink-0" />
                )}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div
                    className="h-3.5 bg-slate-800/90 rounded-md"
                    style={{
                      width: j === 0 ? "75%" : j === columns.length - 1 ? "60%" : "65%",
                    }}
                  />
                  {j === 0 && (
                    <div className="h-2.5 bg-slate-800/50 rounded-md w-2/5" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Stacked Skeleton */}
          <div className="md:hidden space-y-2.5 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-slate-800 rounded w-3/4" />
                <div className="h-2.5 bg-slate-800/50 rounded w-1/2" />
              </div>
            </div>
            <div className="h-3 bg-slate-800/60 rounded w-2/3 pl-11" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * User Cards Grid Skeleton matching exact limit count
 */
export function UserCardSkeletonGrid({ count = 10 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 select-none" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between space-y-4 shadow-md animate-pulse"
        >
          <div className="space-y-3">
            {/* Header: Avatar + Title & Handle */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/30 shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="h-4 bg-slate-800 rounded-md w-3/4" />
                  <div className="h-2.5 bg-slate-800/50 rounded-md w-1/2" />
                </div>
              </div>
              <div className="w-12 h-4 bg-slate-800/60 rounded-md shrink-0" />
            </div>

            {/* Metadata lines */}
            <div className="space-y-2 pt-2 border-t border-[#1e293b]/60">
              <div className="h-3 bg-slate-800/70 rounded w-4/5" />
              <div className="h-3 bg-slate-800/60 rounded w-2/3" />
              <div className="h-3 bg-slate-800/50 rounded w-1/2" />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between gap-2">
            <div className="w-24 h-7 bg-slate-800/80 rounded-lg" />
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 bg-slate-800/70 rounded-lg" />
              <div className="w-7 h-7 bg-slate-800/70 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Post Publication Cards Grid Skeleton matching exact limit count
 */
export function PostCardSkeletonGrid({ count = 10 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 select-none" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between space-y-4 shadow-md animate-pulse"
        >
          <div className="space-y-3">
            {/* Header: Author + Post ID */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700/30 shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="h-3.5 bg-slate-800 rounded-md w-3/5" />
                  <div className="h-2.5 bg-slate-800/50 rounded-md w-1/3" />
                </div>
              </div>
              <div className="w-14 h-4 bg-slate-800/60 rounded-md shrink-0" />
            </div>

            {/* Title & Body paragraph lines */}
            <div className="space-y-2 pt-1">
              <div className="h-4 bg-slate-800 rounded-md w-5/6" />
              <div className="h-4 bg-slate-800/70 rounded-md w-2/3" />
              <div className="space-y-1.5 pt-1">
                <div className="h-2.5 bg-slate-800/50 rounded w-full" />
                <div className="h-2.5 bg-slate-800/50 rounded w-full" />
                <div className="h-2.5 bg-slate-800/40 rounded w-4/5" />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between gap-2">
            <div className="w-24 h-7 bg-slate-800/80 rounded-lg" />
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 bg-slate-800/70 rounded-lg" />
              <div className="w-7 h-7 bg-slate-800/70 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Todo Task Cards Grid Skeleton matching exact limit count
 */
export function TodoCardSkeletonGrid({ count = 10 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 select-none" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between space-y-4 shadow-md animate-pulse"
        >
          <div className="space-y-3">
            {/* Header: Checkbox + Author + ID */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-4 h-4 rounded bg-slate-800 shrink-0" />
                <div className="w-7 h-7 rounded-xl bg-slate-800/90 shrink-0" />
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="h-3.5 bg-slate-800 rounded-md w-3/5" />
                  <div className="h-2 bg-slate-800/50 rounded-md w-1/3" />
                </div>
              </div>
              <div className="w-12 h-4 bg-slate-800/60 rounded-md shrink-0" />
            </div>

            {/* Task Title & Status badge */}
            <div className="space-y-2 pt-1">
              <div className="h-4 bg-slate-800 rounded-md w-4/5" />
              <div className="w-20 h-5 bg-slate-800/70 rounded-lg" />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between gap-2">
            <div className="w-20 h-7 bg-slate-800/80 rounded-lg" />
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 bg-slate-800/70 rounded-lg" />
              <div className="w-7 h-7 bg-slate-800/70 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Comments Thread Skeleton for Drawer
 */
export function CommentsSkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3 select-none" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-[#080e1a] border border-[#1e293b] space-y-2.5 animate-pulse"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-slate-800 shrink-0" />
            <div className="space-y-1 flex-1">
              <div className="h-3 bg-slate-800 rounded w-2/5" />
              <div className="h-2.5 bg-slate-800/50 rounded w-1/4" />
            </div>
          </div>
          <div className="space-y-1.5 pl-8 pt-1">
            <div className="h-2.5 bg-slate-800/70 rounded w-full" />
            <div className="h-2.5 bg-slate-800/60 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
