const { app, BrowserWindow, ipcMain, dialog, globalShortcut, shell } = require("electron");
const fs = require("fs");
const path = require("path");
const os = require("os");
const minimatch = require("minimatch");
const { promisify } = require("util");
const micromatch = require('micromatch');
// Add chokidar import for file watching
let chokidar;
try {
  chokidar = require('chokidar');
  console.log("Successfully loaded chokidar for file watching");
} catch (err) {
  console.warn("Chokidar not available:", err.message);
  // Create a no-op watcher if chokidar is not available
  chokidar = {
    watch: () => ({
      on: () => {},
      close: () => {}
    })
  };
}

// Safely require DOMPurify and JSDOM with fallbacks for production
let createDOMPurify, JSDOM, DOMPurify;
try {
  createDOMPurify = require('dompurify');
  JSDOM = require('jsdom').JSDOM;
  // Initialize DOMPurify with JSDOM window
  const window = new JSDOM('').window;
  DOMPurify = createDOMPurify(window);
  console.log("Successfully loaded DOMPurify and JSDOM");
} catch (err) {
  console.warn("DOMPurify or JSDOM not available:", err.message);
  // Create no-op fallback for DOMPurify.sanitize
  DOMPurify = {
    sanitize: (content) => {
      console.warn("DOMPurify sanitize called but not available");
      // Simple fallback - handle HTML escape on your own if needed
      return content;
    }
  };
}

const { execSync } = require('child_process');
const { excludedFiles, binaryExtensions, systemExclusions, defaultUserPatterns } = require("./excluded-files");
const ignore = require("ignore");
// Add require for the new TreeSitter utilities
const { mainProcessCompressCode, mainProcessRemoveComments } = require("./utils/treeSitterUtils"); 

// For backward compatibility - use systemExclusions as the new single source of truth
const DEFAULT_EXCLUSIONS = systemExclusions;

// Global variables for directory loading control
let isLoadingDirectory = false;
let loadingTimeoutId = null;
const MAX_DIRECTORY_LOAD_TIME = 30000; // 30 seconds timeout

// Global variable for file watcher
let fileWatcher = null;
let addDebounce = null;
let changeDebounce = null;
let deleteDebounce = null;
const WATCH_DEBOUNCE_TIME = 300; // 300ms debounce time for file changes

/**
 * Safer fs.watch wrapper that handles errors and works across platforms
 * @param {string} dir Directory to watch
 * @param {Function} callback Callback function(eventType, filename)
 * @returns {object} Watcher object with close method
 */
function safeFsWatch(dir, callback) {
  if (!fs.existsSync(dir)) {
    return { close: () => {} };
  }
  
  try {
    const watcher = fs.watch(dir, { recursive: false }, (eventType, filename) => {
      if (!filename) return;
      try {
        callback(eventType, filename);
      } catch (err) {
        console.error(`Error in watch callback for ${dir}/${filename}:`, err);
      }
    });
    return watcher;
  } catch (err) {
    console.error(`Error watching directory ${dir}:`, err);
    return { close: () => {} };
  }
}

// Cache for directory contents to avoid repeated processing
const directoryCache = {
  // Format: { path: { timestamp: Date, files: [] } }
  cache: {},
  // Cache expiration time (5 minutes)
  CACHE_EXPIRY: 5 * 60 * 1000,
  
  // Get files from cache if available and not expired
  get: function(path) {
    const normalizedPath = normalizePath(path);
    const entry = this.cache[normalizedPath];
    if (!entry) return null;
    
    // Check if cache is expired
    const now = new Date().getTime();
    if (now - entry.timestamp > this.CACHE_EXPIRY) {
      delete this.cache[normalizedPath];
      return null;
    }
    
    console.log(`Using cached directory content for ${normalizedPath}`);
    return entry.files;
  },
  
  // Store files in cache
  set: function(path, files) {
    const normalizedPath = normalizePath(path);
    this.cache[normalizedPath] = {
      timestamp: new Date().getTime(),
      files: files
    };
    console.log(`Cached directory content for ${normalizedPath}`);
  },
  
  // Clear cache for a specific path or all paths
  clear: function(path = null) {
    if (path) {
      const normalizedPath = normalizePath(path);
      delete this.cache[normalizedPath];
      console.log(`Cleared cache for ${normalizedPath}`);
    } else {
      this.clearAll();
    }
  },
  
  // Clear all cached entries
  clearAll: function() {
    this.cache = {};
    console.log('Cleared all directory caches');
  }
};

// Add handling for the 'ignore' module
try {
  console.log("Successfully loaded ignore module");
} catch (err) {
  console.error("Failed to load ignore module:", err);
  // Simple fallback implementation for when the ignore module fails to load
  ignore = {
    // Simple implementation that just matches exact paths
    createFilter: () => {
      return (path) => !excludedFiles.includes(path);
    },
  };
  console.log("Using fallback for ignore module");
}

/**
 * Normalize file paths to use forward slashes regardless of OS
 * This ensures consistent path formatting between main and renderer processes
 */
function normalizePath(filePath) {
  if (!filePath) return filePath;
  return filePath.replace(/\\/g, '/');
}

/**
 * Get the platform-specific path separator
 */
function getPathSeparator() {
  return os.platform() === 'win32' ? '\\' : '/';
}

// Initialize tokenizer with better error handling
let tiktoken;
try {
  tiktoken = require("tiktoken");
  console.log("Successfully loaded tiktoken module");
} catch (err) {
  console.error("Failed to load tiktoken module:", err);
  tiktoken = null;
}

// Initialize the encoder once at startup with better error handling
let encoder;
try {
  if (tiktoken) {
    encoder = tiktoken.get_encoding("o200k_base"); // gpt-4o encoding
    console.log("Tiktoken encoder initialized successfully");
  } else {
    throw new Error("Tiktoken module not available");
  }
} catch (err) {
  console.error("Failed to initialize tiktoken encoder:", err);
  // Fallback to a simpler method if tiktoken fails
  console.log("Using fallback token counter");
  encoder = null;
}

// Binary file extensions that should be excluded from token counting
const BINARY_EXTENSIONS = [
  // Images
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".tiff",
  ".ico",
  ".webp",
  ".svg",
  // Audio/Video
  ".mp3",
  ".mp4",
  ".wav",
  ".ogg",
  ".avi",
  ".mov",
  ".mkv",
  ".flac",
  // Archives
  ".zip",
  ".rar",
  ".tar",
  ".gz",
  ".7z",
  // Documents
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  // Compiled
  ".exe",
  ".dll",
  ".so",
  ".class",
  ".o",
  ".pyc",
  // Database
  ".db",
  ".sqlite",
  ".sqlite3",
  // Others
  ".bin",
  ".dat",
].concat(binaryExtensions || []); // Add any additional binary extensions from excluded-files.js

// Max file size to read (5MB)
const MAX_FILE_SIZE = 200 * 1024 * 1024;

// Global reference to the mainWindow to prevent garbage collection
let mainWindow;

// Add promisify for fs operations
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

// Create a clear pattern organization system with three distinct categories:
// 1. SYSTEM_EXCLUSIONS: Always excluded, not user-configurable (binary files, media, etc.)
// 2. DEFAULT_USER_PATTERNS: Initial user-editable patterns, restored on reset
// 3. Current user patterns: Stored in global_patterns.ignore or .repo_ignore files

// Category 1: System-level exclusions (not user-editable)
const SYSTEM_EXCLUSIONS = [
  // Version control
  "**/.git/**",
  "**/.svn/**",
  "**/.hg/**",
  
  // Build artifacts and dependencies
  "**/node_modules/**", 
  "**/dist/**",
  "**/build/**",
  "**/.next/**",
  
  // Cache files
  "**/.cache/**",
  "**/__pycache__/**",
  
  // Logs
  "**/logs/**",
  "**/*.log",
  
  // IDE files
  "**/.idea/**",
  "**/.vscode/**",
  
  // OS files
  "**/.DS_Store",
  "**/Thumbs.db"
];

// Category 2: Default user patterns (user-editable, used when resetting to defaults)
const DEFAULT_USER_PATTERNS = ""; // Start with empty patterns

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    title: "ContextCraft",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Set Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://openrouter.ai"
        ]
      }
    });
  });

  // Load the app - fix path for production builds
  const startUrl = process.env.ELECTRON_START_URL || 
    `file://${path.join(__dirname, "..", "dist", "index.html")}`;
  
  console.log(`Loading app from: ${startUrl}`);
  mainWindow.loadURL(startUrl);

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Open dev tools in development
  if (process.env.ELECTRON_START_URL) {
    mainWindow.webContents.openDevTools();
  }

  // Add basic error handling for failed loads
  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL) => {
      console.error(
        `Failed to load the application: ${errorDescription} (${errorCode})`,
      );
      console.error(`Attempted to load URL: ${validatedURL}`);

      if (process.env.ELECTRON_START_URL) {
        // Retry with explicit file URL
        const indexPath = path.join(__dirname, "dist", "index.html");
        const indexUrl = `file://${indexPath}`;
        mainWindow.loadURL(indexUrl);
      }
    },
  );

  // Handle window ready-to-show event
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Clean up shortcuts on app quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Helper function to check if window is valid and can receive messages
function isWindowValid(window) {
  try {
    return window && !window.isDestroyed() && window.webContents;
  } catch (error) {
    console.error('Error checking window validity:', error);
    return false;
  }
}

// Function to safely send to renderer
function safeRendererSend(window, channel, ...args) {
  try {
    if (!isWindowValid(window)) {
      console.warn(`Cannot send to renderer (${channel}): window is not valid`);
      return false;
    }
    window.webContents.send(channel, ...args);
    return true;
  } catch (error) {
    console.error(`Error sending to renderer (${channel}):`, error);
    return false;
  }
}

// Function to get all patterns (system + user)
function getAllPatterns(userPatterns) {
  // Combine system exclusions with user patterns
  // System exclusions always apply and come first
  return [...SYSTEM_EXCLUSIONS, ...(userPatterns || [])];
}

// Parse patterns to extract disabled system patterns
const parsePatterns = (content) => {
  const lines = content.split('\n');
  const excludedPatterns = [];
  const userPatterns = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# DISABLED:')) {
      excludedPatterns.push(trimmed.substring('# DISABLED:'.length).trim());
    } else if (trimmed !== '' && !trimmed.startsWith('#')) {
      userPatterns.push(line);
    }
  });
  
  return {
    excludedPatterns,
    userPatterns: userPatterns.join('\n')
  };
};

// Update IPC handlers with improved error handling
ipcMain.handle("open-folder", async () => {
  try {
    const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null; // Return null if canceled or no path selected
  } catch (error) {
    console.error("Error opening folder dialog:", error);
    return null; // Return null or throw error as appropriate
  }
});

ipcMain.handle("read-file", async (event, filePath) => {
  try {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error("Invalid file path provided.");
    }
    // Security check: Ensure filePath is within a reasonable scope if necessary
    // e.g., check if it's within the selected project directory
    // (Need access to the root directory state for this check)
    
    // Add file size limit check
    const stats = await fs.promises.stat(filePath);
    if (stats.size > MAX_FILE_SIZE) {
       console.warn(`Skipping large file (>${MAX_FILE_SIZE / 1024 / 1024}MB): ${filePath}`);
      return null; // Or return an indicator that the file is too large
    }

    const content = await readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    // Send error back to renderer or return null
    return null; // Or throw an error that the renderer can catch
  }
});

// Add handler for the get-file-content IPC channel
ipcMain.handle("get-file-content", async (event, filePath) => {
  try {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error("Invalid file path provided for get-file-content.");
    }
    
    console.log(`Getting content for file: ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      return { 
        success: false, 
        error: `File does not exist: ${filePath}` 
      };
    }
    
    // Get file stats
    const stats = await fs.promises.stat(filePath);
    
    // Check if file is too large
    if (stats.size > MAX_FILE_SIZE) {
      console.warn(`Skipping large file (>${MAX_FILE_SIZE / 1024 / 1024}MB): ${filePath}`);
      return { 
        success: false, 
        error: `File is too large (>${MAX_FILE_SIZE / 1024 / 1024}MB)`, 
        size: stats.size 
      };
    }
    
    // Read file content
    try {
      const content = await readFile(filePath, "utf-8");
      const lastModified = stats.mtime.getTime();
      
      return {
        success: true,
        content,
        size: stats.size,
        lastModified
      };
    } catch (e) {
      // Try to identify encoding-related errors
      if (e.message && e.message.includes('invalid or unsupported encoding')) {
        console.error(`Encoding error reading file ${filePath}:`, e);
        return { 
          success: false, 
          error: `File encoding not supported (not UTF-8): ${e.message}` 
        };
      }
      
      // Other read errors
      console.error(`Error reading file ${filePath}:`, e);
      return { 
        success: false, 
        error: e.message || "Unknown error reading file" 
      };
    }
  } catch (error) {
    console.error(`Error in get-file-content for ${filePath}:`, error);
    return { 
      success: false, 
      error: error.message || "Unknown error reading file" 
    };
  }
});

ipcMain.on("request-file-list", (event, folderPath) => {
  try {
    if (!isWindowValid(mainWindow)) {
      console.warn("Window is not valid for request-file-list");
      return;
    }
    
    console.log("Received request-file-list event for:", folderPath);
    // Call the handleRequestFileList directly with the event object
    handleRequestFileList(event, folderPath);
  } catch (error) {
    console.error("Error in request-file-list handler:", error);
    if (isWindowValid(mainWindow)) {
      mainWindow.webContents.send("file-processing-status", {
        status: "error",
        message: `Error loading directory: ${error.message}`,
      });
    }
  }
});

// Keep the handle method for backward compatibility but log a warning
ipcMain.handle("request-file-list", async (event, data) => {
  console.warn("Using deprecated ipcMain.handle for request-file-list. This should use the 'on' method instead.");
  // The handler should just acknowledge but actual processing happens through events
  return { acknowledged: true };
});

ipcMain.handle('compress-code', async (event, { source, language }) => {
  try {
    if (!source || !language) {
      throw new Error("Source code and language are required for compression.");
    }
    // Input validation/sanitization if necessary
    const compressed = await mainProcessCompressCode(String(source), String(language));
    return compressed;
  } catch (error) {
    console.error("Error in compress-code IPC handler:", error);
    return null; // Return null on error
  }
});

ipcMain.handle('remove-comments', async (event, { source, language, keepDocstrings }) => {
  try {
    if (!source || !language) {
      throw new Error("Source code and language are required for comment removal.");
    }
    // Input validation/sanitization if necessary
    const uncommented = await mainProcessRemoveComments(String(source), String(language), Boolean(keepDocstrings));
    return uncommented;
  } catch (error) {
    console.error("Error in remove-comments IPC handler:", error);
    return null; // Return null on error
  }
});

ipcMain.on("reload-file-list", (event, folderPath) => {
  try {
    if (!isWindowValid(mainWindow)) {
      console.warn("Window is not valid for reload-file-list");
      return;
    }
    
    if (!folderPath) return;
    
    console.log(`Forcing reload of file list for ${folderPath}`);
    directoryCache.clear(folderPath);
    
    mainWindow.webContents.send("file-processing-status", {
      status: "processing",
      message: "Reloading directory...",
    });
    
    // Process the request directly using the same handler for request-file-list
    try {
      // Create data object with force refresh flag
      const data = {
        path: folderPath,
        forceRefresh: true
      };
      
      // Handle the request-file-list directly
      handleRequestFileList(event, data);
    } catch (err) {
      console.error("Error reloading file list:", err);
      if (isWindowValid(mainWindow)) {
        mainWindow.webContents.send("file-processing-status", {
          status: "error",
          message: `Error reloading directory: ${err.message}`,
        });
      }
    }
  } catch (error) {
    console.error("Error in reload-file-list handler:", error);
  }
});

// Function to cancel loading directory with improved error handling
function cancelDirectoryLoading(window) {
  try {
    if (!isWindowValid(window)) {
      console.warn("Window is not valid for cancelDirectoryLoading");
      return;
    }

    isLoadingDirectory = false;
    
    if (loadingTimeoutId) {
      clearTimeout(loadingTimeoutId);
      loadingTimeoutId = null;
    }
    
    safeRendererSend(window, "file-processing-status", {
      status: "error",
      message: "Directory loading cancelled - try selecting a smaller directory",
    });
  } catch (error) {
    console.error("Error in cancelDirectoryLoading:", error);
    // Try to reset state even if sending to renderer failed
    isLoadingDirectory = false;
    loadingTimeoutId = null;
  }
}

// Handler for directory loading timeout with improved error handling
function setupDirectoryLoadingTimeout(window, folderPath) {
  try {
    if (!isWindowValid(window)) {
      console.warn("Window is not valid for setupDirectoryLoadingTimeout");
      return;
    }

    // Clear any existing timeout
    if (loadingTimeoutId) {
      clearTimeout(loadingTimeoutId);
    }
    
    // Set a new timeout
    loadingTimeoutId = setTimeout(() => {
      try {
        console.log(`Directory loading timed out after ${MAX_DIRECTORY_LOAD_TIME / 1000} seconds: ${folderPath}`);
        
        if (isWindowValid(window)) {
          cancelDirectoryLoading(window);
        } else {
          // Just clean up the loading state without window reference
          isLoadingDirectory = false;
          loadingTimeoutId = null;
          console.log("Directory loading timed out but window is no longer available");
        }
      } catch (error) {
        console.error("Error in directory loading timeout handler:", error);
        // Ensure we clean up state even if there's an error
        isLoadingDirectory = false;
        loadingTimeoutId = null;
      }
    }, MAX_DIRECTORY_LOAD_TIME);
  } catch (error) {
    console.error("Error setting up directory loading timeout:", error);
    // Clean up state on error
    isLoadingDirectory = false;
    if (loadingTimeoutId) {
      clearTimeout(loadingTimeoutId);
      loadingTimeoutId = null;
    }
  }
}

ipcMain.on("cancel-directory-loading", (event) => {
  try {
    if (!isWindowValid(mainWindow)) {
      console.warn("Window is not valid for cancel-directory-loading");
      return;
    }
    
    if (isLoadingDirectory) {
      console.log("Received cancel directory loading request");
      cancelDirectoryLoading(mainWindow);
    }
  } catch (error) {
    console.error("Error in cancel-directory-loading handler:", error);
  }
});

// Update async handlers with improved error handling and window checks
ipcMain.handle('load-ignore-patterns', async (event, { folderPath, isGlobal }) => {
  try {
    if (!isWindowValid(mainWindow)) {
      console.warn("Window not initialized yet or destroyed");
      return { 
        success: true, 
        patterns: isGlobal ? DEFAULT_USER_PATTERNS : '',
        systemPatterns: SYSTEM_EXCLUSIONS,
        excludedPatterns: []
      };
    }

    if (isGlobal) {
      try {
        const appDataPath = app.getPath('userData');
        const globalIgnorePath = path.join(appDataPath, 'global_patterns.ignore');
        
        if (fs.existsSync(globalIgnorePath)) {
          const content = await readFile(globalIgnorePath, 'utf8');
          const { excludedPatterns, userPatterns } = parsePatterns(content);
          console.log(`Loaded global ignore patterns from ${globalIgnorePath}`);
          return { 
            success: true, 
            patterns: userPatterns,
            systemPatterns: SYSTEM_EXCLUSIONS,
            excludedPatterns
          };
        } else {
          console.log('No global ignore patterns file found, creating with defaults');
          try {
            if (!fs.existsSync(appDataPath)) {
              fs.mkdirSync(appDataPath, { recursive: true });
            }
            await writeFile(globalIgnorePath, DEFAULT_USER_PATTERNS, 'utf8');
            console.log(`Created default global ignore patterns at ${globalIgnorePath}`);
          } catch (error) {
            console.error('Error creating default global patterns:', error);
          }
          return { 
            success: true, 
            patterns: DEFAULT_USER_PATTERNS,
            systemPatterns: SYSTEM_EXCLUSIONS,
            excludedPatterns: []
          };
        }
      } catch (error) {
        console.error('Error handling global patterns:', error);
        return { 
          success: true, 
          patterns: DEFAULT_USER_PATTERNS,
          systemPatterns: SYSTEM_EXCLUSIONS,
          excludedPatterns: []
        };
      }
    } else {
      try {
        if (!folderPath) {
          return { 
            success: true, 
            patterns: '',
            systemPatterns: SYSTEM_EXCLUSIONS,
            excludedPatterns: []
          };
        }
        
        const ignoreFilePath = path.join(folderPath, '.repo_ignore');
        if (fs.existsSync(ignoreFilePath)) {
          const content = await readFile(ignoreFilePath, 'utf8');
          const { excludedPatterns, userPatterns } = parsePatterns(content);
          console.log(`Loaded local ignore patterns from ${ignoreFilePath}`);
          return { 
            success: true, 
            patterns: userPatterns,
            systemPatterns: SYSTEM_EXCLUSIONS,
            excludedPatterns
          };
        } else {
          console.log(`No local ignore patterns file found at ${ignoreFilePath}`);
          return { 
            success: true, 
            patterns: '',
            systemPatterns: SYSTEM_EXCLUSIONS,
            excludedPatterns: []
          };
        }
      } catch (error) {
        console.error('Error handling local patterns:', error);
        return { 
          success: true, 
          patterns: '',
          systemPatterns: SYSTEM_EXCLUSIONS,
          excludedPatterns: []
        };
      }
    }
  } catch (error) {
    console.error('Error in load-ignore-patterns handler:', error);
    return { 
      success: true, 
      patterns: isGlobal ? DEFAULT_USER_PATTERNS : '',
      systemPatterns: SYSTEM_EXCLUSIONS,
      excludedPatterns: []
    };
  }
});

// Function to parse .gitignore file if it exists
function loadGitignore(rootDir) {
  const ig = ignore();
  const gitignorePath = path.join(rootDir, ".gitignore");

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    ig.add(gitignoreContent);
  }

  // Add some default ignores that are common
  ig.add([".git", "node_modules", ".DS_Store"]);

  // Add the excludedFiles patterns for gitignore-based exclusion
  ig.add(excludedFiles);

  return ig;
}

// Check if file is binary based on extension
function isBinaryFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return BINARY_EXTENSIONS.includes(ext);
}

// Count tokens using tiktoken with o200k_base encoding
function countTokens(text) {
  if (!text) return 0;
  
  // Very large files (over 100K) - use approximate counting only
  if (text.length > 100000) {
    console.log(`Using approximate token count for large file (${text.length} chars)`);
    // Rough approximation: ~4 characters per token on average
    return Math.ceil(text.length / 4);
  }
  
  // Normal files - use tiktoken if available
  if (encoder) {
    try {
      const tokens = encoder.encode(text);
      return tokens.length;
    } catch (err) {
      console.error("Error counting tokens:", err);
      // Fallback to character-based estimation on error
      return Math.ceil(text.length / 4);
    }
  } else {
    // Fallback for when tiktoken is not available
    return Math.ceil(text.length / 4);
  }
}

// Function to recursively read files from a directory
function readFilesRecursively(dir, rootDir, ignoreFilter) {
  rootDir = rootDir || dir;
  ignoreFilter = ignoreFilter || loadGitignore(rootDir);

  // Normalize paths for consistent comparisons
  dir = normalizePath(dir);
  rootDir = normalizePath(rootDir);

  console.log(`Reading directory: ${dir}`);
  
  let results = [];

  // Skip directories that are obviously going to be very large or problematic
  const dirName = path.basename(dir);
  const skipDirectories = [
    'node_modules', '.git', 'dist', 'build', 'target',
    'bin', 'obj', 'venv', 'env', '.venv', '.env',
    '.next', '.idea', '.gradle', '.cache', 'coverage'
  ];
  
  if (skipDirectories.includes(dirName)) {
    console.log(`Skipping known large directory: ${dir}`);
    return results;
  }

  // Get actual app paths for comparison
  const appDirectoryPath = normalizePath(app.getAppPath());
  const resourcesPath = path.dirname(appDirectoryPath);
  
  // Skip ONLY if it's the exact running app directory or its Resources parent
  const isRunningAppDirectory = 
      dir === appDirectoryPath || 
      dir === resourcesPath || 
      dir === normalizePath(path.resolve(__dirname));
  
  if (isRunningAppDirectory) {
    console.log(`Skipping running application directory: ${dir}`);
    return [{
      name: "_APP_DIRECTORY_",
      path: dir,
      content: "Please select a project directory instead of the PasteMax application directory.",
      tokenCount: 0,
      size: 0,
      isBinary: false,
      isSkipped: true,
      error: "This is the running PasteMax application directory. Please select a different project directory.",
      isAppDirectory: true
    }];
  }

  try {
    // Try to read the directory
    let dirents;
    try {
      dirents = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return results;
    }

    // Quick check if there are too many files in this directory (likely not useful)
    if (dirents.length > 10000) {
      console.log(`Skipping directory with too many files (${dirents.length}): ${dir}`);
      return results;
    }

    // Process directories first, then files
    const directories = [];
    const files = [];

    // First pass: quick filtering
    for (const dirent of dirents) {
      const name = dirent.name;
      
      // Skip hidden files and directories (starting with .)
      if (name.startsWith('.') && name !== '.gitignore') {
        continue;
      }
      
      const fullPath = path.join(dir, name);
      const normalizedPath = normalizePath(fullPath);
      const relativePath = path.relative(rootDir, normalizedPath);

      // Skip if the path is ignored
      if (ignoreFilter.ignores(relativePath)) {
        continue;
      }

      if (dirent.isDirectory()) {
        // Skip .app directories (macOS application bundles)
        if (name.endsWith('.app')) {
          continue;
        }

        // Skip the application's own directory if we're somehow inside it
        const appDirectoryPath = normalizePath(app.getAppPath());
        const resourcesPath = path.dirname(appDirectoryPath);
        
        // Compare with exact app path instead of just checking if it starts with app path
        if (normalizedPath === appDirectoryPath || normalizedPath === resourcesPath) {
          console.log(`Skipping running app directory: ${normalizedPath}`);
          continue;
        }
        
        directories.push(dirent);
      } else if (dirent.isFile()) {
        // Skip file if it's a binary file or too large (quick check by extension)
        const ext = path.extname(name).toLowerCase();
        if (BINARY_EXTENSIONS.includes(ext)) {
          // Add it to results but mark as binary
          results.push({
            name: name,
            path: normalizedPath,
            tokenCount: 0,
            size: 0,
            content: "",
            isBinary: true,
            isSkipped: false,
            fileType: ext.substring(1).toUpperCase(),
          });
        } else {
          files.push(dirent);
        }
      }
    }

    // Process directories recursively but limit depth and count
    let dirCount = 0;
    for (const dirent of directories) {
      if (dirCount++ > 100) {
        console.log(`Limiting directory processing to 100 subdirectories in ${dir}`);
        break;
      }
      
      const fullPath = path.join(dir, dirent.name);
      const normalizedPath = normalizePath(fullPath);
      // Recursively read subdirectory
      const subResults = readFilesRecursively(normalizedPath, rootDir, ignoreFilter);
      results = results.concat(subResults);
    }

    // Process files but limit to a reasonable number
    let fileCount = 0;
    for (const dirent of files) {
      if (fileCount++ > 1000) {
        console.log(`Limiting file processing to 1000 files in ${dir}`);
        break;
      }
      
      const fullPath = path.join(dir, dirent.name);
      const normalizedPath = normalizePath(fullPath);
      
      try {
        // Get file stats for size
        const stats = fs.statSync(normalizedPath);
        const fileSize = stats.size;

        // Skip files that are too large
        if (fileSize > MAX_FILE_SIZE) {
          results.push({
            name: dirent.name,
            path: normalizedPath,
            tokenCount: 0,
            size: fileSize,
            content: "",
            isBinary: false,
            isSkipped: true,
            error: "File too large to process",
          });
          continue;
        }

        // Check if the file is binary
        const isBinary = isBinaryFile(normalizedPath);

        if (isBinary) {
          // Skip token counting for binary files
          results.push({
            name: dirent.name,
            path: normalizedPath,
            tokenCount: 0,
            size: fileSize,
            content: "",
            isBinary: true,
            isSkipped: false,
            fileType: path.extname(normalizedPath).substring(1).toUpperCase(),
          });
        } else {
          // Read file content
          const fileContent = fs.readFileSync(normalizedPath, "utf8");

          // Calculate token count (this is the initial, uncompressed count)
          const initialTokenCount = countTokens(fileContent);

          // Add file info with content and token count
          results.push({
            name: dirent.name,
            path: normalizedPath,
            content: fileContent, // Note: Consider not sending full content initially if memory is a concern
            tokenCount: initialTokenCount, // Initialize current count with uncompressed count
            uncompressedTokenCount: initialTokenCount, // Store the original count
            isCompressed: false, // Initially not compressed
            size: fileSize,
            isBinary: false,
            isSkipped: false,
          });
        }
      } catch (err) {
        console.error(`Error reading file ${normalizedPath}:`, err);
        results.push({
          name: dirent.name,
          path: normalizedPath,
          tokenCount: 0,
          size: 0,
          isBinary: false,
          isSkipped: true,
          error: "Could not read file",
        });
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${dir}:`, err);
  }

  return results;
}

// Extract file list processing into a reusable function
function handleRequestFileList(event, data) {
  try {
    // Allow either simple string or object with options
    const folderPath = typeof data === 'string' ? data : data.path;
    
    if (!folderPath) {
      console.log("No folder path provided");
      event.sender.send("file-processing-status", {
        status: "error",
        message: "No folder selected. Please select a project directory.",
      });
      return;
    }
    
    const forceRefresh = typeof data === 'object' && data.forceRefresh === true;
    
    console.log("Processing file list for folder:", folderPath);
    console.log("OS platform:", os.platform());
    console.log("Path separator:", getPathSeparator());
    
    // Get actual app paths for comparison
    const normalizedFolderPath = normalizePath(folderPath);
    const appDirectoryPath = normalizePath(app.getAppPath());
    const resourcesPath = path.dirname(appDirectoryPath);
    
    // Check ONLY if it's the exact running app directory or its Resources parent
    const isRunningAppDirectory = 
        normalizedFolderPath === appDirectoryPath || 
        normalizedFolderPath === resourcesPath || 
        normalizedFolderPath === normalizePath(path.resolve(__dirname));
    
    if (isRunningAppDirectory) {
      console.log(`Preventing recursive scan of running app instance at: ${appDirectoryPath}`);
      console.log(`Selected path: ${normalizedFolderPath}`);
      
      event.sender.send("file-list-data", [{
        name: "_APP_DIRECTORY_",
        path: normalizedFolderPath,
        content: "Please select a project directory instead of the PasteMax application directory.",
        tokenCount: 0,
        size: 0,
        isBinary: false,
        isSkipped: true,
        error: "This is the running PasteMax application directory. Please select a different project directory.",
        isAppDirectory: true
      }]);
      
      event.sender.send("file-processing-status", {
        status: "error",
        message: "Please select a project directory instead of the PasteMax application.",
      });
      
      return;
    }
    
    // Check cache first (unless forced refresh)
    if (!forceRefresh) {
      const cachedFiles = directoryCache.get(folderPath);
      if (cachedFiles) {
        console.log(`Using ${cachedFiles.length} cached files for ${folderPath}`);
        
        // Check cached files for reload functionality too
        if (data.forceRefresh) {
          // If forceRefresh is specified, ensure excluded property is set correctly
          cachedFiles = cachedFiles.map(file => {
            const normalizedPath = normalizePath(file.path);
            const isExcluded = shouldExcludeByDefault(normalizedPath, folderPath);
            return {
              ...file,
              excludedByDefault: isExcluded,
              excluded: isExcluded
            };
          });
        }
        
        event.sender.send("file-list-data", cachedFiles);
        
        // Set up file watcher even when using cached files
        setupFileWatcher(folderPath, mainWindow);
        
        return;
      }
    } else {
      console.log("Force refreshing directory:", folderPath);
      directoryCache.clear(folderPath);
    }
    
    // Set loading flag
    isLoadingDirectory = true;
    
    // Set timeout to abort if it takes too long
    if (loadingTimeoutId) {
      clearTimeout(loadingTimeoutId);
    }
    loadingTimeoutId = setTimeout(() => {
      if (isLoadingDirectory) {
        console.log("Loading directory timed out");
        cancelDirectoryLoading(mainWindow);
      }
    }, 120000); // 2 minutes timeout
    
    // Rest of your original file processing logic
    // ...
    
    // Start processing files logic goes here (unchanged from the original function)
    const processFiles = () => {
      console.log("Starting file scan in:", folderPath);
      console.log("OS normalized path:", normalizePath(folderPath));
      
      // Force clear the directory cache for this path to ensure fresh scan
      directoryCache.clear(folderPath);
      
      // First, get all files in the directory
      const files = readFilesRecursively(folderPath, folderPath);
      console.log(`Found ${files.length} files in ${folderPath}`);
      
      // Debug log of first few files
      if (files.length > 0) {
        console.log("First few files found:");
        files.slice(0, Math.min(5, files.length)).forEach(f => {
          console.log(`- ${f.name} (${f.path})`);
        });
      } else {
        console.log("WARNING: No files found in directory!");
      }

      // Optimize chunk size based on file count
      const CHUNK_SIZE = files.length < 100 ? 50 : 20; // Larger chunks for small directories
      let currentIndex = 0;
      const processedFiles = [];

      const processNextChunk = () => {
        // Calculate the end index for this chunk
        const endIndex = Math.min(currentIndex + CHUNK_SIZE, files.length);
        
        // Get the chunk of files to process
        const currentChunk = files.slice(currentIndex, endIndex);
        
        // Process each file in the chunk
        currentChunk.forEach(file => {
          // Normalize the path to use forward slashes consistently
          const normalizedPath = normalizePath(file.path);
          
          // Check if file should be excluded by patterns
          const isExcluded = shouldExcludeByDefault(normalizedPath, folderPath);
          
          // Create a clean file object
          processedFiles.push({
            name: file.name ? String(file.name) : "",
            path: normalizedPath, // Use normalized path
            tokenCount: typeof file.tokenCount === "number" ? file.tokenCount : 0,
            uncompressedTokenCount: typeof file.uncompressedTokenCount === "number" ? file.uncompressedTokenCount : 0,
            isCompressed: typeof file.isCompressed === "boolean" ? file.isCompressed : false,
            size: typeof file.size === "number" ? file.size : 0,
            content: file.isBinary
              ? ""
              : typeof file.content === "string"
              ? file.content
              : "",
            isBinary: Boolean(file.isBinary),
            isSkipped: Boolean(file.isSkipped),
            error: file.error ? String(file.error) : null,
            fileType: file.fileType ? String(file.fileType) : null,
            excludedByDefault: isExcluded,
            excluded: isExcluded, // Set the excluded property as well
          });
        });
        
        // Update the current index
        currentIndex = endIndex;
        
        // If there are more files to process, schedule the next chunk
        if (currentIndex < files.length) {
          // Use setTimeout to allow the UI to update between chunks
          setTimeout(processNextChunk, 0);
        } else {
          // All files processed, send the complete list
          console.log(`Finished processing all ${processedFiles.length} files`);
          
          // Cache the processed files
          directoryCache.set(folderPath, processedFiles);
          
          try {
            console.log(`Sending ${processedFiles.length} files to renderer`);
            // Log a sample of paths to check normalization
            if (processedFiles.length > 0) {
              console.log("Sample file paths (first 3):");
              processedFiles.slice(0, 3).forEach(file => {
                console.log(`- ${file.path}`);
              });
            }
            
            // Send the files to the renderer process
            event.sender.send("file-list-data", processedFiles);
            
            // Clear loading state
            isLoadingDirectory = false;
            if (loadingTimeoutId) {
              clearTimeout(loadingTimeoutId);
              loadingTimeoutId = null;
            }
            
            // Set up file watcher after successfully loading the directory
            setupFileWatcher(folderPath, mainWindow);
          } catch (sendErr) {
            console.error("Error sending file data:", sendErr);
            
            // If sending fails, try again with minimal data
            const minimalFiles = processedFiles.map((file) => ({
              name: file.name,
              path: file.path,
              tokenCount: file.tokenCount,
              uncompressedTokenCount: file.uncompressedTokenCount,
              isCompressed: file.isCompressed,
              size: file.size,
              isBinary: file.isBinary,
              isSkipped: file.isSkipped,
              excludedByDefault: file.excludedByDefault,
            }));
            
            event.sender.send("file-list-data", minimalFiles);
            
            // Clear loading state
            isLoadingDirectory = false;
            if (loadingTimeoutId) {
              clearTimeout(loadingTimeoutId);
              loadingTimeoutId = null;
            }
          }
        }
      };
      
      // Start processing the first chunk
      processNextChunk();
    };
    
    // Start processing files
    processFiles();
    
  } catch (error) {
    console.error("Error processing files:", error);
    event.sender.send("file-processing-status", {
      status: "error",
      message: `Error processing files: ${error.message}`,
    });
    
    // Clear loading state
    isLoadingDirectory = false;
    if (loadingTimeoutId) {
      clearTimeout(loadingTimeoutId);
      loadingTimeoutId = null;
    }
  }
}

// Check if a file should be excluded by default, using gitignore-style pattern matching
// Create a pattern cache to avoid recreating ignore instances
const patternCache = {
  global: null,
  local: {},  // Cache by rootDir
  combined: {}, // Cache by rootDir
  excludedLocal: {}, // Initialize excludedLocal object
  excludedGlobal: [] // Initialize excludedGlobal array
};

// Counter to limit debug output
let debugCounter = 0;
const MAX_DEBUG_FILES = 5;

function shouldExcludeByDefault(filePath, rootDir) {
  // Normalize both paths to ensure consistent handling
  const normalizedPath = normalizePath(filePath);
  const normalizedRoot = normalizePath(rootDir);
  
  // Use cached ignore instance if available
  if (!patternCache.combined[rootDir]) {
    // Initialize cache for this root directory
    const ig = ignore();
    
    // Track all patterns for debugging
    let allPatterns = [];
    
    // Add built-in patterns - convert array to a proper string format for the ignore package
    const builtInPatterns = [...excludedFiles, ...DEFAULT_EXCLUSIONS];
    ig.add(builtInPatterns);
    allPatterns = builtInPatterns;
    
    // Try to load global patterns if not already cached
    if (!patternCache.global) {
      try {
        const appDataPath = app.getPath('userData');
        const globalIgnorePath = path.join(appDataPath, 'global_patterns.ignore');
        
        if (fs.existsSync(globalIgnorePath)) {
          const content = fs.readFileSync(globalIgnorePath, 'utf8');
          if (content.trim()) {
            const { excludedPatterns, userPatterns } = parsePatterns(content);
            // Cache global patterns and excluded patterns
            patternCache.global = userPatterns;
            patternCache.excludedGlobal = excludedPatterns;
          }
        }
      } catch (err) {
        console.error('Error loading global ignore patterns:', err);
        patternCache.global = '';
        patternCache.excludedGlobal = [];
      }
    }
    
    // Add global patterns if available
    if (patternCache.global) {
      ig.add(patternCache.global);
    }
    
    // Try to load local patterns if not already cached
    if (!patternCache.local[rootDir]) {
      try {
        const ignoreFilePath = path.join(rootDir, '.repo_ignore');
        if (fs.existsSync(ignoreFilePath)) {
          const content = fs.readFileSync(ignoreFilePath, 'utf8');
          if (content.trim()) {
            const { excludedPatterns, userPatterns } = parsePatterns(content);
            // Cache local patterns and excluded patterns
            patternCache.local[rootDir] = userPatterns;
            patternCache.excludedLocal[rootDir] = excludedPatterns;
          } else {
            patternCache.local[rootDir] = '';
            patternCache.excludedLocal[rootDir] = [];
          }
        } else {
          patternCache.local[rootDir] = '';
          patternCache.excludedLocal[rootDir] = [];
        }
      } catch (err) {
        console.error('Error loading local ignore patterns:', err);
        patternCache.local[rootDir] = '';
        patternCache.excludedLocal[rootDir] = [];
      }
    }
    
    // Add local patterns if available
    if (patternCache.local[rootDir]) {
      ig.add(patternCache.local[rootDir]);
    }
    
    // Cache the ignore instance
    patternCache.combined[rootDir] = ig;
  }
  
  // Get the ignore instance from cache
  const ig = patternCache.combined[rootDir];
  
  // Check if the file should be ignored
  const relativePath = path.relative(normalizedRoot, normalizedPath);
  const shouldIgnore = ig.ignores(relativePath);
  
  // Check if the pattern that would ignore this file is disabled
  if (shouldIgnore) {
    const excludedGlobal = patternCache.excludedGlobal || [];
    const excludedLocal = patternCache.excludedLocal[rootDir] || [];
    const allExcluded = [...excludedGlobal, ...excludedLocal];
    
    // If any pattern that would match this file is disabled, don't ignore it
    for (const pattern of allExcluded) {
      try {
        if (minimatch(relativePath, pattern)) {
          return false;
        }
      } catch (e) {
        console.error(`Error with minimatch for pattern "${pattern}":`, e);
        // Continue processing other patterns if one fails
      }
    }
  }
  
  return shouldIgnore;
}

// Function to clear pattern cache when patterns change
function clearPatternCache(rootDir) {
  if (rootDir) {
    delete patternCache.local[rootDir];
    delete patternCache.combined[rootDir];
    delete patternCache.excludedLocal[rootDir];
  } else {
    patternCache.global = null;
    patternCache.local = {};
    patternCache.combined = {};
    patternCache.excludedLocal = {};
    patternCache.excludedGlobal = [];
  }
  debugCounter = 0;
}

// IPC handler for counting tokens in a given text string
ipcMain.handle('count-tokens', async (event, text) => {
  try {
    if (typeof text !== 'string') {
      // Return 0 or throw error if input is not a string
      return 0; 
    }
    return countTokens(text); // Reuse the existing countTokens function
  } catch (error) {
    console.error("Error handling 'count-tokens' IPC:", error);
    // Return 0 or throw? Let's return 0 for robustness in the renderer.
    return 0; 
  }
});

// Add a debug handler for file selection
ipcMain.on("debug-file-selection", (event, data) => {
  console.log("DEBUG - File Selection:", data);
});

// Handle resetting patterns to defaults
ipcMain.handle('reset-ignore-patterns', async (event, { folderPath, isGlobal }) => {
  try {
    if (isGlobal) {
      // Reset global patterns to defaults
      const appDataPath = app.getPath('userData');
      const globalIgnorePath = path.join(appDataPath, 'global_patterns.ignore');
      
      // Write default patterns to the file
      await writeFile(globalIgnorePath, DEFAULT_USER_PATTERNS);
      console.log(`Reset global ignore patterns to defaults at ${globalIgnorePath}`);
      
      // Clear all pattern caches to ensure new patterns are applied
      clearPatternCache();
      
      // Clear all directory caches to ensure new patterns are applied
      directoryCache.clearAll();
      
      return { 
        success: true, 
        patterns: DEFAULT_USER_PATTERNS,
        systemPatterns: SYSTEM_EXCLUSIONS
      };
    } else {
      // Reset local patterns (delete the file)
      if (!folderPath) {
        return { success: false, error: 'No folder path provided' };
      }
      
      const ignoreFilePath = path.join(folderPath, '.repo_ignore');
      if (fs.existsSync(ignoreFilePath)) {
        fs.unlinkSync(ignoreFilePath);
        console.log(`Deleted local ignore file at ${ignoreFilePath}`);
      }
      
      // Clear pattern cache for this folder
      clearPatternCache(folderPath);
      
      // Clear cache for this folder
      directoryCache.clear(folderPath);
      
      return { 
        success: true, 
        patterns: '',
        systemPatterns: SYSTEM_EXCLUSIONS
      };
    }
  } catch (error) {
    console.error('Error resetting ignore patterns:', error);
    return { success: false, error: error.message };
  }
});

// Handle clearing ignore patterns (only for local patterns)
ipcMain.handle('clear-local-ignore-patterns', async (event, { folderPath }) => {
  console.log('Clearing local ignore patterns for:', folderPath);
  
  try {
    if (!folderPath) {
      return { success: false, error: 'No folder path provided' };
    }

    const result = await clearLocalIgnorePatterns(folderPath);
    
    // Clear the cache for this folder to ensure patterns are reloaded
    if (patternCache.combined[folderPath]) {
      delete patternCache.combined[folderPath];
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in clear-local-ignore-patterns handler:', error);
    return { success: false, error: String(error) };
  }
});

// Disable security warnings in development mode
// These warnings don't appear in production builds anyway
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

// Enable clipboard reading/writing (for security reasons, this is restricted by default)
app.commandLine.appendSwitch('enable-features', 'SharedArrayBuffer');

// This module pattern is preserved
module.exports = { 
  app, 
  BrowserWindow,
  // Export pattern-related functions
  shouldExcludeByDefault,
  getAllPatterns,
  loadGitignore,
  normalizePath
};

/**
 * Clears local ignore patterns for a specific folder
 * @param {string} folderPath - Path of the folder for which to clear ignore patterns
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
async function clearLocalIgnorePatterns(folderPath) {
  try {
    const ignoreFilePath = path.join(folderPath, '.repo_ignore');
    
    // Delete the file if it exists
    if (fs.existsSync(ignoreFilePath)) {
      await unlink(ignoreFilePath);
      console.log(`Cleared local ignore patterns by deleting ${ignoreFilePath}`);
    } else {
      console.log(`No local ignore file found at ${ignoreFilePath}, nothing to clear`);
    }
    
    // Clear pattern cache for this folder using the correct cache variable
    if (patternCache) {
      // Clear local patterns
      if (patternCache.local && patternCache.local[folderPath]) {
        delete patternCache.local[folderPath];
      }
      
      // Clear combined patterns
      if (patternCache.combined && patternCache.combined[folderPath]) {
        delete patternCache.combined[folderPath];
      }
      
      // Clear excluded local patterns
      if (patternCache.excludedLocal && patternCache.excludedLocal[folderPath]) {
        delete patternCache.excludedLocal[folderPath];
      }
      
      console.log(`Cleared pattern cache for ${folderPath}`);
    }
    
    // Clear directory cache for this folder
    if (directoryCache && typeof directoryCache.clear === 'function') {
      directoryCache.clear(folderPath);
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing local ignore patterns:', error);
    throw error;
  }
}

// Handle saving ignore patterns
ipcMain.handle('save-ignore-patterns', async (event, { patterns, isGlobal, folderPath }) => {
  try {
    if (!isWindowValid(mainWindow)) {
      console.warn("Window not initialized yet or destroyed");
      return { success: false, error: 'Window not initialized' };
    }

    if (isGlobal) {
      try {
        const appDataPath = app.getPath('userData');
        const globalIgnorePath = path.join(appDataPath, 'global_patterns.ignore');
        
        // Ensure directory exists
        if (!fs.existsSync(appDataPath)) {
          await fs.promises.mkdir(appDataPath, { recursive: true });
        }
        
        // Write patterns to file
        await fs.promises.writeFile(globalIgnorePath, patterns, 'utf8');
        console.log(`Saved global ignore patterns to ${globalIgnorePath}`);
        
        // Clear pattern cache to ensure new patterns are applied
        clearPatternCache();
        
        // Clear all directory caches to ensure new patterns are applied
        directoryCache.clearAll();
        
        return { success: true };
      } catch (error) {
        console.error('Error saving global patterns:', error);
        return { success: false, error: error.message };
      }
    } else {
      if (!folderPath) {
        return { success: false, error: 'No folder path provided for local patterns' };
      }
      
      try {
        const ignoreFilePath = path.join(folderPath, '.repo_ignore');
        
        // Write patterns to file
        await fs.promises.writeFile(ignoreFilePath, patterns, 'utf8');
        console.log(`Saved local ignore patterns to ${ignoreFilePath}`);
        
        // Clear pattern cache for this folder
        clearPatternCache(folderPath);
        
        // Clear cache for this folder
        directoryCache.clear(folderPath);
        
        return { success: true };
      } catch (error) {
        console.error('Error saving local patterns:', error);
        return { success: false, error: error.message };
      }
    }
  } catch (error) {
    console.error('Error in save-ignore-patterns handler:', error);
    return { success: false, error: error.message };
  }
});

// Handle testing ignore patterns against a folder
ipcMain.handle('test-ignore-patterns', async (event, { folderPath, patterns }) => {
  console.log(`Testing patterns for folder: ${folderPath}`);
  if (!folderPath || !patterns) {
    return { success: false, error: 'Missing folderPath or patterns' };
  }

  try {
    // 1. Create an ignore instance with the provided patterns
    // Note: These patterns should already be combined (system+global+local)
    // from the frontend logic, matching the current edits.
    const ig = ignore().add(patterns);

    // 2. Get the list of all files in the directory (recursively)
    // We can reuse or adapt the file listing logic, ensuring it respects basic system ignores
    // but *not* applying the user patterns yet, as we want to test against the raw list.
    const allFiles = [];
    const files = await fs.promises.readdir(folderPath, { withFileTypes: true });

    // Basic recursive function to get all file paths relative to the root
    // This needs to be robust and handle potential errors/symlinks etc.
    // For simplicity here, we use a basic traversal. Consider reusing `walkDirectory` logic if available.
    async function traverseDir(currentPath) {
      try {
        const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(currentPath, entry.name);
          const relativePath = path.relative(folderPath, fullPath);
          
          // Basic exclusion (e.g., node_modules, .git) - apply system defaults if needed
          // Or rely on the provided patterns to handle this.
          // For now, let's assume the provided `patterns` include system defaults.

          if (entry.isDirectory()) {
            // Check if directory itself is ignored before traversing
            if (!ig.ignores(relativePath + '/')) { // Add trailing slash for directories
              await traverseDir(fullPath);
            }
          } else if (entry.isFile()) {
            allFiles.push(normalizePath(relativePath)); // Add normalized relative path
          }
        }
      } catch (error) {
        // Log errors but continue if possible
        console.warn(`Error reading directory ${currentPath}:`, error.message);
      }
    }

    await traverseDir(folderPath);

    // 3. Filter the file list using the ignore instance
    const ignoredFiles = allFiles.filter(relativePath => ig.ignores(relativePath));

    console.log(`Found ${allFiles.length} total files, ${ignoredFiles.length} would be ignored.`);

    return {
      success: true,
      ignoredCount: ignoredFiles.length,
      ignoredFiles: ignoredFiles, // Return the list of ignored relative paths
      totalFilesChecked: allFiles.length
    };

  } catch (error) {
    console.error('Error testing ignore patterns:', error);
    return { success: false, error: error.message };
  }
});

// Setup file watcher for real-time file change detection
function setupFileWatcher(folderPath, window) {
  // Close any existing watcher
  if (fileWatcher) {
    console.log("Closing existing file watcher");
    fileWatcher.close();
    fileWatcher = null;
  }

  // Close all existing watchers if we're maintaining an array of them
  if (global.allWatchers && Array.isArray(global.allWatchers)) {
    console.log(`Closing ${global.allWatchers.length} existing watchers`);
    global.allWatchers.forEach(w => {
      try {
        w.close();
      } catch (err) {
        // Ignore errors when closing
      }
    });
    global.allWatchers = [];
  } else {
    global.allWatchers = [];
  }

  if (!folderPath || !window || !isWindowValid(window)) {
    console.log("Cannot setup file watcher: missing dependencies");
    return;
  }

  console.log(`Setting up file watcher for ${folderPath}`);

  try {
    // Get ignore patterns for this folder to avoid watching excluded files
    const allPatterns = getAllPatterns(folderPath);
    const ig = ignore().add(allPatterns);
    
    // Create ignored function for filtering
    const isIgnored = (watchPath) => {
      // Check for empty or invalid paths
      if (!watchPath || typeof watchPath !== 'string' || watchPath.trim() === '') {
        console.warn(`Attempted to check an empty or invalid path for ignoring. Treating as not ignored.`);
        return false; // Don't ignore empty paths
      }
      
      // Always ignore node_modules and other large directories
      if (watchPath.includes('node_modules') || 
          watchPath.includes('.git') || 
          watchPath.includes('dist') || 
          watchPath.includes('build')) {
        return true;
      }
      
      // The ignore package requires relative paths
      try {
        const normalizedWatchPath = normalizePath(watchPath);
        const normalizedFolderPath = normalizePath(folderPath);
        // Convert absolute path to relative path
        const relativePath = path.relative(normalizedFolderPath, normalizedWatchPath);
        
        // Check that relativePath is not empty before passing to ignores()
        if (!relativePath || relativePath.trim() === '') {
          console.warn(`Empty relative path generated from: ${watchPath}. Treating as not ignored.`);
          return false;
        }
        
        // Now pass the relative path to ignores()
        return ig.ignores(relativePath);
      } catch (err) {
        console.warn(`Error checking if path is ignored: ${watchPath}`, err);
        return false; // Don't ignore if there's an error
      }
    };
    
    // Use chokidar if available, otherwise fall back to native fs.watch
    if (chokidar && typeof chokidar.watch === 'function' && 
        chokidar.watch.toString().includes('function')) {
      // Start watching the folder with appropriate options using chokidar
      try {
        console.log("Using chokidar for file watching with optimized settings");
        fileWatcher = chokidar.watch(folderPath, {
          ignored: [
            isIgnored,
            /(^|[\/\\])\../, // Ignore dotfiles
            '**/node_modules/**',
            '**/.git/**'
          ],
          persistent: true,
          ignoreInitial: true, // Don't fire events for existing files
          awaitWriteFinish: {
            stabilityThreshold: 500, // Wait 500ms after last change
            pollInterval: 100 // Poll every 100ms
          },
          depth: 5, // Limit watch depth to 5 levels to prevent excessive watchers
          useFsEvents: true, // Use native filesystem events if available
          alwaysStat: false, // Don't get stats for all files (performance)
          usePolling: false // Don't use polling (uses more CPU)
        });

        // Set up event handlers with debouncing to avoid too many updates
        let addDebounce = null;
        let changeDebounce = null;
        let deleteDebounce = null;

        fileWatcher
          .on('add', path => {
            if (addDebounce) clearTimeout(addDebounce);
            addDebounce = setTimeout(() => {
              console.log(`File added (raw path): ${path}`);
              // Ensure consistent path format
              const normalizedPath = normalizePath(path);
              safeRendererSend(window, 'file-changed', { type: 'add', path: normalizedPath });
            }, WATCH_DEBOUNCE_TIME);
          })
          .on('change', path => {
            if (changeDebounce) clearTimeout(changeDebounce);
            changeDebounce = setTimeout(() => {
              console.log(`File changed (raw path): ${path}`);
              // Ensure consistent path format
              const normalizedPath = normalizePath(path);
              safeRendererSend(window, 'file-changed', { type: 'change', path: normalizedPath });
            }, WATCH_DEBOUNCE_TIME);
          })
          .on('unlink', path => {
            if (deleteDebounce) clearTimeout(deleteDebounce);
            deleteDebounce = setTimeout(() => {
              console.log(`File deleted (raw path): ${path}`);
              // Ensure consistent path format
              const normalizedPath = normalizePath(path);
              safeRendererSend(window, 'file-changed', { type: 'delete', path: normalizedPath });
            }, WATCH_DEBOUNCE_TIME);
          })
          .on('error', error => {
            // Handle errors specifically
            if (error.code === 'EMFILE') {
              console.error('Too many files to watch! Some changes may not be detected.');
              console.error('You can increase the limit with: ulimit -n <number> (macOS/Linux)');
              safeRendererSend(window, 'file-processing-status', {
                status: 'warning',
                message: 'Too many files to watch. Some changes may not be detected.'
              });
            } else {
              console.error(`File watcher error: ${error}`);
            }
          });
          
        console.log("Chokidar file watcher set up successfully");
      } catch (err) {
        console.error(`Error setting up chokidar watcher: ${err}`);
        // Fall back to fs.watch on chokidar failure
        useFsWatchFallback();
      }
    } else {
      // Fall back to native fs.watch
      useFsWatchFallback();
    }
    
    // Function for using fs.watch as a fallback
    function useFsWatchFallback() {
      console.log("Using optimized native fs.watch fallback for file watching");
      
      // This will store all the watchers we create
      const watchers = [];
      let addDebounce = null;
      let deleteDebounce = null;
      let changeDebounce = null;
      
      // Create a watcher manager to handle errors and limits
      const watcherManager = {
        // Track the number of watchers and depth
        count: 0,
        // Maximum number of watchers to create
        MAX_WATCHERS: 1000,
        // Maximum directory depth to watch
        MAX_DEPTH: 4,
        
        // Add a watcher if we haven't hit the limit
        addWatcher: function(watcher) {
          if (this.count >= this.MAX_WATCHERS) {
            console.warn(`Reached maximum watcher limit (${this.MAX_WATCHERS}). Some changes may not be detected.`);
            return false;
          }
          
          watchers.push(watcher);
          global.allWatchers.push(watcher); // Also add to global tracker
          this.count++;
          return true;
        },
        
        // Check if we can add more watchers
        canAddWatchers: function() {
          return this.count < this.MAX_WATCHERS;
        }
      };
      
      // Function to watch a directory and its subdirectories
      const watchDirectory = (dir, depth = 0) => {
        // Validate directory path before proceeding
        if (!dir || typeof dir !== 'string' || dir.trim() === '') {
          console.warn('Attempted to watch an empty or invalid directory path. Skipping.');
          return;
        }
        
        // Check depth limit to avoid excessive recursion
        if (depth > watcherManager.MAX_DEPTH) {
          console.log(`Reached maximum watch depth (${watcherManager.MAX_DEPTH}) for ${dir}. Skipping deeper directories.`);
          return;
        }
        
        // Check if we should ignore this directory
        if (isIgnored(dir)) {
          return;
        }
        
        // Check if we've hit the watcher limit
        if (!watcherManager.canAddWatchers()) {
          return;
        }
        
        try {
          // Watch the current directory
          const watcher = safeFsWatch(dir, (eventType, filename) => {
            // Validate filename before using it
            if (!filename || typeof filename !== 'string' || filename.trim() === '') {
              console.warn(`Received empty or invalid filename in watcher event for ${dir}. Skipping.`);
              return;
            }
            
            const fullPath = path.join(dir, filename);
            
            // Skip ignored files/directories
            if (isIgnored(fullPath)) return;
            
            try {
              // Check if the path still exists
              const exists = fs.existsSync(fullPath);
              const stats = exists ? fs.statSync(fullPath) : null;
              
              if (eventType === 'rename') {
                if (exists && stats) {
                  // It's an add event
                  if (addDebounce) clearTimeout(addDebounce);
                  addDebounce = setTimeout(() => {
                    console.log(`File added (raw path): ${fullPath}`);
                    // Ensure consistent path format
                    const normalizedPath = normalizePath(fullPath);
                    safeRendererSend(window, 'file-changed', { type: 'add', path: normalizedPath });
                    
                    // If it's a directory, watch it too (but respect depth limit)
                    if (stats.isDirectory() && depth < watcherManager.MAX_DEPTH) {
                      watchDirectory(fullPath, depth + 1);
                    }
                  }, WATCH_DEBOUNCE_TIME);
                } else {
                  // It's a delete event
                  if (deleteDebounce) clearTimeout(deleteDebounce);
                  deleteDebounce = setTimeout(() => {
                    console.log(`File deleted (raw path): ${fullPath}`);
                    // Ensure consistent path format
                    const normalizedPath = normalizePath(fullPath);
                    safeRendererSend(window, 'file-changed', { type: 'delete', path: normalizedPath });
                  }, WATCH_DEBOUNCE_TIME);
                }
              } else if (eventType === 'change' && exists && stats && !stats.isDirectory()) {
                // It's a file change event
                if (changeDebounce) clearTimeout(changeDebounce);
                changeDebounce = setTimeout(() => {
                  console.log(`File changed (raw path): ${fullPath}`);
                  // Ensure consistent path format
                  const normalizedPath = normalizePath(fullPath);
                  safeRendererSend(window, 'file-changed', { type: 'change', path: normalizedPath });
                }, WATCH_DEBOUNCE_TIME);
              }
            } catch (err) {
              console.error(`Error handling file event for ${fullPath}:`, err);
            }
          });
          
          // Add to our tracked watchers
          if (watcher && watcherManager.addWatcher(watcher)) {
            if (depth === 0) {
              console.log(`Set up root watcher for ${dir}`);
            }
          }
          
          // Recursively watch subdirectories (with depth limit)
          try {
            if (watcherManager.canAddWatchers()) {
              const entries = fs.readdirSync(dir, { withFileTypes: true });
              // Process only directories
              const directories = entries.filter(entry => entry.isDirectory());
              
              // Limit the number of directories to watch at each level
              const MAX_DIRS_PER_LEVEL = 50;
              if (directories.length > MAX_DIRS_PER_LEVEL) {
                console.log(`Limiting subdirectory watching to ${MAX_DIRS_PER_LEVEL} at ${dir}`);
                directories.length = MAX_DIRS_PER_LEVEL;
              }
              
              for (const entry of directories) {
                if (!watcherManager.canAddWatchers()) {
                  console.log(`Reached watcher limit. Stopping directory traversal at ${dir}`);
                  break;
                }
                
                const subDir = path.join(dir, entry.name);
                if (!isIgnored(subDir)) {
                  watchDirectory(subDir, depth + 1);
                }
              }
            }
          } catch (err) {
            console.error(`Error reading directory ${dir}:`, err);
          }
        } catch (err) {
          // Handle EMFILE error specifically
          if (err.code === 'EMFILE') {
            console.error('Too many open files. No more watchers will be created.');
            safeRendererSend(window, 'file-processing-status', {
              status: 'warning',
              message: 'Too many files to watch. Some changes may not be detected.'
            });
          } else {
            console.error(`Error setting up watcher for ${dir}:`, err);
          }
        }
      };
      
      // Start watching from the root folder
      watchDirectory(folderPath);
      
      // Create a fileWatcher-like object with a close method
      fileWatcher = {
        close: () => {
          watchers.forEach(watcher => {
            try {
              watcher.close();
            } catch (err) {
              console.error("Error closing watcher:", err);
            }
          });
          console.log(`Closed ${watchers.length} watchers`);
        }
      };
      
      console.log(`Native fs.watch fallback set up with ${watchers.length} watchers`);
    }

    console.log("File watcher set up successfully");
  } catch (error) {
    console.error("Error setting up file watcher:", error);
    // Notify the renderer of the error
    safeRendererSend(window, 'file-processing-status', {
      status: 'error',
      message: `Error setting up file watcher: ${error.message}`
    });
  }
}

// Handle get-file-metadata request
ipcMain.handle("get-file-metadata", async (event, filePath) => {
  try {
    console.log(`Getting metadata for file: ${filePath}`);
    if (!filePath) {
      return { success: false, error: "No file path provided" };
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return { success: false, error: "File does not exist" };
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Skip if it's a directory
    if (stats.isDirectory()) {
      return { success: false, error: "Path is a directory, not a file" };
    }

    // Check if it's a binary file
    const isBinary = isBinaryFile(filePath);
    
    // Get base file info
    const fileName = path.basename(filePath);
    const normalizedPath = normalizePath(filePath);
    
    // Find parent directory to check ignore patterns
    const parentDir = path.dirname(filePath);
    const isExcluded = shouldExcludeByDefault(normalizedPath, parentDir);
    
    // Create file metadata object
    const fileData = {
      name: fileName,
      path: normalizedPath,
      size: stats.size,
      lastModified: stats.mtime.getTime(),
      isBinary: isBinary,
      excludedByDefault: isExcluded,
      excluded: isExcluded,
      isSkipped: isBinary || isExcluded || stats.size > MAX_FILE_SIZE,
      tokenCount: 0, // Will be calculated on demand
      uncompressedTokenCount: 0
    };
    
    // If it's a small text file, count tokens
    if (!isBinary && stats.size <= MAX_FILE_SIZE) {
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        fileData.tokenCount = countTokens(content);
        fileData.uncompressedTokenCount = fileData.tokenCount;
      } catch (error) {
        console.error(`Error reading file content for ${filePath}:`, error);
        fileData.error = `Error reading file: ${error.message}`;
      }
    }
    
    return {
      success: true,
      fileData
    };
  } catch (error) {
    console.error(`Error getting file metadata for ${filePath}:`, error);
    return {
      success: false,
      error: `Error: ${error.message}`
    };
  }
});
