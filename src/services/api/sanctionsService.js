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
        entities: data.results || [],
        total: data.total || 0,
        limit: data.limit || limit,
        offset: data.offset || offset
      };
    } catch (error) {
      console.error('Search request failed:', error);
      
      // Handle specific error types for better user experience
      if (error.name === "TypeError") {
        if (error.message.includes("fetch") || error.message.includes("Load failed")) {
          throw createError(`Network error: ${error.message}. Please check your connection and try again.`, null);
        }
        if (error.message.includes("timeout")) {
          throw createError(`Request timeout: ${error.message}. Please try again.`, null);
        }
      }
      if (error.name === "AbortError") {
        throw createError("Request was cancelled.", null);
      }
      
      // For errors that already have proper formatting, preserve original context
      if (error.message && error.statusCode !== undefined) {
        throw error; // Already properly formatted
      }
      
      // For unexpected errors, wrap with context
      throw createError(`Search failed: ${error.message || 'Unknown error'}`, error.status || null);
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
          throw createError("Entity not found.", 404);
        }
        if (response.status === 429) {
          throw createError("Rate limit exceeded. Please wait a moment before trying again.", 429);
        }
        throw createError(`Failed to load entity details: ${response.statusText}`, response.status);
      }
      
      const data = await response.json();
      
      if (!data || data.error) {
        throw createError(data?.detail || data?.error || 'Entity details not available', response.status);
      }
      
      return data;
    } catch (error) {
      console.error('Entity details request failed:', error);
      
      // Handle specific error types for better user experience
      if (error.name === "TypeError") {
        if (error.message.includes("fetch") || error.message.includes("Load failed")) {
          throw createError(`Network error: ${error.message}. Please check your connection and try again.`, null);
        }
        if (error.message.includes("timeout")) {
          throw createError(`Request timeout: ${error.message}. Please try again.`, null);
        }
      }
      if (error.name === "AbortError") {
        throw createError("Request was cancelled.", null);
      }
      
      // For errors that already have proper formatting, preserve original context
      if (error.message && error.statusCode !== undefined) {
        throw error; // Already properly formatted
      }
      
      // For unexpected errors, wrap with context
      throw createError(`Entity details failed: ${error.message || 'Unknown error'}`, error.status || null);
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
      console.error('Datasets request failed:', error);
      
      // Handle specific error types for better user experience
      if (error.name === "TypeError") {
        if (error.message.includes("fetch") || error.message.includes("Load failed")) {
          throw createError(`Network error: ${error.message}. Please check your connection and try again.`, null);
        }
        if (error.message.includes("timeout")) {
          throw createError(`Request timeout: ${error.message}. Please try again.`, null);
        }
      }
      if (error.name === "AbortError") {
        throw createError("Request was cancelled.", null);
      }
      
      // For errors that already have proper formatting, preserve original context
      if (error.message && error.statusCode !== undefined) {
        throw error; // Already properly formatted
      }
      
      // For unexpected errors, wrap with context
      throw createError(`Datasets fetch failed: ${error.message || 'Unknown error'}`, error.status || null);
    }
  },

// Check API health/connection status
  async checkApiHealth() {
    await delay(200);
    
    try {
      console.log('Performing API health check...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_BASE_URL}/entities/`, {
        method: 'HEAD',
        headers: createHeaders(),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorMsg = `API health check failed: HTTP ${response.status} ${response.statusText}`;
        console.error(errorMsg);
        throw createError(errorMsg, response.status);
      }
      
      console.log('API health check successful');
      return { status: 'connected', timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('Health check error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Handle specific error types for health check
      if (error.name === "TypeError") {
        if (error.message.includes("fetch") || error.message.includes("Load failed")) {
          const detailedMsg = `API connection failed: ${error.message}`;
          throw createError(detailedMsg, null);
        }
        if (error.message.includes("timeout")) {
          const detailedMsg = `API connection timeout: ${error.message}`;
          throw createError(detailedMsg, null);
        }
        // Generic TypeError
        const detailedMsg = `API connection error: ${error.message}`;
        throw createError(detailedMsg, null);
      }
      if (error.name === "AbortError") {
        throw createError("API health check timeout - request aborted", null);
      }
      
      // For errors that already have proper formatting, preserve them
      if (error.message && error.statusCode !== undefined) {
        throw error; // Already properly formatted
      }
      
      // For unexpected errors, provide detailed context
      const detailedMsg = `API health check failed: ${error.message || error.name || 'Unknown error'}`;
      throw createError(detailedMsg, error.status || null);
    }
  }
};

export default sanctionsService;