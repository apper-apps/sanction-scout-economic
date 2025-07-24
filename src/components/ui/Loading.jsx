import { motion } from "framer-motion";

const Loading = () => {
  const skeletonVariants = {
    loading: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          variants={skeletonVariants}
          animate="loading"
          className="p-4 bg-surface border border-gray-700 rounded-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded-sm" />
              <div className="w-16 h-4 bg-gray-600 rounded-sm" />
            </div>
            <div className="w-20 h-4 bg-gray-600 rounded-sm" />
          </div>

          <div className="space-y-2">
            <div className="w-3/4 h-6 bg-gray-600 rounded-sm" />
            <div className="w-1/2 h-4 bg-gray-600 rounded-sm" />
            <div className="w-2/3 h-4 bg-gray-600 rounded-sm" />
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
            <div className="w-24 h-3 bg-gray-600 rounded-sm" />
            <div className="w-20 h-3 bg-gray-600 rounded-sm" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;