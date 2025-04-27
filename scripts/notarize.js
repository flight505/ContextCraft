module.exports = async function (params) {
  // Only notarize the app on Mac OS
  if (process.platform !== 'darwin') {
    console.log('Skipping notarization: Not macOS platform');
    return;
  }

  // Skip notarization if code signing is explicitly disabled
  if (process.env.CSC_IDENTITY_AUTO_DISCOVERY === 'false') {
    console.log('Skipping notarization: Code signing is disabled (CSC_IDENTITY_AUTO_DISCOVERY=false)');
    return;
  }

  console.log('Notarizing macOS application...');

  const path = require('path');
  const appBundleId = 'com.contextcraft.app';
  const appPath = path.join(
    params.appOutDir,
    `${params.packager.appInfo.productFilename}.app`
  );

  if (!process.env.APPLE_ID || !process.env.APPLE_APP_SPECIFIC_PASSWORD || !process.env.APPLE_TEAM_ID) {
    console.warn('Required environment variables missing for notarization. Set:');
    console.warn('- APPLE_ID: Your Apple ID email');
    console.warn('- APPLE_APP_SPECIFIC_PASSWORD: App-specific password');
    console.warn('- APPLE_TEAM_ID: Your Apple Team ID');
    
    // Don't fail the build if we're in CI, just skip notarization
    if (process.env.CI === 'true' || process.env.CI === true) {
      console.log('CI environment detected - skipping notarization');
      return;
    }
    return;
  }

  try {
    console.log(`Notarizing application at: ${appPath}`);
    console.log(`Using Apple ID: ${process.env.APPLE_ID}`);
    console.log(`Using Team ID: ${process.env.APPLE_TEAM_ID}`);
    
    // Use dynamic import for ESModule compatibility
    const { notarize } = await import('@electron/notarize');
    
    await notarize({
      appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });
    
    console.log(`✅ Successfully notarized ${appPath}`);
  } catch (error) {
    console.error('❌ Notarization failed:', error);
    
    // Don't fail the build if we're in CI, just log the error
    if (process.env.CI === 'true' || process.env.CI === true) {
      console.log('CI environment detected - continuing despite notarization failure');
      return;
    }
    
    throw error;
  }
}; 