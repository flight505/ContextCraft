Okay, let's analyze the provided code, focusing on how file changes should propagate from detection (presumably in the main process) to the UI update (in the renderer process, specifically `App.tsx` and `Sidebar.tsx`).

The core mechanism seems to rely on IPC communication between the Electron main process (where file watching should happen) and the renderer process (`App.tsx`).

**Key Code Sections Involved:**

1.  **`App.tsx` - `useEffect` hook listening for `file-changed` (Lines 462-533):** This is the entry point in the renderer process for handling file change notifications from the main process.
2.  **`App.tsx` - `handleFileChanged` function (Lines 467-521):** This function processes the notification, updates `allFiles` state, and potentially `selectedFiles`.
3.  **`App.tsx` - `applyFiltersAndSort` function (Lines 251-288) & its `useEffect` (Lines 291-293):** This updates `displayedFiles` based on `allFiles`, `sortOrder`, and `searchTerm`. `displayedFiles` is passed to `FileList`.
4.  **`Sidebar.tsx` - `useEffect` hook calling `buildFileTree` (Lines 381-456):** This hook listens for changes in `allFiles` and rebuilds the `fileTree` state used to render the sidebar.
5.  **`Sidebar.tsx` - `buildFileTree` function (Lines 280-379):** Converts the flat `allFiles` list into a hierarchical `TreeNode[]` structure.
6.  **`preload.js` (Assumed):** Exposes `window.electron.receive` (or `ipcRenderer.on`) and `window.electron.getFileMetadata`.
7.  **`main.js` (Assumed):** Contains the actual file system watcher (e.g., using `chokidar`) and sends `file-changed` events via `mainWindow.webContents.send()`. It also handles the `getFileMetadata` IPC invoke call.

**Analysis and Potential Issues:**

1.  **Main Process Watcher (Not Provided):**
    *   **Problem:** The most common point of failure is the file watcher itself in `main.js`. Is it correctly set up using a library like `chokidar`? Is it watching the `selectedFolder` path? Are the events (`add`, `change`, `unlink`/`unlinkDir`) being captured correctly?
    *   **Verification:** Add `console.log` statements within the watcher's event handlers in `main.js` to confirm they fire when you manually change files in the watched folder.
    *   **Guidance:** Ensure `chokidar` (recommended) is initialized *after* a folder is selected and watches the `selectedFolder`. Use options like `ignoreInitial: true` and potentially `awaitWriteFinish: true` for better stability.

2.  **IPC Communication (`main.js` -> `App.tsx`):**
    *   **Problem:** Is the main process actually sending the `file-changed` message? Is the channel name exactly `"file-changed"`? Is the data format `{ type: 'add'|'change'|'delete', path: string }` correct?
    *   **Verification:** In `main.js`, inside the watcher callback, add:
        ```javascript
        // Example using chokidar in main.js
        watcher.on('all', (event, path) => {
          console.log(`Watcher Event: ${event} on ${path}`); // <-- Add this log
          if (mainWindow && (event === 'add' || event === 'change' || event === 'unlink')) {
             const type = event === 'unlink' ? 'delete' : event;
             console.log(`Sending IPC 'file-changed': type=${type}, path=${path}`); // <-- Add this log
             mainWindow.webContents.send('file-changed', { type, path });
          }
        });
        ```
    *   **Verification:** In `App.tsx` inside the `useEffect` listening for `file-changed` (around line 466), add:
        ```typescript
        window.electron.receive("file-changed", (data: { type: 'add' | 'change' | 'delete', path: string }) => {
           console.log('[Renderer] Received IPC file-changed:', data); // <-- Add this log
           handleFileChanged(data);
        });
        ```
    *   **Guidance:** Ensure channel names and data structures match precisely between sender (`main.js`) and receiver (`App.tsx`).

3.  **Preload Script Exposure:**
    *   **Problem:** Is `window.electron.receive` (or `ipcRenderer.on`) correctly exposed via `contextBridge` in `preload.js`? Similarly, is `window.electron.getFileMetadata` correctly exposed and linked to an `ipcMain.handle` call?
    *   **Verification:** Review your `preload.js` file. It should look something like this:
        ```javascript
        const { contextBridge, ipcRenderer } = require('electron');

        contextBridge.exposeInMainWorld('electron', {
          // ... other exposed functions like openFolder, readFile ...

          // Method for receiving messages from main
          receive: (channel, func) => {
            // Ensure valid channels if needed for security
            const validChannels = ["file-changed", "folder-selected", "file-list-data", /* ... other channels */ ];
            if (validChannels.includes(channel)) {
              // Deliberately strip event as it includes `sender`
              ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
          },

          // Method for invoking functions in main and getting a response
          getFileMetadata: (filePath) => ipcRenderer.invoke('get-file-metadata', filePath),

          // Expose removeListener if needed for cleanup in React effects
          ipcRenderer: {
             removeListener: (channel, func) => ipcRenderer.removeListener(channel, func),
             // Expose other ipcRenderer methods cautiously if necessary
          }

          // ... other exposed functions ...
        });
        ```
    *   **Guidance:** Ensure the `receive` function passes arguments correctly and that the `getFileMetadata` function uses `ipcRenderer.invoke`.

4.  **Renderer State Updates (`App.tsx` & `Sidebar.tsx`):**
    *   **Problem:** Even if the IPC message arrives, the state updates might not be triggering UI changes correctly.
    *   **`App.tsx` `handleFileChanged`:**
        *   The logic seems mostly correct. It fetches metadata for adds/changes and updates `allFiles`.
        *   It correctly uses functional updates (`setAllFiles(prev => ...)`), which is good for handling potential race conditions.
        *   It calls `applyFiltersAndSort` *within* the functional update for `setAllFiles` when adding/deleting. This is a bit unusual but should work to update `displayedFiles`. A separate `useEffect` listening to `allFiles` (like the one already present on lines 291-293) is the more standard pattern.
        *   **Minor:** For 'change', `applyFiltersAndSort` is called *only* if the file is selected. This might be okay, but if sorting/filtering depends on metadata that changed (like token count), the `displayedFiles` might not re-sort correctly unless the file was selected. Relying on the main `useEffect` (lines 291-293) watching `allFiles` is safer.
    *   **`Sidebar.tsx` `useEffect` / `buildFileTree`:**
        *   The `useEffect` hook (lines 381-456) correctly depends on `allFiles`. When `allFiles` is updated in `App.tsx`, this hook *should* run.
        *   The debouncing and timeout logic might introduce delays or potentially swallow updates if file changes are extremely rapid.
        *   `buildFileTree` itself seems complex but looks like it should correctly transform the flat list into a tree.
    *   **Verification:**
        *   In `App.tsx`, add `console.log('Updated allFiles count:', updatedFiles.length);` inside the functional update for `setAllFiles`.
        *   In `Sidebar.tsx`, add `console.log('[Sidebar] useEffect triggered by allFiles change. Building tree...');` at the start of the `useEffect` hook (line 382).
        *   In `Sidebar.tsx`, add `console.log('[Sidebar] Tree build complete. New tree root count:', result.length);` after `setFileTree(result)` (line 426).

5.  **`getFileMetadata` Implementation (Not Provided):**
    *   **Problem:** If `window.electron.getFileMetadata` in the main process fails (e.g., file permissions, file deleted between event and call), the `handleFileChanged` function might not update the state correctly or might insert incorrect data.
    *   **Verification:** Check the main process handler for `'get-file-metadata'`. Ensure it correctly uses `fs.promises.stat`, calculates necessary data (like `isBinary`, `tokenCount`), applies ignore patterns *again* (important!), and handles errors gracefully, returning `{ success: false, error: ... }`.

**Recommendations:**

1.  **Verify `main.js` Watcher and IPC:** This is the highest priority. Use `console.log` extensively in the watcher callbacks and the `webContents.send` call to ensure events are detected and sent.
2.  **Verify `preload.js`:** Confirm the `receive` and `getFileMetadata` functions are exposed correctly.
3.  **Confirm IPC Reception in `App.tsx`:** Add the `console.log` inside the `window.electron.receive("file-changed", ...)` callback. If this log doesn't appear when files change, the issue is in main, preload, or the channel name.
4.  **Trace State Updates:** If IPC messages *are* received, use `console.log` as suggested above in `App.tsx` (`handleFileChanged`) and `Sidebar.tsx` (`useEffect`/`buildFileTree`) to follow the state update chain.
5.  **Simplify `handleFileChanged`:** Consider removing the `applyFiltersAndSort` calls *inside* the functional update for `setAllFiles`. Rely solely on the existing `useEffect` (lines 291-293) that watches `allFiles`, `sortOrder`, and `searchTerm` to update `displayedFiles`. This makes the flow more standard.
    ```typescript
    // Inside handleFileChanged for 'add':
    setAllFiles(prev => [...prev, result.fileData]); // Just update allFiles

    // Inside handleFileChanged for 'delete':
    setAllFiles(prevAllFiles => prevAllFiles.filter(file => file.path !== path)); // Just update allFiles
    setSelectedFiles(prevSelectedFiles => prevSelectedFiles.filter(filePath => filePath !== path));

    // The useEffect at lines 291-293 will then handle updating displayedFiles
    ```
6.  **Ensure Robust `getFileMetadata`:** Make sure the main process handler for `get-file-metadata` is robust, handles errors, and re-checks ignore patterns for the specific file being requested.

By systematically checking these points, starting from the main process watcher, you should be able to pinpoint where the automatic update mechanism is breaking down.