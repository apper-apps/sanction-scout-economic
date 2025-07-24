import { motion, AnimatePresence } from "framer-motion";
import EntityCard from "@/components/molecules/EntityCard";
import PaginationControls from "@/components/molecules/PaginationControls";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const SearchResults = ({
  results,
  loading,
  error,
  onRetry,
  onEntityClick,
  selectedEntityId,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!results || results.length === 0) {
    return <Empty />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Search Results ({totalItems.toLocaleString()})
        </h2>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="grid gap-4"
        >
          {results.map((entity) => (
            <motion.div key={entity.id} variants={itemVariants}>
              <EntityCard
                entity={entity}
                onClick={onEntityClick}
                isSelected={selectedEntityId === entity.id}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {totalItems > itemsPerPage && (
        <PaginationControls
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          loading={loading}
        />
      )}
    </div>
  );
};

export default SearchResults;