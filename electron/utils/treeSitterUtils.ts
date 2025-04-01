/* eslint-disable @typescript-eslint/no-var-requires */
import Parser from 'tree-sitter';

// Tree-sitter language parsers must be loaded using require in Electron
// because they contain native modules that can't be imported dynamically
let JavaScript: Parser.Language | null = null;
let TypeScript: Parser.Language | null = null;
let Python: Parser.Language | null = null;
let Css: Parser.Language | null = null;
let Html: Parser.Language | null = null;

try {
  JavaScript = require('tree-sitter-javascript');
} catch (e) {
  console.warn("Failed to load tree-sitter-javascript parser", e);
}

try {
  // Note: tree-sitter-typescript exports multiple languages
  const tsParser = require('tree-sitter-typescript');
  TypeScript = tsParser.typescript; // Or tsx if needed primarily
} catch (e) {
  console.warn("Failed to load tree-sitter-typescript parser", e);
}

try {
  Python = require('tree-sitter-python');
} catch (e) {
  console.warn("Failed to load tree-sitter-python parser", e);
}

try {
  Css = require('tree-sitter-css');
} catch (e) {
  console.warn("Failed to load tree-sitter-css parser", e);
}

try {
  Html = require('tree-sitter-html');
} catch (e) {
  console.warn("Failed to load tree-sitter-html parser", e);
}

const COMPRESSION_PLACEHOLDER = '/* ... body removed by PasteMax ... */';

/**
 * Gets the appropriate Tree-sitter language parser based on a simple language identifier.
 * @param language Simple language string (e.g., 'javascript', 'python').
 * @returns The Tree-sitter language parser object or null if unsupported/unavailable.
 */
function getLanguageParser(language: string): Parser.Language | null {
  switch (language?.toLowerCase()) {
    case 'javascript':
    case 'js':
    case 'jsx':
      return JavaScript;
    case 'typescript':
    case 'ts':
    case 'tsx':
       // Make sure to load the correct part of the typescript parser if needed
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

// --- Queries (Keep these as before) ---
const FUNCTION_BODY_QUERIES: { [language: string]: string } = {
  javascript: `
    [
      (function_declaration body: (_) @body)
      (function body: (_) @body)
      (arrow_function body: (_) @body)
      (method_definition body: (_) @body)
      (class_declaration body: (_) @body)
    ] @function
  `,
  typescript: `
    [
      (function_declaration body: (_) @body)
      (function_signature body: (_) @body)
      (function body: (_) @body)
      (arrow_function body: (_) @body)
      (method_definition body: (_) @body)
      (method_signature body: (_) @body)
      (constructor_type body: (_) @body)
      (class_declaration body: (_) @body)
      (interface_declaration body: (_) @body)
    ] @function
  `,
  python: `
    [
      (function_definition body: (_) @body)
      (class_definition body: (_) @body)
    ] @function
  `,
  css: '',
  html: '',
};

const COMMENT_QUERIES: { [language: string]: string } = {
  javascript: `(comment) @comment`,
  typescript: `(comment) @comment`,
  python: `(comment) @comment`,
  css: `(comment) @comment`,
  html: `(comment) @comment`,
};


// --- Core Logic Functions (Exported for main.ts) ---

/**
 * Main process function to remove comments.
 */
export function mainProcessRemoveComments(source: string, language: string): string | null {
  const langParser = getLanguageParser(language);
  const queryStr = COMMENT_QUERIES[language?.toLowerCase()] || '';

  if (!langParser || !queryStr) {
    return source; // Return original if not supported
  }

  const parser = new Parser();
  try {
    parser.setLanguage(langParser);
    const tree = parser.parse(source);
    const query = new Parser.Query(langParser, queryStr);
    const matches = query.captures(tree.rootNode);

    if (matches.length === 0) {
      return source;
    }

    matches.sort((a, b) => b.node.endIndex - a.node.endIndex);

    let sourceWithoutComments = source;
    for (const capture of matches) {
      const startIndex = capture.node.startIndex;
      const endIndex = capture.node.endIndex;
      // Basic whitespace removal logic (can be refined)
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
 */
export function mainProcessCompressCode(source: string, language: string): string | null {
  const langParser = getLanguageParser(language);
  const queryStr = FUNCTION_BODY_QUERIES[language?.toLowerCase()] || '';

  if (!langParser || !queryStr) {
    console.warn(`Cannot compress in main: No parser or query for language '${language}'.`);
    return null; // Return null if not supported to distinguish from unchanged source
  }

  const parser = new Parser();
  try {
    parser.setLanguage(langParser);
    const tree = parser.parse(source);
    const query = new Parser.Query(langParser, queryStr);
    const matches = query.matches(tree.rootNode);
    const bodyCaptures = matches
      .flatMap(match => match.captures)
      .filter(capture => capture.name === 'body');

    if (bodyCaptures.length === 0) {
      return source; // Return original if nothing to compress
    }

    bodyCaptures.sort((a, b) => b.node.startIndex - a.node.startIndex);

    let compressedSource = source;
    for (const capture of bodyCaptures) {
      const bodyNode = capture.node;
      compressedSource = compressedSource.slice(0, bodyNode.startIndex) +
                         COMPRESSION_PLACEHOLDER +
                         compressedSource.slice(bodyNode.endIndex);
    }
    return compressedSource;

  } catch (error) {
    console.error(`Error compressing code for language '${language}' in main process:`, error);
    return null;
  }
} 