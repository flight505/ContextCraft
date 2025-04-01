// System pattern categories - Moved from App.tsx
export const SYSTEM_PATTERN_CATEGORIES = {
    versionControl: [
      "**/.git/**",
      "**/.svn/**",
      "**/.hg/**",
      "**/.cvs/**" // Added .cvs
    ],
    buildOutput: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.output/**", // Added .output
      "**/.next/**",
    ],
    caches: [
      "**/.cache/**",
      "**/__pycache__/**",
      "**/.pytest_cache/**",
    ],
    logs: [
      "**/logs/**",
      "**/*.log",
    ],
    ide: [
      "**/.idea/**",
      "**/.vscode/**",
      "**/.vs/**",
    ],
    temp: [
      "**/tmp/**",
      "**/temp/**",
    ],
    os: [
      "**/.DS_Store",
      "**/Thumbs.db",
    ],
  };
  
  /**
   * Interface for ignore patterns state
   */
  export interface IgnorePatternsState {
    patterns: string;
    excludedSystemPatterns: string[];
  }
  
  /**
   * Parse ignore patterns content to extract disabled patterns and user patterns
   */
  export const parseIgnorePatternsContent = (content: string): { excludedPatterns: string[]; userPatterns: string } => {
    if (!content) {
      return { excludedPatterns: [], userPatterns: '' };
    }
    const lines = content.split('\n');
    const excludedPatterns: string[] = [];
    const userPatterns: string[] = [];
  
    let inUserSection = false;
  
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check for section headers
      if (trimmedLine === '# USER PATTERNS:') {
        inUserSection = true;
        return;
      }
      
      if (trimmedLine.startsWith('# DISABLED:')) {
        // Extract pattern removing the DISABLED marker
        const pattern = trimmedLine.substring('# DISABLED:'.length).trim();
        if (pattern) {
          excludedPatterns.push(pattern);
        }
      } else if (inUserSection && trimmedLine !== '' && !trimmedLine.startsWith('#')) {
        // In user section, add non-comment lines to user patterns
        userPatterns.push(line); // Keep original line to preserve indentation/whitespace
      } else if (!inUserSection && !trimmedLine.startsWith('#') && trimmedLine !== '') {
        // Not in user section yet, but found a pattern - also add to user patterns
        // This handles the case where user patterns aren't properly marked with a section
        userPatterns.push(line);
      }
      // Ignore empty lines and regular comments
    });
  
    // Ensure excluded patterns are unique
    const uniqueExcluded = Array.from(new Set(excludedPatterns));
  
    return {
      excludedPatterns: uniqueExcluded,
      userPatterns: userPatterns.join('\n')
    };
  };
  
  // --- Keep existing functions below if they are used ---
  
  // Pattern state update function (Example, confirm if used or remove)
  /*
  export const handlePatternStateUpdate = (patterns: string | string[]): string => {
    return Array.isArray(patterns) ? patterns.join('\n') : patterns;
  };
  */
  
  /**
   * Format global patterns for saving
   */
  /*
  export const formatPatternsForSaving = (
    state: IgnorePatternsState,
    systemPatterns: string[] = []
  ): string => {
    // Combine user patterns and non-excluded system patterns
    const userLines = state.patterns.split('\n').map(p => p.trim()).filter(p => p !== '');
    const activeSystemPatterns = systemPatterns.filter(p => !state.excludedSystemPatterns.includes(p));
    
    // Structure with comments might be helpful, but for now just combine
    // A simple approach: just save the user patterns string
    // If more complex logic is needed (like preserving comments or sections), adjust here
    return state.patterns; 
    // Alternative: Combine user and active system if needed for storage format
    // return [...userLines, ...activeSystemPatterns].join('\n');
  };
  */
  
  // Keep other potentially used exports like saveIgnoreStateToStorage if needed