# Windows Build Troubleshooting Guide

This document provides guidance for debugging and fixing Windows-specific build issues for the ContextCraft application.

## Common Issues

### C++20 Compatibility Issues

Tree-sitter native modules require C++20 for compatibility with Electron 34+. Look for these error messages:

```
warning D9025: overriding '/std:c++20' with '/std:c++17'
error C1189: #error: "C++20 or later required."
```

#### Troubleshooting Steps

1. **Verify binding.gyp files**:
   ```
   node scripts/verify-cpp20-bindings.js --verbose
   ```

2. **Patch binding.gyp files**:
   ```
   node scripts/verify-cpp20-bindings.js --patch
   ```

3. **Check environment variables**:
   Ensure these are set correctly:
   ```
   CXXFLAGS: "/std:c++20"
   CXX_FLAGS: "/std:c++20"
   npm_config_msvs_version: "2022"
   npm_config_node_gyp_force_unsupported_msvs_version: "true"
   ```

4. **Visual Studio Version**:
   - Use Visual Studio 2022 or newer for best C++20 support
   - Set environment variable: `npm_config_msvs_version: "2022"`

5. **Manual binding.gyp fix**:
   If automatic patching fails, manually add to `node_modules/tree-sitter/binding.gyp`:
   ```json
   "msvs_settings": {
     "VCCLCompilerTool": {
       "AdditionalOptions": ["/std:c++20"]
     }
   }
   ```

### MSVC Compiler Issues

#### Troubleshooting Steps

1. **Setup Visual Studio Command Line**:
   ```yaml
   - uses: ilammy/msvc-dev-cmd@v1
     with:
       toolset: 14.x
   ```

2. **Rebuild Native Modules**:
   ```
   npm run rebuild-native-modules
   ```

3. **Individual Module Testing**:
   ```
   npm rebuild tree-sitter --verbose
   npm rebuild tree-sitter-javascript --verbose
   ```

### Debugging Tools

#### Node-gyp Debug Output

Get detailed node-gyp information:
```javascript
console.log('node-gyp version:', require('node-gyp/package.json').version);
console.log('C++ flags:', process.env.CXXFLAGS, process.env.CXX_FLAGS);
console.log('MSVC version:', process.env.npm_config_msvs_version);
```

#### Enable Verbose Mode

1. **Verbose rebuild**:
   ```
   npm rebuild tree-sitter --verbose
   ```

2. **Verbose electron-rebuild**:
   ```
   DEBUG=electron-rebuild npm run rebuild-native-modules
   ```

#### Analyze binding.gyp

Examine tree-sitter's binding.gyp for C++17/C++20 conflicts:
```
node -e "console.log(require('fs').readFileSync('node_modules/tree-sitter/binding.gyp', 'utf8'))"
```

## Testing Windows Builds From macOS

Since testing Windows builds directly from macOS is challenging, we use these approaches:

1. **GitHub Actions**:
   - Use matrix testing with multiple Windows versions
   - Add a dedicated test job focusing on tree-sitter modules

2. **Verification Scripts**:
   - Run `verify-cpp20-bindings.js` before builds
   - Focus on catching known failure points

3. **Artifact Analysis**:
   - Upload binding.gyp files as artifacts for offline analysis
   - Capture node-gyp debug output in CI logs

## Advanced Troubleshooting

### Node-gyp Cleanup

If other methods fail, try a clean node-gyp environment:

```
node-gyp clean
rm -rf node_modules
npm cache clean --force
npm install
```

### Multiple Visual Studio Versions

When multiple Visual Studio versions are installed:

1. Explicitly specify which to use:
   ```
   npm config set msvs_version 2022
   ```

2. Force node-gyp to use it:
   ```
   npm config set node_gyp_force_unsupported_msvs_version true
   ```

## References

- [electron-rebuild documentation](https://github.com/electron/electron-rebuild)
- [node-gyp documentation](https://github.com/nodejs/node-gyp)
- [tree-sitter issues related to C++20](https://github.com/tree-sitter/tree-sitter/issues) 