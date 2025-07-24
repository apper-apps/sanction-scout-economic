import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const PaginationControls = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  loading = false,
  className 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1 && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="text-sm text-gray-400">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage <= 1 || loading}
          className="flex items-center gap-1"
        >
          <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-2 py-1 text-gray-500">...</span>
              ) : (
                <Button
                  variant={page === currentPage ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handlePageClick(page)}
                  disabled={loading}
                  className="min-w-[32px]"
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={currentPage >= totalPages || loading}
          className="flex items-center gap-1"
        >
          Next
          <ApperIcon name="ChevronRight" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;