import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import sanctionsService from "@/services/api/sanctionsService";
import EntityDetails from "@/components/organisms/EntityDetails";
import SearchResults from "@/components/organisms/SearchResults";
import SearchBar from "@/components/molecules/SearchBar";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [recentSearches, setRecentSearches] = useLocalStorage("sanction-scout-searches", []);
  const [apiStatus, setApiStatus] = useState('checking'); // 'connected', 'disconnected', 'checking'
  const [lastHealthCheck, setLastHealthCheck] = useState(null);

  const itemsPerPage = 20;
  const debouncedQuery = useDebounce(query, 500);
// API Health Check Effect
useEffect(() => {
    const checkApiHealth = async () => {
      try {
        setApiStatus('checking');
        console.log('Checking API health...');
        const healthResult = await sanctionsService.checkApiHealth();
        console.log('API health check result:', healthResult);
        
        if (healthResult.status === 'connected') {
          setApiStatus('connected');
          setLastHealthCheck(new Date());
        } else {
          setApiStatus('disconnected');
          setLastHealthCheck(new Date());
        }
      } catch (error) {
        console.error('API health check failed:', {
          message: error.message,
          statusCode: error.statusCode,
          name: error.name,
          stack: error.stack
        });
        setApiStatus('disconnected');
        setLastHealthCheck(new Date());
        
        // Only show error toast if previously connected
        if (apiStatus === 'connected') {
          const errorMsg = error.message || 'API connection lost';
          toast.error(`API Error: ${errorMsg}`);
        }
      }
    };

    // Initial health check
    checkApiHealth();

    // Set up periodic health checks every 30 seconds
    const healthCheckInterval = setInterval(checkApiHealth, 30000);

    return () => clearInterval(healthCheckInterval);
  }, [apiStatus]); // Include apiStatus to detect state changes

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
      // Defensive error handling for malformed error objects
      const errorMessage = err?.message || 
                          err?.toString?.() || 
                          'An unexpected error occurred during search';
      
      console.error('Search error:', err);
      
      setError(errorMessage);
      setResults([]);
      
      // Show user-friendly error message with enhanced error handling
      let userMessage = errorMessage;
      
      if (err?.statusCode === 429) {
        userMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (err?.statusCode >= 500) {
        userMessage = 'Server error. Please try again later.';
      } else if (err?.statusCode === null && (errorMessage.includes("Network error") || errorMessage.includes("Load failed"))) {
        userMessage = 'Connection failed. Please check your internet connection and try again.';
      } else if (errorMessage.includes("timeout")) {
        userMessage = 'Request timed out. Please try again.';
      }
      
      toast.error(userMessage);
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
<div className="max-w-3xl mx-auto space-y-4">
              <SearchBar
                onSearch={handleSearch}
                loading={loading}
                placeholder="Search for individuals, organizations, or entities..."
              />
              
              {/* API Connection Status */}
              <div className="flex items-center justify-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus === 'connected' 
                    ? 'bg-success animate-pulse' 
                    : apiStatus === 'disconnected' 
                    ? 'bg-error' 
                    : 'bg-warning animate-pulse'
                }`} />
                <span className={`${
                  apiStatus === 'connected' 
                    ? 'text-success' 
                    : apiStatus === 'disconnected' 
                    ? 'text-error' 
                    : 'text-warning'
                }`}>
                  API {apiStatus === 'connected' ? 'Connected' : apiStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
                </span>
                {lastHealthCheck && (
                  <span className="text-gray-500">
                    · Last checked {lastHealthCheck.toLocaleTimeString()}
                  </span>
                )}
              </div>
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