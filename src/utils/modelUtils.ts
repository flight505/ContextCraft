import { OPENROUTER_MODELS_API_URL } from '../constants/api';
import { ModelInfo } from '../types/ModelTypes';

// Constants for localStorage
const MODELS_CACHE_KEY = 'pastemax-cached-models';
const MODELS_CACHE_TIMESTAMP_KEY = 'pastemax-models-cache-timestamp';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Fetches the list of available models from the OpenRouter API.
 * @param {boolean} forceRefresh - Whether to force fetching from API instead of using cache
 * @returns {Promise<ModelInfo[] | null>} A promise that resolves to an array of model objects or null if an error occurs.
 */
export async function fetchModels(forceRefresh = false): Promise<ModelInfo[] | null> {
  // Try to get models from cache first, unless forceRefresh is true
  if (!forceRefresh) {
    const cachedModels = getCachedModels();
    if (cachedModels) {
      console.log(`Using ${cachedModels.length} cached models.`);
      return cachedModels;
    }
  }

  console.log(`Fetching models from ${OPENROUTER_MODELS_API_URL}...`);
  try {
    const response = await fetch(OPENROUTER_MODELS_API_URL);
    if (!response.ok) {
      console.error(`Error fetching models: ${response.status} ${response.statusText}`);
      // Consider more specific error handling or returning an empty array
      // depending on how the caller should react to fetch failures.
      return null;
    }
    const data = await response.json();
    // Assuming the API returns an object with a 'data' property containing the array of models
    // Adjust this based on the actual API response structure
    if (data && Array.isArray(data.data)) {
       console.log(`Successfully fetched ${data.data.length} models.`);
      const models = data.data as ModelInfo[];
      
      // Cache the fetched models
      cacheModels(models);
      
      return models;
    } else {
      console.error("Error fetching models: Invalid response format. Expected object with 'data' array.", data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching models:', error);
    return null; // Return null or throw the error based on desired handling
  }
}

/**
 * Saves models to localStorage cache with timestamp
 * @param models The models to cache
 */
function cacheModels(models: ModelInfo[]): void {
  try {
    localStorage.setItem(MODELS_CACHE_KEY, JSON.stringify(models));
    localStorage.setItem(MODELS_CACHE_TIMESTAMP_KEY, Date.now().toString());
    console.log(`Cached ${models.length} models.`);
  } catch (error) {
    console.error('Error caching models:', error);
  }
}

/**
 * Retrieves cached models if available and not expired
 * @returns The cached models or null if unavailable or expired
 */
export function getCachedModels(): ModelInfo[] | null {
  try {
    const cachedModelsJson = localStorage.getItem(MODELS_CACHE_KEY);
    const timestampStr = localStorage.getItem(MODELS_CACHE_TIMESTAMP_KEY);
    
    if (!cachedModelsJson || !timestampStr) {
      return null;
    }
    
    // Check if cache is expired
    const timestamp = parseInt(timestampStr);
    const now = Date.now();
    if (now - timestamp > CACHE_EXPIRY_TIME) {
      console.log('Models cache expired, will fetch fresh data.');
      return null;
    }
    
    // Calculate age for logging
    const ageHours = Math.round((now - timestamp) / (60 * 60 * 1000) * 10) / 10;
    
    // Parse and return cached models
    const cachedModels = JSON.parse(cachedModelsJson);
    console.log(`Using cached models (${ageHours} hours old).`);
    return Array.isArray(cachedModels) ? cachedModels : null;
  } catch (error) {
    console.error('Error retrieving cached models:', error);
    return null;
  }
}

// Example Usage (You would call this from your App component or context):
/*
import { useEffect, useState } from 'react';
import { fetchModels } from './utils/modelUtils';

function App() {
  const [models, setModels] = useState<any[] | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      const fetchedModels = await fetchModels();
      setModels(fetchedModels);
    };
    loadModels();
  }, []);

  // ... rest of your component
}
*/ 