#!/usr/bin/env node

/**
 * This script rebuilds tree-sitter with proper C++20 flags for Windows
 * It uses a more controlled approach than npm rebuild to ensure flags are applied correctly
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Options
const verbose = process.argv.includes('--verbose');
const isWindows = process.platform === 'win32';

// Logging with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Execute command and return output
function execCommand(command, options = {}) {
  const defaultOptions = {
    stdio: verbose ? 'inherit' : 'pipe',
    encoding: 'utf8'
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  if (verbose) {
    log(`Executing: ${command}`);
  }
  
  try {
    return execSync(command, finalOptions);
  } catch (error) {
    log(`Error executing command: ${command}`);
    log(error.message);
    if (error.stdout) log(`stdout: ${error.stdout}`);
    if (error.stderr) log(`stderr: ${error.stderr}`);
    throw error;
  }
}

// Find tree-sitter modules
function findTreeSitterModules() {
  log('Finding tree-sitter modules...');
  
  const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    throw new Error('node_modules directory not found');
  }
  
  // Main tree-sitter module
  const treeSitterPath = path.resolve(nodeModulesPath, 'tree-sitter');
  if (!fs.existsSync(treeSitterPath)) {
    throw new Error('tree-sitter module not found');
  }
  
  // Find other tree-sitter modules
  const modules = ['tree-sitter'];
  const dirs = fs.readdirSync(nodeModulesPath);
  
  for (const dir of dirs) {
    if (dir.startsWith('tree-sitter-') && 
        fs.existsSync(path.resolve(nodeModulesPath, dir, 'binding.gyp'))) {
      modules.push(dir);
    }
  }
  
  log(`Found ${modules.length} tree-sitter modules: ${modules.join(', ')}`);
  return modules;
}

// Patch binding.gyp for C++20 support
function patchBindingGyp(modulePath) {
  const bindingGyp = path.resolve(modulePath, 'binding.gyp');
  if (!fs.existsSync(bindingGyp)) return false;
  
  log(`Patching binding.gyp for ${path.basename(modulePath)}`);
  
  let content = fs.readFileSync(bindingGyp, 'utf8');
  const originalContent = content;
  
  // Add msbuild_settings for C++20
  if (!content.includes('"LanguageStandard": "stdcpp20"')) {
    if (content.includes('msbuild_settings')) {
      // Update existing settings
      if (content.includes('LanguageStandard')) {
        content = content.replace(
          /"LanguageStandard"\s*:\s*"stdcpp\d+"/g,
          '"LanguageStandard": "stdcpp20"'
        );
      } else if (content.includes('ClCompile')) {
        content = content.replace(
          /"ClCompile"\s*:\s*{/g,
          '"ClCompile": {\n            "LanguageStandard": "stdcpp20",'
        );
      }
    } else {
      // Add new settings
      if (content.includes('"conditions":')) {
        // Add to existing conditions
        if (!content.includes('OS=="win"')) {
          content = content.replace(
            /"conditions"\s*:\s*\[/g,
            '"conditions": [\n        [\'OS=="win"\', {\n          "msbuild_settings": {\n            "ClCompile": {\n              "LanguageStandard": "stdcpp20"\n            }\n          }\n        }],'
          );
        }
      } else {
        // Add new conditions section
        content = content.replace(
          /(\s*)(\}\])(\s*)$/,
          '$1  ,\n$1  "conditions": [\n$1    [\'OS=="win"\', {\n$1      "msbuild_settings": {\n$1        "ClCompile": {\n$1          "LanguageStandard": "stdcpp20"\n$1        }\n$1      }\n$1    }]\n$1  ]$2$3'
        );
      }
    }
  }
  
  // Also add msvs_settings for C++20
  if (!content.includes('"/std:c++20"') && !content.includes('"-std:c++20"')) {
    if (content.includes('msvs_settings')) {
      if (content.includes('AdditionalOptions')) {
        content = content.replace(
          /"AdditionalOptions"\s*:\s*\[/g,
          '"AdditionalOptions": [\n            "/std:c++20",'
        );
      } else if (content.includes('VCCLCompilerTool')) {
        content = content.replace(
          /"VCCLCompilerTool"\s*:\s*{/g,
          '"VCCLCompilerTool": {\n            "AdditionalOptions": ["/std:c++20"],'
        );
      }
    }
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(bindingGyp, content, 'utf8');
    log(`Patched binding.gyp for ${path.basename(modulePath)}`);
    return true;
  }
  
  return false;
}

// Create a file that forces C++20 in MSBuild
function createForceCpp20Target(modulePath) {
  const directory = path.resolve(modulePath, 'build');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  
  const targetFile = path.resolve(directory, 'Directory.Build.props');
  const content = `<?xml version="1.0" encoding="utf-8"?>
<Project>
  <ItemDefinitionGroup>
    <ClCompile>
      <LanguageStandard>stdcpp20</LanguageStandard>
      <AdditionalOptions>/std:c++20 %(AdditionalOptions)</AdditionalOptions>
    </ClCompile>
  </ItemDefinitionGroup>
</Project>`;
  
  fs.writeFileSync(targetFile, content, 'utf8');
  log(`Created ${targetFile} to force C++20`);
}

// Main function
async function main() {
  try {
    log('Starting tree-sitter rebuild with C++20...');
    
    // Find tree-sitter modules
    const modules = findTreeSitterModules();
    
    for (const moduleName of modules) {
      const modulePath = path.resolve(process.cwd(), 'node_modules', moduleName);
      log(`Processing ${moduleName}...`);
      
      // Patch binding.gyp
      patchBindingGyp(modulePath);
      
      // Create Directory.Build.props for MSBuild
      if (isWindows) {
        createForceCpp20Target(modulePath);
      }
      
      // Clean
      log(`Cleaning ${moduleName}...`);
      execCommand(`cd "${modulePath}" && node-gyp clean`, { shell: true });
      
      // Configure
      log(`Configuring ${moduleName}...`);
      let configureCmd = `cd "${modulePath}" && node-gyp configure`;
      if (isWindows) {
        configureCmd += ' --msvs_version=2022';
      }
      execCommand(configureCmd, { shell: true });
      
      // Patch vcxproj files directly
      if (isWindows) {
        log(`Patching vcxproj files for ${moduleName}...`);
        const buildDir = path.resolve(modulePath, 'build');
        if (fs.existsSync(buildDir)) {
          const files = fs.readdirSync(buildDir);
          for (const file of files) {
            if (file.endsWith('.vcxproj')) {
              const vcxprojPath = path.resolve(buildDir, file);
              let vcxprojContent = fs.readFileSync(vcxprojPath, 'utf8');
              
              // Replace C++17 with C++20
              if (vcxprojContent.includes('stdcpp17')) {
                vcxprojContent = vcxprojContent.replace(/stdcpp17/g, 'stdcpp20');
                fs.writeFileSync(vcxprojPath, vcxprojContent, 'utf8');
                log(`  Patched ${file} to use C++20`);
              }
              
              // Add C++20 to Additional Options
              if (vcxprojContent.includes('<AdditionalOptions>')) {
                if (vcxprojContent.includes('/std:c++17')) {
                  vcxprojContent = vcxprojContent.replace(/\/std:c\+\+17/g, '/std:c++20');
                  fs.writeFileSync(vcxprojPath, vcxprojContent, 'utf8');
                  log(`  Replaced C++17 flag with C++20 in ${file}`);
                }
              }
            }
          }
        }
      }
      
      // Build
      log(`Building ${moduleName}...`);
      let buildCmd = `cd "${modulePath}" && node-gyp build`;
      if (verbose) buildCmd += ' --verbose';
      
      try {
        execCommand(buildCmd, { 
          shell: true,
          env: {
            ...process.env,
            CXXFLAGS: isWindows ? '/std:c++20' : '-std=c++20',
            CXX_FLAGS: isWindows ? '/std:c++20' : '-std=c++20'
          }
        });
        log(`Successfully rebuilt ${moduleName}`);
      } catch (buildError) {
        log(`Error building ${moduleName}: ${buildError.message}`);
        log('Continuing with next module...');
      }
    }
    
    log('Tree-sitter rebuild complete.');
  } catch (error) {
    log(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main(); 