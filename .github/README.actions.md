# GitHub Actions Workflows

This directory contains GitHub Actions workflows for building and releasing the Electron application.

## Workflows

### `build.yml`

This workflow builds the Electron application for all platforms (macOS, Windows, and Linux) when a Git tag starting with `v` is pushed. It creates a draft release on GitHub with all the built artifacts.

#### How to use

1. Make sure your code is ready for release
2. Create a tag with the version number:
   ```bash
   git tag v1.0.0
   ```
3. Push the tag to GitHub:
   ```bash
   git push origin v1.0.0
   ```
4. GitHub Actions will automatically build the application for all platforms and create a draft release
5. Go to the GitHub repository's "Releases" page to find the draft release
6. Review the release and publish it when ready

### `release.yml`

This is an advanced workflow with code signing capabilities. To use it:

1. Update the workflow file with your code signing secrets
2. Set up the following secrets in your GitHub repository:
   - `MACOS_CERTIFICATE`: Base64-encoded macOS signing certificate
   - `MACOS_CERTIFICATE_PWD`: Password for the macOS certificate
   - `KEYCHAIN_PWD`: Password for the temporary keychain
   - `APPLE_ID`: Your Apple ID for notarization
   - `APPLE_APP_SPECIFIC_PASSWORD`: App-specific password for your Apple ID
   - `TEAM_ID`: Your Apple Developer Team ID
   - `WINDOWS_CERTIFICATE`: Base64-encoded Windows signing certificate
   - `WINDOWS_CERTIFICATE_PWD`: Password for the Windows certificate

## Tips

- These workflows use caching to speed up subsequent builds
- The default configuration creates draft releases, so you can review before publishing
- If you only want to build for specific platforms, modify the `matrix.os` section in the workflow
