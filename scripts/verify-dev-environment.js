/**
 * Development environment verification script
 * Tests if the development environment is properly set up
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { platform } = require('os');

// Platform detection
const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';
const isLinux = process.platform === 'linux';

console.log('🔍 Verifying development environment...');

// Check Node.js version
console.log('✓ Node.js version:', process.version);

// Check for required dependencies
const requiredDeps = [
  'electron',
  'vite', 
  'react',
  'tree-sitter'
];

let allDepsFound = true;
for (const dep of requiredDeps) {
  try {
    require.resolve(dep);
    console.log(`✓ Found dependency: ${dep}`);
  } catch (error) {
    console.error(`✗ Missing dependency: ${dep}`);
    allDepsFound = false;
  }
}

// Check for required files
const requiredFiles = [
  'package.json',
  'electron/main.js',
  'src/main.tsx',
  'vite.config.ts'
];

let allFilesFound = true;
for (const file of requiredFiles) {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`✓ Found file: ${file}`);
  } else {
    console.error(`✗ Missing file: ${file}`);
    allFilesFound = false;
  }
}

// Check C++20 compatibility
console.log('\n🔍 Checking C++20 compatibility...');

const C20TestFile = path.join(__dirname, 'cpp20-test.cc');
fs.writeFileSync(C20TestFile, `
#include <iostream>
#include <concepts>

template<typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

template<Numeric T>
T add(T a, T b) {
    return a + b;
}

int main() {
    std::cout << "C++20 compatibility test passed!" << std::endl;
    return 0;
}
`);

const outputFile = path.join(__dirname, 'cpp20-test' + (isWin ? '.exe' : ''));

try {
  let compileCommand;
  if (isMac) {
    compileCommand = `clang++ -std=c++20 "${C20TestFile}" -o "${outputFile}"`;
  } else if (isWin) {
    compileCommand = `cl.exe /std:c++20 "${C20TestFile}" /Fe:"${outputFile}"`;
  } else {
    compileCommand = `g++ -std=c++20 "${C20TestFile}" -o "${outputFile}"`;
  }
  
  console.log(`Running: ${compileCommand}`);
  execSync(compileCommand, { stdio: 'inherit', shell: platform() === 'win32' });
  console.log(`✓ Successfully compiled C++20 test file`);
  
  // Run the compiled file to verify it works
  execSync(`"${outputFile}"`, { stdio: 'inherit', shell: platform() === 'win32' });
  console.log(`✓ C++20 compatibility verified`);
} catch (error) {
  console.error(`✗ C++20 compatibility test failed: ${error.message}`);
  allDepsFound = false;
} finally {
  // Clean up test files
  try {
    if (fs.existsSync(C20TestFile)) fs.unlinkSync(C20TestFile);
    if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
  } catch (error) {
    console.warn(`Warning: Could not clean up test files: ${error.message}`);
  }
}

// Final verdict
if (allDepsFound && allFilesFound) {
  console.log('\n✅ Development environment is properly set up!');
  process.exit(0);
} else {
  console.error('\n❌ Development environment has issues that need to be addressed.');
  process.exit(1);
} 