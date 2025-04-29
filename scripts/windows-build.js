/**
 * Helper script for Windows builds
 * Ensures proper C++ standard is used for native modules
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function patchTreeSitterBindings() {
  console.log('🔧 Patching tree-sitter binding.gyp files for Windows...');
  
  const modulesDir = path.join(__dirname, '..', 'node_modules');
  
  // List of modules that need patching
  const modulesToPatch = [
    'tree-sitter',
    'tree-sitter-javascript',
    'tree-sitter-typescript',
    'tree-sitter-python',
    'tree-sitter-css',
    'tree-sitter-html'
  ];

  for (const module of modulesToPatch) {
    const bindingGypPath = path.join(modulesDir, module, 'binding.gyp');
    if (fs.existsSync(bindingGypPath)) {
      try {
        let content = fs.readFileSync(bindingGypPath, 'utf8');
        const originalContent = content;
        
        // Replace any C++17 flags with C++20
        content = content
          .replace(/"-std=c\+\+17"/g, '"-std=c++20"')
          .replace(/"\/std:c\+\+17"/g, '"/std:c++20"')
          .replace(/"CLANG_CXX_LANGUAGE_STANDARD": "c\+\+17"/g, '"CLANG_CXX_LANGUAGE_STANDARD": "c++20"');
        
        // Add Windows-specific MSVC flags if not already present
        if (!content.includes('/std:c++20') && !content.includes('/std:c++17')) {
          // Find "conditions" section or "targets" section to add MSVC flags
          if (content.includes('"conditions"')) {
            content = content.replace('"conditions"', 
                    '"msvs_settings": {\n' +
                    '        "VCCLCompilerTool": {\n' +
                    '          "AdditionalOptions": ["/std:c++20"]\n' +
                    '        }\n' +
                    '      },\n' +
                    '      "conditions"');
          } else if (content.includes('"targets"')) {
            content = content.replace('"targets"', 
                    '"targets"');
            // Find the first target and add the MSVC settings
            const targetMatch = content.match(/"targets"[\s\S]*?{[\s\S]*?{/);
            if (targetMatch) {
              const insertPos = targetMatch.index + targetMatch[0].length;
              const insertContent = '\n' +
                '        "msvs_settings": {\n' +
                '          "VCCLCompilerTool": {\n' +
                '            "AdditionalOptions": ["/std:c++20"]\n' +
                '          }\n' +
                '        },';
              content = content.slice(0, insertPos) + insertContent + content.slice(insertPos);
            }
          }
        }
        
        if (content !== originalContent) {
          fs.writeFileSync(bindingGypPath, content);
          console.log(`   ✅ Patched ${module}/binding.gyp for C++20 with MSVC flags`);
        } else {
          console.log(`   ℹ️ No changes needed for ${module}/binding.gyp`);
        }
      } catch (err) {
        console.warn(`   ⚠️ Could not patch ${module}/binding.gyp: ${err.message}`);
      }
    }
  }
}

async function main() {
  try {
    console.log('🔧 Starting Windows build with C++20 support...');
    
    // Patch tree-sitter binding.gyp files first
    await patchTreeSitterBindings();
    
    // Create a temporary .npmrc-win file with required settings
    const npmrcWinPath = path.join(__dirname, '..', '.npmrc-win');
    const content = `
node-gyp-binary-path=${process.env.npm_config_node_gyp_binary_path || '/opt/homebrew/bin/node-gyp'}
npm_config_cxx_std=c++20
# Windows-specific configurations
npm_config_msvs_version=2022
npm_config_target_arch=x64
npm_config_platform=win32
# Override native module flags for cross-compilation
npm_config_clang=false
npm_config_node_gyp_force_unsupported_msvs_version=true
`;
    
    fs.writeFileSync(npmrcWinPath, content.trim(), 'utf8');
    console.log('✅ Created temporary Windows-specific .npmrc file');
    
    // Set environment variables that will help with C++20 standard
    const env = {
      ...process.env,
      npm_config_cxx_std: 'c++20',
      npm_config_npmrc: npmrcWinPath,
      CXXFLAGS: '/std:c++20', // MSVC-specific C++20 flag
      CXX_FLAGS: '/std:c++20',
      npm_config_msvs_version: '2022',
      npm_config_msbuild_path: process.env.npm_config_msbuild_path || "",
      npm_config_node_gyp_force_unsupported_msvs_version: "true",
      npm_config_vs_version: "2022"
    };
    
    // Run the build command with our enhanced environment
    console.log('🔨 Building Vite app...');
    execSync('npm run build', { stdio: 'inherit', env });
    
    // Rebuild native modules with proper C++20 support
    console.log('🔄 Rebuilding native modules for Windows...');
    try {
      execSync('npm run rebuild-native-modules', { stdio: 'inherit', env });
    } catch (err) {
      console.warn('⚠️ Native module rebuild had some issues, continuing with packaging...');
      console.warn(err.message);
    }
    
    console.log('📦 Packaging Windows app...');
    execSync('electron-builder --win --publish=never', { stdio: 'inherit', env });
    
    // Clean up
    console.log('🧹 Cleaning up temporary files...');
    fs.unlinkSync(npmrcWinPath);
    
    console.log('✅ Windows build completed successfully!');
  } catch (error) {
    console.error('❌ Windows build failed:', error.message);
    process.exit(1);
  }
}

main(); 