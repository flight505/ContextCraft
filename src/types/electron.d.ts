declare global {
  interface Window {
    /**
     * Electron API exposed through contextBridge in preload.js
     */
    electron: {
      /**
       * IPC Renderer interface for communication with the main process
       */
      ipcRenderer: {
        /**
         * Send a message to the main process
         * @param channel - The channel to send the message on
         * @param data - Optional data to send with the message
         */
        send: (channel: string, data?: any) => void;
        
        /**
         * Register a listener for messages from the main process
         * @param channel - The channel to listen on
         * @param func - The callback function to handle the message
         */
        on: (channel: string, func: (...args: any[]) => void) => void;
        
        /**
         * Remove a listener for messages from the main process
         * @param channel - The channel to remove the listener from
         * @param func - The callback function to remove
         */
        removeListener: (channel: string, func: (...args: any[]) => void) => void;
        
        /**
         * Invoke a method in the main process and get a response
         * @param channel - The channel to invoke the method on
         * @param data - Optional data to send with the invocation
         * @returns A promise that resolves with the result from the main process
         */
        invoke: <T = any>(channel: string, data?: any) => Promise<T>;
        
        /**
         * Set the maximum number of listeners for a channel
         * @param n - The maximum number of listeners
         */
        setMaxListeners?: (n: number) => void;
      };

      // Specific invoke methods
      openFolder: () => Promise<string | null>;
      readFile: (filePath: string) => Promise<string | null>;
      requestFileList: (data: { path: string; forceRefresh?: boolean }) => Promise<any>; // Consider defining a stricter return type
      saveIgnorePatterns: (data: { patterns: string; isGlobal: boolean; folderPath?: string }) => Promise<{ success: boolean; error?: string }>;
      loadIgnorePatterns: (data: { folderPath?: string; isGlobal: boolean }) => Promise<{ success: boolean; patterns: string; systemPatterns: string[]; excludedPatterns: string[]; error?: string }>;
      resetIgnorePatterns: (data: { folderPath?: string; isGlobal: boolean }) => Promise<{ success: boolean; patterns?: string; systemPatterns?: string[]; error?: string }>;
      clearLocalIgnorePatterns: (data: { folderPath: string }) => Promise<{ success: boolean; error?: string }>;
      getFileContent: (filePath: string) => Promise<{ success: boolean; content?: string; size?: number; lastModified?: number; error?: string }>;
      testIgnorePatterns: (data: { folderPath: string; patterns: string }) => Promise<{ success: boolean; ignoredCount?: number; ignoredFiles?: string[]; totalFilesChecked?: number; error?: string }>;
      compressCode: (source: string, language: string) => Promise<string | null>;
      removeComments: (source: string, language: string, keepDocstrings?: boolean) => Promise<string | null>;
      countTokens: (text: string) => Promise<number>; // Added based on error messages
      getFileMetadata: (filePath: string) => Promise<{ 
        success: boolean; 
        fileData?: { 
          name: string; 
          path: string; 
          size: number; 
          lastModified: number; 
          isBinary: boolean; 
          excludedByDefault: boolean; 
          excluded: boolean; 
          isSkipped: boolean; 
          tokenCount: number; 
          uncompressedTokenCount: number;
          error?: string;
        }; 
        error?: string 
      }>;

      // Send method (if still needed - prefer specific invokes)
      send: (channel: string, data?: any) => void;

      // Receive method (if still needed)
      receive: (channel: string, func: (...args: any[]) => void) => void;
      
      // Optional: Keep generic ipcRenderer if absolutely necessary, but discourage use
      ipcRenderer?: {
        send: (channel: string, data?: any) => void;
        invoke: (channel: string, data?: any) => Promise<any>;
        on: (channel: string, func: (...args: any[]) => void) => any; // Return type might vary
        removeListener: (channel: string, func: (...args: any[]) => void) => void;
        removeAllListeners: (channel: string) => void;
      };
    };
  }
}

export {}; 