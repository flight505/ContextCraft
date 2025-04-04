# Native Module Configuration

This configuration file allows you to customize how native modules are rebuilt in your project without modifying any JavaScript code.

## Platform Requirements

### Windows:
- **Visual Studio 2022** (with C++ desktop development workload)
- **Windows SDK** (included with Visual Studio)
- **node-gyp** (installed globally via npm)

### macOS:
- **Xcode Command Line Tools** (`xcode-select --install`)
- **node-gyp** (installed globally via npm)

### Linux:
- **GCC/G++** (version supporting C++20)
- **Python** (for node-gyp)
- **node-gyp** (installed globally via npm)

## Options

### Windows-specific Options
- `visualStudioVersion` - Specify which Visual Studio version to use (e.g., "2019", "2022")
- `nodeGypPath` - Custom path to node-gyp binary (leave empty to use default)
  - On Windows, this should point to the `.cmd` file (e.g., `C:\\Path\\To\\node-gyp.cmd`)

### Mac-specific Options
- `nodeGypPath` - Custom path to node-gyp binary (e.g., "/opt/homebrew/bin/node-gyp")

### Linux-specific Options
- `nodeGypPath` - Custom path to node-gyp binary

> Note: Visual Studio requirements are Windows-only. Other platforms use their native toolchains.

### General Options
- `cxxStandard` - C++ standard to use (e.g., "c++20", "c++17")

## Example Configuration

```json
{
  "windows": {
    "visualStudioVersion": "2022",
    "nodeGypPath": "C:\\Path\\To\\node-gyp.cmd"
  },
  "mac": {
    "nodeGypPath": "/opt/homebrew/bin/node-gyp"
  },
  "linux": {
    "nodeGypPath": "/usr/local/bin/node-gyp"
  },
  "general": {
    "cxxStandard": "c++20"
  }
}
```

## Priority Order

The system checks for configuration values in the following order (highest to lowest priority):

1. Environment variables (e.g., `NPM_CONFIG_MSVS_VERSION`, `NODE_GYP_PATH`)
2. This configuration file (`config/native-modules.json`)
3. Values in `.npmrc` file
4. Default values

This means you can temporarily override settings using environment variables without changing the configuration files.

## Notes

### Recommended Configuration Approach

- **Keep .npmrc for:**
    - Standard npm configurations used by npm/node-gyp
    - Global settings not specific to any platform
    - Backward compatibility with existing tools

- **Use config/native-modules.json for:**
    - Platform-specific settings (like Visual Studio version)
    - Node-gyp path customization
    - Settings that vary by operating system

### For Your Users

It is recommended to direct users to modify the native-modules.json file when they need to change Visual Studio version or node-gyp path. The accompanying README provides clear guidance on available options and examples of proper configuration.

This approach gives you the best of both worlds - standard npm configuration plus an improved user experience for the platform-specific settings that are critical for cross-platform compatibility.
