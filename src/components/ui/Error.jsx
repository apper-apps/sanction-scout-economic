import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-error/10 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" className="h-8 w-8 text-error" />
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-400 mb-6 leading-relaxed">
          {message}
        </p>

        {showRetry && onRetry && (
          <Button onClick={onRetry} className="flex items-center gap-2">
            <ApperIcon name="RefreshCw" className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Error;