#!/usr/bin/env node

/**
 * This script patches tree-sitter .vcxproj files to ensure they use C++20
 * It runs after node-gyp configure but before node-gyp build.
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

// Find all tree-sitter .vcxproj files
function findTreeSitterVcxprojFiles() {
  try {
    log('Searching for tree-sitter .vcxproj files...');
    
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
        // Use PowerShell to find .vcxproj files
        const command = 'powershell -Command "Get-ChildItem -Path .\\node_modules -Recurse -Filter *.vcxproj | Where-Object { $_.FullName -like \'*tree-sitter*\' } | Select-Object -ExpandProperty FullName"';
        result = execSync(command, { encoding: 'utf8' })
          .trim()
          .split('\r\n')
          .filter(line => line !== '');
      } catch (winError) {
        log(`PowerShell search failed: ${winError.message}`);
        
        // Fallback to checking common locations
        const treeSitterBuildPath = path.resolve(process.cwd(), 'node_modules', 'tree-sitter', 'build');
        if (fs.existsSync(treeSitterBuildPath)) {
          try {
            const files = fs.readdirSync(treeSitterBuildPath);
            const vcxprojFiles = files
              .filter(file => file.endsWith('.vcxproj'))
              .map(file => path.resolve(treeSitterBuildPath, file));
            result = vcxprojFiles;
          } catch (err) {
            log(`Error reading build directory: ${err.message}`);
          }
        }
      }
    } else {
      // Unix - use find command
      result = execSync(
        'find ./node_modules -path "*tree-sitter*/build/*.vcxproj" -type f',
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
      ).trim().split('\n').filter(line => line !== '');
    }
    
    log(`Found ${result.length} .vcxproj files related to tree-sitter.`);
    return result;
  } catch (error) {
    log('Error searching for .vcxproj files:');
    log(error.message);
    
    // Final fallback - check the most common locations
    const commonPaths = [
      path.resolve(process.cwd(), 'node_modules', 'tree-sitter', 'build', 'tree_sitter_runtime_binding.vcxproj'),
      path.resolve(process.cwd(), 'node_modules', 'tree-sitter', 'build', 'tree_sitter.vcxproj')
    ];
    
    return commonPaths.filter(p => fs.existsSync(p));
  }
}

// Patch the .vcxproj file to force C++20
function patchVcxprojFile(filePath) {
  try {
    log(`Patching: ${filePath}`);
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Check if file already has C++20 language standard
    if (content.includes('LanguageStandard="stdcpp20"')) {
      log('  File already has C++20 language standard.');
      // Still check for overrides
    }
    
    // First approach: Set LanguageStandard property
    // Look for PropertyGroup with Label="Configuration"
    if (content.includes('<PropertyGroup Label="Configuration">')) {
      log('  Found PropertyGroup with Label="Configuration"');
      
      if (content.includes('<LanguageStandard>')) {
        // Replace existing LanguageStandard setting
        content = content.replace(
          /<LanguageStandard>stdcpp\d+<\/LanguageStandard>/g, 
          '<LanguageStandard>stdcpp20</LanguageStandard>'
        );
      } else {
        // Add LanguageStandard property to existing PropertyGroup
        content = content.replace(
          /<PropertyGroup Label="Configuration">/g,
          '<PropertyGroup Label="Configuration">\n    <LanguageStandard>stdcpp20</LanguageStandard>'
        );
      }
    }
    
    // Second approach: Check for ClCompile ItemDefinitionGroup
    if (content.includes('<ItemDefinitionGroup')) {
      log('  Found ItemDefinitionGroup');
      
      // If there's a ClCompile section inside ItemDefinitionGroup
      if (content.includes('<ClCompile>')) {
        log('  Found ClCompile section');
        
        if (content.includes('<LanguageStandard>')) {
          // Replace existing LanguageStandard setting
          content = content.replace(
            /<LanguageStandard>stdcpp\d+<\/LanguageStandard>/g, 
            '<LanguageStandard>stdcpp20</LanguageStandard>'
          );
        } else {
          // Add LanguageStandard to existing ClCompile section
          content = content.replace(
            /<ClCompile>/g,
            '<ClCompile>\n      <LanguageStandard>stdcpp20</LanguageStandard>'
          );
        }
      } else {
        // Add ClCompile section with LanguageStandard to ItemDefinitionGroup
        content = content.replace(
          /<ItemDefinitionGroup/g,
          '<ItemDefinitionGroup>\n    <ClCompile>\n      <LanguageStandard>stdcpp20</LanguageStandard>\n    </ClCompile>\n  </ItemDefinitionGroup>\n  <ItemDefinitionGroup'
        );
      }
    }
    
    // Third approach: Look for AdditionalOptions in ClCompile
    if (content.includes('<AdditionalOptions>')) {
      log('  Found AdditionalOptions');
      
      // Add C++20 flag if not already there, making sure we remove any C++17 flags
      if (content.includes('/std:c++17') || content.includes('-std:c++17')) {
        // Replace C++17 with C++20
        content = content.replace(/[\/\-]std:c\+\+17/g, '/std:c++20');
      } else if (!content.includes('/std:c++20') && !content.includes('-std:c++20')) {
        // Add C++20 flag to existing AdditionalOptions
        content = content.replace(
          /<AdditionalOptions>/g,
          '<AdditionalOptions>/std:c++20 '
        );
      }
    } else if (content.includes('<ClCompile>')) {
      // Add AdditionalOptions with C++20 flag
      content = content.replace(
        /<ClCompile>/g,
        '<ClCompile>\n      <AdditionalOptions>/std:c++20 %(AdditionalOptions)</AdditionalOptions>'
      );
    }
    
    // Write the file back if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      log('  Successfully patched .vcxproj file.');
      return true;
    } else {
      log('  No changes needed or unable to make changes.');
      return false;
    }
  } catch (error) {
    log(`Error patching ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
function main() {
  log('Starting tree-sitter .vcxproj patching script...');
  
  // Find .vcxproj files
  const vcxprojFiles = findTreeSitterVcxprojFiles();
  
  if (vcxprojFiles.length === 0) {
    log('No tree-sitter .vcxproj files found. Make sure to run node-gyp configure first.');
    process.exit(0);
  }
  
  // Patch each .vcxproj file
  let patchedFiles = 0;
  for (const file of vcxprojFiles) {
    if (patchVcxprojFile(file)) {
      patchedFiles++;
    }
  }
  
  log(`Patched ${patchedFiles} out of ${vcxprojFiles.length} .vcxproj files.`);
  log('Done.');
}

// Run the script
main(); 