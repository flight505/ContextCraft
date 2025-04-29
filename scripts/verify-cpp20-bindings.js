#!/usr/bin/env node

/**
 * verify-cpp20-bindings.js
 * 
 * A simple script to verify if tree-sitter modules are correctly configured for C++20
 * and patch them if requested with the --patch flag.
 */

const fs = require('fs');
const path = require('path');

// Process arguments
const args = process.argv.slice(2);
const shouldPatch = args.includes('--patch');
const verbose = args.includes('--verbose');

// Platform detection
const isWindows = process.platform === 'win32';

// Log with verbosity control
function log(message, alwaysShow = false) {
  if (verbose || alwaysShow) {
    console.log(message);
  }
}

// Find tree-sitter modules
function findTreeSitterModules() {
  const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log('No node_modules directory found.', true);
    return [];
  }
  
  // Get all directories starting with tree-sitter
  const treeSitterModules = ['tree-sitter'];
  const dirs = fs.readdirSync(nodeModulesPath);
  
  for (const dir of dirs) {
    if (dir.startsWith('tree-sitter-') && 
        fs.existsSync(path.resolve(nodeModulesPath, dir, 'binding.gyp'))) {
      treeSitterModules.push(dir);
    }
  }
  
  log(`Found ${treeSitterModules.length} tree-sitter modules: ${treeSitterModules.join(', ')}`, true);
  return treeSitterModules;
}

// Check a binding.gyp file for C++20 support
function checkBindingGyp(modulePath) {
  const bindingGypPath = path.resolve(modulePath, 'binding.gyp');
  if (!fs.existsSync(bindingGypPath)) {
    log(`No binding.gyp found for ${path.basename(modulePath)}`, true);
    return { ok: false, message: 'No binding.gyp file found' };
  }
  
  try {
    const content = fs.readFileSync(bindingGypPath, 'utf8');
    
    // Check for C++20 settings
    const hasCpp20 = 
      content.includes('c++20') || 
      content.includes('stdcpp20') || 
      content.includes('CLANG_CXX_LANGUAGE_STANDARD": "c++20');
    
    // Check for Directory.Build.props on Windows
    let hasPropsFile = true;
    if (isWindows) {
      const propsPath = path.resolve(modulePath, 'build', 'Directory.Build.props');
      hasPropsFile = fs.existsSync(propsPath);
      
      if (!hasPropsFile) {
        log(`No Directory.Build.props found for ${path.basename(modulePath)}`, verbose);
      }
    }
    
    return { 
      ok: hasCpp20 && (!isWindows || hasPropsFile), 
      hasCpp20,
      hasPropsFile,
      message: hasCpp20 ? 'Has C++20 settings' : 'Missing C++20 settings' 
    };
  } catch (error) {
    log(`Error checking binding.gyp for ${path.basename(modulePath)}: ${error.message}`, true);
    return { ok: false, message: `Error: ${error.message}` };
  }
}

// Main function
async function main() {
  log('Verifying tree-sitter modules for C++20 support...', true);
  
  const modules = findTreeSitterModules();
  if (modules.length === 0) {
    log('No tree-sitter modules found. Run npm install first.', true);
    process.exit(1);
  }
  
  let allValid = true;
  const needsPatching = [];
  
  for (const moduleName of modules) {
    const modulePath = path.resolve(process.cwd(), 'node_modules', moduleName);
    const result = checkBindingGyp(modulePath);
    
    if (result.ok) {
      log(`✅ ${moduleName}: Correctly configured for C++20`);
    } else {
      log(`❌ ${moduleName}: Not properly configured for C++20 - ${result.message}`, true);
      allValid = false;
      needsPatching.push(moduleName);
    }
  }
  
  if (!allValid && shouldPatch) {
    log('\nPatching modules that need C++20 support...', true);
    
    // Use the rebuild-native-modules script for patching
    const { execSync } = require('child_process');
    try {
      execSync('npm run rebuild-native-modules', { stdio: 'inherit' });
      log('\n✅ Patched all modules successfully', true);
    } catch (error) {
      log(`\n❌ Error patching modules: ${error.message}`, true);
      process.exit(1);
    }
  } else if (!allValid) {
    log('\n⚠️ Some modules need C++20 patching. Run with --patch to fix them.', true);
    process.exit(1);
  } else {
    log('\n✅ All tree-sitter modules are correctly configured for C++20!', true);
  }
}

main().catch(error => {
  log(`Error: ${error.message}`, true);
  process.exit(1);
}); 