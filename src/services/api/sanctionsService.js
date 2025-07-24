import React from "react";
import Error from "@/components/ui/Error";
const API_BASE_URL = "https://api.opensanctions.org";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get API key from environment variables
const getApiKey = () => import.meta.env.VITE_OPENSANCTIONS_API_KEY;

// Create headers with optional API key authentication
const createHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const apiKey = getApiKey();
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  return headers;
};

const sanctionsService = {
  // Search entities
  async searchEntities(query, limit = 20, offset = 0) {
    await delay(300);
    
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        offset: offset.toString()
});

      const response = await fetch(`${API_BASE_URL}/search?${params}`, {
        headers: createHeaders()
      });
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment before searching again.");
        }
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        results: data.results || [],
        total: data.total || 0,
        limit: data.limit || limit,
        offset: data.offset || offset
      };
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection and try again.");
      }
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
        throw new Error(`Failed to load entity details: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection and try again.");
      }
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
        throw new Error(`Failed to load datasets: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection and try again.");
      }
      throw error;
    }
  }
};

export default sanctionsService;