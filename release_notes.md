# ContextCraft v1.0.2

This release includes important fixes for Windows compatibility and several UI improvements.

## What's New

### Windows Build Fix
- Fixed port mismatch issue in development mode
- Electron application now correctly connects to Vite on port 5173 instead of 3000
- Added cross-env package for cross-platform environment variables
- Improved handling of ELECTRON_START_URL environment variable

### Path Handling Improvements
- Fixed file tree display issues on Windows
- Implemented proper handling of Windows paths and drive letters
- Added relativePath property to file objects for consistent cross-platform path handling
- Modified file tree building to use pre-calculated relative paths
- Ensured compatibility with existing code through fallback mechanisms

### File Selection & Copy Fix
- Fixed issues with file selection and content copying on Windows
- Ensured consistent mapping between displayed paths and actual file paths
- Improved path normalization across the application

### File Exclusion Improvements
- Modified filter functions to consistently filter out excluded files
- Ensured synchronization between file tree and file cards
- Prevented excluded files from appearing in search results

### UI Improvements
- Reduced excessive toast notifications
- Added comprehensive wiki documentation
- Improved AI interaction prompts

### Performance Considerations
- Maintained efficient debouncing (200ms)
- Optimized dependency arrays in React components
- Implemented safety mechanisms to prevent UI hanging

## Compatibility
- Windows: Fixed major compatibility issues
- macOS: Maintained existing functionality 
- Linux: Improvements should apply equally

This release significantly improves the Windows experience while maintaining compatibility with macOS and Linux. 