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
  'tree-sitter-html'
];

/**
 * Reads configuration from multiple sources with priority:
 * 1. Environment variables (highest priority)
 * 2. User config file (config/native-modules.json)
 * 3. .npmrc file
 * 4. Default values (lowest priority)
 * 
 * @returns {Object} Configuration object with all settings
 */
function getConfiguration() {
  // Start with default configuration
  const config = {
    visualStudioVersion: '2019',
    nodeGypPath: '',
    cxxStandard: 'c++20'
  };
  
  // Read from .npmrc file (legacy support)
  const npmrcConfig = readNpmrcFile();
  if (npmrcConfig['npm_config_msvs_version']) {
    config.visualStudioVersion = npmrcConfig['npm_config_msvs_version'];
  }
  if (npmrcConfig['node-gyp-binary-path']) {
    config.nodeGypPath = npmrcConfig['node-gyp-binary-path'];
  }
  if (npmrcConfig['npm_config_cxx_std']) {
    config.cxxStandard = npmrcConfig['npm_config_cxx_std'];
  }
  
  // Read from user config file (higher priority)
  const userConfig = readUserConfigFile();
  if (userConfig) {
    // Platform-specific configurations
    const platformConfig = isWin ? userConfig.windows : 
                          isMac ? userConfig.mac : 
                          isLinux ? userConfig.linux : null;
    
    if (platformConfig) {
      if (isWin && platformConfig.visualStudioVersion) {
        config.visualStudioVersion = platformConfig.visualStudioVersion;
      }
      if (platformConfig.nodeGypPath) {
        config.nodeGypPath = platformConfig.nodeGypPath;
      }
    }
    
    // General configurations
    if (userConfig.general && userConfig.general.cxxStandard) {
      config.cxxStandard = userConfig.general.cxxStandard;
    }
  }
  
  // Environment variables have highest priority
  if (process.env.NPM_CONFIG_MSVS_VERSION) {
    config.visualStudioVersion = process.env.NPM_CONFIG_MSVS_VERSION;
  }
  if (process.env.NODE_GYP_PATH) {
    config.nodeGypPath = process.env.NODE_GYP_PATH;
  }
  if (process.env.NPM_CONFIG_CXX_STD) {
    config.cxxStandard = process.env.NPM_CONFIG_CXX_STD;
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
 * Rebuilds native modules with proper C++20 support
 */
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
    const bindingGypPath = path.join(modulesDir, module, 'binding.gyp');
    if (fs.existsSync(bindingGypPath)) {
      try {
        let content = fs.readFileSync(bindingGypPath, 'utf8');
        const originalContent = content;
        
        // Replace all C++17 references with C++20
        content = content
          .replace(/"-std=c\+\+17"/g, '"-std=c++20"')
          .replace(/"CLANG_CXX_LANGUAGE_STANDARD": "c\+\+17"/g, '"CLANG_CXX_LANGUAGE_STANDARD": "c++20"')
          .replace(/"\/std:c\+\+17"/g, '"/std:c++20"');
        
        if (content !== originalContent) {
          fs.writeFileSync(bindingGypPath, content);
          console.log(`   ✔ Patched ${module}/binding.gyp`);
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
    
    // Create appropriate compiler flags based on platform
    let env = { ...process.env };
    
    if (isMac) {
      // macOS: Use clang with C++20 flags
      env = {
        ...env,
        npm_config_cxx_std: config.cxxStandard,
        CXXFLAGS: `-std=${config.cxxStandard}`,
        CXX_FLAGS: `-std=${config.cxxStandard}`,
        CC: 'clang',
        CXX: 'clang++'
      };
      
      if (config.nodeGypPath) {
        env.npm_config_node_gyp = config.nodeGypPath;
      }
      
      console.log('🍎 Using macOS optimized settings with clang');
    } else if (isWin) {
      // Windows: Use MSVC with C++20 flags
      env = {
        ...env,
        npm_config_cxx_std: config.cxxStandard,
        npm_config_msvs_version: config.visualStudioVersion,
        npm_config_platform: 'win32'
      };
      
      if (config.nodeGypPath) {
        env.npm_config_node_gyp = config.nodeGypPath;
      }
      
      console.log(`🪟 Using Windows optimized settings with MSVC ${config.visualStudioVersion}`);
    } else {
      // Linux: Use GCC with C++20 flags
      env = {
        ...env,
        npm_config_cxx_std: config.cxxStandard,
        CXXFLAGS: `-std=${config.cxxStandard}`,
        CXX_FLAGS: `-std=${config.cxxStandard}`,
      };
      
      if (config.nodeGypPath) {
        env.npm_config_node_gyp = config.nodeGypPath;
      }
      
      console.log('🐧 Using Linux optimized settings with GCC');
    }

    // Use electron-rebuild to rebuild native modules
    const electronRebuildPath = path.join('node_modules', '.bin', 'electron-rebuild');
    
    if (fs.existsSync(electronRebuildPath)) {
      console.log('🔨 Using electron-rebuild to rebuild native modules...');
      
      const electronRebuildCmd = isWin ? 
        `${electronRebuildPath}.cmd --types prod --module-dir .` : 
        `./${electronRebuildPath} --types prod --module-dir .`;
      
      execSync(electronRebuildCmd, { stdio: 'inherit', env });
    } else {
      console.log('⚠️ electron-rebuild not found, attempting manual rebuild...');
      
      // Manually rebuild each native module using npm rebuild
      for (const module of nativeModules) {
        console.log(`🔨 Rebuilding ${module}...`);
        try {
          execSync(`npm rebuild ${module} --update-binary`, { stdio: 'inherit', env });
          console.log(`✅ Successfully rebuilt ${module}`);
        } catch (err) {
          console.error(`❌ Failed to rebuild ${module}: ${err.message}`);
        }
      }
    }

    console.log('✅ Native module rebuild completed');
  } catch (error) {
    console.error('❌ Failed to rebuild native modules:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();