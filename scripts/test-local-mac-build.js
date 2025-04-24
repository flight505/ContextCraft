/**
 * Test script for macOS builds
 * Runs a local build with diagnostics to help identify issues
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create a timestamp for this test run
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const logDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logDir, `mac-build-test-${timestamp}.log`);

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Function to run a command and log output
function runCommand(command, options = {}) {
  console.log(`\n🚀 Running: ${command}\n`);
  try {
    const output = execSync(command, { 
      stdio: 'pipe',
      ...options 
    }).toString();
    console.log(output);
    fs.appendFileSync(logFile, `\n\n## COMMAND: ${command}\n${output}\n`);
    return output;
  } catch (error) {
    const errorMessage = `\n❌ Command failed: ${command}\n${error.toString()}\n${error.stdout?.toString() || ''}\n${error.stderr?.toString() || ''}`;
    console.error(errorMessage);
    fs.appendFileSync(logFile, errorMessage);
    return error.toString();
  }
}

async function main() {
  console.log(`📝 Logging all output to: ${logFile}`);
  fs.writeFileSync(logFile, `# macOS Build Test - ${new Date().toISOString()}\n\n`);

  // Step 1: Run diagnostics
  console.log('Step 1: Running initial diagnostics...');
  runCommand('node scripts/diagnose-build.js');
  
  // Step 2: Clean up any existing builds
  console.log('\nStep 2: Cleaning up old builds...');
  runCommand('npm run cleanup');
  
  // Step 3: Check if user wants to skip signing
  const skipSigning = process.argv.includes('--skip-signing');
  console.log(`\nStep 3: Setting up build with code signing ${skipSigning ? 'disabled' : 'enabled'}`);
  
  // Step 4: Build the application
  console.log('\nStep 4: Building the application...');
  runCommand(`npm run package:mac -- ${skipSigning ? '--skip-signing' : ''} --verbose`);
  
  // Step 5: Check for build artifacts
  console.log('\nStep 5: Checking build artifacts...');
  const releaseBuildsDir = path.join(process.cwd(), 'release-builds');
  if (fs.existsSync(releaseBuildsDir)) {
    const files = fs.readdirSync(releaseBuildsDir);
    console.log(`Found ${files.length} files in release-builds:`);
    files.forEach(file => console.log(` - ${file}`));
    
    const dmgFiles = files.filter(f => f.endsWith('.dmg'));
    const zipFiles = files.filter(f => f.endsWith('.zip'));
    
    if (dmgFiles.length > 0) {
      console.log(`\n✅ DMG files created successfully: ${dmgFiles.join(', ')}`);
    } else {
      console.log('\n⚠️ No DMG files were created!');
    }
    
    if (zipFiles.length > 0) {
      console.log(`\n✅ ZIP files created: ${zipFiles.join(', ')}`);
    }
    
    // If DMG files weren't created, run diagnostics again
    if (dmgFiles.length === 0) {
      console.log('\nRunning diagnostics again to help identify issues...');
      runCommand('node scripts/diagnose-build.js');
    }
  } else {
    console.log('❌ release-builds directory does not exist - build failed completely');
  }
  
  // Step 6: Summary
  console.log('\n📋 Build Test Summary:');
  console.log(`- Test completed at: ${new Date().toISOString()}`);
  console.log(`- Code signing was: ${skipSigning ? 'DISABLED' : 'ENABLED'}`);
  console.log(`- Log file location: ${logFile}`);
  
  if (fs.existsSync(releaseBuildsDir)) {
    const files = fs.readdirSync(releaseBuildsDir);
    const dmgFiles = files.filter(f => f.endsWith('.dmg'));
    
    if (dmgFiles.length > 0) {
      console.log('- DMG files were successfully created ✅');
    } else {
      console.log('- No DMG files were created ❌');
      console.log('\nTroubleshooting steps:');
      console.log('1. Check if you have Apple Developer credentials set up');
      console.log('2. Try running with --skip-signing if you\'re just testing locally');
      console.log('3. Verify that hdiutil is working on your system');
      console.log('4. Check the log file for detailed error messages');
    }
  }
}

main().catch(error => {
  console.error('Test failed with error:', error);
  fs.appendFileSync(logFile, `\n\nFATAL ERROR: ${error.toString()}\n`);
  process.exit(1);
}); 