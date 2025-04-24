/**
 * Cleanup script to remove old builds before creating new ones
 * This helps ensure clean state before packaging
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function cleanupBuilds() {
  try {
    console.log('🧹 Starting cleanup process...');
    
    // Define paths to clean
    const releaseBuildDir = path.join(__dirname, '..', 'release-builds');
    const distDir = path.join(__dirname, '..', 'dist');
    
    // Check if release-builds directory exists
    if (fs.existsSync(releaseBuildDir)) {
      console.log('📁 Cleaning release-builds directory...');
      // On macOS/Linux, use rm -rf
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${releaseBuildDir}"`, { stdio: 'inherit' });
      } else {
        execSync(`rm -rf "${releaseBuildDir}"/*`, { stdio: 'inherit' });
      }
      
      // Recreate the directory if it was deleted
      if (!fs.existsSync(releaseBuildDir)) {
        fs.mkdirSync(releaseBuildDir, { recursive: true });
      }
    } else {
      // Create if it doesn't exist
      fs.mkdirSync(releaseBuildDir, { recursive: true });
    }
    
    // Check if dist directory exists
    if (fs.existsSync(distDir)) {
      console.log('📁 Cleaning dist directory...');
      // On macOS/Linux, use rm -rf
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${distDir}"`, { stdio: 'inherit' });
      } else {
        execSync(`rm -rf "${distDir}"/*`, { stdio: 'inherit' });
      }
      
      // Recreate the directory if it was deleted
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }
    }
    
    console.log('✅ Cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

// Run the cleanup function
cleanupBuilds(); 