/**
 * Script to rebuild native modules with C++20 support
 * This helps ensure tree-sitter and other native modules work on all platforms
 */

const { execSync } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

// Platform detection
const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';
const isLinux = process.platform === 'linux';

// Native modules to rebuild
const nativeModules = [
  'tree-sitter',
  'tree-sitter-javascript',
  'tree-sitter-typescript',
  'tree-sitter-python',
  'tree-sitter-css',
  'tree-sitter-html',
  'fsevents',
  'minimatch',
  'tiktoken',
  'node-gyp-build'
];

// Filter out tree-sitter modules if SKIP_TREE_SITTER is set
const shouldSkipTreeSitter = process.env.SKIP_TREE_SITTER === 'true';
const modulesToRebuild = shouldSkipTreeSitter 
  ? nativeModules.filter(mod => !mod.includes('tree-sitter'))
  : nativeModules;

if (shouldSkipTreeSitter) {
  console.log('🔔 Skipping tree-sitter modules as they were already rebuilt separately');
}

/**
 * Reads configuration from multiple sources with priority:
 * 1. Environment variables (highest priority) - GitHub Actions workflow sets these
 * 2. User config file (config/native-modules.json)
 * 3. .npmrc file
 * 4. Default values (lowest priority)
 * 
 * @returns {Object} Configuration object with all settings
 */
function getConfiguration() {
  // Start with default configuration
  const config = {
    visualStudioVersion: '2022', // Updated default to 2022
    nodeGypPath: '',
    cxxStandard: 'c++20'
  };
  
  // Environment variables from the workflow have highest priority
  // Note: We prioritize GYP_MSVS_VERSION over npm_config_msvs_version
  if (process.env.GYP_MSVS_VERSION) {
    config.visualStudioVersion = process.env.GYP_MSVS_VERSION;
    console.log(`ℹ️ Using GYP_MSVS_VERSION from environment: ${config.visualStudioVersion}`);
  } else if (process.env.npm_config_msvs_version) {
    config.visualStudioVersion = process.env.npm_config_msvs_version;
  }
  
  if (process.env.NODE_GYP_PATH) {
    config.nodeGypPath = process.env.NODE_GYP_PATH;
  }
  
  // For C++ standard, check CXXFLAGS first (workflow sets this)
  if (process.env.CXXFLAGS) {
    const cxxFlagsMatch = process.env.CXXFLAGS.match(/[-\/]std[:=]([^\s]+)/);
    if (cxxFlagsMatch && cxxFlagsMatch[1]) {
      config.cxxStandard = cxxFlagsMatch[1];
      console.log(`ℹ️ Extracted C++ standard from CXXFLAGS: ${config.cxxStandard}`);
    }
  } else if (process.env.npm_config_cxx_std) {
    config.cxxStandard = process.env.npm_config_cxx_std;
  }
  
  // Read from .npmrc file (legacy support)
  const npmrcConfig = readNpmrcFile();
  if (npmrcConfig['npm_config_msvs_version'] && !process.env.GYP_MSVS_VERSION && !process.env.npm_config_msvs_version) {
    config.visualStudioVersion = npmrcConfig['npm_config_msvs_version'];
  }
  if (npmrcConfig['node-gyp-binary-path'] && !process.env.NODE_GYP_PATH) {
    config.nodeGypPath = npmrcConfig['node-gyp-binary-path'];
  }
  
  // Read from user config file (lower priority than environment variables)
  const userConfig = readUserConfigFile();
  if (userConfig) {
    // Only apply if environment variables aren't set
    const platformConfig = isWin ? userConfig.windows : 
                        isMac ? userConfig.mac : 
                        isLinux ? userConfig.linux : null;
    
    if (platformConfig) {
      if (isWin && platformConfig.visualStudioVersion && !process.env.GYP_MSVS_VERSION && !process.env.npm_config_msvs_version) {
        config.visualStudioVersion = platformConfig.visualStudioVersion;
      }
      if (platformConfig.nodeGypPath && !process.env.NODE_GYP_PATH) {
        config.nodeGypPath = platformConfig.nodeGypPath;
      }
    }
  }
  
  // Handle Windows-specific node-gyp path with .cmd extension
  if (isWin && config.nodeGypPath && !config.nodeGypPath.endsWith('.cmd')) {
    // Check if we need to add .cmd extension for Windows
    const cmdPath = `${config.nodeGypPath}.cmd`
    if (fs.existsSync(cmdPath)) {
      config.nodeGypPath = cmdPath;
      console.log(`ℹ️ Detected Windows environment, using ${cmdPath}`);
    }
  }
  
  // Log where each key configuration came from for debugging
  console.log('📋 Configuration sources:');
  console.log(`   - Visual Studio Version: ${process.env.GYP_MSVS_VERSION ? 'GYP_MSVS_VERSION env' : 
                                           process.env.npm_config_msvs_version ? 'npm_config_msvs_version env' : 
                                           'config file or default'}`);
  console.log(`   - C++ Standard: ${process.env.CXXFLAGS ? 'CXXFLAGS env' : 
                                  process.env.npm_config_cxx_std ? 'npm_config_cxx_std env' : 
                                  'config file or default'}`);
  
  return config;
}

/**
 * Reads and parses the user configuration file
 * @returns {Object|null} User configuration object or null if not found
 */
function readUserConfigFile() {
  const configPath = path.join(process.cwd(), 'config', 'native-modules.json');
  
  if (fs.existsSync(configPath)) {
    try {
      const fileContent = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(fileContent);
      console.log('📝 Loaded configuration from config/native-modules.json');
      return config;
    } catch (err) {
      console.warn(`⚠️ Error reading configuration file: ${err.message}`);
    }
  } else {
    console.log('ℹ️ No configuration file found at config/native-modules.json');
  }
  
  return null;
}

/**
 * Reads and parses the .npmrc file to extract configuration values
 * @returns {Object} Configuration object with values from .npmrc
 */
function readNpmrcFile() {
  const config = {};
  const npmrcPath = path.join(process.cwd(), '.npmrc');
  
  if (fs.existsSync(npmrcPath)) {
    try {
      const fileContent = fs.readFileSync(npmrcPath, 'utf8');
      const lines = fileContent.split('\n');
      
      for (const line of lines) {
        // Skip empty lines and comments
        if (!line.trim() || line.startsWith('#')) continue;
        
        const [key, value] = line.split('=').map(part => part.trim());
        if (key && value) {
          config[key] = value;
        }
      }
      
      console.log('📝 Loaded configuration from .npmrc file');
    } catch (err) {
      console.warn(`⚠️ Error reading .npmrc file: ${err.message}`);
    }
  } else {
    console.log('ℹ️ No .npmrc file found, using default configurations');
  }
  
  return config;
}

/**
 * Patches binding.gyp files to ensure C++20 standard is used
 */
function patchBindingGypFiles() {
  console.log('🔧 Patching binding.gyp files for C++20 support...');
  
  const modulesDir = path.join(process.cwd(), 'node_modules');
  
  // List of modules that need C++20
  const modulesToPatch = [
    'tree-sitter',
    'tree-sitter-javascript',
    'tree-sitter-typescript',
    'tree-sitter-python',
    'tree-sitter-css',
    'tree-sitter-html'
  ];

  modulesToPatch.forEach(module => {
    const moduleDir = path.join(modulesDir, module);
    const bindingGypPath = path.join(moduleDir, 'binding.gyp');
    
    if (fs.existsSync(bindingGypPath)) {
      try {
        let content = fs.readFileSync(bindingGypPath, 'utf8');
        const originalContent = content;
        
        // Replace all C++17 references with C++20
        content = content
          .replace(/"-std=c\+\+17"/g, '"-std=c++20"')
          .replace(/"CLANG_CXX_LANGUAGE_STANDARD": "c\+\+17"/g, '"CLANG_CXX_LANGUAGE_STANDARD": "c++20"')
          .replace(/"\/std:c\+\+17"/g, '"/std:c++20"');
        
        // Add C++20 settings if none exist already (more comprehensive patching)
        if (!content.includes('c++20') && !content.includes('stdcpp20')) {
          // For Windows MSVC
          if (content.includes('conditions') && content.includes('OS=="win"')) {
            content = content.replace(
              /'OS=="win"'\s*,\s*{/g, 
              `'OS=="win"', {\n        'msbuild_settings': { 'ClCompile': { 'LanguageStandard': 'stdcpp20' } },`
            );
          }
          
          // For Unix/Mac
          if (content.includes('conditions') && content.includes('OS!="win"')) {
            content = content.replace(
              /'OS!="win"'\s*,\s*{/g, 
              `'OS!="win"', {\n        'cflags_cc': ["-std=c++20"],`
            );
          }
        }
        
        if (content !== originalContent) {
          fs.writeFileSync(bindingGypPath, content);
          console.log(`   ✅ Patched ${module}/binding.gyp with C++20 support`);
        }
        
        // On Windows, create Directory.Build.props to force C++20
        if (isWin) {
          const buildDir = path.join(moduleDir, 'build');
          if (!fs.existsSync(buildDir)) {
            fs.mkdirSync(buildDir, { recursive: true });
          }
          
          const propsFilePath = path.join(buildDir, 'Directory.Build.props');
          const propsContent = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generated by rebuild-native-modules.js -->
<Project>
  <ItemDefinitionGroup>
    <ClCompile>
      <!-- Force C++20 at highest MSBuild priority -->
      <LanguageStandard>stdcpp20</LanguageStandard>
      <!-- The additional options are appended AFTER other options -->
      <AdditionalOptions>/std:c++20 %(AdditionalOptions)</AdditionalOptions>
    </ClCompile>
  </ItemDefinitionGroup>
  
  <!-- Remove any C++17 flag from command line -->
  <Target Name="RemoveCpp17Flag" 
          BeforeTargets="ClCompile">
    <ItemGroup>
      <ClCompile>
        <AdditionalOptions>$([System.String]::Copy('%(ClCompile.AdditionalOptions)').Replace('/std:c++17', ''))</AdditionalOptions>
      </ClCompile>
    </ItemGroup>
  </Target>
</Project>`;
          
          fs.writeFileSync(propsFilePath, propsContent);
          console.log(`   ✅ Created MSBuild props file for ${module} to force C++20`);
        }
      } catch (err) {
        console.warn(`   ⚠️ Could not patch ${module}/binding.gyp: ${err.message}`);
      }
    }
  });
}

async function main() {
  try {
    console.log('🔄 Rebuilding native modules with platform-specific configurations...');
    
    // Patch binding.gyp files first
    patchBindingGypFiles();
    
    // Get unified configuration from all sources
    const config = getConfiguration();
    
    // Log the final configuration being used
    console.log('📋 Using configuration:');
    if (isWin) {
      console.log(`   - Visual Studio Version: ${config.visualStudioVersion}`);
    }
    console.log(`   - C++ Standard: ${config.cxxStandard}`);
    if (config.nodeGypPath) {
      console.log(`   - Node-gyp Path: ${config.nodeGypPath}`);
    }
    
    // Create appropriate compiler flags based on platform - PRESERVE existing workflow variables
    let env = { ...process.env };
    
    // Only set these values if not already provided in environment
    if (isMac) {
      // macOS: Use clang with C++20 flags
      if (!env.CXXFLAGS) {
        env.CXXFLAGS = `-std=${config.cxxStandard}`;
      }
      if (!env.CXX_FLAGS) {
        env.CXX_FLAGS = `-std=${config.cxxStandard}`;
      }
      if (!env.npm_config_cxx_std) {
        env.npm_config_cxx_std = config.cxxStandard;
      }
      // Only set CC/CXX if not already in environment
      if (!env.CC) env.CC = 'clang';
      if (!env.CXX) env.CXX = 'clang++';
    } else if (isWin) {
      // Windows: Use MSVC with C++20 flags
      if (!env.CXXFLAGS) {
        env.CXXFLAGS = `/std:${config.cxxStandard}`;
      }
      if (!env.CXX_FLAGS) {
        env.CXX_FLAGS = `/std:${config.cxxStandard}`;
      }
      if (!env.npm_config_cxx_std) {
        env.npm_config_cxx_std = config.cxxStandard;
      }
      if (!env.GYP_MSVS_VERSION) {
        env.GYP_MSVS_VERSION = config.visualStudioVersion;
      }
      if (!env.npm_config_msvs_version) {
        env.npm_config_msvs_version = config.visualStudioVersion;
      }
      if (!env.npm_config_node_gyp_force_unsupported_msvs_version) {
        env.npm_config_node_gyp_force_unsupported_msvs_version = 'true';
      }
      
      // If node-gyp path is specified and not already in environment, use it
      if (config.nodeGypPath && !env.npm_config_node_gyp) {
        env.npm_config_node_gyp = config.nodeGypPath;
      }
    } else if (isLinux) {
      // Linux: Use GCC with C++20 flags
      if (!env.CXXFLAGS) {
        env.CXXFLAGS = `-std=${config.cxxStandard}`;
      }
      if (!env.CXX_FLAGS) {
        env.CXX_FLAGS = `-std=${config.cxxStandard}`;
      }
      if (!env.npm_config_cxx_std) {
        env.npm_config_cxx_std = config.cxxStandard;
      }
      // Only set CC/CXX if not already in environment
      if (!env.CC) env.CC = 'gcc';
      if (!env.CXX) env.CXX = 'g++';
    }
    
    console.log('🔨 Rebuilding native modules for Electron...');
    
    try {
      // Use electron-rebuild directly for best results
      // Check if @electron/rebuild is available
      const electronRebuildPath = path.join(process.cwd(), 'node_modules', '@electron', 'rebuild');
      const hasElectronRebuild = fs.existsSync(electronRebuildPath);
      
      if (hasElectronRebuild) {
        // Get Electron version
        const electronPkg = require(path.join(process.cwd(), 'node_modules', 'electron', 'package.json'));
        const electronVersion = electronPkg.version;
        console.log(`📦 Using @electron/rebuild with Electron ${electronVersion}`);
        
        // Use the local installed @electron/rebuild
        const electronRebuild = require('@electron/rebuild');
        
        // Log key env vars for debugging
        console.log('📋 Key environment variables for rebuild:');
        console.log(`   - CXXFLAGS: ${env.CXXFLAGS || 'not set'}`);
        console.log(`   - GYP_MSVS_VERSION: ${env.GYP_MSVS_VERSION || 'not set'}`);
        if (isWin) {
          console.log(`   - PYTHON: ${env.PYTHON || 'not set'}`);
        }
        
        // Build the modules
        await electronRebuild.rebuild({
          buildPath: process.cwd(),
          electronVersion,
          force: true,
          types: ['prod', 'dev'],
          mode: 'sequential',
          onlyModules: modulesToRebuild,
          debug: true
        });
      } else {
        // Fallback to npm rebuild
        console.log('⚠️ @electron/rebuild not found, falling back to npm rebuild');
        
        // Build each module individually to ensure the env vars are applied
        for (const mod of modulesToRebuild) {
          console.log(`📦 Rebuilding ${mod}...`);
          execSync(`npm rebuild ${mod} --verbose`, { 
            env,
            stdio: 'inherit'
          });
        }
      }
      
      console.log('✅ All native modules rebuilt successfully with C++20 support!');
    } catch (error) {
      console.error(`❌ Error rebuilding native modules: ${error.message}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

// Run the main function
main();