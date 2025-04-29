#!/usr/bin/env node

/**
 * This script helps fix tree-sitter module issues in Electron apps.
 * It ensures all required tree-sitter modules are properly installed and configured.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🌲 Tree-Sitter Module Fixer');
console.log('============================');

// List of tree-sitter modules to check
const treeSitterModules = [
  'tree-sitter',
  'tree-sitter-javascript',
  'tree-sitter-typescript',
  'tree-sitter-python',
  'tree-sitter-css',
  'tree-sitter-html'
];

// Check if we're in the right directory
if (!fs.existsSync('./package.json')) {
  console.error('❌ Error: package.json not found! Please run this script from the project root directory.');
  process.exit(1);
}

// Helper to run commands safely
function runCommand(command, options = {}) {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf-8',
      ...options
    });
    return { success: true, output };
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return { success: false, error };
  }
}

// Check node-gyp prerequisites
function checkNodeGyp() {
  console.log('\n🔍 Checking node-gyp prerequisites...');
  
  const platform = os.platform();
  
  if (platform === 'darwin') {
    console.log('MacOS detected, checking XCode Command Line Tools...');
    
    try {
      execSync('xcode-select -p', { stdio: 'pipe' });
      console.log('✅ XCode Command Line Tools are installed');
    } catch (error) {
      console.error('❌ XCode Command Line Tools not found. Please install them:');
      console.error('   Run: xcode-select --install');
      return false;
    }
    
    // Check python
    try {
      execSync('python3 --version', { stdio: 'pipe' });
      console.log('✅ Python 3 is installed');
    } catch (error) {
      console.error('❌ Python 3 not found. Please install it:');
      console.error('   Run: brew install python');
      return false;
    }
    
  } else if (platform === 'win32') {
    console.log('Windows detected, checking prerequisites...');
    console.log('⚠️ Please ensure you have installed:');
    console.log('  - Visual Studio Build Tools with C++ workload');
    console.log('  - Python 3.x');
    
    // We can't reliably check these on Windows automatically
  }
  
  return true;
}

// Check and rebuild tree-sitter modules
async function fixTreeSitterModules() {
  console.log('\n🔧 Checking tree-sitter modules...');
  
  // Read package.json for versions
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
  const electronVersion = packageJson.devDependencies.electron.replace('^', '');
  
  // Get specific versions from dependencies or overrides
  const getVersion = (moduleName) => {
    // Check direct dependencies first
    if (packageJson.dependencies && packageJson.dependencies[moduleName]) {
      return packageJson.dependencies[moduleName].replace('^', '').replace('~', '');
    }
    
    // Check overrides
    if (packageJson.overrides && packageJson.overrides[moduleName]) {
      return packageJson.overrides[moduleName].replace('^', '').replace('~', '');
    }
    
    // For tree-sitter specifically, it might be nested in other module overrides
    if (moduleName === 'tree-sitter' && packageJson.overrides) {
      for (const key in packageJson.overrides) {
        if (packageJson.overrides[key] && 
            typeof packageJson.overrides[key] === 'object' && 
            packageJson.overrides[key]['tree-sitter']) {
          return packageJson.overrides[key]['tree-sitter'].replace('^', '').replace('~', '');
        }
      }
    }
    
    return 'latest';
  };
  
  // Check if modules exist in node_modules
  for (const module of treeSitterModules) {
    const modulePath = path.join('./node_modules', module);
    if (!fs.existsSync(modulePath)) {
      console.warn(`⚠️ Module ${module} not found in node_modules`);
    } else {
      console.log(`✅ Found ${module} in node_modules`);
    }
  }
  
  // Reinstall tree-sitter modules with specific versions
  console.log('\n🔄 Reinstalling tree-sitter modules...');
  
  // First install tree-sitter if it's missing and respect override
  const treeSitterVersion = getVersion('tree-sitter');
  if (!fs.existsSync('./node_modules/tree-sitter')) {
    console.log(`Installing tree-sitter@${treeSitterVersion} (from overrides/dependencies)`);
    runCommand(`npm install tree-sitter@${treeSitterVersion} --save-exact`);
  } else {
    console.log(`Tree-sitter already installed, respecting override version: ${treeSitterVersion}`);
  }
  
  // Then install other modules one by one
  for (const module of treeSitterModules) {
    if (module === 'tree-sitter') continue; // Skip as we handled it above
    
    const version = getVersion(module);
    console.log(`Installing ${module}@${version}`);
    const result = runCommand(`npm install ${module}@${version} --save-exact`);
    if (!result.success) {
      console.error(`❌ Failed to install ${module}`);
    }
  }
  
  // Rebuild native modules
  console.log('\n🔄 Rebuilding native modules for Electron...');
  console.log(`Detected Electron version: ${electronVersion}`);
  
  const rebuildResult = runCommand(`npx @electron/rebuild --version=${electronVersion}`);
  if (!rebuildResult.success) {
    console.error('❌ Failed to rebuild native modules');
    console.error('   You may need to install build tools or fix prerequisites');
    return false;
  }
  
  console.log('✅ Native modules rebuilt successfully');
  return true;
}

// Update package.json to ensure proper unpacking
function updatePackageJson() {
  console.log('\n📝 Updating package.json for proper unpacking...');
  
  const packageJsonPath = './package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  if (!packageJson.build) {
    packageJson.build = {};
  }
  
  packageJson.build.asarUnpack = [
    "node_modules/tiktoken/**",
    "node_modules/jsdom/**",
    "node_modules/chokidar/**",
    "node_modules/tree-sitter/**",
    "node_modules/tree-sitter-javascript/**",
    "node_modules/tree-sitter-typescript/**",
    "node_modules/tree-sitter-python/**",
    "node_modules/tree-sitter-css/**",
    "node_modules/tree-sitter-html/**",
    "node_modules/node-gyp-build/**",
    "node_modules/nan/**"
  ];
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json with proper asarUnpack configuration');
  
  return true;
}

// Create test file to ensure modules are loadable
function createTreeSitterTestFile() {
  console.log('\n📝 Creating test file to verify tree-sitter loading...');
  
  const testFilePath = path.join('./electron/utils/treeSitterTest.js');
  const testFileContent = `// Test file to verify tree-sitter loading
const path = require('path');
const fs = require('fs');

// Log the environment for debugging
console.log('========================================');
console.log('TREE-SITTER MODULE LOADER TEST');
console.log('========================================');
console.log('Current directory:', process.cwd());
console.log('resourcesPath:', process.resourcesPath || 'Not available');
console.log('appPath:', path.dirname(require.main.filename));
console.log('Module paths:', module.paths);
console.log('========================================');

// Try to load tree-sitter and each parser
const modules = [
  'tree-sitter',
  'tree-sitter-javascript',
  'tree-sitter-typescript',
  'tree-sitter-python',
  'tree-sitter-css',
  'tree-sitter-html'
];

function tryRequire(moduleName) {
  try {
    const mod = require(moduleName);
    console.log(\`✓ Successfully loaded \${moduleName}\`);
    return true;
  } catch (err) {
    console.error(\`✗ Failed to load \${moduleName}: \${err.message}\`);
    
    // Try alternative locations if this is a packaged app
    if (process.resourcesPath) {
      try {
        const unpackedPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', moduleName);
        console.log(\`   Trying unpacked path: \${unpackedPath}\`);
        if (fs.existsSync(unpackedPath)) {
          const mod = require(unpackedPath);
          console.log(\`✓ Successfully loaded \${moduleName} from unpacked path\`);
          return true;
        }
      } catch (altErr) {
        console.error(\`   Failed to load from alternative path: \${altErr.message}\`);
      }
    }
    
    return false;
  }
}

// Test each module
let success = true;
for (const moduleName of modules) {
  const result = tryRequire(moduleName);
  success = success && result;
}

console.log('========================================');
console.log(\`Overall result: \${success ? '✓ All modules loaded' : '✗ Some modules failed to load'}\`);
console.log('========================================');

module.exports = { success };
`;

  fs.writeFileSync(testFilePath, testFileContent);
  console.log(`✅ Created test file at ${testFilePath}`);
  
  // Run the test
  console.log('\n🧪 Running tree-sitter test...');
  try {
    require('../electron/utils/treeSitterTest');
    console.log('✅ Tree-sitter test completed');
  } catch (error) {
    console.error('❌ Tree-sitter test failed:', error.message);
  }
  
  return true;
}

// Main execution
async function main() {
  console.log('Starting tree-sitter module fix process...');
  
  // Step 1: Check node-gyp prerequisites
  const gypOk = checkNodeGyp();
  if (!gypOk) {
    console.error('\n❌ Please fix node-gyp prerequisites before continuing');
    process.exit(1);
  }
  
  // Step 2: Fix tree-sitter modules
  const modulesOk = await fixTreeSitterModules();
  if (!modulesOk) {
    console.error('\n❌ Failed to fix tree-sitter modules');
    process.exit(1);
  }
  
  // Step 3: Update package.json
  const packageJsonOk = updatePackageJson();
  if (!packageJsonOk) {
    console.error('\n❌ Failed to update package.json');
    process.exit(1);
  }
  
  // Step 4: Create and run tree-sitter test
  createTreeSitterTestFile();
  
  console.log('\n✅ Tree-sitter module fix completed successfully!');
  console.log('\nNext steps:');
  console.log('  1. Run your application with:');
  console.log('     npm start');
  console.log('  2. If it works, try packaging:');
  console.log('     npm run package:mac');
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 