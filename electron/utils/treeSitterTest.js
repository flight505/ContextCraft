// Test file to verify tree-sitter loading
const path = require('path');
const fs = require('fs');

// Log the environment for debugging
console.log('========================================');
console.log('TREE-SITTER MODULE LOADER TEST');
console.log('========================================');
console.log('Current directory:', process.cwd());
console.log('resourcesPath:', process.resourcesPath || 'Not available');
console.log('appPath:', path.dirname(require.main.filename));
console.log('Module paths:', module.paths);
console.log('========================================');

// Try to load tree-sitter and each parser
const modules = [
  'tree-sitter',
  'tree-sitter-javascript',
  'tree-sitter-typescript',
  'tree-sitter-python',
  'tree-sitter-css',
  'tree-sitter-html'
];

function tryRequire(moduleName) {
  try {
    const mod = require(moduleName);
    console.log(`✓ Successfully loaded ${moduleName}`);
    return true;
  } catch (err) {
    console.error(`✗ Failed to load ${moduleName}: ${err.message}`);
    
    // Try alternative locations if this is a packaged app
    if (process.resourcesPath) {
      try {
        const unpackedPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', moduleName);
        console.log(`   Trying unpacked path: ${unpackedPath}`);
        if (fs.existsSync(unpackedPath)) {
          const mod = require(unpackedPath);
          console.log(`✓ Successfully loaded ${moduleName} from unpacked path`);
          return true;
        }
      } catch (altErr) {
        console.error(`   Failed to load from alternative path: ${altErr.message}`);
      }
    }
    
    return false;
  }
}

// Test each module
let success = true;
for (const moduleName of modules) {
  const result = tryRequire(moduleName);
  success = success && result;
}

console.log('========================================');
console.log(`Overall result: ${success ? '✓ All modules loaded' : '✗ Some modules failed to load'}`);
console.log('========================================');

module.exports = { success };
