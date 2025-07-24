const API_BASE_URL = 'https://api.opensanctions.org';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getApiKey() {
  return import.meta.env.VITE_OPENSANCTIONS_API_KEY;
}

function createHeaders() {
  const apiKey = getApiKey();
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  return headers;
}

// Helper function to create proper Error objects
function createError(message, statusCode = null) {
  try {
    const error = new (globalThis.Error || Error)(message);
    if (statusCode) {
      error.statusCode = statusCode;
    }
    return error;
  } catch (e) {
    // Fallback for environments where Error constructor is not available
    const fallbackError = {
      message: message || 'An error occurred',
      name: 'Error',
      statusCode: statusCode || 500,
      toString: () => message || 'An error occurred'
    };
    return fallbackError;
  }
}

const sanctionsService = {
  async searchEntities(query, limit = 20, offset = 0) {
    if (!query || query.trim().length === 0) {
      throw createError('Search query is required');
    }

    try {
      const url = new URL(`${API_BASE_URL}/search/entities`);
      url.searchParams.append('q', query.trim());
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('offset', offset.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: createHeaders(),
      });

      if (!response.ok) {
        const statusText = response.statusText || `HTTP ${response.status}`;
        throw createError(`Search failed: ${statusText}`, response.status);
      }

const data = await response.json();
      
      if (!data || data.error) {
        throw createError(data?.detail || data?.error || 'Search failed', response.status);
      }
      
      return {
        results: data.results || [],
        total: data.total || 0,
        limit: data.limit || limit,
        offset: data.offset || offset
      };
    } catch (error) {
      // Handle specific error types for better user experience
      if (error.name === "TypeError") {
        if (error.message.includes("fetch") || error.message.includes("Load failed")) {
          throw createError("Network error. Please check your connection and try again.", null);
        }
        if (error.message.includes("timeout")) {
          throw createError("Request timeout. Please try again.", null);
        }
      }
      if (error.name === "AbortError") {
        throw createError("Request was cancelled.", null);
      }
      // Re-throw errors that already have proper formatting
      throw error;
    }
  },

// Get entity details
  async getEntityDetails(entityId) {
    await delay(200);
    
    try {
      const response = await fetch(`${API_BASE_URL}/entities/${entityId}`, {
        headers: createHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Entity not found.");
        }
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment before trying again.");
        }
throw createError(`Failed to load entity details: ${response.statusText}`, response.status);
      }
      
      const data = await response.json();
      
      if (!data || data.error) {
        throw createError(data?.detail || data?.error || 'Failed to fetch entity details', response.status);
      }
      
      return data;
    } catch (error) {
      // Handle specific error types for better user experience
      if (error.name === "TypeError") {
        if (error.message.includes("fetch") || error.message.includes("Load failed")) {
          throw createError("Network error. Please check your connection and try again.", null);
        }
        if (error.message.includes("timeout")) {
          throw createError("Request timeout. Please try again.", null);
        }
      }
      if (error.name === "AbortError") {
        throw createError("Request was cancelled.", null);
      }
      // Re-throw errors that already have proper formatting
      throw error;
    }
  },

// Get datasets information
  async getDatasets() {
    await delay(200);
    
    try {
      const response = await fetch(`${API_BASE_URL}/datasets`, {
        headers: createHeaders()
      });
      
if (!response.ok) {
        throw createError(`Failed to load datasets: ${response.statusText}`, response.status);
      }
      
      const data = await response.json();
      
      if (!data || data.error) {
        throw createError(data?.detail || data?.error || 'Failed to fetch datasets', response.status);
      }
      
      return data;
    } catch (error) {
      // Handle specific error types for better user experience
      if (error.name === "TypeError") {
        if (error.message.includes("fetch") || error.message.includes("Load failed")) {
          throw createError("Network error. Please check your connection and try again.", null);
        }
        if (error.message.includes("timeout")) {
          throw createError("Request timeout. Please try again.", null);
        }
      }
      if (error.name === "AbortError") {
        throw createError("Request was cancelled.", null);
      }
      // Re-throw errors that already have proper formatting
// Re-throw errors that already have proper formatting
      throw error;
    }
  },

  // Check API health/connection status
// Check API health/connection status
async checkApiHealth() {
    await delay(200);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for health checks
      
      const response = await fetch(`${API_BASE_URL}/datasets`, {
        method: 'HEAD', // Use HEAD for lightweight health check
        headers: createHeaders(),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw createError(`API health check failed: ${response.statusText}`, response.status);
      }
      
      return { status: 'connected', timestamp: new Date().toISOString() };
    } catch (error) {
      // Handle specific error types for health check
      if (error.name === "TypeError") {
        if (error.message.includes("fetch") || error.message.includes("Load failed")) {
          throw createError("API connection failed", null);
        }
        if (error.message.includes("timeout")) {
          throw createError("API connection timeout", null);
        }
      }
      if (error.name === "AbortError") {
        throw createError("API health check timeout", null);
      }
      // Re-throw errors that already have proper formatting
      throw error;
    }
  }
};

export default sanctionsService;