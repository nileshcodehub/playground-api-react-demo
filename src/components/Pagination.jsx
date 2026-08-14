import { usePagination, DOTS } from "@/hooks/usePagination";

/**
 * Reusable, fully-controlled Pagination component.
 */
const Pagination = ({
  onPageChange,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  siblingCount = 1,
  prevLabel = "",
  nextLabel = "",
  className = "",
}) => {
  const safeCurrentPage = Number(currentPage) || 1;
  const safePageSize = Number(pageSize) || 10;
  const safeTotalCount = Number(totalCount) || 0;
  const totalPages = Math.max(1, Math.ceil(safeTotalCount / safePageSize));

  const paginationRange = usePagination({
    currentPage: safeCurrentPage,
    totalCount: safeTotalCount,
    siblingCount,
    pageSize: safePageSize,
  });

  if (safeTotalCount === 0) {
    return null;
  }

  const onNext = () => {
    if (safeCurrentPage < totalPages) {
      onPageChange(safeCurrentPage + 1);
    }
  };

  const onPrevious = () => {
    if (safeCurrentPage > 1) {
      onPageChange(safeCurrentPage - 1);
    }
  };

  // Derived range label
  const from = Math.min((safeCurrentPage - 1) * safePageSize + 1, safeTotalCount);
  const to = Math.min(safeCurrentPage * safePageSize, safeTotalCount);

  // Style constants
  const btnBase =
    "h-8 min-w-[2rem] px-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer";
  const btnActive = "bg-amber-500 text-slate-950 font-bold shadow-xs shadow-amber-500/20";
  const btnIdle =
    "bg-[#0f172a] text-slate-300 border border-[#1e293b] hover:border-amber-500/50 hover:text-amber-400";
  const btnNav =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-slate-300 bg-[#0f172a] border border-[#1e293b] hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer";

  return (
    <div className={`flex items-center justify-between flex-wrap gap-3 ${className}`}>
      {/* Record range label */}
      <span className="text-xs text-slate-400 font-mono">
        Showing{" "}
        <span className="text-slate-200 font-semibold">
          {from}–{to}
        </span>{" "}
        of <span className="text-slate-200 font-semibold">{safeTotalCount}</span> records
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          type="button"
          id="page-prev"
          disabled={safeCurrentPage <= 1}
          onClick={onPrevious}
          className={btnNav}
          aria-label="Previous page"
        >
          ←{prevLabel && <span>{prevLabel}</span>}
        </button>

        {/* Page numbers + DOTS */}
        {paginationRange?.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <span
                key={`dots-${index}`}
                className="flex items-center justify-center w-8 h-8 text-slate-600 text-sm select-none"
              >
                &#8230;
              </span>
            );
          }

          const isActive = pageNumber === safeCurrentPage;
          return (
            <button
              type="button"
              key={pageNumber}
              id={`page-${pageNumber}`}
              onClick={() => onPageChange(Number(pageNumber))}
              aria-current={isActive ? "page" : undefined}
              className={`${btnBase} ${isActive ? btnActive : btnIdle}`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next */}
        <button
          type="button"
          id="page-next"
          disabled={safeCurrentPage >= totalPages}
          onClick={onNext}
          className={btnNav}
          aria-label="Next page"
        >
          {nextLabel && <span>{nextLabel}</span>}→
        </button>
      </div>
    </div>
  );
};

export default Pagination;
