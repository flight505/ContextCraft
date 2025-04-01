// This file now acts as a bridge to the main process for heavy compression tasks.

// Global type definition is now in src/types/electron.d.ts

/**
 * Asynchronously removes comments from source code by calling the main process.
 *
 * @param source The source code string.
 * @param language The programming language.
 * @param keepDocstrings Whether to preserve documentation comments.
 * @returns A Promise resolving to the source code with comments removed, or null on failure.
 */
export async function removeComments(source: string, language: string, keepDocstrings: boolean = true): Promise<string | null> {
  if (!source || !language) {
    console.warn("Source and language required for comment removal.");
    return source; // Return original if inputs are invalid
  }
  try {
    const result = await window.electron.removeComments(source, language, keepDocstrings);
    return result;
  } catch (error) {
    console.error(`Error calling main process for comment removal (${language}):`, error);
    return null; // Indicate failure
  }
}

/**
 * Asynchronously compresses source code by replacing function bodies via the main process.
 *
 * @param source The source code string.
 * @param language The programming language (e.g., 'javascript', 'python').
 * @returns A Promise resolving to the compressed source code string, or null if compression failed or is not supported.
 */
export async function compressCode(source: string, language: string): Promise<string | null> {
  if (!source || !language) {
    console.warn("Source and language required for code compression.");
    return source; // Return original if inputs are invalid
  }
  try {
    const result = await window.electron.compressCode(source, language);
    // If result is null, it means main process failed or didn't support it
    // If result is same as source, it means nothing was compressed (no bodies found)
    return result; 
  } catch (error) {
    console.error(`Error calling main process for code compression (${language}):`, error);
    return null; // Indicate failure
  }
}

// Keep any other utility functions here that DON'T depend on tree-sitter
// For example, if you had functions for determining language from filename,
// they could stay here.

/**
 * Gets a simple language identifier from a filename.
 * @param filename The filename (e.g., 'myComponent.tsx')
 * @returns A language string (e.g., 'typescript', 'python') or null.
 */
export function getLanguageFromFilename(filename: string): string | null {
  if (!filename) return null;
  
  // More reliable extension extraction
  const lastDotIndex = filename.lastIndexOf('.');
  const extension = lastDotIndex !== -1 ? filename.slice(lastDotIndex + 1).toLowerCase() : '';
  
  if (!extension) return null;

  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'py':
      return 'python';
    case 'css':
      return 'css';
    case 'html':
    case 'htm':
      return 'html';
    // Add more mappings as needed
    default:
      return null; // Or return the extension itself if you want to attempt unsupported types
  }
}

// --- Example Usage (for testing) ---
/*
const jsCode = `
function hello(name) {
  console.log("Hello, " + name);
  return true;
}

const add = (a, b) => {
  const result = a + b;
  return result;
};

class Greeter {
  constructor(greeting) {
    this.greeting = greeting;
  }

  greet() {
    console.log(this.greeting);
  }
}
`;

const pyCode = `
def greet(name):
    print(f"Hello, {name}!")
    return f"Hi, {name}"

class Calculator:
    def add(self, a, b):
        # Adds two numbers
        return a + b
`;

const compressedJs = compressCode(jsCode, 'javascript');
console.log("--- Compressed JS ---\n", compressedJs);

const compressedPy = compressCode(pyCode, 'python');
console.log("--- Compressed Python ---", compressedPy);
*/ 