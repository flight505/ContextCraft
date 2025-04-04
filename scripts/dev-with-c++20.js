/**
 * Development script with C++20 support
 * This script runs the development environment with proper C++20 settings for native modules
 */

const { spawn } = require('child_process');
const os = require('os');
const { platform } = require('os');

// Platform detection
const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';
const isLinux = process.platform === 'linux';

console.log('🚀 Starting development environment with C++20 support...');

// Create the environment based on platform
let env = { ...process.env, NODE_ENV: "development" };

if (isMac) {
  // macOS: Use clang with C++20 flags
  env = {
    ...env,
    npm_config_cxx_std: 'c++20',
    CXXFLAGS: '-std=c++20',
    CXX_FLAGS: '-std=c++20',
    CC: 'clang',
    CXX: 'clang++',
  };
  console.log('🍎 Using macOS optimized settings with clang and C++20');
} else if (isWin) {
  // Windows: Use MSVC with C++20 flags
  env = {
    ...env,
    npm_config_cxx_std: 'c++20',
    CXXFLAGS: '/std:c++20',
    CXX_FLAGS: '/std:c++20',
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

// Optional: Rebuild native modules before starting development
const shouldRebuild = process.argv.includes('--rebuild');
if (shouldRebuild) {
  console.log('🔄 Rebuilding native modules before starting...');
  const rebuildProcess = spawn('npm', ['run', 'rebuild-native-modules'], {
    stdio: 'inherit',
    shell: platform() === 'win32',
    env,
  });
  
  rebuildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Native modules rebuilt successfully');
      startDevEnvironment();
    } else {
      console.error('❌ Failed to rebuild native modules');
      process.exit(code);
    }
  });
} else {
  startDevEnvironment();
}

function startDevEnvironment() {
  console.log('📦 Starting development environment...');
  
  // Start the dev:electron script with our enhanced environment
  const devProcess = spawn('npm', ['run', 'dev:electron'], {
    stdio: 'inherit',
    shell: platform() === 'win32',
    env,
  });
  
  devProcess.on('close', (code) => {
    console.log(`Development process exited with code ${code}`);
    process.exit(code || 0);
  });
  
  // Handle Ctrl+C to gracefully exit
  process.on('SIGINT', () => {
    if (devProcess && !devProcess.killed) {
      devProcess.kill();
    }
    process.exit(0);
  });
} 