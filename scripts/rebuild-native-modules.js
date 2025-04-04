/**
 * Script to rebuild native modules with C++20 support
 * This helps ensure tree-sitter and other native modules work on all platforms
 */

const { execSync } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

// Platform detection
const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';
const isLinux = process.platform === 'linux';

// Native modules to rebuild
const nativeModules = [
  'tree-sitter',
  'tree-sitter-javascript',
  'tree-sitter-typescript',
  'tree-sitter-python',
  'tree-sitter-css',
  'tree-sitter-html'
];

/**
 * Rebuilds native modules with proper C++20 support
 */
async function main() {
  try {
    console.log('🔄 Rebuilding native modules with C++20 support...');
    
    // Create appropriate compiler flags based on platform
    let env = { ...process.env };
    
    if (isMac) {
      // macOS: Use clang with C++20 flags
      env = {
        ...env,
        npm_config_cxx_std: 'c++20',
        CXXFLAGS: '-std=c++20',
        CXX_FLAGS: '-std=c++20',
        CC: 'clang',
        CXX: 'clang++'
      };
      console.log('🍎 Using macOS optimized settings with clang and C++20');
    } else if (isWin) {
      // Windows: Use MSVC with C++20 flags
      env = {
        ...env,
        npm_config_cxx_std: 'c++20',
        npm_config_msvs_version: '2019',
        npm_config_platform: 'win32'
      };
      console.log('🪟 Using Windows optimized settings with MSVC and C++20');
    } else {
      // Linux: Use GCC with C++20 flags
      env = {
        ...env,
        npm_config_cxx_std: 'c++20',
        CXXFLAGS: '-std=c++20',
        CXX_FLAGS: '-std=c++20',
      };
      console.log('🐧 Using Linux optimized settings with GCC and C++20');
    }

    // Use electron-rebuild to rebuild native modules
    const electronRebuildPath = path.join('node_modules', '.bin', 'electron-rebuild');
    
    if (fs.existsSync(electronRebuildPath)) {
      console.log('🔨 Using electron-rebuild to rebuild native modules...');
      
      const electronRebuildCmd = isWin ? 
        `${electronRebuildPath}.cmd --types prod --module-dir .` : 
        `./${electronRebuildPath} --types prod --module-dir .`;
      
      execSync(electronRebuildCmd, { stdio: 'inherit', env });
    } else {
      console.log('⚠️ electron-rebuild not found, attempting manual rebuild...');
      
      // Manually rebuild each native module using npm rebuild
      for (const module of nativeModules) {
        console.log(`🔨 Rebuilding ${module}...`);
        try {
          execSync(`npm rebuild ${module} --update-binary`, { stdio: 'inherit', env });
          console.log(`✅ Successfully rebuilt ${module}`);
        } catch (err) {
          console.error(`❌ Failed to rebuild ${module}: ${err.message}`);
        }
      }
    }

    console.log('✅ Native module rebuild completed');
  } catch (error) {
    console.error('❌ Failed to rebuild native modules:', error.message);
    process.exit(1);
  }
}

// Run the main function
main(); 