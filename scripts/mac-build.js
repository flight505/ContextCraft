/**
 * Helper script for macOS builds
 * Ensures proper C++ standard is used for native modules
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create release-builds directory if it doesn't exist
const releaseBuildsDir = path.join(process.cwd(), 'release-builds');
if (!fs.existsSync(releaseBuildsDir)) {
  fs.mkdirSync(releaseBuildsDir, { recursive: true });
}

console.log('Starting macOS build process...');

// Parse command line arguments
const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');
const skipSigning = args.includes('--skip-signing');

// Check for Apple Developer ID credentials
const hasAppleId = process.env.APPLE_ID && process.env.APPLE_APP_SPECIFIC_PASSWORD && process.env.APPLE_TEAM_ID;
const hasCSCLink = process.env.CSC_LINK && process.env.CSC_KEY_PASSWORD;
const hasCredentials = hasAppleId || hasCSCLink;

// Log the signing state
console.log(`Code signing ${skipSigning ? 'disabled' : 'enabled'}`);
console.log(`Apple ID credentials: ${hasAppleId ? 'available' : 'missing'}`);
console.log(`CSC_LINK credentials: ${hasCSCLink ? 'available' : 'missing'}`);

if (!skipSigning && !hasCredentials) {
  console.warn('\n⚠️ Warning: No code signing credentials found but --skip-signing not specified.');
  console.warn('This may prevent DMG creation or cause Gatekeeper issues on macOS.\n');
}

// Build Vite app first
console.log('Building Vite app...');
execSync('npm run build', { stdio: 'inherit' });

// Generate the electron-builder command
let buildCmd = 'electron-builder --mac';

// Add target flags (ensuring dmg is explicitly included)
buildCmd += ' --x64 --arm64 -c.mac.target=dmg,zip';

// Add publishing option
buildCmd += ' --publish=never';

// Skip signing if requested
if (skipSigning) {
  buildCmd += ' -c.mac.identity=null --skip-signing';
  
  // Ensure we don't try to notarize either
  process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
}

// Add --verbose if requested
if (isVerbose) {
  buildCmd += ' --verbose';
}

// Add debug logging for electron-builder
process.env.DEBUG = 'electron-builder';

// Execute the command
console.log(`Executing: ${buildCmd}`);
try {
  execSync(buildCmd, { stdio: 'inherit' });
  
  // Check if DMG file was created
  console.log('\nChecking for generated DMG files:');
  const releaseFiles = fs.readdirSync(releaseBuildsDir);
  const dmgFiles = releaseFiles.filter(file => file.endsWith('.dmg'));
  const zipFiles = releaseFiles.filter(file => file.endsWith('.zip'));
  
  if (dmgFiles.length > 0) {
    console.log('✅ DMG files created successfully:');
    dmgFiles.forEach(file => console.log(`  - ${file}`));
  } else {
    console.error('❌ No DMG files were created!');
    if (zipFiles.length > 0) {
      console.log('ZIP files were created:');
      zipFiles.forEach(file => console.log(`  - ${file}`));
    }
    
    // Check package.json configuration
    console.log('\nVerifying package.json mac target configuration:');
    const packageJson = require('../package.json');
    console.log(JSON.stringify(packageJson.build.mac, null, 2));
    
    // Provide potential troubleshooting info
    console.log('\nPotential issues:');
    if (!skipSigning && !hasCredentials) {
      console.log('- Code signing was enabled but no credentials were provided');
      console.log('  Try running with --skip-signing for local builds');
    }
    if (skipSigning) {
      console.log('- Some macOS versions may require signing for DMG creation');
      console.log('  Consider providing signing credentials');
    }
  }
  
  console.log('\nAll build files in release-builds:');
  fs.readdirSync(releaseBuildsDir).forEach(file => console.log(`  - ${file}`));
  
} catch (error) {
  console.error('Build failed:', error.message);
  // Get the detailed error output
  console.error('\nDetailed error information:');
  console.error(error.toString());
  process.exit(1);
}

console.log('macOS build process completed.'); 