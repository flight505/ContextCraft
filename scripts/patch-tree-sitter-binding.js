#!/usr/bin/env node

/**
 * This script patches tree-sitter binding.gyp files to ensure they use C++20 settings
 * on Windows builds. The script targets the specific issue where C++17 overrides C++20
 * during the compilation process.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if we're running in a Windows environment
const isWindows = process.platform === 'win32';

// Log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Find all binding.gyp files related to tree-sitter
function findTreeSitterBindingGyps() {
  try {
    log('Searching for tree-sitter binding.gyp files...');
    
    // Look in node_modules directory
    const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
    
    if (!fs.existsSync(nodeModulesPath)) {
      log('No node_modules directory found.');
      return [];
    }
    
    // Use different commands for Windows vs Unix
    let result = [];
    if (isWindows) {
      log('Using Windows file search method...');
      try {
        // Use PowerShell to find binding.gyp files
        const command = 'powershell -Command "Get-ChildItem -Path .\\node_modules -Recurse -Filter binding.gyp | Where-Object { $_.FullName -like \'*tree-sitter*\' } | Select-Object -ExpandProperty FullName"';
        result = execSync(command, { encoding: 'utf8' })
          .trim()
          .split('\r\n')
          .filter(line => line !== '');
      } catch (winError) {
        log(`PowerShell search failed: ${winError.message}`);
        
        // Fallback to direct path check for main tree-sitter
        const treeSitterPath = path.resolve(process.cwd(), 'node_modules', 'tree-sitter');
        if (fs.existsSync(treeSitterPath)) {
          const bindingPath = path.resolve(treeSitterPath, 'binding.gyp');
          if (fs.existsSync(bindingPath)) {
            result = [bindingPath];
          }
        }
      }
    } else {
      // Unix - use find command
      result = execSync(
        'find ./node_modules -path "*tree-sitter*/binding.gyp" -type f',
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
      ).trim().split('\n').filter(line => line !== '');
    }
    
    log(`Found ${result.length} binding.gyp files related to tree-sitter.`);
    return result;
  } catch (error) {
    log('Error searching for binding.gyp files:');
    log(error.message);
    
    // Final fallback - do a manual check of the most common locations
    const commonPaths = [
      path.resolve(process.cwd(), 'node_modules', 'tree-sitter', 'binding.gyp'),
      path.resolve(process.cwd(), 'node_modules', 'tree-sitter-javascript', 'binding.gyp'),
      path.resolve(process.cwd(), 'node_modules', 'tree-sitter-typescript', 'binding.gyp')
    ];
    
    return commonPaths.filter(p => fs.existsSync(p));
  }
}

// Patch the binding.gyp file to use C++20
function patchBindingGyp(filePath) {
  try {
    log(`Patching: ${filePath}`);
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Check if file already has msbuild_settings with C++20
    if (content.includes('"LanguageStandard": "stdcpp20"')) {
      log('  File already has C++20 language standard.');
      return false;
    }
    
    // Add or replace C++ language standard setting
    if (content.includes('msbuild_settings')) {
      // Update existing msbuild_settings
      log('  Updating existing msbuild_settings...');
      
      if (content.includes('LanguageStandard')) {
        // Replace existing language standard setting
        content = content.replace(
          /"LanguageStandard"\s*:\s*"stdcpp\d+"/g, 
          '"LanguageStandard": "stdcpp20"'
        );
      } else {
        // Add language standard to existing ClCompile section
        content = content.replace(
          /"ClCompile"\s*:\s*{/g,
          '"ClCompile": {\n          "LanguageStandard": "stdcpp20",'
        );
      }
    } else {
      // Add new msbuild_settings section for Windows
      log('  Adding new msbuild_settings section...');
      
      // Check if there's a "conditions" array
      if (content.includes('"conditions": [')) {
        // Add to existing conditions
        content = content.replace(
          /('|")conditions('|")\s*:\s*\[/g,
          '$1conditions$2: [\n        [\'OS=="win"\', {\n          "msbuild_settings": {\n            "ClCompile": {\n              "LanguageStandard": "stdcpp20"\n            }\n          }\n        }],'
        );
      } else {
        // Add conditions and msbuild_settings
        content = content.replace(
          /(\s*)(}])(\s*)$/,
          `$1  "conditions": [
$1    ['OS=="win"', {
$1      "msbuild_settings": {
$1        "ClCompile": {
$1          "LanguageStandard": "stdcpp20"
$1        }
$1      }
$1    }]
$1  ]$3}]$3`
        );
      }
    }
    
    // Also add/update msvs_settings as a backup approach
    if (!content.includes('"-std:c++20"') && !content.includes('"/std:c++20"')) {
      if (content.includes('msvs_settings')) {
        // Add to existing msvs_settings
        if (content.includes('AdditionalOptions')) {
          // Add to existing AdditionalOptions
          content = content.replace(
            /"AdditionalOptions"\s*:\s*\[/g,
            '"AdditionalOptions": [\n            "/std:c++20",'
          );
        } else {
          // Add AdditionalOptions to existing VCCLCompilerTool
          content = content.replace(
            /"VCCLCompilerTool"\s*:\s*{/g,
            '"VCCLCompilerTool": {\n            "AdditionalOptions": ["/std:c++20"],'
          );
        }
      }
    }
    
    // Write the file back if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      log('  Successfully patched binding.gyp file.');
      return true;
    } else {
      log('  No changes needed.');
      return false;
    }
  } catch (error) {
    log(`Error patching ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
function main() {
  log('Starting tree-sitter binding.gyp patching script...');
  
  // Find binding.gyp files
  const bindingGyps = findTreeSitterBindingGyps();
  
  if (bindingGyps.length === 0) {
    log('No tree-sitter binding.gyp files found.');
    process.exit(0);
  }
  
  // Patch each binding.gyp file
  let patchedFiles = 0;
  for (const file of bindingGyps) {
    if (patchBindingGyp(file)) {
      patchedFiles++;
    }
  }
  
  log(`Patched ${patchedFiles} out of ${bindingGyps.length} binding.gyp files.`);
  log('Done.');
}

// Run the script
main(); 