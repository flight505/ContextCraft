/**
 * Cross-platform build script
 * Ensures both macOS and Windows builds work correctly
 */

const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

// Platform detection helpers
const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';
const isLinux = process.platform === 'linux';

/**
 * Test that verifies the output builds exist
 */
function verifyBuilds(platform) {
  console.log(`🔍 Verifying ${platform} build outputs...`);
  
  const releaseBuildsDir = path.join(__dirname, '..', 'release-builds');
  if (!fs.existsSync(releaseBuildsDir)) {
    console.error(`❌ No release-builds directory found for ${platform}`);
    return false;
  }

  const files = fs.readdirSync(releaseBuildsDir);
  
  if (files.length === 0) {
    console.error(`❌ No files found in release-builds directory for ${platform}`);
    return false;
  }

  // Platform-specific file checks
  let hasExpectedFile = false;
  
  if (platform === 'win') {
    hasExpectedFile = files.some(file => file.endsWith('.exe'));
  } else if (platform === 'mac') {
    hasExpectedFile = files.some(file => 
      file.endsWith('.dmg') || 
      file.endsWith('.zip') || 
      file.endsWith('.app')
    );
  } else if (platform === 'linux') {
    hasExpectedFile = files.some(file => 
      file.endsWith('.AppImage') || 
      file.endsWith('.deb') || 
      file.endsWith('.rpm')
    );
  }

  if (!hasExpectedFile) {
    console.error(`❌ Expected build file not found for ${platform}`);
    return false;
  }

  console.log(`✅ ${platform} build outputs verified successfully!`);
  return true;
}

/**
 * Clean previous builds
 */
function cleanBuilds() {
  console.log('🧹 Cleaning previous builds...');
  const releaseBuildsDir = path.join(__dirname, '..', 'release-builds');
  
  if (fs.existsSync(releaseBuildsDir)) {
    if (isWin) {
      execSync('rmdir /s /q release-builds', { stdio: 'inherit' });
    } else {
      execSync('rm -rf release-builds', { stdio: 'inherit' });
    }
  }
  
  console.log('✅ Cleaned previous builds');
}

/**
 * Main function
 */
async function main() {
  try {
    const targetPlatform = process.argv[2] || (isMac ? 'mac' : isWin ? 'win' : 'linux');
    
    console.log(`🚀 Building for ${targetPlatform} platform...`);
    
    // Clean previous builds
    cleanBuilds();
    
    // Run platform-specific build
    if (targetPlatform === 'mac') {
      console.log('📦 Building for macOS...');
      execSync('npm run package:mac', { stdio: 'inherit' });
      if (!verifyBuilds('mac')) {
        process.exit(1);
      }
    } else if (targetPlatform === 'win') {
      console.log('📦 Building for Windows...');
      execSync('npm run package:win', { stdio: 'inherit' });
      if (!verifyBuilds('win')) {
        process.exit(1);
      }
    } else if (targetPlatform === 'all') {
      // Run builds for all supported platforms
      console.log('📦 Building for all platforms...');
      console.log('⚠️ Note: Cross-platform builds require appropriate toolchains for each platform');
      execSync('npm run package:all', { stdio: 'inherit' });
    } else {
      console.error(`❌ Unknown target platform: ${targetPlatform}`);
      process.exit(1);
    }
    
    console.log(`✅ ${targetPlatform} build completed successfully!`);
  } catch (error) {
    console.error(`❌ Build failed: ${error.message}`);
    process.exit(1);
  }
}

// Run main function
main(); 