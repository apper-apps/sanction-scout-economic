import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No results found",
  message = "Try adjusting your search terms or check the spelling of names and organizations.",
  showSearchTips = true 
}) => {
  const searchTips = [
    "Try searching with just the first or last name",
    "Check for alternative spellings or transliterations",
    "Search for partial names or organizations",
    "Use common abbreviations or acronyms"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
          <ApperIcon name="Search" className="h-12 w-12 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-3">
          {title}
        </h3>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          {message}
        </p>

        {showSearchTips && (
          <div className="bg-surface border border-gray-700 rounded-sm p-6 text-left">
            <h4 className="font-medium text-white mb-4 flex items-center gap-2">
              <ApperIcon name="Lightbulb" className="h-4 w-4 text-accent" />
              Search Tips
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {searchTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <ApperIcon name="ChevronRight" className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;