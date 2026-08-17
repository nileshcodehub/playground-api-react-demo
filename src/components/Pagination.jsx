import { usePagination, DOTS } from "@/hooks/usePagination";

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

  const from = Math.min((safeCurrentPage - 1) * safePageSize + 1, safeTotalCount);
  const to = Math.min(safeCurrentPage * safePageSize, safeTotalCount);

  const btnBase =
    "h-8 min-w-[2rem] px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer";
  const btnActive = "bg-emerald-600 text-white font-bold shadow-xs";
  const btnIdle =
    "bg-[#12151d] text-slate-300 border border-white/10 hover:border-white/20 hover:text-white";
  const btnNav =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm text-slate-300 bg-[#12151d] border border-white/10 hover:border-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer";

  return (
    <div className={`flex items-center justify-between flex-wrap gap-3 ${className}`}>
      <span className="text-xs text-slate-400 font-mono">
        Showing{" "}
        <span className="text-white font-semibold">
          {from}–{to}
        </span>{" "}
        of <span className="text-white font-semibold">{safeTotalCount}</span> records
      </span>

      <div className="flex items-center gap-1.5">
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

        {paginationRange?.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <span
                key={`dots-${index}`}
                className="flex items-center justify-center w-8 h-8 text-slate-600 text-xs select-none"
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
