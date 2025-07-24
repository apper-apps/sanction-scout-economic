import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import SearchBar from "@/components/molecules/SearchBar";
import SearchResults from "@/components/organisms/SearchResults";
import EntityDetails from "@/components/organisms/EntityDetails";
import sanctionsService from "@/services/api/sanctionsService";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [recentSearches, setRecentSearches] = useLocalStorage("sanction-scout-searches", []);

  const itemsPerPage = 20;
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery, 1);
    } else {
      setResults([]);
      setTotalItems(0);
      setError(null);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery, page = 1) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);

    try {
      const offset = (page - 1) * itemsPerPage;
      const data = await sanctionsService.searchEntities(searchQuery, itemsPerPage, offset);
      
      setResults(data.results);
      setTotalItems(data.total);
      
      // Add to recent searches
      const updatedSearches = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 10);
      setRecentSearches(updatedSearches);

      if (data.results.length === 0 && page === 1) {
        toast.info("No results found for your search query");
      } else if (page === 1) {
        toast.success(`Found ${data.total} results`);
      }
    } catch (err) {
      setError(err.message);
      setResults([]);
      setTotalItems(0);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  const handleRetry = () => {
    if (query.trim()) {
      performSearch(query, currentPage);
    }
  };

  const handleEntityClick = (entity) => {
    setSelectedEntityId(entity.id);
  };

  const handleCloseDetails = () => {
    setSelectedEntityId(null);
  };

  const handlePageChange = (page) => {
    if (query.trim()) {
      performSearch(query, page);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Search Section */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white">
                Global Sanctions Search
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Search individuals, organizations, and entities against comprehensive 
                global sanctions lists and watchlists for compliance verification.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <SearchBar
                onSearch={handleSearch}
                loading={loading}
                placeholder="Search for individuals, organizations, or entities..."
              />
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && !query && (
              <div className="max-w-3xl mx-auto">
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">
                    Recent Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="px-3 py-1 text-sm bg-surface border border-gray-700 rounded-sm text-gray-300 hover:border-gray-600 hover:bg-gray-800 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          {(query || results.length > 0 || loading || error) && (
            <SearchResults
              results={results}
              loading={loading}
              error={error}
              onRetry={handleRetry}
              onEntityClick={handleEntityClick}
              selectedEntityId={selectedEntityId}
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Entity Details Panel */}
      {selectedEntityId && (
        <EntityDetails
          entityId={selectedEntityId}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default SearchPage;