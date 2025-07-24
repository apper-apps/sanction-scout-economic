import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ 
  onSearch, 
  loading = false, 
  placeholder = "Search for individuals, organizations, or entities...",
  className 
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <ApperIcon 
              name={loading ? "Loader2" : "Search"} 
              className={cn(
                "h-4 w-4 text-gray-400",
                loading && "animate-spin"
              )}
            />
          </div>
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            disabled={loading}
            className="pl-10 pr-4 h-12 text-base bg-surface border-gray-600 focus-visible:border-primary focus-visible:ring-primary/20"
          />
        </div>
        <Button
          type="submit"
          disabled={!query.trim() || loading}
          size="lg"
          className="px-6 min-w-[120px]"
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
              Searching
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;