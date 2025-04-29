/**
 * Script to verify electron-builder configuration and ensure it can create proper builds
 */

const fs = require("fs");
const path = require("path");
const { execSync, spawn } = require("child_process");
const os = require("os");

console.log("🔍 Verifying build configuration...");

// Check that package.json exists and has the correct build configuration
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"),
  );

  console.log("📦 Package name:", packageJson.name);
  console.log("🔢 Version:", packageJson.version);

  if (!packageJson.build) {
    console.error('❌ No "build" configuration found in package.json');
    process.exit(1);
  }

  console.log('✅ "build" configuration exists');

  // Check output directory
  const outputDir = packageJson.build.directories?.output || "dist";
  console.log("📂 Output directory:", outputDir);

  // Check files configuration
  if (!packageJson.build.files || packageJson.build.files.length === 0) {
    console.warn('⚠️ No "files" configuration found in build config');
  } else {
    console.log(
      '✅ "files" configuration exists with',
      packageJson.build.files.length,
      "entries",
    );
  }

  // Check main file
  if (!packageJson.main) {
    console.error('❌ No "main" field found in package.json');
    process.exit(1);
  }

  console.log("✅ Main file:", packageJson.main);
  if (!fs.existsSync(path.join(__dirname, "..", packageJson.main))) {
    console.error(`❌ Main file "${packageJson.main}" does not exist`);
    process.exit(1);
  }

  console.log("✅ Main file exists");

  // Check if Vite dist directory exists
  if (!fs.existsSync(path.join(__dirname, "../dist"))) {
    console.log('⚠️ "dist" directory does not exist. Running build...');
    execSync("npm run build", { stdio: "inherit" });

    if (!fs.existsSync(path.join(__dirname, "../dist"))) {
      console.error("❌ Failed to build the Vite app");
      process.exit(1);
    }

    console.log("✅ Vite build completed successfully");
  } else {
    console.log('✅ "dist" directory exists');
  }

  // Print electron-builder version
  try {
    const version = execSync("npx electron-builder --version", {
      encoding: "utf8",
    }).trim();
    console.log("🏗️ electron-builder version:", version);
  } catch (err) {
    console.error("❌ Failed to get electron-builder version");
    console.error(err);
  }

  console.log("\n🚀 Ready to build! Try running one of these commands:");
  console.log("  npm run package:mac    # Build for macOS");
  console.log("  npm run package:win    # Build for Windows");
  console.log("  npm run package:linux  # Build for Linux");
  console.log(
    "  npm run package:all    # Build for all platforms (requires proper setup)",
  );

  // Get the platform-specific app path
  let appPath;
  if (process.platform === 'darwin') {
    appPath = path.join(process.cwd(), 'release-builds', 'mac-arm64', 'ContextCraft.app');
  } else if (process.platform === 'win32') {
    appPath = path.join(process.cwd(), 'release-builds', 'win-unpacked', 'ContextCraft.exe');
  } else {
    appPath = path.join(process.cwd(), 'release-builds', 'linux-unpacked', 'contextcraft');
  }

  // Check if the application exists
  if (!fs.existsSync(appPath)) {
    console.error(`❌ Application not found at: ${appPath}`);
    console.error('Please build the application first with "npm run package:mac" or similar command.');
    process.exit(1);
  }

  // Create a log file path
  const logFile = path.join(process.cwd(), 'logs', `app-verification-${new Date().toISOString().replace(/:/g, '-')}.log`);

  // Ensure logs directory exists
  if (!fs.existsSync(path.dirname(logFile))) {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
  }

  console.log('🔍 Launching application to verify it works...');
  console.log(`📝 Log file: ${logFile}`);

  // Launch the application
  let cmd, args;
  if (process.platform === 'darwin') {
    cmd = 'open';
    args = ['-a', appPath, '--args', '--debug-launch', `--log-file=${logFile}`];
  } else if (process.platform === 'win32') {
    cmd = appPath;
    args = ['--debug-launch', `--log-file=${logFile}`];
  } else {
    cmd = appPath;
    args = ['--debug-launch', `--log-file=${logFile}`];
  }

  console.log(`🚀 Running: ${cmd} ${args.join(' ')}`);

  try {
    // On macOS the 'open' command doesn't wait for the app to launch fully
    execSync(`${cmd} ${args.map(arg => `"${arg}"`).join(' ')}`);
    
    console.log('✅ Application launched. Waiting 5 seconds for startup...');
    
    // Give the app time to start up and write to the log
    setTimeout(() => {
      if (fs.existsSync(logFile)) {
        const log = fs.readFileSync(logFile, 'utf8');
        
        // Check for success and error patterns
        const loadedChokidar = log.includes('Successfully loaded chokidar');
        const chokidarError = log.includes('Failed to load chokidar') || 
                             log.includes('Could not load chokidar from any location');
        
        console.log('\n📋 Log Analysis Results:');
        if (loadedChokidar) {
          console.log('✅ Chokidar loaded successfully!');
        } else if (chokidarError) {
          console.log('❌ Chokidar loading failed!');
          
          // Extract the specific error lines
          const errorLines = log.split('\n')
            .filter(line => line.includes('chokidar') && line.includes('Failed'))
            .join('\n');
          
          console.log('🔍 Error details:');
          console.log(errorLines);
        } else {
          console.log('⚠️ Could not determine if chokidar loaded (no clear log entries)');
        }
        
        console.log('\n🔍 Full log path for details:');
        console.log(logFile);
      } else {
        console.error('❌ Log file not created. Application may have failed to start.');
      }
      
      // Try to close the app
      if (process.platform === 'darwin') {
        try {
          execSync('osascript -e \'tell application "ContextCraft" to quit\'');
        } catch (err) {
          console.log('Note: Could not automatically close the app.');
        }
      }
      
      console.log('\n✅ Verification process completed!');
    }, 5000);
  } catch (error) {
    console.error(`❌ Failed to launch application: ${error.message}`);
    process.exit(1);
  }
} catch (err) {
  console.error("❌ Error while verifying build configuration:");
  console.error(err);
  process.exit(1);
}
