/**
 * Diagnostic script for macOS build issues
 * Checks the environment and configuration for common problems
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function runDiagnostics() {
  try {
    console.log('🔍 Running build diagnostics...');
    console.log('==================================');
    
    // Check system info
    console.log('\n📊 System Information:');
    console.log(`Platform: ${process.platform}`);
    console.log(`Architecture: ${process.arch}`);
    console.log(`Node.js version: ${process.version}`);
    console.log(`Current directory: ${process.cwd()}`);
    
    // Check for required build tools
    console.log('\n🔧 Build Environment:');
    try {
      const npmVersion = execSync('npm --version').toString().trim();
      console.log(`npm version: ${npmVersion}`);
    } catch (error) {
      console.log('npm version: Not found');
    }
    
    try {
      const nodeGyp = execSync('node-gyp --version').toString().trim();
      console.log(`node-gyp version: ${nodeGyp}`);
    } catch (error) {
      console.log('node-gyp: Not found or not in PATH');
    }
    
    // Check for electron-builder
    try {
      const electronBuilderVersion = execSync('npm list electron-builder').toString().trim();
      console.log(`electron-builder: ${electronBuilderVersion}`);
    } catch (error) {
      console.log('electron-builder: Error checking version');
    }
    
    // Check for code signing environment
    console.log('\n🔐 Code Signing Environment:');
    const cscAutoDiscovery = process.env.CSC_IDENTITY_AUTO_DISCOVERY || 'Not set';
    console.log(`CSC_IDENTITY_AUTO_DISCOVERY: ${cscAutoDiscovery}`);
    
    // Check for required macOS signing variables (safely without printing values)
    console.log('APPLE_ID: ' + (process.env.APPLE_ID ? 'Set' : 'Not set'));
    console.log('APPLE_APP_SPECIFIC_PASSWORD: ' + (process.env.APPLE_APP_SPECIFIC_PASSWORD ? 'Set' : 'Not set'));
    console.log('APPLE_TEAM_ID: ' + (process.env.APPLE_TEAM_ID ? 'Set' : 'Not set'));
    console.log('CSC_LINK: ' + (process.env.CSC_LINK ? 'Set' : 'Not set'));
    console.log('CSC_KEY_PASSWORD: ' + (process.env.CSC_KEY_PASSWORD ? 'Set' : 'Not set'));
    
    // On macOS, check for codesign availability and macOS-specific tools
    if (process.platform === 'darwin') {
      try {
        const codesignVersion = execSync('codesign --version').toString().trim();
        console.log(`\ncodesign: ${codesignVersion}`);
        
        // Check for available signing identities
        console.log('\n📝 Available Signing Identities:');
        const identities = execSync('security find-identity -v -p codesigning').toString().trim();
        console.log(identities || 'No signing identities found');
        
        // Check for additional macOS tools
        console.log('\n🍎 macOS Developer Tools:');
        try {
          const xcodeSelect = execSync('xcode-select -p').toString().trim();
          console.log(`Xcode Command Line Tools path: ${xcodeSelect}`);
        } catch (error) {
          console.log('Xcode Command Line Tools: Not found or not installed properly');
        }
        
        try {
          const hdiutil = execSync('hdiutil --version').toString().trim();
          console.log(`hdiutil (needed for DMG creation): ${hdiutil}`);
        } catch (error) {
          console.log('hdiutil: Not found or not working properly - DMG creation may fail');
        }
        
        try {
          const sw_vers = execSync('sw_vers').toString().trim();
          console.log(`macOS Version:\n${sw_vers}`);
        } catch (error) {
          console.log('Could not determine macOS version');
        }
        
        // Check for disk space
        try {
          const diskSpace = execSync('df -h /').toString().trim();
          console.log(`\nDisk Space:\n${diskSpace}`);
        } catch (error) {
          console.log('Could not check disk space');
        }
        
        // Check if keychain access is available (important for CI environments)
        try {
          console.log('\nKeychain Access:');
          const keychainList = execSync('security list-keychains').toString().trim();
          console.log(`Available keychains:\n${keychainList}`);
        } catch (error) {
          console.log('Could not access keychain - may indicate permission issues in CI');
        }
      } catch (error) {
        console.log('\nError checking codesign: ', error.message);
      }
    }
    
    // Check electron-builder cache
    console.log('\n🗂️ Electron Builder Cache:');
    const homedir = require('os').homedir();
    const electronBuilderCache = path.join(homedir, 'Library', 'Caches', 'electron-builder');
    if (fs.existsSync(electronBuilderCache)) {
      console.log(`electron-builder cache exists at: ${electronBuilderCache}`);
      try {
        const cacheItems = fs.readdirSync(electronBuilderCache);
        console.log('Cache contents:', cacheItems);
      } catch (error) {
        console.log('Error reading electron-builder cache:', error.message);
      }
    } else {
      console.log('electron-builder cache directory not found - this is normal for first builds');
    }
    
    // Check package.json configuration
    console.log('\n📦 Package.json Build Configuration:');
    try {
      const packageJson = require(path.join(process.cwd(), 'package.json'));
      if (packageJson.build && packageJson.build.mac) {
        console.log('Mac configuration found:');
        console.log(JSON.stringify(packageJson.build.mac, null, 2));
        
        // Specifically check for target configuration
        if (packageJson.build.mac.target) {
          console.log('\nMac target configuration:');
          console.log(JSON.stringify(packageJson.build.mac.target, null, 2));
          
          // Check if DMG is in the targets
          const hasDmgTarget = JSON.stringify(packageJson.build.mac.target).includes('dmg');
          console.log(`DMG in target configuration: ${hasDmgTarget ? 'Yes' : 'No - DMG won\'t be built!'}`);
        } else {
          console.log('No specific target configuration found - using defaults');
        }
      } else {
        console.log('No Mac build configuration found in package.json');
      }
      
      // Check the overall electron-builder configuration
      console.log('\nOverall electron-builder configuration:');
      console.log(`appId: ${packageJson.build.appId || 'Not set'}`);
      console.log(`productName: ${packageJson.build.productName || 'Not set'}`);
    } catch (error) {
      console.log('Error reading package.json: ', error.message);
    }
    
    // Check for release-builds directory and contents
    console.log('\n📁 Build Directories:');
    const releaseBuildDir = path.join(process.cwd(), 'release-builds');
    if (fs.existsSync(releaseBuildDir)) {
      console.log('release-builds directory exists');
      // List contents if it exists
      try {
        const files = fs.readdirSync(releaseBuildDir);
        console.log('Contents:', files);
        
        // Specific check for DMG files
        const dmgFiles = files.filter(f => f.endsWith('.dmg'));
        console.log(`DMG files found: ${dmgFiles.length > 0 ? dmgFiles.join(', ') : 'None'}`);
        
        // Check file permissions
        if (process.platform === 'darwin') {
          try {
            const permissions = execSync(`ls -la "${releaseBuildDir}"`).toString().trim();
            console.log(`Directory permissions:\n${permissions}`);
          } catch (error) {
            console.log('Could not check directory permissions');
          }
        }
      } catch (error) {
        console.log('Error reading directory: ', error.message);
      }
    } else {
      console.log('release-builds directory does not exist');
    }
    
    // Check dist directory as well
    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      console.log('\ndist directory exists (needed for packaging)');
      try {
        const distStats = fs.statSync(distDir);
        const fileSizeInMB = distStats.size / (1024 * 1024);
        console.log(`Size: ${fileSizeInMB.toFixed(2)} MB`);
        
        const distFiles = fs.readdirSync(distDir);
        console.log(`File count: ${distFiles.length}`);
      } catch (error) {
        console.log('Error reading dist directory: ', error.message);
      }
    } else {
      console.log('\ndist directory does not exist - packaging will fail without Vite build first');
    }
    
    console.log('\n==================================');
    console.log('✅ Diagnostics completed successfully');
    
    // Final recommendations
    console.log('\n📋 Recommendations:');
    if (process.platform === 'darwin') {
      if (process.env.CSC_IDENTITY_AUTO_DISCOVERY === 'false') {
        console.log('- Code signing is explicitly disabled, DMG files may not be properly created.');
        console.log('  For local testing only, this is fine.');
      } else if (!process.env.CSC_LINK && !process.env.APPLE_ID) {
        console.log('- No code signing credentials found. For proper DMG creation:');
        console.log('  1. Set up proper Apple Developer credentials, or');
        console.log('  2. Run with environment variable CSC_IDENTITY_AUTO_DISCOVERY=false');
      }
    }
    
  } catch (error) {
    console.error('❌ Diagnostics failed:', error.message);
    process.exit(1);
  }
}

// Run the diagnostics
runDiagnostics(); 