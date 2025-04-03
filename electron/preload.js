// Preload script
const { contextBridge, ipcRenderer, shell } = require("electron");

// Define valid channels in one place for better maintainability
const VALID_CHANNELS = {
  send: [
    "open-folder", 
    "request-file-list", 
    "load-ignore-patterns", 
    "save-ignore-patterns",
    "reset-ignore-patterns",
    "debug-file-selection", 
    "cancel-directory-loading",
    "reload-file-list"
  ],
  receive: [
    "folder-selected", 
    "file-list-data", 
    "file-processing-status", 
    "ignore-patterns-loaded", 
    "ignore-patterns-saved",
    "startup-mode",
    "file-changed"
  ],
  invoke: [
    "open-folder",
    "read-file",
    "request-file-list",
    "save-ignore-patterns",
    "load-ignore-patterns",
    "reset-ignore-patterns",
    "clear-local-ignore-patterns",
    "get-file-content",
    "test-ignore-patterns",
    "compress-code",
    "remove-comments",
    "count-tokens",
    "get-file-metadata"
  ]
};

// Helper function to ensure data is serializable
function ensureSerializable(data) {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle primitive types directly
  if (typeof data !== "object") {
    return data;
  }

  // For arrays, map each item
  if (Array.isArray(data)) {
    return data.map(ensureSerializable);
  }

  // For objects, create a new object with serializable properties
  const result = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Skip functions or symbols which are not serializable
      if (typeof data[key] === "function" || typeof data[key] === "symbol") {
        continue;
      }
      // Recursively process nested objects
      result[key] = ensureSerializable(data[key]);
    }
  }
  return result;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electron", {
  // Direct API methods
  send: (channel, data) => {
    if (VALID_CHANNELS.send.includes(channel)) {
      const serializedData = ensureSerializable(data);
      ipcRenderer.send(channel, serializedData);
    }
  },
  receive: (channel, func) => {
    if (VALID_CHANNELS.receive.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  
  // Add specific invoke methods for clarity and type safety (optional but good practice)
  openFolder: () => ipcRenderer.invoke('open-folder'),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  requestFileList: (data) => {
    // Use send instead of invoke for request-file-list
    const serializedData = ensureSerializable(data);
    ipcRenderer.send('request-file-list', serializedData);
    return Promise.resolve(true); // Return a resolved promise for backward compatibility
  },
  saveIgnorePatterns: (data) => ipcRenderer.invoke('save-ignore-patterns', ensureSerializable(data)),
  loadIgnorePatterns: (data) => ipcRenderer.invoke('load-ignore-patterns', ensureSerializable(data)),
  resetIgnorePatterns: (data) => ipcRenderer.invoke('reset-ignore-patterns', ensureSerializable(data)),
  clearLocalIgnorePatterns: (folderPath) => ipcRenderer.invoke('clear-local-ignore-patterns', folderPath),
  getFileContent: (filePath) => ipcRenderer.invoke('get-file-content', filePath),
  testIgnorePatterns: (data) => ipcRenderer.invoke('test-ignore-patterns', ensureSerializable(data)),

  // Add the new methods for compression and comment removal
  compressCode: (source, language) => {
    if (VALID_CHANNELS.invoke.includes('compress-code')) {
      // Pass data as an object matching the handler's expectation
      return ipcRenderer.invoke('compress-code', { source, language }); 
    }
    return Promise.reject(new Error('Invalid channel: compress-code'));
  },
  removeComments: (source, language, keepDocstrings) => {
    if (VALID_CHANNELS.invoke.includes('remove-comments')) {
      // Pass data as an object matching the handler's expectation
      return ipcRenderer.invoke('remove-comments', { source, language, keepDocstrings });
    }
    return Promise.reject(new Error('Invalid channel: remove-comments'));
  },
  
  // Add countTokens method
  countTokens: (text) => {
    if (VALID_CHANNELS.invoke.includes('count-tokens')) {
      return ipcRenderer.invoke('count-tokens', text);
    }
    return Promise.reject(new Error('Invalid channel: count-tokens'));
  },

  // Add getFileMetadata method for file change detection
  getFileMetadata: (filePath) => {
    if (VALID_CHANNELS.invoke.includes('get-file-metadata')) {
      return ipcRenderer.invoke('get-file-metadata', filePath);
    }
    return Promise.reject(new Error('Invalid channel: get-file-metadata'));
  },
  
  // Add file processing status listener
  onFileProcessingStatus: (callback) => {
    if (!callback || typeof callback !== 'function') {
      console.error('Invalid callback provided to onFileProcessingStatus');
      return;
    }
    
    // Use the standard pattern used by other listeners
    if (VALID_CHANNELS.receive.includes('file-processing-status')) {
      ipcRenderer.removeAllListeners('file-processing-status');
      ipcRenderer.on('file-processing-status', (event, statusData) => {
        try {
          callback(statusData);
        } catch (err) {
          console.error('Error in file processing status callback:', err);
        }
      });
    }
  },

  // Add openExternal function to open links in the default browser
  openExternal: (url) => {
    if (typeof url === 'string' && (url.startsWith('https://') || url.startsWith('http://'))) {
      return shell.openExternal(url);
    }
    return Promise.reject(new Error('Invalid URL provided to openExternal'));
  },

  // Keep the generic ipcRenderer object for potential backward compatibility or other uses
  // BUT favor using the specific methods above for better code clarity.
  ipcRenderer: {
    send: (channel, data) => {
      if (VALID_CHANNELS.send.includes(channel)) {
        const serializedData = ensureSerializable(data);
        ipcRenderer.send(channel, serializedData);
      }
    },
    invoke: (channel, data) => {
      if (VALID_CHANNELS.invoke.includes(channel)) {
        // Ensure data is serializable before invoking
        const serializedData = ensureSerializable(data);
        return ipcRenderer.invoke(channel, serializedData);
      }
      return Promise.reject(new Error(`Invalid channel: ${channel}`));
    },
    on: (channel, func) => {
      if (VALID_CHANNELS.receive.includes(channel)) {
        const subscription = (event, ...args) => {
          const serializedArgs = args.map(ensureSerializable);
          func(...serializedArgs);
        };
        ipcRenderer.on(channel, subscription);
        return subscription;
      }
    },
    removeListener: (channel, func) => {
      if (VALID_CHANNELS.receive.includes(channel)) {
        ipcRenderer.removeListener(channel, func);
      }
    },
  },
});
