const Parser = require('tree-sitter');
const path = require('path');
const fs = require('fs');

// Use require for loading parsers in the main process
let JavaScript = null;
let TypeScript = null;
let Python = null;
let Css = null;
let Html = null;

// Helper function to safely load modules with detailed error logging
function safeRequire(moduleName) {
  try {
    // Try standard require first
    return require(moduleName);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      console.warn(`Module not found: ${moduleName}. Error: ${e.message}`);
      
      // Try alternative resolution approaches
      try {
        // For packaged app in production, check if we're in an asar environment
        if (process.resourcesPath) {
          // Try to find the module in the unpacked directory
          const unpackedPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', moduleName);
          if (fs.existsSync(unpackedPath)) {
            console.log(`Found module at unpacked path: ${unpackedPath}`);
            return require(unpackedPath);
          }
          
          // Also try non-unpacked path
          const normalPath = path.join(process.resourcesPath, 'app.asar', 'node_modules', moduleName);
          if (fs.existsSync(normalPath)) {
            console.log(`Found module at normal path: ${normalPath}`);
            return require(normalPath);
          }
          
          console.warn(`Could not find ${moduleName} in unpacked paths`);
        }
      } catch (alternativeError) {
        console.error(`Alternative resolution failed for ${moduleName}:`, alternativeError);
      }
    } else {
      console.error(`Error loading ${moduleName}:`, e);
    }
    return null;
  }
}

// Load modules with the safer approach
try {
  JavaScript = safeRequire('tree-sitter-javascript');
} catch (e) {
  console.warn("Failed to load tree-sitter-javascript parser", e);
}

try {
  // Note: tree-sitter-typescript exports multiple languages
  const tsParser = safeRequire('tree-sitter-typescript');
  TypeScript = tsParser?.typescript; // Use optional chaining
} catch (e) {
  console.warn("Failed to load tree-sitter-typescript parser", e);
}

try {
  Python = safeRequire('tree-sitter-python');
} catch (e) {
  console.warn("Failed to load tree-sitter-python parser", e);
}

try {
  Css = safeRequire('tree-sitter-css');
} catch (e) {
  console.warn("Failed to load tree-sitter-css parser", e);
}

try {
  Html = safeRequire('tree-sitter-html');
} catch (e) {
  console.warn("Failed to load tree-sitter-html parser", e);
}

const COMPRESSION_PLACEHOLDERS = {
  python: 'pass # ... body removed ...\n',
  javascript: ' {/* ... body removed ... */}',
  typescript: ' {/* ... body removed ... */}',
  default: ' {/* ... body removed ... */}'
};

/**
 * Gets the appropriate Tree-sitter language parser based on a simple language identifier.
 * @param {string} language Simple language string (e.g., 'javascript', 'python').
 * @returns The Tree-sitter language parser object or null if unsupported/unavailable.
 */
function getLanguageParser(language) {
  switch (language?.toLowerCase()) {
    case 'javascript':
    case 'js':
    case 'jsx':
      return JavaScript;
    case 'typescript':
    case 'ts':
    case 'tsx':
      return TypeScript;
    case 'python':
    case 'py':
      return Python;
    case 'css':
      return Css;
    case 'html':
      return Html;
    default:
      console.warn(`Compression/Comment removal not supported for language: ${language}`);
      return null;
  }
}

// --- Queries ---
const FUNCTION_BODY_QUERIES = {
  javascript: `
    [
      (function_declaration body: (statement_block) @body)
      (method_definition body: (statement_block) @body)
      (arrow_function body: (statement_block) @body)
      (function_expression body: (statement_block) @body)
    ]
  `,
  typescript: `
    [
      (function_declaration body: (statement_block) @body)
      (method_definition body: (statement_block) @body)
      (arrow_function body: (statement_block) @body)
      (function_expression body: (statement_block) @body)
    ]
  `,
  python: `
    [
      (function_definition
        body: (block) @body)
      (class_definition
        body: (block . (function_definition
                          body: (block) @body)))
      (decorated_definition
          definition: (function_definition
                         body: (block) @body))
    ]
  `,
  css: '',
  html: '',
};

const COMMENT_QUERIES = {
  javascript: `(comment) @comment`,
  typescript: `(comment) @comment`,
  python: `(comment) @comment`,
  css: `(comment) @comment`,
  html: `(comment) @comment`,
};

// Define docstring queries to separate them from regular comments
const DOCSTRING_QUERIES = {
  javascript: `
    [
      (comment) @docstring
      (#match? @docstring "^\\/\\*\\*")  // JSDoc starts with /**
    ]
  `,
  typescript: `
    [
      (comment) @docstring
      (#match? @docstring "^\\/\\*\\*")  // JSDoc starts with /**
    ]
  `,
  python: `
    [
      (string) @docstring
      (#match? @docstring "^\\\"\\\"\\\"")  // Triple double-quoted strings
      (string) @docstring
      (#match? @docstring "^'''")  // Triple single-quoted strings
      (string) @docstring
      (#match? @docstring "^\\\"\\\\s*[Dd]ocstring")  // Single-quoted docstrings that begin with "docstring"
      (string) @docstring
      (#match? @docstring "^'\\\\s*[Dd]ocstring")  // Single-quoted docstrings that begin with 'docstring'
    ]
  `,
  css: ``,
  html: ``,
};


// --- Core Logic Functions ---

/**
 * Main process function to remove comments.
 * @param {string} source
 * @param {string} language
 * @param {boolean} keepDocstrings
 * @returns {string | null}
 */
function mainProcessRemoveComments(source, language, keepDocstrings = true) {
  const langParser = getLanguageParser(language);
  const queryStr = COMMENT_QUERIES[language?.toLowerCase()] || '';

  if (!langParser || !queryStr) {
    return source; // Return original if not supported
  }

  const parser = new Parser();
  try {
    parser.setLanguage(langParser);
    const tree = parser.parse(source);
    
    // Get all comment captures
    const query = new Parser.Query(langParser, queryStr);
    const commentMatches = query.captures(tree.rootNode);

    if (commentMatches.length === 0) {
      return source; // No comments to remove
    }
    
    let docstringMatches = [];
    
    // If keeping docstrings, identify them
    if (keepDocstrings) {
      const docstringQueryStr = DOCSTRING_QUERIES[language?.toLowerCase()] || '';
      if (docstringQueryStr) {
        const docstringQuery = new Parser.Query(langParser, docstringQueryStr);
        docstringMatches = docstringQuery.captures(tree.rootNode);
      }
    }
    
    // Create a set of docstring ranges to check against
    const docstringRanges = new Set();
    for (const docMatch of docstringMatches) {
      docstringRanges.add(`${docMatch.node.startIndex}-${docMatch.node.endIndex}`);
    }
    
    // Filter out comments that are docstrings if we're keeping them
    const matches = keepDocstrings
      ? commentMatches.filter(match => {
          const range = `${match.node.startIndex}-${match.node.endIndex}`;
          return !docstringRanges.has(range);
        })
      : commentMatches;
    
    // Sort in reverse order to handle edits from end to beginning
    matches.sort((a, b) => b.node.endIndex - a.node.endIndex);

    let sourceWithoutComments = source;
    for (const capture of matches) {
      const startIndex = capture.node.startIndex;
      const endIndex = capture.node.endIndex;
      let startSlice = startIndex;
      let endSlice = endIndex;
      while (startSlice > 0 && /[ \t]/.test(sourceWithoutComments[startSlice - 1]) && sourceWithoutComments[startSlice - 1] !== '\n') {
          startSlice--;
      }
      if (startSlice === 0 || sourceWithoutComments[startSlice - 1] === '\n') {
          if (endSlice < sourceWithoutComments.length && sourceWithoutComments[endSlice] === '\n') {
             endSlice++;
          } else if (startSlice > 0 && sourceWithoutComments[startSlice - 1] === '\n'){
              startSlice--;
          }
      }

      sourceWithoutComments = sourceWithoutComments.slice(0, startSlice) +
                              sourceWithoutComments.slice(endSlice);
    }
    return sourceWithoutComments.trim();

  } catch (error) {
    console.error(`Error removing comments for language '${language}' in main process:`, error);
    return null;
  }
}

/**
 * Main process function to compress code (remove function bodies).
 * @param {string} source
 * @param {string} language
 * @returns {string | null}
 */
function mainProcessCompressCode(source, language) {
  const langParser = getLanguageParser(language);
  const queryStr = FUNCTION_BODY_QUERIES[language?.toLowerCase()] || '';

  if (!langParser || !queryStr) {
    console.warn(`Cannot compress in main: No parser or query for language '${language}'.`);
    return null;
  }

  const parser = new Parser();
  try {
    parser.setLanguage(langParser);
    const tree = parser.parse(source);
    const query = new Parser.Query(langParser, queryStr);
    const captures = query.captures(tree.rootNode);
    const bodyCaptures = captures.filter(capture => capture.name === 'body');

    if (bodyCaptures.length === 0) {
      return source;
    }

    // Process edits from end to beginning to avoid index shifting problems
    bodyCaptures.sort((a, b) => b.node.startIndex - a.node.startIndex);

    let compressedSource = source;
    const placeholder = COMPRESSION_PLACEHOLDERS[language?.toLowerCase()] || COMPRESSION_PLACEHOLDERS.default;
    
    for (const capture of bodyCaptures) {
      const bodyNode = capture.node;
      const startPosition = bodyNode.startPosition;
      const endPosition = bodyNode.endPosition;
      
      // For Python, maintain the correct indentation
      let replacementText = placeholder;
      if (language?.toLowerCase() === 'python') {
        // Extract leading whitespace from the start of the body for proper indentation
        const lineStart = compressedSource.lastIndexOf('\n', bodyNode.startIndex) + 1;
        const indentation = compressedSource.slice(lineStart, bodyNode.startIndex).match(/^\s*/)[0];
        replacementText = indentation + placeholder;
      }
      
      compressedSource = compressedSource.slice(0, bodyNode.startIndex) +
                         replacementText +
                         compressedSource.slice(bodyNode.endIndex);
    }
    return compressedSource;

  } catch (error) {
    console.error(`Error compressing code for language '${language}' in main process:`, error);
    return null;
  }
}

// Export functions for use in main.js
module.exports = {
    mainProcessRemoveComments,
    mainProcessCompressCode,
}; 