# macOS Build Troubleshooting Guide

This document provides guidance for troubleshooting issues with macOS DMG file generation in the ContextCraft application, particularly in GitHub Actions CI/CD environments.

## Common Issue: Missing DMG Files in Releases

A common issue is that DMG files may not be generated in the GitHub Actions workflow, despite being successfully created in local development environments. Here are the most common causes and solutions:

### 1. Code Signing Configuration

DMG file creation often requires proper code signing to work correctly:

- **Local Development**: You can build DMG files locally without Apple Developer credentials by disabling code signing
- **CI/CD Environment**: GitHub Actions requires proper Apple Developer credentials to be configured as secrets

#### Testing Without Code Signing (Local Development Only)

```bash
# Run the macOS build with code signing disabled
npm run test-build:mac-no-sign
```

#### Setting Up Code Signing in GitHub Actions

Required secrets in GitHub repository:

1. `APPLE_ID`: Your Apple Developer account email
2. `APPLE_APP_SPECIFIC_PASSWORD`: An app-specific password for your Apple ID
3. `APPLE_TEAM_ID`: Your Apple Developer Team ID
4. `CSC_LINK`: Base64-encoded Developer ID certificate (p12 file)
5. `CSC_KEY_PASSWORD`: Password for the p12 certificate

### 2. Explicit DMG Target Configuration

Make sure the package.json has DMG explicitly included in the target configuration:

```json
"mac": {
  "category": "public.app-category.developer-tools",
  "icon": "public/favicon.icns",
  "target": [
    "dmg",
    "zip"
  ],
  "hardenedRuntime": true,
  "gatekeeperAssess": false,
  "entitlements": "build/entitlements.mac.plist",
  "entitlementsInherit": "build/entitlements.mac.plist"
}
```

### 3. Running Diagnostics

If you're encountering issues, use the diagnostics script to check your environment:

```bash
# Run the diagnostics script
npm run diagnose-mac
```

This will check:
- System and Node.js version
- Code signing environment
- macOS developer tools installation
- Electron builder cache
- Package.json configuration
- Build directory contents

### 4. Complete Build Testing

For a full test of the build process with detailed logs:

```bash
# Full test with diagnostics and logging
npm run test-build:mac-full
```

This will:
1. Run diagnostics first
2. Clean up existing builds
3. Build with default settings
4. Check for artifacts
5. Run diagnostics again if DMG files aren't created
6. Generate a detailed log file

### 5. Debugging GitHub Actions

The GitHub workflow has been enhanced with additional diagnostic steps:

1. Verification of Apple signing credentials before the build
2. Running the diagnostics script before the build
3. Explicit checks for generated DMG files
4. Additional diagnostics when DMG files are missing

If issues persist in GitHub Actions, check:
- The workflow run logs for detailed error messages
- Ensure all required secrets are properly configured
- Verify that electron-builder version is up to date

## Potential Issues and Fixes

| Issue | Likely Cause | Solution |
|-|-|-|
| DMG files missing in GitHub Actions builds | Missing or incorrect Apple Developer credentials | Set up GitHub repository secrets properly |
| DMG files missing even with code signing | Incorrect target configuration | Explicitly include "dmg" in the target array |
| Error "No identity found" | Code signing enabled but credentials missing | Either provide credentials or disable signing with `--skip-signing` |
| hdiutil errors | macOS system tool issues in CI | Check if hdiutil works properly in the diagnostic output |
| DMG works locally but not in CI | Environment differences | Use `diagnose-build.js` script to identify differences |
| Build fails with notarization errors | Missing Apple ID or specific password | Configure all Apple credentials correctly |

## Additional Resources

- [Electron Builder Code Signing](https://www.electron.build/code-signing)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Apple Developer Account Management](https://developer.apple.com/account/) 