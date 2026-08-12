import { usePagination, DOTS } from "@/hooks/usePagination";

/**
 * Reusable, fully-controlled Pagination component.
 */
const Pagination = ({
  onPageChange,
  totalCount,
  currentPage,
  pageSize,
  siblingCount = 1,
  prevLabel = "",
  nextLabel = "",
  className = "",
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || !paginationRange || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);

  const lastPage = paginationRange[paginationRange.length - 1];

  // Derived range label
  const from = Math.min((currentPage - 1) * pageSize + 1, totalCount);
  const to = Math.min(currentPage * pageSize, totalCount);

  // Style constants
  const btnBase =
    "h-8 min-w-[2rem] px-2 rounded-xl text-sm font-semibold transition-colors";
  const btnActive = "bg-amber-500 text-slate-950 font-bold shadow-xs shadow-amber-500/20";
  const btnIdle =
    "bg-[#0f172a] text-slate-300 border border-[#1e293b] hover:border-amber-500/50 hover:text-amber-400";
  const btnNav =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-slate-300 bg-[#0f172a] border border-[#1e293b] hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium";

  return (
    <div className={`flex items-center justify-between flex-wrap gap-3 ${className}`}>
      {/* Record range label */}
      <span className="text-xs text-slate-400 font-mono">
        Showing{" "}
        <span className="text-slate-200 font-semibold">
          {from}–{to}
        </span>{" "}
        of <span className="text-slate-200 font-semibold">{totalCount}</span> records
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          id="page-prev"
          disabled={currentPage === 1}
          onClick={onPrevious}
          className={btnNav}
          aria-label="Previous page"
        >
          ←{prevLabel && <span>{prevLabel}</span>}
        </button>

        {/* Page numbers + DOTS */}
        {paginationRange.map((pageNumber, index) => {
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

          const isActive = pageNumber === currentPage;
          return (
            <button
              key={pageNumber}
              id={`page-${pageNumber}`}
              onClick={() => onPageChange(pageNumber)}
              aria-current={isActive ? "page" : undefined}
              className={`${btnBase} ${isActive ? btnActive : btnIdle}`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next */}
        <button
          id="page-next"
          disabled={currentPage === lastPage}
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
