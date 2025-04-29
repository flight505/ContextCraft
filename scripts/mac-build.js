#!/usr/bin/env node

/**
 * Helper script for macOS builds using electron-builder.
 * Handles environment setup for signing/notarization (or skipping),
 * executes the build, ensures executable permissions, checks for output artifacts (DMG, ZIP),
 * provides a fallback to manually create a DMG if needed, and generates a build-info file.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createInterface } = require('readline');

// Load environment variables from .env file for local builds only
// This won't override existing env vars (like GitHub Actions secrets)
const isCI = process.env.CI === 'true' || process.env.CI === true;
if (!isCI) {
  try {
    const dotenv = require('dotenv');
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      console.log('[mac-build.js] Loading environment variables from .env file for local build');
      dotenv.config({ path: envPath });
    }
  } catch (err) {
    console.warn('[mac-build.js] Warning: Failed to load .env file:', err.message);
  }
}

const args = process.argv.slice(2);
const skipSigning = args.includes('--skip-signing');
const verbose = args.includes('--verbose');

// Log helper function that only outputs when verbose is enabled
function log(message) {
  if (verbose) {
    console.log(`[mac-build.js] ${message}`); // Added prefix for clarity
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

// Debug function to test tree-sitter loading
function testTreeSitterLoading() {
  log('Testing tree-sitter module loading...');
  const modules = [
    'tree-sitter',
    'tree-sitter-javascript',
    'tree-sitter-typescript',
    'tree-sitter-python',
    'tree-sitter-css',
    'tree-sitter-html'
  ];
  
  for (const moduleName of modules) {
    try {
      log(`Trying to require ${moduleName}...`);
      require(moduleName);
      log(`✓ Successfully loaded ${moduleName}`);
    } catch (err) {
      log(`✗ Failed to load ${moduleName}: ${err.message}`);
      
      // Try to find the module in node_modules
      const modulePath = path.join(process.cwd(), 'node_modules', moduleName);
      if (fs.existsSync(modulePath)) {
        log(`Module directory exists at: ${modulePath}`);
        
        // Check for package.json
        const packageJsonPath = path.join(modulePath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          log(`Package version: ${packageJson.version}`);
          log(`Main: ${packageJson.main}`);
        } else {
          log('No package.json found for module');
        }
      } else {
        log(`Module directory not found at: ${modulePath}`);
      }
    }
  }
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
      try {
        const stats = fs.statSync(filePath);
        // Check if it's a file and doesn't already have execute permission for user
        if (stats.isFile() && !(stats.mode & fs.constants.S_IXUSR)) {
           log(`Setting executable permissions (755) for: ${filePath}`);
           fs.chmodSync(filePath, '755');
           const updatedStats = fs.statSync(filePath);
           log(`New permissions for ${file}: ${updatedStats.mode.toString(8)}`);
        } else if (!stats.isFile()) {
            log(`Skipping permissions for non-file: ${filePath}`);
        } else {
            log(`Executable permissions already set for: ${filePath} (${stats.mode.toString(8)})`);
        }
      } catch (error) {
        console.error(`Error processing permissions for ${filePath}:`, error);
      }
    });
  } else {
    console.error(`MacOS directory not found: ${macOSDir}`);
  }
}

// Add new attemptForceDetach function
async function attemptForceDetach(dmgFilePath) {
  const dmgName = path.basename(dmgFilePath);
  log(`Attempting to ensure DMG is detached: ${dmgName}`);

  // Try to find the associated /dev/disk identifier using hdiutil info
  // This is more reliable than guessing or hardcoding /dev/diskX
  let diskIdentifier = null;
  try {
    // List attached images and grep for the DMG filename or a known volume name
    // NOTE: Adjust grep pattern if your volume name is different from the DMG name base
    const hdiutilInfo = execSync(`hdiutil info | grep "${dmgName}" | grep "/dev/disk"`).toString();
    const match = hdiutilInfo.match(/(\/dev\/disk\d+)/);
    if (match && match[1]) {
      diskIdentifier = match[1];
      log(`Found potentially mounted disk identifier: ${diskIdentifier} for ${dmgName}`);
    } else {
      log(`No specific /dev/disk found mounted for ${dmgName}. It might already be detached.`);
      return true; // Assume detached if not found in info
    }
  } catch (infoError) {
    // Grep failing likely means it's not mounted, which is good.
    log(`Info check suggests ${dmgName} is not mounted or inaccessible.`);
    return true;
  }

  log(`Attempting to detach ${diskIdentifier}...`);
  const maxRetries = 5;
  let success = false;
  for (let i = 1; i <= maxRetries; i++) {
    try {
      // Use -force and -quiet
      execSync(`hdiutil detach "${diskIdentifier}" -force -quiet`);
      log(`Successfully detached ${diskIdentifier} on attempt ${i}.`);
      success = true;
      break; // Exit loop on success
    } catch (error) {
      log(`Detach attempt ${i} for ${diskIdentifier} failed (Code: ${error.status}). Retrying in ${i * 2}s...`);
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, i * 2000)); // Wait 2, 4, 6, 8 seconds
      } else {
        console.error(`❌ Failed to detach ${diskIdentifier} after ${maxRetries} attempts.`);
        if (error.stderr) console.error("Last detach stderr:", error.stderr.toString());
        if (error.stdout) console.error("Last detach stdout:", error.stdout.toString());
        // Optionally, try detaching by mount point if known (less reliable)
        // Example: execSync(`diskutil unmount force /Volumes/YourVolumeName`);
      }
    }
  }
  return success;
}

// Main build function
async function buildMacApp() {
  let buildSuccess = false; // Track overall success
  
  // Define release path outside try/catch so it's available in finally block
  const releasePath = path.resolve(__dirname, '../release-builds');
  
  try {
    log('Starting macOS build process...');

    // Define release path relative to the script location
    cleanupDirectory(releasePath);

    // Build command construction
    let buildCommand = 'npx electron-builder --mac';

    // --- Signing Logic ---
    if (skipSigning) {
      log('Skipping code signing (--skip-signing flag detected).');
      buildCommand += ' --publish=never';

      // Set environment variables to disable signing/notarization
      process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
      process.env.DISABLE_NOTARIZATION = 'true'; // Explicitly disable notarization when skipping
      log('Set CSC_IDENTITY_AUTO_DISCOVERY=false');
      log('Set DISABLE_NOTARIZATION=true');

    } else {
      log('Code signing will be attempted.');

      // Check for required environment variables for signing
      const requiredEnvVars = ['CSC_LINK', 'CSC_KEY_PASSWORD', 'APPLE_ID', 'APPLE_APP_SPECIFIC_PASSWORD', 'APPLE_TEAM_ID'];
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

      if (missingVars.length > 0) {
        console.warn(`⚠️ Warning: Missing required environment variables for code signing: ${missingVars.join(', ')}`);
        console.warn('Signing and notarization might fail or be skipped by electron-builder.');

        // Detect if running in CI environment
        const isCI = process.env.CI === 'true' || process.env.CI === true;

        if (isCI) {
          // In CI, automatically decide based on missing vars (or let electron-builder handle it)
          // Forcing skip if critical vars are missing might be safer
          log('CI environment detected with missing signing variables. Forcing skip signing.');
          process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
          process.env.DISABLE_NOTARIZATION = 'true';
          buildCommand += ' --publish=never';
          log('Set CSC_IDENTITY_AUTO_DISCOVERY=false');
          log('Set DISABLE_NOTARIZATION=true');
        } else {
          // Only prompt in interactive environments
          const readline = createInterface({
            input: process.stdin,
            output: process.stdout
          });

          const response = await new Promise(resolve => {
            readline.question('Continue build potentially without full code signing/notarization? (y/n) ', answer => {
              readline.close();
              resolve(answer.toLowerCase());
            });
          });

          if (response === 'y' || response === 'yes') {
            log('User chose to continue despite missing signing variables.');
            // Let electron-builder attempt signing with available info, or potentially fail.
            // Alternatively, force skip here too:
            // process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
            // process.env.DISABLE_NOTARIZATION = 'true';
            // buildCommand += ' --publish=never';
          } else {
            console.log('Build canceled by user due to missing signing variables.');
            process.exit(1);
          }
        }
      } else {
         log('All required signing environment variables appear to be set.');
         // If you intend to notarize, ensure DISABLE_NOTARIZATION is not true
         // delete process.env.DISABLE_NOTARIZATION; // Or set to 'false' if needed
      }
    }

    // Ensure notarization is explicitly disabled if we forced CSC_IDENTITY_AUTO_DISCOVERY=false
    if (process.env.CSC_IDENTITY_AUTO_DISCOVERY === 'false') {
        process.env.DISABLE_NOTARIZATION = 'true';
        log('Ensured DISABLE_NOTARIZATION=true due to CSC_IDENTITY_AUTO_DISCOVERY=false');
    }

    // --- VITE BUILD STEP IS REMOVED - Assumed to be run by the CI workflow before this script ---

    // Execute the electron-builder command
    log(`Executing build command: ${buildCommand}`);
    log(`Using environment: CSC_IDENTITY_AUTO_DISCOVERY=${process.env.CSC_IDENTITY_AUTO_DISCOVERY}, DISABLE_NOTARIZATION=${process.env.DISABLE_NOTARIZATION}, CI=${process.env.CI}`);
    const buildEnv = { 
      ...process.env, 
      npm_config_cxx_std: 'c++20', 
      CXXFLAGS: '-std=c++20',
      // Enable parallel code signing for faster builds
      CSC_PARALLEL_SIGNING: 'true',
      CSC_NUM_THREADS: '16'  // Adjust based on available CPU cores
    };
    try {
      execSync(buildCommand, {
        stdio: 'inherit', // Show electron-builder output directly
        env: buildEnv
      });
    } catch (buildError) {
       console.error('❌ Error during electron-builder execution.');
       // error object from execSync already includes details, no need to log stdout/stderr again unless needed
       throw buildError; // Re-throw to be caught by the outer catch block
    }

    // --- Post-Build Checks ---
    log('Checking build output...');
    if (!fs.existsSync(releasePath)) {
      console.error(`Error: Release directory '${releasePath}' not found after build! Check electron-builder config.`);
      process.exit(1);
    }

    // Look for app bundles and fix permissions
    const appBundles = fs.readdirSync(releasePath)
      .filter(file => file.endsWith('.app') && fs.statSync(path.join(releasePath, file)).isDirectory())
      .map(file => path.join(releasePath, file));

    // Check the mac-arm64 subdirectory as well
    const macArm64Path = path.join(releasePath, 'mac-arm64');
    if (fs.existsSync(macArm64Path) && fs.statSync(macArm64Path).isDirectory()) {
      const macArm64Bundles = fs.readdirSync(macArm64Path)
        .filter(file => file.endsWith('.app') && fs.statSync(path.join(macArm64Path, file)).isDirectory())
        .map(file => path.join(macArm64Path, file));
      appBundles.push(...macArm64Bundles);
    }

    if (appBundles.length === 0) {
      console.warn('⚠️ Warning: No .app bundles found in release directory!');
    } else {
      log(`Found ${appBundles.length} app bundle(s). Ensuring executable permissions...`);
      appBundles.forEach(appPath => {
        log(`- Processing: ${appPath}`);
        ensureExecutablePermissions(appPath);
      });
    }

    // List all output files and check for DMG/ZIP
    let outputFiles = [];
    try {
        outputFiles = fs.readdirSync(releasePath);
    } catch (readError) {
        console.error(`Error reading release directory ${releasePath}: ${readError.message}`);
        // Continue if possible, maybe the dir exists but is unreadable
    }

    log(`Build output contents in ${releasePath}:`);
    outputFiles.forEach(file => {
      const filePath = path.join(releasePath, file);
      try {
        const stats = fs.statSync(filePath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        const type = stats.isDirectory() ? 'directory' : 'file';
        log(`- ${file} (${type}, ${fileSizeMB} MB)`);
      } catch (statError) {
         log(`- ${file} (Error reading stats: ${statError.message})`);
      }
    });

    const dmgFiles = outputFiles.filter(file => file.endsWith('.dmg'));
    const zipFiles = outputFiles.filter(file => file.endsWith('.zip'));

    if (dmgFiles.length === 0) {
      console.warn('⚠️ Warning: No DMG files found in the output!');

      // If we have app bundles but no DMG, try to create a DMG manually
      if (appBundles.length > 0) {
        log('Attempting to create DMG manually as a fallback...');
        const appPath = appBundles[0]; // Use the first found app bundle
        const appName = path.basename(appPath, '.app');
        const dmgPath = path.join(releasePath, `${appName}-manual-fallback.dmg`);
        log(`Source App: ${appPath}`);
        log(`Output DMG: ${dmgPath}`);

        try {
          const hdiutilCommand = `hdiutil create -volname "${appName}" -srcfolder "${appPath}" -ov -format UDZO "${dmgPath}"`;
          log(`Executing: ${hdiutilCommand}`);
          execSync(hdiutilCommand, {
            stdio: verbose ? 'inherit' : 'pipe', // Show hdiutil output only if verbose
            env: buildEnv
          });

          if (fs.existsSync(dmgPath)) {
            const stats = fs.statSync(dmgPath);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            console.log(`✅ Successfully created manual fallback DMG: ${dmgPath} (${fileSizeMB} MB)`);
            // Add the new DMG to our list
            dmgFiles.push(path.basename(dmgPath));
            outputFiles.push(path.basename(dmgPath)); // Also add to the main list for build-info
          } else {
            console.error('❌ Failed to create manual fallback DMG (hdiutil command ran but file not found).');
          }
        } catch (dmgError) {
          console.error('❌ Error creating manual fallback DMG:');
          if (dmgError.stderr) console.error("hdiutil stderr:", dmgError.stderr.toString());
          if (dmgError.stdout) console.error("hdiutil stdout:", dmgError.stdout.toString());
          if (!dmgError.stderr && !dmgError.stdout) console.error(dmgError.message);
        }
      } else {
         log('Skipping manual DMG creation because no .app bundle was found.');
      }
    } else {
      log(`Found ${dmgFiles.length} DMG file(s).`);
    }

    if (zipFiles.length === 0) {
      // This might be expected depending on electron-builder config
      log('No ZIP files found in the output.');
    } else {
      log(`Found ${zipFiles.length} ZIP file(s).`);
    }

    // *** ADD FINAL DETACH ATTEMPT HERE ***
    log('Attempting final cleanup of any potentially mounted DMGs...');
    const potentialDMGs = outputFiles.filter(f => f.endsWith('.dmg')).map(f => path.join(releasePath, f));
    let allDetached = true;
    for (const dmgPath of potentialDMGs) {
      if (!await attemptForceDetach(dmgPath)) {
        allDetached = false; // Mark if any detach failed after retries
      }
    }
    if (!allDetached) {
       console.warn("⚠️ Failed to detach one or more DMGs after multiple attempts. This might cause issues in subsequent steps.");
       // Decide if this should be a fatal error for your CI
       // buildSuccess = false; // Uncomment to make it fail the build
    } else {
       log('✅ Final DMG cleanup attempt successful.');
    }
    // *** END OF FINAL DETACH ATTEMPT ***

    // Create a build info file
    const buildInfoPath = path.join(releasePath, 'build-info.json');
    log(`Creating build info file: ${buildInfoPath}`);
    const buildInfo = {
      timestamp: new Date().toISOString(),
      platform: 'macOS',
      requestedSkipSigning: skipSigning, // User request via flag
      actualSkipSigning: process.env.CSC_IDENTITY_AUTO_DISCOVERY === 'false', // What actually happened
      skipNotarization: process.env.DISABLE_NOTARIZATION === 'true',
      files: outputFiles.map(file => {
        const filePath = path.join(releasePath, file);
        let size = -1;
        let type = 'unknown';
        try {
           const stats = fs.statSync(filePath);
           size = stats.size;
           type = stats.isDirectory() ? 'directory' : 'file';
        } catch (e) { /* ignore */ }
        return {
          name: file,
          size: size,
          type: type,
          path: filePath // Including full path might be redundant if release dir is known
        };
      }).filter(f => f.size !== -1) // Filter out files we couldn't stat
    };

    try {
      fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
      log(`Build info written successfully.`);
    } catch(writeError) {
       console.error(`Error writing build info file ${buildInfoPath}: ${writeError.message}`);
    }

    console.log('✅ macOS build script completed.');
    buildSuccess = true; // Mark as successful if we reached here without fatal errors
  } catch (error) {
    console.error('❌ Fatal error during macOS build script execution:', error.message);
    // Don't log stdout/stderr again if it came from execSync, it's part of the message/object
    // if (error.stdout) console.error('stdout:', error.stdout.toString());
    // if (error.stderr) console.error('stderr:', error.stderr.toString());
    buildSuccess = false; // Ensure failure on error
  } finally {
    // Optional: Add another detach attempt in finally block just in case?
    // Might be overkill, but could help in complex failure scenarios.
    log("Performing cleanup check in finally block...");
    const finalFiles = fs.existsSync(releasePath) ? fs.readdirSync(releasePath) : [];
    const finalDmgs = finalFiles.filter(f => f.endsWith('.dmg')).map(f => path.join(releasePath, f));
    for (const dmgPath of finalDmgs) {
      await attemptForceDetach(dmgPath);
    }
  }
  return buildSuccess; // Return the final success status
}

// --- listFiles function removed as it was unused ---

// Run the main build process and exit with appropriate code
buildMacApp().then(success => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  // Catch any unhandled promise rejections from buildMacApp itself
  console.error('❌ Unhandled rejection during build process:', err);
  process.exit(1);
});