/**
 * Browser-compatible path utilities to replace Node.js path module
 */

import { FileTreeMode } from "../types/FileTypes";
import _path from 'path'; // Prefix with underscore to indicate intentionally unused

/**
 * Normalizes a file path to use forward slashes regardless of operating system
 * This helps with path comparison across different platforms
 * 
 * @param filePath The file path to normalize
 * @returns The normalized path with forward slashes
 */
export function normalizePath(filePath: string): string {
  if (!filePath) return filePath;
  
  // Replace backslashes with forward slashes
  return filePath.replace(/\\/g, '/');
}

/**
 * Detects the operating system
 * 
 * @returns The detected operating system ('windows', 'mac', 'linux', or 'unknown')
 */
/*
export const detectOS = (): 'windows' | 'mac' | 'linux' | 'other' => {
  const platform = typeof process !== 'undefined' ? process.platform : (navigator.platform || '').toLowerCase();
  if (platform.startsWith('win')) return 'windows';
  if (platform.startsWith('darwin') || platform.startsWith('mac')) return 'mac';
  if (platform.startsWith('linux')) return 'linux';
  return 'other';
};
*/

/**
 * Compares two paths for equality, handling different OS path separators
 * 
 * @param path1 First path to compare
 * @param path2 Second path to compare
 * @returns True if the paths are equivalent, false otherwise
 */
export function arePathsEqual(path1: string, path2: string): boolean {
  return normalizePath(path1) === normalizePath(path2);
}

/**
 * Extract the basename from a path string
 * @param path The path to extract the basename from
 * @returns The basename (last part of the path)
 */
/*
const basename = (filePath: string): string => {
  // Basic implementation, consider edge cases
  const parts = normalizePath(filePath).split('/');
  return parts[parts.length - 1] || '';
};
*/

/**
 * Extract the directory name from a path string
 * @param path The path to extract the directory from
 * @returns The directory (everything except the last part)
 */
/*
export const dirname = (filePath: string): string => {
  const normalized = normalizePath(filePath);
  const lastSlash = normalized.lastIndexOf('/');
  if (lastSlash === -1) return '.'; // Root or no directory
  return normalized.substring(0, lastSlash) || '/'; // Handle root case
};
*/

/**
 * Join path segments together
 * @param segments The path segments to join
 * @returns The joined path
 */
/*
const join = (...paths: string[]): string => {
  // Basic implementation
  const joined = paths.map(p => normalizePath(p)).join('/');
  // Handle multiple slashes, etc. (more robust logic needed for full path.join mimicry)
  return joined.replace(/\/+/g, '/'); 
};
*/

/**
 * Get the file extension
 * @param path The path to get the extension from
 * @returns The file extension including the dot
 */
/*
export const extname = (filePath: string): string => {
  const name = basename(filePath);
  const lastDot = name.lastIndexOf('.');
  return lastDot > 0 ? name.substring(lastDot) : ''; // Check > 0 to avoid hidden files
};
*/

/**
 * Generate an ASCII representation of the file tree for the selected files
 * @param files Array of selected FileData objects
 * @param rootPath The root directory path
 * @param mode The FileTreeMode to use for generation
 * @returns ASCII string representing the file tree
 */
export function generateAsciiFileTree(
  files: { path: string }[], 
  rootPath: string,
  mode: FileTreeMode = "selected"
): string {
  if (!files.length) return "No files selected.";

  // Normalize the root path for consistent path handling
  const normalizedRoot = rootPath.replace(/\\/g, "/").replace(/\/$/, "");
  
  // Create a tree structure from the file paths
  interface TreeNode {
    name: string;
    isFile: boolean;
    children: Record<string, TreeNode>;
    // Add a flag to identify if this node contains a selected file
    hasSelectedFile?: boolean;
  }
  
  // Extract the root folder name from the path
  const rootName = normalizedRoot.split('/').filter(Boolean).pop() || 'root';
  
  const root: TreeNode = { 
    name: rootName, 
    isFile: false, 
    children: {},
    hasSelectedFile: false
  };
  
  // Insert a file path into the tree
  const insertPath = (filePath: string, node: TreeNode, isSelected: boolean = true) => {
    const normalizedPath = filePath.replace(/\\/g, "/");
    if (!normalizedPath.startsWith(normalizedRoot)) return;
    
    const relativePath = normalizedPath.substring(normalizedRoot.length).replace(/^\//, "");
    if (!relativePath) return;
    
    const pathParts = relativePath.split("/");
    let currentNode = node;
    
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const isFile = i === pathParts.length - 1;
      
      if (!currentNode.children[part]) {
        currentNode.children[part] = {
          name: part,
          isFile,
          children: {},
          hasSelectedFile: isSelected && isFile
        };
      }
      
      // If this file is selected, mark this node and all parent nodes
      if (isSelected && isFile && i === pathParts.length - 1) {
        currentNode.children[part].hasSelectedFile = true;
      }
      
      currentNode = currentNode.children[part];
    }
    
    // Mark parent directories as having selected files
    if (isSelected) {
      let tempNode = node;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (tempNode.children[part]) {
          tempNode.children[part].hasSelectedFile = true;
          tempNode = tempNode.children[part];
        }
      }
    }
  };
  
  // Insert files into the tree based on the mode
  if (mode === "complete") {
    // In complete mode, insert all files, marking the selected ones
    files.forEach(file => {
      // Determine if this file is among the selected files
      // This requires a full list of files, where some might be selected and others not
      const isSelected = "selected" in file ? Boolean(file.selected) : true;
      insertPath(file.path, root, isSelected);
    });
  } else {
    // In selected mode or selected-with-roots mode, all files we're given are selected
    files.forEach(file => insertPath(file.path, root, true));
  }
  
  // Generate ASCII representation
  const generateAscii = (node: TreeNode, prefix = "", isLast = true, isRoot = true): string => {
    // For selected-with-roots mode, only include nodes that have selected files
    if (mode === "selected-with-roots" && !node.hasSelectedFile && !isRoot) {
      return "";
    }
    
    if (!isRoot) {
      let result = prefix;
      result += isLast ? "└── " : "├── ";
      result += node.name;
      
      // In complete mode, mark selected files with a '*'
      if (mode === "complete" && node.hasSelectedFile && node.isFile) {
        result += " *";
      }
      
      result += "\n";
      prefix += isLast ? "    " : "│   ";
      
      const children = Object.values(node.children).sort((a, b) => {
        // Sort by type (directories first) then by name
        if (a.isFile !== b.isFile) {
          return a.isFile ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
      });
      
      return result + children
        .map((child, index) =>
          generateAscii(child, prefix, index === children.length - 1, false)
        )
        .join("");
    } else {
      // Root node special handling
      const children = Object.values(node.children).sort((a, b) => {
        // Sort by type (directories first) then by name
        if (a.isFile !== b.isFile) {
          return a.isFile ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
      });
      
      return children
        .map((child, index) => {
          // For selected-with-roots mode, only include nodes that have selected files
          if (mode === "selected-with-roots" && !child.hasSelectedFile) {
            return "";
          }
          return generateAscii(child, prefix, index === children.length - 1, false);
        })
        .join("");
    }
  };
  
  return generateAscii(root);
}