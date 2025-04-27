#!/usr/bin/env node

/**
 * Helper script for macOS builds
 * Ensures proper C++ standard is used for native modules
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createInterface } = require('readline');

const args = process.argv.slice(2);
const skipSigning = args.includes('--skip-signing');
const verbose = args.includes('--verbose');

// Log helper function that only outputs when verbose is enabled
function log(message) {
  if (verbose) {
    console.log(message);
  }
}

// Directory cleanup helper
function cleanupDirectory(directory) {
  log(`Cleaning up directory: ${directory}`);
  if (fs.existsSync(directory)) {
    log('Directory exists, removing...');
    fs.rmSync(directory, { recursive: true, force: true });
  }
  fs.mkdirSync(directory, { recursive: true });
  log(`Created clean directory: ${directory}`);
}

// Check executable permissions and fix if needed
function ensureExecutablePermissions(appPath) {
  log(`Ensuring executable permissions for: ${appPath}`);
  const macOSDir = path.join(appPath, 'Contents', 'MacOS');
  
  if (fs.existsSync(macOSDir)) {
    log(`Found MacOS directory: ${macOSDir}`);
    const files = fs.readdirSync(macOSDir);
    
    log(`Found ${files.length} files in MacOS directory`);
    files.forEach(file => {
      const filePath = path.join(macOSDir, file);
      log(`Setting executable permissions for: ${filePath}`);
      try {
        fs.chmodSync(filePath, '755');
        const stats = fs.statSync(filePath);
        log(`New permissions for ${file}: ${stats.mode.toString(8)}`);
      } catch (error) {
        console.error(`Error setting permissions for ${filePath}:`, error);
      }
    });
  } else {
    console.error(`MacOS directory not found: ${macOSDir}`);
  }
}

// Function to list all files in a directory recursively
function listFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      listFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main build function
async function buildMacApp() {
  try {
    log('Starting macOS build process...');
    
    // Clean up previous builds
    const releasePath = path.resolve(__dirname, '../release-builds');
    cleanupDirectory(releasePath);
    
    // Build command construction
    let buildCommand = 'npx electron-builder --mac';
    
    if (skipSigning) {
      log('Skipping code signing (--skip-signing flag detected)');
      buildCommand += ' --publish=never';
      
      // Set environment variables to skip code signing
      process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
      log('Environment variables set for build:');
      log(`- CSC_IDENTITY_AUTO_DISCOVERY: ${process.env.CSC_IDENTITY_AUTO_DISCOVERY}`);
      log(`- DISABLE_NOTARIZATION: ${process.env.DISABLE_NOTARIZATION}`);
      log(`- CI: ${process.env.CI}`);
    } else {
      log('Code signing will be attempted');
      
      // Check for required environment variables
      const requiredEnvVars = ['CSC_LINK', 'CSC_KEY_PASSWORD', 'APPLE_ID', 'APPLE_APP_SPECIFIC_PASSWORD', 'APPLE_TEAM_ID'];
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        console.warn(`⚠️ Warning: Missing required environment variables for code signing: ${missingVars.join(', ')}`);
        console.warn('Code signing may fail without these variables.');
        
        // Detect if running in CI environment
        const isCI = process.env.CI === 'true' || process.env.CI === true;
        
        if (isCI) {
          // In CI, automatically continue without signing
          log('CI environment detected - automatically continuing without code signing');
          process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
          buildCommand += ' --publish=never';
        } else {
          // Only prompt in interactive environments
        const readline = createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const response = await new Promise(resolve => {
          readline.question('Continue with build without code signing? (y/n) ', answer => {
            readline.close();
            resolve(answer.toLowerCase());
          });
        });
        
        if (response === 'y' || response === 'yes') {
          log('Continuing with build without code signing');
          process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
          buildCommand += ' --publish=never';
        } else {
          console.log('Build canceled by user');
          process.exit(1);
        }
      }
      }
    }
    
    // When skipping signing, explicitly disable notarization as well
    if (skipSigning || process.env.CSC_IDENTITY_AUTO_DISCOVERY === 'false') {
      process.env.DISABLE_NOTARIZATION = 'true';
    }
    
    // Run the Vite build first
    log('Running Vite build...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Execute the build command
    log(`Executing build command: ${buildCommand}`);
    execSync(buildCommand, { 
      stdio: 'inherit',
      env: {
        ...process.env,
        DEBUG: process.env.DEBUG || 'electron-builder,electron-osx-sign*'
      }
    });
    
    // Check the output
    log('Checking build output...');
    if (!fs.existsSync(releasePath)) {
      console.error('Error: Release directory not found after build!');
      process.exit(1);
    }
    
    // Look for app bundles and fix permissions
    const appBundles = fs.readdirSync(releasePath)
      .filter(file => file.endsWith('.app'))
      .map(file => path.join(releasePath, file));
    
    if (appBundles.length === 0) {
      console.warn('No .app bundles found in release directory!');
    } else {
      log(`Found ${appBundles.length} app bundle(s):`);
      appBundles.forEach(appPath => {
        log(`- ${appPath}`);
        ensureExecutablePermissions(appPath);
      });
    }
    
    // List all output files
    const outputFiles = fs.readdirSync(releasePath);
    log('Build output files:');
    outputFiles.forEach(file => {
      const filePath = path.join(releasePath, file);
      const stats = fs.statSync(filePath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      log(`- ${file} (${fileSizeMB} MB)`);
    });
    
    // Check specifically for DMG files
    const dmgFiles = outputFiles.filter(file => file.endsWith('.dmg'));
    if (dmgFiles.length === 0) {
      console.warn('⚠️ Warning: No DMG files found in the output!');
      
      // If we have app bundles but no DMG, try to create a DMG
      if (appBundles.length > 0) {
        log('Attempting to create DMG manually...');
        const appPath = appBundles[0];
        const appName = path.basename(appPath, '.app');
        const dmgPath = path.join(releasePath, `${appName}-manual.dmg`);
        
        try {
          log(`Creating DMG from ${appPath} to ${dmgPath}`);
          execSync(`hdiutil create -volname "${appName}" -srcfolder "${appPath}" -ov -format UDZO "${dmgPath}"`, { 
            stdio: verbose ? 'inherit' : 'pipe' 
          });
          
          if (fs.existsSync(dmgPath)) {
            const stats = fs.statSync(dmgPath);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            console.log(`✅ Successfully created manual DMG: ${dmgPath} (${fileSizeMB} MB)`);
          } else {
            console.error('Failed to create manual DMG');
          }
        } catch (error) {
          console.error('Error creating manual DMG:', error.message);
        }
      }
    } else {
      log(`Found ${dmgFiles.length} DMG file(s):`);
      dmgFiles.forEach(file => {
        const filePath = path.join(releasePath, file);
        const stats = fs.statSync(filePath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        log(`- ${file} (${fileSizeMB} MB)`);
      });
    }
    
    // Check for ZIP files
    const zipFiles = outputFiles.filter(file => file.endsWith('.zip'));
    if (zipFiles.length === 0) {
      console.warn('⚠️ Warning: No ZIP files found in the output!');
    } else {
      log(`Found ${zipFiles.length} ZIP file(s):`);
      zipFiles.forEach(file => {
        const filePath = path.join(releasePath, file);
        const stats = fs.statSync(filePath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        log(`- ${file} (${fileSizeMB} MB)`);
      });
    }
    
    // Create a build info file
    const buildInfoPath = path.join(releasePath, 'build-info.json');
    const buildInfo = {
      timestamp: new Date().toISOString(),
      skipSigning: skipSigning,
      files: outputFiles.map(file => ({
        name: file,
        size: fs.statSync(path.join(releasePath, file)).size,
        path: path.join(releasePath, file)
      }))
    };
    
    fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
    log(`Build info written to ${buildInfoPath}`);
    
    console.log('✅ macOS build completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error during macOS build:', error.message);
    if (error.stdout) console.error('stdout:', error.stdout.toString());
    if (error.stderr) console.error('stderr:', error.stderr.toString());
    return false;
  }
}

// Run the build process
buildMacApp().then(success => {
  process.exit(success ? 0 : 1);
}); 