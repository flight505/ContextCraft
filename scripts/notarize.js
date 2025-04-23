const { notarize } = require('@electron/notarize');
const path = require('path');

module.exports = async function (params) {
  // Only notarize the app on Mac OS
  if (process.platform !== 'darwin') {
    return;
  }

  console.log('Notarizing macOS application...');

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
    return;
  }

  try {
    await notarize({
      appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });
  } catch (error) {
    console.error('Notarization failed:', error);
    throw error;
  }

  console.log(`Successfully notarized ${appPath}`);
}; 