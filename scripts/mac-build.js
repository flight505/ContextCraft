/**
 * Helper script for macOS builds
 * Ensures proper C++ standard is used for native modules
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    console.log('🔧 Starting macOS build with C++20 support...');
    
    // Create a temporary .npmrc-mac file with required settings
    const npmrcMacPath = path.join(__dirname, '..', '.npmrc-mac');
    const content = `
node-gyp-binary-path=${process.env.npm_config_node_gyp_binary_path || '/opt/homebrew/bin/node-gyp'}
npm_config_cxx_std=c++20
# macOS-specific configurations
npm_config_target_arch=${process.arch}
npm_config_platform=darwin
`;
    
    fs.writeFileSync(npmrcMacPath, content.trim(), 'utf8');
    console.log('✅ Created temporary macOS-specific .npmrc file');
    
    // Set environment variables that will help with C++ standard
    const env = {
      ...process.env,
      npm_config_cxx_std: 'c++20',
      npm_config_npmrc: npmrcMacPath,
      CXXFLAGS: '-std=c++20',
      CXX_FLAGS: '-std=c++20',
      // Force clang instead of gcc which helps with tree-sitter on macOS
      CC: 'clang',
      CXX: 'clang++',
    };
    
    // Run the build command with our enhanced environment
    console.log('🔨 Building Vite app...');
    execSync('npm run build', { stdio: 'inherit', env });
    
    // Rebuild native modules with proper C++20 support
    console.log('🔄 Rebuilding native modules for macOS...');
    try {
      execSync('npm run rebuild-native-modules', { stdio: 'inherit', env });
    } catch (err) {
      console.warn('⚠️ Native module rebuild had some issues, continuing with packaging...');
    }
    
    console.log('📦 Packaging macOS app...');
    execSync('electron-builder --mac --publish=never', { stdio: 'inherit', env });
    
    // Clean up
    console.log('🧹 Cleaning up temporary files...');
    fs.unlinkSync(npmrcMacPath);
    
    console.log('✅ macOS build completed successfully!');
  } catch (error) {
    console.error('❌ macOS build failed:', error.message);
    process.exit(1);
  }
}

main(); 