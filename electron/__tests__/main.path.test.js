const path = require('path');
// Assuming normalizePath is exported from main.js or a utils file
// If main.js isn't easily requireable due to Electron dependencies,
// consider extracting normalizePath to a separate utility file.
// For now, let's assume it's exported correctly.
const { normalizePath } = require('../main.js'); // Adjust path if needed

describe('Path Utilities in main.js', () => {

  describe('normalizePath', () => {
    it('should replace backslashes with forward slashes', () => {
      expect(normalizePath('C:\\Users\\Test\\Project\\file.txt')).toBe('C:/Users/Test/Project/file.txt');
    });

    it('should handle mixed slashes', () => {
      expect(normalizePath('C:/Users\\Test/Project\\file.txt')).toBe('C:/Users/Test/Project/file.txt');
    });

    it('should handle already normalized paths', () => {
      expect(normalizePath('C:/Users/Test/Project/file.txt')).toBe('C:/Users/Test/Project/file.txt');
    });

    it('should handle paths without drive letters (relative)', () => {
      expect(normalizePath('src\\components\\button.js')).toBe('src/components/button.js');
    });

    it('should handle UNC paths (Windows network paths)', () => {
      expect(normalizePath('\\\\Server\\Share\\Folder\\file.txt')).toBe('//Server/Share/Folder/file.txt');
    });

    it('should return empty string for empty input', () => {
      expect(normalizePath('')).toBe('');
    });

    it('should return null for null input', () => {
      expect(normalizePath(null)).toBe(null);
    });

    it('should return undefined for undefined input', () => {
      expect(normalizePath(undefined)).toBe(undefined);
    });
  });

  describe('Relative Path Calculation (Simulating Windows)', () => {
    const rootDirWin = 'C:\\Users\\Test\\Project';

    it('should calculate correct relative path for a file in a subdirectory', () => {
      const filePathWin = 'C:\\Users\\Test\\Project\\src\\utils\\helper.js';
      // Use path.win32.relative to force Windows path logic
      const relativeWin = path.win32.relative(rootDirWin, filePathWin); // Expected: 'src\\utils\\helper.js'
      expect(normalizePath(relativeWin)).toBe('src/utils/helper.js');
    });

    it('should calculate correct relative path for a file in the root directory', () => {
      const filePathWin = 'C:\\Users\\Test\\Project\\README.md';
      const relativeWin = path.win32.relative(rootDirWin, filePathWin); // Expected: 'README.md'
      expect(normalizePath(relativeWin)).toBe('README.md');
    });

    it('should handle paths with spaces', () => {
      const rootDirWithSpace = 'C:\\Users\\Test User\\My Project';
      const filePathWithSpace = 'C:\\Users\\Test User\\My Project\\src\\app file.js';
      const relativeWin = path.win32.relative(rootDirWithSpace, filePathWithSpace); // Expected: 'src\\app file.js'
      expect(normalizePath(relativeWin)).toBe('src/app file.js');
    });

    it('should return an empty string if paths are identical', () => {
      const filePathWin = 'C:\\Users\\Test\\Project';
      const relativeWin = path.win32.relative(rootDirWin, filePathWin); // Expected: ''
      expect(normalizePath(relativeWin)).toBe('');
    });

    // Note: path.relative behavior when rootDir and filePath are on different drives
    // on Windows usually returns the absolute filePath. normalizePath should still work.
    it('should handle paths on different drives (returns absolute path)', () => {
      const rootDirD = 'D:\\Another\\Folder';
      const filePathC = 'C:\\Users\\Test\\Project\\file.txt';
      const relativeWin = path.win32.relative(rootDirD, filePathC); // Expected: 'C:\\Users\\Test\\Project\\file.txt'
      expect(normalizePath(relativeWin)).toBe('C:/Users/Test/Project/file.txt');
    });
  });

});