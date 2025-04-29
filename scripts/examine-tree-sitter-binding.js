#!/usr/bin/env node

/**
 * This script examines the tree-sitter binding.gyp file and logs its contents
 * to help debug C++20 compilation issues on Windows.
 */

const fs = require('fs');
const path = require('path');

const TREE_SITTER_PATH = path.resolve(process.cwd(), 'node_modules', 'tree-sitter');
const BINDING_GYP_PATH = path.resolve(TREE_SITTER_PATH, 'binding.gyp');

// Log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Main function
function main() {
  log('Examining tree-sitter binding.gyp file...');
  
  // Check if tree-sitter directory exists
  if (!fs.existsSync(TREE_SITTER_PATH)) {
    log('Error: tree-sitter directory not found in node_modules.');
    process.exit(1);
  }
  
  // Check if binding.gyp file exists
  if (!fs.existsSync(BINDING_GYP_PATH)) {
    log('Error: binding.gyp file not found in tree-sitter directory.');
    process.exit(1);
  }
  
  // Read binding.gyp file
  try {
    const bindingGypContent = fs.readFileSync(BINDING_GYP_PATH, 'utf8');
    log('binding.gyp content:');
    console.log('\n' + bindingGypContent + '\n');
    
    // Check for C++ standard settings
    log('Checking for C++ standard settings...');
    
    if (bindingGypContent.includes('"LanguageStandard": "stdcpp20"')) {
      log('Found C++20 language standard (msbuild_settings).');
    } else if (bindingGypContent.includes('"LanguageStandard": "stdcpp17"')) {
      log('Warning: Found C++17 language standard (msbuild_settings).');
    } else if (bindingGypContent.includes('/std:c++20') || bindingGypContent.includes('-std:c++20')) {
      log('Found C++20 language standard (AdditionalOptions).');
    } else if (bindingGypContent.includes('/std:c++17') || bindingGypContent.includes('-std:c++17')) {
      log('Warning: Found C++17 language standard (AdditionalOptions).');
    } else {
      log('No explicit C++ language standard found in binding.gyp.');
    }
    
    // Check for msbuild_settings
    if (bindingGypContent.includes('msbuild_settings')) {
      log('Found msbuild_settings in binding.gyp.');
    } else {
      log('No msbuild_settings found in binding.gyp.');
    }
    
    // Check for msvs_settings
    if (bindingGypContent.includes('msvs_settings')) {
      log('Found msvs_settings in binding.gyp.');
    } else {
      log('No msvs_settings found in binding.gyp.');
    }
    
    // Check for conditional Windows settings
    if (bindingGypContent.includes('OS=="win"')) {
      log('Found Windows-specific settings in binding.gyp.');
    } else {
      log('No Windows-specific settings found in binding.gyp.');
    }
    
    // Check for generated .vcxproj file
    const buildDir = path.resolve(TREE_SITTER_PATH, 'build');
    if (fs.existsSync(buildDir)) {
      log('Found build directory. Checking for .vcxproj files...');
      
      try {
        const vcxprojFiles = fs.readdirSync(buildDir)
          .filter(file => file.endsWith('.vcxproj'));
        
        if (vcxprojFiles.length > 0) {
          log(`Found ${vcxprojFiles.length} .vcxproj files.`);
          
          vcxprojFiles.forEach(file => {
            const vcxprojPath = path.resolve(buildDir, file);
            try {
              const vcxprojContent = fs.readFileSync(vcxprojPath, 'utf8');
              
              log(`Checking ${file} for C++ standard...`);
              
              if (vcxprojContent.includes('LanguageStandard="stdcpp20"')) {
                log(`Found C++20 language standard in ${file}.`);
              } else if (vcxprojContent.includes('LanguageStandard="stdcpp17"')) {
                log(`Warning: Found C++17 language standard in ${file}.`);
              } else if (vcxprojContent.includes('/std:c++20')) {
                log(`Found C++20 compiler flag in ${file}.`);
              } else if (vcxprojContent.includes('/std:c++17')) {
                log(`Warning: Found C++17 compiler flag in ${file}.`);
              } else {
                log(`No explicit C++ language standard found in ${file}.`);
              }
            } catch (err) {
              log(`Error reading ${file}: ${err.message}`);
            }
          });
        } else {
          log('No .vcxproj files found in build directory.');
        }
      } catch (err) {
        log(`Error reading build directory: ${err.message}`);
      }
    } else {
      log('No build directory found. The project may not have been configured yet.');
    }
    
  } catch (err) {
    log(`Error reading binding.gyp: ${err.message}`);
    process.exit(1);
  }
  
  log('Examination complete.');
}

// Run the script
main(); 