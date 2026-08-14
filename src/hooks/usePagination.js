import { useMemo } from "react";

export const DOTS = "...";

const range = (start, end) => {
  if (start > end) return [];
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({
  totalCount = 0,
  pageSize = 10,
  siblingCount = 1,
  currentPage = 1,
}) => {
  const paginationRange = useMemo(() => {
    const safePageSize = Number(pageSize) || 10;
    const safeTotalCount = Number(totalCount) || 0;
    const safeCurrentPage = Number(currentPage) || 1;
    const totalPageCount = Math.max(1, Math.ceil(safeTotalCount / safePageSize));

    // Pages to show: first + last + siblingCount + 2*DOTS + current page
    const totalPageNumbers = siblingCount + 5;

    // Case 1: If total pages are <= slots we want to show
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(safeCurrentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      safeCurrentPage + siblingCount,
      totalPageCount
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // Case 2: No left dots, but right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, Math.min(leftItemCount, totalPageCount));
      return [...leftRange, DOTS, lastPageIndex];
    }

    // Case 3: No right dots, but left dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(
        Math.max(1, totalPageCount - rightItemCount + 1),
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return range(1, totalPageCount);
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};
