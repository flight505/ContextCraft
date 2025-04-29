#!/usr/bin/env node

/**
 * This script helps diagnose and fix path issues with the packaged app.
 * It checks for HTML files in various locations and can create a fixed symlink if needed.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('ContextCraft HTML Path Diagnostic/Fix Tool');
console.log('==========================================');

// Check for macOS
if (process.platform !== 'darwin') {
  console.error('This script is designed for macOS only. Your platform:', process.platform);
  process.exit(1);
}

// Find the app bundle
const APP_PATH = '/Applications/ContextCraft.app';
if (!fs.existsSync(APP_PATH)) {
  console.error(`App not found at ${APP_PATH}. Make sure the app is installed.`);
  process.exit(1);
}

console.log(`Found app at: ${APP_PATH}`);

// Check various paths
const possiblePaths = [
  // Path 1: Standard ASAR path
  path.join(APP_PATH, 'Contents/Resources/app.asar/dist/index.html'),
  
  // Path 2: Unpacked ASAR path
  path.join(APP_PATH, 'Contents/Resources/app.asar.unpacked/dist/index.html'),
  
  // Path 3: Direct Resources path 
  path.join(APP_PATH, 'Contents/Resources/dist/index.html'),
  
  // Path 4: Explicitly created extraFiles path
  path.join(APP_PATH, 'Contents/MacOS/dist/index.html'),
];

let foundHtmlFiles = [];
console.log('\nChecking for index.html files:');
for (const htmlPath of possiblePaths) {
  try {
    const exists = fs.existsSync(htmlPath);
    console.log(`- ${htmlPath}: ${exists ? 'EXISTS ✅' : 'NOT FOUND ❌'}`);
    
    if (exists) {
      foundHtmlFiles.push(htmlPath);
      
      // Check file size
      const stats = fs.statSync(htmlPath);
      console.log(`  - Size: ${stats.size} bytes`);
      
      // Check read permissions
      try {
        const content = fs.readFileSync(htmlPath, 'utf8').slice(0, 50) + '...';
        console.log(`  - Content preview: ${content}`);
      } catch (readErr) {
        console.error(`  - Error reading file: ${readErr.message}`);
      }
    }
  } catch (err) {
    console.error(`- Error checking ${htmlPath}: ${err.message}`);
  }
}

console.log('\nCreate symlinks for missing paths?');
console.log('This might help fix the app if the HTML file exists in one location but not another.');

// Only proceed if at least one HTML file was found
if (foundHtmlFiles.length === 0) {
  console.error('No index.html files found in any location! Cannot fix missing paths.');
  process.exit(1);
}

// Source path is the first existing HTML file
const sourcePath = foundHtmlFiles[0];
console.log(`\nWill use ${sourcePath} as the source for symlinks.`);

// Create directory for target symlinks if needed
for (const targetPath of possiblePaths) {
  if (targetPath !== sourcePath && !fs.existsSync(targetPath)) {
    const targetDir = path.dirname(targetPath);
    
    try {
      // Check if directory exists
      if (!fs.existsSync(targetDir)) {
        console.log(`Creating directory: ${targetDir}`);
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Create symlink
      console.log(`Creating symlink: ${targetPath} -> ${sourcePath}`);
      try {
        // Delete any existing file/link
        if (fs.existsSync(targetPath)) {
          fs.unlinkSync(targetPath);
        }
        
        // Create relative symlink
        const relativeSource = path.relative(path.dirname(targetPath), sourcePath);
        fs.symlinkSync(relativeSource, targetPath);
        console.log(`✅ Created symlink successfully!`);
      } catch (symlinkErr) {
        console.error(`❌ Error creating symlink (might need sudo): ${symlinkErr.message}`);
        console.log('Trying with sudo...');
        
        try {
          const command = `sudo ln -sf "${sourcePath}" "${targetPath}"`;
          execSync(command, { stdio: 'inherit' });
          console.log('✅ Created symlink with sudo successfully!');
        } catch (sudoErr) {
          console.error(`❌ Failed even with sudo: ${sudoErr.message}`);
        }
      }
    } catch (dirErr) {
      console.error(`❌ Error creating directory ${targetDir}: ${dirErr.message}`);
    }
  }
}

console.log('\nDiagnostic complete!');
console.log('Please try running the app again to see if the issues are resolved.');
console.log('If problems persist, try uninstalling and reinstalling the app.'); 