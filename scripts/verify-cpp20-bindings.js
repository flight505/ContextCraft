#!/usr/bin/env node

/**
 * Verification and patching script for binding.gyp files
 * Ensures C++20 compatibility on Windows builds
 */

const fs = require('fs');
const path = require('path');

// List of modules that need C++20 compatibility
const modulesToCheck = [
  'tree-sitter',
  'tree-sitter-javascript',
  'tree-sitter-typescript',
  'tree-sitter-python',
  'tree-sitter-css',
  'tree-sitter-html'
];

// Check if running with --patch flag
const shouldPatch = process.argv.includes('--patch');
const shouldVerbose = process.argv.includes('--verbose');

function log(message) {
  if (shouldVerbose) {
    console.log(message);
  }
}

/**
 * Checks and optionally patches binding.gyp files for C++20 compatibility
 * @returns {boolean} Whether all modules are now compatible
 */
function verifyAndPatchBindings() {
  console.log(`🔍 ${shouldPatch ? 'Verifying and patching' : 'Verifying'} binding.gyp files for C++20 compatibility...`);
  
  const modulesDir = path.join(process.cwd(), 'node_modules');
  let allCompatible = true;
  let patchCount = 0;
  
  for (const module of modulesToCheck) {
    const bindingGypPath = path.join(modulesDir, module, 'binding.gyp');
    
    if (!fs.existsSync(bindingGypPath)) {
      console.warn(`⚠️ ${module}/binding.gyp not found - module may not be installed`);
      continue;
    }
    
    try {
      let content = fs.readFileSync(bindingGypPath, 'utf8');
      const originalContent = content;
      
      // Check for problematic patterns
      const hasCpp17Flag = content.includes('/std:c++17') || 
                          content.includes('-std=c++17') || 
                          content.includes('"c++17"');
                          
      const hasStdCpp17Override = /['"]\/std:c\+\+17['"]/.test(content);
      
      // Check for necessary C++20 patterns
      const hasCpp20Flag = content.includes('/std:c++20') || 
                          content.includes('-std=c++20') || 
                          content.includes('"c++20"');
                          
      const hasStdCpp20 = /['"]\/std:c\+\+20['"]/.test(content);
      const hasMsvcSettings = content.includes('VCCLCompilerTool');
      
      if (hasCpp17Flag) {
        console.warn(`⚠️ ${module}/binding.gyp contains C++17 flags that may override C++20 settings!`);
        
        if (shouldPatch) {
          // Replace C++17 with C++20 in various formats
          content = content
            .replace(/["']\/std:c\+\+17["']/g, '"/std:c++20"')
            .replace(/["']-std=c\+\+17["']/g, '"-std=c++20"')
            .replace(/["']c\+\+17["']/g, '"c++20"');
            
          log(`   Modified C++17 flags to C++20 in ${module}/binding.gyp`);
        }
      }
      
      // For Windows specifically, ensure MSVC compiler settings exist
      // and that they include the C++20 flag
      if (!hasMsvcSettings && shouldPatch) {
        // Find an appropriate place to insert MSVC settings
        
        // Common pattern 1: Look for "conditions" key
        if (content.includes('"conditions"')) {
          content = content.replace('"conditions"', 
            '"msvs_settings": {\n' +
            '      "VCCLCompilerTool": {\n' +
            '        "AdditionalOptions": ["/std:c++20"]\n' +
            '      }\n' +
            '    },\n' +
            '    "conditions"');
          log(`   Added MSVC settings before conditions in ${module}/binding.gyp`);
        } 
        // Common pattern 2: Look for target section
        else if (content.includes('"targets"')) {
          // Find the first target opening (after the "targets": [ { pattern)
          const targetMatch = content.match(/"targets"\s*:\s*\[\s*{/);
          if (targetMatch) {
            const insertPos = targetMatch.index + targetMatch[0].length;
            const insertContent = '\n' +
              '      "msvs_settings": {\n' +
              '        "VCCLCompilerTool": {\n' +
              '          "AdditionalOptions": ["/std:c++20"]\n' +
              '        }\n' +
              '      },';
            content = content.slice(0, insertPos) + insertContent + content.slice(insertPos);
            log(`   Added MSVC settings in first target in ${module}/binding.gyp`);
          }
        }
      } else if (hasMsvcSettings && !hasStdCpp20 && shouldPatch) {
        // Has MSVC settings but not C++20 flag - add the flag
        const msvcSettingsPattern = /"VCCLCompilerTool"\s*:\s*{(?:[^}]*?)}/;
        const match = content.match(msvcSettingsPattern);
        
        if (match) {
          // Check if AdditionalOptions exists
          if (match[0].includes('"AdditionalOptions"')) {
            // Add to existing AdditionalOptions array
            content = content.replace(
              /"AdditionalOptions"\s*:\s*\[([^\]]*)\]/,
              (match, options) => {
                if (options.trim()) {
                  return `"AdditionalOptions": [${options}, "/std:c++20"]`;
                } else {
                  return `"AdditionalOptions": ["/std:c++20"]`;
                }
              }
            );
          } else {
            // Add new AdditionalOptions key
            content = content.replace(
              /"VCCLCompilerTool"\s*:\s*{/,
              `"VCCLCompilerTool": {\n        "AdditionalOptions": ["/std:c++20"],`
            );
          }
          log(`   Added /std:c++20 flag to existing MSVC settings in ${module}/binding.gyp`);
        }
      }
      
      // Write changes if patching is enabled and content was modified
      if (shouldPatch && content !== originalContent) {
        fs.writeFileSync(bindingGypPath, content, 'utf8');
        console.log(`✅ Patched ${module}/binding.gyp for C++20 compatibility`);
        patchCount++;
      } else if (shouldPatch && content === originalContent && !hasCpp20Flag) {
        console.warn(`⚠️ Could not automatically patch ${module}/binding.gyp - manual intervention may be needed`);
        allCompatible = false;
      } else if (!hasCpp20Flag && !hasStdCpp20 && !shouldPatch) {
        console.warn(`⚠️ ${module}/binding.gyp may need C++20 flags for Windows compatibility`);
        allCompatible = false;
      } else {
        console.log(`✓ ${module}/binding.gyp ${hasCpp20Flag ? 'has C++20 flags' : 'needs review'}`);
      }
      
      // Special handling for tree-sitter - this is the critical one
      if (module === 'tree-sitter' && shouldVerbose) {
        console.log(`\nCurrent binding.gyp content for ${module}:`);
        console.log('------------------------------------------------');
        console.log(content);
        console.log('------------------------------------------------\n');
      }
      
    } catch (err) {
      console.error(`❌ Error processing ${module}/binding.gyp:`, err.message);
      allCompatible = false;
    }
  }
  
  if (shouldPatch) {
    console.log(`\n${patchCount > 0 ? `✅ Patched ${patchCount} binding.gyp files` : '⚠️ No binding.gyp files needed patching'}`);
  }
  
  return allCompatible;
}

const isCompatible = verifyAndPatchBindings();

if (isCompatible) {
  console.log('\n✅ All binding.gyp files appear to be compatible with C++20 requirements.');
  process.exit(0);
} else {
  if (shouldPatch) {
    console.error('\n⚠️ Some binding.gyp files could not be automatically patched for C++20 compatibility.');
    console.error('   You may need to manually edit these files or upgrade the modules.');
  } else {
    console.error('\n⚠️ Some binding.gyp files need to be patched for C++20 compatibility.');
    console.error('   Run with --patch flag to automatically apply fixes.');
  }
  process.exit(shouldPatch ? 1 : 0); // Only exit with error if patching was attempted
} 