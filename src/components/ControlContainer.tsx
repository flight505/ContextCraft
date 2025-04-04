import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { FileTreeMode } from '../types/FileTypes';
import { OutputFormatType, OUTPUT_FORMAT_OPTIONS } from '../constants/outputFormats';
import { Switch, Button, ButtonGroup, DropdownAdapter } from './ui';
import { Copy, Download, Check, Loader2, AlertTriangle, RefreshCw, Search, Settings, Cpu, Zap } from 'lucide-react';
import styles from './ControlContainer.module.css';
import { ModelInfo } from "../types/ModelTypes";

// Define options for File Tree Mode Dropdown
const FILE_TREE_MODE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'selected', label: 'Selected Only' },
  { value: 'selected-with-roots', label: 'Selected with Path' },
  { value: 'complete', label: 'Complete Tree' },
];

interface ControlContainerProps {
  fileTreeMode: FileTreeMode;
  setFileTreeMode: (mode: FileTreeMode) => void;
  showUserInstructions: boolean;
  setShowUserInstructions: (show: boolean) => void;
  getSelectedFilesContent: () => Promise<string>; // Make async
  selectedFilesCount: number;
  outputFormat: OutputFormatType;
  setOutputFormat: (format: OutputFormatType) => void;
  // Add new props for model selection
  availableModels: ModelInfo[] | null;
  selectedModelId: string | null;
  onModelChange: (modelId: string | null) => void;
  // Add props for token info display
  totalTokenCount: number;
  selectedContextLength: number | null;
  // Add props for compression toggle
  isCompressionEnabled: boolean;
  setIsCompressionEnabled: (enabled: boolean) => void;
  // Add props for comment removal
  isCommentRemovalEnabled: boolean;
  setIsCommentRemovalEnabled: (enabled: boolean) => void;
  // Added missing props (can be used with underscore prefix)
  isElectron: boolean;
  processingStatus: 'idle' | 'processing' | 'complete' | 'error';
  onGenerateOutput: () => void;
  // Add new prop for model refreshing
  onRefreshModels?: () => Promise<void>;
  // Add new props for enhanced compression controls
  keepDocstrings: boolean;
  setKeepDocstrings: (keep: boolean) => void;
  removeEmptyLines: boolean;
  setRemoveEmptyLines: (remove: boolean) => void;
  neverCompressPatterns: string[];
  neverCompressPatternsRaw: string;
  setNeverCompressPatternsRaw: (patterns: string) => void;
  minCompressTokenThreshold: number;
  setMinCompressTokenThreshold: (threshold: number) => void;
  // Underscore-prefixed props for marking as intentionally unused
  _isElectron?: boolean;
  _processingStatus?: 'idle' | 'processing' | 'complete' | 'error';
  _onGenerateOutput?: () => void;
  _neverCompressPatterns?: string[];
}

const ControlContainer: React.FC<ControlContainerProps> = ({
  fileTreeMode,
  setFileTreeMode,
  showUserInstructions,
  setShowUserInstructions,
  getSelectedFilesContent,
  selectedFilesCount,
  outputFormat,
  setOutputFormat,
  // Destructure new props
  availableModels,
  selectedModelId,
  onModelChange,
  // Destructure token info props
  totalTokenCount,
  selectedContextLength,
  // Destructure compression props
  isCompressionEnabled,
  setIsCompressionEnabled,
  // Destructure comment removal props
  isCommentRemovalEnabled,
  setIsCommentRemovalEnabled,
  // Properly prefix unused props with underscore
  isElectron: _isElectron,
  processingStatus: _processingStatus,
  onGenerateOutput: _onGenerateOutput,
  // New prop for refreshing models
  onRefreshModels,
  // Destructure new props for enhanced compression controls
  keepDocstrings,
  setKeepDocstrings,
  removeEmptyLines,
  setRemoveEmptyLines,
  neverCompressPatterns: _neverCompressPatterns,
  neverCompressPatternsRaw,
  setNeverCompressPatternsRaw,
  minCompressTokenThreshold,
  setMinCompressTokenThreshold,
}) => {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false); // Add loading state for copy
  const [isDownloading, setIsDownloading] = useState(false); // Add loading state for download
  const [isRefreshingModels, setIsRefreshingModels] = useState(false); // Add loading state for model refresh
  const [modelSearchTerm, setModelSearchTerm] = useState(''); // State for model search
  const [activeTab, setActiveTab] = useState('configure'); // State for simple tab implementation
  const [showControls, setShowControls] = useState(true); // New state for controls visibility

  const handleCopy = useCallback(async () => {
    if (selectedFilesCount === 0 || isCopying) return;
    setIsCopying(true);
    setCopied(false); // Reset copied state
    try {
      const content = await getSelectedFilesContent(); // Await the async function
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // TODO: Show user error feedback
    } finally {
      setIsCopying(false);
    }
  }, [getSelectedFilesContent, selectedFilesCount, isCopying]); // Add dependencies

  const handleDownload = useCallback(async () => {
    if (selectedFilesCount === 0 || isDownloading) return;
    setIsDownloading(true);
    try {
        const content = await getSelectedFilesContent(); // Await the async function
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' }); // Specify charset
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Generate filename based on current context if possible
        const filename = `pastemax_output_${new Date().toISOString().split('T')[0]}.txt`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Failed to download:', err);
        // TODO: Show user error feedback
    } finally {
        setIsDownloading(false);
    }
  }, [getSelectedFilesContent, selectedFilesCount, isDownloading]); // Add dependencies

  // Handle model refresh
  const handleRefreshModels = useCallback(async () => {
    if (!onRefreshModels || isRefreshingModels) return;
    
    setIsRefreshingModels(true);
    try {
      await onRefreshModels();
    } catch (error) {
      console.error('Error refreshing models:', error);
    } finally {
      setIsRefreshingModels(false);
    }
  }, [onRefreshModels, isRefreshingModels]);

  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls(prev => !prev);
  };

  // Prepare model options, already available as prop 'availableModels'
  // No need to map here, adapter handles icon logic if any
  
  // Filter model options based on search term
  const filteredModelOptions = availableModels
    ? availableModels.filter(model => 
        model.name.toLowerCase().includes(modelSearchTerm.toLowerCase())
      ).map(model => ({ // Map to required { value, label } format for DropdownAdapter
          value: model.id,
          label: `${model.name} (${(model.context_length/1000).toLocaleString()}k)`,
        }))
    : [{ value: '', label: 'Loading models...', disabled: true }];

  // Check if token count exceeds the limit
  const exceedsLimit = selectedContextLength !== null && totalTokenCount > selectedContextLength;
  
  // Calculate percentage of token limit used
  const tokenPercentage = selectedContextLength ? Math.min(100, Math.round((totalTokenCount / selectedContextLength) * 100)) : 0;
  
  // Get token usage class
  const getTokenUsageClass = () => {
    if (tokenPercentage > 95) return styles.tokenDanger;
    if (tokenPercentage > 75) return styles.tokenWarning;
    if (tokenPercentage > 0) return styles.tokenGood;
    return '';
  };

  // Determine the width of the token bar with animation for visual appeal
  const [tokenBarWidth, setTokenBarWidth] = useState(0);
  
  // Animate token bar on changes similar to the file card implementation
  useEffect(() => {
    // Start with 0 width
    setTokenBarWidth(0);
    
    // Animate to the correct width with a slight delay for visual appeal
    const timer = setTimeout(() => {
      setTokenBarWidth(tokenPercentage);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [tokenPercentage]);

  // Function to render the search input for the model dropdown
  const renderModelSearchHeader = () => (
    <div className={styles.searchContainerLocal}>
      <Search size={14} className={styles.searchIconLocal} />
      <input
        type="text"
        placeholder="Search models..."
        value={modelSearchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setModelSearchTerm(e.target.value)}
        onClick={(e) => e.stopPropagation()} // Prevent click from closing dropdown
        onKeyDown={(e) => e.stopPropagation()} // Prevent arrow keys etc. from bubbling up
        className={styles.searchInputLocal}
        aria-label="Search models"
      />
    </div>
  );

  return (
    <div className={styles.controlContainer}>
      <div className={styles.controlContainerHeader}>
        <div className={styles.controlHeaderLeft}>
          <span>Controls</span>
          <Switch 
            checked={showControls} 
            onChange={() => toggleControls()}
            size="sm"
            className={styles.tinySwitch}
          />
          
          <div className={styles.headerActionButtons}>
            <ButtonGroup size="xs" variant="horizontal">
              <Button
                variant="ghost"
                iconOnly
                startIcon={isCopying ? <Loader2 size={12} className="animate-spin" /> : copied ? <Check size={12} /> : <Copy size={12} />}
                disabled={selectedFilesCount === 0 || isCopying || isDownloading}
                onClick={handleCopy}
                title={copied ? "Copied!" : "Copy content"}
              />
              <Button
                variant="ghost"
                iconOnly
                startIcon={isDownloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                disabled={selectedFilesCount === 0 || isCopying || isDownloading}
                onClick={handleDownload}
                title="Download as text file"
              />
            </ButtonGroup>
          </div>
        </div>
      </div>

      {showControls && (
        <>
          {showUserInstructions && (
            <div className={styles.controlInstructions}>
              <p>Select files from the sidebar to include them in your output.</p>
            </div>
          )}

          <div className={styles.simpleTabs}>
            <div className={styles.simpleTabsList}>
              <button 
                className={`${styles.simpleTabsTrigger} ${activeTab === 'configure' ? styles.simpleTabsTriggerActive : ''}`}
                onClick={() => setActiveTab('configure')}
              >
                <Settings size={12} />
                <span>Configure</span>
              </button>
              <button 
                className={`${styles.simpleTabsTrigger} ${activeTab === 'model' ? styles.simpleTabsTriggerActive : ''}`}
                onClick={() => setActiveTab('model')}
              >
                <Cpu size={12} />
                <span>Model</span>
              </button>
              <button 
                className={`${styles.simpleTabsTrigger} ${activeTab === 'optimize' ? styles.simpleTabsTriggerActive : ''}`}
                onClick={() => setActiveTab('optimize')}
              >
                <Zap size={12} />
                <span>Optimize</span>
              </button>
            </div>

            <div className={styles.simpleTabsContent}>
              {activeTab === 'configure' && (
                <div className={styles.controlGroup}>
                  <div className={styles.switchWithLabel}>
                    <Switch
                      checked={showUserInstructions}
                      onChange={() => setShowUserInstructions(!showUserInstructions)}
                      size="sm"
                      className={styles.tinySwitch}
                    />
                    <div>
                      <div className={styles.controlPrimary}>Show Instructions</div>
                      <div className={styles.controlHelp}>
                        Display helpful instructions for using the app
                      </div>
                    </div>
                  </div>

                  <div className={styles.controlItem}>
                    <div className={styles.controlLabel}>Output</div>
                    <DropdownAdapter
                      options={OUTPUT_FORMAT_OPTIONS}
                      value={outputFormat}
                      onChange={(val) => {
                        if (typeof val === 'string') {
                          setOutputFormat(val as OutputFormatType);
                        }
                      }}
                      placeholder="Format"
                      className={styles.configureDropdown}
                    />
                  </div>

                  <div className={styles.controlItem}>
                    <div className={styles.controlLabel}>Tree</div>
                    <DropdownAdapter
                      options={FILE_TREE_MODE_OPTIONS}
                      value={fileTreeMode}
                      onChange={(val) => {
                        if (typeof val === 'string') {
                          setFileTreeMode(val as FileTreeMode);
                        }
                      }}
                      placeholder="Tree Mode"
                      className={styles.configureDropdown}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'model' && (
                <div className={styles.controlGroup}>
                  <div className={styles.controlItem}>
                    <div className={styles.controlLabel}>Model</div>
                    <div className={styles.modelSelectorContainer}>
                      <DropdownAdapter
                        options={filteredModelOptions}
                        value={selectedModelId || ''}
                        onChange={(val) => {
                          if (typeof val === 'string') {
                            onModelChange(val || null);
                          }
                        }}
                        placeholder="Select Model"
                        renderHeader={renderModelSearchHeader}
                        className={styles.modelDropdown}
                      />
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        startIcon={isRefreshingModels ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        disabled={isRefreshingModels || !onRefreshModels}
                        onClick={handleRefreshModels}
                        title="Refresh available models"
                      />
                    </div>
                  </div>
                  
                  {/* Token usage indicator */}
                  <div className={styles.tokenInfo}>
                    <div className={styles.tokenCountText}>
                      {totalTokenCount.toLocaleString()} tokens
                      {selectedContextLength && ` / ${(selectedContextLength/1000).toLocaleString()}k context limit`}
                    </div>
                    
                    <div className={styles.tokenUsageBar}>
                      <div
                        className={`${styles.tokenUsageFill} ${getTokenUsageClass()}`}
                        style={{ 
                          width: `${tokenBarWidth}%`,
                          backgroundColor: exceedsLimit ? 'var(--error-color)' : 
                                          (tokenPercentage > 75 ? 'var(--warning-color)' : 'var(--accent-color)')
                        }}
                      />
                    </div>
                    
                    {exceedsLimit && (
                      <div className={styles.tokenWarning}>
                        <AlertTriangle size={12} style={{ marginRight: '6px' }} />
                        <span>Exceeds model context limit by {(totalTokenCount - selectedContextLength!).toLocaleString()} tokens</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'optimize' && (
                <div className={styles.controlGroup}>
                  <div className={styles.switchWithLabel}>
                    <Switch
                      checked={isCompressionEnabled}
                      onChange={() => setIsCompressionEnabled(!isCompressionEnabled)}
                      size="sm"
                      className={styles.tinySwitch}
                    />
                    <div>
                      <div className={styles.controlPrimary}>Compress Code</div>
                      <div className={styles.controlHelp}>
                        Reduces token count by removing code bodies from functions and methods
                      </div>
                    </div>
                  </div>
                  
                  {isCompressionEnabled && (
                    <>
                      <div className={styles.controlItem}>
                        <div className={styles.controlLabel}>Min Tokens to Compress</div>
                        <input
                          type="number"
                          min={1}
                          max={10000}
                          value={minCompressTokenThreshold}
                          onChange={(e) => setMinCompressTokenThreshold(parseInt(e.target.value) || 100)}
                          className={styles.numberInput}
                          title="Minimum token count for a file to be considered for compression"
                        />
                      </div>
                      
                      <div className={styles.controlItem}>
                        <div className={styles.controlLabel}>Never Compress Patterns</div>
                        <textarea
                          placeholder="Enter glob patterns (one per line)"
                          value={neverCompressPatternsRaw}
                          onChange={(e) => setNeverCompressPatternsRaw(e.target.value)}
                          className={styles.patternsTextarea}
                          title="Files matching these patterns will never be compressed"
                        />
                        <div className={styles.controlHelp}>
                          Enter glob patterns (one per line) for files/folders to exclude from body compression
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className={styles.switchWithLabel}>
                    <Switch
                      checked={isCommentRemovalEnabled}
                      onChange={() => setIsCommentRemovalEnabled(!isCommentRemovalEnabled)}
                      size="sm"
                      className={styles.tinySwitch}
                    />
                    <div>
                      <div className={styles.controlPrimary}>Remove Comments</div>
                      <div className={styles.controlHelp}>
                        Reduces token count by stripping comments from code files
                      </div>
                    </div>
                  </div>
                  
                  {isCommentRemovalEnabled && (
                    <div className={styles.switchWithLabel}>
                      <Switch
                        checked={keepDocstrings}
                        onChange={() => setKeepDocstrings(!keepDocstrings)}
                        size="sm"
                        className={styles.tinySwitch}
                        disabled={!isCommentRemovalEnabled}
                      />
                      <div>
                        <div className={styles.controlPrimary}>Keep Docstrings</div>
                        <div className={styles.controlHelp}>
                          Preserves documentation comments (e.g., JSDoc, Python docstrings) even if 'Remove Comments' is enabled
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.switchWithLabel}>
                    <Switch
                      checked={removeEmptyLines}
                      onChange={() => setRemoveEmptyLines(!removeEmptyLines)}
                      size="sm"
                      className={styles.tinySwitch}
                    />
                    <div>
                      <div className={styles.controlPrimary}>Remove Empty Lines</div>
                      <div className={styles.controlHelp}>
                        Removes blank lines from the output
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ControlContainer;