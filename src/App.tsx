import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Sidebar from "./components/Sidebar";
import FileList from "./components/FileList";
import ControlContainer from "./components/ControlContainer";
import { FileData, FileTreeMode, SortOrder } from "./types/FileTypes";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import { generateAsciiFileTree, normalizePath, arePathsEqual } from "./utils/pathUtils";
import { Github } from "lucide-react";
import styles from "./App.module.css";
import { Dropdown } from "./components/ui";
import { ConfirmationDialog } from "./components/ui/ConfirmationDialog";
import { Button } from "./components/ui/Button";
import { getSortIcon } from "./utils/sortIcons";
// Import utilities from patternUtils
import { SYSTEM_PATTERN_CATEGORIES, parseIgnorePatternsContent, IgnorePatternsState } from "./utils/patternUtils";
import { OutputFormatType, OUTPUT_FORMAT_STORAGE_KEY } from './constants/outputFormats';
import { formatAsXML, formatAsMarkdown, formatAsPlain, FileContent } from './utils/formatters';
import { UserInstructionsWithTemplates } from './components/UserInstructionsWithTemplates';
// Import model fetching utility
import { fetchModels } from './utils/modelUtils';
import { ModelInfo } from "./types/ModelTypes"; // Import the new ModelInfo type
import { compressCode, removeComments, getLanguageFromFilename } from './utils/compressionUtils'; // Import compression utils and getLanguageFromFilename
// Import Toast component
import { Toast, showToast } from './components/ui/Toast';
import { toast } from 'sonner';

// Keys for localStorage
const STORAGE_KEYS = {
  SELECTED_FOLDER: "pastemax-selected-folder",
  SELECTED_FILES: "pastemax-selected-files",
  SORT_ORDER: "pastemax-sort-order",
  SEARCH_TERM: "pastemax-search-term",
  EXPANDED_NODES: "pastemax-expanded-nodes",
  GLOBAL_IGNORE_PATTERNS: "pastemax-global-ignore-patterns-v2", // Added version suffix
  SELECTED_MODEL_ID: "pastemax-selected-model-id", // New key
};

// Default system patterns as fallback if not provided by main process
const DEFAULT_SYSTEM_PATTERNS = [
  // Combine categories into one list for default state
  ...SYSTEM_PATTERN_CATEGORIES.versionControl,
  ...SYSTEM_PATTERN_CATEGORIES.buildOutput,
  ...SYSTEM_PATTERN_CATEGORIES.caches,
  ...SYSTEM_PATTERN_CATEGORIES.logs,
  ...SYSTEM_PATTERN_CATEGORIES.ide,
  ...SYSTEM_PATTERN_CATEGORIES.temp,
  ...SYSTEM_PATTERN_CATEGORIES.os,
  // Other common defaults
  "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.ico",
  "**/*.webp", "**/*.svg", "**/*.pdf", "**/*.zip", "**/*.tar.gz",
  "**/*.tgz", "**/*.rar", "**/*.7z", "**/*.mp4", "**/*.mov",
  "**/*.avi", "**/*.mkv", "**/*.mp3", "**/*.wav", "**/*.flac",
  "**/*.sqlite", "**/*.db", "**/*.sql",
  "**/*.doc", "**/*.docx", "**/*.xls", "**/*.xlsx", "**/*.ppt", "**/*.pptx",
  "**/*.iso", "**/*.bin", "**/*.exe", "**/*.dll", "**/*.so", "**/*.dylib",
  "**/*.min.js", "**/*.min.css",
];

// Mock type definition for ignore package
interface IgnoreInstance {
  ignores: (path: string) => boolean;
}

interface IgnoreFactory {
  add: (patterns: string[] | string) => IgnoreInstance;
}

// This is just a simple interface to satisfy TypeScript without importing the actual package
// The real implementation will be used at runtime
function ignore(): IgnoreFactory {
  return {
    add: () => ({
      ignores: () => false
    })
  };
}

const App = () => {
  // Load initial state from localStorage if available
  const savedFolder = localStorage.getItem(STORAGE_KEYS.SELECTED_FOLDER);
  const savedFiles = localStorage.getItem(STORAGE_KEYS.SELECTED_FILES);
  const savedExpandedNodes = localStorage.getItem(STORAGE_KEYS.EXPANDED_NODES);
  const savedShowInstructions = localStorage.getItem('pastemax-show-instructions');
  const savedModelId = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL_ID);

  // State for user interface controls
  const [showUserInstructions, setShowUserInstructions] = useState(
    savedShowInstructions === null ? false : savedShowInstructions !== 'false'
  );
  const [fileTreeMode, setFileTreeMode] = useState<FileTreeMode>('complete');

  // State for model information
  const [availableModels, setAvailableModels] = useState<ModelInfo[] | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(savedModelId);
  const [selectedContextLength, setSelectedContextLength] = useState<number | null>(null);
  const [isCompressionEnabled, setIsCompressionEnabled] = useState<boolean>(false);

  // Initialize expanded nodes from localStorage if available
  const initialExpandedNodes = useMemo(() => {
    const map = new Map<string, boolean>();
    if (savedExpandedNodes) {
      try {
        const parsedNodes = JSON.parse(savedExpandedNodes);
        if (Array.isArray(parsedNodes)) {
          parsedNodes.forEach(([key, value]) => {
            if (typeof key === 'string' && typeof value === 'boolean') {
              map.set(key, value);
            }
          });
        }
      } catch (error) {
        console.error("Error parsing saved expanded nodes:", error);
      }
    }
    return map;
  }, [savedExpandedNodes]);

  const [selectedFolder, setSelectedFolder] = useState<string | null>(savedFolder);
  const [allFiles, setAllFiles] = useState<Omit<FileData, 'content'>[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>(
    savedFiles ? JSON.parse(savedFiles) : []
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>("name-ascending");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Map<string, boolean>>(initialExpandedNodes);
  const [displayedFiles, setDisplayedFiles] = useState<Omit<FileData, 'content'>[]>([]);
  const [processingStatus, setProcessingStatus] = useState({
    status: "idle",
    message: "",
  } as {
    status: "idle" | "processing" | "complete" | "error";
    message: string;
  });

  const [userInstructions, setUserInstructions] = useState("");
  const [fileTreeSortOrder, setFileTreeSortOrder] = useState<SortOrder>("name-ascending");

  // Centralized state for ignore patterns
  const [globalPatternsState, setGlobalPatternsState] = useState<IgnorePatternsState>({
    patterns: '',
    excludedSystemPatterns: []
  });
  const [localIgnorePatterns, setLocalPatterns] = useState<IgnorePatternsState>({ patterns: '', excludedSystemPatterns: [] }); // Local doesn't have excluded system patterns
  const [systemIgnorePatterns, setSystemIgnorePatterns] = useState<string[]>(DEFAULT_SYSTEM_PATTERNS);

  const [outputFormat, setOutputFormat] = useState<OutputFormatType>(() => {
    const saved = localStorage.getItem(OUTPUT_FORMAT_STORAGE_KEY);
    return (saved as OutputFormatType) || 'xml';
  });

  const isElectron = window.electron !== undefined;

  // Add state for displayed token count after processing
  const [displayedTokenCount, setDisplayedTokenCount] = useState<number>(0);
  const [isCommentRemovalEnabled, setIsCommentRemovalEnabled] = useState<boolean>(false); // Add state for comment removal
  
  // New state variables for enhanced compression controls
  const [keepDocstrings, setKeepDocstrings] = useState<boolean>(true); // Default: true
  const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(false); // Default: false
  const [neverCompressPatternsRaw, setNeverCompressPatternsRaw] = useState<string>(''); // Raw string input
  const [neverCompressPatterns, setNeverCompressPatterns] = useState<string[]>([]); // Parsed array
  const [minCompressTokenThreshold, setMinCompressTokenThreshold] = useState<number>(100); // Default: 100

  // Parse raw patterns into array when the raw string changes
  useEffect(() => {
    const patterns = neverCompressPatternsRaw.split('\n').map(p => p.trim()).filter(p => p !== '');
    setNeverCompressPatterns(patterns);
  }, [neverCompressPatternsRaw]);

  // Add state for model loading
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  const [initialModelLoadComplete, setInitialModelLoadComplete] = useState<boolean>(false);

  // --- Fetch Models Effect ---
  useEffect(() => {
    // Skip if already completed initial load
    if (initialModelLoadComplete) return;
    
    const loadModels = async () => {
      console.log("Attempting to fetch models...");
      setIsLoadingModels(true);
      
      try {
        const fetchedModels = await fetchModels();
        const modelsToUse = (fetchedModels as ModelInfo[] | null) || []; // Ensure we have an array
        
        // Create fallback models if fetchedModels is empty
        const fallbackModels = [
          { id: "openai/gpt-4o", name: "GPT-4o (Fallback)", context_length: 128000 },
          { id: "anthropic/claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet (Fallback)", context_length: 200000 }
        ];
        
        // If no models fetched, use fallback models
        const finalModels = modelsToUse.length > 0 ? modelsToUse : fallbackModels;
        setAvailableModels(finalModels);

        const savedModelId = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL_ID);
        
        // Determine initial model
        if (finalModels.length > 0) {
          const validModelIds = finalModels.map(m => m.id);
          let initialModelId: string | null = null;
          
          if (savedModelId && validModelIds.includes(savedModelId)) {
            initialModelId = savedModelId; // Keep saved ID if valid
          } else {
            initialModelId = finalModels[0].id; // Default to first model
          }
          
          // Set the selected model ID
          setSelectedModelId(initialModelId);
          console.log(`Initial model ID set to: ${initialModelId}`);
          
          // Find the model and set context length
          const initialModel = finalModels.find(m => m.id === initialModelId);
          if (initialModel) {
            setSelectedContextLength(initialModel.context_length);
            console.log(`Initial context length set to: ${initialModel.context_length}`);
          } else {
            console.error("Could not find selected model to set context length.");
            // Use a reasonable default
            setSelectedContextLength(128000);
          }
        }
      } catch (error) {
        console.error("Error loading models:", error);
      } finally {
        setIsLoadingModels(false);
        setInitialModelLoadComplete(true);
      }
    };

    if (isElectron) {
      loadModels();
    } else {
      // Handle non-electron case
      const fallbackModels = [
        { id: "openai/gpt-4o", name: "GPT-4o (Fallback)", context_length: 128000 },
        { id: "anthropic/claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet (Fallback)", context_length: 200000 }
      ];
      setAvailableModels(fallbackModels);
      
      const savedModelId = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL_ID);
      
      // Use saved model ID or default to first
      const initialModelId = savedModelId && fallbackModels.some(m => m.id === savedModelId) 
        ? savedModelId 
        : fallbackModels[0].id;
      
      setSelectedModelId(initialModelId);
      
      // Set context length from the selected model
      const initialModel = fallbackModels.find(m => m.id === initialModelId);
      setSelectedContextLength(initialModel?.context_length || 128000);
      console.log(`Initial model ID (non-electron): ${initialModelId}, Context: ${initialModel?.context_length ?? 'null'}`);
      
      // Mark as complete for non-electron case too
      setInitialModelLoadComplete(true);
    }
  // Only depend on isElectron since we want this to run just once at startup
  }, [isElectron, initialModelLoadComplete]);

  // Note on model persistence strategy:
  // 1. Models are loaded at startup from API or fallbacks
  // 2. Initial model selection reads from localStorage and is validated against available models
  // 3. Persistence happens directly in the handleModelChange function, not via a separate effect
  // This approach prevents feedback loops between state updates and localStorage

  // Define applyFiltersAndSort early to avoid reference issues
  const applyFiltersAndSort = useCallback((files: Omit<FileData, 'content'>[], sort: SortOrder, filter: string) => {
    let filtered = files;
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      filtered = files.filter(file =>
        file.name.toLowerCase().includes(lowerFilter) ||
        file.path.toLowerCase().includes(lowerFilter)
      );
    }

    const [sortKey, sortDir] = sort.split("-");

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      // Moved declarations outside switch
      const aTokens = typeof a.tokenCount === 'number' ? a.tokenCount : 0;
      const bTokens = typeof b.tokenCount === 'number' ? b.tokenCount : 0;
      const aDate = a.lastModified || 0;
      const bDate = b.lastModified || 0;

      switch (sortKey) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "tokens":
          comparison = aTokens - bTokens;
          break;
        case "date":
          comparison = Number(aDate) - Number(bDate);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      return sortDir === "ascending" ? comparison : -comparison;
    });

    setDisplayedFiles(sorted);
  }, []);
  
  // Re-run applyFiltersAndSort when relevant state changes
  useEffect(() => {
    applyFiltersAndSort(allFiles, sortOrder, searchTerm);
  }, [allFiles, sortOrder, searchTerm, applyFiltersAndSort]); 

  // --- Persist State Effects ---
  useEffect(() => {
    if (selectedFolder) localStorage.setItem(STORAGE_KEYS.SELECTED_FOLDER, selectedFolder);
    else localStorage.removeItem(STORAGE_KEYS.SELECTED_FOLDER);
  }, [selectedFolder]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_FILES, JSON.stringify(selectedFiles));
  }, [selectedFiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SORT_ORDER, sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEARCH_TERM, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPANDED_NODES, JSON.stringify(Array.from(expandedNodes.entries())));
    } catch (error) {
      console.error("Error saving expanded nodes:", error);
    }
  }, [expandedNodes]);

  useEffect(() => {
    localStorage.setItem('pastemax-show-instructions', String(showUserInstructions));
  }, [showUserInstructions]);

  // Persist global ignore patterns state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GLOBAL_IGNORE_PATTERNS, JSON.stringify(globalPatternsState));
  }, [globalPatternsState]);

  useEffect(() => {
    localStorage.setItem(OUTPUT_FORMAT_STORAGE_KEY, outputFormat);
  }, [outputFormat]);

  // --- IPC Listeners ---

  // Load initial data from saved folder
  useEffect(() => {
    if (!isElectron || !selectedFolder) return;
    
    console.log("Loading saved folder on startup:", selectedFolder);
    setProcessingStatus({ status: "processing", message: "Loading files..." });
    
    // Add debug logging to trace the request
    console.log("Requesting file list with send method");
    
    // Either use the dedicated method or the generic send
    if (window.electron.requestFileList) {
      window.electron.requestFileList({ path: selectedFolder });
    } else {
      window.electron.send("request-file-list", selectedFolder);
    }
    
  }, [isElectron, selectedFolder]); // Keep dependency

  // Listen for folder selection and file list data
  useEffect(() => {
    if (!isElectron) return;

    const handleFolderSelected = (folderPath: string) => {
      if (typeof folderPath === "string") {
        console.log("Folder selected:", folderPath);
        setSelectedFolder(folderPath);
        // Reset selection and patterns when folder changes
        setSelectedFiles([]);
        setLocalPatterns({ patterns: '', excludedSystemPatterns: [] });
        setProcessingStatus({ status: "processing", message: "Loading files..." });
        // Use specific method if available, or generic send
        window.electron.send("request-file-list", folderPath);
      }
    };

    const handleFileListData = (filesMetadata: Omit<FileData, 'content'>[]) => {
      console.log(`Received metadata for ${filesMetadata.length} files`);
      
      // Add detailed logging for diagnostics
      if (filesMetadata.length > 0) {
        console.log("Sample files received:");
        filesMetadata.slice(0, Math.min(5, filesMetadata.length)).forEach(file => {
          console.log(`- ${file.name} (${file.path}) ${file.excluded ? '[EXCLUDED]' : ''}`);
        });
        
        // Count excluded files
        const excludedCount = filesMetadata.filter(f => f.excluded).length;
        if (excludedCount > 0) {
          console.log(`Warning: ${excludedCount} files are excluded by patterns!`);
        }
      } else {
        console.warn("No files received from main process!");
      }
      
      setAllFiles(filesMetadata);
      applyFiltersAndSort(filesMetadata, sortOrder, searchTerm);  
      setProcessingStatus({ status: "complete", message: `Loaded ${filesMetadata.length} files` });
    };

    const handleProcessingStatus = (status: { status: "idle" | "processing" | "complete" | "error"; message: string; }) => {
      setProcessingStatus(status);
    };

    const handleIgnorePatternsLoaded = (result: { patterns: string; isGlobal: boolean; systemPatterns?: string[]; folderPath?: string }) => {
      console.log(`Ignore patterns loaded (global: ${result.isGlobal})`);
      
      if (result.systemPatterns) {
        setSystemIgnorePatterns(result.systemPatterns);
      }
      
      const parsedPatterns = parseIgnorePatternsContent(result.patterns);
      
      if (result.isGlobal) {
        setGlobalPatternsState({
          patterns: parsedPatterns.userPatterns,
          excludedSystemPatterns: parsedPatterns.excludedPatterns
        });
      } else if (result.folderPath && selectedFolder && arePathsEqual(result.folderPath, selectedFolder)) {
        setLocalPatterns({
          patterns: parsedPatterns.userPatterns,
          excludedSystemPatterns: parsedPatterns.excludedPatterns
        });
      }
    };

    // Setup IPC listeners using the exposed 'receive' method
    window.electron.receive("folder-selected", handleFolderSelected);
    window.electron.receive("file-list-data", handleFileListData);
    window.electron.receive("file-processing-status", handleProcessingStatus);
    window.electron.receive("ignore-patterns-loaded", handleIgnorePatternsLoaded);

    // Cleanup function should use removeListener if it exists on the exposed API
    // Assuming removeListener was exposed for symmetry with 'on'/'receive'
    // If not, this cleanup might need adjustment based on preload.js structure
    return () => {
      // Check if ipcRenderer and removeListener method exist before calling
      if (window.electron.ipcRenderer?.removeListener) {
        window.electron.ipcRenderer.removeListener("folder-selected", handleFolderSelected);
        window.electron.ipcRenderer.removeListener("file-list-data", handleFileListData);
        window.electron.ipcRenderer.removeListener("file-processing-status", handleProcessingStatus);
        window.electron.ipcRenderer.removeListener("ignore-patterns-loaded", handleIgnorePatternsLoaded);
      } else {
        console.warn("Cleanup: ipcRenderer.removeListener not found on window.electron");
        // Alternative cleanup if needed, e.g., calling ipcRenderer.removeAllListeners(channel)
      }
    };
  }, [isElectron, applyFiltersAndSort, sortOrder, searchTerm, selectedFolder]); // Dependencies

  // Add ESC key handler
  const handleEscKey = useCallback((e: KeyboardEvent) => {
      if (e.key === 'Escape' && processingStatus.status === 'processing') {
        console.log("Escape key pressed, cancelling directory loading...");
        // Use specific method if available, or generic send
        window.electron.send("cancel-directory-loading");
      }
    }, [processingStatus.status]);

  useEffect(() => {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }, [handleEscKey]);
    
  // Add file change detection handler
  useEffect(() => {
    if (!isElectron || !selectedFolder) return;
    
    console.log("Setting up file change listener");
    
    const handleFileChanged = (data: { type: 'add' | 'change' | 'delete', path: string }) => {
      // Immediately normalize the path to match allFiles format
      const { type, path } = data;
      const normalizedPath = normalizePath(path);
      console.log(`File ${type} event detected: ${normalizedPath}`);
      
      if (type === 'add') {
        // Fetch metadata for the new file and add it to allFiles
        window.electron.getFileMetadata(normalizedPath).then((result: any) => {
          if (result.success && result.fileData) {
            console.log("Adding new file to allFiles:", result.fileData.path);
            // Use functional update to get the latest state
            setAllFiles(prev => {
              const updatedFiles = [...prev, result.fileData];
              // Call applyFiltersAndSort with the new array to update displayedFiles
              applyFiltersAndSort(updatedFiles, sortOrder, searchTerm);
              return updatedFiles;
            });
          }
        });
      } 
      else if (type === 'change') {
        // Update existing file's metadata
        window.electron.getFileMetadata(normalizedPath).then((result: any) => {
          if (result.success && result.fileData) {
            console.log("Updating file in allFiles:", result.fileData.path);
            setAllFiles(prev => {
              const updatedFiles = prev.map(file => 
                arePathsEqual(file.path, normalizedPath) ? result.fileData : file
              );
              applyFiltersAndSort(updatedFiles, sortOrder, searchTerm);
              return updatedFiles;
            });
          }
        });
      } 
      else if (type === 'delete') {
        // Remove file from allFiles and selectedFiles
        console.log("Removing file from allFiles:", normalizedPath);
        
        // Use functional update for all state setters relying on previous state
        setAllFiles(prevAllFiles => {
          const updatedAllFiles = prevAllFiles.filter(file => !arePathsEqual(file.path, normalizedPath));
          // Call applyFiltersAndSort with the updated array
          applyFiltersAndSort(updatedAllFiles, sortOrder, searchTerm);
          return updatedAllFiles;
        });
        
        setSelectedFiles(prevSelectedFiles => 
          prevSelectedFiles.filter(filePath => !arePathsEqual(filePath, normalizedPath))
        );
      }
    };
    
    // Use the receive method to listen for file-changed events
    window.electron.receive("file-changed", handleFileChanged);
    
    // Cleanup listener when component unmounts
    return () => {
      // Check if ipcRenderer and removeListener method exist before calling
      if (window.electron.ipcRenderer?.removeListener) {
        window.electron.ipcRenderer.removeListener("file-changed", handleFileChanged);
      }
    };
  // Reduce dependencies to prevent unnecessary re-subscriptions
  }, [isElectron, selectedFolder, applyFiltersAndSort, sortOrder, searchTerm]);

  // --- Core Functions ---

  const openFolder = async () => { // Make async
    if (isElectron) {
      console.log("Requesting to open folder dialog via IPC invoke...");
      try {
        // Use the specific invoke method
        const folderPath = await window.electron.openFolder();
        if (folderPath) {
          console.log("Folder selected via dialog:", folderPath);
          
          // Clear all relevant state
          setAllFiles([]);
          setDisplayedFiles([]);
          setSelectedFiles([]);
          setExpandedNodes(new Map());
          setLocalPatterns({ patterns: '', excludedSystemPatterns: [] });
          
          // Set processing status first
          setProcessingStatus({ status: "processing", message: "Loading files..." });
          
          // Then set the selected folder
          setSelectedFolder(folderPath);
          
          // Request file list for the newly selected folder
          console.log("Requesting file list for:", folderPath);
          if (window.electron.requestFileList) {
            window.electron.requestFileList({ path: folderPath });
          } else {
            window.electron.send("request-file-list", folderPath);
          }
        } else {
          console.log("Folder selection cancelled.");
        }
      } catch (error) {
        console.error("Error opening folder dialog via IPC:", error);
         setProcessingStatus({ status: "error", message: `Error opening folder: ${error instanceof Error ? error.message : error}` });
      }
    }
  };

  // Toggle file selection
  const toggleFileSelection = useCallback((filePath: string) => {
    const normalizedPath = normalizePath(filePath);
    setSelectedFiles(prevSelected => {
      const isSelected = prevSelected.some(path => arePathsEqual(path, normalizedPath));
      return isSelected
        ? prevSelected.filter(path => !arePathsEqual(path, normalizedPath))
        : [...prevSelected, normalizedPath];
    });
  }, []); // Add empty dependency array

  // Select all non-excluded files
  const selectAllFiles = useCallback(() => {
    const filesToSelect = allFiles
      .filter(file => !file.isBinary && !file.isSkipped && !file.excluded)
      .map(file => file.path);
    setSelectedFiles(filesToSelect); // Directly set, no need to merge if it's 'select all'
  }, [allFiles]);

  // Deselect all files
  const deselectAllFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  // Toggle folder selection
  const toggleFolderSelection = useCallback((folderPath: string, shouldBeSelected: boolean) => {
    if (!folderPath) return;
    const normalizedFolderPath = normalizePath(folderPath);

    setSelectedFiles(prev => {
      const newSelectionSet = new Set(prev);
      allFiles.forEach(file => {
        const normalizedFilePath = normalizePath(file.path);
        // Check if file is within the target folder (or is the folder itself if files represent folders)
        if (normalizedFilePath.startsWith(normalizedFolderPath + '/') || normalizedFilePath === normalizedFolderPath) {
           // Only modify selection for non-binary, non-skipped, non-excluded files
           if (!file.isBinary && !file.isSkipped && !file.excluded) {
                if (shouldBeSelected) {
                    newSelectionSet.add(file.path);
                } else {
                    newSelectionSet.delete(file.path);
                }
           }
        }
      });
      return Array.from(newSelectionSet);
    });
  }, [allFiles]); // Depends on allFiles

  // Handle sort change
  const handleSortChange = useCallback((value: string | string[]) => {
    if (typeof value === 'string') {
      setSortOrder(value as SortOrder);
      // applyFiltersAndSort will be triggered by the useEffect watching sortOrder
    }
  }, []); // Add empty dependency array

  // Handle search change
  const handleSearchChange = useCallback((newSearch: string) => {
    setSearchTerm(newSearch);
     // applyFiltersAndSort will be triggered by the useEffect watching searchTerm
  }, []); // Add empty dependency array

  // Calculate total tokens (Memoized)
  const totalTokens = useMemo(() => { // Renamed to avoid conflict
    const fileMap = new Map(allFiles.map(f => [f.path, f.tokenCount]));
    return selectedFiles.reduce((total, path) => {
      return total + (fileMap.get(path) || 0);
    }, 0);
  }, [selectedFiles, allFiles]);

  // Calculate total token count for selected files
  const totalTokenCount = useMemo(() => {
    // If no folder is selected, or file list/selection is empty, count is 0
    if (!selectedFolder || !allFiles || allFiles.length === 0 || selectedFiles.length === 0) {
      return 0;
    }
    // Create a set of normalized selected file paths for efficient lookup
    const selectedFileSet = new Set(selectedFiles.map(normalizePath));

    // Sum token counts of files whose normalized path is in the selected set
    return allFiles.reduce((sum, file) => {
      if (selectedFileSet.has(normalizePath(file.path))) {
        // Use tokenCount if it's a valid number, otherwise default to 0
        return sum + (typeof file.tokenCount === 'number' ? file.tokenCount : 0);
      }
      return sum;
    }, 0);
  }, [selectedFiles, allFiles, selectedFolder]); // Recalculate when selection, file list, or folder changes

  // Calculate UNCOMPRESSED total token count for selected files (for initial display before processing)
  const uncompressedTotalTokenCount = useMemo(() => {
    if (!selectedFolder || !allFiles || allFiles.length === 0 || selectedFiles.length === 0) return 0;
    const selectedFileSet = new Set(selectedFiles.map(normalizePath));
    return allFiles.reduce((sum, file) => {
      if (selectedFileSet.has(normalizePath(file.path))) {
        // Use uncompressedTokenCount for this initial calculation
        return sum + (typeof file.uncompressedTokenCount === 'number' ? file.uncompressedTokenCount : 0);
      }
      return sum;
    }, 0);
  }, [selectedFiles, allFiles, selectedFolder]);

  // Update displayed count whenever uncompressed count changes (or after compression)
  useEffect(() => {
    setDisplayedTokenCount(uncompressedTotalTokenCount);
    // This will be updated again within getSelectedFilesContent if compression runs
  }, [uncompressedTotalTokenCount]);

  // --- Moved reloadFolder definition earlier ---
  const reloadFolder = useCallback(() => {
    if (isElectron && selectedFolder) {
      console.log(`Reloading folder: ${selectedFolder}`);
      setProcessingStatus({ status: "processing", message: "Reloading files..." });
      setAllFiles([]); // Clear current files
      setDisplayedFiles([]);
      // Optionally reset local patterns state if desired on manual reload
      // setLocalPatterns({ patterns: '', excludedSystemPatterns: [] });
      // Use specific method if available, or generic send
      if (window.electron.requestFileList) {
        window.electron.requestFileList({ path: selectedFolder, forceRefresh: true });
      } else {
        window.electron.send("reload-file-list", selectedFolder);
      }
    }
  }, [isElectron, selectedFolder]); // Now defined before other callbacks

  // Helper to get language identifier for compression function
  const getLanguageFromPath = (filePath: string): string | null => {
    // Extract extension in a browser-safe way
    const lastDotIndex = filePath.lastIndexOf('.');
    const extension = lastDotIndex !== -1 ? filePath.slice(lastDotIndex + 1).toLowerCase() : '';
    
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
      // Add other mappings as needed
      default:
        return null; // Unsupported extension for compression
    }
  };

  // Function to dynamically compress files if needed
  const applyDynamicCompression = useCallback(async (
    filesToProcess: FileData[],
    targetTokenLimit: number,
    // Add flag for comment removal
    removeCommentsFlag: boolean,
    // Add flag for preserving docstrings
    keepDocstringsFlag: boolean = true,
    // Add new parameters
    neverCompressPatterns: string[] = [],
    minCompressTokenThreshold: number = 100,
    // Add flag for removing empty lines
    removeEmptyLinesFlag: boolean = false
  ): Promise<{ processedFiles: FileData[], finalTokenCount: number }> => {

    if (!isElectron) {
      console.warn("Compression skipped: Not running in Electron environment.");
       const initialTokenCount = filesToProcess.reduce((sum, file) => sum + (file.uncompressedTokenCount || 0), 0);
      return { processedFiles: filesToProcess, finalTokenCount: initialTokenCount };
    }

    setProcessingStatus({ status: 'processing', message: 'Analyzing files...' });

    const mutableFiles: FileData[] = filesToProcess.map(f => ({
        ...f,
        uncompressedTokenCount: f.uncompressedTokenCount ?? f.tokenCount ?? 0,
        isCompressed: false, // Reset to false - we'll determine this during processing
        tokenCount: f.uncompressedTokenCount ?? f.tokenCount ?? 0, // Start with original token count
        content: undefined // Start with undefined content, fetch as needed
    }));

    // Calculate initial total token count for comparison
    let currentTotalTokens = mutableFiles.reduce(
      (sum, file) => sum + (file.tokenCount || 0), 
      0
    );
    console.log(`Initial token count: ${currentTotalTokens}, Target: ${targetTokenLimit}`);

    // --- Step 1: Remove Comments (if enabled) --- PRE-COMPRESSION TOKEN COUNT
    if (removeCommentsFlag) {
      console.log("Attempting comment removal...");
      setProcessingStatus({ status: 'processing', message: 'Removing comments...' });
      let commentsRemovedCount = 0;
      // Use Promise.all for potentially faster parallel processing
      await Promise.all(mutableFiles.map(async (file) => {
        const language = getLanguageFromFilename(file.name);
        if (!language) return; // Skip unsupported

        try {
           let currentContent = file.content;
           // Fetch content if needed
           if (currentContent === undefined) {
             console.log(`Fetching content for comment removal: ${file.path}`);
             const result = await window.electron.getFileContent(file.path);
             
             if (!result || !result.success) {
               const error = result?.error || 'Unknown error';
               console.error(`Failed to get content for ${file.path}: ${error}`);
               file.content = `// Error fetching content: ${error}`;
               return;
             }
             
             currentContent = result.content;
           }

           if (typeof currentContent !== 'string') {
             console.warn(`Content for ${file.path} is not a string, skipping comment removal.`);
             return;
           }

           const contentWithoutComments = await removeComments(currentContent, language, keepDocstringsFlag);

           if (contentWithoutComments !== null && contentWithoutComments !== currentContent) {
             commentsRemovedCount++;
             // Recalculate token count *after* comment removal
             const newTokenCount = await window.electron.countTokens(contentWithoutComments);
             // *** IMPORTANT: Store content and updated token count NOW ***
             file.content = contentWithoutComments; 
             file.tokenCount = typeof newTokenCount === 'number' ? newTokenCount : (file.uncompressedTokenCount ?? 0);
             console.log(`Comments removed from ${file.name}. New token count: ${file.tokenCount}`);
           } else {
              // If no comments removed, ensure token count is original uncompressed
              file.tokenCount = file.uncompressedTokenCount ?? 0;
              // If we've already loaded the content, preserve it
              if (currentContent !== undefined) {
                file.content = currentContent;
              }
           }
        } catch (error) {
           console.error(`Error during comment removal for ${file.path}:`, error);
           // Check if error is an instance of Error before accessing message
           const errorMessage = error instanceof Error ? error.message : 'Unknown error';
           file.content = `// Error removing comments: ${errorMessage}`;
        }
      }));

      // Recalculate total token count after comment removal
      currentTotalTokens = mutableFiles.reduce((sum, file) => sum + (file.tokenCount || 0), 0);
      console.log(`Token count after comment removal: ${currentTotalTokens}`);
    }

    // Check if we need compression - only compress if we exceed the target token limit
    // This is the adaptive part - we'll only compress if needed
    const needsBodyCompression = currentTotalTokens > targetTokenLimit;
    
    if (!needsBodyCompression) {
      console.log("Token count is within limit, no body compression needed.");
      setProcessingStatus({ status: 'idle', message: '' });
      // Need to ensure content is fetched if not already present (e.g., comment removal ran but no body compression needed)
      await Promise.all(mutableFiles.map(async (file) => {
          if (file.content === undefined) {
              try {
                  console.log(`Fetching content (final pass): ${file.path}`);
                  const result = await window.electron.getFileContent(file.path);
                  
                  if (!result || !result.success) {
                    const error = result?.error || 'Unknown error';
                    console.error(`Failed to get content for ${file.path}: ${error}`);
                    file.content = `// Error fetching content: ${error}`;
                  } else {
                    file.content = result.content;
                    // Use uncompressed count here as body compression didn't run
                    file.tokenCount = file.uncompressedTokenCount ?? 0;
                  }
                  
              } catch (e) { 
                  console.error(`Error fetching content for ${file.path}:`, e);
                  // Check if e is an instance of Error before accessing message
                  const errorMessage = e instanceof Error ? e.message : 'Unknown error';
                  file.content = `// Error fetching content: ${errorMessage}`; 
                  file.tokenCount = 0; 
              }
          }
      }));
      return { processedFiles: mutableFiles, finalTokenCount: currentTotalTokens };
    }

    // --- Body Compression Loop --- 
    // Only execute this if we actually need compression (token count exceeds limit)
    console.log("Token count exceeds limit, starting body compression...");
    setProcessingStatus({ status: 'processing', message: 'Compressing function bodies...' });
    
    // Helper function to check if a file path matches any of the patterns
    const matchesAnyPattern = (path: string, patterns: string[]): boolean => {
      if (patterns.length === 0) return false;
      
      // Normalize the path to use forward slashes for consistent matching
      const normalizedPath = path.replace(/\\/g, '/');
      
      // Get the filename for simpler patterns like *.py
      const fileName = normalizedPath.split('/').pop() || '';
      
      return patterns.some(pattern => {
        // Skip empty patterns
        if (!pattern.trim()) return false;
        
        // Normalize the pattern too
        const normalizedPattern = pattern.trim().replace(/\\/g, '/');
        
        // Simple glob matching for common patterns
        // Convert glob pattern to regex
        const regexPattern = normalizedPattern
          .replace(/\./g, '\\.')   // Escape dots
          .replace(/\*\*/g, '.*')  // ** becomes .* (match anything, including slashes)
          .replace(/\*/g, '[^/]*') // * becomes [^/]* (match anything except slashes)
          .replace(/\?/g, '[^/]')  // ? becomes [^/] (match single character, not slash)
          .replace(/\[!\]/g, '[^]'); // [!] becomes [^]
        
        // For simple filename patterns (no slash), match against the filename only
        if (!normalizedPattern.includes('/') && !normalizedPattern.includes('\\')) {
          return new RegExp(`^${regexPattern}$`).test(fileName);
        }
        
        // For full path patterns, match against the full path
        return new RegExp(`^${regexPattern}$`).test(normalizedPath);
      });
    };

    // Filter files based on compression rules
    const filesToCompress = [...mutableFiles]
      .filter(file => {
        // Skip already compressed files
        if (file.isCompressed) return false;
        
        // Skip files with too few tokens
        if ((file.tokenCount || 0) < minCompressTokenThreshold) {
          console.log(`Skipping ${file.name}: below token threshold (${file.tokenCount} < ${minCompressTokenThreshold})`);
          return false;
        }
        
        // Skip files matching any of the never compress patterns
        if (matchesAnyPattern(file.path, neverCompressPatterns)) {
          console.log(`Skipping ${file.name}: matches never compress pattern`);
          return false;
        }
        
        return true;
      })
      .sort((a, b) => (b.tokenCount || 0) - (a.tokenCount || 0));
    
    let filesCompressedCount = 0;
    
    for (const fileToCompress of filesToCompress) {
      if (currentTotalTokens <= targetTokenLimit) {
        console.log("Target token limit reached, stopping compression.");
        break;
      }
      
      setProcessingStatus({ 
        status: 'processing', 
        message: `Compressing: ${fileToCompress.name} (${filesCompressedCount + 1}/${filesToCompress.length})` 
      });
      
      const language = getLanguageFromFilename(fileToCompress.name);
      if (!language) {
        console.log(`Skipping body compression for unsupported file type: ${fileToCompress.name}`);
        fileToCompress.isCompressed = true; // Mark as processed even if unsupported
        continue;
      }
      
      try {
        let contentToCompress = fileToCompress.content;
        // Fetch content ONLY if it wasn't fetched during comment removal
        if (contentToCompress === undefined) {
          console.log(`Fetching content for body compression: ${fileToCompress.path}`);
          const result = await window.electron.getFileContent(fileToCompress.path);
          
          if (!result || !result.success) {
            const error = result?.error || 'Unknown error';
            console.error(`Failed to get content for ${fileToCompress.path}: ${error}`);
            fileToCompress.content = `// Error fetching content: ${error}`;
            fileToCompress.isCompressed = true; // Mark as processed
            continue;
          }
          
          contentToCompress = result.content;
        }
        
        if (typeof contentToCompress !== 'string') {
          console.warn(`Could not get valid content for ${fileToCompress.path}, skipping body compression.`);
          fileToCompress.isCompressed = true; // Mark as processed
          continue;
        }
        
        const compressedSource = await compressCode(contentToCompress, language);
        
        if (compressedSource !== null && compressedSource !== contentToCompress) {
          console.log(`Recalculating tokens for body-compressed ${fileToCompress.name}`);
          const newCompressedTokenCount = await window.electron.countTokens(compressedSource);
          
          if (typeof newCompressedTokenCount === 'number') {
            const reduction = (fileToCompress.tokenCount || 0) - newCompressedTokenCount;
            console.log(`Body-compressed ${fileToCompress.name}. Token reduction: ${reduction}`);
            fileToCompress.content = compressedSource;
            fileToCompress.tokenCount = newCompressedTokenCount;
            fileToCompress.isCompressed = true;
            filesCompressedCount++;
            
            // Recalculate total immediately to check if we've reached target
            currentTotalTokens = mutableFiles.reduce((sum, file) => sum + (file.tokenCount || 0), 0);
            // Update displayed token count in real-time
            setDisplayedTokenCount(currentTotalTokens);
          } else {
            console.warn(`Failed to recalculate tokens for body-compressed ${fileToCompress.name}`);
          }
        } else {
          console.log(`Body compression skipped or ineffective for ${fileToCompress.name}`);
        }
        
        fileToCompress.isCompressed = true; // Mark as processed even if ineffective
        
      } catch (error) {
        console.error(`Error during body compression for ${fileToCompress.path}:`, error);
        // Check if error is an instance of Error before accessing message
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        fileToCompress.content = `// Error compressing code: ${errorMessage}`;
        fileToCompress.isCompressed = true; // Mark as processed
      }
    }

    console.log(`Compression complete. Final token count: ${currentTotalTokens}`);
    console.log(`Compressed ${filesCompressedCount} files.`);
    setProcessingStatus({ 
      status: 'complete', 
      message: `Compression finished. ${filesCompressedCount} files compressed.` 
    });
    setTimeout(() => setProcessingStatus({ status: 'idle', message: '' }), 2000);

    // --- Final Step: Remove Empty Lines if enabled ---
    if (removeEmptyLinesFlag) {
      console.log("Removing empty lines from files...");
      let emptyLinesRemovedCount = 0;
      
      // Process each file to remove empty lines
      for (const file of mutableFiles) {
        if (file.content !== undefined && typeof file.content === 'string') {
          // Regex to match empty lines or lines with only whitespace
          const originalContent = file.content;
          file.content = file.content.replace(/^\s*$(?:\r\n?|\n)/gm, '');
          
          if (file.content !== originalContent) {
            emptyLinesRemovedCount++;
            console.log(`Removed empty lines from ${file.name}`);
          }
        }
      }
      
      console.log(`Empty lines removed from ${emptyLinesRemovedCount} files.`);
    }

    // Final update of the token count
    currentTotalTokens = mutableFiles.reduce((sum, file) => sum + (file.tokenCount || 0), 0);
    
    return { processedFiles: mutableFiles, finalTokenCount: currentTotalTokens };
  }, [
    isElectron,
    setProcessingStatus,
    setDisplayedTokenCount,
  ]);

  // Get selected files content and apply formatting/compression
  const getSelectedFilesContent = useCallback(async (): Promise<string> => {
    if (selectedFiles.length === 0) {
       setDisplayedTokenCount(0); // Reset displayed count
      return "No files selected.";
    }

    setProcessingStatus({ status: 'processing', message: `Preparing ${selectedFiles.length} files...` });

    try {
      const selectedFileSet = new Set(selectedFiles.map(normalizePath));
      const filesToProcess: FileData[] = allFiles.filter(file =>
        selectedFileSet.has(normalizePath(file.path)) && !file.isBinary && !file.isSkipped
      ).map(f => ({ // Ensure we map to the full FileData structure if allFiles is Omit<..., 'content'>
          ...f,
          content: undefined, // Start with undefined content
          isCompressed: false, // Reset compression state
          tokenCount: f.tokenCount ?? 0,
          uncompressedTokenCount: f.uncompressedTokenCount ?? f.tokenCount ?? 0
      }));

      let finalTokenCount = filesToProcess.reduce((sum, file) => sum + (file.tokenCount || 0), 0);
      let processedFilesForOutput: FileData[] = filesToProcess; // Start with the initial selection, now typed as FileData[]

      // --- Apply Comment Removal & Compression if Enabled --- //
      if (isCompressionEnabled || isCommentRemovalEnabled) {
         const targetLimit = selectedContextLength ? Math.floor(selectedContextLength * 0.95) : Infinity;

         // Pass all parameters to the processing function
         const processingResult = await applyDynamicCompression(
            filesToProcess,
            targetLimit,
            isCommentRemovalEnabled, // Pass comment removal flag
            keepDocstrings, // Pass keepDocstrings flag
            neverCompressPatterns, // Pass the never compress patterns (array)
            minCompressTokenThreshold, // Pass the min tokens threshold
            removeEmptyLines // Pass the removeEmptyLines flag
          );

         processedFilesForOutput = processingResult.processedFiles;
         finalTokenCount = processingResult.finalTokenCount;

         // Update the displayed token count immediately
         setDisplayedTokenCount(finalTokenCount);
      } else {
         // If processing is disabled, calculate and display the uncompressed total
         finalTokenCount = filesToProcess.reduce((sum, file) => sum + (file.uncompressedTokenCount || 0), 0);
         setDisplayedTokenCount(finalTokenCount);
         // Fetch content if processing was skipped
         await Promise.all(processedFilesForOutput.map(async (file) => {
             if (file.content === undefined) {
                 try {
                     console.log(`Fetching content (no compression): ${file.path}`);
                     const result = await window.electron.getFileContent(file.path);
                     
                     if (!result || !result.success) {
                         const error = result?.error || 'Unknown error';
                         console.error(`Failed to get content for ${file.path}: ${error}`);
                         file.content = `// Error fetching content: ${error}`;
                     } else {
                         file.content = result.content;
                     }
                 } catch (e) { 
                     console.error(`Error fetching content for ${file.path}:`, e);
                     // Check if e is an instance of Error before accessing message
                     const errorMessage = e instanceof Error ? e.message : 'Unknown error';
                     file.content = `// Error fetching content: ${errorMessage}`; 
                 }
             }
         }));
      }

      // --- Sort the richer FileData array BEFORE extracting content --- //
      const sortedProcessedFiles = [...processedFilesForOutput].sort((a, b) => {
          const [sortKey, sortDir] = sortOrder.split("-");
          let comparison = 0;
          // Use properties directly from FileData
          const aTokens = a.tokenCount ?? 0;
          const bTokens = b.tokenCount ?? 0;
          const aDate = a.lastModified ?? 0;
          const bDate = b.lastModified ?? 0;

          switch (sortKey) {
            case "name": comparison = a.name.localeCompare(b.name); break;
            case "tokens": comparison = aTokens - bTokens; break;
            case "date": comparison = Number(aDate) - Number(bDate); break;
            default: comparison = a.name.localeCompare(b.name);
          }
          return sortDir === "ascending" ? comparison : -comparison;
      });

      // --- Now create the simple FileContent array for formatters --- //
      const fileContents: FileContent[] = sortedProcessedFiles.map(file => ({
          path: file.path,
          content: file.content ?? '// Content unavailable',
          // No isCompressed, name, lastModified here as FileContent doesn't expect them
      }));

       // Generate file tree string if needed
       let fileTreeString = "";
       if (selectedFolder && fileTreeMode !== 'none') {
         // Corrected call to generateAsciiFileTree with 3 arguments
         // Pass only the path property from sortedProcessedFiles
         const pathsForTree = sortedProcessedFiles.map(f => ({ path: f.path }));
         fileTreeString = generateAsciiFileTree(pathsForTree, selectedFolder, fileTreeMode);
       }

      // Format the output based on the selected format
      let formattedOutput = "";
      // Corrected calls to formatters with 5 arguments
      switch (outputFormat) {
        case 'xml': formattedOutput = formatAsXML(fileContents, selectedFolder, fileTreeMode, fileTreeString, userInstructions); break;
        case 'markdown': formattedOutput = formatAsMarkdown(fileContents, selectedFolder, fileTreeMode, fileTreeString, userInstructions); break;
        case 'plain': default: formattedOutput = formatAsPlain(fileContents, selectedFolder, fileTreeMode, fileTreeString, userInstructions); break;
      }

      setProcessingStatus({ status: 'complete', message: 'Output generated successfully!' });
      setTimeout(() => setProcessingStatus({ status: 'idle', message: '' }), 2000);

      return formattedOutput;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error generating output:', error);
      setProcessingStatus({ status: 'error', message: `Error: ${errorMessage}` });
      return `// Error generating output: ${errorMessage}`;
    }
  }, [
    selectedFiles,
    allFiles,
    isCompressionEnabled,
    isCommentRemovalEnabled,
    keepDocstrings,
    selectedContextLength,
    applyDynamicCompression,
    sortOrder,
    outputFormat,
    selectedFolder,
    fileTreeMode,
    userInstructions,
    setProcessingStatus,
    setDisplayedTokenCount,
    neverCompressPatterns,
    minCompressTokenThreshold,
    removeEmptyLines
  ]);

  // Sort options
  const sortOptions = useMemo(() => [
    { value: "name-ascending", label: "Name (A-Z)" },
    { value: "name-descending", label: "Name (Z-A)" },
    { value: "tokens-ascending", label: "Tokens (Asc)" },
    { value: "tokens-descending", label: "Tokens (Desc)" },
    { value: "date-ascending", label: "Date (Oldest)" },
    { value: "date-descending", label: "Date (Newest)" }
  ], []);

  // Handle expand/collapse state changes
  const toggleExpanded = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newState = new Map(prev);
      newState.set(nodeId, !prev.get(nodeId)); // Simplified toggle
      // Persisted via useEffect watching expandedNodes
      return newState;
    });
  }, []); // Add empty dependency array

  // --- Ignore Pattern Functions ---

  // Load patterns (global or local)
  const loadIgnorePatterns = useCallback(async (folderPath: string, isGlobal: boolean = false): Promise<void> => {
    if (!isElectron) return;
    console.log(`Requesting load for ${isGlobal ? 'global' : 'local'} patterns${!isGlobal ? ` for ${folderPath}` : ''}`);
    try {
        // Invoke expects the handler to exist. The result is handled by the 'ignore-patterns-loaded' listener.
        await window.electron.loadIgnorePatterns({ folderPath, isGlobal });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error invoking load-ignore-patterns (${isGlobal ? 'global' : 'local'}): ${errorMessage}`);
        // Set default state on error
        if (isGlobal) {
            setGlobalPatternsState({ patterns: '', excludedSystemPatterns: [] });
            setSystemIgnorePatterns(DEFAULT_SYSTEM_PATTERNS);
        } else if (folderPath === selectedFolder) {
            setLocalPatterns({ patterns: '', excludedSystemPatterns: [] });
        }
    }
}, [isElectron, selectedFolder]); // Dependencies: isElectron, selectedFolder

  // Save patterns (global or local) - Now just calls IPC
  const saveIgnorePatterns = useCallback(async (patterns: string, isGlobal: boolean, folderPath?: string): Promise<void> => {
    if (!isElectron) return;
    const targetPath = folderPath || selectedFolder; // Use provided path or current folder for local
    if (!isGlobal && !targetPath) {
      console.error("Cannot save local patterns without a folder path.");
      setProcessingStatus({ status: "error", message: "No folder selected for local patterns." });
      return;
    }

    setProcessingStatus({ status: "processing", message: `Saving ${isGlobal ? "global" : "local"} patterns...` });

    try {
      // The string passed (`patterns`) should already include `# DISABLED:` comments
      // generated by IgnorePatterns.tsx's handleSaveGlobalPatterns
      const result = await window.electron.saveIgnorePatterns({
        patterns,
        isGlobal,
        folderPath: targetPath ?? undefined
      });

      if (result.success) {
        console.log(`IPC: Save ${isGlobal ? 'global' : 'local'} patterns successful.`);
        setProcessingStatus({ status: "complete", message: "Patterns saved." });

        // --- Update State --- 
        if (isGlobal) {
          // Assuming handleSaveGlobalPatterns in IgnorePatterns.tsx formats
          // the string with user patterns and # DISABLED lines.
          // We need to parse it back here if we want to store excluded separately.
          // Or, simplify App.tsx state to just store the raw string.
          // Let's parse it back for consistency:
          const { excludedPatterns, userPatterns } = parseIgnorePatternsContent(patterns);
          setGlobalPatternsState({ patterns: userPatterns, excludedSystemPatterns: excludedPatterns });
        } else {
          // For local patterns, the raw saved string is usually fine.
          setLocalPatterns(prev => ({
             ...prev, // Keep excludedSystemPatterns if it were relevant for local (it's not currently)
             patterns: patterns // Update with the newly saved content
           }));
        }

        // Immediately update the selected files to exclude any newly excluded files
        // This ensures UI is updated before the folder reload completes
        const newSelectedFiles = selectedFiles.filter(filePath => {
          // Create a temporary ignore for checking
          const tempIgnore = ignore().add(patterns.split('\n').filter(line => line.trim() && !line.startsWith('#')));
          return !tempIgnore.ignores(filePath);
        });
        
        // Only update if there's a change to avoid unnecessary re-renders
        if (newSelectedFiles.length !== selectedFiles.length) {
          console.log(`Immediately filtered out ${selectedFiles.length - newSelectedFiles.length} newly excluded files from selection`);
          setSelectedFiles(newSelectedFiles);
          
          // Also update displayed files to reflect the changes
          const updatedDisplayedFiles = displayedFiles.filter(file => 
            newSelectedFiles.includes(file.path)
          );
          setDisplayedFiles(updatedDisplayedFiles);
        }

        // Reload the folder data to apply new patterns
        // Add a small delay to ensure file system changes are registered
        setTimeout(() => {
          reloadFolder();
          
          // After reloading, update selected files again to ensure consistency
          setTimeout(() => {
            // Filter out files that should be excluded based on new patterns
            const newSelectedFiles = selectedFiles.filter(filePath => {
              // Find the file in allFiles to check if it's excluded
              const file = allFiles.find(f => f.path === filePath);
              return file && !file.excludedByDefault;
            });
            
            // Only update if there's a change to avoid unnecessary re-renders
            if (newSelectedFiles.length !== selectedFiles.length) {
              console.log(`Filtered out ${selectedFiles.length - newSelectedFiles.length} newly excluded files from selection after reload`);
              setSelectedFiles(newSelectedFiles);
            }
          }, 500); // Wait a bit after reload to ensure allFiles is updated
        }, 300);

      } else {
        console.error(`IPC: Save ${isGlobal ? 'global' : 'local'} patterns failed:`, result.error);
        setProcessingStatus({ status: "error", message: `Save failed: ${result.error}` });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error invoking save-ignore-patterns:", error);
      setProcessingStatus({ status: "error", message: `Save failed: ${errorMessage}` });
    }
  }, [isElectron, selectedFolder, reloadFolder, selectedFiles, allFiles, setSelectedFiles, displayedFiles, setDisplayedFiles]);

  // Reset patterns (global or local)
  const resetIgnorePatterns = useCallback(async (isGlobal: boolean, folderPath?: string): Promise<void> => {
    if (!isElectron) return;
    const targetPath = folderPath || selectedFolder;
    if (!isGlobal && !targetPath) {
      console.error("Cannot reset local patterns without a folder path");
      setProcessingStatus({ status: "error", message: "No folder selected for local patterns." });
      return;
    }

    setProcessingStatus({ status: "processing", message: `Resetting ${isGlobal ? "global" : "local"} patterns...` });

    try {
      const result = await window.electron.resetIgnorePatterns({
        folderPath: targetPath || undefined,
        isGlobal
      });

      if (result.success) {
        console.log(`IPC: Reset ${isGlobal ? 'global' : 'local'} patterns successful`);
        setProcessingStatus({ status: "complete", message: "Patterns reset." });

        // Update state with the default values returned
        if (isGlobal) {
          setGlobalPatternsState({
            patterns: result.patterns || '',
            excludedSystemPatterns: []
          });
        } else {
          setLocalPatterns({
            patterns: result.patterns || '',
            excludedSystemPatterns: []
          });
        }

        // Immediately update selected files based on default patterns
        if (result.patterns) {
          const defaultPatterns = result.patterns;
          const newSelectedFiles = selectedFiles.filter(filePath => {
            // Create a temporary ignore for checking
            const tempIgnore = ignore().add(defaultPatterns.split('\n').filter(line => line.trim() && !line.startsWith('#')));
            return !tempIgnore.ignores(filePath);
          });
          
          // Only update if there's a change to avoid unnecessary re-renders
          if (newSelectedFiles.length !== selectedFiles.length) {
            console.log(`Immediately filtered out ${selectedFiles.length - newSelectedFiles.length} newly excluded files from selection after reset`);
            setSelectedFiles(newSelectedFiles);
            
            // Also update displayed files to reflect the changes
            const updatedDisplayedFiles = displayedFiles.filter(file => 
              newSelectedFiles.includes(file.path)
            );
            setDisplayedFiles(updatedDisplayedFiles);
          }
        }

        // Reload the folder data to apply new patterns
        setTimeout(() => {
          reloadFolder();
          
          // After reloading, update selected files again to ensure consistency
          setTimeout(() => {
            // Filter out files that should be excluded based on new patterns
            const newSelectedFiles = selectedFiles.filter(filePath => {
              // Find the file in allFiles to check if it's excluded
              const file = allFiles.find(f => f.path === filePath);
              return file && !file.excludedByDefault;
            });
            
            // Only update if there's a change to avoid unnecessary re-renders
            if (newSelectedFiles.length !== selectedFiles.length) {
              console.log(`Filtered out ${selectedFiles.length - newSelectedFiles.length} newly excluded files from selection after reload`);
              setSelectedFiles(newSelectedFiles);
            }
          }, 500); // Wait a bit after reload to ensure allFiles is updated
        }, 300);
      } else {
        console.error(`IPC: Reset ${isGlobal ? 'global' : 'local'} patterns failed:`, result.error);
        setProcessingStatus({ status: "error", message: `Reset failed: ${result.error}` });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error invoking reset-ignore-patterns:", error);
      setProcessingStatus({ status: "error", message: `Reset failed: ${errorMessage}` });
    }
  }, [isElectron, selectedFolder, reloadFolder, selectedFiles, allFiles, setSelectedFiles, displayedFiles, setDisplayedFiles]);

  // Clear local ignore patterns (no global counterpart)
  const clearLocalIgnorePatterns = useCallback(async (folderPath: string): Promise<void> => {
    if (!isElectron) return;
    if (!folderPath) {
      console.error("Cannot clear local patterns without a folder path");
      setProcessingStatus({ status: "error", message: "No folder selected for local patterns." });
      return;
    }

    setProcessingStatus({ status: "processing", message: "Clearing local patterns..." });

    try {
      const result = await window.electron.clearLocalIgnorePatterns({
        folderPath
      });

      if (result.success) {
        console.log("IPC: Clear local patterns successful");
        setProcessingStatus({ status: "complete", message: "Local patterns cleared." });

        // Update local patterns state (empty string, no exclusions)
        setLocalPatterns({
          patterns: '',
          excludedSystemPatterns: []
        });

        // Since we're clearing patterns, more files might now be included
        // We don't need to filter the selected files immediately since we're removing restrictions
        // But we should update the displayed files to be consistent with the allFiles list after reload
        
        // Reload folder data to apply changes
        setTimeout(() => {
          reloadFolder();
          
          // After reloading, update selected files to exclude any newly excluded files
          setTimeout(() => {
            // Filter out files that should be excluded based on new patterns
            const newSelectedFiles = selectedFiles.filter(filePath => {
              // Find the file in allFiles to check if it's excluded
              const file = allFiles.find(f => f.path === filePath);
              return file && !file.excludedByDefault;
            });
            
            // Only update if there's a change to avoid unnecessary re-renders
            if (newSelectedFiles.length !== selectedFiles.length) {
              console.log(`Filtered out ${selectedFiles.length - newSelectedFiles.length} newly excluded files from selection after reload`);
              setSelectedFiles(newSelectedFiles);
            }
          }, 500); // Wait a bit after reload to ensure allFiles is updated
        }, 300);
      } else {
        console.error("IPC: Clear local patterns failed:", result.error);
        setProcessingStatus({ status: "error", message: `Clear failed: ${result.error}` });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error invoking clear-local-ignore-patterns:", error);
      setProcessingStatus({ status: "error", message: `Clear failed: ${errorMessage}` });
    }
  }, [isElectron, reloadFolder, selectedFiles, allFiles, setSelectedFiles]);


  // --- Dialog State & Handlers ---
  const [showClearSelectionDialog, setShowClearSelectionDialog] = useState(false);
  const [showRemoveAllFoldersDialog, setShowRemoveAllFoldersDialog] = useState(false);
  const [showResetPatternsDialog, setShowResetPatternsDialog] = useState(false);
  const [resetPatternsContext, setResetPatternsContext] = useState<{isGlobal: boolean; folderPath: string | null}>({isGlobal: false, folderPath: null});

  const handleClearSelectionClick = useCallback(() => setShowClearSelectionDialog(true), []);
  const clearSelection = useCallback(() => { setSelectedFiles([]); setShowClearSelectionDialog(false); }, []);
  const handleRemoveAllFoldersClick = useCallback(() => setShowRemoveAllFoldersDialog(true), []);
  const removeAllFolders = useCallback(() => {
    setSelectedFolder(null); setAllFiles([]); setSelectedFiles([]); setDisplayedFiles([]);
    setLocalPatterns({ patterns: '', excludedSystemPatterns: [] }); // Reset local patterns
    localStorage.removeItem(STORAGE_KEYS.SELECTED_FOLDER);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_FILES);
    localStorage.removeItem(STORAGE_KEYS.EXPANDED_NODES); // Also clear expanded nodes
    setExpandedNodes(new Map()); // Reset map in state
    sessionStorage.removeItem("hasLoadedInitialData");
    setShowRemoveAllFoldersDialog(false);
  }, []);

  const confirmResetPatterns = useCallback(() => {
    if (resetPatternsContext) {
      resetIgnorePatterns(resetPatternsContext.isGlobal, resetPatternsContext.folderPath || undefined);
    }
    setShowResetPatternsDialog(false);
    setResetPatternsContext({isGlobal: false, folderPath: null});
  }, [resetPatternsContext, resetIgnorePatterns]);

  // --- Helper Functions ---
  const truncatePath = (path: string | null): string => {
    if (!path) return "No folder selected";
    const parts = path.split(/[/\\]/); // Handle both slash types
    if (parts.length <= 3) return path;
    const lastParts = parts.filter(p => p).slice(-2);
    return `.../${lastParts.join('/')}`;
  };

  // Callback for IgnorePatterns component to update global excluded patterns
  const handleExcludedSystemPatternsChange = useCallback((newExcluded: string[]) => {
    setGlobalPatternsState((prev: IgnorePatternsState) => ({
      ...prev,
      excludedSystemPatterns: newExcluded
    }));
  }, []);

  const processingToastIds = useRef<Record<string, string>>({});
  const fileOperationRef = useRef<{ inProgress: boolean }>({ inProgress: false });
  
  // Processing status effect - show toast notifications instead of StatusAlert
  useEffect(() => {
    if (processingStatus.status === 'processing') {
      // For processing status
      showToast.info(processingStatus.message);
    } 
    else if (processingStatus.status === 'complete') {
      // For completion status
      showToast.success(processingStatus.message);
      
      // Auto-reset to idle after a delay
      const timer = setTimeout(() => {
        setProcessingStatus({ status: 'idle', message: '' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    else if (processingStatus.status === 'error') {
      // For error status
      showToast.error(processingStatus.message);
    }
  }, [processingStatus.status, processingStatus.message]);

  // --- Handler for Model Selection ---
  const handleModelChange = useCallback((modelId: string | null) => {
    console.log(`Model selected: ${modelId}`);
    
    // Find the corresponding model info and update context length
    if (modelId && availableModels) {
      const selectedModel = availableModels.find(model => model.id === modelId);
      if (selectedModel) {
        // Update states with the valid model
        setSelectedModelId(modelId);
        setSelectedContextLength(selectedModel.context_length);
        console.log(`Set context length: ${selectedModel.context_length}`);
        
        // Persist to localStorage
        localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL_ID, modelId);
        console.log(`Persisted modelId ${modelId} to localStorage`);
      } else {
        console.warn(`Selected model ID ${modelId} not found in available models.`);
        
        // Try to recover with first available model
        if (availableModels.length > 0) {
          const firstModel = availableModels[0];
          setSelectedModelId(firstModel.id);
          setSelectedContextLength(firstModel.context_length);
          localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL_ID, firstModel.id);
          console.log(`Recovered with model ${firstModel.id}, context length: ${firstModel.context_length}`);
        } else {
          // No models available - use sensible defaults
          setSelectedModelId(null);
          setSelectedContextLength(128000); // A safe default
          localStorage.removeItem(STORAGE_KEYS.SELECTED_MODEL_ID);
          console.warn('No models available for recovery - using defaults');
        }
      }
    } else {
      // Handle null selection (should be rare in UI)
      setSelectedModelId(null);
      setSelectedContextLength(null);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_MODEL_ID);
      console.log('Cleared model selection');
    }
  }, [availableModels]); // Add availableModels dependency

  // Handler to force refresh of models list
  const handleRefreshModels = useCallback(async () => {
    if (!isElectron) return;
    
    console.log("Manually refreshing models list...");
    setProcessingStatus({ status: "processing", message: "Refreshing models..." });
    setIsLoadingModels(true);
    
    try {
      // Call fetchModels with forceRefresh=true to skip cache
      const fetchedModels = await fetchModels(true);
      const modelsToUse = (fetchedModels as ModelInfo[] | null) || [];
      
      // If still no models, use fallbacks
      const finalModels = modelsToUse.length > 0 
        ? modelsToUse 
        : [
            { id: "openai/gpt-4o", name: "GPT-4o (Fallback)", context_length: 128000 },
            { id: "anthropic/claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet (Fallback)", context_length: 200000 }
          ];
      
      // Update available models state
      setAvailableModels(finalModels);
      
      // Update selected model if needed
      if (selectedModelId) {
        const selectedModel = finalModels.find(m => m.id === selectedModelId);
        if (selectedModel) {
          // Current model still exists, update its context length
          setSelectedContextLength(selectedModel.context_length);
          console.log(`Updated context length for ${selectedModelId}: ${selectedModel.context_length}`);
        } else if (finalModels.length > 0) {
          // Selected model no longer exists, switch to first available
          const firstModel = finalModels[0];
          setSelectedModelId(firstModel.id);
          setSelectedContextLength(firstModel.context_length);
          localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL_ID, firstModel.id);
          console.log(`Selected model no longer available. Switched to: ${firstModel.id}`);
        }
      }
      
      setProcessingStatus({ status: "complete", message: `Refreshed ${finalModels.length} models` });
      setTimeout(() => setProcessingStatus({ status: "idle", message: "" }), 2000);
    } catch (error) {
      console.error("Error refreshing models:", error);
      setProcessingStatus({ 
        status: "error", 
        message: `Failed to refresh models: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoadingModels(false);
      // Make sure initialModelLoadComplete stays true (just in case)
      setInitialModelLoadComplete(true);
    }
  }, [isElectron, selectedModelId]);

  // --- Render ---
  return (
    <ThemeProvider>
      <div className={styles.app}>
        <Toast />
        {/* Toast component added to make it available throughout the app */}
        
        {isElectron && (
          <div className={styles.appContainer}>
            <header className={styles.appHeader}>
              <h1>ContextCraft</h1>
              <div className={styles.headerActions}>
                {/* <a href="#" className={styles.headerLink}>Guide</a>
                <div className={styles.headerSeparator}></div> */}
                <ThemeToggle />
                <div className={styles.headerSeparator}></div>
                <a href="https://github.com/flight505/ContextCraft" target="_blank" rel="noopener noreferrer" className={styles.githubButton}>
                  <Github size={16} />
                </a>
              </div>
            </header>

            {/* Remove StatusAlert in favor of Toast notifications */}

            <div className={styles.mainContainer}>
              <Sidebar
                selectedFolder={selectedFolder}
                openFolder={openFolder}
                allFiles={allFiles}
                selectedFiles={selectedFiles}
                toggleFileSelection={toggleFileSelection}
                toggleFolderSelection={toggleFolderSelection}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                selectAllFiles={selectAllFiles}
                deselectAllFiles={deselectAllFiles}
                expandedNodes={expandedNodes}
                toggleExpanded={toggleExpanded}
                reloadFolder={reloadFolder}
                clearSelection={clearSelection}
                removeAllFolders={removeAllFolders}
                loadIgnorePatterns={loadIgnorePatterns}
                saveIgnorePatterns={saveIgnorePatterns}
                resetIgnorePatterns={resetIgnorePatterns}
                systemIgnorePatterns={systemIgnorePatterns}
                clearIgnorePatterns={clearLocalIgnorePatterns}
                onClearSelectionClick={handleClearSelectionClick}
                onRemoveAllFoldersClick={handleRemoveAllFoldersClick}
                fileTreeSortOrder={fileTreeSortOrder}
                onSortOrderChange={setFileTreeSortOrder}
                globalPatternsState={globalPatternsState}
                localPatternsState={localIgnorePatterns}
                onExcludedSystemPatternsChange={handleExcludedSystemPatternsChange}
                setIgnorePatterns={() => {}}
                _availableModels={availableModels}
                _selectedModelId={selectedModelId}
                _onModelChange={handleModelChange}
              />

              {selectedFolder ? (
                <div className={styles.contentArea}>
                  <div className={styles.contentHeader}>
                    <div className={styles.folderPathDisplay} title={selectedFolder}>
                      <span className={styles.pathLabel}>{'>_'}</span> {truncatePath(selectedFolder)}
                    </div>
                    <div className={styles.headerSeparator} />
                    <div className={styles.contentActions}>
                      <Dropdown
                        options={sortOptions}
                        value={sortOrder}
                        onChange={handleSortChange}
                        trigger={
                          <Button variant="secondary" size="sm" startIcon={getSortIcon(sortOrder)}> Sort </Button>
                        }
                      />
                    </div>
                    <div className={styles.headerSeparator} />
                    <div className={styles.fileStats}>
                      <span>{selectedFiles.length}</span> files selected (<span>{displayedTokenCount.toLocaleString()}</span> tokens)
                    </div>
                  </div>
                  <FileList
                    files={displayedFiles} // Pass metadata only
                    selectedFiles={selectedFiles}
                    toggleFileSelection={toggleFileSelection}
                  />

                  {showUserInstructions && (
                    <div className={styles.userInstructionsContainer}>
                      <UserInstructionsWithTemplates
                        instructions={userInstructions}
                        setInstructions={setUserInstructions}
                      />
                    </div>
                  )}

                  <ControlContainer
                    fileTreeMode={fileTreeMode}
                    setFileTreeMode={setFileTreeMode}
                    showUserInstructions={showUserInstructions}
                    setShowUserInstructions={setShowUserInstructions}
                    getSelectedFilesContent={getSelectedFilesContent} // Now async
                    selectedFilesCount={selectedFiles.length}
                    outputFormat={outputFormat}
                    setOutputFormat={setOutputFormat}
                    availableModels={availableModels}
                    selectedModelId={selectedModelId}
                    onModelChange={handleModelChange}
                    isElectron={isElectron}
                    processingStatus={processingStatus.status}
                    onGenerateOutput={() => {}} // Assuming generateOutput uses selected model
                    totalTokenCount={displayedTokenCount}
                    selectedContextLength={selectedContextLength}
                    isCompressionEnabled={isCompressionEnabled}
                    setIsCompressionEnabled={setIsCompressionEnabled}
                    isCommentRemovalEnabled={isCommentRemovalEnabled}
                    setIsCommentRemovalEnabled={setIsCommentRemovalEnabled}
                    onRefreshModels={handleRefreshModels}
                    // Pass new props for enhanced compression controls
                    keepDocstrings={keepDocstrings}
                    setKeepDocstrings={setKeepDocstrings}
                    removeEmptyLines={removeEmptyLines}
                    setRemoveEmptyLines={setRemoveEmptyLines}
                    neverCompressPatterns={neverCompressPatterns}
                    neverCompressPatternsRaw={neverCompressPatternsRaw}
                    setNeverCompressPatternsRaw={setNeverCompressPatternsRaw}
                    minCompressTokenThreshold={minCompressTokenThreshold}
                    setMinCompressTokenThreshold={setMinCompressTokenThreshold}
                  />
                </div>
              ) : (
                <div className={styles.contentArea}>
                  <div className={styles.emptyStateContent}>
                    <h2>Welcome to ContextCraft</h2>
                    <p>Select a folder to get started.</p>
                    <Button variant="primary" onClick={openFolder} className="mt-4"> Select Project Folder </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmation Dialogs */}
            <ConfirmationDialog isOpen={showClearSelectionDialog} onClose={() => setShowClearSelectionDialog(false)} onConfirm={clearSelection} title="Clear Selection" description="Clear all selected files?" confirmLabel="Clear" variant="destructive" />
            <ConfirmationDialog isOpen={showRemoveAllFoldersDialog} onClose={() => setShowRemoveAllFoldersDialog(false)} onConfirm={removeAllFolders} title="Remove All Folders" description="Remove all folders and reset the application?" confirmLabel="Remove All" variant="destructive" />
            <ConfirmationDialog isOpen={showResetPatternsDialog} onClose={() => setShowResetPatternsDialog(false)} onConfirm={confirmResetPatterns} title={`Reset ${resetPatternsContext?.isGlobal ? 'Global' : 'Local'} Ignore Patterns`} description="Reset patterns to their default values?" confirmLabel="Reset" variant="destructive" />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;