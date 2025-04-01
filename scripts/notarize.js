/* eslint-disable @typescript-eslint/no-var-requires */
const { notarize } = require("@electron/notarize");
const fs = require("fs");
const path = require("path");

// This script is called by electron-builder after signing the app
// It's used for notarizing macOS applications

module.exports = async function (params) {
  // Only notarize the app on macOS and when publishing (not during development)
  if (process.platform !== "darwin" || !process.env.NOTARIZE) {
    console.log(
      "Skipping notarization: Not on macOS or NOTARIZE env var not set",
    );
    return;
  }

  console.log("Notarizing macOS application...");

  // Get necessary app information from package.json
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"),
  );
  const appId = pkg.build.appId;

  // Path to the packaged app
  const appPath = path.join(
    params.appOutDir,
    `${params.packager.appInfo.productFilename}.app`,
  );

  if (!fs.existsSync(appPath)) {
    console.error(`Cannot find application at: ${appPath}`);
    return;
  }

  try {
    // Check for required environment variables
    if (!process.env.APPLE_ID || !process.env.APPLE_APP_SPECIFIC_PASSWORD) {
      console.error("Missing required environment variables for notarization:");
      console.error("- APPLE_ID: Your Apple ID");
      console.error("- APPLE_APP_SPECIFIC_PASSWORD: An app-specific password");
      console.error("- TEAM_ID: Your Apple Developer Team ID");
      console.error("Please set these environment variables and try again.");
      return;
    }

    // Notarize the app
    await notarize({
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
      teamId: process.env.TEAM_ID,
    });

    console.log(`Successfully notarized ${appPath}`);
  } catch (error) {
    console.error(`Notarization failed: ${error.message}`);
    throw error;
  }
};
