
/**
 * Reusable Skeleton Loaders matching exact page limits to eliminate layout shifts
 */

export function TableSkeletonRows({ columns = [], rows = 10 }) {
  const gridTemplate = columns.map((c) => c.width ?? "1fr").join(" ");

  return (
    <ul className="divide-y divide-white/5 select-none" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="px-5 py-4">
          <div
            className="hidden md:grid gap-x-4 items-center animate-pulse"
            style={{ display: "grid", gridTemplateColumns: gridTemplate }}
          >
            {columns.map((col, j) => (
              <div key={col.key || j} className="flex items-center gap-3 min-w-0">
                {j === 0 && (
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/5 shrink-0" />
                )}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div
                    className="h-3.5 bg-white/10 rounded-md"
                    style={{
                      width: j === 0 ? "75%" : j === columns.length - 1 ? "60%" : "65%",
                    }}
                  />
                  {j === 0 && (
                    <div className="h-2.5 bg-white/5 rounded-md w-2/5" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="md:hidden space-y-2.5 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-white/10 rounded w-3/4" />
                <div className="h-2.5 bg-white/5 rounded w-1/2" />
              </div>
            </div>
            <div className="h-3 bg-white/5 rounded w-2/3 pl-11" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function UserCardSkeletonGrid({ count = 10 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-[#12151d] border border-white/10 space-y-4 animate-pulse"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-white/10 shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="h-3 bg-white/5 rounded w-5/6" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PostCardSkeletonGrid({ count = 10 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-[#12151d] border border-white/10 space-y-4 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-white/10 rounded w-2/3" />
              <div className="h-2.5 bg-white/5 rounded w-1/3" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3.5 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/5 rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TodoCardSkeletonGrid({ count = 10 }) {
  return (
    <div className="space-y-2.5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl bg-[#12151d] border border-white/10 flex items-center justify-between gap-4 animate-pulse"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-5 h-5 rounded-md bg-white/10 shrink-0" />
            <div className="h-4 bg-white/10 rounded w-3/5" />
          </div>
          <div className="w-16 h-6 rounded-lg bg-white/5 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function ProductCardSkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-[#12151d] border border-white/10 overflow-hidden space-y-3 animate-pulse"
        >
          <div className="h-44 bg-white/10 w-full" />
          <div className="p-4 space-y-2.5">
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
            <div className="pt-2 flex justify-between items-center">
              <div className="h-5 bg-white/10 rounded w-1/3" />
              <div className="w-8 h-8 rounded-lg bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CommentsSkeletonList({ count = 4 }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10" />
            <div className="h-3 bg-white/10 rounded w-1/3" />
          </div>
          <div className="h-3 bg-white/5 rounded w-4/5" />
        </div>
      ))}
    </div>
  );
}
