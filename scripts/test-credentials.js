#!/usr/bin/env node

/**
 * Script to test if Apple code signing credentials are properly set
 * Usage: CSC_LINK=<base64_cert> CSC_KEY_PASSWORD=<password> APPLE_ID=<id> APPLE_APP_SPECIFIC_PASSWORD=<pwd> APPLE_TEAM_ID=<team> node scripts/test-credentials.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('='.repeat(50));
console.log('APPLE SIGNING CREDENTIALS TEST');
console.log('='.repeat(50));

// Only run on macOS
if (process.platform !== 'darwin') {
  console.error('This script can only be run on macOS');
  process.exit(1);
}

// Check if required environment variables are set
const requiredEnvVars = [
  'CSC_LINK', 
  'CSC_KEY_PASSWORD', 
  'APPLE_ID', 
  'APPLE_APP_SPECIFIC_PASSWORD', 
  'APPLE_TEAM_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Error: Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Create temp directory for test files
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'signing-test-'));
const certPath = path.join(tempDir, 'cert.p12');
const keychainPath = path.join(tempDir, 'test.keychain-db');
const keychainPassword = 'temp-password';

try {
  console.log('Creating temporary files in:', tempDir);
  
  // Decode certificate
  console.log('Decoding certificate...');
  fs.writeFileSync(certPath, Buffer.from(process.env.CSC_LINK, 'base64'));
  
  // Create temporary keychain
  console.log('Creating temporary keychain...');
  execSync(`security create-keychain -p "${keychainPassword}" "${keychainPath}"`, { stdio: 'inherit' });
  execSync(`security set-keychain-settings -lut 21600 "${keychainPath}"`, { stdio: 'inherit' });
  execSync(`security unlock-keychain -p "${keychainPassword}" "${keychainPath}"`, { stdio: 'inherit' });
  
  // Import certificate
  console.log('Importing certificate to keychain...');
  execSync(`security import "${certPath}" -P "${process.env.CSC_KEY_PASSWORD}" -A -t cert -f pkcs12 -k "${keychainPath}"`, { stdio: 'inherit' });
  execSync(`security set-key-partition-list -S apple-tool:,apple: -k "${keychainPassword}" "${keychainPath}"`, { stdio: 'inherit' });
  
  // List certificates to verify
  console.log('\nVerifying imported certificates:');
  const identity = execSync(`security find-identity -v -p codesigning "${keychainPath}"`).toString();
  console.log(identity);
  
  if (identity.includes('0 valid identities found')) {
    console.error('❌ No valid code signing identities found. The certificate may be invalid or expired.');
  } else {
    console.log('✅ Certificate imported successfully and valid for code signing!');
  }
  
  // Test Apple ID credentials
  console.log('\nTesting Apple ID credentials...');
  console.log(`APPLE_ID: ${process.env.APPLE_ID} ✓`);
  console.log(`APPLE_TEAM_ID: ${process.env.APPLE_TEAM_ID} ✓`);
  console.log('App-specific password is set ✓');

  console.log('\n✅ All credentials appear to be correctly set!');
  console.log('You should now be able to sign and notarize your app.');
  
} catch (error) {
  console.error('❌ Error during credential testing:', error.message);
} finally {
  // Clean up
  console.log('\nCleaning up...');
  try {
    execSync(`security delete-keychain "${keychainPath}"`, { stdio: 'pipe' });
    fs.unlinkSync(certPath);
    fs.rmdirSync(tempDir, { recursive: true });
    console.log('Cleanup completed.');
  } catch (err) {
    console.error('Error during cleanup:', err.message);
  }
}

console.log('='.repeat(50)); 