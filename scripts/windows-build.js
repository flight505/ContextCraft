/**
 * Helper script for Windows builds
 * Handles packaging and electron-builder for Windows platform
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    console.log('🔧 Starting Windows build...');
    
    // Log environment variables for debugging
    console.log('📋 Using environment variables from workflow:');
    console.log(`   - CXXFLAGS: ${process.env.CXXFLAGS || 'not set'}`);
    console.log(`   - GYP_MSVS_VERSION: ${process.env.GYP_MSVS_VERSION || 'not set'}`);
    console.log(`   - PYTHON: ${process.env.PYTHON || 'not set'}`);
    
    // We're using the workflow env vars directly, without overriding them
    
    // Path to electron-builder binary
    const electronBuilderPath = path.join(process.cwd(), 'node_modules', '.bin', 'electron-builder');
    
    // Run the build command with workflow-provided environment
    console.log('📦 Packaging Windows app with electron-builder...');
    execSync(`"${electronBuilderPath}" --win --publish=never`, { 
      stdio: 'inherit',
      // Use process.env directly - environment variables from the workflow
    });
    
    console.log('✅ Windows build completed successfully!');
  } catch (error) {
    console.error('❌ Windows build failed:', error.message);
    process.exit(1);
  }
}

main(); 