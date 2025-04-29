#!/usr/bin/env node

/**
 * Test script to verify that all critical modules load correctly.
 * This is helpful for debugging module loading issues.
 */

console.log('🔍 Testing module loading...\n');

// List of modules to test
const modulesToTest = [
  'chokidar',
  'minimatch',
  'tree-sitter',
  'tree-sitter-javascript',
  'tree-sitter-typescript',
  'tree-sitter-python',
  'tree-sitter-css',
  'tree-sitter-html',
  'jsdom',
  'dompurify',
  'tiktoken',
  'ignore',
  'micromatch',
  'readdirp',
  'fsevents'
];

// Mock production/development mode
const isProduction = process.argv.includes('--production');
console.log(`Testing in ${isProduction ? 'production' : 'development'} mode\n`);

// Test each module
const results = {
  success: [],
  failed: [],
  skipped: []
};

modulesToTest.forEach(moduleName => {
  // Skip chokidar in production mode
  if (isProduction && moduleName === 'chokidar') {
    console.log(`⏭️  Skipping ${moduleName} in production mode (by design)`);
    results.skipped.push(moduleName);
    return;
  }
  
  try {
    const module = require(moduleName);
    console.log(`✅ Successfully loaded ${moduleName}`);
    results.success.push(moduleName);
  } catch (err) {
    console.error(`❌ Failed to load ${moduleName}: ${err.message}`);
    results.failed.push(moduleName);
  }
});

// Print summary
console.log('\n📊 Module Loading Summary:');
console.log(`✅ Successfully loaded: ${results.success.length} modules`);
console.log(`❌ Failed to load: ${results.failed.length} modules`);
console.log(`⏭️  Skipped: ${results.skipped.length} modules`);

// Print details for failures
if (results.failed.length > 0) {
  console.log('\n🔍 Failed modules:');
  results.failed.forEach(moduleName => {
    console.log(`  - ${moduleName}`);
  });
  
  console.log('\n📋 Troubleshooting suggestions:');
  console.log('1. Run `npm install` to ensure all dependencies are installed');
  console.log('2. Run `npm run rebuild-native-modules` to rebuild native modules');
  console.log('3. Check for version compatibility issues');
  
  process.exit(1);
} else {
  console.log('\n✨ All required modules loaded successfully!');
} 