import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronDown, Plus, X, Play, Loader2 } from "lucide-react";
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-ignore';
import 'prismjs/themes/prism.css';
import 'prismjs/themes/prism-tomorrow.css';
import { Button, Switch } from "./ui";
import { ErrorBoundary } from './ErrorBoundary';
import styles from "./IgnorePatterns.module.css";
import { SYSTEM_PATTERN_CATEGORIES, IgnorePatternsState } from "../utils/patternUtils";

// Props interface - Updated
interface IgnorePatternsProps {
  isOpen: boolean;
  onClose: () => void;
  // Pass the full state objects
  globalPatternsState: IgnorePatternsState;
  localPatternsState: IgnorePatternsState; // Only 'patterns' part is relevant here
  localFolderPath?: string;
  processingStatus?: {
    status: "idle" | "processing" | "complete" | "error";
    message: string;
  };
  // Callbacks to App.tsx
  saveIgnorePatterns: (patterns: string, isGlobal: boolean, folderPath?: string) => Promise<void>;
  resetIgnorePatterns: (isGlobal: boolean, folderPath?: string) => Promise<void>;
  clearIgnorePatterns: (folderPath: string) => Promise<void>;
  // For controlling excluded system patterns
  onExcludedSystemPatternsChange: (patterns: string[]) => void;
  systemIgnorePatterns: string[]; // Full list of available system patterns
  recentFolders: string[];
}

// Custom error for pattern validation
class PatternValidationError extends Error {
 constructor(message: string) {
  super(message);
  this.name = 'PatternValidationError';
 }
}

// Validates a glob pattern for syntax errors
const validatePattern = (pattern: string): boolean => {
  if (!pattern.trim()) {
   throw new PatternValidationError(`Invalid pattern: Pattern cannot be empty`);
  }
  return true;
};

// Add type for test results
interface PatternTestResult {
  ignoredCount: number;
  ignoredFiles: string[];
  totalFilesChecked: number;
}

const IgnorePatternsWithErrorBoundary: React.FC<IgnorePatternsProps> = (props) => (
  <ErrorBoundary fallback={ <div>Error loading ignore patterns component.</div> }>
    <IgnorePatterns {...props} />
  </ErrorBoundary>
);

// Add a helper function to truncate file paths to show only username
const truncatePath = (path: string): string => {
  if (!path) return '';
  
  // For macOS/Linux paths
  if (path.startsWith('/')) {
    const parts = path.split('/');
    // Get username part (usually the third part in /Users/username/...)
    if (parts.length >= 3 && parts[1] === 'Users') {
      return `~/${parts.slice(3).join('/')}`;
    }
  }
  
  // For Windows paths
  if (path.includes(':\\')) {
    const parts = path.split('\\');
    const userIndex = parts.findIndex(part => part === 'Users') + 1;
    if (userIndex > 0 && userIndex < parts.length) {
      return `~\\${parts.slice(userIndex + 1).join('\\')}`;
    }
  }
  
  // Simple fallback for other paths
  const pathParts = path.split(/[/\\]/); // Removed unnecessary escape for /
  return `.../${pathParts[pathParts.length - 1]}`;
};

const IgnorePatterns: React.FC<IgnorePatternsProps> = ({
  isOpen,
  onClose,
  globalPatternsState, // Now an object { patterns, excludedSystemPatterns }
  localPatternsState,  // Now an object { patterns, excludedSystemPatterns } (but we only use patterns)
  localFolderPath,
  processingStatus = { status: "idle", message: "" },
  saveIgnorePatterns,
  resetIgnorePatterns,
  clearIgnorePatterns,
  onExcludedSystemPatternsChange,
  systemIgnorePatterns,
  recentFolders,
}) => {
  /**
   * Component State Management
   */
  const isInitialized = useRef(false);

  // Use safe initializers for useState, relying on useEffect for sync
  const [currentGlobalPatterns, setCurrentGlobalPatterns] = useState<string>('');
  const [currentLocalPatterns, setCurrentLocalPatterns] = useState<string>('');
  const [mergedPreview, setMergedPreview] = useState<Array<{ pattern: string; source: string }>>([]);
  const [activeTab, setActiveTab] = useState<"global" | "local">("global");
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(localFolderPath);
  const [applyingPatterns, setApplyingPatterns] = useState<boolean>(false);
  const [folderSelectOpen, setFolderSelectOpen] = useState(false);
  const [actualPatternCount, setActualPatternCount] = useState<number>(0);
  const [lastSavedGlobal, setLastSavedGlobal] = useState<Date | null>(null);
  const [lastSavedLocal, setLastSavedLocal] = useState<Record<string, Date | null>>({}); // Store by folder path
  const [isLoadingPatterns, setIsLoadingPatterns] = useState<boolean>(false);
  const [isTestingPatterns, setIsTestingPatterns] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<PatternTestResult | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  // Add ref for the editor container
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Derive excluded patterns directly from props for controlled behavior
  // Add safe fallback for initial render if globalPatternsState is somehow undefined briefly
  const excludedSystemPatterns = useMemo(() => globalPatternsState?.excludedSystemPatterns || [], [globalPatternsState]);

  // Initialize with all categories collapsed
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.keys(SYSTEM_PATTERN_CATEGORIES).reduce((acc, category) => ({ ...acc, [category]: false }), {})
  );

  /**
   * Sync internal state with props when modal opens or props change
   */
  useEffect(() => {
    if (isOpen) {
      // Safely access props, providing defaults if undefined during initial render cycle
      setCurrentGlobalPatterns(globalPatternsState?.patterns ?? '');
      if (selectedFolder === localFolderPath) {
          setCurrentLocalPatterns(localPatternsState?.patterns ?? '');
      } else if (!isInitialized.current) {
          setCurrentLocalPatterns(''); // Start fresh if different folder on init
      }
      setSelectedFolder(localFolderPath); // Sync selected folder
      setApplyingPatterns(processingStatus.status === 'processing');

      if (!isInitialized.current) {
        isInitialized.current = true;
      }
    } else {
      // Reset init flag when closed
      isInitialized.current = false;
    }
  }, [isOpen, globalPatternsState, localPatternsState, localFolderPath, processingStatus, selectedFolder]); // Ensure all relevant props are dependencies


  // Generate merged preview - Refined logic
  useEffect(() => {
    // 1. Get all potential patterns sources
    const currentGlobalEdit = currentGlobalPatterns.split('\n').filter(p => p.trim());
    const currentLocalEdit = currentLocalPatterns.split('\n').filter(p => p.trim());
    
    // Use props for saved state, providing defaults
    const savedGlobalPatterns = (globalPatternsState?.patterns ?? '').split('\n').filter(p => p.trim());
    const savedLocalPatterns = (localPatternsState?.patterns ?? '').split('\n').filter(p => p.trim());
    const safeExcludedSystem = Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns : [];
    const activeSystemPatterns = systemIgnorePatterns.filter(p => !safeExcludedSystem.includes(p));

    // 2. Determine active patterns based on the *current* tab
    // Use edits for the active tab, saved state for the inactive tab
    const activeGlobal = (activeTab === 'global') ? currentGlobalEdit : savedGlobalPatterns;
    const activeLocal = (activeTab === 'local') ? currentLocalEdit : savedLocalPatterns;

    // 3. Combine and deduplicate, tracking source (System > Global > Local precedence)
    const effectivePatterns = new Map<string, 'system' | 'global' | 'local'>();

    // Add system patterns first
    activeSystemPatterns.forEach(p => effectivePatterns.set(p, 'system'));
    
    // Add global patterns (overwriting system if duplicate)
    activeGlobal.forEach(p => effectivePatterns.set(p, 'global'));
    
    // Add local patterns (overwriting global/system if duplicate)
    // Only add local patterns if a folder is selected
    if (selectedFolder) {
      activeLocal.forEach(p => effectivePatterns.set(p, 'local'));
    }

    // 4. Build the preview string array with source indicators
    const previewLines: { pattern: string; source: string }[] = [];
    
    // Group by source for clarity in preview
    const systemLines = Array.from(effectivePatterns.entries()).filter(([, src]) => src === 'system').map(([pat]) => ({ pattern: pat, source: 'system' }));
    const globalLines = Array.from(effectivePatterns.entries()).filter(([, src]) => src === 'global').map(([pat]) => ({ pattern: pat, source: 'global' }));
    const localLines = Array.from(effectivePatterns.entries()).filter(([, src]) => src === 'local').map(([pat]) => ({ pattern: pat, source: 'local' }));

    if (systemLines.length > 0) {
      previewLines.push({ pattern: "# --- System Patterns ---", source: 'comment' });
      previewLines.push(...systemLines);
    }
    if (globalLines.length > 0) {
      if (previewLines.length > 0) previewLines.push({ pattern: "", source: 'comment' }); // separator
      previewLines.push({ pattern: "# --- Global Patterns ---", source: 'comment' });
      previewLines.push(...globalLines);
    }
    if (localLines.length > 0) {
      if (previewLines.length > 0) previewLines.push({ pattern: "", source: 'comment' }); // separator
      previewLines.push({ pattern: "# --- Local Patterns ---", source: 'comment' });
      previewLines.push(...localLines);
    }

    // Store the preview data (more structured now)
    // We'll adapt the rendering logic below
    setMergedPreview(previewLines); // Assuming setMergedPreview can handle this array
    setActualPatternCount(effectivePatterns.size);

  }, [activeTab, currentGlobalPatterns, currentLocalPatterns, globalPatternsState, localPatternsState, systemIgnorePatterns, excludedSystemPatterns, selectedFolder]); // Added selectedFolder dependency

  // Effect to update last saved time when props indicate a save might have occurred elsewhere
  // (This is a basic check, might need refinement based on actual app logic)
  useEffect(() => {
    // Placeholder: If we had timestamps from props, we'd sync them here.
    // For now, we'll rely on setting it during save actions within this component.
  }, [globalPatternsState, localPatternsState]);

  // Effect to handle initial loading state
  useEffect(() => {
    if (isOpen) {
      setIsLoadingPatterns(true);
      // Simulate loading delay or use actual loading status from props if available
      const timer = setTimeout(() => setIsLoadingPatterns(false), 300); // Adjust delay as needed
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeTab, selectedFolder]); // Reload when tab or folder changes

  // Effect to clear test results when inputs change or modal closes
  useEffect(() => {
    if (!isOpen) {
      setTestResults(null);
      setTestError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    // Clear results if patterns or folder change
    setTestResults(null);
    setTestError(null);
  }, [currentGlobalPatterns, currentLocalPatterns, selectedFolder, excludedSystemPatterns]);

  /**
   * Event Handlers
   */
  const handleTabChange = (isGlobal: boolean) => setActiveTab(isGlobal ? "global" : "local");

  const handleFolderChange = (folderPath: string) => {
    setSelectedFolder(folderPath);
    setFolderSelectOpen(false);
    if (folderPath === localFolderPath) {
       // Safely access patterns from prop state
       setCurrentLocalPatterns(localPatternsState?.patterns ?? '');
    } else {
       setCurrentLocalPatterns('');
       console.warn("Selecting a different folder than the App's current one. Local patterns shown are temporary until saved for that specific folder.");
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  // System pattern management - Calls the callback prop
  const handleToggleSystemPattern = useCallback((pattern: string) => {
    try {
      validatePattern(pattern);
       // Ensure excludedSystemPatterns is an array before operating on it
      const safeExcluded = Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns : [];
      const newExcluded = safeExcluded.includes(pattern)
        ? safeExcluded.filter(p => p !== pattern)
        : [...safeExcluded, pattern];
      onExcludedSystemPatternsChange(newExcluded); // Update App state

      // Visual feedback (optional)
      const patternElement = document.querySelector(`[data-pattern="${pattern}"]`);
      if (patternElement) {
        patternElement.classList.add(styles.patternToggled);
        setTimeout(() => patternElement.classList.remove(styles.patternToggled), 300);
      }
    } catch (error) {
      console.error('Error toggling pattern:', error);
      if (error instanceof PatternValidationError) console.warn('Pattern validation failed:', error.message);
    }
  }, [excludedSystemPatterns, onExcludedSystemPatternsChange]); // Use derived excludedSystemPatterns

  // Pattern saving handlers - Use current local edits + props
  const handleSaveGlobalPatterns = useCallback(async () => {
    try {
      setApplyingPatterns(true);
      const userPatterns = currentGlobalPatterns.split('\n').filter(p => p.trim());
      userPatterns.forEach(validatePattern);

      // Format disabled patterns using the derived prop value
      const safeExcluded = Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns : [];
      
      // Format disabled patterns section - each disabled pattern on its own line
      const disabledPatternsSection = safeExcluded
        .map(pattern => `# DISABLED: ${pattern}`)
        .join('\n');

      // Add user patterns with proper header
      let formattedContent = '';
      
      // Add the disabled patterns first
      if (disabledPatternsSection) {
        formattedContent += disabledPatternsSection + '\n\n';
      }
      
      // Then add user patterns with header
      if (currentGlobalPatterns.trim()) {
        formattedContent += '# USER PATTERNS:\n' + currentGlobalPatterns.trim();
      }

      await saveIgnorePatterns(formattedContent, true);
      setApplyingPatterns(false);
      setLastSavedGlobal(new Date()); // Set timestamp on success
      // Return success for handleSave
      return { success: true };
    } catch (error) {
      console.error('Error saving global patterns:', error);
      setApplyingPatterns(false);
      // Propagate error
      throw error; 
    }
  }, [currentGlobalPatterns, excludedSystemPatterns, saveIgnorePatterns]);

  const handleSaveLocalPatterns = useCallback(async () => {
    try {
      if (!selectedFolder) {
        throw new Error('No folder selected for local patterns');
      }
      setApplyingPatterns(true);
      
      // Save the patterns and get the result
      const result = await saveIgnorePatterns(currentLocalPatterns, false, selectedFolder);
      
      // Add visual feedback using the editorContainerRef
      if (editorContainerRef.current) {
        editorContainerRef.current.classList.add(styles.saveSuccess);
        setTimeout(() => {
          if (editorContainerRef.current) {
            editorContainerRef.current.classList.remove(styles.saveSuccess);
          }
        }, 500);
      }
      
      setApplyingPatterns(false);
      setLastSavedLocal(prev => ({ ...prev, [selectedFolder]: new Date() })); // Set timestamp
      return result; // Return result from saveIgnorePatterns
    } catch (error) {
      console.error('Error saving local patterns:', error);
      setApplyingPatterns(false);
      
      // Add visual error feedback using the editorContainerRef
      if (editorContainerRef.current) {
        editorContainerRef.current.classList.add(styles.saveError);
        setTimeout(() => {
          if (editorContainerRef.current) {
            editorContainerRef.current.classList.remove(styles.saveError);
          }
        }, 500);
      }
      
      throw error;
    }
  }, [currentLocalPatterns, selectedFolder, saveIgnorePatterns]);

  const handleSave = useCallback(async () => {
    let success = false;
    try {
      let result;
      if (activeTab === 'global') {
        result = await handleSaveGlobalPatterns();
      } else {
        result = await handleSaveLocalPatterns();
      }
      // Check if save was successful (assuming handlers return { success: true } or similar)
      success = result?.success ?? true; // Default to true if no explicit success field

      if (success) {
        // Add status message for user feedback
        const message = document.createElement('div');
        message.className = styles.saveMessage;
        message.textContent = `${activeTab === 'global' ? 'Global' : 'Local'} patterns saved successfully`;
        
        const container = document.querySelector(`.${styles.patternEntrySection}`);
        if (container) {
          container.appendChild(message);
          setTimeout(() => {
            if (container.contains(message)) {
              container.removeChild(message);
            }
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Failed to save patterns:', error);
      
      // Show error message - Check if error is an instance of Error
      const message = document.createElement('div');
      message.className = `${styles.saveMessage} ${styles.errorMessage}`;
      const errorMessage = error instanceof Error ? error.message : 'Failed to save patterns';
      message.textContent = `Error: ${errorMessage}`;
      
      const container = document.querySelector(`.${styles.patternEntrySection}`);
      if (container) {
        container.appendChild(message);
        setTimeout(() => {
          if (container.contains(message)) {
            container.removeChild(message);
          }
        }, 3000);
      }
    }
  }, [activeTab, handleSaveGlobalPatterns, handleSaveLocalPatterns]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  const handleClearLocal = useCallback(async () => {
    try {
      if (!selectedFolder) {
        throw new Error('No folder selected for local patterns');
      }
      setApplyingPatterns(true);
      await clearIgnorePatterns(selectedFolder);
      setCurrentLocalPatterns(''); // Clear the textarea
      setLastSavedLocal(prev => ({ ...prev, [selectedFolder]: null })); // Clear timestamp
      setApplyingPatterns(false);
      // Add feedback message
      const message = document.createElement('div');
      message.className = styles.saveMessage;
      message.textContent = `Local patterns cleared successfully`;
      
      const container = document.querySelector(`.${styles.patternEntrySection}`);
      if (container) {
        container.appendChild(message);
        setTimeout(() => {
          if (container.contains(message)) {
            container.removeChild(message);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error clearing local patterns:', error);
      setApplyingPatterns(false);
    }
  }, [selectedFolder, clearIgnorePatterns]);

  const handleResetLocal = useCallback(async () => {
    try {
      if (!selectedFolder) {
        throw new Error('No folder selected for local patterns');
      }
      setApplyingPatterns(true);
      await resetIgnorePatterns(false, selectedFolder);
      // Patterns will reload via event, maybe update timestamp based on that?
      // For now, let's clear it as we don't know the *exact* save time of the reset default
      setLastSavedLocal(prev => ({ ...prev, [selectedFolder]: null })); 
      setApplyingPatterns(false);
      // Add feedback message
      const message = document.createElement('div');
      message.className = styles.saveMessage;
      message.textContent = `Local patterns reset successfully`;
      
      const container = document.querySelector(`.${styles.patternEntrySection}`);
      if (container) {
        container.appendChild(message);
        setTimeout(() => {
          if (container.contains(message)) {
            container.removeChild(message);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error resetting local patterns:', error);
      setApplyingPatterns(false);
    }
  }, [selectedFolder, resetIgnorePatterns]);

  const handleTestPatterns = useCallback(async () => {
    if (!selectedFolder) {
      setTestError("Please select a local folder to test patterns.");
      return;
    }

    setIsTestingPatterns(true);
    setTestResults(null); // Clear previous results
    setTestError(null);

    try {
      // 1. Construct the effective patterns (similar to preview logic)
      const currentGlobalEdit = currentGlobalPatterns.split('\n').filter(p => p.trim());
      // const currentLocalEdit = currentLocalPatterns.split('\n').filter(p => p.trim()); // Unused
      // const savedGlobalPatterns = (globalPatternsState?.patterns ?? '').split('\n').filter(p => p.trim()); // Unused
      // For testing, always use the *current edits* for the local patterns if a folder is selected
      const activeLocal = currentLocalPatterns.split('\n').filter(p => p.trim()); 
      const safeExcludedSystem = Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns : [];
      const activeSystemPatterns = systemIgnorePatterns.filter(p => !safeExcludedSystem.includes(p));

      const effectivePatternsMap = new Map<string, 'system' | 'global' | 'local'>();
      activeSystemPatterns.forEach(p => effectivePatternsMap.set(p, 'system'));
      // Use current global edits for testing
      currentGlobalEdit.forEach(p => effectivePatternsMap.set(p, 'global'));
      // Use current local edits for testing
      activeLocal.forEach(p => effectivePatternsMap.set(p, 'local'));

      const patternsToTest = Array.from(effectivePatternsMap.keys());

      // 2. Call the IPC handler
      const result = await window.electron.testIgnorePatterns({
        folderPath: selectedFolder,
        patterns: patternsToTest.join('\n'), // Join array into newline-separated string
      });

      if (result.success) {
        setTestResults({
          ignoredCount: result.ignoredCount ?? 0,
          ignoredFiles: result.ignoredFiles ?? [],
          totalFilesChecked: result.totalFilesChecked ?? 0,
        });
      } else {
        setTestError(result.error || "Failed to test patterns.");
      }
    } catch (error) {
      console.error("Error invoking test-ignore-patterns:", error);
      setTestError(error instanceof Error ? error.message : "An unknown error occurred during testing.");
    } finally {
      setIsTestingPatterns(false);
    }
  }, [
    selectedFolder, 
    currentGlobalPatterns, 
    currentLocalPatterns, 
    systemIgnorePatterns, 
    excludedSystemPatterns
  ]);

  // Add explanation tooltips for the buttons
  const buttonTooltips = {
    save: 'Save current patterns',
    reset: 'Reset to last saved patterns',
    clear: 'Remove all patterns',
    cancel: 'Discard changes'
  };

  // Replace handleTextareaChange with a handler for the Editor component
  const handleEditorChange = (code: string) => {
    if (activeTab === 'global') setCurrentGlobalPatterns(code);
    else setCurrentLocalPatterns(code);
    // Add validation logic here if desired
  };

  // Helper to format timestamp
  const formatTimestamp = (date: Date | null): string => {
    if (!date) return '';
    return `Last saved: ${date.toLocaleTimeString()}`;
  };

  // Determine current timestamp to display
  const currentTimestamp = activeTab === 'global' 
    ? formatTimestamp(lastSavedGlobal)
    : formatTimestamp(selectedFolder ? lastSavedLocal[selectedFolder] : null);

  // --- Render ---
  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>
            Ignore Patterns
            {applyingPatterns && <span className={styles.applying}>(Applying...)</span>}
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            aria-label="Close" 
            disabled={applyingPatterns}
            className={styles.closeButton}
          >
            <X size={16} />
          </Button>
        </div>

        <div className={styles.description}>
            Manage patterns to exclude files from processing. Global patterns apply everywhere, local patterns apply only to the selected folder. System patterns can be toggled on/off globally.
        </div>

        {/* Scope Selector (Tabs) */}
        <div className={styles.scopeSelector}>
            <Button variant={activeTab === "global" ? "secondary" : "ghost"} className={`${styles.scopeBtn} ${activeTab === "global" ? styles.active : ""}`} onClick={() => handleTabChange(true)} disabled={applyingPatterns}> Global </Button>
            <Button variant={activeTab === "local" ? "secondary" : "ghost"} className={`${styles.scopeBtn} ${activeTab === "local" ? styles.active : ""}`} onClick={() => handleTabChange(false)} disabled={applyingPatterns}> Local Folder </Button>
        </div>

        {/* Global Tab Content */}
        {activeTab === "global" && (
          <>
            {/* System Patterns Section */}
            <div className={styles.systemPatternsSection}>
              {/* Ensure excludedSystemPatterns is array before calculating length */}
              <h3 className={styles.sectionTitle}> System Defaults ({systemIgnorePatterns.length - (Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns.length : 0)} active) </h3>
               {Object.entries(SYSTEM_PATTERN_CATEGORIES).map(([category, patternsInCategory]) => { // Renamed variable
                    // Ensure excludedSystemPatterns is array before filtering
                    const safeExcluded = Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns : [];
                    // Filter patterns from the *main* system list that belong to this category
                    const categoryPatterns = systemIgnorePatterns.filter(p => patternsInCategory.includes(p));
                    if (categoryPatterns.length === 0) return null; // Skip empty categories
                    const enabledInCategory = categoryPatterns.filter(p => !safeExcluded.includes(p)).length;

                    return (
                        <div key={category} className={`${styles.patternCategory} ${expandedCategories[category] ? styles.categoryExpanded : ''}`}>
                          <div className={styles.categoryHeader} onClick={() => toggleCategory(category)}>
                            <div className={styles.categoryTitle}> {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} </div>
                            <div className={styles.categoryMeta}>
                              <span className={styles.categoryCount}> {enabledInCategory}/{categoryPatterns.length} </span>
                              <Plus 
                                size={16} 
                                className={`${styles.accordionIcon} ${expandedCategories[category] ? styles.rotated : ''}`} 
                              />
                            </div>
                          </div>
                          {expandedCategories[category] && (
                            <div className={styles.categoryItems}>
                              {categoryPatterns.map(pattern => {
                                // Ensure excludedSystemPatterns is array before checking includes
                                const safeExcludedInner = Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns : [];
                                const isEnabled = !safeExcludedInner.includes(pattern);
                                return (
                                  <div key={pattern} className={`${styles.systemPatternItem} ${isEnabled ? '' : styles.disabledPattern}`} data-pattern={pattern}>
                                    <span className={styles.patternText} title={pattern}>{pattern}</span>
                                    <Switch
                                        checked={isEnabled}
                                        onChange={() => handleToggleSystemPattern(pattern)}
                                        size="sm"
                                        className={styles.smallerSwitch}
                                        id={`switch-${pattern}-${category}`} // Make ID more unique
                                        aria-label={pattern} // Use pattern as label
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                    );
                })}
            </div>

            {/* Global Custom Patterns Section - Use Editor */}
            <div className={styles.patternEntrySection}>
                <div className={styles.sectionHeader}> {/* New container for title + timestamp */}
                  <h3 className={styles.sectionTitle}> Global Custom Patterns </h3>
                  {isLoadingPatterns ? (
                    <span className={styles.loadingIndicator}>Loading...</span>
                  ) : (
                    <span className={styles.timestamp}>{currentTimestamp}</span>
                  )}
                </div>
                <div ref={activeTab === 'global' ? editorContainerRef : null} className={styles.editorContainer}> {/* Optional: Add a container for styling */} 
                  <Editor
                    value={currentGlobalPatterns}
                    onValueChange={handleEditorChange}
                    highlight={(code) => {
                      // Use Prism.highlight and Prism.languages
                      try {
                        // Ensure the language is loaded before highlighting
                        if (Prism.languages.ignore) {
                          return Prism.highlight(code, Prism.languages.ignore, 'ignore');
                        } else {
                          console.warn("Prism language 'ignore' not loaded yet.");
                          return code; // Return unhighlighted if language missing
                        }
                      } catch (e) {
                        console.warn("Prism highlighting failed:", e);
                        return code; // Return plain code on error
                      }
                    }}
                    padding={10}
                    className={styles.patternsEditor} 
                    textareaClassName={styles.patternsEditorTextarea} 
                    style={{
                      // Use CSS variables for theme compatibility
                      backgroundColor: 'var(--background-primary)', 
                      fontFamily: 'var(--font-mono, "Fira code", "Fira Mono", monospace)', // Use theme mono font if available
                      fontSize: 14,
                      color: 'var(--text-primary)',
                      outline: 0,
                    }}
                    disabled={applyingPatterns}
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => resetIgnorePatterns(true)}
                    disabled={applyingPatterns}
                    title={buttonTooltips.reset}
                  >
                    Reset Global
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setCurrentGlobalPatterns('');
                      onExcludedSystemPatternsChange([]);
                    }}
                    disabled={applyingPatterns}
                    title={buttonTooltips.clear}
                  >
                    Clear Global
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    disabled={applyingPatterns}
                    title={buttonTooltips.cancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveGlobalPatterns}
                    disabled={applyingPatterns}
                    title={buttonTooltips.save}
                  >
                    {applyingPatterns ? 'Saving...' : 'Save'}
                  </Button>
                </div>
            </div>
          </>
        )}

        {/* Local Tab Content - Use Editor */}
        {activeTab === "local" && (
            <div className={styles.patternEntrySection}>
                <div className={styles.sectionHeader}> {/* New container for title + timestamp */}
                  <h3 className={styles.sectionTitle}> Local Custom Patterns </h3>
                  {isLoadingPatterns ? (
                    <span className={styles.loadingIndicator}>Loading...</span>
                  ) : (
                    <span className={styles.timestamp}>{currentTimestamp}</span>
                  )}
                </div>
                <div className={styles.folderSelector}>
                    <label htmlFor="folder-select-dropdown">Select Folder</label>
                    <div id="folder-select-dropdown" className={styles.customSelect} onClick={() => !applyingPatterns && setFolderSelectOpen(!folderSelectOpen)} aria-haspopup="listbox">
                        <div className={styles.selectedValue} role="button" aria-expanded={folderSelectOpen}>
                            {selectedFolder ? truncatePath(selectedFolder) : 'Select a folder'}
                            <ChevronDown size={16} className={`${styles.chevron} ${folderSelectOpen ? styles.open : ''}`} />
                        </div>
                        {folderSelectOpen && (
                        <div className={styles.optionsContainer} role="listbox">
                            {recentFolders.length > 0 ? (
                            recentFolders.map((folder, index) => (
                                <div key={index} className={styles.option} onClick={() => handleFolderChange(folder)} role="option" aria-selected={folder === selectedFolder}> {folder} </div>
                            ))
                            ) : (
                            <div className={styles.option} role="option" aria-disabled="true"> {selectedFolder || 'No recent folders'} </div>
                            )}
                        </div>
                        )}
                    </div>
                    <div className={styles.pathDisplay}> Path: {selectedFolder ? `${truncatePath(selectedFolder)}/.repo_ignore` : 'N/A'} </div>
                </div>
                <div ref={activeTab === 'local' ? editorContainerRef : null} className={styles.editorContainer}> {/* Optional: Add a container */} 
                  <Editor
                    value={currentLocalPatterns}
                    onValueChange={handleEditorChange}
                    highlight={(code) => {
                      // Use Prism.highlight and Prism.languages
                      try {
                        // Ensure the language is loaded before highlighting
                        if (Prism.languages.ignore) {
                          return Prism.highlight(code, Prism.languages.ignore, 'ignore');
                        } else {
                          console.warn("Prism language 'ignore' not loaded yet.");
                          return code; // Return unhighlighted if language missing
                        }
                      } catch (e) {
                        console.warn("Prism highlighting failed:", e);
                        return code; // Return plain code on error
                      }
                    }}
                    padding={10}
                    className={styles.patternsEditor} 
                    textareaClassName={styles.patternsEditorTextarea} 
                    style={{
                      // Use CSS variables for theme compatibility
                      backgroundColor: 'var(--background-primary)', 
                      fontFamily: 'var(--font-mono, "Fira code", "Fira Mono", monospace)', // Use theme mono font if available
                      fontSize: 14,
                      color: 'var(--text-primary)',
                      outline: 0,
                    }}
                    disabled={applyingPatterns || !selectedFolder}
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleResetLocal}
                    disabled={applyingPatterns || !selectedFolder}
                    title={buttonTooltips.reset}
                  >
                    Reset Local
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleClearLocal}
                    disabled={applyingPatterns || !selectedFolder}
                    title={buttonTooltips.clear}
                  >
                    Clear Local
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    disabled={applyingPatterns}
                    title={buttonTooltips.cancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={applyingPatterns || !selectedFolder}
                    title={buttonTooltips.save}
                  >
                    {applyingPatterns ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    variant="secondary"
                    size="sm" 
                    onClick={handleTestPatterns} 
                    disabled={applyingPatterns || isTestingPatterns || !selectedFolder}
                    title="Test current patterns against selected folder"
                    className={styles.testButton} 
                  >
                    {isTestingPatterns ? (
                      <Loader2 size={16} className={styles.loadingIcon} />
                    ) : (
                      <Play size={16} />
                    )}
                    Test
                  </Button>
                </div>
            </div>
        )}

        {/* Test Results Section (Conditionally Rendered) */}
        {(testResults || testError) && (
            <div className={styles.testResultsSection}>
              <h4 className={styles.testResultsHeader}>
                Test Results {testResults ? `(${testResults.ignoredCount} ignored / ${testResults.totalFilesChecked} total)` : ''}
              </h4>
              {testError && (
                <div className={`${styles.testResultItem} ${styles.testError}`}>Error: {testError}</div>
              )}
              {testResults && testResults.ignoredFiles.length > 0 && (
                <div className={styles.testResultsList}>
                  {testResults.ignoredFiles.map((file, index) => (
                    <div key={index} className={styles.testResultItem} title={file}>{file}</div>
                  ))}
                </div>
              )}
              {testResults && testResults.ignoredFiles.length === 0 && !testError && (
                <div className={`${styles.testResultItem} ${styles.noResults}`}>No files matched the current patterns.</div>
              )}
            </div>
          )}

        {/* Preview Section (Always visible) - Updated Render Logic */}
        <div className={styles.previewSection}>
            <div className={styles.previewContainer}>
                <div className={styles.previewHeader}>
                    <span>Effective Patterns Preview</span>
                    <span className={styles.patternCount}>
                        {actualPatternCount} active
                    </span>
                </div>
                {/* Check if mergedPreview is the new array structure */}
                {Array.isArray(mergedPreview) ? mergedPreview.map((lineData, index) => {
                    if (!lineData.pattern.trim() && lineData.source === 'comment') {
                       // Render empty lines used as separators differently if needed, or skip
                       return <div key={index} className={styles.previewSeparator}></div>;
                    }

                    let badgeText = '';
                    let lineClass = '';
                    let badgeClass = '';

                    switch (lineData.source) {
                      case 'system':
                        badgeText = 'System';
                        lineClass = styles.previewSystem;
                        badgeClass = styles.previewBadgeSystem;
                        break;
                      case 'global':
                        badgeText = 'Global';
                        lineClass = styles.previewGlobal;
                        badgeClass = styles.previewBadgeGlobal;
                        break;
                      case 'local':
                        badgeText = 'Local';
                        lineClass = styles.previewLocal;
                        badgeClass = styles.previewBadgeLocal;
                        break;
                      case 'comment':
                        lineClass = styles.previewComment;
                        break;
                      default:
                        // Should not happen with the new structure
                        lineClass = styles.previewUnknown;
                        break;
                    }

                    return (
                        <div key={index} className={`${styles.previewLine} ${lineClass}`}>
                            {/* Display pattern or comment header */}
                            <span className={styles.previewPatternText}>{lineData.pattern}</span>
                             {badgeText && <span className={`${styles.previewBadge} ${badgeClass}`}>{badgeText}</span>}
                        </div>
                    );
                }) : (
                  // Fallback for old string format (should ideally be removed later)
                  <div className={styles.previewLine}>Invalid preview format</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default IgnorePatternsWithErrorBoundary;