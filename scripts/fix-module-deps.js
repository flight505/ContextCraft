#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

console.log('🔍 Starting module dependency fixer...');

// Get the project root path
const projectRoot = path.resolve(__dirname, '..');
const nodeModulesPath = path.join(projectRoot, 'node_modules');
const tempDir = path.join(projectRoot, 'temp-resources');

// Ensure the temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

console.log('📂 Creating node_modules structure in temp directory...');
const tempNodeModules = path.join(tempDir, 'node_modules');
if (!fs.existsSync(tempNodeModules)) {
  fs.mkdirSync(tempNodeModules, { recursive: true });
}

// Also create the app.asar.unpacked/node_modules structure
const unpackedDir = path.join(tempDir, 'app.asar.unpacked');
if (!fs.existsSync(unpackedDir)) {
  fs.mkdirSync(unpackedDir, { recursive: true });
}
const unpackedNodeModules = path.join(unpackedDir, 'node_modules');
if (!fs.existsSync(unpackedNodeModules)) {
  fs.mkdirSync(unpackedNodeModules, { recursive: true });
}

// Create node_modules directory at the root of temp-resources
const tempRootNodeModules = path.join(tempDir, 'node_modules');
if (!fs.existsSync(tempRootNodeModules)) {
  fs.mkdirSync(tempRootNodeModules, { recursive: true });
}

// Modules to ensure are correctly copied
const modulesToCopy = [
  'readdirp',
  'micromatch',
  'braces',
  'picomatch',
  'fill-range',
  'to-regex-range',
  'is-number',
  'glob-parent',
  'is-binary-path',
  'is-glob',
  'is-extglob',
  'binary-extensions',
  'anymatch',
  'fsevents',
  'normalize-path'
];

// Verify that the modules exist in the node_modules directory
console.log('🔍 Verifying modules in node_modules...');
const missingModules = [];
modulesToCopy.forEach(moduleName => {
  const modulePath = path.join(nodeModulesPath, moduleName);
  
  if (!fs.existsSync(modulePath)) {
    // Skip fsevents on non-macOS platforms
    if (moduleName === 'fsevents' && os.platform() !== 'darwin') {
      console.log(`⚠️ Module ${moduleName} is skipped (macOS-only dependency)`);
    } else {
      console.log(`⚠️ Module ${moduleName} not found in node_modules`);
      missingModules.push(moduleName);
    }
  } else {
    console.log(`✅ Copied ${moduleName} to all locations`);
  }
});

if (missingModules.length > 0) {
  console.log('⚠️ Some modules are missing. Attempting to install them...');
  try {
    execSync(`npm install ${missingModules.join(' ')} --no-save`, { stdio: 'inherit' });
    console.log('✅ Installed missing modules');
  } catch (error) {
    console.error('❌ Failed to install missing modules:', error.message);
  }
}

// Copy each module to both locations
modulesToCopy.forEach(moduleName => {
  const sourcePath = path.join(nodeModulesPath, moduleName);
  if (fs.existsSync(sourcePath)) {
    // Copy to temp/node_modules
    const destPath = path.join(tempNodeModules, moduleName);
    copyRecursiveSync(sourcePath, destPath);
    
    // Copy to temp/app.asar.unpacked/node_modules
    const unpackedDestPath = path.join(unpackedNodeModules, moduleName);
    copyRecursiveSync(sourcePath, unpackedDestPath);
    
    // Copy to temp/node_modules (root level)
    const rootDestPath = path.join(tempRootNodeModules, moduleName);
    copyRecursiveSync(sourcePath, rootDestPath);
    
    console.log(`✅ Copied ${moduleName} to all locations`);
  } else {
    console.warn(`⚠️ Module ${moduleName} still not found after installation attempt`);
  }
});

// Helper function to copy directories recursively
function copyRecursiveSync(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // Read the source directory
  const files = fs.readdirSync(src);
  
  // Copy each file/directory
  files.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    // Get item stats
    const stats = fs.statSync(srcPath);
    
    if (stats.isDirectory()) {
      // Recursively copy directory
      copyRecursiveSync(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Verify module existence in the destination folders
console.log('\n🔍 Verifying modules in destination directories...');
[tempNodeModules, unpackedNodeModules, tempRootNodeModules].forEach(dir => {
  console.log(`\nChecking ${dir}:`);
  modulesToCopy.forEach(moduleName => {
    const modulePath = path.join(dir, moduleName);
    if (fs.existsSync(modulePath)) {
      console.log(`  ✅ ${moduleName} - exists`);
    } else {
      if (moduleName === 'fsevents' && os.platform() !== 'darwin') {
        console.log(`  ⚠️ ${moduleName} - skipped (macOS-only)`);
      } else {
        console.warn(`  ❌ ${moduleName} - missing`);
      }
    }
  });
});

console.log('\n📦 Module dependencies have been fixed and copied to temp-resources directory');
console.log('🔍 You can verify the modules by checking:');
console.log(`   - ${tempNodeModules}`);
console.log(`   - ${unpackedNodeModules}`);
console.log(`   - ${tempRootNodeModules}`);
console.log('\n✨ Done!'); 