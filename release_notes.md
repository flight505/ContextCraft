# ContextCraft v1.0.20

This release fixes module loading issues and improves build reliability.

## What's New

### Module Loading Improvements
- Fixed "Could not load chokidar from any location" error
- Properly classified chokidar as a development dependency
- Implemented better error handling for minimatch and other modules
- Added fallback implementations for critical modules when not available

### Build System Enhancements
- Updated rebuild-native-modules script to handle more modules
- Added comprehensive module testing capabilities
- Improved GitHub Actions workflow for better CI/CD compatibility
- Updated to Node.js 20 for building

### Development Experience
- Added test-modules scripts to verify module loading
- Enhanced error reporting and diagnostics
- Simplified development vs. production environment handling

### Stability Improvements
- Added fallback implementations for file watching when chokidar is unavailable
- Improved error handling throughout the application
- Better logging for troubleshooting

## Compatibility
- Windows: Improved module loading reliability
- macOS: Fixed signing and notarization process
- Linux: Maintained compatibility

This release focuses on stability and reliability, particularly for the build and packaging process.

# ContextCraft v1.0.19

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