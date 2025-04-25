#!/usr/bin/env node

/**
 * Diagnostic script for macOS build issues
 * Checks the environment and configuration for common problems
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('='.repeat(50));
console.log('BUILD ENVIRONMENT DIAGNOSTICS');
console.log('='.repeat(50));

// Output OS info
console.log('\n## OS Information:');
try {
  const osInfo = execSync('uname -a').toString().trim();
  console.log(`OS: ${osInfo}`);
} catch (error) {
  console.log('Error getting OS info:', error.message);
}

// Node & npm versions
console.log('\n## Node & NPM Versions:');
try {
  const nodeVersion = execSync('node -v').toString().trim();
  const npmVersion = execSync('npm -v').toString().trim();
  console.log(`Node: ${nodeVersion}`);
  console.log(`NPM: ${npmVersion}`);
} catch (error) {
  console.log('Error getting Node/NPM versions:', error.message);
}

// Check environment variables related to code signing
console.log('\n## Code Signing Environment Variables:');
const signingVars = ['CSC_LINK', 'CSC_KEY_PASSWORD', 'APPLE_ID', 'APPLE_APP_SPECIFIC_PASSWORD', 'APPLE_TEAM_ID'];
signingVars.forEach(variable => {
  console.log(`${variable}: ${process.env[variable] ? 'Set' : 'Not set'}`);
});

// Check package.json build config
console.log('\n## Package.json Build Configuration:');
try {
  const packageJson = require(path.join(process.cwd(), 'package.json'));
  console.log('Build configuration:');
  console.log(JSON.stringify(packageJson.build, null, 2));
  
  console.log('\nMac build configuration:');
  console.log(JSON.stringify(packageJson.build.mac, null, 2));
  
  console.log('\nElectron Builder version:');
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  console.log(`electron-builder: ${dependencies['electron-builder'] || 'Not found'}`);
} catch (error) {
  console.log('Error reading package.json:', error.message);
}

// Check for required files
console.log('\n## Required Files:');
const requiredFiles = [
  'build/entitlements.mac.plist',
  'public/favicon.icns'
];
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`${file}: ${exists ? 'Exists' : 'Missing'}`);
});

// List build directory contents
console.log('\n## Release Build Directory:');
try {
  const releaseBuildPath = path.join(process.cwd(), 'release-builds');
  if (fs.existsSync(releaseBuildPath)) {
    const files = fs.readdirSync(releaseBuildPath);
    console.log(`Contents of release-builds (${files.length} items):`);
    files.forEach(file => {
      const stats = fs.statSync(path.join(releaseBuildPath, file));
      console.log(`- ${file} (${stats.isDirectory() ? 'directory' : 'file'}, ${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    });
  } else {
    console.log('release-builds directory does not exist');
  }
} catch (error) {
  console.log('Error listing release-builds directory:', error.message);
}

// Check if electron-builder is installed
console.log('\n## Electron Builder Installation:');
try {
  const electronBuilderPath = require.resolve('electron-builder');
  console.log(`electron-builder installed at: ${electronBuilderPath}`);
  
  // Try to get version
  const version = execSync('npx electron-builder --version').toString().trim();
  console.log(`electron-builder version: ${version}`);
} catch (error) {
  console.log('Error checking electron-builder:', error.message);
}

console.log('\n='.repeat(50));
console.log('END OF DIAGNOSTICS');
console.log('='.repeat(50)); 