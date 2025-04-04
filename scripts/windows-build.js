/**
 * Helper script for Windows builds
 * Ensures proper C++ standard is used for native modules
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    console.log('🔧 Starting Windows build with C++20 support...');
    
    // Create a temporary .npmrc-win file with required settings
    const npmrcWinPath = path.join(__dirname, '..', '.npmrc-win');
    const content = `
node-gyp-binary-path=${process.env.npm_config_node_gyp_binary_path || '/opt/homebrew/bin/node-gyp'}
npm_config_cxx_std=c++20
# Windows-specific configurations
npm_config_msvs_version=2019
npm_config_target_arch=x64
npm_config_platform=win32
# Override native module flags for cross-compilation
npm_config_clang=false
`;
    
    fs.writeFileSync(npmrcWinPath, content.trim(), 'utf8');
    console.log('✅ Created temporary Windows-specific .npmrc file');
    
    // Set environment variables that will help with C++ standard
    const env = {
      ...process.env,
      npm_config_cxx_std: 'c++20',
      npm_config_npmrc: npmrcWinPath,
      CXXFLAGS: '-std=c++20',
      CXX_FLAGS: '-std=c++20',
    };
    
    // Run the build command with our enhanced environment
    console.log('🔨 Building Vite app...');
    execSync('npm run build', { stdio: 'inherit', env });
    
    console.log('📦 Packaging Windows app...');
    execSync('electron-builder --win --publish=never', { stdio: 'inherit', env });
    
    // Clean up
    console.log('🧹 Cleaning up temporary files...');
    fs.unlinkSync(npmrcWinPath);
    
    console.log('✅ Windows build completed successfully!');
  } catch (error) {
    console.error('❌ Windows build failed:', error.message);
    process.exit(1);
  }
}

main(); 