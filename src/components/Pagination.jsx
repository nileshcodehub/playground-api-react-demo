import { usePagination, DOTS } from "@/hooks/usePagination";

/**
 * Reusable, fully-controlled Pagination component.
 *
 * Props mirror the reference Pagination component so the API is consistent
 * across any future pages (Posts, Todos, Comments, etc.).
 *
 * @param {function} props.onPageChange  - Called with the new page number
 * @param {number}   props.totalCount    - Total number of records
 * @param {number}   props.currentPage   - Active page (1-indexed, controlled by parent)
 * @param {number}   props.pageSize      - Records per page
 * @param {number}   [props.siblingCount=1] - Page buttons shown on each side of current
 * @param {string}   [props.prevLabel=""] - Optional text shown next to ← icon
 * @param {string}   [props.nextLabel=""] - Optional text shown next to → icon
 * @param {string}   [props.className=""] - Extra classes for the root container
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

  // Don't render if there's only 1 page or no data (matches reference exactly)
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
    "h-8 min-w-[2rem] px-2 rounded-lg text-sm font-semibold transition-colors";
  const btnActive = "bg-indigo-600 text-white shadow-md";
  const btnIdle =
    "bg-[#111827] text-gray-400 border border-[#1f2937] hover:border-indigo-500/40 hover:text-indigo-400";
  const btnNav =
    "flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-400 bg-[#111827] border border-[#1f2937] hover:border-indigo-500/40 hover:text-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors";

  return (
    <div className={`flex items-center justify-between flex-wrap gap-3 ${className}`}>
      {/* Record range label */}
      <span className="text-xs text-gray-500">
        Showing{" "}
        <span className="text-gray-300 font-medium">
          {from}–{to}
        </span>{" "}
        of <span className="text-gray-300 font-medium">{totalCount}</span>
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1">
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
                className="flex items-center justify-center w-8 h-8 text-gray-600 text-sm select-none"
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
