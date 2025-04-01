/**
 * Represents the information structure for an AI model,
 * typically fetched from an API like OpenRouter.
 */
export interface ModelInfo {
  id: string;           // Unique identifier for the model (e.g., "openai/gpt-4o")
  name: string;         // User-friendly display name (e.g., "GPT-4o")
  context_length: number; // Maximum context window size in tokens
  // Add other relevant properties from the API if needed, e.g.:
  // description?: string;
  // pricing?: { prompt: number; completion: number; };
} 